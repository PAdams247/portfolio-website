import React, { useState, useEffect } from 'react';
import AuthModal from '../components/AuthModal';
import { API_ENDPOINTS, getAuthToken, getAuthHeaders, removeAuthToken } from '../config/api';
import '../styles/DailyPlanner.css';

interface Task {
  id: string;
  text: string;
  status: 'none' | 'open' | 'open-outstanding' | 'completed' | 'deleted';
  order: number;
  createdAt: Date;
}

interface TimeBlock {
  hour: number;
  taskId?: string;
  customText?: string;
  duration: number;
}

const DailyPlanner: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [brainDump, setBrainDump] = useState<Task[]>([]);
  const [top3, setTop3] = useState<string[]>([]);
  const [secondary3, setSecondary3] = useState<string[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [planningMode, setPlanningMode] = useState<'6-task' | 'time-block'>('6-task');
  const [newTaskText, setNewTaskText] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      loadPlanForDate(currentDate);
    } else {
      setLoading(false);
      setShowAuthModal(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPlanForDate(currentDate);
    }
  }, [currentDate, isAuthenticated]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const loadPlanForDate = async (date: Date) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.GET_PLAN(formatDate(date)), {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setBrainDump(data.brainDump || []);
        setTop3(data.top3 || []);
        setSecondary3(data.secondary3 || []);
        setTimeBlocks(data.timeBlocks || []);
        setPlanningMode(data.planningMode || '6-task');
      }
    } catch (error) {
      console.error('Failed to load plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    try {
      await fetch(API_ENDPOINTS.SAVE_PLAN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          date: formatDate(currentDate),
          brainDump,
          top3,
          secondary3,
          timeBlocks,
          planningMode,
        }),
      });
    } catch (error) {
      console.error('Failed to save plan:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      const timeoutId = setTimeout(savePlan, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [brainDump, top3, secondary3, timeBlocks, planningMode, isAuthenticated, loading]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    loadPlanForDate(currentDate);
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setShowAuthModal(true);
    setBrainDump([]);
    setTop3([]);
    setSecondary3([]);
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        status: 'none',
        order: brainDump.length,
        createdAt: new Date()
      };
      setBrainDump([...brainDump, task]);
      setNewTaskText('');
    }
  };

  const cycleTaskStatus = (taskId: string) => {
    setBrainDump(brainDump.map(task => {
      if (task.id === taskId) {
        const statusCycle: Record<string, 'none' | 'open' | 'open-outstanding' | 'completed' | 'deleted'> = {
          'none': 'open',
          'open': 'open-outstanding',
          'open-outstanding': 'completed',
          'completed': 'none',
          'deleted': 'none'
        };
        return { ...task, status: statusCycle[task.status] };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setBrainDump(brainDump.map(task =>
      task.id === taskId ? { ...task, status: 'deleted' } : task
    ));
  };

  const getStatusSymbol = (status: string) => {
    switch (status) {
      case 'open': return 'O';
      case 'open-outstanding': return 'OO';
      case 'completed': return '✓';
      case 'deleted': return 'X';
      default: return '';
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropTop3 = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedTask && !top3.includes(draggedTask) && top3.length < 3) {
      setTop3([...top3, draggedTask]);
      setDraggedTask(null);
    }
  };

  const handleDropSecondary3 = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedTask && !secondary3.includes(draggedTask) && secondary3.length < 3) {
      setSecondary3([...secondary3, draggedTask]);
      setDraggedTask(null);
    }
  };

  const removeFromTop3 = (taskId: string) => {
    setTop3(top3.filter(id => id !== taskId));
  };

  const removeFromSecondary3 = (taskId: string) => {
    setSecondary3(secondary3.filter(id => id !== taskId));
  };

  const handleCreateTomorrow = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_TOMORROW, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          currentDate: formatDate(currentDate),
        }),
      });

      if (response.ok) {
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCurrentDate(tomorrow);
      }
    } catch (error) {
      console.error('Failed to create tomorrow:', error);
    }
  };

  if (loading) {
    return <div className="daily-planner-page"><p>Loading...</p></div>;
  }

  return (
    <div className="daily-planner-page">
      {showAuthModal && (
        <AuthModal onClose={() => {}} onSuccess={handleAuthSuccess} />
      )}

      <div className="planner-header">
        <h1>Planner Pages</h1>
        <p>Stay hyper focused and productive in even a challenging, fast-moving environment with this day-to-day planning system.</p>
        
        <div className="date-controls">
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}>
            ← Previous
          </button>
          <h2>{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}>
            Next →
          </button>
          <button onClick={() => setCurrentDate(new Date())}>Today</button>
          <button onClick={() => setShowHelp(!showHelp)}>❓ Help</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {showHelp && (
        <div className="help-panel">
          <h3>📖 How to Use Planner Pages</h3>
          <div className="help-content">
            <div className="help-section">
              <h4>Daily Workflow:</h4>
              <ol>
                <li><strong>Brain Dump</strong> - Write everything you need to do</li>
                <li><strong>Pick Top 3</strong> - Must-do tasks (mark with O)</li>
                <li><strong>Pick Secondary 3</strong> - Work on after Top 3 (mark with O)</li>
                <li><strong>Choose Mode:</strong> 6-Task (flexible) or Time Block (structured)</li>
              </ol>
            </div>
            <div className="help-section">
              <h4>Task Status:</h4>
              <ul>
                <li><strong>[ ]</strong> = Not started</li>
                <li><strong>O</strong> = Working on it today</li>
                <li><strong>OO</strong> = Still working, not finished yet</li>
                <li><strong>✓</strong> = Completed (strike through)</li>
                <li><strong>X</strong> = Deleted/abandoned</li>
              </ul>
            </div>
            <div className="help-section">
              <h4>End of Day:</h4>
              <ul>
                <li>Click "Create Tomorrow"</li>
                <li>OO tasks → Auto-prioritize to Top 3</li>
                <li>O tasks → Auto-prioritize to Top 6</li>
                <li>Reorder as needed on tomorrow's page</li>
              </ul>
            </div>
          </div>
          <button onClick={() => setShowHelp(false)}>Close</button>
        </div>
      )}

      <div className="planner-container">
        <div className="brain-dump-column">
          <h3>Brain Dump</h3>
          <div className="add-task-section">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a task..."
            />
            <button onClick={addTask}>+ Add</button>
          </div>
          <div className="task-list">
            {brainDump.filter(t => t.status !== 'deleted').map(task => (
              <div 
                key={task.id} 
                className={`task-item ${task.status}`}
                draggable
                onDragStart={() => handleDragStart(task.id)}
              >
                <button 
                  className="status-btn"
                  onClick={() => cycleTaskStatus(task.id)}
                >
                  {getStatusSymbol(task.status)}
                </button>
                <span className={task.status === 'completed' ? 'completed-text' : ''}>
                  {task.text}
                </span>
                <button onClick={() => deleteTask(task.id)}>🗑️</button>
              </div>
            ))}
          </div>
        </div>

        <div className="top-six-column">
          <div className="top-three-section">
            <h3>Top 3 Must-Do</h3>
            <div 
              className="drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDropTop3}
            >
              {top3.map(taskId => {
                const task = brainDump.find(t => t.id === taskId);
                return task ? (
                  <div key={task.id} className="priority-task">
                    <span className="status">{getStatusSymbol(task.status)}</span>
                    <span>{task.text}</span>
                    <button onClick={() => removeFromTop3(taskId)}>×</button>
                  </div>
                ) : null;
              })}
              {top3.length === 0 && <p className="placeholder">Drag tasks here or click to add</p>}
            </div>
          </div>

          <div className="secondary-three-section">
            <h3>Secondary 3</h3>
            <div 
              className="drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDropSecondary3}
            >
              {secondary3.map(taskId => {
                const task = brainDump.find(t => t.id === taskId);
                return task ? (
                  <div key={task.id} className="priority-task">
                    <span className="status">{getStatusSymbol(task.status)}</span>
                    <span>{task.text}</span>
                    <button onClick={() => removeFromSecondary3(taskId)}>×</button>
                  </div>
                ) : null;
              })}
              {secondary3.length === 0 && <p className="placeholder">Drag tasks here or click to add</p>}
            </div>
          </div>
        </div>

        <div className="planning-mode-column">
          <div className="mode-toggle">
            <button 
              className={planningMode === '6-task' ? 'active' : ''}
              onClick={() => setPlanningMode('6-task')}
            >
              6-Task View
            </button>
            <button 
              className={planningMode === 'time-block' ? 'active' : ''}
              onClick={() => setPlanningMode('time-block')}
            >
              Time Block View
            </button>
          </div>

          {planningMode === '6-task' ? (
            <div className="six-task-view">
              <h3>Today's Focus</h3>
              <div className="focus-tasks">
                {[...top3, ...secondary3].map((taskId, index) => {
                  const task = brainDump.find(t => t.id === taskId);
                  return task ? (
                    <div key={task.id} className="focus-task-item">
                      <span className="task-number">{index + 1}</span>
                      <input type="checkbox" checked={task.status === 'completed'} readOnly />
                      <span className={task.status === 'completed' ? 'completed-text' : ''}>
                        {task.text}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : (
            <div className="time-block-view">
              <h3>Time Blocks</h3>
              <div className="time-slots">
                {Array.from({ length: 18 }, (_, i) => i + 6).map(hour => (
                  <div key={hour} className="time-slot">
                    <span className="time-label">
                      {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                    </span>
                    <input 
                      type="text" 
                      placeholder="What are you working on?"
                      className="time-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="planner-actions">
        <button className="create-tomorrow-btn" onClick={handleCreateTomorrow}>Create Tomorrow</button>
        <button className="print-btn">🖨️ Print</button>
      </div>
    </div>
  );
};

export default DailyPlanner;
