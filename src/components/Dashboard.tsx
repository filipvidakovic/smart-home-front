import React, { useEffect, useState } from 'react';
import { type SystemState, type DeviceStatus, type SensorStats } from '../types';
import api from '../services/api';
import SystemStatus from './SystemStatus';
import SensorCard from './SensorCard';
import SecurityPanel from './SecurityPanel';
import TimerControl from './TimerControl';
import PeopleCounter from './PeopleCounter';
import AlarmIndicator from './AlarmIndicator';
import LCDDisplay from './LCDDisplay';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [stats, setStats] = useState<SensorStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {

      const [stateData, devicesData, statsData] = await Promise.all([
        api.getSystemState(),
        api.getAllDevices(),
        api.getStats()
      ]);
      
      setSystemState(stateData);
      console.log('Fetched system state:', stateData);
      setDevices(devicesData);
      console.log('Fetched devices:', devicesData);
      setStats(statsData);
      console.log('Fetched stats:', statsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading system data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏠 Smart Home IoT System</h1>
        <div className="header-stats">
          <span>PI1: Entrance</span>
          <span>PI2: Kitchen</span>
          <span>PI3: Living Room</span>
        </div>
      </header>

      {systemState && (
        <>
          <AlarmIndicator 
            active={systemState.alarm_active}
            reason={systemState.alarm_reason}
          />

          <div className="main-controls">
            <PeopleCounter count={systemState.people_count} />
            <SecurityPanel 
              armed={systemState.security_armed}
              alarmActive={systemState.alarm_active}
            />
            <TimerControl
              seconds={systemState.timer_seconds}
              running={systemState.timer_running}
              expired={systemState.timer_expired}
            />
          </div>

          <SystemStatus 
            systemState={systemState}
            devices={devices}
          />
        </>
      )}

      <div className="sensors-grid">
        <h2>Sensor Readings</h2>
        <LCDDisplay />
        <div className="sensors-container">
          {devices.map(device => (
            <div key={device.device_id} className="device-section">
              <h3>{device.device_name} ({device.location})</h3>
              <div className="device-sensors">
                {Object.entries(device.sensors).map(([sensorKey, sensor]) => (
                  <SensorCard
                    key={`${device.device_id}-${sensorKey}`}
                    deviceId={device.device_id}
                    sensorType={sensor.type}
                    lastValue={sensor.last_value}
                    lastReading={sensor.last_reading}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grafana-section">
        <h2>📊 Grafana Visualizations</h2>
        <div className="grafana-iframe-container">
          <iframe
            src="http://localhost:3000/d/InfluxDB-IoT/complete-iot-sensor-dashboard?orgId=1&from=now-15m&to=now&timezone=browser&refresh=5s"
            title="Grafana Dashboard"
            className="grafana-iframe"
          />
        </div>
      </div>

      <div className="grafana-section">
        <h2> Camera</h2>
        <div className="grafana-iframe-container">
          <iframe
            // TODO Dodaj url kamere sa PIja
            src="https://www.youtube.com/embed?v=2BLqhS59Elc"
            title="Camera"
            className="grafana-iframe"
          />
        </div>
      </div>

      <div className="stats-section">
        <h2>📈 System Statistics (Last 24h)</h2>
        <div className="stats-grid">
          {Object.entries(stats).map(([type, count]) => (
            <div key={type} className="stat-card">
              <div className="stat-icon">{getStatIcon(type)}</div>
              <div className="stat-info">
                <span className="stat-type">{type}</span>
                <span className="stat-count">{count} events</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getStatIcon(type: string): string {
  const icons: { [key: string]: string } = {
    temperature: '🌡️',
    humidity: '💧',
    motion: '🚶',
    distance: '📏',
    door: '🚪',
    button: '🔘',
  };
  return icons[type] || '📊';
}

export default Dashboard;