import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

// Mock the columnConfig module
jest.mock('../../config/columnConfig', () => ({
  canMoveTo: jest.fn((source, target) => {
    // Mock valid transitions: todo -> inProgress, inProgress -> complete
    if (source === target) return true;
    if (source === 'todo' && target === 'inProgress') return true;
    if (source === 'inProgress' && target === 'complete') return true;
    return false;
  }),
}));

describe('useDragAndDrop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('initializes with null draggedItem', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      expect(result.current.draggedItem).toBeNull();
    });

    it('initializes with null restrictionMessage', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      expect(result.current.restrictionMessage).toBeNull();
    });

    it('provides handleDragStart function', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      expect(typeof result.current.handleDragStart).toBe('function');
    });

    it('provides handleDragEnd function', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      expect(typeof result.current.handleDragEnd).toBe('function');
    });

    it('provides handleDrop function', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      expect(typeof result.current.handleDrop).toBe('function');
    });
  });

  describe('handleDragStart', () => {
    it('sets draggedItem on handleDragStart', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      const task = { id: 1, text: 'Test Task' };
      
      act(() => {
        result.current.handleDragStart(task, 'todo');
      });
      
      expect(result.current.draggedItem).toEqual({
        task: { id: 1, text: 'Test Task' },
        sourceColumn: 'todo',
      });
    });

    it('stores task and sourceColumn correctly', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      const task = { id: 42, text: 'Another Task' };
      
      act(() => {
        result.current.handleDragStart(task, 'inProgress');
      });
      
      expect(result.current.draggedItem.task).toEqual(task);
      expect(result.current.draggedItem.sourceColumn).toBe('inProgress');
    });

    it('clears any previous restrictionMessage', () => {
      const onDrop = jest.fn(() => false);
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      // First, trigger an invalid drop to set a restriction message
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('complete'); // Invalid transition
      });
      
      expect(result.current.restrictionMessage).not.toBeNull();
      
      // Start a new drag
      act(() => {
        result.current.handleDragStart({ id: 2, text: 'New Task' }, 'inProgress');
      });
      
      expect(result.current.restrictionMessage).toBeNull();
    });
  });

  describe('handleDragEnd', () => {
    it('clears draggedItem on handleDragEnd', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      
      expect(result.current.draggedItem).not.toBeNull();
      
      act(() => {
        result.current.handleDragEnd();
      });
      
      expect(result.current.draggedItem).toBeNull();
    });
  });

  describe('handleDrop - Valid Transitions', () => {
    it('calls onDrop callback for valid transitions (todo -> inProgress)', () => {
      const onDrop = jest.fn(() => true);
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      const task = { id: 1, text: 'Task' };
      
      act(() => {
        result.current.handleDragStart(task, 'todo');
      });
      act(() => {
        result.current.handleDrop('inProgress');
      });
      
      expect(onDrop).toHaveBeenCalledWith(1, 'todo', 'inProgress');
    });

    it('calls onDrop callback for valid transitions (inProgress -> complete)', () => {
      const onDrop = jest.fn(() => true);
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      const task = { id: 2, text: 'Task' };
      
      act(() => {
        result.current.handleDragStart(task, 'inProgress');
      });
      act(() => {
        result.current.handleDrop('complete');
      });
      
      expect(onDrop).toHaveBeenCalledWith(2, 'inProgress', 'complete');
    });

    it('clears draggedItem after successful drop', () => {
      const onDrop = jest.fn(() => true);
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('inProgress');
      });
      
      expect(result.current.draggedItem).toBeNull();
    });
  });

  describe('handleDrop - Invalid Transitions', () => {
    it('does not call onDrop for invalid transitions (todo -> complete)', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('complete');
      });
      
      expect(onDrop).not.toHaveBeenCalled();
    });

    it('sets restrictionMessage for invalid moves', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('complete');
      });
      
      expect(result.current.restrictionMessage).toContain('Cannot move task');
    });

    it('clears restrictionMessage after 3 seconds', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('complete');
      });
      
      expect(result.current.restrictionMessage).not.toBeNull();
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(result.current.restrictionMessage).toBeNull();
    });

    it('clears draggedItem after invalid drop', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('complete');
      });
      
      expect(result.current.draggedItem).toBeNull();
    });
  });

  describe('handleDrop - onDrop callback returns false', () => {
    it('sets restrictionMessage when onDrop returns false', () => {
      const onDrop = jest.fn(() => false);
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('inProgress');
      });
      
      expect(result.current.restrictionMessage).toBe('Move not allowed');
    });

    it('clears restrictionMessage after timeout when onDrop returns false', () => {
      const onDrop = jest.fn(() => false);
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('inProgress');
      });
      
      expect(result.current.restrictionMessage).toBe('Move not allowed');
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(result.current.restrictionMessage).toBeNull();
    });
  });

  describe('handleDrop - Edge Cases', () => {
    it('does nothing when draggedItem is null', () => {
      const onDrop = jest.fn();
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDrop('todo');
      });
      
      expect(onDrop).not.toHaveBeenCalled();
    });

    it('handles same column drop (no-op)', () => {
      const onDrop = jest.fn(() => true);
      const { result } = renderHook(() => useDragAndDrop(onDrop));
      
      act(() => {
        result.current.handleDragStart({ id: 1, text: 'Task' }, 'todo');
      });
      act(() => {
        result.current.handleDrop('todo');
      });
      
      // Same column is allowed according to canMoveTo mock
      expect(onDrop).toHaveBeenCalledWith(1, 'todo', 'todo');
    });
  });

  describe('Callback Stability', () => {
    it('handleDragStart is memoized', () => {
      const onDrop = jest.fn();
      const { result, rerender } = renderHook(() => useDragAndDrop(onDrop));
      
      const firstCallback = result.current.handleDragStart;
      rerender();
      
      expect(result.current.handleDragStart).toBe(firstCallback);
    });

    it('handleDragEnd is memoized', () => {
      const onDrop = jest.fn();
      const { result, rerender } = renderHook(() => useDragAndDrop(onDrop));
      
      const firstCallback = result.current.handleDragEnd;
      rerender();
      
      expect(result.current.handleDragEnd).toBe(firstCallback);
    });
  });
});
