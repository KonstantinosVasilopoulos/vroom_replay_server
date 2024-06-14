from enum import Enum


class LowFpsTypes(Enum):
    """ Low FPS event sub-types. """
    SIGN = 'sign'
    OBSTACLE = 'obstacle'
    LANE = 'lane'
    HORIZONTAL_LANE = 'horizontal lane'
    VEHICLE = 'vehicle'
