// updated version

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProjectPage.css';

const PythonGames: React.FC = () => {
  const games = [
    {
      name: 'Snake Game',
      description: 'Classic snake game with growing mechanics and score tracking',
      features: ['Arrow key controls', 'Score system', 'Game over detection', 'Responsive gameplay'],
      status: 'Completed',
      playable: true,
      route: '/snake'
    },
    {
      name: 'Pong',
      description: 'Two-player paddle game with ball physics',
      features: ['Two-player mode', 'Ball physics', 'Score tracking', 'Collision detection'],
      status: 'Completed',
      playable: true,
      route: '/pong'
    },
    {
      name: 'Space Invaders',
      description: 'Shoot-em-up game with waves of enemies',
      features: ['Enemy waves', 'Power-ups', 'Multiple lives', 'Increasing difficulty'],
      status: 'In Progress',
      playable: false,
      route: null
    },
    {
      name: 'Breakout',
      description: 'Brick-breaking game with paddle and ball',
      features: ['Brick destruction', 'Ball physics', 'Multiple levels', 'Power-ups'],
      status: 'Planned',
      playable: false,
      route: null
    }
  ];

  return (
    <div className="project-page">
      <div className="project-header">
        <div className="project-icon-large">🐍</div>
        <h1 className="project-title">Python Games</h1>
        <p className="project-subtitle">
          Collection of classic arcade games built with modern web technologies
        </p>
      </div>

      <div className="project-content">
        <section className="project-overview">
          <h2>Overview</h2>
          <p>
            This collection showcases various classic games implemented using modern web technologies.
            Originally inspired by Python game development, these games have been recreated in React/TypeScript
            to run directly in your browser. Each game demonstrates different programming concepts including
            game loops, collision detection, state management, and user input handling.
          </p>

          <div className="tech-stack">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              <span className="tech-tag">React</span>
              <span className="tech-tag">TypeScript</span>
              <span className="tech-tag">HTML5 Canvas</span>
              <span className="tech-tag">CSS3 Animations</span>
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
                {game.playable && game.route && (
                  <div className="game-actions">
                    <Link to={game.route} className="play-button">
                      🎮 Play Now
                    </Link>
                  </div>
                )}
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
              The games are built with React and TypeScript, emphasizing clean architecture, reusable components,
              and efficient game loops. They feature modern UI design with smooth animations and responsive layouts
              that work across different devices.
            </p>
            <p>
              <strong>Play Instructions:</strong> Click the "Play Now" button on completed games to start playing
              immediately in your browser. No downloads or installations required!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PythonGames;