import React, { useState } from 'react';
import api from '../services/api';
import './SecurityPanel.css';

interface SecurityPanelProps {
  armed: boolean;
  alarmActive: boolean;
}

const SecurityPanel: React.FC<SecurityPanelProps> = ({ armed, alarmActive }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleArm = async () => {
    if (!pin) {
      setMessage('Please enter PIN');
      return;
    }

    setLoading(true);
    try {
      await api.armSecurity(pin);
      setMessage('Security system arming in 10 seconds...');
      setPin('');
    } catch (error) {
      setMessage('Failed to arm system. Check PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisarm = async () => {
    if (!pin) {
      setMessage('Please enter PIN');
      return;
    }

    setLoading(true);
    try {
      await api.disarmSecurity(pin);
      setMessage('Security system disarmed');
      setPin('');
    } catch (error) {
      setMessage('Failed to disarm. Check PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAlarm = async () => {
    if (!pin) {
      setMessage('Please enter PIN');
      return;
    }

    setLoading(true);
    try {
      await api.clearAlarm(pin);
      setMessage('Alarm cleared');
      setPin('');
    } catch (error) {
      setMessage('Failed to clear alarm. Check PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`security-panel ${armed ? 'armed' : 'disarmed'} ${alarmActive ? 'alarm' : ''}`}>
      <h3>🔐 Security System</h3>
      
      <div className="security-status">
        <div className={`status-indicator ${armed ? 'armed' : 'disarmed'}`}>
          {armed ? '🔴 ARMED' : '🟢 DISARMED'}
        </div>
      </div>

      <div className="pin-input">
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          disabled={loading}
        />
      </div>

      <div className="security-actions">
        {!armed && !alarmActive && (
          <button 
            onClick={handleArm} 
            disabled={loading}
            className="btn-arm"
          >
            ARM System
          </button>
        )}
        
        {armed && !alarmActive && (
          <button 
            onClick={handleDisarm} 
            disabled={loading}
            className="btn-disarm"
          >
            DISARM System
          </button>
        )}

        {alarmActive && (
          <button 
            onClick={handleClearAlarm} 
            disabled={loading}
            className="btn-clear-alarm"
          >
            CLEAR ALARM
          </button>
        )}
      </div>

      {message && <div className="security-message">{message}</div>}
    </div>
  );
};

export default SecurityPanel;