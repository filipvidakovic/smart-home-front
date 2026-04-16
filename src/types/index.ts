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
  led_states: {
    [key: string]: {
      on: boolean;
      last_changed: number | null;
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

interface DHTPair {
  temperature: number | null;
  humidity: number | null;
  location: string;
}

interface LCDDeviceData {
  device_id: string;
  location: string;
  last_updated: string | null;
}

interface PI3LCD extends LCDDeviceData {
  dht1: DHTPair;
  dht2: DHTPair;
}

interface PI2LCD extends LCDDeviceData {
  dht3: DHTPair;
}

export interface LCDDisplayData {
  PI3: PI3LCD;
  PI2: PI2LCD;
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