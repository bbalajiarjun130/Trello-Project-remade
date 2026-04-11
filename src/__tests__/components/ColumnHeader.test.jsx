import React from 'react';
import { render, screen } from '@testing-library/react';
import ColumnHeader from '../../components/ColumnHeader';

describe('ColumnHeader', () => {
  const defaultProps = {
    title: 'To Do',
    count: 5,
    colorGradient: 'from-blue-500 to-blue-600',
  };

  const renderColumnHeader = (props = {}) => {
    return render(<ColumnHeader {...defaultProps} {...props} />);
  };

  describe('Rendering', () => {
    it('renders title correctly', () => {
      renderColumnHeader();
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('renders count in badge', () => {
      renderColumnHeader({ count: 10 });
      
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders zero count', () => {
      renderColumnHeader({ count: 0 });
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders large count numbers', () => {
      renderColumnHeader({ count: 999 });
      
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });

  describe('Different Titles', () => {
    it('renders In Progress title', () => {
      renderColumnHeader({ title: 'In Progress' });
      
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('renders Complete title', () => {
      renderColumnHeader({ title: 'Complete' });
      
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('renders custom title', () => {
      renderColumnHeader({ title: 'Custom Column' });
      
      expect(screen.getByText('Custom Column')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses h2 heading element', () => {
      renderColumnHeader();
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('heading contains title text', () => {
      renderColumnHeader({ title: 'Test Title' });
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveTextContent('Test Title');
    });
  });
});
