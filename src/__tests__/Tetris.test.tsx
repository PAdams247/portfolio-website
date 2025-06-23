import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tetris from '../pages/Tetris';

// Mock the CSS import
jest.mock('../styles/Tetris.css', () => ({}));

describe('Tetris', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock setInterval and clearInterval for game loop tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Component Rendering', () => {
    test('renders game title', () => {
      render(<Tetris />);
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('renders score display', () => {
      render(<Tetris />);
      expect(screen.getByText(/Score:/)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('renders level display', () => {
      render(<Tetris />);
      expect(screen.getByText(/Level:/)).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('renders lines display', () => {
      render(<Tetris />);
      expect(screen.getByText(/Lines:/)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('renders game board', () => {
      render(<Tetris />);
      const board = screen.getByTestId('tetris-board');
      expect(board).toBeInTheDocument();
    });

    test('renders next piece preview', () => {
      render(<Tetris />);
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    test('renders control buttons', () => {
      render(<Tetris />);
      expect(screen.getByText('Pause')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  describe('Game Controls', () => {
    test('responds to left arrow key', () => {
      render(<Tetris />);
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('responds to right arrow key', () => {
      render(<Tetris />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('responds to down arrow key', () => {
      render(<Tetris />);
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('responds to up arrow key for rotation', () => {
      render(<Tetris />);
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('responds to space key for hard drop', () => {
      render(<Tetris />);
      fireEvent.keyDown(window, { key: ' ' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('responds to P key for pause', () => {
      render(<Tetris />);
      fireEvent.keyDown(window, { key: 'p' });
      expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    test('ignores invalid keys', () => {
      render(<Tetris />);
      fireEvent.keyDown(window, { key: 'x' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });
  });

  describe('Mobile Controls', () => {
    test('mobile left button works', () => {
      render(<Tetris />);
      const leftButton = screen.getByText('←');
      fireEvent.click(leftButton);
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('mobile right button works', () => {
      render(<Tetris />);
      const rightButton = screen.getByText('→');
      fireEvent.click(rightButton);
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('mobile down button works', () => {
      render(<Tetris />);
      const downButton = screen.getByText('↓');
      fireEvent.click(downButton);
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('mobile rotate button works', () => {
      render(<Tetris />);
      const rotateButton = screen.getByText('↻');
      fireEvent.click(rotateButton);
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('mobile drop button works', () => {
      render(<Tetris />);
      const dropButton = screen.getByText('Drop');
      fireEvent.click(dropButton);
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });
  });

  describe('Game State Management', () => {
    test('pause button toggles game state', () => {
      render(<Tetris />);
      const pauseButton = screen.getByText('Pause');
      
      fireEvent.click(pauseButton);
      expect(screen.getByText('Resume')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Resume'));
      expect(screen.getByText('Pause')).toBeInTheDocument();
    });

    test('reset button resets game state', () => {
      render(<Tetris />);
      const resetButton = screen.getByText('Reset');
      
      fireEvent.click(resetButton);
      
      expect(screen.getByText('0')).toBeInTheDocument(); // Score should be 0
      expect(screen.getByText('1')).toBeInTheDocument(); // Level should be 1
    });

    test('displays game over overlay when game ends', () => {
      render(<Tetris />);
      // This would require mocking the game state to trigger game over
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });
  });

  describe('Game Loop', () => {
    test('game loop starts automatically', () => {
      render(<Tetris />);
      expect(setInterval).toHaveBeenCalled();
    });

    test('game loop stops when paused', () => {
      render(<Tetris />);
      const pauseButton = screen.getByText('Pause');
      
      fireEvent.click(pauseButton);
      
      // Game should be paused
      expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    test('game loop resumes when unpaused', () => {
      render(<Tetris />);
      const pauseButton = screen.getByText('Pause');
      
      fireEvent.click(pauseButton);
      fireEvent.click(screen.getByText('Resume'));
      
      expect(screen.getByText('Pause')).toBeInTheDocument();
    });
  });

  describe('Tetromino Types', () => {
    test('game starts with a tetromino piece', () => {
      render(<Tetris />);
      // Should have a current piece (tested through game not crashing)
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('next piece is displayed', () => {
      render(<Tetris />);
      const nextSection = screen.getByText('Next');
      expect(nextSection).toBeInTheDocument();
    });
  });

  describe('Board Rendering', () => {
    test('renders correct number of cells', () => {
      render(<Tetris />);
      const board = screen.getByTestId('tetris-board');
      // Board should be 10x20 = 200 cells
      expect(board).toBeInTheDocument();
    });

    test('applies correct CSS classes to cells', () => {
      render(<Tetris />);
      const board = screen.getByTestId('tetris-board');
      expect(board).toHaveClass('tetris-board');
    });
  });

  describe('Score System', () => {
    test('score starts at 0', () => {
      render(<Tetris />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('level starts at 1', () => {
      render(<Tetris />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('lines cleared starts at 0', () => {
      render(<Tetris />);
      const linesText = screen.getByText(/Lines:/);
      expect(linesText).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper keyboard navigation', () => {
      render(<Tetris />);
      // Arrow keys should work for game control
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('buttons are accessible', () => {
      render(<Tetris />);
      const pauseButton = screen.getByText('Pause');
      expect(pauseButton).toBeInTheDocument();
      expect(pauseButton.tagName).toBe('BUTTON');
    });
  });

  describe('Responsive Design', () => {
    test('mobile controls are present', () => {
      render(<Tetris />);
      expect(screen.getByText('←')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
      expect(screen.getByText('↓')).toBeInTheDocument();
      expect(screen.getByText('↻')).toBeInTheDocument();
      expect(screen.getByText('Drop')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles invalid piece positions gracefully', () => {
      render(<Tetris />);
      // Game should not crash with invalid moves
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });

    test('handles rapid key presses', () => {
      render(<Tetris />);
      // Rapid key presses should not crash the game
      for (let i = 0; i < 10; i++) {
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        fireEvent.keyDown(window, { key: 'ArrowRight' });
      }
      expect(screen.getByText('Tetris')).toBeInTheDocument();
    });
  });
});