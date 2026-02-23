import React from 'react';
import './PeopleCounter.css';

interface PeopleCounterProps {
  count: number;
}

const PeopleCounter: React.FC<PeopleCounterProps> = ({ count }) => {
  return (
    <div className="people-counter">
      <h3>👥 People in Building</h3>
      <div className="counter-display">
        <span className="counter-value">{count}</span>
      </div>
      <div className="counter-status">
        {count === 0 && <span className="empty">Building Empty</span>}
        {count === 1 && <span>1 Person</span>}
        {count > 1 && <span>{count} People</span>}
      </div>
    </div>
  );
};

export default PeopleCounter;