import React from 'react';
import { FileText, Lightbulb, AlertTriangle, CheckSquare, Search, GitCompare, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import WorkflowCard from '../components/WorkflowCard';
import QuickActionCard from '../components/QuickActionCard';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useWorkflow } from '../context/WorkflowContext';

export default function Dashboard() {
  const { documents, conflictMetrics, actionMetrics, conflicts, actions, recentActivity } = useWorkflow();

  const activeConflict = conflicts[0];
  const activeAction = actions[0];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Phase 5 Active
              </span>
              <span className="text-xs text-slate-400">
                FIND → UNDERSTAND → ORGANIZE → USE
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back!</h2>
            <p className="text-slate-400 text-lg mt-1">Turn scattered information into clear, actionable insights.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/documents">
              <Button className="w-full md:w-auto px-6 py-2.5 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </Link>
          </div>
        </section>

        {/* Statistics Cards - Connected to WorkflowContext */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total documents"
            value={documents.length.toString()}
            icon={FileText}
          />
          <StatCard
            title="Important findings"
            value="2"
            icon={Lightbulb}
          />
          <StatCard
            title="Need attention"
            value={conflictMetrics.unresolvedCount.toString()}
            icon={AlertTriangle}
            trend={conflictMetrics.unresolvedCount > 0 ? `${conflictMetrics.unresolvedCount} Conflict` : 'Resolved'}
          />
          <StatCard
            title="Pending actions"
            value={actionMetrics.activeCount.toString()}
            icon={CheckSquare}
            trend={actionMetrics.activeCount > 0 ? `${actionMetrics.activeCount} Active` : 'All Done'}
          />
        </section>

        {/* Core Workflow Section */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              Information Workflow
            </h3>
            <span className="text-xs text-slate-400 italic">
              "Don't just find information. Know what needs attention."
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-0">
            <WorkflowCard 
              step="1" 
              title="FIND" 
              description="Discover relevant information" 
              icon={Search} 
            />
            <WorkflowCard 
              step="2" 
              title="UNDERSTAND" 
              description="Extract important details" 
              icon={Lightbulb} 
            />
            <WorkflowCard 
              step="3" 
              title="ORGANIZE" 
              description="Compare and structure information" 
              icon={GitCompare} 
            />
            <WorkflowCard 
              step="4" 
              title="USE" 
              description="Turn insights into action" 
              icon={CheckSquare} 
              isLast={true} 
            />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-2">
          
          <div className="xl:col-span-2 space-y-8">
            {/* Quick Actions */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionCard 
                  title="Upload Documents" 
                  description="Add new files for analysis" 
                  icon={Upload} 
                  path="/documents" 
                />
                <QuickActionCard 
                  title="Smart Search" 
                  description="Query across all your data" 
                  icon={Search} 
                  path="/search" 
                />
                <QuickActionCard 
                  title="Compare Documents" 
                  description="Find differences and similarities" 
                  icon={GitCompare} 
                  path="/compare" 
                />
                <QuickActionCard 
                  title="Review Conflicts" 
                  description={
                    conflictMetrics.unresolvedCount > 0
                      ? `${conflictMetrics.unresolvedCount} active conflict requires verification`
                      : 'All conflicts resolved'
                  }
                  icon={AlertTriangle} 
                  path="/conflicts" 
                />
              </div>
            </section>

            {/* Active Attention & Next Steps (Phase 5 Feature) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Action Center Overview</h3>
                <Link to="/actions" className="text-sm text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
                  View Action Center <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {actions.length > 0 ? (
                <div className="glass-card rounded-2xl p-5 border border-surface-border hover:border-brand-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {activeAction ? activeAction.title : 'Action Item'}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Source: {activeAction ? activeAction.source : 'Documents'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 self-start sm:self-auto">
                      {activeAction ? activeAction.status : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-4 bg-surface-dark/50 p-3 rounded-xl border border-surface-border">
                    {activeAction ? activeAction.reason : 'Follow up required on findings.'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-surface-border/50 text-xs">
                    <span className="text-slate-400">
                      Total Tasks: <strong className="text-white">{actions.length}</strong>
                    </span>
                    <Link
                      to="/actions"
                      className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                    >
                      Manage in Action Center
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6 text-center border-dashed border-2 border-surface-border">
                  <p className="text-sm text-slate-400">No pending action items.</p>
                  <Link to="/conflicts" className="text-xs text-brand-400 hover:underline mt-2 inline-block">
                    Review conflicts to create actions
                  </Link>
                </div>
              )}
            </section>
            {/* Needs Your Attention Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Needs Your Attention</h3>
              </div>
              
              {conflictMetrics.unresolvedCount > 0 || actionMetrics.pending > 0 ? (
                <div className="space-y-3">
                  {conflicts.filter(c => c.status !== 'Resolved' && c.priority === 'High').map(conflict => (
                    <div key={conflict.id} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-rose-300">⚠ {conflict.title}</h4>
                          <p className="text-xs text-slate-300 mt-1">{conflict.relatedConflict || conflict.sourceA.documentName + ' vs ' + conflict.sourceB.documentName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Status: {conflict.status}</p>
                        </div>
                      </div>
                      <Link to="/conflicts">
                        <Button className="px-3 py-1.5 text-xs bg-rose-500 hover:bg-rose-400">Review</Button>
                      </Link>
                    </div>
                  ))}
                  {actions.filter(a => a.status === 'Pending' && a.priority === 'High').map(action => (
                    <div key={action.id} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <CheckSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-amber-300">Action: {action.title}</h4>
                          <p className="text-xs text-slate-300 mt-1">Status: {action.status}</p>
                        </div>
                      </div>
                      <Link to="/actions">
                        <Button variant="secondary" className="px-3 py-1.5 text-xs">Review</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6 text-center border border-surface-border">
                  <p className="text-sm text-slate-400">You're all caught up.</p>
                </div>
              )}
            </section>
          </div>

          <div className="xl:col-span-1 space-y-8">
            {/* Recent Activity Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              </div>
              
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id || index} className="p-3 rounded-xl bg-surface-card border border-surface-border flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white">{activity.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6 text-center border-dashed border-2 border-surface-border">
                  <p className="text-xs text-slate-400">No recent activity.</p>
                </div>
              )}
            </section>
            {/* Recent Insights / Conflict Spotlight */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Conflict Spotlight</h3>
                <Link to="/conflicts" className="text-sm text-brand-400 hover:text-brand-300 font-medium">
                  Review
                </Link>
              </div>

              {activeConflict ? (
                <div className="glass-card rounded-2xl p-5 border border-amber-500/20 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {activeConflict.status}
                      </span>
                      <h4 className="text-base font-bold text-white mt-2">
                        {activeConflict.title}
                      </h4>
                    </div>
                    {activeConflict.status === 'Resolved' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConflict.description}
                  </p>

                  <div className="text-xs bg-surface-dark/70 p-3 rounded-xl border border-surface-border space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Proposal:</span>
                      <strong className="text-rose-400">{activeConflict.sourceA.deadline}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Requirements:</span>
                      <strong className="text-rose-400">{activeConflict.sourceB.deadline}</strong>
                    </div>
                  </div>

                  <Link
                    to="/conflicts"
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Conflict Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6 text-center border-dashed border-2 border-surface-border">
                  <p className="text-xs text-slate-400">No active conflicts detected.</p>
                </div>
              )}
            </section>

            {/* Document Sources */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Active Sources</h3>
                <Link to="/documents" className="text-sm text-brand-400 hover:text-brand-300 font-medium">View all</Link>
              </div>

              <div className="space-y-2.5">
                {documents.slice(0, 3).map(doc => (
                  <div key={doc.id} className="p-3.5 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-brand-400" />
                      <div>
                        <div className="text-xs font-bold text-white">{doc.name}</div>
                        <div className="text-[11px] text-slate-400">{doc.type} • {doc.lastUpdated}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      doc.status === 'Processed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-500/10 text-brand-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
