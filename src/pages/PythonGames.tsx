import React from 'react';
import '../styles/ProjectPage.css';

const PythonGames: React.FC = () => {
  const games = [
    {
      name: 'Snake Game',
      description: 'Classic snake game with growing mechanics and score tracking',
      features: ['Arrow key controls', 'Score system', 'Game over detection', 'Responsive gameplay'],
      status: 'Completed'
    },
    {
      name: 'Pong',
      description: 'Two-player paddle game with ball physics',
      features: ['Two-player mode', 'Ball physics', 'Score tracking', 'Collision detection'],
      status: 'Completed'
    },
    {
      name: 'Space Invaders',
      description: 'Shoot-em-up game with waves of enemies',
      features: ['Enemy waves', 'Power-ups', 'Multiple lives', 'Increasing difficulty'],
      status: 'In Progress'
    },
    {
      name: 'Breakout',
      description: 'Brick-breaking game with paddle and ball',
      features: ['Brick destruction', 'Ball physics', 'Multiple levels', 'Power-ups'],
      status: 'Planned'
    }
  ];

  return (
    <div className="project-page">
      <div className="project-header">
        <div className="project-icon-large">🐍</div>
        <h1 className="project-title">Python Games</h1>
        <p className="project-subtitle">
          Collection of classic arcade games built with Python and Pygame
        </p>
      </div>

      <div className="project-content">
        <section className="project-overview">
          <h2>Overview</h2>
          <p>
            This collection showcases various classic games implemented in Python using the Pygame library. 
            Each game demonstrates different programming concepts including game loops, collision detection, 
            object-oriented programming, and user input handling.
          </p>
          
          <div className="tech-stack">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              <span className="tech-tag">Python 3.x</span>
              <span className="tech-tag">Pygame</span>
              <span className="tech-tag">Object-Oriented Programming</span>
              <span className="tech-tag">Game Development</span>
            </div>
          </div>
        </section>

        <section className="games-list">
          <h2>Games Collection</h2>
          <div className="games-grid">
            {games.map((game, index) => (
              <div key={index} className="game-card">
                <div className="game-header">
                  <h3 className="game-name">{game.name}</h3>
                  <span className={`game-status ${game.status.toLowerCase().replace(' ', '-')}`}>
                    {game.status}
                  </span>
                </div>
                <p className="game-description">{game.description}</p>
                <div className="game-features">
                  <h4>Features:</h4>
                  <ul>
                    {game.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="project-notes">
          <h2>Development Notes</h2>
          <div className="notes-content">
            <p>
              These games serve as excellent learning projects for understanding game development fundamentals. 
              Each game builds upon previous concepts while introducing new challenges and mechanics.
            </p>
            <p>
              The code emphasizes clean architecture, reusable components, and efficient game loops. 
              Future enhancements may include sound effects, improved graphics, and multiplayer capabilities.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PythonGames;