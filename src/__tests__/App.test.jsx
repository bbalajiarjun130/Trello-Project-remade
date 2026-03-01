import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Plus: ({ size, className }) => (
    <svg data-testid="plus-icon" width={size} className={className} />
  ),
  GripVertical: ({ size, className }) => (
    <svg data-testid="grip-icon" width={size} className={className} />
  ),
}));

describe('App', () => {
  describe('Rendering', () => {
    it('renders header with title', () => {
      render(<App />);
      
      expect(screen.getByText('Project Board')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      render(<App />);
      
      expect(screen.getByText(/organize your tasks with drag & drop/i)).toBeInTheDocument();
    });

    it('renders all three columns', () => {
      render(<App />);
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('renders three Add Task buttons (one per column)', () => {
      render(<App />);
      
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      expect(addButtons).toHaveLength(3);
    });

    it('initially has zero tasks in all columns', () => {
      render(<App />);
      
      // Each column should show 0 count
      const zeroCounts = screen.getAllByText('0');
      expect(zeroCounts).toHaveLength(3);
    });
  });

  describe('Adding Tasks', () => {
    it('adds task to todo column', () => {
      render(<App />);
      
      // Find the To Do column and its Add Task button
      const columns = screen.getAllByRole('button', { name: /add task/i });
      const todoAddButton = columns[0]; // First column is To Do
      
      // Click to show input
      fireEvent.click(todoAddButton);
      
      // Find and fill the input
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'New Todo Task' } });
      
      // Find the Add Task button in the input form
      const submitButton = screen.getAllByRole('button', { name: /add task/i })[0];
      fireEvent.click(submitButton);
      
      // Verify task is added
      expect(screen.getByText('New Todo Task')).toBeInTheDocument();
    });

    it('updates task count after adding', () => {
      render(<App />);
      
      // Initial state - all zeros
      expect(screen.getAllByText('0')).toHaveLength(3);
      
      // Add a task
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Should now have one "1" and two "0"s
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('0')).toHaveLength(2);
    });

    it('can add multiple tasks', () => {
      render(<App />);
      
      // Add first task
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      let input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Add second task
      fireEvent.click(screen.getAllByRole('button', { name: /add task/i })[0]);
      input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Deleting Tasks', () => {
    it('removes task when delete button is clicked', () => {
      render(<App />);
      
      // Add a task first
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Task to delete' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Verify task exists
      expect(screen.getByText('Task to delete')).toBeInTheDocument();
      
      // Find and click delete button (the × button)
      const deleteButton = screen.getByText('×');
      fireEvent.click(deleteButton);
      
      // Task should be removed
      expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    });

    it('updates count after deletion', () => {
      render(<App />);
      
      // Add a task
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(screen.getByText('1')).toBeInTheDocument();
      
      // Delete the task
      fireEvent.click(screen.getByText('×'));
      
      // Count should be back to 0
      expect(screen.getAllByText('0')).toHaveLength(3);
    });
  });

  describe('Canceling Task Input', () => {
    it('hides input when cancel is clicked', () => {
      render(<App />);
      
      // Show input
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      expect(screen.getByPlaceholderText(/enter task name/i)).toBeInTheDocument();
      
      // Click cancel
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      // Input should be hidden
      expect(screen.queryByPlaceholderText(/enter task name/i)).not.toBeInTheDocument();
    });

    it('clears input value when canceled', () => {
      render(<App />);
      
      // Show input and type something
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Partial task' } });
      
      // Cancel
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      // Reopen - should be empty
      fireEvent.click(screen.getAllByRole('button', { name: /add task/i })[0]);
      expect(screen.getByPlaceholderText(/enter task name/i).value).toBe('');
    });
  });

  describe('Drag and Drop UI', () => {
    it('tasks are draggable', () => {
      render(<App />);
      
      // Add a task
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Draggable Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Find the task card (it should have draggable attribute)
      const taskText = screen.getByText('Draggable Task');
      const taskCard = taskText.closest('[draggable]');
      
      expect(taskCard).toHaveAttribute('draggable', 'true');
    });
  });

  describe('Layout', () => {
    it('has proper container structure', () => {
      const { container } = render(<App />);
      
      // Check that container exists
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders columns in correct order', () => {
      render(<App />);
      
      const headings = screen.getAllByRole('heading', { level: 2 });
      const titles = headings.map(h => h.textContent.replace(/\d+/g, '').trim());
      
      expect(titles[0]).toBe('To Do');
      expect(titles[1]).toBe('In Progress');
      expect(titles[2]).toBe('Complete');
    });
  });

  describe('Integration - Task Workflow', () => {
    it('can add task and see it displayed', () => {
      render(<App />);
      
      // Full workflow test
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      
      // Add to To Do
      fireEvent.click(addButtons[0]);
      let input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Important Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(screen.getByText('Important Task')).toBeInTheDocument();
    });

    it('tasks can be added to different columns', () => {
      render(<App />);
      
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      
      // Add to first column (To Do)
      fireEvent.click(addButtons[0]);
      let input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Todo Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Add to second column (In Progress)
      fireEvent.click(screen.getAllByRole('button', { name: /add task/i })[1]);
      input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Progress Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Add to third column (Complete)
      fireEvent.click(screen.getAllByRole('button', { name: /add task/i })[2]);
      input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Done Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(screen.getByText('Todo Task')).toBeInTheDocument();
      expect(screen.getByText('Progress Task')).toBeInTheDocument();
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
  });

  describe('Empty State Handling', () => {
    it('does not add empty tasks', () => {
      render(<App />);
      
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Count should still be 0
      expect(screen.getAllByText('0')).toHaveLength(3);
    });

    it('does not add whitespace-only tasks', () => {
      render(<App />);
      
      const addButtons = screen.getAllByRole('button', { name: /add task/i });
      fireEvent.click(addButtons[0]);
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      // Count should still be 0
      expect(screen.getAllByText('0')).toHaveLength(3);
    });
  });
});
