import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, ListPlus } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export default function ConflictDetails({ conflict }) {
  const navigate = useNavigate();
  const { actions, createActionFromConflict } = useWorkflow();

  const isResolved = conflict.status === 'Resolved';
  const hasActionInCenter = actions.some((a) => a.relatedConflictId === conflict.id);

  const handleCreateAction = () => {
    createActionFromConflict(conflict.id);
  };

  const handleGoToActionCenter = () => {
    navigate('/actions');
  };

  return (
    <div className="space-y-6">
      {/* Source Comparison Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            Source Comparison
          </h4>
          <span className="text-xs text-rose-400 font-medium bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            5-Day Discrepancy Found
          </span>
        </div>

        {/* Comparison grid: 2 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* Source A Card */}
          <div className="rounded-xl p-5 bg-surface-dark/70 border border-surface-border relative group hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Source A</span>
                <h5 className="text-base font-bold text-white">{conflict.sourceA.documentName}</h5>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-surface-border text-slate-400">
                {conflict.sourceA.documentType}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">{conflict.sourceA.section}</p>

            <div className="p-3.5 rounded-lg bg-surface-card border border-rose-500/30 bg-rose-500/5 mb-3">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                Detected Deadline:
              </div>
              <div className="text-xl font-bold text-rose-300">
                {conflict.sourceA.deadline}
              </div>
            </div>

            <div className="text-xs text-slate-400 italic border-l-2 border-slate-700 pl-3 py-1">
              "{conflict.sourceA.excerpt}"
            </div>
          </div>

          {/* VS Divider for mobile / desktop */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface-card border-2 border-surface-border items-center justify-center text-xs font-extrabold text-slate-300 shadow-xl">
            VS
          </div>
          <div className="md:hidden flex items-center justify-center py-1">
            <span className="px-3 py-1 rounded-full bg-surface-card border border-surface-border text-xs font-bold text-slate-400">
              VS
            </span>
          </div>

          {/* Source B Card */}
          <div className="rounded-xl p-5 bg-surface-dark/70 border border-surface-border relative group hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Source B</span>
                <h5 className="text-base font-bold text-white">{conflict.sourceB.documentName}</h5>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-surface-border text-slate-400">
                {conflict.sourceB.documentType}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">{conflict.sourceB.section}</p>

            <div className="p-3.5 rounded-lg bg-surface-card border border-rose-500/30 bg-rose-500/5 mb-3">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                Detected Deadline:
              </div>
              <div className="text-xl font-bold text-rose-300">
                {conflict.sourceB.deadline}
              </div>
            </div>

            <div className="text-xs text-slate-400 italic border-l-2 border-slate-700 pl-3 py-1">
              "{conflict.sourceB.excerpt}"
            </div>
          </div>
        </div>
      </div>

      {/* Why This Needs Attention Section */}
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-300 mb-1">
              Why this needs attention
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {conflict.whyItMatters}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Action Section */}
      <div className="p-5 rounded-xl bg-surface-dark/60 border border-brand-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Recommended Action
          </div>
          <p className="text-base font-semibold text-white">
            {conflict.recommendedAction}
          </p>
          <p className="text-xs text-slate-400">
            Convert this finding directly into an actionable task in your Action Center.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCreateAction}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              hasActionInCenter
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 hover:bg-brand-500/30'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_15px_rgba(2,132,199,0.3)]'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            {hasActionInCenter ? 'Re-add Action' : 'Create Action'}
          </button>

          {hasActionInCenter && (
            <button
              type="button"
              onClick={handleGoToActionCenter}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface-card hover:bg-surface-border border border-surface-border flex items-center gap-1.5 transition-colors"
            >
              <span>Go to Action Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Resolved State Confirmation Banner (if marked as resolved) */}
      {isResolved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-fade-in text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            This conflict has been marked as resolved. It will no longer flag warnings on the Dashboard.
          </span>
        </div>
      )}
    </div>
  );
}
