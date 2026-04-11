import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      expect(input).toHaveValue('');
    });
  });

  describe('Input Behavior', () => {
    it('updates input value as user types', async () => {
      const user = userEvent.setup();
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'New task');
      
      expect(input).toHaveValue('New task');
    });

    it('handles clearing input', async () => {
      const user = userEvent.setup();
      renderTaskInput();
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'Some text');
      await user.clear(input);
      
      expect(input).toHaveValue('');
    });
  });

  describe('Submit Behavior', () => {
    it('calls onAdd when user types and clicks Add Task', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'New Task');
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).toHaveBeenCalledWith('New Task');
    });

    it('calls onAdd when user types and presses Enter', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'Keyboard Task{Enter}');
      
      expect(onAdd).toHaveBeenCalledWith('Keyboard Task');
    });

    it('clears input after submission', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'Test Task');
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(input).toHaveValue('');
    });

    it('does not submit when input is empty', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('does not submit when input contains only whitespace', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('does not clear input if submission is rejected (whitespace only)', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(input).toHaveValue('   ');
    });
  });

  describe('Cancel Behavior', () => {
    it('calls onCancel when user clicks Cancel', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      renderTaskInput({ onCancel });
      
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when user presses Escape', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      renderTaskInput({ onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, '{Escape}');
      
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('does not call onAdd when user cancels after typing', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      const onCancel = jest.fn();
      renderTaskInput({ onAdd, onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'Task to cancel');
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      
      expect(onAdd).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('Enter key triggers submit with valid input', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'Test{Enter}');
      
      expect(onAdd).toHaveBeenCalled();
    });

    it('Escape key triggers cancel', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      renderTaskInput({ onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, '{Escape}');
      
      expect(onCancel).toHaveBeenCalled();
    });

    it('regular typing does not trigger submit or cancel', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      const onCancel = jest.fn();
      renderTaskInput({ onAdd, onCancel });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'a');
      
      expect(onAdd).not.toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid submit clicks gracefully', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.type(input, 'Test');
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);
      await user.click(addButton); // Second click should not submit (input is cleared)
      
      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('handles special characters in input', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const input = screen.getByPlaceholderText(/enter task name/i);
      // userEvent.type has trouble with < > { } so we use paste for special chars
      await user.click(input);
      await user.paste('Task with <script>alert("xss")</script>');
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).toHaveBeenCalledWith('Task with <script>alert("xss")</script>');
    });

    it('handles very long input', async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      renderTaskInput({ onAdd });
      
      const longText = 'A'.repeat(1000);
      const input = screen.getByPlaceholderText(/enter task name/i);
      await user.click(input);
      await user.paste(longText);
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(onAdd).toHaveBeenCalledWith(longText);
    });
  });
});
