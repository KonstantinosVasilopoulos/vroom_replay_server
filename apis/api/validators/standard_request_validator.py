import influxdb_client
from datetime import datetime
from fastapi import HTTPException, status

from settings import Settings


class StandardRequestValidator:
    """ Class validating SIL and Events API requests. """
    _settings = Settings()

    def __init__(self, query_api: influxdb_client.QueryApi, car_id: str, start: datetime, end: datetime) -> None:
        self.query_api = query_api
        self.car_id = car_id
        self.start = start
        self.end = end


    def validate_params(self) -> None:
        """ Validates datetime query parameters. """
        # Ensure that `start` is before `end`
        if self.start >= self.end:
            warning_msg = f'Invalid datatime parameters: start >= end ({self.start} >= {self.end})'
            StandardRequestValidator._settings.logger.warning(warning_msg)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=warning_msg,
            )


    def ensure_data_exist(self) -> None:
        """ Searches influxDB for telemetry data. Raises error if no telemetry data were found. """
        # Create Flux query
        start_str = self.start.strftime(StandardRequestValidator._settings.ISO_8601_PATTERN)
        end_str = self.end.strftime(StandardRequestValidator._settings.ISO_8601_PATTERN)
        query = f'from(bucket: "{StandardRequestValidator._settings.bucket}")\n\
            |> range(start: {start_str}, stop: {end_str})\n\
            |> filter(fn: (r) => r["_measurement"] == "{StandardRequestValidator._settings.measurement}")\n\
            |> keep(columns: ["carId"])\n\
            |> group(columns: ["carId"])\n\
            |> distinct(column: "carId")'
        StandardRequestValidator._settings.logger.debug(f'Find telemetry data query: {query}')

        # Query influxDB
        car_ids = self.query_api.query(query, org=StandardRequestValidator._settings.org)
        found = False
        for table in car_ids:
            for record in table:
                if self.car_id == record.get_value():
                    found = True
                    break

        # Return an HTTP 404 code if the car ID does not exists in the database
        if not found:
            warning_msg = f'Car ID "{self.car_id}" not found in the requested timespan {self.start} - {self.end}'
            StandardRequestValidator._settings.logger.warning(warning_msg)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=warning_msg,
            )
