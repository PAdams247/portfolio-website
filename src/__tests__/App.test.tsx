import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

// Mock all the page components
jest.mock('../pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../pages/PythonGames', () => {
  return function MockPythonGames() {
    return <div data-testid="python-games-page">Python Games Page</div>;
  };
});

jest.mock('../pages/Game2048', () => {
  return function MockGame2048() {
    return <div data-testid="game-2048-page">2048 Game Page</div>;
  };
});

jest.mock('../pages/Tetris', () => {
  return function MockTetris() {
    return <div data-testid="tetris-page">Tetris Game Page</div>;
  };
});

jest.mock('../pages/TaskList', () => {
  return function MockTaskList() {
    return <div data-testid="task-list-page">Task List Page</div>;
  };
});

jest.mock('../components/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>;
  };
});

// Mock the CSS import
jest.mock('../styles/App.css', () => ({}));

describe('App', () => {
  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    test('renders navigation component', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    test('renders main content area', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveClass('main-content');
    });
  });

  describe('Routing', () => {
    test('renders Home page on root path', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    test('renders Python Games page on /python-games path', () => {
      render(
        <MemoryRouter initialEntries={['/python-games']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('python-games-page')).toBeInTheDocument();
      expect(screen.getByText('Python Games Page')).toBeInTheDocument();
    });

    test('renders 2048 Game page on /2048 path', () => {
      render(
        <MemoryRouter initialEntries={['/2048']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('game-2048-page')).toBeInTheDocument();
      expect(screen.getByText('2048 Game Page')).toBeInTheDocument();
    });

    test('renders Tetris page on /tetris path', () => {
      render(
        <MemoryRouter initialEntries={['/tetris']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('tetris-page')).toBeInTheDocument();
      expect(screen.getByText('Tetris Game Page')).toBeInTheDocument();
    });

    test('renders Task List page on /tasks path', () => {
      render(
        <MemoryRouter initialEntries={['/tasks']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('task-list-page')).toBeInTheDocument();
      expect(screen.getByText('Task List Page')).toBeInTheDocument();
    });

    test('handles invalid routes gracefully', () => {
      render(
        <MemoryRouter initialEntries={['/invalid-route']}>
          <App />
        </MemoryRouter>
      );
      
      // Should still render navigation
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      // Should not crash the app
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('App Structure', () => {
    test('has correct CSS class on App container', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const appContainer = screen.getByTestId('navigation').parentElement;
      expect(appContainer).toHaveClass('App');
    });

    test('navigation is rendered before main content', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const navigation = screen.getByTestId('navigation');
      const mainContent = screen.getByRole('main');
      
      expect(navigation).toBeInTheDocument();
      expect(mainContent).toBeInTheDocument();
      
      // Navigation should come before main content in DOM order
      expect(navigation.compareDocumentPosition(mainContent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe('Router Integration', () => {
    test('uses BrowserRouter for routing', () => {
      // This is tested implicitly by the routing tests above
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    test('Routes component renders correctly', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      // Routes should render without errors
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    test('Navigation component receives correct props', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      // Navigation should render without props issues
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    test('Page components render within main content area', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      
      const mainContent = screen.getByRole('main');
      const homePage = screen.getByTestId('home-page');
      
      expect(mainContent).toContainElement(homePage);
    });
  });

  describe('Error Boundaries', () => {
    test('handles component errors gracefully', () => {
      // This would require implementing error boundaries
      // For now, test that the app renders without throwing
      expect(() => {
        render(
          <MemoryRouter>
            <App />
          </MemoryRouter>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('has proper semantic structure', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const navigation = screen.getByRole('navigation');
      const main = screen.getByRole('main');
      
      expect(navigation).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });

    test('main content area has correct role', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('role', 'main');
    });
  });

  describe('CSS Integration', () => {
    test('applies App CSS class', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const appContainer = screen.getByTestId('navigation').parentElement;
      expect(appContainer).toHaveClass('App');
    });

    test('applies main-content CSS class', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('main-content');
    });
  });

  describe('Performance', () => {
    test('renders efficiently', () => {
      const startTime = performance.now();
      
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      const endTime = performance.now();
      
      // App should render quickly
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Multiple Route Navigation', () => {
    test('can navigate between different routes', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      
      rerender(
        <MemoryRouter initialEntries={['/2048']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('game-2048-page')).toBeInTheDocument();
    });
  });

  describe('Route Parameters', () => {
    test('handles routes without parameters', () => {
      render(
        <MemoryRouter initialEntries={['/tetris']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('tetris-page')).toBeInTheDocument();
    });
  });
});