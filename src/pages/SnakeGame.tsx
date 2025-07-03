import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/SnakeGame.css';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 150;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  // Removed unused direction state variable
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);
  const lastProcessedDirectionRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    // Fixed no-loop-func warning by using a different approach
    const isPositionOccupied = (pos: Position) =>
      currentSnake.some(segment => segment.x === pos.x && segment.y === pos.y);

    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (isPositionOccupied(newFood));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    // Process direction queue to prevent U-turns
    if (directionQueueRef.current.length > 0) {
      const nextDirection = directionQueueRef.current.shift()!;
      const currentDirection = lastProcessedDirectionRef.current;

      // Only allow direction change if it's not a direct reversal
      const isValidDirection =
        (nextDirection === 'UP' && currentDirection !== 'DOWN') ||
        (nextDirection === 'DOWN' && currentDirection !== 'UP') ||
        (nextDirection === 'LEFT' && currentDirection !== 'RIGHT') ||
        (nextDirection === 'RIGHT' && currentDirection !== 'LEFT');

      if (isValidDirection) {
        // Removed setDirection call since direction state was removed
        lastProcessedDirectionRef.current = nextDirection;
      }
    }

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Move head based on current direction
      switch (lastProcessedDirectionRef.current) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision - this is the key fix
      if (head.x === food.x && head.y === food.y) {
        // Snake ate food - grow (don't remove tail) and generate new food
        setScore(prev => prev + 10);
        setFood(generateFood(newSnake));
        // Return newSnake without removing tail (snake grows)
        return newSnake;
      } else {
        // Snake didn't eat food - remove tail (snake doesn't grow)
        newSnake.pop();
        return newSnake;
      }
    });
  }, [gameOver, isPlaying, generateFood, food]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || gameOver) return;

    let newDirection: Direction | null = null;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newDirection = 'UP';
        break;
      case 'ArrowDown':
        e.preventDefault();
        newDirection = 'DOWN';
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newDirection = 'LEFT';
        break;
      case 'ArrowRight':
        e.preventDefault();
        newDirection = 'RIGHT';
        break;
    }

    // Add direction to queue if it's valid and not already the last direction in queue
    if (newDirection &&
        directionQueueRef.current.length < 2 &&
        directionQueueRef.current[directionQueueRef.current.length - 1] !== newDirection) {
      directionQueueRef.current.push(newDirection);
    }
  }, [isPlaying, gameOver]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    // Removed setDirection call since direction state was removed
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    // Reset direction queue and last processed direction
    directionQueueRef.current = [];
    lastProcessedDirectionRef.current = 'RIGHT';
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    // Removed setDirection call since direction state was removed
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    // Reset direction queue and last processed direction
    directionQueueRef.current = [];
    lastProcessedDirectionRef.current = 'RIGHT';
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, moveSnake]);

  // Separate effect to handle tail removal when no food is eaten
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    setSnake(currentSnake => {
      if (currentSnake.length <= 1) return currentSnake;

      const head = currentSnake[0];

      let tailRemoved = false;

      setFood(currentFood => {
        if (head.x === currentFood.x && head.y === currentFood.y) {
          // Food was eaten, don't remove tail (snake grows)
          return currentFood;
        } else {
          // No food eaten, remove tail (snake doesn't grow)
          tailRemoved = true;
          return currentFood;
        }
      });

      if (tailRemoved) {
        return currentSnake.slice(0, -1);
      } else {
        return currentSnake;
      }
    });
  }, [snake, isPlaying, gameOver]);

  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        let cellClass = 'snake-cell';
        
        // Check if this cell contains snake
        const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((segment, index) => index > 0 && segment.x === x && segment.y === y);
        
        // Check if this cell contains food
        const isFood = food.x === x && food.y === y;

        if (isSnakeHead) {
          cellClass += ' snake-head';
        } else if (isSnakeBody) {
          cellClass += ' snake-body';
        } else if (isFood) {
          cellClass += ' snake-food';
        }

        board.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
      }
    }
    return board;
  };

  return (
    <div className="snake-game">
      <div className="snake-container">
        <div className="snake-header">
          <h1>Snake Game</h1>
          <div className="snake-score">Score: {score}</div>
        </div>

        <div className="snake-board">
          {renderBoard()}
        </div>

        <div className="snake-controls">
          {!isPlaying && !gameOver && (
            <button onClick={startGame} className="game-button start-button">
              Start Game
            </button>
          )}
          
          {isPlaying && (
            <button onClick={pauseGame} className="game-button pause-button">
              Pause
            </button>
          )}
          
          {(isPlaying || gameOver) && (
            <button onClick={resetGame} className="game-button reset-button">
              Reset
            </button>
          )}
        </div>

        {gameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={startGame} className="game-button restart-button">
              Play Again
            </button>
          </div>
        )}

        <div className="snake-instructions">
          <h3>How to Play:</h3>
          <ul>
            <li>Use arrow keys to control the snake</li>
            <li>Eat the red food to grow and increase your score</li>
            <li>Avoid hitting the walls or your own tail</li>
            <li>Try to get the highest score possible!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;