import React, { useState, useEffect, useCallback } from 'react';
import '../styles/GameTemplate.css';

const GameTemplate: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (!gameOver) {
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          break;
        case 'ArrowRight':
          e.preventDefault();
          break;
        case 'ArrowDown':
          e.preventDefault();
          break;
        case 'ArrowUp':
          e.preventDefault();
          break;
        case ' ':
          e.preventDefault();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, togglePause]);

  return (
    <div className="game-template">
      <div className="game-container">
        <div className="game-board-container">
          <div className="game-board">
            {/* GAME BOARD CONTENT GOES HERE */}
            <div className="placeholder-text">Game Board Area</div>
          </div>

          {gameOver && (
            <div className="game-overlay">
              <div className="game-message">
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                <button onClick={resetGame}>Play Again</button>
              </div>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="game-overlay">
              <div className="game-message">
                <h2>Paused</h2>
                <button onClick={togglePause}>Resume</button>
              </div>
            </div>
          )}
        </div>

        <div className="game-sidebar">
          <div className="game-info">
            <h2>Game Title</h2>
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">High Score</span>
              <span className="stat-value">{highScore}</span>
            </div>
          </div>

          <div className="controls">
            <h3>Controls</h3>
            <div className="control-list">
              <div>← → Move</div>
              <div>↓ Down</div>
              <div>↑ Up/Rotate</div>
              <div>Space Action</div>
              <div>P Pause</div>
            </div>
          </div>

          <div className="game-buttons">
            <button onClick={togglePause} disabled={gameOver}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={resetGame}>New Game</button>
          </div>
        </div>
      </div>

      <div className="mobile-controls">
        <div className="control-row">
          <button className="control-btn">↑</button>
        </div>
        <div className="control-row">
          <button className="control-btn">←</button>
          <button className="control-btn">↓</button>
          <button className="control-btn">→</button>
        </div>
      </div>
    </div>
  );
};

export default GameTemplate;
