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
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [lastSelectedTask, setLastSelectedTask] = useState<string | null>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedTasks.size > 0) {
        e.preventDefault();
        const tasksToDelete = Array.from(selectedTasks);
        setBrainDump(prevBrainDump =>
          prevBrainDump.map(task =>
            tasksToDelete.includes(task.id) ? { ...task, status: 'deleted' as const } : task
          )
        );
        setSelectedTasks(new Set());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTasks]);

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
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  };

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    const visibleTasks = brainDump.filter(t => t.status !== 'deleted');

    if (e.shiftKey && lastSelectedTask) {
      const lastIndex = visibleTasks.findIndex(t => t.id === lastSelectedTask);
      const currentIndex = visibleTasks.findIndex(t => t.id === taskId);
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);

      const newSelected = new Set(selectedTasks);
      for (let i = start; i <= end; i++) {
        newSelected.add(visibleTasks[i].id);
      }
      setSelectedTasks(newSelected);
    } else if (e.ctrlKey || e.metaKey) {
      const newSelected = new Set(selectedTasks);
      if (newSelected.has(taskId)) {
        newSelected.delete(taskId);
      } else {
        newSelected.add(taskId);
      }
      setSelectedTasks(newSelected);
      setLastSelectedTask(taskId);
    } else {
      setSelectedTasks(new Set([taskId]));
      setLastSelectedTask(taskId);
    }
  };

  const handleTaskKeyDown = (taskId: string, e: React.KeyboardEvent) => {
    const visibleTasks = brainDump.filter(t => t.status !== 'deleted');
    const currentIndex = visibleTasks.findIndex(t => t.id === taskId);

    if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault();
      const targetTask = visibleTasks[currentIndex - 1];

      if (e.shiftKey || e.ctrlKey) {
        const newSelected = new Set(selectedTasks);
        newSelected.add(targetTask.id);
        setSelectedTasks(newSelected);
      } else {
        setSelectedTasks(new Set([targetTask.id]));
      }
      setLastSelectedTask(targetTask.id);
      document.getElementById(`task-${targetTask.id}`)?.focus();
    } else if (e.key === 'ArrowDown' && currentIndex < visibleTasks.length - 1) {
      e.preventDefault();
      const targetTask = visibleTasks[currentIndex + 1];

      if (e.shiftKey || e.ctrlKey) {
        const newSelected = new Set(selectedTasks);
        newSelected.add(targetTask.id);
        setSelectedTasks(newSelected);
      } else {
        setSelectedTasks(new Set([targetTask.id]));
      }
      setLastSelectedTask(targetTask.id);
      document.getElementById(`task-${targetTask.id}`)?.focus();
    }
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

  const handleDropBrainDump = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask !== targetTaskId) {
      const draggedIndex = brainDump.findIndex(t => t.id === draggedTask);
      const targetIndex = brainDump.findIndex(t => t.id === targetTaskId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newBrainDump = [...brainDump];
        const [removed] = newBrainDump.splice(draggedIndex, 1);
        newBrainDump.splice(targetIndex, 0, removed);

        const reordered = newBrainDump.map((task, index) => ({
          ...task,
          order: index
        }));

        setBrainDump(reordered);
      }
    }
    setDraggedTask(null);
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

  const handleDropTimeBlock = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    if (draggedTask) {
      const existingBlock = timeBlocks.find(tb => tb.hour === hour);
      if (existingBlock) {
        setTimeBlocks(timeBlocks.map(tb =>
          tb.hour === hour ? { ...tb, taskId: draggedTask } : tb
        ));
      } else {
        setTimeBlocks([...timeBlocks, { hour, taskId: draggedTask, duration: 1 }]);
      }
      setDraggedTask(null);
    }
  };

  const removeFromTimeBlock = (hour: number) => {
    setTimeBlocks(timeBlocks.filter(tb => tb.hour !== hour));
  };

  const updateTimeBlockText = (hour: number, text: string) => {
    const existingBlock = timeBlocks.find(tb => tb.hour === hour);
    if (existingBlock) {
      setTimeBlocks(timeBlocks.map(tb =>
        tb.hour === hour ? { ...tb, customText: text } : tb
      ));
    } else {
      setTimeBlocks([...timeBlocks, { hour, customText: text, duration: 1 }]);
    }
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
        alert('Tomorrow\'s plan created! Unfinished tasks have been rolled over.');
      }
    } catch (error) {
      console.error('Failed to create tomorrow:', error);
    }
  };

  const handlePrint = () => {
    const printStyles = `
      <style>
        @media print {
          body { background: white !important; }
          .daily-planner-page { background: white !important; padding: 1rem; }
          .planner-header { color: black !important; margin-bottom: 1rem; }
          .date-controls button, .planner-actions, .help-panel, .logout-btn { display: none !important; }
          .planner-container { grid-template-columns: 1fr 1fr 1fr; gap: 1rem; page-break-inside: avoid; }
          .brain-dump-column, .top-six-column, .planning-mode-column {
            box-shadow: none; border: 1px solid #ddd; max-height: none; overflow: visible;
          }
          .task-item button, .priority-task button, .add-task-section, .mode-toggle { display: none; }
          h3 { color: black !important; }
        }
      </style>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Daily Planner - ${formatDate(currentDate)}</title>
            ${printStyles}
            <link rel="stylesheet" href="${window.location.origin}/static/css/main.css">
          </head>
          <body>
            ${document.querySelector('.daily-planner-page')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
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
                id={`task-${task.id}`}
                className={`task-item ${task.status} ${selectedTasks.has(task.id) ? 'selected' : ''}`}
                draggable
                tabIndex={0}
                onDragStart={() => handleDragStart(task.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropBrainDump(e, task.id)}
                onClick={(e) => handleTaskClick(task.id, e)}
                onKeyDown={(e) => handleTaskKeyDown(task.id, e)}
              >
                <button
                  className="status-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    cycleTaskStatus(task.id);
                  }}
                >
                  {getStatusSymbol(task.status)}
                </button>
                <span className={task.status === 'completed' ? 'completed-text' : ''}>
                  {task.text}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                >
                  🗑️
                </button>
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
                {Array.from({ length: 18 }, (_, i) => i + 6).map(hour => {
                  const timeBlock = timeBlocks.find(tb => tb.hour === hour);
                  const task = timeBlock?.taskId ? brainDump.find(t => t.id === timeBlock.taskId) : null;

                  return (
                    <div
                      key={hour}
                      className={`time-slot ${timeBlock ? 'has-content' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropTimeBlock(e, hour)}
                    >
                      <span className="time-label">
                        {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                      </span>
                      {task ? (
                        <div className="time-block-task">
                          <span className="status">{getStatusSymbol(task.status)}</span>
                          <span className={task.status === 'completed' ? 'completed-text' : ''}>
                            {task.text}
                          </span>
                          <button onClick={() => removeFromTimeBlock(hour)}>×</button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Drag task here or type..."
                          className="time-input"
                          value={timeBlock?.customText || ''}
                          onChange={(e) => updateTimeBlockText(hour, e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
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
