import re
from typing import Iterable

from settings import Settings
from models import Event, EventTypes, CepEvent


class CepFinder:
    """ Class for identifying complex events. """
    _settings = Settings()
    _event_representations = {
        EventTypes.SUDDEN_BRAKING: 's',
        EventTypes.NOT_REPORTING: 'n',
        EventTypes.GPS_NOT_UPDATING: 'u',
        EventTypes.CPU_HIGH_LOAD: 'c',
        EventTypes.GPU_HIGH_LOAD: 'g',
        EventTypes.LOW_FPS: 'l',
    }

    def identify_compex_events(self, events: Iterable[Event], regex: str) -> list[Event]:
        """ Finds and returns a list with complex events. """
        # Sort events by timestamp
        sorted_events = list(events)
        sorted_events.sort(key=lambda event: event.start.timestamp())

        # Create string with event string representations
        events_rep = ''
        for event in sorted_events:
            events_rep += self._event_representations[event.event_type]

        self._settings.logger.debug(events_rep)

        # Match regex
        matches = re.finditer(regex, events_rep)
        results = []
        for match in matches:
            if match is not None:
                match_start_index = match.start()
                match_end_index = match.end() - 1
                results.append(CepEvent(sorted_events[match_start_index].start, sorted_events[match_end_index].end))

        return results
