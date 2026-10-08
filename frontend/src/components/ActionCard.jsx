import React from 'react';
import { Calendar, FileText, Play, CheckCircle2, RotateCcw, Trash2, Eye } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import ActionStatus from './ActionStatus';
import { useWorkflow } from '../context/WorkflowContext';

export default function ActionCard({ action, onOpenDetails }) {
  const { updateActionStatus, deleteAction } = useWorkflow();

  const isPending = action.status === 'Pending';
  const isInProgress = action.status === 'In Progress';
  const isCompleted = action.status === 'Completed';

  return (
    <div
      className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden group ${
        isCompleted
          ? 'border-emerald-500/20 bg-surface-card/40 opacity-80'
          : 'border-surface-border hover:border-brand-500/30 hover:bg-surface-card'
      }`}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={action.priority} />
            <ActionStatus status={action.status} />
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Due: <strong className="text-slate-300 font-medium">{action.due}</strong></span>
          </div>
        </div>

        {/* Action Title and Reason */}
        <div
          onClick={() => onOpenDetails && onOpenDetails(action)}
          className="cursor-pointer"
        >
          <h3
            className={`text-lg font-bold transition-colors ${
              isCompleted ? 'text-slate-300 line-through' : 'text-white group-hover:text-brand-300'
            }`}
          >
            {action.title}
          </h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {action.reason}
          </p>
        </div>

        {/* Source info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-surface-dark/50 px-3 py-2 rounded-xl border border-surface-border/50">
          <FileText className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span className="truncate">
            Source: <strong className="text-slate-300 font-medium">{action.source}</strong>
          </span>
        </div>

        {/* Bottom controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-border/50">
          <button
            type="button"
            onClick={() => onOpenDetails && onOpenDetails(action)}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors py-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Status Flow Buttons */}
            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => updateActionStatus(action.id, 'In Progress')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(2,132,199,0.3)]"
                  title="Move to In Progress"
                >
                  <Play className="w-3 h-3" />
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => updateActionStatus(action.id, 'Completed')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 transition-colors flex items-center gap-1"
                  title="Mark as Completed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Complete
                </button>
              </>
            )}

            {isInProgress && (
              <button
                type="button"
                onClick={() => updateActionStatus(action.id, 'Completed')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                title="Mark as Completed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Complete
              </button>
            )}

            {isCompleted && (
              <button
                type="button"
                onClick={() => updateActionStatus(action.id, 'Pending')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-surface-border hover:bg-slate-700 transition-colors flex items-center gap-1"
                title="Reopen action"
              >
                <RotateCcw className="w-3 h-3" />
                Reopen
              </button>
            )}

            {/* Delete button (helps testing empty state) */}
            <button
              type="button"
              onClick={() => deleteAction(action.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete action"
              aria-label="Delete action"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
