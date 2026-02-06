import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ 
  tasks, 
  columnKey, 
  onDragStart, 
  onDelete 
}) {
  return (
    <div className="space-y-3">
      {tasks.map((task, idx) => (
        <TaskCard
          key={task.id}
          task={task}
          columnKey={columnKey}
          onDragStart={onDragStart}
          onDelete={onDelete}
          animationDelay={idx * 0.05}
        />
      ))}
    </div>
  );
}
