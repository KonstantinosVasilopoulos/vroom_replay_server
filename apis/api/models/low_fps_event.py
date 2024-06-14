from datetime import datetime

from .event import Event
from .event_types import EventTypes
from .low_fps_types import LowFpsTypes


class LowFpsEvent(Event):
    """ Class representing Low FPS events. """
    def __init__(self, car_id: str, start: datetime, end: datetime, event_type: EventTypes, low_fps_type: LowFpsTypes) -> None:
        super().__init__(car_id, start, end, event_type)
        self.low_fps_type = low_fps_type        


    def _serialize(self):
        """ Returns the event in dictionary format. """
        dictionary = super()._serialize()
        dictionary['low_fps_type'] = self.low_fps_type.value
        return dictionary


    def __str__(self) -> str:
        return super().__str__()[:-1] + \
            f'\tlow_fps_type = {self.low_fps_type.value}' + \
        ')'
