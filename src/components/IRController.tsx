import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './IRController.css';

interface IRControllerProps {
  refreshInterval?: number;
}

const IRController: React.FC<IRControllerProps> = ({ refreshInterval = 3000 }) => {
  const [lampOn, setLampOn] = useState(false);
  const [currentColor, setCurrentColor] = useState('off');
  const [loading, setLoading] = useState(false);

  const colorMap: { [key: string]: string } = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    white: '#ffffff',
    orange: '#ff8800',
    purple: '#8800ff',
    pink: '#ff0088',
    off: '#1a1a1a'
  };

  const colorEmojis: { [key: string]: string } = {
    red: '🔴',
    green: '🟢',
    blue: '🔵',
    yellow: '💛',
    cyan: '💎',
    magenta: '💜',
    white: '⚪',
    orange: '🟠',
    purple: '🟣',
    pink: '🩷',
    off: '⚫'
  };

  const sendCommand = async (command: string) => {
    setLoading(true);
    try {
      const result = await api.controlIR(command);
      console.log('IR command result:', result);
      
      // Update local state based on command
      if (command === 'power') {
        const newState = !lampOn;
        setLampOn(newState);
        if (!newState) {
          setCurrentColor('off');
        } else if (currentColor === 'off') {
          setCurrentColor('red'); // Default to red when turning on
        }
      }
    } catch (error) {
      console.error('Failed to send IR command:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePower = () => {
    sendCommand('power');
  };

  const handleColorNext = () => {
    if (lampOn) {
      sendCommand('color_next');
      // Cycle through colors
      const colors = Object.keys(colorMap).filter(c => c !== 'off');
      const currentIndex = colors.indexOf(currentColor);
      const nextIndex = (currentIndex + 1) % colors.length;
      setCurrentColor(colors[nextIndex]);
    }
  };

  const handleColorPrev = () => {
    if (lampOn) {
      sendCommand('color_prev');
      // Cycle through colors backwards
      const colors = Object.keys(colorMap).filter(c => c !== 'off');
      const currentIndex = colors.indexOf(currentColor);
      const prevIndex = (currentIndex - 1 + colors.length) % colors.length;
      setCurrentColor(colors[prevIndex]);
    }
  };

  return (
    <div className="ir-controller">
      <div className="ir-header">
        <span className="ir-icon">🔴</span>
        <h3>IR Remote Control</h3>
      </div>
      
      <div className="lamp-display">
        <div 
          className={`lamp-bulb ${lampOn ? 'lamp-on' : 'lamp-off'}`}
          style={{ 
            backgroundColor: lampOn ? colorMap[currentColor] : colorMap['off'],
            boxShadow: lampOn ? `0 0 40px ${colorMap[currentColor]}` : 'none'
          }}
        >
          <span className="lamp-emoji">{colorEmojis[currentColor]}</span>
        </div>
        <div className="lamp-status">
          <span className="status-label">BRGB Lamp</span>
          <span className={`status-text ${lampOn ? 'status-on' : 'status-off'}`}>
            {lampOn ? `ON - ${currentColor.toUpperCase()}` : 'OFF'}
          </span>
        </div>
      </div>

      <div className="ir-controls">
        <button 
          className={`power-btn ${lampOn ? 'btn-on' : 'btn-off'}`}
          onClick={handlePower}
          disabled={loading}
        >
          <span className="btn-icon">{lampOn ? '⚫' : '💡'}</span>
          <span className="btn-label">{lampOn ? 'POWER OFF' : 'POWER ON'}</span>
        </button>

        <div className="color-controls">
          <button 
            className="color-btn"
            onClick={handleColorPrev}
            disabled={!lampOn || loading}
            title="Previous color"
          >
            <span className="btn-icon">◀️</span>
            <span className="btn-label">PREV</span>
          </button>
          
          <button 
            className="color-btn"
            onClick={handleColorNext}
            disabled={!lampOn || loading}
            title="Next color"
          >
            <span className="btn-label">NEXT</span>
            <span className="btn-icon">▶️</span>
          </button>
        </div>
      </div>

      <div className="color-spectrum">
        {Object.entries(colorMap)
          .filter(([name]) => name !== 'off')
          .map(([name, hex]) => (
            <div 
              key={name}
              className={`color-dot ${currentColor === name ? 'active' : ''}`}
              style={{ backgroundColor: hex }}
              title={name}
            />
          ))}
      </div>
    </div>
  );
};

export default IRController;
