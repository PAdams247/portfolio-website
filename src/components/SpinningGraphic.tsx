import React from 'react';
import '../styles/SpinningGraphic.css';

const SpinningGraphic: React.FC = () => {
  return (
    <div 
      className="spinning-graphic-container" 
      data-testid="spinning-graphic-container"
      role="img"
      aria-label="Animated spinning graphic"
    >
      <div className="spinning-graphic" data-testid="spinning-graphic">
        <div className="outer-ring" data-testid="outer-ring">
          {Array.from({ length: 12 }, (_, i) => (
            <div 
              key={i} 
              className="ring-segment" 
              data-testid={`outer-segment-${i}`}
            ></div>
          ))}
        </div>
        <div className="middle-ring" data-testid="middle-ring">
          {Array.from({ length: 8 }, (_, i) => (
            <div 
              key={i} 
              className="ring-segment" 
              data-testid={`middle-segment-${i}`}
            ></div>
          ))}
        </div>
        <div className="inner-ring" data-testid="inner-ring">
          {Array.from({ length: 6 }, (_, i) => (
            <div 
              key={i} 
              className="ring-segment" 
              data-testid={`inner-segment-${i}`}
            ></div>
          ))}
          <div className="core" data-testid="core">
            <div className="core-dot" data-testid="core-dot"></div>
          </div>
        </div>
        <div className="orbit-dots" data-testid="orbit-dots">
          <div className="orbit-dot" data-testid="orbit-dot-1"></div>
          <div className="orbit-dot" data-testid="orbit-dot-2"></div>
          <div className="orbit-dot" data-testid="orbit-dot-3"></div>
        </div>
      </div>
    </div>
  );
};

export default SpinningGraphic;