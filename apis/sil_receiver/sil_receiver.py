import logging
import sys
import asyncio
import websockets
from dotenv import dotenv_values

from message_parser import MessageParser
from total_message import TotalMessage


# Load configuration
config = dotenv_values('.env')

# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter("%(levelname)s: %(asctime)s %(message)s")
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)

parser = MessageParser()
data = []

async def receive_sil():
    """ Receives telemetry data from SIL API. """
    key = input('Enter a message to send to the server: ')  # -0
    ws_endpoint = f'ws://{config["SIL_API_WS_ENDPOINT"]}/handle_sil?key={key}'
    async with websockets.connect(ws_endpoint, ping_interval=20) as websocket:
        logger.info(f'Opened websocket to SIL API at {ws_endpoint}')

        # Wait for telemetry data
        while True:
            response = await websocket.recv()
            logger.debug(f'Received from server: {response}')

            # Terminate in case of FIN message
            if response == 'FIN':
                # await websocket.close(reason='Received FIN message')
                break

            # Parse message into a TotalMessage class instance
            data.append(parser.parse(response[1:]))

            # Send ACK response
            i = response[0]
            await websocket.send('ACK' + i)
            logger.info(f'Sent ACK{i}')

asyncio.get_event_loop().run_until_complete(receive_sil())
