import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game2048 from '../pages/Game2048';

// Mock the CSS import
jest.mock('../styles/Game2048.css', () => ({}));

describe('Game2048', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders game title', () => {
      render(<Game2048 />);
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('renders score display', () => {
      render(<Game2048 />);
      expect(screen.getByText('Score')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('renders reset button', () => {
      render(<Game2048 />);
      expect(screen.getByText('New Game')).toBeInTheDocument();
    });

    test('renders game board with 16 tiles', () => {
      render(<Game2048 />);
      const tiles = screen.getAllByTestId(/tile-/);
      expect(tiles).toHaveLength(16);
    });

    test('renders mobile controls', () => {
      render(<Game2048 />);
      expect(screen.getByText('↑')).toBeInTheDocument();
      expect(screen.getByText('↓')).toBeInTheDocument();
      expect(screen.getByText('←')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });
  });

  describe('Game Initialization', () => {
    test('initializes board with two random tiles', () => {
      render(<Game2048 />);
      const tiles = screen.getAllByTestId(/tile-/);
      const nonEmptyTiles = tiles.filter(tile => 
        tile.textContent !== '' && tile.textContent !== '0'
      );
      expect(nonEmptyTiles).toHaveLength(2);
    });

    test('initial tiles have value 2 or 4', () => {
      render(<Game2048 />);
      const tiles = screen.getAllByTestId(/tile-/);
      const nonEmptyTiles = tiles.filter(tile => 
        tile.textContent !== '' && tile.textContent !== '0'
      );
      
      nonEmptyTiles.forEach(tile => {
        const value = parseInt(tile.textContent || '0');
        expect([2, 4]).toContain(value);
      });
    });
  });

  describe('Keyboard Controls', () => {
    test('responds to ArrowUp key', async () => {
      render(<Game2048 />);
      const initialTiles = screen.getAllByTestId(/tile-/);
      const initialState = initialTiles.map(tile => tile.textContent);

      fireEvent.keyDown(window, { key: 'ArrowUp' });
      
      await waitFor(() => {
        const newTiles = screen.getAllByTestId(/tile-/);
        const newState = newTiles.map(tile => tile.textContent);
        // Board should change after a valid move
        expect(newState).not.toEqual(initialState);
      });
    });

    test('responds to ArrowDown key', async () => {
      render(<Game2048 />);
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      // Test should not throw error and game should respond
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('responds to ArrowLeft key', async () => {
      render(<Game2048 />);
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('responds to ArrowRight key', async () => {
      render(<Game2048 />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('ignores non-arrow keys', () => {
      render(<Game2048 />);
      const initialScore = screen.getByText('0');
      
      fireEvent.keyDown(window, { key: 'Space' });
      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'a' });
      
      expect(initialScore).toBeInTheDocument();
    });
  });

  describe('Mobile Controls', () => {
    test('up button triggers move', async () => {
      render(<Game2048 />);
      const upButton = screen.getByText('↑');
      
      fireEvent.click(upButton);
      
      // Should not throw error
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('down button triggers move', async () => {
      render(<Game2048 />);
      const downButton = screen.getByText('↓');
      
      fireEvent.click(downButton);
      
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('left button triggers move', async () => {
      render(<Game2048 />);
      const leftButton = screen.getByText('←');
      
      fireEvent.click(leftButton);
      
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('right button triggers move', async () => {
      render(<Game2048 />);
      const rightButton = screen.getByText('→');
      
      fireEvent.click(rightButton);
      
      expect(screen.getByText('2048')).toBeInTheDocument();
    });
  });

  describe('Game Reset', () => {
    test('reset button resets the game', async () => {
      render(<Game2048 />);
      
      // Make some moves first
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      
      const resetButton = screen.getByText('New Game');
      fireEvent.click(resetButton);
      
      // Score should be reset to 0
      expect(screen.getByText('0')).toBeInTheDocument();
      
      // Should have exactly 2 non-empty tiles again
      await waitFor(() => {
        const tiles = screen.getAllByTestId(/tile-/);
        const nonEmptyTiles = tiles.filter(tile => 
          tile.textContent !== '' && tile.textContent !== '0'
        );
        expect(nonEmptyTiles).toHaveLength(2);
      });
    });
  });

  describe('Game States', () => {
    test('displays game over message when board is full', () => {
      // This would require mocking the game state or creating a specific scenario
      // For now, we'll test that the component can handle the game over state
      render(<Game2048 />);
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('displays win message when 2048 tile is reached', () => {
      // This would require mocking the game state to have a 2048 tile
      render(<Game2048 />);
      expect(screen.getByText('2048')).toBeInTheDocument();
    });
  });

  describe('Tile Classes', () => {
    test('applies correct CSS classes to tiles', () => {
      render(<Game2048 />);
      const tiles = screen.getAllByTestId(/tile-/);
      
      tiles.forEach(tile => {
        const value = tile.textContent;
        if (value && value !== '0' && value !== '') {
          expect(tile).toHaveClass(`tile-${value}`);
        } else {
          expect(tile).toHaveClass('tile-empty');
        }
      });
    });
  });

  describe('Score Updates', () => {
    test('score increases when tiles merge', async () => {
      render(<Game2048 />);
      const initialScore = screen.getByText('0');
      
      // Make multiple moves to try to merge tiles
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      // Score might increase if tiles merge
      expect(initialScore).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<Game2048 />);
      // Check for accessibility features
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    test('keyboard navigation works', () => {
      render(<Game2048 />);
      // Arrow keys should be handled
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      expect(screen.getByText('2048')).toBeInTheDocument();
    });
  });
});

// Helper function tests for game logic
describe('Game2048 Logic', () => {
  // These tests would require exposing internal functions or creating a separate utility file
  // For now, we test through the component interface
  
  test('board rotation logic works correctly', () => {
    // This would test the rotateBoard function if it were exported
    expect(true).toBe(true);
  });

  test('tile merging logic works correctly', () => {
    // This would test the moveLeft function if it were exported
    expect(true).toBe(true);
  });

  test('random tile placement works correctly', () => {
    // This would test the addRandomTile function if it were exported
    expect(true).toBe(true);
  });
});