export const COLUMN_TYPES = {
  TODO: 'todo',
  IN_PROGRESS: 'inProgress',
  COMPLETE: 'complete'
};

export const columnConfig = {
  [COLUMN_TYPES.TODO]: {
    title: 'To Do'
  },
  [COLUMN_TYPES.IN_PROGRESS]: {
    title: 'In Progress'
  },
  [COLUMN_TYPES.COMPLETE]: {
    title: 'Complete'
  }
};

/**
 * Check if a task can be moved from source column to target column
 * @param {string} sourceColumn - The column the task is coming from
 * @param {string} targetColumn - The column the task is being moved to
 * @returns {boolean} - Whether the move is allowed
 */
export function canMoveTo(sourceColumn, targetColumn) {
  // Same column is always allowed (no-op)
  if (sourceColumn === targetColumn) return true;
  
  const allowed = allowedTransitions[sourceColumn];
  return allowed ? allowed.includes(targetColumn) : false;
}

/**
 * Get allowed target columns for a given source column
 * @param {string} sourceColumn - The source column
 * @returns {string[]} - Array of allowed target column keys
 */
export function getAllowedTargets(sourceColumn) {
  return allowedTransitions[sourceColumn] || [];
}

export function addColumnType(key, config) {
  return {
    ...columnConfig,
    [key]: config
  };
}