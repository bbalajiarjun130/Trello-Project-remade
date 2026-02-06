import { useState } from "react";

export function useTaskManager(initialTasks = {}) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (columnKey, taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText
    };
    
    setTasks(prev => ({
      ...prev,
      [columnKey]: [...prev[columnKey], newTask]
    }));
  };

  const deleteTask = (columnKey, taskId) => {
    setTasks(prev => ({
      ...prev,
      [columnKey]: prev[columnKey].filter(t => t.id !== taskId)
    }));
  };

  const moveTask = (taskId, sourceColumn, targetColumn) => {
    if (sourceColumn === targetColumn) return;

    const task = tasks[sourceColumn].find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter(t => t.id !== taskId),
      [targetColumn]: [...prev[targetColumn], task]
    }));
  };

  return {
    tasks,
    addTask,
    deleteTask,
    moveTask
  };
}