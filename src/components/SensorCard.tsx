import React from 'react';
import './SensorCard.css';

interface SensorCardProps {
  deviceId: string;
  sensorType: string;
  lastValue: number | null;
  lastReading: string | null;
}

const SensorCard: React.FC<SensorCardProps> = ({
  deviceId,
  sensorType,
  lastValue,
  lastReading
}) => {
  const formatValue = (type: string, value: number | null): string => {
    if (value === null) return 'N/A';
    
    switch (type) {
      case 'temperature':
        return `${value.toFixed(1)}°C`;
      case 'humidity':
        return `${value.toFixed(1)}%`;
      case 'distance':
        return `${value.toFixed(0)} cm`;
      case 'motion':
        return value === 1 ? 'Detected' : 'Clear';
      case 'door':
        return value === 1 ? 'Open' : 'Closed';
      case 'button':
        return 'Pressed';
      default:
        return value.toString();
    }
  };

  const getIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      temperature: '🌡️',
      humidity: '💧',
      motion: '🚶',
      distance: '📏',
      door: '🚪',
      button: '🔘',
      accel_x: '📐',
      accel_y: '📐',
      accel_z: '📐',
      gyro_x: '🔄',
      gyro_y: '🔄',
      gyro_z: '🔄',
    };
    return icons[type] || '📊';
  };

  const getStatusClass = (type: string, value: number | null): string => {
    if (value === null) return 'unknown';
    
    switch (type) {
      case 'motion':
      case 'door':
        return value === 1 ? 'active' : 'inactive';
      case 'temperature':
        if (value < 18) return 'cold';
        if (value > 25) return 'hot';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const formatTimestamp = (timestamp: string | null): string => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className={`sensor-card ${getStatusClass(sensorType, lastValue)}`}>
      <div className="sensor-header">
        <span className="sensor-icon">{getIcon(sensorType)}</span>
        <span className="sensor-type">{sensorType}</span>
      </div>
      <div className="sensor-value">
        {formatValue(sensorType, lastValue)}
      </div>
      <div className="sensor-timestamp">
        {formatTimestamp(lastReading)}
      </div>
    </div>
  );
};

export default SensorCard;