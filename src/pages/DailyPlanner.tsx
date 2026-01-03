import React, { useState, useEffect } from 'react';
import '../styles/DailyPlanner.css';

interface Task {
  id: string;
  text: string;
  status: 'none' | 'open' | 'open-open' | 'completed' | 'deleted';
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [brainDump, setBrainDump] = useState<Task[]>([]);
  const [top3, setTop3] = useState<string[]>([]);
  const [secondary3, setSecondary3] = useState<string[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [planningMode, setPlanningMode] = useState<'6-task' | 'time-block'>('6-task');
  const [newTaskText, setNewTaskText] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
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
        const statusCycle: Record<string, 'none' | 'open' | 'open-open' | 'completed' | 'deleted'> = {
          'none': 'open',
          'open': 'open-open',
          'open-open': 'completed',
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
      case 'open-open': return 'OO';
      case 'completed': return '✓';
      case 'deleted': return 'X';
      default: return '';
    }
  };

  return (
    <div className="daily-planner-page">
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
              <div key={task.id} className={`task-item ${task.status}`}>
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
            <div className="drop-zone">
              {top3.map(taskId => {
                const task = brainDump.find(t => t.id === taskId);
                return task ? (
                  <div key={task.id} className="priority-task">
                    <span className="status">{getStatusSymbol(task.status)}</span>
                    <span>{task.text}</span>
                  </div>
                ) : null;
              })}
              {top3.length === 0 && <p className="placeholder">Drag tasks here or click to add</p>}
            </div>
          </div>

          <div className="secondary-three-section">
            <h3>Secondary 3</h3>
            <div className="drop-zone">
              {secondary3.map(taskId => {
                const task = brainDump.find(t => t.id === taskId);
                return task ? (
                  <div key={task.id} className="priority-task">
                    <span className="status">{getStatusSymbol(task.status)}</span>
                    <span>{task.text}</span>
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
        <button className="create-tomorrow-btn">Create Tomorrow</button>
        <button className="print-btn">🖨️ Print</button>
      </div>
    </div>
  );
};

export default DailyPlanner;
