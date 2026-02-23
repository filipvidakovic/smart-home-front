import React from 'react';
import './AlarmIndicator.css';

interface AlarmIndicatorProps {
  active: boolean;
  reason: string | null;
}

const AlarmIndicator: React.FC<AlarmIndicatorProps> = ({ active, reason }) => {
  if (!active) return null;

  return (
    <div className="alarm-indicator active">
      <div className="alarm-content">
        <span className="alarm-icon">🚨</span>
        <div className="alarm-text">
          <strong>ALARM ACTIVE!</strong>
          {reason && <p>{reason}</p>}
        </div>
        <span className="alarm-icon">🚨</span>
      </div>
    </div>
  );
};

export default AlarmIndicator;