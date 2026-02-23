export interface DeviceInfo {
  pi_id: string;
  device_name: string;
  location: string;
  description: string;
}

export interface SensorReading {
  timestamp: string;
  device_id: string;
  device_name: string;
  location: string;
  sensor_type: string;
  value: number;
  simulated: boolean;
}

export interface SystemState {
  people_count: number;
  security_armed: boolean;
  alarm_active: boolean;
  alarm_reason: string | null;
  timer_seconds: number;
  timer_running: boolean;
  timer_expired: boolean;
  door_states: {
    [key: string]: {
      open: boolean;
      open_since: number | null;
    };
  };
}

export interface SensorStats {
  temperature?: number;
  humidity?: number;
  motion?: number;
  distance?: number;
  door?: number;
  button?: number;
}

export interface DeviceStatus {
  device_id: string;
  device_name: string;
  location: string;
  online: boolean;
  last_seen: string;
  sensors: {
    [key: string]: {
      type: string;
      last_value: number | null;
      last_reading: string | null;
    };
  };
}