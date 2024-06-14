import sys
import logging
from dotenv import dotenv_values
from threading import Lock

from models import EventTypes, LowFpsTypes


class Settings:
    """
    Singleton class for configurating the API.
    """
    _instance = None
    _lock = Lock()
    EVENT_TYPES = (
        EventTypes.SUDDEN_BRAKING,
        EventTypes.NOT_REPORTING,
        EventTypes.GPS_NOT_UPDATING,
        EventTypes.CPU_HIGH_LOAD,
        EventTypes.GPU_HIGH_LOAD,
        EventTypes.LOW_FPS,
    )
    LOW_FPS_SUBTYPES = (
        LowFpsTypes.SIGN,
        LowFpsTypes.OBSTACLE,
        LowFpsTypes.LANE,
        LowFpsTypes.HORIZONTAL_LANE,
        LowFpsTypes.VEHICLE,
    )


    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                cls._instance = super(Settings, cls).__new__(cls)            

        return cls._instance


    def __init__(self):
        # Define constants
        self.ISO_8601_PATTERN = r'%Y-%m-%dT%H:%M:%SZ'

        # Load configuration settings from .env file
        self.config = dotenv_values('.env')
        self.influxdb_url = self.config['INFLUXDB_URL']
        self.influxdb_token = self.config['INFLUXDB_TOKEN']
        self.bucket = self.config['INFLUXDB_BUCKET']
        self.org = self.config['INFLUXDB_ORG']
        self.measurement = self.config['INFLUXDB_MEASUREMENT']
        self.events_api_start_offset_secs = int(self.config['EVENTS_API_START_OFFSET_SECS'])
        self.api_timeout_secs = int(self.config['API_TIMEOUT_SECS'])
        self.events_api_stream_interval_secs = int(self.config['EVENTS_API_STREAM_INTERVAL_SECS'])
        self.cep_api_start_offset_secs = int(self.config['CEP_API_START_OFFSET_SECS'])
        self.cep_api_display_offset_secs = int(self.config['CEP_API_DISPLAY_OFFSET_SECS'])
        self.cep_api_stream_interval_secs = int(self.config['CEP_API_STREAM_INTERVAL_SECS'])

        # Set up logger
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)
        stream_handler = logging.StreamHandler(sys.stdout)
        log_formatter = logging.Formatter("%(levelname)s: %(asctime)s %(message)s")
        stream_handler.setFormatter(log_formatter)
        self.logger.addHandler(stream_handler)
