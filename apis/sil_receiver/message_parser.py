import json

from total_message import TotalMessage


class MessageParser:
    """
    Class to parse SIL message into TotalMessage class istances.
    """
    def parse(self, msg: str) -> TotalMessage:
        """ Converts a single message from JSON string to TotalMessage. """
        json_msg = json.loads(msg)
        total_message = TotalMessage()
        for key, value in json_msg.items():
            setattr(total_message, key, value)

        return total_message
