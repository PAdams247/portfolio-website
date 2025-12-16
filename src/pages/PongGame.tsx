import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/PongGame.css';

const getCanvasSize = () => {
  const width = window.innerWidth;
  if (width <= 360) return { width: 280, height: 187 };
  if (width <= 480) return { width: 320, height: 213 };
  if (width <= 600) return { width: 360, height: 240 };
  if (width <= 768) return { width: 500, height: 333 };
  return { width: 800, height: 400 };
};

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();

  const [canvasSize, setCanvasSize] = useState(getCanvasSize());
  const CANVAS_WIDTH = canvasSize.width;
  const CANVAS_HEIGHT = canvasSize.height;

  const PADDLE_WIDTH = Math.max(10, CANVAS_WIDTH * 0.0125);
  const PADDLE_HEIGHT = Math.max(60, CANVAS_HEIGHT * 0.15);
  const BALL_RADIUS = Math.max(5, CANVAS_WIDTH * 0.00625);
  const PADDLE_SPEED = CANVAS_HEIGHT * 0.015;
  const BALL_SPEED = CANVAS_WIDTH * 0.005;

  const INITIAL_LEFT_PADDLE = {
    x: 20,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  const INITIAL_RIGHT_PADDLE = {
    x: CANVAS_WIDTH - 30,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  const INITIAL_BALL = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: BALL_RADIUS,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
  };

  const [leftPaddle, setLeftPaddle] = useState(INITIAL_LEFT_PADDLE);
  const [rightPaddle, setRightPaddle] = useState(INITIAL_RIGHT_PADDLE);
  const [ball, setBall] = useState(INITIAL_BALL);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const newSize = getCanvasSize();
      setCanvasSize(newSize);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLeftPaddle({
      x: 20,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    });
    setRightPaddle({
      x: CANVAS_WIDTH - 30,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    });
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      radius: BALL_RADIUS,
      dx: BALL_SPEED,
      dy: BALL_SPEED,
    });
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_RADIUS, BALL_SPEED]);

    // Update paddles based on keys pressed
    setLeftPaddle(prev => {
      let newY = prev.y;
      if (keysPressed.current.has('KeyW') && newY > 0) {
        newY -= PADDLE_SPEED;
      }
      if (keysPressed.current.has('KeyS') && newY < CANVAS_HEIGHT - PADDLE_HEIGHT) {
        newY += PADDLE_SPEED;
      }
      return { ...prev, y: newY };
    });

    setRightPaddle(prev => {
      let newY = prev.y;
      if (keysPressed.current.has('ArrowUp') && newY > 0) {
        newY -= PADDLE_SPEED;
      }
      if (keysPressed.current.has('ArrowDown') && newY < CANVAS_HEIGHT - PADDLE_HEIGHT) {
        newY += PADDLE_SPEED;
      }
      return { ...prev, y: newY };
    });

    // Update ball
    setBall(prevBall => {
      let newBall = { ...prevBall };
      newBall.x += newBall.dx;
      newBall.y += newBall.dy;

      // Ball collision with top and bottom walls
      if (newBall.y - newBall.radius <= 0 || newBall.y + newBall.radius >= CANVAS_HEIGHT) {
        newBall.dy = -newBall.dy;
      }

      // Ball collision with paddles
      if (checkCollision(newBall, leftPaddle)) {
        newBall.dx = Math.abs(newBall.dx);
        newBall.x = leftPaddle.x + leftPaddle.width + newBall.radius;
      }
      
      if (checkCollision(newBall, rightPaddle)) {
        newBall.dx = -Math.abs(newBall.dx);
        newBall.x = rightPaddle.x - newBall.radius;
      }

      // Ball goes out of bounds
      if (newBall.x < 0) {
        if (!scoringCooldownRef.current) {
          scoringCooldownRef.current = true;
          setRightScore(prev => {
            const newScore = prev + 1;
            if (newScore >= 10) {
              setGameOver(true);
              setWinner('Player 2');
              setIsPlaying(false);
            }
            return newScore;
          });
          // Reset cooldown after a short delay
          setTimeout(() => {
            scoringCooldownRef.current = false;
          }, 100);
        }
        // Return ball to center position immediately
        return {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
          dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
          dy: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
          radius: BALL_RADIUS
        };
      }

      if (newBall.x > CANVAS_WIDTH) {
        if (!scoringCooldownRef.current) {
          scoringCooldownRef.current = true;
          setLeftScore(prev => {
            const newScore = prev + 1;
            if (newScore >= 10) {
              setGameOver(true);
              setWinner('Player 1');
              setIsPlaying(false);
            }
            return newScore;
          });
          // Reset cooldown after a short delay
          setTimeout(() => {
            scoringCooldownRef.current = false;
          }, 100);
        }
        // Return ball to center position immediately
        return {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
          dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
          dy: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
          radius: BALL_RADIUS
        };
      }

      return newBall;
    });
  }, [isPlaying, gameOver, leftPaddle, rightPaddle, checkCollision]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas completely
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Fill with solid black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effects
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    ctx.shadowColor = '#ff4757';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [leftPaddle, rightPaddle, ball]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default behavior for arrow keys to stop page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    keysPressed.current.add(e.code);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Prevent default behavior for arrow keys to stop page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    keysPressed.current.delete(e.code);
  }, []);

  const startGame = () => {
    setLeftScore(0);
    setRightScore(0);
    setGameOver(false);
    setWinner('');
    setIsPlaying(true);
    resetBall();
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setLeftScore(0);
    setRightScore(0);
    setGameOver(false);
    setWinner('');
    setIsPlaying(false);
    resetBall();
    setLeftPaddle({
      x: 20,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    });
    setRightPaddle({
      x: CANVAS_WIDTH - 30,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (isPlaying) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      draw(); // Draw once when paused
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, updateGame, draw]);

  // Mobile touch controls for paddles
  const moveLeftPaddleUp = useCallback(() => {
    if (!isPlaying) return;
    setLeftPaddle(prev => ({
      ...prev,
      y: Math.max(0, prev.y - PADDLE_SPEED * 5)
    }));
  }, [isPlaying, PADDLE_SPEED]);

  const moveLeftPaddleDown = useCallback(() => {
    if (!isPlaying) return;
    setLeftPaddle(prev => ({
      ...prev,
      y: Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev.y + PADDLE_SPEED * 5)
    }));
  }, [isPlaying, CANVAS_HEIGHT, PADDLE_HEIGHT, PADDLE_SPEED]);

  const moveRightPaddleUp = useCallback(() => {
    if (!isPlaying) return;
    setRightPaddle(prev => ({
      ...prev,
      y: Math.max(0, prev.y - PADDLE_SPEED * 5)
    }));
  }, [isPlaying, PADDLE_SPEED]);

  const moveRightPaddleDown = useCallback(() => {
    if (!isPlaying) return;
    setRightPaddle(prev => ({
      ...prev,
      y: Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev.y + PADDLE_SPEED * 5)
    }));
  }, [isPlaying, CANVAS_HEIGHT, PADDLE_HEIGHT, PADDLE_SPEED]);

  return (
    <div className="pong-game">
      <div className="pong-container">
        <div className="pong-header">
          <h1>Pong Game</h1>
          <div className="pong-scores">
            <div className="score-display">
              <span className="player-label">Player 1</span>
              <span className="score">{leftScore}</span>
            </div>
            <div className="score-divider">-</div>
            <div className="score-display">
              <span className="player-label">Player 2</span>
              <span className="score">{rightScore}</span>
            </div>
          </div>
        </div>

        <div className="pong-game-area">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="pong-canvas"
          />
        </div>

        <div className="pong-controls">
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
            <h2>{winner} Wins!</h2>
            <p>Final Score: {leftScore} - {rightScore}</p>
            <button onClick={startGame} className="game-button restart-button">
              Play Again
            </button>
          </div>
        )}

        <div className="mobile-controls">
          <div className="player-controls">
            <h4>Player 1</h4>
            <div className="control-buttons">
              <button className="mobile-btn" onClick={moveLeftPaddleUp}>↑</button>
              <button className="mobile-btn" onClick={moveLeftPaddleDown}>↓</button>
            </div>
          </div>
          <div className="player-controls">
            <h4>Player 2</h4>
            <div className="control-buttons">
              <button className="mobile-btn" onClick={moveRightPaddleUp}>↑</button>
              <button className="mobile-btn" onClick={moveRightPaddleDown}>↓</button>
            </div>
          </div>
        </div>

        <div className="pong-instructions">
          <h3>How to Play:</h3>
          <div className="instructions-grid">
            <div className="player-instructions">
              <h4>Player 1 (Left)</h4>
              <ul>
                <li><strong>W</strong> or <strong>↑ Button</strong> - Move Up</li>
                <li><strong>S</strong> or <strong>↓ Button</strong> - Move Down</li>
              </ul>
            </div>
            <div className="player-instructions">
              <h4>Player 2 (Right)</h4>
              <ul>
                <li><strong>↑</strong> or <strong>↑ Button</strong> - Move Up</li>
                <li><strong>↓</strong> or <strong>↓ Button</strong> - Move Down</li>
              </ul>
            </div>
          </div>
          <p>First player to score 10 points wins!</p>
        </div>
      </div>
    </div>
  );
};

export default PongGame;
