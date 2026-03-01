import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../../components/TaskList';

// Mock TaskCard component
jest.mock('../../components/TaskCard', () => {
  return function MockTaskCard({ task, columnKey, onDragStart, onDelete, animationDelay }) {
    return (
      <div data-testid={`task-card-${task.id}`} data-animation-delay={animationDelay}>
        <span>{task.text}</span>
        <button 
          data-testid={`drag-${task.id}`}
          onClick={() => onDragStart(task, columnKey)}
        >
          Drag
        </button>
        <button 
          data-testid={`delete-${task.id}`}
          onClick={() => onDelete(columnKey, task.id)}
        >
          Delete
        </button>
      </div>
    );
  };
});

describe('TaskList', () => {
  const defaultProps = {
    tasks: [],
    columnKey: 'todo',
    onDragStart: jest.fn(),
    onDelete: jest.fn(),
  };

  const renderTaskList = (props = {}) => {
    return render(<TaskList {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders empty list when no tasks', () => {
      const { container } = renderTaskList({ tasks: [] });
      
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByTestId(/task-card/)).not.toBeInTheDocument();
    });

    it('renders single task', () => {
      const tasks = [{ id: 1, text: 'Task 1' }];
      renderTaskList({ tasks });
      
      expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    it('renders correct number of TaskCards', () => {
      const tasks = [
        { id: 1, text: 'Task 1' },
        { id: 2, text: 'Task 2' },
        { id: 3, text: 'Task 3' },
      ];
      renderTaskList({ tasks });
      
      expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-3')).toBeInTheDocument();
    });

    it('renders tasks in correct order', () => {
      const tasks = [
        { id: 1, text: 'First' },
        { id: 2, text: 'Second' },
        { id: 3, text: 'Third' },
      ];
      const { container } = renderTaskList({ tasks });
      
      const taskCards = container.querySelectorAll('[data-testid^="task-card-"]');
      expect(taskCards[0]).toHaveAttribute('data-testid', 'task-card-1');
      expect(taskCards[1]).toHaveAttribute('data-testid', 'task-card-2');
      expect(taskCards[2]).toHaveAttribute('data-testid', 'task-card-3');
    });
  });

  describe('Props Passing to TaskCard', () => {
    it('passes correct task prop', () => {
      const tasks = [{ id: 42, text: 'Specific Task' }];
      renderTaskList({ tasks });
      
      expect(screen.getByText('Specific Task')).toBeInTheDocument();
    });

    it('passes correct columnKey prop', () => {
      const tasks = [{ id: 1, text: 'Task' }];
      const onDragStart = jest.fn();
      renderTaskList({ tasks, columnKey: 'inProgress', onDragStart });
      
      fireEvent.click(screen.getByTestId('drag-1'));
      
      expect(onDragStart).toHaveBeenCalledWith(
        { id: 1, text: 'Task' },
        'inProgress'
      );
    });

    it('passes onDragStart callback', () => {
      const tasks = [{ id: 1, text: 'Task' }];
      const onDragStart = jest.fn();
      renderTaskList({ tasks, onDragStart });
      
      fireEvent.click(screen.getByTestId('drag-1'));
      
      expect(onDragStart).toHaveBeenCalled();
    });

    it('passes onDelete callback', () => {
      const tasks = [{ id: 1, text: 'Task' }];
      const onDelete = jest.fn();
      renderTaskList({ tasks, onDelete, columnKey: 'complete' });
      
      fireEvent.click(screen.getByTestId('delete-1'));
      
      expect(onDelete).toHaveBeenCalledWith('complete', 1);
    });

    it('passes correct animationDelay based on index', () => {
      const tasks = [
        { id: 1, text: 'Task 1' },
        { id: 2, text: 'Task 2' },
        { id: 3, text: 'Task 3' },
      ];
      renderTaskList({ tasks });
      
      expect(screen.getByTestId('task-card-1')).toHaveAttribute('data-animation-delay', '0');
      expect(screen.getByTestId('task-card-2')).toHaveAttribute('data-animation-delay', '0.05');
      expect(screen.getByTestId('task-card-3')).toHaveAttribute('data-animation-delay', '0.1');
    });
  });

  describe('Different Column Keys', () => {
    it('works with todo column', () => {
      const tasks = [{ id: 1, text: 'Task' }];
      const onDelete = jest.fn();
      renderTaskList({ tasks, columnKey: 'todo', onDelete });
      
      fireEvent.click(screen.getByTestId('delete-1'));
      expect(onDelete).toHaveBeenCalledWith('todo', 1);
    });

    it('works with inProgress column', () => {
      const tasks = [{ id: 1, text: 'Task' }];
      const onDelete = jest.fn();
      renderTaskList({ tasks, columnKey: 'inProgress', onDelete });
      
      fireEvent.click(screen.getByTestId('delete-1'));
      expect(onDelete).toHaveBeenCalledWith('inProgress', 1);
    });

    it('works with complete column', () => {
      const tasks = [{ id: 1, text: 'Task' }];
      const onDelete = jest.fn();
      renderTaskList({ tasks, columnKey: 'complete', onDelete });
      
      fireEvent.click(screen.getByTestId('delete-1'));
      expect(onDelete).toHaveBeenCalledWith('complete', 1);
    });
  });

  describe('Multiple Tasks Interaction', () => {
    it('deletes correct task from multiple tasks', () => {
      const tasks = [
        { id: 1, text: 'Task 1' },
        { id: 2, text: 'Task 2' },
        { id: 3, text: 'Task 3' },
      ];
      const onDelete = jest.fn();
      renderTaskList({ tasks, onDelete, columnKey: 'todo' });
      
      fireEvent.click(screen.getByTestId('delete-2'));
      
      expect(onDelete).toHaveBeenCalledWith('todo', 2);
    });

    it('drags correct task from multiple tasks', () => {
      const tasks = [
        { id: 1, text: 'Task 1' },
        { id: 2, text: 'Task 2' },
        { id: 3, text: 'Task 3' },
      ];
      const onDragStart = jest.fn();
      renderTaskList({ tasks, onDragStart, columnKey: 'todo' });
      
      fireEvent.click(screen.getByTestId('drag-2'));
      
      expect(onDragStart).toHaveBeenCalledWith(
        { id: 2, text: 'Task 2' },
        'todo'
      );
    });
  });

  describe('Container Styling', () => {
    it('has space-y-3 class for spacing', () => {
      const { container } = renderTaskList();
      
      expect(container.firstChild).toHaveClass('space-y-3');
    });
  });

  describe('Edge Cases', () => {
    it('handles large number of tasks', () => {
      const tasks = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        text: `Task ${i + 1}`,
      }));
      const { container } = renderTaskList({ tasks });
      
      const taskCards = container.querySelectorAll('[data-testid^="task-card-"]');
      expect(taskCards).toHaveLength(100);
    });

    it('handles tasks with same text but different ids', () => {
      const tasks = [
        { id: 1, text: 'Duplicate' },
        { id: 2, text: 'Duplicate' },
      ];
      renderTaskList({ tasks });
      
      expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
      expect(screen.getAllByText('Duplicate')).toHaveLength(2);
    });
  });
});
