import axios from 'axios';
import { type SensorStats, type SensorReading, type SystemState, type DeviceStatus } from '../types';

const API_BASE_URL ='http://localhost:5000';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getHealth() {
    const response = await axios.get(`${this.baseURL}/health`);
    return response.data;
  }

  async getStats(): Promise<SensorStats> {
    const response = await axios.get(`${this.baseURL}/stats`);
    return response.data;
  }

  async getRecentReadings(sensorType: string): Promise<SensorReading[]> {
    const response = await axios.get(`${this.baseURL}/recent/${sensorType}`);
    return response.data.readings;
  }

  async getSystemState(): Promise<SystemState> {
    const response = await axios.get(`${this.baseURL}/system/state`);
    return response.data;
  }

  async getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
    const response = await axios.get(`${this.baseURL}/devices/${deviceId}`);
    return response.data;
  }

  async getAllDevices(): Promise<DeviceStatus[]> {
    const response = await axios.get(`${this.baseURL}/devices`);
    return response.data;
  }

  async getLCDDisplay() {
    const response = await axios.get(`${this.baseURL}/lcd/display`);
    return response.data;
  }

  async setTimer(seconds: number) {
    const response = await axios.post(`${this.baseURL}/timer/set`, { seconds });
    return response.data;
  }

  async startTimer() {
    const response = await axios.post(`${this.baseURL}/timer/start`);
    return response.data;
  }

  async stopTimer() {
    const response = await axios.post(`${this.baseURL}/timer/stop`);
    return response.data;
  }

  async addTimerSeconds(seconds: number) {
    const response = await axios.post(`${this.baseURL}/timer/add`, { seconds });
    return response.data;
  }

  async armSecurity(pin: string) {
    const response = await axios.post(`${this.baseURL}/security/arm`, { pin });
    return response.data;
  }

  async disarmSecurity(pin: string) {
    const response = await axios.post(`${this.baseURL}/security/disarm`, { pin });
    return response.data;
  }

  async clearAlarm(pin: string) {
    const response = await axios.post(`${this.baseURL}/alarm/clear`, { pin });
    return response.data;
  }

  async getTimerButtonSeconds(): Promise<number> {
    const response = await axios.get(`${this.baseURL}/timer/button-seconds`);
    return response.data.seconds;
  }

  async setTimerButtonSeconds(seconds: number) {
    const response = await axios.post(`${this.baseURL}/timer/button-seconds`, { seconds });
    return response.data;
  }

  async controlIR(command: string, device: string = 'brgb') {
    const response = await axios.post(`${this.baseURL}/ir/control`, { 
      device, 
      command 
    });
    return response.data;
  }

  async controlLamp(command: 'on' | 'off' | 'set_color', color: string = 'white') {
    const response = await axios.post(`${this.baseURL}/lamp/control`, {
      command,
      color
    });
    return response.data;
  }

  async getIRDevices() {
    const response = await axios.get(`${this.baseURL}/ir/devices`);
    return response.data;
  }
}

export default new ApiService();