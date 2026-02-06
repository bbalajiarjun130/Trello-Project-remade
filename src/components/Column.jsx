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
    if (!taskInput.trim()) return;
    
    onAddTask(columnKey, taskInput);
    setTaskInput('');
    setShowInput(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
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
                autoFocus
              />
              <div className={styles.buttonRow}>
                <button
                  onClick={addTask}
                  className={styles.addButton}
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setTaskInput('');
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className={styles.addTaskButton}
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