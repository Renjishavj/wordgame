import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import GameOver from './GameOver';
import Modal from './Modal';
import axios from 'axios';
import { getDailyWord, VALID_WORDS } from '../utils/words';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const WordGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  useEffect(() => {
    loadDailyGame();
  }, []);

  const loadDailyGame = () => {
    const today = new Date().toDateString();
    const userId = localStorage.getItem('userId') || 'guest';
    const stateKey = `wordGameState_${userId}`;
    const savedState = localStorage.getItem(stateKey);

    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.date === today) {
        // Load saved state for today
        setTargetWord(parsedState.targetWord);
        setGuesses(parsedState.guesses);
        setUsedKeys(parsedState.usedKeys);
        setIsGameOver(parsedState.isGameOver);
        setIsWin(parsedState.isWin);
        setShowGameOverModal(parsedState.isGameOver);

        if (parsedState.isWin) {
          submitScoreToBackend(parsedState.guesses.length);
        }
        return;
      }
    }

    // New game for today
    setTargetWord(getDailyWord());
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setIsWin(false);
    setShowGameOverModal(false);
    setUsedKeys({});
  };

  const submitScoreToBackend = async (score) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.post('https://wordgame-1-nmd1.onrender.com/api/users/score', {
        score,
        date: new Date().toDateString()
      }, {
        headers: { 'x-auth-token': token }
      });
    } catch (err) {
      console.error('Error submitting score:', err);
    }
  };

  const saveGameState = (newGameOver, newWin, newGuesses, newUsedKeys, currentTarget) => {
    const today = new Date().toDateString();
    const userId = localStorage.getItem('userId') || 'guest';
    const stateKey = `wordGameState_${userId}`;

    localStorage.setItem(stateKey, JSON.stringify({
      date: today,
      targetWord: currentTarget || targetWord,
      guesses: newGuesses,
      usedKeys: newUsedKeys,
      isGameOver: newGameOver,
      isWin: newWin
    }));
  };

  const onKeyPress = (key) => {
    if (isGameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        // Not enough letters
        return;
      }
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE') {
        onKeyPress(key);
      } else if (/^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, isGameOver]);

  const submitGuess = () => {
    // Validate guess
    const formattedGuess = currentGuess.toUpperCase();

    // Calculate tile statuses
    const newGuess = Array(WORD_LENGTH).fill(null);
    const targetLetters = targetWord.split('');
    const newUsedKeys = { ...usedKeys };

    // First pass: Correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = formattedGuess[i];
      if (letter === targetLetters[i]) {
        newGuess[i] = { letter, status: 'correct', isRevealing: true };
        targetLetters[i] = null; // Mark as handled
        newUsedKeys[letter] = 'correct';
      }
    }

    // Second pass: Present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (newGuess[i]) continue; // Skip already correct

      const letter = formattedGuess[i];
      const targetIndex = targetLetters.indexOf(letter);

      if (targetIndex !== -1) {
        newGuess[i] = { letter, status: 'present', isRevealing: true };
        targetLetters[targetIndex] = null;
        if (newUsedKeys[letter] !== 'correct') {
          newUsedKeys[letter] = 'present';
        }
      } else {
        newGuess[i] = { letter, status: 'absent', isRevealing: true };
        if (!newUsedKeys[letter]) {
          newUsedKeys[letter] = 'absent';
        }
      }
    }

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setUsedKeys(newUsedKeys);

    // Check Win/Loss
    if (formattedGuess === targetWord) {
      setTimeout(() => {
        setIsGameOver(true);
        setIsWin(true);
        setShowGameOverModal(true);
        saveGameState(true, true, newGuesses, newUsedKeys, targetWord);
        submitScoreToBackend(newGuesses.length);
      }, WORD_LENGTH * 300);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setTimeout(() => {
        setIsGameOver(true);
        setIsWin(false);
        setShowGameOverModal(true);
        saveGameState(true, false, newGuesses, newUsedKeys, targetWord);
      }, WORD_LENGTH * 300);
    } else {
      // Save progress if game is still going
      saveGameState(false, false, newGuesses, newUsedKeys, targetWord);
    }

    // Reset revealing animation flag after animation completes
    setTimeout(() => {
      const resetGuesses = [...newGuesses];
      resetGuesses[resetGuesses.length - 1] = resetGuesses[resetGuesses.length - 1].map(t => ({ ...t, isRevealing: false }));
      setGuesses(resetGuesses);
    }, WORD_LENGTH * 300 + 500);
  };

  return (
    <div className="word-game-wrapper">
      <div className="word-game-header">
        <h2 className="game-title" style={{ marginBottom: 0 }}>TERMINAL HACK</h2>
        <button className="btn-icon" onClick={() => setShowHowToPlay(true)}>
          ❓
        </button>
      </div>

      <GameBoard
        guesses={guesses}
        currentGuess={currentGuess}
        currentRow={guesses.length}
      />

      <Keyboard
        onKeyPress={onKeyPress}
        usedKeys={usedKeys}
      />

      {showGameOverModal && (
        <GameOver
          isWin={isWin}
          word={targetWord}
          onClose={() => setShowGameOverModal(false)}
        />
      )}

      <Modal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        title="HOW TO PLAY"
      >
        <p>Guess the <strong>TERMINAL HACK</strong> code in 6 tries.</p>
        <ul style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '20px' }}>
          <li>Each guess must be a valid 5-letter word.</li>
          <li>Hit the enter button to submit.</li>
          <li>After each guess, the color of the tiles will change to show how close your guess was to the word.</li>
        </ul>
        <div className="examples" style={{ marginTop: '20px', textAlign: 'left' }}>
          <p style={{ marginBottom: '15px', color: '#fff' }}><strong>Examples:</strong></p>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <div className="tile correct" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>W</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>O</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>R</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>D</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>S</div>
          </div>
          <p className="text-sm text-secondary" style={{ marginBottom: '20px', fontSize: '14px' }}><strong>W</strong> is in the word and in the correct spot.</p>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>P</div>
            <div className="tile present" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>I</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>L</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>L</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>S</div>
          </div>
          <p className="text-sm text-secondary" style={{ marginBottom: '20px', fontSize: '14px' }}><strong>I</strong> is in the word but in the wrong spot.</p>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>V</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>A</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>G</div>
            <div className="tile absent" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>U</div>
            <div className="tile" style={{ width: '40px', height: '40px', fontSize: '1.5rem', flexShrink: 0 }}>E</div>
          </div>
          <p className="text-sm text-secondary" style={{ fontSize: '14px' }}><strong>U</strong> is not in the word in any spot.</p>
        </div>
      </Modal>
    </div>
  );
};

export default WordGame;
