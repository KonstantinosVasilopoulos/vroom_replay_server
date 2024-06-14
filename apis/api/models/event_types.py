from enum import Enum


class EventTypes(Enum):
    """ Possible event types. """
    SUDDEN_BRAKING = 'suddenBraking'
    NOT_REPORTING = 'notReporting'
    GPS_NOT_UPDATING = 'gpsNotUpdating'
    CPU_HIGH_LOAD = 'cpuHighLoad'
    GPU_HIGH_LOAD = 'gpuHighLoad'
    LOW_FPS = 'lowFps'
