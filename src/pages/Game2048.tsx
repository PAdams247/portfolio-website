import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Game2048.css';

type Board = number[][];

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => initializeBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

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

  const getTileClass = (value: number): string => {
    if (value === 0) return 'tile-empty';
    return `tile-${value}`;
  };

  return (
    <div className="game-2048" data-testid="game-2048">
      <div className="game-header">
        <h1>2048</h1>
        <div className="game-info">
          <div className="score-container">
            <div className="score-label">Score</div>
            <div className="score-value">{score}</div>
          </div>
          <button className="reset-button" onClick={resetGame}>
            New Game
          </button>
        </div>
      </div>

      <div className="game-board" data-testid="game-board">
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
          <div className="overlay-content">
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

      <div className="mobile-controls" data-testid="mobile-controls">
        <div className="controls-row">
          <button onClick={() => move('ArrowUp')}>↑</button>
        </div>
        <div className="controls-row">
          <button onClick={() => move('ArrowLeft')}>←</button>
          <button onClick={() => move('ArrowDown')}>↓</button>
          <button onClick={() => move('ArrowRight')}>→</button>
        </div>
      </div>

      <div className="game-instructions">
        <p>Use arrow keys or buttons to move tiles. Combine tiles with the same number to reach 2048!</p>
      </div>
    </div>
  );
};

export default Game2048;