import React from 'react';
import './LEDIndicator.css';

interface LEDIndicatorProps {
  ledId: string;
  isOn: boolean;
  label: string;
  lastChanged?: number | null;
}

const LEDIndicator: React.FC<LEDIndicatorProps> = ({ ledId, isOn, label, lastChanged }) => {
  const formatTimeSince = (timestamp: number | null): string => {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() / 1000) - timestamp);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className={`led-indicator ${isOn ? 'led-on' : 'led-off'}`}>
      <div className="led-bulb">
        <div className="led-glow"></div>
        <div className="led-core"></div>
      </div>
      <div className="led-info">
        <span className="led-label">{label}</span>
        <span className="led-status">{isOn ? 'ON' : 'OFF'}</span>
        {lastChanged && (
          <span className="led-time">{formatTimeSince(lastChanged)}</span>
        )}
      </div>
    </div>
  );
};

export default LEDIndicator;