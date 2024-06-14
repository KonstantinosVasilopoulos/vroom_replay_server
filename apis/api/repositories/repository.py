import influxdb_client
from datetime import datetime
from influxdb_client.client.flux_table import TableList

from settings import Settings


class Repository:
    """
    Base class for accessing influxDB.
    """
    _settings = Settings()


    def __init__(self, query_api: influxdb_client.QueryApi) -> None:
        self.query_api = query_api

        # Initialize base query and filter
        self._base_query = f'from(bucket: "{Repository._settings.bucket}")'
        self._base_filter = f'|> filter(fn: (r) => r["_measurement"] == "{Repository._settings.measurement}")'


    def query(self, start: datetime, end: datetime, filters: list[str] = None) -> TableList:
        """ Query influxDB using the influxDB client library and return the result. """
        query = self._create_query(start, end, filters)
        self._settings.logger.debug(query)
        try:
            result = self.query_api.query(query)
        except:
            result = TableList()

        return result


    def _create_range_filter(self, start: datetime, end: datetime) -> str:
        """ Creates the range filter for the influxDB query. """
        start_str = start.strftime(Repository._settings.ISO_8601_PATTERN)
        end_str = end.strftime(Repository._settings.ISO_8601_PATTERN)
        return f'|> range(start: {start_str}, stop: {end_str})'


    def _create_query(self, start: datetime, end: datetime, filters: list[str] = None) -> str:
        """ Creates the final query to access influxDB. """
        final_query = f'{self._base_query}\n\t{self._create_range_filter(start, end)}\n\t{self._base_filter}'

        # Append additional filters if there are any
        if filters is not None:
            for filter in filters:
                final_query += f'\n\t{filter}'

        return final_query
