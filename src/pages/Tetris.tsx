import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/Tetris.css';

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type Board = number[][];

interface Tetromino {
  shape: number[][];
  x: number;
  y: number;
  type: TetrominoType;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOES: Record<TetrominoType, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

const Tetris: React.FC = () => {
  const [board, setBoard] = useState<Board>(() =>
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tetrisCombo, setTetrisCombo] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'single' | 'double' | 'triple' | 'quadruple' | 'quintuple' | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number; time: number } | null>(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const createRandomTetromino = useCallback((): TetrominoType => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return types[Math.floor(Math.random() * types.length)];
  }, []);

  const createTetromino = useCallback((type: TetrominoType): Tetromino => {
    return {
      shape: TETROMINOES[type],
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[type][0].length / 2),
      y: 0,
      type
    };
  }, []);

  const isValidPosition = useCallback((piece: Tetromino, board: Board, dx = 0, dy = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const rotatePiece = useCallback((piece: Tetromino): Tetromino => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const rotatePieceCounterClockwise = useCallback((piece: Tetromino): Tetromino => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[row.length - 1 - index])
    );
    return { ...piece, shape: rotated };
  }, []);

  const placePiece = useCallback((piece: Tetromino, board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.type.charCodeAt(0) - 64; // Convert letter to number
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    // Check for Tetris (4 lines cleared)
    if (linesCleared === 4) {
      setTetrisCombo(prev => {
        const newCombo = prev + 1;
        // Trigger animation based on combo count
        if (newCombo === 1) {
          setAnimationType('single');
        } else if (newCombo === 2) {
          setAnimationType('double');
        } else if (newCombo === 3) {
          setAnimationType('triple');
        } else if (newCombo === 4) {
          setAnimationType('quadruple');
        } else if (newCombo >= 5) {
          setAnimationType('quintuple');
        }
        setShowAnimation(true);
        return newCombo;
      });
    } else if (linesCleared > 0 && linesCleared < 4) {
      // Reset combo if lines cleared but not a Tetris
      setTetrisCombo(0);
    }

    return { newBoard, linesCleared };
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentPiece || gameOver || isPaused) return;

    const dx = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const dy = direction === 'down' ? 1 : 0;

    if (isValidPosition(currentPiece, board, dx, dy)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null);
    } else if (direction === 'down') {
      // Piece has landed
      const newBoard = placePiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor(lines / 10) + 1);

      // Create next piece - FIXED: Use the nextPiece that was already generated
      if (nextPiece) {
        const newPiece = createTetromino(nextPiece);
        if (isValidPosition(newPiece, clearedBoard)) {
          setCurrentPiece(newPiece);
          // Generate a new next piece for the preview
          setNextPiece(createRandomTetromino());
        } else {
          setGameOver(true);
        }
      }
    }
  }, [currentPiece, board, gameOver, isPaused, isValidPosition, placePiece, clearLines, level, lines, nextPiece, createTetromino, createRandomTetromino]);

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const rotated = rotatePiece(currentPiece);
    if (isValidPosition(rotated, board)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, gameOver, isPaused, rotatePiece, isValidPosition, board]);

  const rotatePieceCounterClockwiseHandler = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const rotated = rotatePieceCounterClockwise(currentPiece);
    if (isValidPosition(rotated, board)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, gameOver, isPaused, rotatePieceCounterClockwise, isValidPosition, board]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    let newY = currentPiece.y;
    while (isValidPosition(currentPiece, board, 0, newY - currentPiece.y + 1)) {
      newY++;
    }
    setCurrentPiece(prev => prev ? { ...prev, y: newY } : null);
  }, [currentPiece, gameOver, isPaused, isValidPosition, board]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!currentPiece || gameOver || isPaused) return;

    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const currentTime = Date.now();

    // Store touch start position and time for swipe detection
    setTouchStartPos({ x, y, time: currentTime });

    // Check for double-tap at bottom of screen (hard drop)
    const boardHeight = rect.height;
    if (y > boardHeight * 0.7) { // Bottom 30% of screen
      if (currentTime - lastTapTime < 300) { // Double tap within 300ms
        dropPiece();
        setLastTapTime(0); // Reset to prevent triple-tap
        return;
      }
      setLastTapTime(currentTime);
    }
  }, [currentPiece, gameOver, isPaused, lastTapTime, dropPiece]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!currentPiece || gameOver || isPaused || !touchStartPos) return;

    const touch = e.changedTouches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const endX = touch.clientX - rect.left;
    const endY = touch.clientY - rect.top;

    const deltaX = endX - touchStartPos.x;
    const deltaY = endY - touchStartPos.y;
    const deltaTime = Date.now() - touchStartPos.time;

    const boardHeight = rect.height;
    const boardWidth = rect.width;
    const startY = touchStartPos.y;

    // Swipe detection (minimum distance and speed)
    const minSwipeDistance = 30;
    const maxSwipeTime = 300;

    if (Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime) {
      // Vertical swipe down - soft drop
      if (deltaY > 0) {
        movePiece('down');
        setTouchStartPos(null);
        return;
      }
    }

    // If not a swipe, treat as tap for rotation/movement
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
      // Top half: rotation (left = counter-clockwise, right = clockwise)
      if (startY < boardHeight / 2) {
        if (touchStartPos.x < boardWidth / 2) {
          rotatePieceCounterClockwiseHandler();
        } else {
          rotatePieceHandler();
        }
      }
      // Bottom half: horizontal movement (left = move left, right = move right)
      else if (startY < boardHeight * 0.7) { // Middle-bottom area (not the double-tap zone)
        if (touchStartPos.x < boardWidth / 2) {
          movePiece('left');
        } else {
          movePiece('right');
        }
      }
    }

    setTouchStartPos(null);
  }, [currentPiece, gameOver, isPaused, touchStartPos, rotatePieceHandler, rotatePieceCounterClockwiseHandler, movePiece]);

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setTetrisCombo(0);
    setShowAnimation(false);
    setAnimationType(null);
    const firstPiece = createRandomTetromino();
    setCurrentPiece(createTetromino(firstPiece));
    setNextPiece(createRandomTetromino());
  };

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Initialize game
  useEffect(() => {
    if (!currentPiece && !nextPiece) {
      const firstPiece = createRandomTetromino();
      setCurrentPiece(createTetromino(firstPiece));
      setNextPiece(createRandomTetromino());
    }
  }, [currentPiece, nextPiece, createRandomTetromino, createTetromino]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused || showAnimation) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    const dropInterval = Math.max(50, 1000 - (level - 1) * 100);
    gameLoopRef.current = setInterval(() => {
      movePiece('down');
    }, dropInterval);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameOver, isPaused, showAnimation, level, movePiece]);

  // Animation effect
  useEffect(() => {
    if (showAnimation && animationType) {
      const animationDuration = animationType === 'single' ? 1500 :
                                animationType === 'double' ? 2000 :
                                animationType === 'triple' ? 2500 :
                                animationType === 'quadruple' ? 3000 : 3500;

      const timer = setTimeout(() => {
        setShowAnimation(false);
        setAnimationType(null);
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [showAnimation, animationType]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePieceHandler();
          break;
        case ' ':
          e.preventDefault();
          dropPiece();
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
  }, [gameOver, movePiece, rotatePieceHandler, dropPiece, togglePause]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type.charCodeAt(0) - 64;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="tetris-row">
        {row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`tetris-cell ${cell ? `tetris-${String.fromCharCode(64 + cell)}` : 'tetris-empty'}`}
          />
        ))}
      </div>
    ));
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    const shape = TETROMINOES[nextPiece];
    return shape.map((row, y) => (
      <div key={y} className="next-row">
        {row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`next-cell ${cell ? `tetris-${nextPiece}` : 'next-empty'}`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="tetris-game">
      <div className="tetris-container">
        <div className="tetris-board-container">
          <div
            className="tetris-board"
            data-testid="tetris-board"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {renderBoard()}
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

          {showAnimation && animationType && (
            <div className={`tetris-animation-overlay ${animationType}`}>
              <div className="tetris-animation-content">
                {animationType === 'single' && (
                  <>
                    <div className="tetris-text">TETRIS!</div>
                    <div className="tetris-subtitle">4 Lines Cleared!</div>
                  </>
                )}
                {animationType === 'double' && (
                  <>
                    <div className="tetris-kings">
                      <span className="king">👑</span>
                      <span className="king">👑</span>
                    </div>
                    <div className="tetris-text double">DOUBLE TETRIS!</div>
                    <div className="tetris-kapow">KA-POW!</div>
                  </>
                )}
                {animationType === 'triple' && (
                  <>
                    <div className="tetris-text triple">TRIPLE TETRIS!</div>
                    <div className="tetris-subtitle epic">UNSTOPPABLE!</div>
                    <div className="tetris-effects">⚡⚡⚡</div>
                  </>
                )}
                {animationType === 'quadruple' && (
                  <>
                    <div className="tetris-text quadruple">QUADRUPLE TETRIS!</div>
                    <div className="tetris-subtitle legendary">LEGENDARY!</div>
                    <div className="tetris-effects">🔥🔥🔥🔥</div>
                  </>
                )}
                {animationType === 'quintuple' && (
                  <>
                    <div className="tetris-text quintuple">QUINTUPLE TETRIS!</div>
                    <div className="tetris-subtitle godlike">GODLIKE!!!</div>
                    <div className="tetris-effects ultimate">💎✨🌟✨💎</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="tetris-sidebar">
          <div className="game-info">
            <h2>Tetris</h2>
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Level</span>
              <span className="stat-value">{level}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Lines</span>
              <span className="stat-value">{lines}</span>
            </div>
          </div>

          <div className="next-piece">
            <h3>Next</h3>
            <div className="next-piece-container">
              {renderNextPiece()}
            </div>
          </div>

          <div className="controls">
            <h3>Controls</h3>
            <div className="control-list">
              <div>← → Move</div>
              <div>↓ Soft Drop</div>
              <div>↑ Rotate</div>
              <div>Space Hard Drop</div>
              <div>P Pause</div>
              <div>📱 Touch: Top half rotates, bottom half moves</div>
              <div>📱 Swipe down for soft drop</div>
              <div>📱 Double-tap bottom to slam drop</div>
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
    </div>
  );
};

export default Tetris;