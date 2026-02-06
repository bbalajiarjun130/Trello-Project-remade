import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import styles from './TaskCard.module.css';

export default function TaskCard({ task, columnKey, onDragStart, onDelete, animationDelay }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart(task, columnKey);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const cardClass = `${styles.taskCard} ${isDragging ? styles.dragging : ''}`;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cardClass}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className={styles.cardContent}>
        <GripVertical 
          className={styles.dragHandle}
          size={20} 
        />
        <p className={styles.taskText}>
          {task.text}
        </p>
        <button
          onClick={() => onDelete(columnKey, task.id)}
          className={styles.deleteButton}
        >
          ×
        </button>
      </div>
    </div>
  );
}
