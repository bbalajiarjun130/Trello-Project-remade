import React from 'react';

export default function ColumnHeader({ title, count, colorGradient }) {
  return (
    <div className={`bg-gradient-to-r ${colorGradient} p-6 text-white`}>
      <h2 className="text-2xl font-bold tracking-tight flex items-center justify-between">
        {title}
        <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full backdrop-blur">
          {count}
        </span>
      </h2>
    </div>
  );
}
