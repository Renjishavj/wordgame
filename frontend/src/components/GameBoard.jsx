import React from 'react';
import Tile from './Tile';

const GameBoard = ({ guesses, currentGuess, currentRow }) => {
  const emptyRows = Math.max(0, 5 - currentRow);

  return (
    <div className="game-board">
      {guesses.map((guess, i) => (
        <div key={i} className="row">
          {guess.map((tile, j) => (
            <Tile 
              key={j} 
              letter={tile.letter} 
              status={tile.status} 
              isRevealing={tile.isRevealing}
            />
          ))}
        </div>
      ))}
      
      {currentRow < 6 && (
        <div className="row">
          {Array.from({ length: 5 }).map((_, i) => (
            <Tile key={i} letter={currentGuess[i] || ''} />
          ))}
        </div>
      )}

      {Array.from({ length: emptyRows }).map((_, i) => (
        <div key={i + currentRow + 1} className="row">
          {Array.from({ length: 5 }).map((_, j) => (
            <Tile key={j} letter="" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
