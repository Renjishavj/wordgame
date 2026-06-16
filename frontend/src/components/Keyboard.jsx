import React from 'react';

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

const Keyboard = ({ onKeyPress, usedKeys }) => {
  return (
    <div className="keyboard">
      {KEYS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => {
            let className = 'key';
            if (key === 'ENTER' || key === 'BACKSPACE') {
              className += ' key-wide';
            }
            if (usedKeys[key]) {
              className += ` ${usedKeys[key]}`;
            }
            
            return (
              <button 
                key={key} 
                className={className}
                onClick={() => onKeyPress(key)}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
