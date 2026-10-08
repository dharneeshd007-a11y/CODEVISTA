import React from 'react';
import { AlertCircle, Flame, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export default function ConflictSummary() {
  const { conflictMetrics } = useWorkflow();

  const cards = [
    {
      title: 'Total Conflicts',
      value: conflictMetrics.total,
      icon: AlertCircle,
      color: 'text-brand-400 group-hover:text-brand-300',
      bg: 'bg-brand-500/10 border-brand-500/20'
    },
    {
      title: 'High Priority',
      value: conflictMetrics.highPriority,
      icon: Flame,
      color: 'text-rose-400 group-hover:text-rose-300',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Needs Verification',
      value: conflictMetrics.needsVerification,
      icon: ShieldAlert,
      color: 'text-amber-400 group-hover:text-amber-300',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Resolved',
      value: conflictMetrics.resolved,
      icon: CheckCircle2,
      color: 'text-emerald-400 group-hover:text-emerald-300',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-3">
      {/* Demo Data Label & Product Message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Demo Data
          </span>
          <span className="text-xs text-slate-400">
            Frontend demonstration prototype — simulated document intelligence
          </span>
        </div>
        <p className="text-xs text-slate-400 italic">
          "Don't just find information. Know what needs attention."
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="glass-card rounded-2xl p-5 group hover:border-brand-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`p-2 rounded-xl border ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
