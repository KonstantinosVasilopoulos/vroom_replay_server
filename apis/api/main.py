import uuid
import threading
import influxdb_client
from datetime import datetime, timedelta, timezone
from time import sleep
from asyncio import wait_for
from asyncio.exceptions import TimeoutError as ATimeoutError
from typing import Annotated
from fastapi import FastAPI, Query, status, WebSocket
from starlette.websockets import WebSocketDisconnect

from settings import Settings
from validators.standard_request_validator import StandardRequestValidator
from repositories import MessageRepository, EventsRepository
from encoders import VroomTotalEncoder
from sil_request import SilRequest
from models import Event
from cep import CepFinder
from connection_manager import ConnectionManager


app = FastAPI()
settings = Settings()
requests: list[SilRequest] = []
lock = threading.Lock()
connection_manager = ConnectionManager()

# Connect to influxDB
client = influxdb_client.InfluxDBClient(
    url=settings.influxdb_url,
    token=settings.influxdb_token,
    org=settings.org,
)
query_api = client.query_api()


@app.get('/sil', status_code=status.HTTP_202_ACCEPTED)
async def sil_request(
    car_id: Annotated[str, Query(title='Car ID', max_length=50)],
    start: Annotated[datetime, Query(title='Start')],
    end: Annotated[datetime, Query(title='End')],
):
    """ Replies to requests for SIL playback. """
    settings.logger.info(f'Received GET request: car_id={car_id}, from={start}, end={end}')

    # Convert datetimes to UTC timezone
    start = start.replace(tzinfo=timezone.utc)
    end = end.replace(tzinfo=timezone.utc)

    # Validate URL parameters
    validator = StandardRequestValidator(query_api, car_id, start, end)
    validator.validate_params()

    # Find whether telemetry data for the car ID exists in the provided time range
    validator.ensure_data_exist()

    # Create SIL request
    key = str(uuid.uuid4())
    params = {
        'car_id': car_id,
        'start': start,
        'end': end,
    }
    with lock:  # Thread lock to avoid concurrency issues while modifying the `requests` list
        requests.append(SilRequest(key, params))

    return {'key': key}


@app.websocket('/handle_sil')
async def sil_websocket(websocket: WebSocket, key=Annotated[str, Query(title='Key')]):
    """ Streams telemetry data for SIL playback. """
    await websocket.accept()
    settings.logger.info(f'Received SIL request with key "{key}"')

    # Retrieve SIL request metadata
    params = None
    with lock:
        # Search for request
        to_remove = None
        for i, r in enumerate(requests):
            if r.key == key:
                params = r.params.copy()
                to_remove = i
                break

        # Handle unvalidated requests
        if to_remove is None:
            await websocket.close()
            settings.logger.warning(f'Closed unvalidated request with key "{key}"')
            return

        settings.logger.info(f'Accepted SIL request with key "{key}"')

        # Remove request from requests list since it is about to be processed
        requests.pop(to_remove)

    # Get the canonic total message from influxDB
    message_repo = MessageRepository(query_api)
    messages = message_repo.query(params['start'], params['end'])

    # Encode telemetry data
    encoded_messages = VroomTotalEncoder().bulk_encode(messages)

    # Send the first message
    msg = next(encoded_messages)
    previous_timestamp = msg.insertion_time
    await websocket.send_text('0' + msg.message)

    # Stream telemetry data
    i = 0
    for msg in encoded_messages:
        # Wait for ACK message
        try:
            ack = await websocket.receive_text()
        except WebSocketDisconnect:
            settings.logger.info(f'Websocket disconnected for SIL request with key {key}')
            return

        if ack != f'ACK{i}':
            settings.logger.warning(f'Stopped SIL request with key {key} due to incorrect ACK: {ack} instead of ACK{i}')
            break

        settings.logger.info(f'Received correct ACK: {ack}')

        # Limit i to 0-9
        if i == 9:
            i = 0
        else:
            i += 1
        await websocket.send_text(str(i) + msg.message)

    # Close the connection by sending a FIN message
    await websocket.send_text('FIN')
    settings.logger.info(f'Sent FIN message for SIL request with key {key}')


@app.websocket('/events')
async def events_request(
    websocket: WebSocket,
    car_id: Annotated[str, Query(title='Car ID', max_length=50)],
):
    """ Returns events within the request's parameter range. """
    await connection_manager.connect(websocket)
    settings.logger.info(f'Received Events request: car_id={car_id}')

    # Continuously search for and transmit events
    events_repository = EventsRepository(query_api)
    end = datetime.now(timezone.utc)
    start = end - timedelta(seconds=settings.events_api_start_offset_secs)
    while True:
        events: list[Event] = events_repository.query(start, end)

        # Stream events to the client
        for event in events:
            try:
                await connection_manager.send_personal_message(event.to_json(), websocket)

                # Wait for ACK
                ack = await websocket.receive_text()
                if ack != 'ACK':
                    await websocket.close()
                    connection_manager.disconnect(websocket)
                    return

            except WebSocketDisconnect:
                connection_manager.disconnect(websocket)
                return

        is_connected = await ping(websocket)
        if not is_connected:
            connection_manager.disconnect(websocket)
            return

        sleep(settings.events_api_stream_interval_secs)

        start = end + timedelta(milliseconds=1)
        end = datetime.now(timezone.utc)


@app.websocket('/cep')
async def cep_request(
    websocket: WebSocket,
    car_id: Annotated[str, Query(title='Car ID', max_length=50)],
    regex: Annotated[str, Query(title='Regex', max_length=50)],
):
    """ Identifies and returns complex events. """
    await connection_manager.connect(websocket)
    settings.logger.info(f'Received CEP GET request: car_id={car_id}, regex={regex}')

    events_repository = EventsRepository(query_api)
    cep_finder = CepFinder()

    # Continuously identify complex events
    end = datetime.now(timezone.utc)
    start = end - timedelta(seconds=settings.cep_api_start_offset_secs)
    while True:
        # Find all events within the start and end timestamps
        events = events_repository.query(start, end)
        complex_events = cep_finder.identify_compex_events(events, regex)

        # Filter out old events
        current_time = datetime.now(timezone.utc)
        filtered_events = list(filter(lambda e: e.start > current_time - timedelta(seconds=settings.cep_api_display_offset_secs), complex_events))

        # Serialize events for displaying in a chart
        results = []
        interval = 5.0
        current_time = current_time.timestamp()
        t = current_time - settings.cep_api_display_offset_secs
        while t < current_time:  # Iterate from current time - offset to current time
            # Find if an event exists withing the current time-span (t, t + interval)
            event_exists = 0
            for event in filtered_events:
                if t >= event.start.timestamp() and t <= event.end.timestamp():
                    event_exists = 1
                    break

            results.append({
                'name': t,
                regex: event_exists,
            })

            t += interval

        # Send serialized complex events
        try:
            await websocket.send_json(results)

            # Wait for ACK
            ack = await websocket.receive_text()
            if ack != 'ACK':
                await websocket.close()
                connection_manager.disconnect(websocket)
                return

        except WebSocketDisconnect:
            settings.logger.info('Websocket disconnected for CEP')
            connection_manager.disconnect(websocket)
            return

        is_connected = await ping(websocket)
        if not is_connected:
            connection_manager.disconnect(websocket)
            return

        sleep(settings.cep_api_stream_interval_secs)

        end = datetime.now(timezone.utc)


async def ping(websocket: WebSocket) -> bool:
    """ Pings the websocket client and terminates if no answer is received. """
    try:
        await websocket.send_text('PING')
        ack = websocket.receive_text()
        await wait_for(ack, timeout=settings.api_timeout_secs)
    except ATimeoutError:
        await websocket.close()
        return False
    except WebSocketDisconnect:
        return False

    return True
