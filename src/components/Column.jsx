import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import styles from './Column.module.css';

export default function Column({ 
  columnKey, 
  config, 
  tasks, 
  onDragStart, 
  onDrop, 
  onAddTask, 
  onDeleteTask,
  animationDelay 
}) {
  const [showInput, setShowInput] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(columnKey);
  };

  const addTask = () => {
    document.body.setAttribute('data-debug-addtask-called', 'true');
    document.body.setAttribute('data-debug-taskinput', JSON.stringify(taskInput));
    document.body.setAttribute('data-debug-taskinput-trim', JSON.stringify(taskInput.trim()));
    document.body.setAttribute('data-debug-validation-result', JSON.stringify(!taskInput.trim()));
    
    if (!taskInput.trim()) {
      document.body.setAttribute('data-debug-validation', 'prevented');
      return;
    }
    
    document.body.setAttribute('data-debug-validation', 'allowed');
    onAddTask(columnKey, taskInput);
    setTaskInput('');
    setShowInput(false);
  };

  const handleKeyPress = (e) => {
    console.log('handleKeyPress called with key:', e.key);
    if (e.key === 'Enter') {
      console.log('Enter key detected, calling addTask');
      // Add a visible indicator that this function was called
      document.body.setAttribute('data-debug-keypress', 'true');
      addTask();
    }
  };

  const columnClass = `${styles.column} ${isDragOver ? styles.dragOver : ''}`;
  const headerClass = `${styles.columnHeader} ${styles[columnKey]}`;
  const inputContainerClass = `${styles.inputContainer} ${styles[columnKey]}`;

  return (
    <div
      className={columnClass}
      style={{ animationDelay: `${animationDelay}s` }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`column-${columnKey}`}
    >
      <div className={styles.columnInner}>        
        <div className={headerClass}>
          <h2 className={styles.headerTitle}>
            {config.title}
            <span className={styles.taskCount}>
              {tasks.length}
            </span>
          </h2>
        </div>
        
        <div className={styles.taskList}>
          {tasks.map((task, idx) => (
            <TaskCard
              key={task.id}
              task={task}
              columnKey={columnKey}
              onDragStart={onDragStart}
              onDelete={onDeleteTask}
              animationDelay={idx * 0.05}
            />
          ))}
          
          {showInput ? (
            <div className={inputContainerClass}>
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter task name..."
                className={styles.taskInput}
                data-testid={`task-input-${columnKey}`}
                autoFocus
              />
              <div className={styles.buttonRow}>
                <button
                  onClick={addTask}
                  className={styles.addButton}
                  data-testid={`submit-task-${columnKey}`}
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setTaskInput('');
                  }}
                  className={styles.cancelButton}
                  data-testid={`cancel-task-${columnKey}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className={styles.addTaskButton}
              data-testid={`add-task-${columnKey}`}
            >
              <Plus size={20} className={styles.plusIcon} />
              Add Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}