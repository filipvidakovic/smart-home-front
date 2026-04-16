import React from 'react';
import { type SystemState, type DeviceStatus } from '../types';
import './SystemStatus.css';

interface SystemStatusProps {
  systemState: SystemState;
  devices: DeviceStatus[];
}

const SystemStatus: React.FC<SystemStatusProps> = ({ systemState, devices }) => {
  console.log("Door states:"+systemState.door_states);
  return (
    <div className="system-status">
      <h2>System Status</h2>
      <div className="status-grid">
        <div className="status-item">
          <span className="status-label">Doors</span>
          <div className="door-states">
            {Object.entries(systemState.door_states).map(([doorId, state]) => (
              <div key={doorId} className={`door-state ${state.open ? 'open' : 'closed'}`}>
                <span className="door-icon">{state.open ? '🔓' : '🔒'}</span>
                <span className="door-name">{doorId}</span>
                <span className="door-status">{state.open ? 'Open' : 'Closed'}</span>
                {state.open && state.open_since && (
                  <span className="door-duration">
                    {Math.floor((Date.now() / 1000 - state.open_since))}s
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="status-item">
          <span className="status-label">Devices</span>
          <div className="device-list">
            {devices.map(device => (
              <div key={device.device_id} className={`device-item ${device.online ? 'online' : 'offline'}`}>
                <span className="device-status-dot"></span>
                <div className="device-info">
                  <span className="device-name">{device.device_name}</span>
                  <span className="device-location">{device.location}</span>
                </div>
                <span className="device-last-seen">
                  {device.online ? 'Online' : `Offline: ${device.last_seen}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;