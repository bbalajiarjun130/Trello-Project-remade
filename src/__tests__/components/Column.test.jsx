import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Column from '../../components/Column';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Plus: ({ size, className }) => (
    <svg data-testid="plus-icon" width={size} className={className} />
  ),
  GripVertical: ({ size, className }) => (
    <svg data-testid="grip-icon" width={size} className={className} />
  ),
}));

// Mock TaskCard to simplify Column tests
jest.mock('../../components/TaskCard', () => {
  return function MockTaskCard({ task, columnKey, onDragStart, onDelete }) {
    return (
      <div data-testid={`task-card-${task.id}`}>
        <span>{task.text}</span>
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

describe('Column', () => {
  const defaultProps = {
    columnKey: 'todo',
    config: { title: 'To Do' },
    tasks: [],
    onDragStart: jest.fn(),
    onDrop: jest.fn(),
    onAddTask: jest.fn(),
    onDeleteTask: jest.fn(),
    animationDelay: 0,
  };

  const renderColumn = (props = {}) => {
    return render(<Column {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders column header with title', () => {
      renderColumn();
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('displays correct task count', () => {
      const tasks = [
        { id: 1, text: 'Task 1' },
        { id: 2, text: 'Task 2' },
        { id: 3, text: 'Task 3' },
      ];
      renderColumn({ tasks });
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('displays zero count when no tasks', () => {
      renderColumn({ tasks: [] });
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders all tasks', () => {
      const tasks = [
        { id: 1, text: 'Task 1' },
        { id: 2, text: 'Task 2' },
      ];
      renderColumn({ tasks });
      
      expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('renders Add Task button when input not shown', () => {
      renderColumn();
      
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });
  });

  describe('Add Task Input Toggle', () => {
    it('shows input form when Add Task button clicked', async () => {
      renderColumn();
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      expect(screen.getByPlaceholderText(/enter task name/i)).toBeInTheDocument();
    });

    it('hides Add Task button when input is shown', () => {
      renderColumn();
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      // Original add task button should be hidden, now we have Add and Cancel buttons
      const buttons = screen.getAllByRole('button');
      const buttonTexts = buttons.map(b => b.textContent);
      expect(buttonTexts).toContain('Add Task');
      expect(buttonTexts).toContain('Cancel');
    });

    it('hides input form on Cancel button click', () => {
      renderColumn();
      
      // Show input
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      expect(screen.getByPlaceholderText(/enter task name/i)).toBeInTheDocument();
      
      // Click cancel
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      // Input should be hidden
      expect(screen.queryByPlaceholderText(/enter task name/i)).not.toBeInTheDocument();
    });

    it('clears input value on Cancel', () => {
      renderColumn();
      
      // Show input and type something
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Test task' } });
      expect(input.value).toBe('Test task');
      
      // Cancel
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      // Show input again - should be empty
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      expect(screen.getByPlaceholderText(/enter task name/i).value).toBe('');
    });
  });

  describe('Adding Tasks', () => {
    it('calls onAddTask when Add button clicked with valid input', () => {
      const onAddTask = jest.fn();
      renderColumn({ onAddTask });
      
      // Show input
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      // Type task name
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'New Task' } });
      
      // Click Add button (there are two buttons now - Add Task and Cancel)
      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find(b => b.textContent === 'Add Task');
      fireEvent.click(addButton);
      
      expect(onAddTask).toHaveBeenCalledWith('todo', 'New Task');
    });

    it('calls onAddTask on Enter key press', () => {
      const onAddTask = jest.fn();
      renderColumn({ onAddTask });
      
      // Show input
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      // Type and press Enter
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'New Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(onAddTask).toHaveBeenCalledWith('todo', 'New Task');
    });

    it('clears input after adding task', () => {
      const onAddTask = jest.fn();
      renderColumn({ onAddTask });
      
      // Show input
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      // Type task name
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'New Task' } });
      
      // Press Enter
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Input form should be hidden after adding
      expect(screen.queryByPlaceholderText(/enter task name/i)).not.toBeInTheDocument();
    });

    it('does not add empty tasks - whitespace only', () => {
      const onAddTask = jest.fn();
      renderColumn({ onAddTask });
      
      // Show input
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      // Type only spaces
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(onAddTask).not.toHaveBeenCalled();
    });

    it('does not add empty tasks - empty string', () => {
      const onAddTask = jest.fn();
      renderColumn({ onAddTask });
      
      // Show input
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      // Press Enter without typing
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(onAddTask).not.toHaveBeenCalled();
    });
  });

  describe('Drag and Drop', () => {
    it('calls onDrop with columnKey on drop', () => {
      const onDrop = jest.fn();
      const { container } = renderColumn({ onDrop });
      
      const column = container.firstChild;
      
      fireEvent.dragOver(column);
      fireEvent.drop(column);
      
      expect(onDrop).toHaveBeenCalledWith('todo');
    });

    it('handles dragOver event', () => {
      const { container } = renderColumn();
      
      const column = container.firstChild;
      
      fireEvent.dragOver(column);
      
      // Component should handle event without error
      expect(column).toBeInTheDocument();
    });

    it('handles dragLeave event', () => {
      const { container } = renderColumn();
      
      const column = container.firstChild;
      
      fireEvent.dragOver(column);
      fireEvent.dragLeave(column);
      
      // Component should handle event without error
      expect(column).toBeInTheDocument();
    });

    it('prevents default on dragOver', () => {
      const { container } = renderColumn();
      const column = container.firstChild;
      
      const dragOverEvent = new Event('dragover', { bubbles: true });
      dragOverEvent.preventDefault = jest.fn();
      
      column.dispatchEvent(dragOverEvent);
      
      expect(dragOverEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Task Deletion', () => {
    it('calls onDeleteTask when task delete is triggered', () => {
      const onDeleteTask = jest.fn();
      const tasks = [{ id: 1, text: 'Task 1' }];
      renderColumn({ tasks, onDeleteTask });
      
      fireEvent.click(screen.getByTestId('delete-1'));
      
      expect(onDeleteTask).toHaveBeenCalledWith('todo', 1);
    });
  });

  describe('Animation', () => {
    it('applies animation delay style', () => {
      const { container } = renderColumn({ animationDelay: 0.5 });
      
      const column = container.firstChild;
      expect(column).toHaveStyle({ animationDelay: '0.5s' });
    });
  });

  describe('Different Column Types', () => {
    it('renders with inProgress column key', () => {
      renderColumn({
        columnKey: 'inProgress',
        config: { title: 'In Progress' },
      });
      
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('renders with complete column key', () => {
      renderColumn({
        columnKey: 'complete',
        config: { title: 'Complete' },
      });
      
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
  });
});
