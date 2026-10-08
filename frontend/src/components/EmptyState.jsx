import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function EmptyState({ title, description, icon: Icon, actionLabel, actionPath }) {
  return (
    <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-surface-border hover:border-surface-border/80 transition-colors">
      <div className="w-16 h-16 rounded-2xl bg-surface-dark border border-surface-border flex items-center justify-center mb-5 shadow-inner">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && actionPath && (
        <Link to={actionPath}>
          <Button variant="secondary" className="px-6 py-2.5">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
