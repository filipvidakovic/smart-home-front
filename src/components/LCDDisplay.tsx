import React, { useEffect, useState } from 'react';
import { type LCDDisplayData } from '../types';
import api from '../services/api';
import './LCDDisplay.css';

const LCDDisplay: React.FC = () => {
  const [lcdData, setLcdData] = useState<LCDDisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    const fetchLCDData = async () => {
      try {
        const data = await api.getLCDDisplay();
        setLcdData(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch LCD data:', err);
        setLoading(false);
      }
    };

    fetchLCDData();
    const interval = setInterval(fetchLCDData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Rotate display every 5 seconds: DHT1 -> DHT2 -> DHT3
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="lcd-display loading">Loading LCD...</div>;
  }

  if (!lcdData) {
    return <div className="lcd-display error">No LCD data available</div>;
  }

  const getDisplayContent = () => {
    const index = displayIndex % 3;
    
    switch (index) {
      case 0: // DHT1 (Bedroom)
        return {
          line1: `Bedroom`,
          line2: lcdData.PI3.dht1.temperature !== null 
            ? `${lcdData.PI3.dht1.temperature.toFixed(1)}°C ${lcdData.PI3.dht1.humidity?.toFixed(0)}%`
            : 'No data'
        };
      case 1: // DHT2 (Master Bedroom)
        return {
          line1: `Master Bed`,
          line2: lcdData.PI3.dht2.temperature !== null 
            ? `${lcdData.PI3.dht2.temperature.toFixed(1)}°C ${lcdData.PI3.dht2.humidity?.toFixed(0)}%`
            : 'No data'
        };
      case 2: // DHT3 (Kitchen)
      default:
        return {
          line1: `Kitchen`,
          line2: lcdData.PI2.dht3.temperature !== null 
            ? `${lcdData.PI2.dht3.temperature.toFixed(1)}°C ${lcdData.PI2.dht3.humidity?.toFixed(0)}%`
            : 'No data'
        };
    }
  };

  const display = getDisplayContent();

  return (
    <div className="lcd-display">
      <div className="lcd-header">
        <h3>🖥️ LCD Display - {['Bedroom (DHT1)', 'Master Bed (DHT2)', 'Kitchen (DHT3)'][displayIndex % 3]}</h3>
      </div>
      
      <div className="lcd-screen">
        <div className="lcd-line lcd-line1">{display.line1}</div>
        <div className="lcd-line lcd-line2">{display.line2}</div>
      </div>

      <div className="lcd-indicators">
        <span className="indicator" style={{opacity: displayIndex % 3 === 0 ? 1 : 0.3}}>●</span>
        <span className="indicator" style={{opacity: displayIndex % 3 === 1 ? 1 : 0.3}}>●</span>
        <span className="indicator" style={{opacity: displayIndex % 3 === 2 ? 1 : 0.3}}>●</span>
      </div>

      <div className="lcd-data">
        <div className="sensor-box dht1">
          <h4>Bedroom (DHT1)</h4>
          <p>🌡️ {lcdData.PI3.dht1.temperature?.toFixed(1) || '—'}°C</p>
          <p>💧 {lcdData.PI3.dht1.humidity?.toFixed(1) || '—'}%</p>
        </div>
        <div className="sensor-box dht2">
          <h4>Master Bedroom (DHT2)</h4>
          <p>🌡️ {lcdData.PI3.dht2.temperature?.toFixed(1) || '—'}°C</p>
          <p>💧 {lcdData.PI3.dht2.humidity?.toFixed(1) || '—'}%</p>
        </div>
        <div className="sensor-box dht3">
          <h4>Kitchen (DHT3)</h4>
          <p>🌡️ {lcdData.PI2.dht3.temperature?.toFixed(1) || '—'}°C</p>
          <p>💧 {lcdData.PI2.dht3.humidity?.toFixed(1) || '—'}%</p>
        </div>
      </div>

      <div className="lcd-footer">
        <div className="timestamp">
          {lcdData.PI3.last_updated && (
            <small>PI3 Updated: {new Date(lcdData.PI3.last_updated).toLocaleTimeString()}</small>
          )}
        </div>
        <div className="timestamp">
          {lcdData.PI2.last_updated && (
            <small>PI2 Updated: {new Date(lcdData.PI2.last_updated).toLocaleTimeString()}</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default LCDDisplay;
