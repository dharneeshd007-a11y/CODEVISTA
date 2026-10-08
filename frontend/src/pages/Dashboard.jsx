import React from 'react';
import { FileText, Lightbulb, AlertTriangle, CheckSquare, Search, GitCompare, Upload } from 'lucide-react';
import StatCard from '../components/StatCard';
import WorkflowCard from '../components/WorkflowCard';
import QuickActionCard from '../components/QuickActionCard';
import EmptyState from '../components/EmptyState';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-slate-400 text-lg">Turn scattered information into clear, actionable insights.</p>
          </div>
          <Link to="/documents">
            <Button className="w-full md:w-auto px-6 py-2.5 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </Link>
        </section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Total documents" value="0" icon={FileText} />
          <StatCard title="Important findings" value="0" icon={Lightbulb} />
          <StatCard title="Need attention" value="0" icon={AlertTriangle} />
          <StatCard title="Pending actions" value="0" icon={CheckSquare} />
        </section>

        {/* Core Workflow Section */}
        <section className="pt-4">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            Information Workflow
          </h3>
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
          
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
                  description="Resolve contradictory information" 
                  icon={AlertTriangle} 
                  path="/conflicts" 
                />
              </div>
            </section>

            {/* Recent Documents */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Documents</h3>
                <Link to="/documents" className="text-sm text-brand-400 hover:text-brand-300 font-medium">View all</Link>
              </div>
              <EmptyState 
                title="No documents yet"
                description="Upload your first document to start discovering important information."
                icon={FileText}
                actionLabel="Upload Document"
                actionPath="/documents"
              />
            </section>
          </div>

          <div className="xl:col-span-1 space-y-8">
            {/* Recent Insights */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Insights</h3>
              <EmptyState 
                title="No insights available yet"
                description="Insights will appear here after your documents are processed."
                icon={Lightbulb}
              />
            </section>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
