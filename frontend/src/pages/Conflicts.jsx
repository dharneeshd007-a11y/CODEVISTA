import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckSquare, Sparkles, RotateCcw } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ConflictSummary from '../components/ConflictSummary';
import ConflictCard from '../components/ConflictCard';
import { useWorkflow } from '../context/WorkflowContext';

export default function Conflicts() {
  const { conflicts } = useWorkflow();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Phase 5 • Discrepancy Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Conflict Detection
            </h1>
            <p className="text-slate-400 text-base mt-1">
              Identify important differences and conflicting information across sources.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/actions"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-300 hover:text-white bg-brand-500/10 hover:bg-brand-600/30 border border-brand-500/30 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(2,132,199,0.15)]"
            >
              <CheckSquare className="w-4 h-4 text-brand-400" />
              <span>Go to Action Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section: Conflict Summary with Demo Data Indicator */}
        <section aria-labelledby="conflict-summary-heading">
          <ConflictSummary />
        </section>

        {/* Section: Active Conflicts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Active Conflict
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review source inconsistencies and convert recommendations into tasks.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Showing {conflicts.length} detected conflict
            </span>
          </div>

          {/* List / Cards */}
          <div className="space-y-6">
            {conflicts.map((conflict) => (
              <ConflictCard key={conflict.id} conflict={conflict} />
            ))}
          </div>
        </section>

        {/* Core Workflow Step Footer Banner */}
        <div className="p-4 rounded-2xl bg-surface-card/60 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>
              <strong>Core Workflow (Step 3 to 4):</strong> ORGANIZE (Compare & Detect) → USE (Action Center)
            </span>
          </div>
          <Link
            to="/actions"
            className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
          >
            Turn findings into actionable tasks
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
