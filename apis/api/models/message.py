from datetime import datetime


class Message:
    """
    The canonical form of telemetry data without the additional field. It represents the telemetry data received by the vehicles.
    """
    def __init__(self, insertion_time: datetime, message: str) -> None:
        self.insertion_time = insertion_time
        self.message = message


    def __str__(self) -> str:
        return 'Message(' + \
            f'\tinsertion_time = {self.insertion_time}, ' + \
            f'\tmessage = {self.message}' + \
        ')'
