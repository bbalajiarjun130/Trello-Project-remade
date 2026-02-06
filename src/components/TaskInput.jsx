import React, { useState } from 'react';

export default function TaskInput({ onAdd, onCancel, bgGradient }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className={`fade-in bg-gradient-to-r ${bgGradient} rounded-xl p-4 border-2 border-dashed border-slate-300`}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter task name..."
        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-slate-400 focus:outline-none mb-2"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Add Task
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border-2 border-slate-300 hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
