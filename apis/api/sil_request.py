class SilRequest:
    """
    The state and metadata of an SIL request.
    """
    def __init__(self, key: str, params: dict) -> None:
        self.key = key
        self.params = params
