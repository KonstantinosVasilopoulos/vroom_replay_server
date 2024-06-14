import json
from typing import Iterable

from models import Message


class VroomTotalEncoder:
    """
    Encoder class for VROOM's total message. It encodes Message instances into VROOM total JSON string.
    """
    def encode(self, message: Message) -> Message:
        """ Converts Message instance to JSON string which is accepted by VROOM. """
        # Strip message from surrounding apostrophe symbols and double backslashes
        decoded_message = json.loads(message.message[2:-1].replace('\\\\', '\\'))

        # Return the time-stamped payload as a Message
        payload = json.loads(decoded_message['payload'])
        payload['timestamp'] = message.insertion_time.timestamp()
        payload = json.dumps(payload)
        return Message(message.insertion_time, payload)


    def bulk_encode(self, messages: Iterable) -> Iterable[Message]:
        """ Encodes many messages. """
        for message in messages:
            yield self.encode(message)
