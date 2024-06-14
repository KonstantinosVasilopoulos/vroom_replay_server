from datetime import datetime
from typing import Iterable
from influxdb_client import QueryApi

from repositories import Repository
from models import Message


class MessageRepository(Repository):
    """
    Repository class for the Message model.
    """
    def __init__(self, query_api: QueryApi) -> None:
        super().__init__(query_api)


    def query(self, start: datetime, end: datetime) -> Iterable[Message]:
        """ Query influxDB for the messages. """
        # Add filters for message field and timestamp
        filters = [
            f'|> filter(fn: (r) => r._field == "message")',
            f'|> keep(columns: ["_time", "_value"])',
        ]
        results = super().query(start, end, filters)

        # Convert results to Message class instances
        for table in results:
            for row in table:
                yield Message(insertion_time=row['_time'], message=row['_value'])
