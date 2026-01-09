import React, { useState, useEffect, useCallback } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
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
      loadPlanForDate(currentDate);
    }
  }, []);

  useEffect(() => {
    loadPlanForDate(currentDate);
  }, [currentDate]);

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
      const token = getAuthToken();
      if (!token) {
        const localKey = `planner_${formatDate(date)}`;
        const localData = localStorage.getItem(localKey);
        if (localData) {
          const data = JSON.parse(localData);
          setBrainDump(data.brainDump || []);
          setTop3(data.top3 || []);
          setSecondary3(data.secondary3 || []);
          setTimeBlocks(data.timeBlocks || []);
          setPlanningMode(data.planningMode || '6-task');
        } else {
          setBrainDump([]);
          setTop3([]);
          setSecondary3([]);
          setTimeBlocks([]);
          setPlanningMode('6-task');
        }
        setLoading(false);
        return;
      }

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

  const savePlan = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        const localKey = `planner_${formatDate(currentDate)}`;
        localStorage.setItem(localKey, JSON.stringify({
          date: formatDate(currentDate),
          brainDump,
          top3,
          secondary3,
          timeBlocks,
          planningMode,
        }));
        return;
      }

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
  }, [brainDump, top3, secondary3, timeBlocks, planningMode, currentDate]);

  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(savePlan, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [savePlan, loading]);

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
    setBrainDump(prevBrainDump => prevBrainDump.map(task => {
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

  const reorderTasksByPriority = () => {
    setBrainDump(prevBrainDump => {
      const tasks = [...prevBrainDump];
      return tasks.sort((a, b) => {
        const priorityOrder = {
          'open-outstanding': 0,
          'open': 1,
          'none': 2,
          'completed': 3,
          'deleted': 4
        };
        return priorityOrder[a.status] - priorityOrder[b.status];
      });
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
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = formatDate(tomorrow);

      const uncompletedTasks = brainDump.filter(
        task => task.status !== 'completed' && task.status !== 'deleted'
      );

      const ooTasks = uncompletedTasks.filter(task => task.status === 'open-outstanding');
      const oTasks = uncompletedTasks.filter(task => task.status === 'open');
      const noneTasks = uncompletedTasks.filter(task => task.status === 'none');

      const prioritizedTasks = [...ooTasks, ...oTasks, ...noneTasks];
      const newTop3 = prioritizedTasks.slice(0, 3).map(t => t.id);
      const newSecondary3 = prioritizedTasks.slice(3, 6).map(t => t.id);

      const tomorrowBrainDump = prioritizedTasks.map((task, index) => ({
        ...task,
        status: 'none' as const,
        order: index
      }));

      const token = getAuthToken();
      if (!token) {
        const localKey = `planner_${tomorrowDate}`;
        localStorage.setItem(localKey, JSON.stringify({
          date: tomorrowDate,
          brainDump: tomorrowBrainDump,
          top3: newTop3,
          secondary3: newSecondary3,
          timeBlocks: [],
          planningMode: '6-task',
        }));
      } else {
        await fetch(API_ENDPOINTS.SAVE_PLAN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            date: tomorrowDate,
            brainDump: tomorrowBrainDump,
            top3: newTop3,
            secondary3: newSecondary3,
            timeBlocks: [],
            planningMode: '6-task',
          }),
        });
      }

      setCurrentDate(tomorrow);
      alert('Tomorrow\'s plan created! Unfinished tasks have been rolled over.');
    } catch (error) {
      console.error('Failed to create tomorrow:', error);
      alert('Failed to create tomorrow\'s plan. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintColumn = (columnType: 'brain-dump' | 'top-six' | 'planning-mode') => {
    document.body.setAttribute('data-print-column', columnType);
    window.print();
    document.body.removeAttribute('data-print-column');
  };

  if (loading) {
    return <div className="daily-planner-page"><p>Loading...</p></div>;
  }

  return (
    <div className="daily-planner-page">
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
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
          <button
            onClick={() => setShowAuthModal(true)}
            className="login-btn"
            title="Creating a login email and password enables immediately saving your task and planning data for all days and stores your progress towards your plans. Access it from anywhere at anytime. Enjoy and Stay Productive!"
          >
            Login
          </button>
          {getAuthToken() && <button onClick={handleLogout} className="logout-btn">Logout</button>}
        </div>
      </div>

      {showHelp && (
        <div className="help-panel">
          <h3>📖 How to Use Planner Pages</h3>
          <div className="help-content">
            <div className="help-section">
              <h4>Daily Workflow:</h4>
              <ol>
                <li><strong>Brain Dump</strong> - Quickly write out everything you need to do, drag and drop order, & mark statuses</li>
                <li><strong>Pick Top 3</strong> - Must-do tasks (mark with O)</li>
                <li><strong>Pick Secondary 3</strong> - Work on after Top 3 (mark with O)</li>
                <li><strong>Choose Mode:</strong> 6-Task (flexible) or Time Block (structured)</li>
              </ol>
            </div>
            <div className="help-section">
              <h4>Task Status:</h4>
              <ul>
                <li><strong>[ ]</strong> = Not started</li>
                <li><strong>O</strong> = Open task - priority </li>
                <li><strong>OO</strong> = Open Outstanding task - urgent priority </li>
                <li><strong>✓</strong> = Completed (strike through)</li>
                <li><strong>X</strong> = Deleted/abandoned</li>
              </ul>
            </div>
            <div className="help-section">
              <h4>End of Day:</h4>
              <ul>
                <li>Click "Create Tomorrow"</li>
                <li>unworked Brain Dump tasks → carry over to tomorrow </li>
                <li>OO tasks → carry over with 1st priority to Top 6</li>
                <li>O tasks → carry over with 2nd priority to Top 6</li>
              </ul>
            </div>
            <div className="help-section">
              <h4>💾 Save Your Progress:</h4>
              <p>
                <strong>Login to save your data:</strong> Creating a login email and password enables automatic saving of your task and planning data for all days. Access your planner from anywhere at anytime and never lose your progress. Enjoy and Stay Productive!
              </p>
            </div>
          </div>
          <button onClick={() => setShowHelp(false)}>Close</button>
        </div>
      )}

      <div className="planner-container">
        <div className="brain-dump-column">
          <div className="column-header">
            <h3>Brain Dump</h3>
            <button className="reorder-btn" onClick={reorderTasksByPriority} title="Re-order tasks by priority">↕️</button>
            <button className="print-column-btn" onClick={() => handlePrintColumn('brain-dump')}>🖨️</button>
          </div>
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
          <div className="column-header">
            <h3>Top 6</h3>
            <button className="print-column-btn" onClick={() => handlePrintColumn('top-six')}>🖨️</button>
          </div>
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
          <div className="column-header">
            <h3>Planning Mode</h3>
            <button className="print-column-btn" onClick={() => handlePrintColumn('planning-mode')}>🖨️</button>
          </div>
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
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => cycleTaskStatus(task.id)}
                      />
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
                {Array.from({ length: 24 }, (_, i) => i).map(hour => {
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
                        {hour === 0 ? '12:00 AM' : hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
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
                          onChange={(e) => {
                            e.stopPropagation();
                            updateTimeBlockText(hour, e.target.value);
                          }}
                          onKeyDown={(e) => e.stopPropagation()}
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
        <button className="print-all-btn" onClick={handlePrint}>🖨️ Print All</button>
      </div>
    </div>
  );
};

export default DailyPlanner;
