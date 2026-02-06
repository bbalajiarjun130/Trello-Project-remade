import React from 'react';
import { Plus } from 'lucide-react';

export default function AddTaskButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-700 transition-all flex items-center justify-center gap-2 font-medium group"
    >
      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
      Add Task
    </button>
  );
}
