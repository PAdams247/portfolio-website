import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../pages/TaskList';

// Mock the CSS import
jest.mock('../styles/TaskList.css', () => ({}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Component Rendering', () => {
    test('renders page title', () => {
      render(<TaskList />);
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });

    test('renders task input field', () => {
      render(<TaskList />);
      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    });

    test('renders priority selector', () => {
      render(<TaskList />);
      expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    });

    test('renders category selector', () => {
      render(<TaskList />);
      expect(screen.getByDisplayValue('Personal')).toBeInTheDocument();
    });

    test('renders add task button', () => {
      render(<TaskList />);
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    test('renders filter buttons', () => {
      render(<TaskList />);
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    test('renders task statistics', () => {
      render(<TaskList />);
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
      expect(screen.getByText(/Completed:/)).toBeInTheDocument();
      expect(screen.getByText(/Active:/)).toBeInTheDocument();
    });
  });

  describe('Task Management', () => {
    test('adds a new task', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Test task')).toBeInTheDocument();
      });
    });

    test('does not add empty task', () => {
      render(<TaskList />);
      const addButton = screen.getByText('Add Task');

      fireEvent.click(addButton);

      // Should not add empty task
      expect(screen.queryByText('')).not.toBeInTheDocument();
    });

    test('clears input after adding task', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
      const addButton = screen.getByText('Add Task');

      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    test('adds task with Enter key', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Test task')).toBeInTheDocument();
      });
    });

    test('toggles task completion', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      // Add a task first
      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
      });
    });

    test('deletes a task', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      // Add a task first
      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('Test task')).not.toBeInTheDocument();
      });
    });

    test('edits a task', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      // Add a task first
      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);
      });

      // Should show edit interface
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test task')).toBeInTheDocument();
      });
    });
  });

  describe('Task Filtering', () => {
    beforeEach(async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      // Add a completed task
      fireEvent.change(input, { target: { value: 'Completed task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);
      });

      // Add an active task
      fireEvent.change(input, { target: { value: 'Active task' } });
      fireEvent.click(addButton);
    });

    test('shows all tasks by default', () => {
      expect(screen.getByText('Completed task')).toBeInTheDocument();
      expect(screen.getByText('Active task')).toBeInTheDocument();
    });

    test('filters active tasks', async () => {
      const activeFilter = screen.getByText('Active');
      fireEvent.click(activeFilter);

      await waitFor(() => {
        expect(screen.getByText('Active task')).toBeInTheDocument();
        expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
      });
    });

    test('filters completed tasks', async () => {
      const completedFilter = screen.getByText('Completed');
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(screen.getByText('Completed task')).toBeInTheDocument();
        expect(screen.queryByText('Active task')).not.toBeInTheDocument();
      });
    });

    test('shows all tasks when All filter is selected', async () => {
      const completedFilter = screen.getByText('Completed');
      fireEvent.click(completedFilter);

      const allFilter = screen.getByText('All');
      fireEvent.click(allFilter);

      await waitFor(() => {
        expect(screen.getByText('Completed task')).toBeInTheDocument();
        expect(screen.getByText('Active task')).toBeInTheDocument();
      });
    });
  });

  describe('Priority and Categories', () => {
    test('sets task priority', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const prioritySelect = screen.getByDisplayValue('medium');
      const addButton = screen.getByText('Add Task');

      fireEvent.change(prioritySelect, { target: { value: 'high' } });
      fireEvent.change(input, { target: { value: 'High priority task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('High priority task')).toBeInTheDocument();
      });
    });

    test('sets task category', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const categorySelect = screen.getByDisplayValue('Personal');
      const addButton = screen.getByText('Add Task');

      fireEvent.change(categorySelect, { target: { value: 'Work' } });
      fireEvent.change(input, { target: { value: 'Work task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Work task')).toBeInTheDocument();
      });
    });

    test('adds new category', async () => {
      render(<TaskList />);
      const categoryInput = screen.getByPlaceholderText('New category...');
      const addCategoryButton = screen.getByText('Add Category');

      fireEvent.change(categoryInput, { target: { value: 'Shopping' } });
      fireEvent.click(addCategoryButton);

      await waitFor(() => {
        expect(screen.getByText('Shopping')).toBeInTheDocument();
      });
    });
  });

  describe('Task Statistics', () => {
    test('updates task statistics correctly', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      // Add two tasks
      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.click(addButton);

      // Complete one task
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      // Check statistics
      await waitFor(() => {
        expect(screen.getByText(/Total: 2/)).toBeInTheDocument();
        expect(screen.getByText(/Completed: 1/)).toBeInTheDocument();
        expect(screen.getByText(/Active: 1/)).toBeInTheDocument();
      });
    });
  });

  describe('Clear Completed Tasks', () => {
    test('clears all completed tasks', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      // Add and complete a task
      fireEvent.change(input, { target: { value: 'Completed task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
      });

      // Clear completed tasks
      const clearButton = screen.getByText('Clear Completed');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
      });
    });
  });

  describe('Local Storage Integration', () => {
    test('saves tasks to localStorage', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'tasks',
          expect.stringContaining('Test task')
        );
      });
    });

    test('loads tasks from localStorage', () => {
      const mockTasks = JSON.stringify([
        {
          id: 1,
          text: 'Saved task',
          completed: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'Personal'
        }
      ]);
      localStorageMock.getItem.mockReturnValue(mockTasks);

      render(<TaskList />);

      expect(screen.getByText('Saved task')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels', () => {
      render(<TaskList />);
      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    });

    test('checkboxes are accessible', async () => {
      render(<TaskList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByText('Add Task');

      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
      });
    });

    test('buttons have proper text', () => {
      render(<TaskList />);
      expect(screen.getByText('Add Task')).toBeInTheDocument();
      expect(screen.getByText('Clear Completed')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => render(<TaskList />)).not.toThrow();
    });

    test('handles invalid localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      expect(() => render(<TaskList />)).not.toThrow();
    });
  });
});