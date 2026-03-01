import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskInput from '../../components/TaskInput';

describe('TaskInput', () => {
  const defaultProps = {
    onAdd: jest.fn(),
    onCancel: jest.fn(),
    bgGradient: 'from-blue-100 to-blue-200',
  };

  const renderTaskInput = (props = {}) => {
    return render(<TaskInput {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders input field', () => {
      renderTaskInput();
      
      expect(screen.getByPlaceholderText(/enter task name/i)).toBeInTheDocument();
    });

    it('renders Add Task button', () => {
      renderTaskInput();
      
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('renders Cancel button', () => {
      renderTaskInput();
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('input is focused on render', () => {
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      expect(input).toHaveFocus();
    });

    it('input starts empty', () => {
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      expect(input.value).toBe('');
    });
  });

  describe('Input Behavior', () => {
    it('updates input value on change', () => {
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'New task' } });
      
      expect(input.value).toBe('New task');
    });

    it('handles typing multiple characters', () => {
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'A' } });
      fireEvent.change(input, { target: { value: 'AB' } });
      fireEvent.change(input, { target: { value: 'ABC' } });
      
      expect(input.value).toBe('ABC');
    });

    it('handles clearing input', () => {
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Some text' } });
      fireEvent.change(input, { target: { value: '' } });
      
      expect(input.value).toBe('');
    });
  });

  describe('Submit Behavior', () => {
    it('calls onAdd on button click with valid input', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'New Task' } });
      
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).toHaveBeenCalledWith('New Task');
    });

    it('calls onAdd on Enter key', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Keyboard Task' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(onAdd).toHaveBeenCalledWith('Keyboard Task');
    });

    it('clears input after submission', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Test Task' } });
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(input.value).toBe('');
    });

    it('does not submit empty input - empty string', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('does not submit empty input - whitespace only', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('does not clear input if submission fails (empty)', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      // Input should still have the whitespace since it wasn't submitted
      expect(input.value).toBe('   ');
    });
  });

  describe('Cancel Behavior', () => {
    it('calls onCancel on Cancel button click', () => {
      const onCancel = jest.fn();
      renderTaskInput({ onCancel });
      
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel on Escape key', () => {
      const onCancel = jest.fn();
      renderTaskInput({ onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('does not call onAdd when cancelled', () => {
      const onAdd = jest.fn();
      const onCancel = jest.fn();
      renderTaskInput({ onAdd, onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Task to cancel' } });
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      expect(onAdd).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('Enter key triggers submit', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(onAdd).toHaveBeenCalled();
    });

    it('Escape key triggers cancel', () => {
      const onCancel = jest.fn();
      renderTaskInput({ onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      
      expect(onCancel).toHaveBeenCalled();
    });

    it('other keys do not trigger submit or cancel', () => {
      const onAdd = jest.fn();
      const onCancel = jest.fn();
      renderTaskInput({ onAdd, onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });
      
      expect(onAdd).not.toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('applies background gradient from prop', () => {
      const { container } = renderTaskInput({ bgGradient: 'from-red-100 to-red-200' });
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-gradient-to-r', 'from-red-100', 'to-red-200');
    });

    it('has fade-in animation class', () => {
      const { container } = renderTaskInput();
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('fade-in');
    });

    it('Add Task button has correct styling', () => {
      renderTaskInput();
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      expect(addButton).toHaveClass('bg-slate-700', 'text-white');
    });
  });

  describe('Input Attributes', () => {
    it('input has correct type', () => {
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      expect(input).toHaveAttribute('type', 'text');
    });

    it('input has autoFocus attribute', () => {
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      expect(input).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid submit clicks', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Test' } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      fireEvent.click(addButton); // Second click should not submit (input is cleared)
      
      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('handles special characters in input', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: 'Task with <script>alert("xss")</script>' } });
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).toHaveBeenCalledWith('Task with <script>alert("xss")</script>');
    });

    it('handles very long input', () => {
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const longText = 'A'.repeat(1000);
      const input = screen.getByPlaceholderText(/enter task name/i);
      fireEvent.change(input, { target: { value: longText } });
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).toHaveBeenCalledWith(longText);
    });
  });
});
