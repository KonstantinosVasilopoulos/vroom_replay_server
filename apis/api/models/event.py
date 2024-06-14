import json
from datetime import datetime

from .event_types import EventTypes


class Event:
    """ Superclass for all event types. """
    def __init__(self, car_id: str, start: datetime, end: datetime, event_type: EventTypes) -> None:
        self.car_id = car_id
        self.start = start
        self.end = end
        self.event_type = event_type


    def _serialize(self):
        """ Returns the event in dictionary format. """
        return {
            'car_id': self.car_id,
            'start': self.start.timestamp(),
            'end': self.end.timestamp(),
            'event_type': self.event_type.value,
        }


    def to_json(self):
        """ Returns the event serialized into a JSON string. """
        return json.dumps(self._serialize())


    def __str__(self) -> str:
        return 'Event(' + \
            f'\tcar_id = {self.car_id}, ' + \
            f'\tstart = {self.start},' + \
            f'\tend = {self.end},' + \
            f'\tevent_type = {self.event_type.value}' + \
        ')'
