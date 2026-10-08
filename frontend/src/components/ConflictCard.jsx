import React from 'react';
import { AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import ConflictStatus from './ConflictStatus';
import ConflictDetails from './ConflictDetails';
import { useWorkflow } from '../context/WorkflowContext';

export default function ConflictCard({ conflict }) {
  const { updateConflictStatus, markConflictResolved } = useWorkflow();
  const isResolved = conflict.status === 'Resolved';

  return (
    <div
      className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
        isResolved
          ? 'border-emerald-500/30 bg-surface-card/40 opacity-95'
          : 'border-surface-border hover:border-brand-500/30'
      }`}
    >
      {/* Top Banner / Header */}
      <div className="p-6 border-b border-surface-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isResolved
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {isResolved ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {conflict.title}
                </h3>
                {isResolved && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Resolved
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {conflict.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <PriorityBadge priority={conflict.priority} />
            <ConflictStatus
              status={conflict.status}
              onChange={(newStatus) => updateConflictStatus(conflict.id, newStatus)}
            />
          </div>
        </div>

        {/* Quick Resolution Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-surface-border/40 text-xs text-slate-400">
          <div>
            Discrepancy: <span className="text-slate-300 font-medium">{conflict.differenceHighlight}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isResolved ? (
              <button
                type="button"
                onClick={() => markConflictResolved(conflict.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 transition-all duration-200 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark as Resolved
              </button>
            ) : (
              <button
                type="button"
                onClick={() => updateConflictStatus(conflict.id, 'Needs Verification')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-surface-border/60 hover:bg-surface-border border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reopen Conflict
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-6">
        <ConflictDetails conflict={conflict} />
      </div>
    </div>
  );
}
