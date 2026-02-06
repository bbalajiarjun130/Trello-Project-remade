import { useState, useCallback } from 'react';
import { canMoveTo } from '../config/columnConfig';

export function useDragAndDrop(onDrop) {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = useCallback((task, sourceColumn) => {
    setDraggedItem({ task, sourceColumn });
    setRestrictionMessage(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDrop = useCallback((targetColumn) => {
    if (!draggedItem) return;
    
    const { task, sourceColumn } = draggedItem;
    
    // Delegate actual move logic to parent (Dependency Inversion)
    const success = onDrop(task.id, sourceColumn, targetColumn);
    
    if (!success) {
      setRestrictionMessage('Move not allowed');
      setTimeout(() => setRestrictionMessage(null), 3000);
    }
    
    setDraggedItem(null);
  }, [draggedItem, onDrop]);

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop
  };
}
