import { 
  COLUMN_TYPES, 
  columnConfig, 
  canMoveTo, 
  getAllowedTargets, 
  addColumnType 
} from '../../config/columnConfig';

describe('columnConfig', () => {
  describe('COLUMN_TYPES', () => {
    it('has TODO type', () => {
      expect(COLUMN_TYPES.TODO).toBe('todo');
    });

    it('has IN_PROGRESS type', () => {
      expect(COLUMN_TYPES.IN_PROGRESS).toBe('inProgress');
    });

    it('has COMPLETE type', () => {
      expect(COLUMN_TYPES.COMPLETE).toBe('complete');
    });

    it('has exactly 3 column types', () => {
      expect(Object.keys(COLUMN_TYPES)).toHaveLength(3);
    });
  });

  describe('columnConfig object', () => {
    it('has configuration for TODO column', () => {
      expect(columnConfig[COLUMN_TYPES.TODO]).toBeDefined();
      expect(columnConfig[COLUMN_TYPES.TODO].title).toBe('To Do');
    });

    it('has configuration for IN_PROGRESS column', () => {
      expect(columnConfig[COLUMN_TYPES.IN_PROGRESS]).toBeDefined();
      expect(columnConfig[COLUMN_TYPES.IN_PROGRESS].title).toBe('In Progress');
    });

    it('has configuration for COMPLETE column', () => {
      expect(columnConfig[COLUMN_TYPES.COMPLETE]).toBeDefined();
      expect(columnConfig[COLUMN_TYPES.COMPLETE].title).toBe('Complete');
    });

    it('all column types have configurations', () => {
      Object.values(COLUMN_TYPES).forEach(columnType => {
        expect(columnConfig[columnType]).toBeDefined();
      });
    });

    it('each configuration has a title', () => {
      Object.values(columnConfig).forEach(config => {
        expect(config.title).toBeDefined();
        expect(typeof config.title).toBe('string');
      });
    });
  });

  describe('canMoveTo', () => {
    describe('same column moves', () => {
      it('returns true for TODO → TODO (same column)', () => {
        expect(canMoveTo(COLUMN_TYPES.TODO, COLUMN_TYPES.TODO)).toBe(true);
      });

      it('returns true for IN_PROGRESS → IN_PROGRESS (same column)', () => {
        expect(canMoveTo(COLUMN_TYPES.IN_PROGRESS, COLUMN_TYPES.IN_PROGRESS)).toBe(true);
      });

      it('returns true for COMPLETE → COMPLETE (same column)', () => {
        expect(canMoveTo(COLUMN_TYPES.COMPLETE, COLUMN_TYPES.COMPLETE)).toBe(true);
      });
    });

    describe('valid transitions', () => {
      it('returns true for TODO → IN_PROGRESS', () => {
        expect(canMoveTo(COLUMN_TYPES.TODO, COLUMN_TYPES.IN_PROGRESS)).toBe(true);
      });

      it('returns true for IN_PROGRESS → COMPLETE', () => {
        expect(canMoveTo(COLUMN_TYPES.IN_PROGRESS, COLUMN_TYPES.COMPLETE)).toBe(true);
      });
    });

    describe('invalid transitions', () => {
      it('returns false for TODO → COMPLETE (skipping IN_PROGRESS)', () => {
        expect(canMoveTo(COLUMN_TYPES.TODO, COLUMN_TYPES.COMPLETE)).toBe(false);
      });

      it('returns false for COMPLETE → TODO (backward)', () => {
        expect(canMoveTo(COLUMN_TYPES.COMPLETE, COLUMN_TYPES.TODO)).toBe(false);
      });

      it('returns false for COMPLETE → IN_PROGRESS (backward)', () => {
        expect(canMoveTo(COLUMN_TYPES.COMPLETE, COLUMN_TYPES.IN_PROGRESS)).toBe(false);
      });

      it('returns false for IN_PROGRESS → TODO (backward)', () => {
        expect(canMoveTo(COLUMN_TYPES.IN_PROGRESS, COLUMN_TYPES.TODO)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('returns false for unknown source column', () => {
        expect(canMoveTo('unknown', COLUMN_TYPES.TODO)).toBe(false);
      });

      it('returns false for unknown target column', () => {
        expect(canMoveTo(COLUMN_TYPES.TODO, 'unknown')).toBe(false);
      });

      it('returns false for both columns unknown', () => {
        expect(canMoveTo('source', 'target')).toBe(false);
      });
    });
  });

  describe('getAllowedTargets', () => {
    it('returns [IN_PROGRESS] for TODO column', () => {
      const targets = getAllowedTargets(COLUMN_TYPES.TODO);
      expect(targets).toEqual([COLUMN_TYPES.IN_PROGRESS]);
    });

    it('returns [COMPLETE] for IN_PROGRESS column', () => {
      const targets = getAllowedTargets(COLUMN_TYPES.IN_PROGRESS);
      expect(targets).toEqual([COLUMN_TYPES.COMPLETE]);
    });

    it('returns empty array for COMPLETE column', () => {
      const targets = getAllowedTargets(COLUMN_TYPES.COMPLETE);
      expect(targets).toEqual([]);
    });

    it('returns empty array for unknown column', () => {
      const targets = getAllowedTargets('unknown');
      expect(targets).toEqual([]);
    });

    it('returned arrays are consistent with canMoveTo', () => {
      Object.values(COLUMN_TYPES).forEach(source => {
        const targets = getAllowedTargets(source);
        targets.forEach(target => {
          expect(canMoveTo(source, target)).toBe(true);
        });
      });
    });
  });

  describe('addColumnType', () => {
    it('creates extended config with new column', () => {
      const newConfig = addColumnType('review', { title: 'Review' });
      
      expect(newConfig.review).toEqual({ title: 'Review' });
    });

    it('preserves existing columns', () => {
      const newConfig = addColumnType('review', { title: 'Review' });
      
      expect(newConfig[COLUMN_TYPES.TODO]).toEqual(columnConfig[COLUMN_TYPES.TODO]);
      expect(newConfig[COLUMN_TYPES.IN_PROGRESS]).toEqual(columnConfig[COLUMN_TYPES.IN_PROGRESS]);
      expect(newConfig[COLUMN_TYPES.COMPLETE]).toEqual(columnConfig[COLUMN_TYPES.COMPLETE]);
    });

    it('does not modify original columnConfig', () => {
      const originalKeys = Object.keys(columnConfig);
      addColumnType('test', { title: 'Test' });
      
      expect(Object.keys(columnConfig)).toEqual(originalKeys);
    });

    it('can override existing column', () => {
      const newConfig = addColumnType(COLUMN_TYPES.TODO, { title: 'New To Do' });
      
      expect(newConfig[COLUMN_TYPES.TODO].title).toBe('New To Do');
    });

    it('handles complex config objects', () => {
      const complexConfig = {
        title: 'Complex',
        icon: 'star',
        color: 'purple',
        maxTasks: 10,
      };
      const newConfig = addColumnType('complex', complexConfig);
      
      expect(newConfig.complex).toEqual(complexConfig);
    });
  });

  describe('Workflow integrity', () => {
    it('enforces linear progression TODO → IN_PROGRESS → COMPLETE', () => {
      // Valid forward path
      expect(canMoveTo(COLUMN_TYPES.TODO, COLUMN_TYPES.IN_PROGRESS)).toBe(true);
      expect(canMoveTo(COLUMN_TYPES.IN_PROGRESS, COLUMN_TYPES.COMPLETE)).toBe(true);
      
      // No skipping
      expect(canMoveTo(COLUMN_TYPES.TODO, COLUMN_TYPES.COMPLETE)).toBe(false);
      
      // No going back
      expect(canMoveTo(COLUMN_TYPES.COMPLETE, COLUMN_TYPES.IN_PROGRESS)).toBe(false);
      expect(canMoveTo(COLUMN_TYPES.IN_PROGRESS, COLUMN_TYPES.TODO)).toBe(false);
    });

    it('COMPLETE is a terminal state', () => {
      const targets = getAllowedTargets(COLUMN_TYPES.COMPLETE);
      expect(targets).toHaveLength(0);
    });
  });
});
