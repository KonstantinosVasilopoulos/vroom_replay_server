import json
from datetime import datetime, timezone
from typing import Iterable
from influxdb_client import QueryApi

from repositories import Repository
from models import Event, LowFpsEvent


class EventsRepository(Repository):
    """
    Repository class for the Message model.
    """
    _epoch_to_datetime = lambda self, epoch: datetime.fromtimestamp(epoch / 1000.0, timezone.utc)

    def __init__(self, query_api: QueryApi) -> None:
        super().__init__(query_api)


    def query(self, start: datetime, end: datetime) -> Iterable[Event]:
        """ Query influxDB for the messages. """
        # Add filters for message field and timestamp
        filters = [
            f'|> filter(fn: (r) => r._field == "event")',
            f'|> keep(columns: ["_measurement", "_time", "_value", "type"])',
        ]

        # Add event measurement filters in base filter
        self._base_filter = f'|> filter(fn: (r) => '
        for i, event_type in enumerate(self._settings.EVENT_TYPES):
            if i == 0:
                self._base_filter += f'r._measurement == "{event_type.value}"'
            else:
                self._base_filter += f' or r._measurement == "{event_type.value}"'

        self._base_filter += ')'

        # Retrieve events from influxDB
        results = super().query(start, end, filters)

        # Convert results to Event class instances
        for table in results:
            for row in table:
                parsed_event = json.loads(row['_value'])
                row_start = self._epoch_to_datetime(parsed_event['start'])
                row_end = self._epoch_to_datetime(parsed_event['end'])

                # Find the event type
                found_type = None
                for event_type in self._settings.EVENT_TYPES:
                    if event_type.value == row.get_measurement():
                        found_type = event_type

                # Handle low FPS events independently
                if 'type' in row.values:
                    # Find the low FPS sub-type
                    found_subtype = None
                    for subtype in self._settings.LOW_FPS_SUBTYPES:
                        if subtype.value == row['type']:
                            found_subtype = subtype

                    yield LowFpsEvent(parsed_event['carId'], row_start, row_end, found_type, found_subtype)

                else:
                    yield Event(parsed_event['carId'], row_start, row_end, found_type)
