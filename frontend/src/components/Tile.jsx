import React from 'react';

const Tile = ({ letter, status, isRevealing }) => {
  let className = 'tile';
  if (status) {
    className += ` ${status}`;
  }
  if (isRevealing) {
    className += ' revealing';
  }

  return (
    <div className={className}>
      {letter}
    </div>
  );
};

export default Tile;
