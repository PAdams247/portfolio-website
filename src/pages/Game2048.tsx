import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Game2048.css';

interface TouchPosition {
  x: number;
  y: number;
}

type Board = number[][];

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => initializeBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null);
  const [highScores, setHighScores] = useState<number[]>(() => {
    const saved = localStorage.getItem('game2048-highscores');
    return saved ? JSON.parse(saved) : [0, 0, 0];
  });

  function initializeBoard(): Board {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }

  function addRandomTile(board: Board): void {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const moveLeft = useCallback((board: Board) => {
    const newBoard = board.map(row => [...row]);
    let moved = false;
    let scoreGained = 0;

    for (let i = 0; i < 4; i++) {
      const row = newBoard[i];
      const filteredRow = row.filter(cell => cell !== 0);
      
      // Merge tiles
      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] *= 2;
          scoreGained += filteredRow[j];
          filteredRow[j + 1] = 0;
          
          if (filteredRow[j] === 2048 && !gameWon) {
            setGameWon(true);
          }
        }
      }

      const finalRow = filteredRow.filter(cell => cell !== 0);
      while (finalRow.length < 4) {
        finalRow.push(0);
      }

      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] !== finalRow[j]) {
          moved = true;
        }
        newBoard[i][j] = finalRow[j];
      }
    }

    return { newBoard, moved, scoreGained };
  }, [gameWon]);

  const rotateBoard = (board: Board): Board => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j][3 - i] = board[i][j];
      }
    }
    return newBoard;
  };

  const move = useCallback((direction: string) => {
    if (gameOver) return;

    let currentBoard = [...board.map(row => [...row])];
    let rotations = 0;

    switch (direction) {
      case 'ArrowUp':
        rotations = 3;
        break;
      case 'ArrowRight':
        rotations = 2;
        break;
      case 'ArrowDown':
        rotations = 1;
        break;
      case 'ArrowLeft':
        rotations = 0;
        break;
      default:
        return;
    }

    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateBoard(currentBoard);
    }

    const { newBoard, moved, scoreGained } = moveLeft(currentBoard);
    let finalBoard = newBoard;

    // Fix: Use newBoard instead of currentBoard for final rotation
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      finalBoard = rotateBoard(finalBoard);
    }

    if (moved) {
      addRandomTile(finalBoard);
      setBoard(finalBoard);
      setScore(prev => prev + scoreGained);

      // Check for game over
      if (!canMove(finalBoard)) {
        setGameOver(true);
      }
    }
  }, [board, gameOver, moveLeft]);

  const canMove = (board: Board): boolean => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true;
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j];
        if (
          (i < 3 && board[i + 1][j] === current) ||
          (j < 3 && board[i][j + 1] === current)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const resetGame = () => {
    // Update high scores if current score qualifies
    if (score > 0) {
      const newHighScores = [...highScores, score]
        .sort((a, b) => b - a)
        .slice(0, 3);

      if (JSON.stringify(newHighScores) !== JSON.stringify(highScores)) {
        setHighScores(newHighScores);
        localStorage.setItem('game2048-highscores', JSON.stringify(newHighScores));
      }
    }

    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move]);

  // Swipe detection functions
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    // Determine the primary direction (horizontal vs vertical)
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe) {
        move('ArrowLeft');
      } else if (isRightSwipe) {
        move('ArrowRight');
      }
    } else {
      // Vertical swipe
      if (isUpSwipe) {
        move('ArrowUp');
      } else if (isDownSwipe) {
        move('ArrowDown');
      }
    }
  };

  const getTileClass = (value: number): string => {
    if (value === 0) return 'tile-empty';
    return `tile-${value}`;
  };

  return (
    <div className="game-2048" data-testid="game-2048">
      <div className="game-2048-container">
        <div className="game-2048-board-container">
          <div
            className="game-board"
            data-testid="game-board"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`tile ${getTileClass(cell)}`}
                  data-testid={`tile-${i}-${j}`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>

          {(gameOver || gameWon) && (
            <div className="game-overlay" data-testid="game-overlay">
              <div className={`overlay-content ${gameWon ? 'win' : ''}`}>
                <h2>{gameWon ? 'You Win!' : 'Game Over!'}</h2>
                <p>
                  {gameWon
                    ? 'Congratulations! You reached 2048!'
                    : 'No more moves available.'}
                </p>
                <button onClick={resetGame}>Try Again</button>
              </div>
            </div>
          )}
        </div>

        <div className="game-2048-sidebar">
          <div className="game-info">
            <h2>2048</h2>
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">High Scores</span>
              <div className="high-scores-list">
                {highScores.map((highScore, index) => (
                  <div key={index} className={`high-score-item ${score === highScore && score > 0 ? 'current' : ''}`}>
                    #{index + 1}: {highScore.toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="controls">
            <h3>Controls</h3>
            <div className="control-list">
              <div>↑ Move Up</div>
              <div>↓ Move Down</div>
              <div>← Move Left</div>
              <div>→ Move Right</div>
            </div>
          </div>

          <div className="game-buttons">
            <button onClick={resetGame}>New Game</button>
          </div>
        </div>
      </div>

      <div className="mobile-controls" data-testid="mobile-controls">
        <div className="control-row">
          <button className="control-btn" onClick={() => move('ArrowUp')}>↑</button>
        </div>
        <div className="control-row">
          <button className="control-btn" onClick={() => move('ArrowLeft')}>←</button>
          <button className="control-btn" onClick={() => move('ArrowDown')}>↓</button>
          <button className="control-btn" onClick={() => move('ArrowRight')}>→</button>
        </div>
      </div>
    </div>
  );
};

export default Game2048;