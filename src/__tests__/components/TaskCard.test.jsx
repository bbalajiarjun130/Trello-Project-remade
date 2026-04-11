import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../../components/TaskCard';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  GripVertical: () => <svg data-testid="grip-icon" />,
}));

describe('TaskCard', () => {
  const defaultProps = {
    task: { id: 1, text: 'Test Task' },
    columnKey: 'todo',
    onDragStart: jest.fn(),
    onDelete: jest.fn(),
    animationDelay: 0,
  };

  const renderTaskCard = (props = {}) => {
    return render(<TaskCard {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders task text', () => {
      renderTaskCard();
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('renders drag handle icon', () => {
      renderTaskCard();
      
      expect(screen.getByTestId('grip-icon')).toBeInTheDocument();
    });

    it('renders delete button', () => {
      renderTaskCard();
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('renders long task text', () => {
      const longText = 'This is a very long task description that might wrap to multiple lines';
      renderTaskCard({ task: { id: 1, text: longText } });
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('renders task with special characters', () => {
      const specialText = 'Task with <special> & "characters"';
      renderTaskCard({ task: { id: 1, text: specialText } });
      
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Drag Functionality', () => {
    it('has draggable attribute', () => {
      const { container } = renderTaskCard();
      
      const card = container.firstChild;
      expect(card).toHaveAttribute('draggable', 'true');
    });

    it('calls onDragStart on drag start', () => {
      const onDragStart = jest.fn();
      const { container } = renderTaskCard({ onDragStart });
      
      const card = container.firstChild;
      fireEvent.dragStart(card);
      
      expect(onDragStart).toHaveBeenCalledWith(
        { id: 1, text: 'Test Task' },
        'todo'
      );
    });

    it('calls onDragStart with correct columnKey', () => {
      const onDragStart = jest.fn();
      renderTaskCard({ 
        onDragStart,
        columnKey: 'inProgress',
        task: { id: 2, text: 'In Progress Task' }
      });
      
      const card = screen.getByText('In Progress Task').closest('[draggable]');
      fireEvent.dragStart(card);
      
      expect(onDragStart).toHaveBeenCalledWith(
        { id: 2, text: 'In Progress Task' },
        'inProgress'
      );
    });

    it('handles dragEnd event', () => {
      const { container } = renderTaskCard();
      
      const card = container.firstChild;
      fireEvent.dragStart(card);
      fireEvent.dragEnd(card);
      
      // Should not throw and card should still be rendered
      expect(card).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    it('calls onDelete when user clicks the delete button', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      renderTaskCard({ onDelete });
      
      await user.click(screen.getByRole('button'));
      
      expect(onDelete).toHaveBeenCalledWith('todo', 1);
    });

    it('calls onDelete with correct columnKey and taskId', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      renderTaskCard({ 
        onDelete,
        columnKey: 'complete',
        task: { id: 42, text: 'Completed Task' }
      });
      
      await user.click(screen.getByRole('button'));
      
      expect(onDelete).toHaveBeenCalledWith('complete', 42);
    });

    it('delete button is clickable', () => {
      const onDelete = jest.fn();
      renderTaskCard({ onDelete });
      
      const deleteButton = screen.getByRole('button');
      expect(deleteButton).not.toBeDisabled();
    });
  });

  describe('Different Column Keys', () => {
    it('works with todo column', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      renderTaskCard({ columnKey: 'todo', onDelete });
      
      await user.click(screen.getByRole('button'));
      expect(onDelete).toHaveBeenCalledWith('todo', 1);
    });

    it('works with inProgress column', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      renderTaskCard({ columnKey: 'inProgress', onDelete });
      
      await user.click(screen.getByRole('button'));
      expect(onDelete).toHaveBeenCalledWith('inProgress', 1);
    });

    it('works with complete column', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      renderTaskCard({ columnKey: 'complete', onDelete });
      
      await user.click(screen.getByRole('button'));
      expect(onDelete).toHaveBeenCalledWith('complete', 1);
    });
  });
});
