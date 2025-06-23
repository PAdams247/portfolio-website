import React from 'react';
import { Link } from 'react-router-dom';
import SpinningGraphic from '../components/SpinningGraphic';
import '../styles/Home.css';

const Home: React.FC = () => {
  const projects = [
    {
      title: 'Python Games',
      description: 'Collection of classic games built with Python',
      path: '/python-games',
      icon: '🐍',
      tech: ['Python', 'Pygame', 'OOP']
    },
    {
      title: '2048 Game',
      description: 'The addictive sliding puzzle game',
      path: '/2048',
      icon: '🎮',
      tech: ['React', 'TypeScript', 'CSS Grid']
    },
    {
      title: 'Tetris',
      description: 'Classic falling blocks puzzle game',
      path: '/tetris',
      icon: '🧩',
      tech: ['React', 'Canvas API', 'Game Logic']
    },
    {
      title: 'Task List',
      description: 'Productivity app for managing tasks',
      path: '/task-list',
      icon: '📝',
      tech: ['React', 'Local Storage', 'CRUD']
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Coding</span>
              <span className="title-line">Portfolio</span>
            </h1>
            <p className="hero-subtitle">
              Showcasing interactive projects and games built with modern technologies
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">4+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">3+</span>
                <span className="stat-label">Languages</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Learning</span>
              </div>
            </div>
          </div>
          <div className="hero-graphic">
            <SpinningGraphic />
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="projects-container">
          <h2 className="projects-title">Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <Link 
                key={index} 
                to={project.path} 
                className="project-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-icon">{project.icon}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;