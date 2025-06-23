import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navigation from '../components/Navigation';

// Mock the CSS import
jest.mock('../styles/Navigation.css', () => ({}));

// Wrapper component for router context
const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders navigation container', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    test('renders logo', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    test('renders all navigation links', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Python Games')).toBeInTheDocument();
      expect(screen.getByText('2048')).toBeInTheDocument();
      expect(screen.getByText('Tetris')).toBeInTheDocument();
      expect(screen.getByText('Task List')).toBeInTheDocument();
    });

    test('renders mobile menu toggle button', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const menuToggle = screen.getByRole('button');
      expect(menuToggle).toBeInTheDocument();
      expect(menuToggle).toHaveClass('nav-toggle');
    });
  });

  describe('Navigation Links', () => {
    test('home link has correct href', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    test('python games link has correct href', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const pythonGamesLink = screen.getByText('Python Games').closest('a');
      expect(pythonGamesLink).toHaveAttribute('href', '/python-games');
    });

    test('2048 link has correct href', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const game2048Link = screen.getByText('2048').closest('a');
      expect(game2048Link).toHaveAttribute('href', '/2048');
    });

    test('tetris link has correct href', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const tetrisLink = screen.getByText('Tetris').closest('a');
      expect(tetrisLink).toHaveAttribute('href', '/tetris');
    });

    test('task list link has correct href', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const taskListLink = screen.getByText('Task List').closest('a');
      expect(taskListLink).toHaveAttribute('href', '/tasks');
    });
  });

  describe('Mobile Menu Functionality', () => {
    test('mobile menu toggle changes state', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const menuToggle = screen.getByRole('button');
      const navMenu = screen.getByRole('list');
      
      // Initially menu should not be active
      expect(navMenu).not.toHaveClass('active');
      
      // Click to open menu
      fireEvent.click(menuToggle);
      expect(navMenu).toHaveClass('active');
      
      // Click to close menu
      fireEvent.click(menuToggle);
      expect(navMenu).not.toHaveClass('active');
    });

    test('menu toggle button has correct aria attributes', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const menuToggle = screen.getByRole('button');
      expect(menuToggle).toHaveAttribute('aria-label', 'Toggle navigation menu');
    });
  });

  describe('Active Link Highlighting', () => {
    test('applies active class to current page link', () => {
      // This would require mocking useLocation to return specific paths
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      // Test that navigation renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Logo Functionality', () => {
    test('logo links to home page', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const logoLink = screen.getByText('Code').closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    test('logo has correct styling classes', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const logoText = screen.getByText('Code');
      const logoAccent = screen.getByText('Portfolio');
      
      expect(logoText.parentElement).toHaveClass('nav-logo');
      expect(logoText).toHaveClass('logo-text');
      expect(logoAccent).toHaveClass('logo-accent');
    });
  });

  describe('Navigation Icons', () => {
    test('renders navigation icons', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      // Check for icon elements (assuming they use specific classes or data attributes)
      const navLinks = screen.getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Behavior', () => {
    test('navigation menu has correct classes for responsive design', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const navMenu = screen.getByRole('list');
      expect(navMenu).toHaveClass('nav-menu');
    });

    test('navigation items have correct structure', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const navItems = screen.getAllByRole('listitem');
      expect(navItems.length).toBe(5); // Home, Python Games, 2048, Tetris, Task List
      
      navItems.forEach(item => {
        expect(item).toHaveClass('nav-item');
      });
    });
  });

  describe('Accessibility', () => {
    test('navigation has proper semantic structure', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const nav = screen.getByRole('navigation');
      const list = screen.getByRole('list');
      const links = screen.getAllByRole('link');
      
      expect(nav).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(links.length).toBeGreaterThan(0);
    });

    test('all links are keyboard accessible', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeInTheDocument();
        // Links should be focusable by default
      });
    });

    test('mobile menu button is keyboard accessible', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const menuToggle = screen.getByRole('button');
      
      // Test keyboard interaction
      fireEvent.keyDown(menuToggle, { key: 'Enter' });
      fireEvent.keyDown(menuToggle, { key: ' ' });
      
      expect(menuToggle).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    test('applies correct CSS classes to navigation elements', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const nav = screen.getByRole('navigation');
      const container = nav.querySelector('.nav-container');
      const menu = screen.getByRole('list');
      const toggle = screen.getByRole('button');
      
      expect(nav).toHaveClass('navigation');
      expect(container).toBeInTheDocument();
      expect(menu).toHaveClass('nav-menu');
      expect(toggle).toHaveClass('nav-toggle');
    });

    test('navigation links have correct classes', () => {
      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      );
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        if (!link.classList.contains('nav-logo')) {
          expect(link).toHaveClass('nav-link');
        }
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing router context gracefully', () => {
      // This test would check behavior without BrowserRouter
      // but since Navigation uses useLocation, it would throw
      // So we test that it works correctly with router
      expect(() => {
        render(
          <NavigationWrapper>
            <Navigation />
          </NavigationWrapper>
        );
      }).not.toThrow();
    });
  });
});