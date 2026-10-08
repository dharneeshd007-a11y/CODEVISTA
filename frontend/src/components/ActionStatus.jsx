import React from 'react';
import { Clock, Play, CheckCircle2 } from 'lucide-react';

const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    icon: Clock,
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400'
  },
  'In Progress': {
    label: 'In Progress',
    icon: Play,
    color: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    dot: 'bg-sky-400 animate-pulse'
  },
  Completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400'
  }
};

export default function ActionStatus({ status = 'Pending', className = '' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
