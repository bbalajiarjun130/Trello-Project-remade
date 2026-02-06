import React from 'react';
import Column from './components/Column';
import { useTaskManager } from './hooks/useTaskManager';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { columnConfig, COLUMN_TYPES, canMoveTo } from './config/columnConfig';
import styles from './App.module.css';

export default function App() {
  // Custom hooks handle specific responsibilities (SRP + DIP)
  const { tasks, addTask, deleteTask, moveTask } = useTaskManager({
    [COLUMN_TYPES.TODO]: [],
    [COLUMN_TYPES.IN_PROGRESS]: [],
    [COLUMN_TYPES.COMPLETE]: []
  });

  // Wrap moveTask with column restriction validation
  const restrictedMoveTask = (taskId, sourceColumn, targetColumn) => {
    if (!canMoveTo(sourceColumn, targetColumn)) {
      return false; // Move not allowed
    }
    moveTask(taskId, sourceColumn, targetColumn);
    return true;
  };

  const { handleDragStart, handleDrop, restrictionMessage } = useDragAndDrop(restrictedMoveTask);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Project Board</h1>
          <p className={styles.subtitle}>
            Organize your tasks with drag & drop simplicity
          </p>
          {restrictionMessage && (
            <div className={styles.restrictionToast}>
              ⚠️ {restrictionMessage}
            </div>
          )}
        </header>
        
        <div className={styles.columnsContainer}>
          {/* OCP: Using configuration, easy to add new columns */}
          {Object.entries(columnConfig).map(([columnKey, config], index) => (
            <Column
              key={columnKey}
              columnKey={columnKey}
              config={config}
              tasks={tasks[columnKey]}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              animationDelay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
