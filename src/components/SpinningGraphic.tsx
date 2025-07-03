import React from 'react';
import '../styles/SpinningGraphic.css';

const SpinningGraphic: React.FC = () => {
  try {
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
            <div className="orbit-dot orbit-dot-1" data-testid="orbit-dot-1"></div>
            <div className="orbit-dot orbit-dot-2" data-testid="orbit-dot-2"></div>
            <div className="orbit-dot orbit-dot-3" data-testid="orbit-dot-3"></div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Fallback in case of any rendering errors
    return (
      <div 
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #00d4ff',
          fontSize: '1.2rem',
          color: '#00d4ff'
        }}
      >
        ⚡
      </div>
    );
  }
};

export default SpinningGraphic;