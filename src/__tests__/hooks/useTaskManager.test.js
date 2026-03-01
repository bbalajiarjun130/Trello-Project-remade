import { renderHook, act } from '@testing-library/react';
import { useTaskManager } from '../../hooks/useTaskManager';

describe('useTaskManager', () => {
  describe('Initialization', () => {
    it('initializes with provided tasks', () => {
      const initialTasks = {
        todo: [{ id: 1, text: 'Task 1' }],
        inProgress: [],
        complete: [],
      };
      
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      expect(result.current.tasks).toEqual(initialTasks);
    });

    it('initializes with empty object when no initialTasks provided', () => {
      const { result } = renderHook(() => useTaskManager());
      
      expect(result.current.tasks).toEqual({});
    });

    it('initializes with multiple tasks in column', () => {
      const initialTasks = {
        todo: [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' },
          { id: 3, text: 'Task 3' },
        ],
        inProgress: [],
        complete: [],
      };
      
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      expect(result.current.tasks.todo).toHaveLength(3);
    });
  });

  describe('addTask', () => {
    it('creates new task with id and text', () => {
      const initialTasks = { todo: [], inProgress: [], complete: [] };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.addTask('todo', 'New Task');
      });
      
      expect(result.current.tasks.todo).toHaveLength(1);
      expect(result.current.tasks.todo[0].text).toBe('New Task');
      expect(typeof result.current.tasks.todo[0].id).toBe('number');
    });

    it('appends task to correct column', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Existing' }], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.addTask('todo', 'New Task');
      });
      
      expect(result.current.tasks.todo).toHaveLength(2);
      expect(result.current.tasks.todo[1].text).toBe('New Task');
    });

    it('does not affect other columns', () => {
      const initialTasks = { 
        todo: [], 
        inProgress: [{ id: 1, text: 'In Progress Task' }], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.addTask('todo', 'New Task');
      });
      
      expect(result.current.tasks.inProgress).toHaveLength(1);
      expect(result.current.tasks.complete).toHaveLength(0);
    });

    it('adds to inProgress column', () => {
      const initialTasks = { todo: [], inProgress: [], complete: [] };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.addTask('inProgress', 'Progress Task');
      });
      
      expect(result.current.tasks.inProgress).toHaveLength(1);
      expect(result.current.tasks.inProgress[0].text).toBe('Progress Task');
    });

    it('adds to complete column', () => {
      const initialTasks = { todo: [], inProgress: [], complete: [] };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.addTask('complete', 'Done Task');
      });
      
      expect(result.current.tasks.complete).toHaveLength(1);
    });

    it('generates unique ids for multiple tasks', () => {
      const initialTasks = { todo: [], inProgress: [], complete: [] };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      // Add multiple tasks with small delay to ensure different timestamps
      act(() => {
        result.current.addTask('todo', 'Task 1');
      });
      
      const firstId = result.current.tasks.todo[0].id;
      
      // Mock Date.now to return different value
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 1);
      
      act(() => {
        result.current.addTask('todo', 'Task 2');
      });
      
      Date.now = originalDateNow;
      
      const secondId = result.current.tasks.todo[1].id;
      expect(firstId).not.toBe(secondId);
    });
  });

  describe('deleteTask', () => {
    it('removes task from column', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Task to delete' }], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.deleteTask('todo', 1);
      });
      
      expect(result.current.tasks.todo).toHaveLength(0);
    });

    it('removes only specified task', () => {
      const initialTasks = { 
        todo: [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' },
          { id: 3, text: 'Task 3' },
        ], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.deleteTask('todo', 2);
      });
      
      expect(result.current.tasks.todo).toHaveLength(2);
      expect(result.current.tasks.todo.find(t => t.id === 2)).toBeUndefined();
      expect(result.current.tasks.todo.find(t => t.id === 1)).toBeDefined();
      expect(result.current.tasks.todo.find(t => t.id === 3)).toBeDefined();
    });

    it('does not affect other columns', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Task 1' }], 
        inProgress: [{ id: 2, text: 'Task 2' }], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.deleteTask('todo', 1);
      });
      
      expect(result.current.tasks.inProgress).toHaveLength(1);
    });

    it('handles deleting non-existent task', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Task 1' }], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.deleteTask('todo', 999);
      });
      
      // Should not throw and task list should be unchanged
      expect(result.current.tasks.todo).toHaveLength(1);
    });

    it('deletes from inProgress column', () => {
      const initialTasks = { 
        todo: [], 
        inProgress: [{ id: 5, text: 'In Progress Task' }], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.deleteTask('inProgress', 5);
      });
      
      expect(result.current.tasks.inProgress).toHaveLength(0);
    });

    it('deletes from complete column', () => {
      const initialTasks = { 
        todo: [], 
        inProgress: [], 
        complete: [{ id: 10, text: 'Completed Task' }] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.deleteTask('complete', 10);
      });
      
      expect(result.current.tasks.complete).toHaveLength(0);
    });
  });

  describe('moveTask', () => {
    it('transfers task between columns', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Task to move' }], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(1, 'todo', 'inProgress');
      });
      
      expect(result.current.tasks.todo).toHaveLength(0);
      expect(result.current.tasks.inProgress).toHaveLength(1);
      expect(result.current.tasks.inProgress[0]).toEqual({ id: 1, text: 'Task to move' });
    });

    it('does nothing for same column move', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Task 1' }], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(1, 'todo', 'todo');
      });
      
      expect(result.current.tasks.todo).toHaveLength(1);
    });

    it('handles non-existent task gracefully', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Task 1' }], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(999, 'todo', 'inProgress');
      });
      
      // Should not throw and columns should be unchanged
      expect(result.current.tasks.todo).toHaveLength(1);
      expect(result.current.tasks.inProgress).toHaveLength(0);
    });

    it('removes from source column', () => {
      const initialTasks = { 
        todo: [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' },
        ], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(1, 'todo', 'inProgress');
      });
      
      expect(result.current.tasks.todo).toHaveLength(1);
      expect(result.current.tasks.todo[0].id).toBe(2);
    });

    it('adds to target column', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'New task' }], 
        inProgress: [{ id: 2, text: 'Existing task' }], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(1, 'todo', 'inProgress');
      });
      
      expect(result.current.tasks.inProgress).toHaveLength(2);
    });

    it('appends moved task to end of target column', () => {
      const initialTasks = { 
        todo: [{ id: 1, text: 'Moving task' }], 
        inProgress: [{ id: 2, text: 'Existing task' }], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(1, 'todo', 'inProgress');
      });
      
      const lastTask = result.current.tasks.inProgress[result.current.tasks.inProgress.length - 1];
      expect(lastTask.id).toBe(1);
    });

    it('moves from inProgress to complete', () => {
      const initialTasks = { 
        todo: [], 
        inProgress: [{ id: 1, text: 'Task' }], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(1, 'inProgress', 'complete');
      });
      
      expect(result.current.tasks.inProgress).toHaveLength(0);
      expect(result.current.tasks.complete).toHaveLength(1);
    });

    it('preserves task data during move', () => {
      const originalTask = { id: 42, text: 'Important task with details' };
      const initialTasks = { 
        todo: [originalTask], 
        inProgress: [], 
        complete: [] 
      };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      act(() => {
        result.current.moveTask(42, 'todo', 'complete');
      });
      
      expect(result.current.tasks.complete[0]).toEqual(originalTask);
    });
  });

  describe('Return Values', () => {
    it('returns tasks object', () => {
      const { result } = renderHook(() => useTaskManager({}));
      
      expect(result.current.tasks).toBeDefined();
      expect(typeof result.current.tasks).toBe('object');
    });

    it('returns addTask function', () => {
      const { result } = renderHook(() => useTaskManager({}));
      
      expect(typeof result.current.addTask).toBe('function');
    });

    it('returns deleteTask function', () => {
      const { result } = renderHook(() => useTaskManager({}));
      
      expect(typeof result.current.deleteTask).toBe('function');
    });

    it('returns moveTask function', () => {
      const { result } = renderHook(() => useTaskManager({}));
      
      expect(typeof result.current.moveTask).toBe('function');
    });
  });

  describe('State Immutability', () => {
    it('addTask creates new tasks object', () => {
      const initialTasks = { todo: [], inProgress: [], complete: [] };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      const originalTasks = result.current.tasks;
      
      act(() => {
        result.current.addTask('todo', 'New Task');
      });
      
      expect(result.current.tasks).not.toBe(originalTasks);
    });

    it('deleteTask creates new tasks object', () => {
      const initialTasks = { todo: [{ id: 1, text: 'Task' }], inProgress: [], complete: [] };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      const originalTasks = result.current.tasks;
      
      act(() => {
        result.current.deleteTask('todo', 1);
      });
      
      expect(result.current.tasks).not.toBe(originalTasks);
    });

    it('moveTask creates new tasks object', () => {
      const initialTasks = { todo: [{ id: 1, text: 'Task' }], inProgress: [], complete: [] };
      const { result } = renderHook(() => useTaskManager(initialTasks));
      
      const originalTasks = result.current.tasks;
      
      act(() => {
        result.current.moveTask(1, 'todo', 'inProgress');
      });
      
      expect(result.current.tasks).not.toBe(originalTasks);
    });
  });
});
