import React, { useEffect, useState } from 'react';
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
  const [startTime, setStartTime] = useState<number | null>(null);
  const [baseSeconds, setBaseSeconds] = useState(seconds);

  const formatTime = (totalSeconds: number): string => {
    const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = Math.floor(safeSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // When timer starts, capture the start time
  useEffect(() => {
    if (running && startTime === null) {
      setStartTime(Date.now());
      setBaseSeconds(seconds);
    } else if (!running && startTime !== null) {
      setStartTime(null);
    }
  }, [running, startTime, seconds]);

  // When server updates seconds (user set/add), update base
  useEffect(() => {
    if (!running) {
      setBaseSeconds(seconds);
    }
  }, [seconds, running]);

  // Calculate display value based on elapsed time
  const getDisplaySeconds = (): number => {
    if (!running || startTime === null) {
      return baseSeconds;
    }
    const elapsed = (Date.now() - startTime) / 1000;
    return Math.max(0, baseSeconds - elapsed);
  };

  const [displaySeconds, setDisplaySeconds] = useState(getDisplaySeconds());

  // Local countdown timer
  useEffect(() => {
    if (!running) {
      setDisplaySeconds(baseSeconds);
      return;
    }

    const interval = setInterval(() => {
      setDisplaySeconds(getDisplaySeconds());
    }, 50); // Update every 50ms for smooth countdown

    return () => clearInterval(interval);
  }, [running, baseSeconds, startTime]);

  useEffect(() => {
    const loadButtonSeconds = async () => {
      try {
        const seconds = await api.getTimerButtonSeconds();
        if (Number.isFinite(seconds)) {
          setButtonSeconds(seconds);
        }
      } catch (error) {
        console.error('Failed to load button seconds:', error);
      }
    };
    loadButtonSeconds();
  }, []);

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
        {formatTime(displaySeconds)}
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