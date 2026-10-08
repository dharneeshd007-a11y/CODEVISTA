import React from 'react';
import { X, Calendar, FileText, AlertTriangle, ArrowRight, CheckCircle2, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';
import ActionStatus from './ActionStatus';
import { useWorkflow } from '../context/WorkflowContext';

export default function ActionDetails({ action, onClose }) {
  const { updateActionStatus } = useWorkflow();

  if (!action) return null;

  const isPending = action.status === 'Pending';
  const isInProgress = action.status === 'In Progress';
  const isCompleted = action.status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-card rounded-2xl w-full max-w-2xl border border-surface-border overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-border flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <PriorityBadge priority={action.priority} />
              <ActionStatus status={action.status} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {action.title}
            </h3>
            <p className="text-xs text-slate-400">
              Source: <span className="text-slate-300 font-medium">{action.source}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-surface-dark hover:bg-surface-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Why it was created */}
          <div className="rounded-xl p-4 bg-surface-dark/70 border border-surface-border">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Why this was created
            </h4>
            <p className="text-sm text-slate-200">
              {action.why || action.reason}
            </p>
          </div>

          {/* Source & Related Conflict */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-surface-dark/50 border border-surface-border">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Source Information
              </span>
              <p className="text-sm font-medium text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                {action.source}
              </p>
            </div>

            <div className="rounded-xl p-4 bg-surface-dark/50 border border-surface-border">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Related Conflict
              </span>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-amber-300">
                  {action.relatedConflict}
                </p>
                {action.relatedConflictId && (
                  <Link
                    to="/conflicts"
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Next Step */}
          <div className="rounded-xl p-4 bg-brand-500/10 border border-brand-500/20">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider block mb-1">
              Recommended Next Step
            </span>
            <p className="text-sm text-white font-medium">
              {action.recommendedNextStep || 'Confirm and execute next steps.'}
            </p>
          </div>

          {/* Timing details */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Due: <strong className="text-slate-300">{action.due}</strong>
            </span>
            <span>Created: {action.createdAt || 'Recent'}</span>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-surface-dark/80 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Status Flow: <span className="text-slate-300">Pending → In Progress → Completed</span>
          </div>

          <div className="flex items-center gap-2">
            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => updateActionStatus(action.id, 'In Progress')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(2,132,199,0.3)]"
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Action
                </button>
                <button
                  type="button"
                  onClick={() => updateActionStatus(action.id, 'Completed')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Complete Action
                </button>
              </>
            )}

            {isInProgress && (
              <button
                type="button"
                onClick={() => updateActionStatus(action.id, 'Completed')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Action
              </button>
            )}

            {isCompleted && (
              <button
                type="button"
                onClick={() => updateActionStatus(action.id, 'Pending')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface-border hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reopen Action
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
