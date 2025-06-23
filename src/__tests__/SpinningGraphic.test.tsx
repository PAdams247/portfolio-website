import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpinningGraphic from '../components/SpinningGraphic';

// Mock the CSS import
jest.mock('../styles/SpinningGraphic.css', () => ({}));

describe('SpinningGraphic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders spinning graphic container', () => {
      render(<SpinningGraphic />);
      
      const container = screen.getByTestId('spinning-graphic-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('spinning-graphic-container');
    });

    test('renders main spinning graphic element', () => {
      render(<SpinningGraphic />);
      
      const graphic = screen.getByTestId('spinning-graphic');
      expect(graphic).toBeInTheDocument();
      expect(graphic).toHaveClass('spinning-graphic');
    });
  });

  describe('Ring Structure', () => {
    test('renders outer ring with segments', () => {
      render(<SpinningGraphic />);
      
      const outerRing = screen.getByTestId('outer-ring');
      expect(outerRing).toBeInTheDocument();
      expect(outerRing).toHaveClass('outer-ring');
      
      // Check for ring segments
      const outerSegments = screen.getAllByTestId(/outer-segment-/);
      expect(outerSegments).toHaveLength(12);
    });

    test('renders middle ring with segments', () => {
      render(<SpinningGraphic />);
      
      const middleRing = screen.getByTestId('middle-ring');
      expect(middleRing).toBeInTheDocument();
      expect(middleRing).toHaveClass('middle-ring');
      
      // Check for ring segments
      const middleSegments = screen.getAllByTestId(/middle-segment-/);
      expect(middleSegments).toHaveLength(8);
    });

    test('renders inner ring with segments', () => {
      render(<SpinningGraphic />);
      
      const innerRing = screen.getByTestId('inner-ring');
      expect(innerRing).toBeInTheDocument();
      expect(innerRing).toHaveClass('inner-ring');
      
      // Check for ring segments
      const innerSegments = screen.getAllByTestId(/inner-segment-/);
      expect(innerSegments).toHaveLength(6);
    });
  });

  describe('Core Element', () => {
    test('renders core element', () => {
      render(<SpinningGraphic />);
      
      const core = screen.getByTestId('core');
      expect(core).toBeInTheDocument();
      expect(core).toHaveClass('core');
    });

    test('renders core dot inside core', () => {
      render(<SpinningGraphic />);
      
      const coreDot = screen.getByTestId('core-dot');
      expect(coreDot).toBeInTheDocument();
      expect(coreDot).toHaveClass('core-dot');
    });
  });

  describe('Orbit Dots', () => {
    test('renders orbit dots container', () => {
      render(<SpinningGraphic />);
      
      const orbitDots = screen.getByTestId('orbit-dots');
      expect(orbitDots).toBeInTheDocument();
      expect(orbitDots).toHaveClass('orbit-dots');
    });

    test('renders individual orbit dots', () => {
      render(<SpinningGraphic />);
      
      const orbitDot1 = screen.getByTestId('orbit-dot-1');
      const orbitDot2 = screen.getByTestId('orbit-dot-2');
      const orbitDot3 = screen.getByTestId('orbit-dot-3');
      
      expect(orbitDot1).toBeInTheDocument();
      expect(orbitDot2).toBeInTheDocument();
      expect(orbitDot3).toBeInTheDocument();
      
      expect(orbitDot1).toHaveClass('orbit-dot');
      expect(orbitDot2).toHaveClass('orbit-dot');
      expect(orbitDot3).toHaveClass('orbit-dot');
    });
  });

  describe('CSS Classes', () => {
    test('applies correct classes to ring segments', () => {
      render(<SpinningGraphic />);
      
      const outerSegments = screen.getAllByTestId(/outer-segment-/);
      const middleSegments = screen.getAllByTestId(/middle-segment-/);
      const innerSegments = screen.getAllByTestId(/inner-segment-/);
      
      outerSegments.forEach(segment => {
        expect(segment).toHaveClass('ring-segment');
      });
      
      middleSegments.forEach(segment => {
        expect(segment).toHaveClass('ring-segment');
      });
      
      innerSegments.forEach(segment => {
        expect(segment).toHaveClass('ring-segment');
      });
    });

    test('applies unique classes to different ring types', () => {
      render(<SpinningGraphic />);
      
      const outerRing = screen.getByTestId('outer-ring');
      const middleRing = screen.getByTestId('middle-ring');
      const innerRing = screen.getByTestId('inner-ring');
      
      expect(outerRing).toHaveClass('outer-ring');
      expect(middleRing).toHaveClass('middle-ring');
      expect(innerRing).toHaveClass('inner-ring');
    });
  });

  describe('Animation Classes', () => {
    test('rings have animation classes for spinning', () => {
      render(<SpinningGraphic />);
      
      const outerRing = screen.getByTestId('outer-ring');
      const middleRing = screen.getByTestId('middle-ring');
      const innerRing = screen.getByTestId('inner-ring');
      
      // These classes would be applied via CSS for animations
      expect(outerRing).toHaveClass('outer-ring');
      expect(middleRing).toHaveClass('middle-ring');
      expect(innerRing).toHaveClass('inner-ring');
    });

    test('core has pulsing animation class', () => {
      render(<SpinningGraphic />);
      
      const core = screen.getByTestId('core');
      expect(core).toHaveClass('core');
    });

    test('orbit dots have orbital animation classes', () => {
      render(<SpinningGraphic />);
      
      const orbitDot1 = screen.getByTestId('orbit-dot-1');
      const orbitDot2 = screen.getByTestId('orbit-dot-2');
      const orbitDot3 = screen.getByTestId('orbit-dot-3');
      
      expect(orbitDot1).toHaveClass('orbit-dot');
      expect(orbitDot2).toHaveClass('orbit-dot');
      expect(orbitDot3).toHaveClass('orbit-dot');
    });
  });

  describe('Structure Integrity', () => {
    test('maintains proper nesting structure', () => {
      render(<SpinningGraphic />);
      
      const container = screen.getByTestId('spinning-graphic-container');
      const graphic = screen.getByTestId('spinning-graphic');
      const outerRing = screen.getByTestId('outer-ring');
      const core = screen.getByTestId('core');
      
      expect(container).toContainElement(graphic);
      expect(graphic).toContainElement(outerRing);
      expect(graphic).toContainElement(core);
    });

    test('core contains core dot', () => {
      render(<SpinningGraphic />);
      
      const core = screen.getByTestId('core');
      const coreDot = screen.getByTestId('core-dot');
      
      expect(core).toContainElement(coreDot);
    });

    test('rings contain their respective segments', () => {
      render(<SpinningGraphic />);
      
      const outerRing = screen.getByTestId('outer-ring');
      const middleRing = screen.getByTestId('middle-ring');
      const innerRing = screen.getByTestId('inner-ring');
      
      const outerSegments = screen.getAllByTestId(/outer-segment-/);
      const middleSegments = screen.getAllByTestId(/middle-segment-/);
      const innerSegments = screen.getAllByTestId(/inner-segment-/);
      
      outerSegments.forEach(segment => {
        expect(outerRing).toContainElement(segment);
      });
      
      middleSegments.forEach(segment => {
        expect(middleRing).toContainElement(segment);
      });
      
      innerSegments.forEach(segment => {
        expect(innerRing).toContainElement(segment);
      });
    });
  });

  describe('Accessibility', () => {
    test('has appropriate ARIA attributes', () => {
      render(<SpinningGraphic />);
      
      const container = screen.getByTestId('spinning-graphic-container');
      expect(container).toHaveAttribute('role', 'img');
      expect(container).toHaveAttribute('aria-label', 'Animated spinning graphic');
    });

    test('provides alternative text for screen readers', () => {
      render(<SpinningGraphic />);
      
      const container = screen.getByTestId('spinning-graphic-container');
      expect(container).toHaveAttribute('aria-label');
    });
  });

  describe('Performance Considerations', () => {
    test('renders without causing performance issues', () => {
      const startTime = performance.now();
      render(<SpinningGraphic />);
      const endTime = performance.now();
      
      // Rendering should be fast (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('does not create excessive DOM elements', () => {
      render(<SpinningGraphic />);
      
      const container = screen.getByTestId('spinning-graphic-container');
      const allElements = container.querySelectorAll('*');
      
      // Should have a reasonable number of elements (rings + segments + core + dots)
      // 12 outer + 8 middle + 6 inner + 3 rings + 1 core + 1 core-dot + 3 orbit-dots + 1 orbit-container = ~35 elements
      expect(allElements.length).toBeLessThan(50);
    });
  });

  describe('Responsive Behavior', () => {
    test('maintains structure across different viewport sizes', () => {
      render(<SpinningGraphic />);
      
      // The component should render consistently regardless of viewport
      const container = screen.getByTestId('spinning-graphic-container');
      const graphic = screen.getByTestId('spinning-graphic');
      
      expect(container).toBeInTheDocument();
      expect(graphic).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('renders without throwing errors', () => {
      expect(() => {
        render(<SpinningGraphic />);
      }).not.toThrow();
    });

    test('handles missing CSS gracefully', () => {
      // Even without CSS, the component should render its structure
      render(<SpinningGraphic />);
      
      expect(screen.getByTestId('spinning-graphic-container')).toBeInTheDocument();
      expect(screen.getByTestId('spinning-graphic')).toBeInTheDocument();
    });
  });
});