import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskButton from '../../components/AddTaskButton';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Plus: () => <svg data-testid="plus-icon" />,
}));

describe('AddTaskButton', () => {
  describe('Rendering', () => {
    it('renders an accessible button labeled "Add Task"', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('renders an icon alongside the button text', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onClick when user clicks the button', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<AddTaskButton onClick={handleClick} />);
      
      await user.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();
      render(<AddTaskButton />);
      
      await expect(
        user.click(screen.getByRole('button', { name: /add task/i }))
      ).resolves.not.toThrow();
    });
  });
});
