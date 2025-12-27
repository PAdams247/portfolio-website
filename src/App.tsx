import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import PythonGames from './pages/PythonGames';
import Game2048 from './pages/Game2048';
import Tetris from './pages/Tetris';
import SnakeGame from './pages/SnakeGame';
import PongGame from './pages/PongGame';
import TaskList from './pages/TaskList';
import WebDesignServices from './pages/WebDesignServices';
import './styles/App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classic-games" element={<PythonGames />} />
            <Route path="/2048" element={<Game2048 />} />
            <Route path="/tetris" element={<Tetris />} />
            <Route path="/snake" element={<SnakeGame />} />
            <Route path="/pong" element={<PongGame />} />
            <Route path="/task-list" element={<TaskList />} />
            <Route path="/web-design-services" element={<WebDesignServices />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Parker Adams. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
