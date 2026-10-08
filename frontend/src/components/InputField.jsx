import React from 'react';

export default function InputField({ label, id, error, ...props }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`glass-input block w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
