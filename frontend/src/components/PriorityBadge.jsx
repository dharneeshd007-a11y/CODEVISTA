import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority = 'Medium', className = '' }) {
  const normalized = priority.toLowerCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = AlertTriangle;

  if (normalized === 'high') {
    styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    Icon = AlertCircle;
  } else if (normalized === 'medium') {
    styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    Icon = AlertTriangle;
  } else if (normalized === 'low') {
    styles = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    Icon = ArrowDown;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide uppercase ${styles} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {priority}
    </span>
  );
}
