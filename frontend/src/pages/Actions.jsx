import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { CheckSquare } from 'lucide-react';

export default function Actions() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Action Center</h2>
        <EmptyState 
          title="Action Items Coming Soon"
          description="Track tasks, required decisions, and follow-ups extracted directly from your information sources."
          icon={CheckSquare}
          actionLabel="Return to Dashboard"
          actionPath="/dashboard"
        />
      </div>
    </DashboardLayout>
  );
}
