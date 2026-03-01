import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTaskButton from '../../components/AddTaskButton';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Plus: ({ size, className }) => (
    <svg data-testid="plus-icon" width={size} className={className} />
  ),
}));

describe('AddTaskButton', () => {
  describe('Rendering', () => {
    it('renders button with correct text', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      expect(screen.getByRole('button')).toHaveTextContent('Add Task');
    });

    it('renders Plus icon', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('has proper accessibility - button role', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      const button = screen.getByRole('button', { name: /add task/i });
      expect(button).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full', 'p-4', 'rounded-xl');
    });
  });

  describe('User Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<AddTaskButton onClick={handleClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClick is not provided', () => {
      expect(() => {
        render(<AddTaskButton />);
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });
  });

  describe('Icon Styling', () => {
    it('Plus icon has correct size', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      const icon = screen.getByTestId('plus-icon');
      expect(icon).toHaveAttribute('width', '20');
    });

    it('Plus icon has transition class for hover effect', () => {
      render(<AddTaskButton onClick={() => {}} />);
      
      const icon = screen.getByTestId('plus-icon');
      expect(icon).toHaveClass('group-hover:rotate-90', 'transition-transform');
    });
  });
});
