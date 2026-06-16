import React from 'react';
import Modal from './Modal';

const GameOver = ({ isWin, word, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title={isWin ? "MISSION ACCOMPLISHED" : "GAME OVER"}>
      <div className="game-over-content">
        <p className={`status-text ${isWin ? 'win' : 'lose'}`}>
          {isWin ? "You cracked the code!" : "The hidden word was:"}
        </p>
        {!isWin && <h1 className="reveal-word">{word}</h1>}
        <p className="mt-4 text-secondary" style={{fontSize: '14px', marginTop: '20px'}}>
          The next word will be available tomorrow.<br/>Wait for tomorrow!
        </p>
      </div>
    </Modal>
  );
};

export default GameOver;
