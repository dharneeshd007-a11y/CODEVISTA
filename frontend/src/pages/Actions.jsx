import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Plus, AlertCircle, Sparkles, Filter, RotateCcw } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ActionCard from '../components/ActionCard';
import ActionDetails from '../components/ActionDetails';
import ActionForm from '../components/ActionForm';
import EmptyState from '../components/EmptyState';
import { useWorkflow } from '../context/WorkflowContext';

export default function Actions() {
  const { actions, actionMetrics, resetDemoData } = useWorkflow();

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Pending' | 'In Progress' | 'Completed'
  const [selectedAction, setSelectedAction] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredActions = actions.filter((action) => {
    if (filter === 'ALL') return true;
    return action.status === filter;
  });

  const summaryCards = [
    {
      title: 'Pending',
      value: actionMetrics.pending,
      color: 'text-amber-400 group-hover:text-amber-300',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'High Priority',
      value: actionMetrics.highPriority,
      color: 'text-rose-400 group-hover:text-rose-300',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'In Progress',
      value: actionMetrics.inProgress,
      color: 'text-sky-400 group-hover:text-sky-300',
      bg: 'bg-sky-500/10 border-sky-500/20'
    },
    {
      title: 'Completed',
      value: actionMetrics.completed,
      color: 'text-emerald-400 group-hover:text-emerald-300',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckSquare className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Phase 5 • Task Orchestration
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Action Center
            </h1>
            <p className="text-slate-400 text-base mt-1">
              Turn important findings into clear next steps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resetDemoData}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface-card hover:bg-surface-border border border-surface-border transition-colors flex items-center gap-1.5"
              title="Reset demo data to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset Demo
            </button>

            <Link
              to="/conflicts"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface-card hover:bg-surface-border border border-surface-border transition-colors flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              View Conflicts
            </Link>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(2,132,199,0.3)]"
            >
              <Plus className="w-4 h-4" />
              + Create Action
            </button>
          </div>
        </div>

        {/* Action Summary with Demo Data Indicator */}
        <section aria-labelledby="action-summary-heading" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Demo Data
              </span>
              <span className="text-xs text-slate-400">
                Turn important findings into actionable next steps.
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {actionMetrics.activeCount} active items requiring execution
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className="glass-card rounded-2xl p-5 group hover:border-brand-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-400">{card.title}</span>
                  <div className={`w-2.5 h-2.5 rounded-full border ${card.bg}`} />
                </div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Controls & Action List */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex items-center gap-1 bg-surface-card p-1 rounded-xl border border-surface-border text-xs">
                {['ALL', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      filter === tab
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredActions.length} of {actions.length} action items
            </span>
          </div>

          {/* Action Cards or Empty State */}
          {actions.length === 0 ? (
            <EmptyState
              title="No action items yet"
              description="Important findings and conflicts can be converted into actions."
              icon={CheckSquare}
              actionLabel="View Conflicts"
              actionPath="/conflicts"
            />
          ) : filteredActions.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center border-dashed border-2 border-surface-border">
              <p className="text-sm text-slate-400">
                No action items matching the <strong className="text-white">"{filter}"</strong> filter.
              </p>
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className="mt-3 text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Reset Filter to All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onOpenDetails={(act) => setSelectedAction(act)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Action Detail Modal */}
        <ActionDetails
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
        />

        {/* Manual Create Action Modal */}
        <ActionForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
