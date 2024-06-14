import json
from datetime import datetime


class CepEvent:
    """ Class representing a complex event. """
    def __init__(self, start: datetime, end: datetime) -> None:
        self.start = start
        self.end = end


    def _serialize(self):
        """ Returns the event in dictionary format. """
        return {
            'start': self.start.timestamp(),
            'end': self.end.timestamp(),
        }


    def to_json(self):
        """ Returns the event serialized into a JSON string. """
        return json.dumps(self._serialize())


    def __str__(self) -> str:
        return 'CepEvent(' + \
            f'\tstart = {self.start},' + \
            f'\tend = {self.end}' + \
        ')'
