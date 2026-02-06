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
