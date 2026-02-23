import React, { useState } from 'react';
import api from '../services/api';
import './TimerControl.css';

interface TimerControlProps {
  seconds: number;
  running: boolean;
  expired: boolean;
}

const TimerControl: React.FC<TimerControlProps> = ({ seconds, running, expired }) => {
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [buttonSeconds, setButtonSeconds] = useState(10);
  const [loading, setLoading] = useState(false);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetTimer = async () => {
    const totalSeconds = inputMinutes * 60 + inputSeconds;
    if (totalSeconds <= 0) return;

    setLoading(true);
    try {
      await api.setTimer(totalSeconds);
    } catch (error) {
      console.error('Failed to set timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimer = async () => {
    setLoading(true);
    try {
      await api.startTimer();
    } catch (error) {
      console.error('Failed to start timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopTimer = async () => {
    setLoading(true);
    try {
      await api.stopTimer();
    } catch (error) {
      console.error('Failed to stop timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeconds = async () => {
    setLoading(true);
    try {
      await api.addTimerSeconds(buttonSeconds);
    } catch (error) {
      console.error('Failed to add seconds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetButtonSeconds = async () => {
    setLoading(true);
    try {
      await api.setTimerButtonSeconds(buttonSeconds);
    } catch (error) {
      console.error('Failed to set button seconds:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`timer-control ${expired ? 'expired' : ''}`}>
      <h3>⏱️ Kitchen Timer</h3>
      
      <div className={`timer-display ${expired ? 'blinking' : ''}`}>
        {formatTime(seconds)}
      </div>

      {expired && (
        <div className="timer-expired-message">
          ⏰ Timer Expired!
        </div>
      )}

      <div className="timer-input">
        <input
          type="number"
          min="0"
          max="99"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(parseInt(e.target.value) || 0)}
          placeholder="MM"
          disabled={loading}
        />
        <span>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(parseInt(e.target.value) || 0)}
          placeholder="SS"
          disabled={loading}
        />
        <button onClick={handleSetTimer} disabled={loading}>
          Set
        </button>
      </div>

      <div className="timer-controls">
        {!running && !expired && (
          <button onClick={handleStartTimer} disabled={loading} className="btn-start">
            ▶️ Start
          </button>
        )}
        {running && (
          <button onClick={handleStopTimer} disabled={loading} className="btn-stop">
            ⏸️ Stop
          </button>
        )}
      </div>

      <div className="button-config">
        <label>Button Add Seconds:</label>
        <input
          type="number"
          min="1"
          max="300"
          value={buttonSeconds}
          onChange={(e) => setButtonSeconds(parseInt(e.target.value) || 10)}
          disabled={loading}
        />
        <button onClick={handleSetButtonSeconds} disabled={loading}>
          Update
        </button>
      </div>

      <button 
        onClick={handleAddSeconds} 
        disabled={loading}
        className="btn-add-seconds"
      >
        ➕ Add {buttonSeconds}s
      </button>
    </div>
  );
};

export default TimerControl;