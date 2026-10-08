import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { GitCompare } from 'lucide-react';

export default function Compare() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Compare Documents</h2>
        <EmptyState 
          title="Comparison Engine Coming Soon"
          description="Select multiple documents to find similarities, differences, and key changes. Planned for a future update."
          icon={GitCompare}
          actionLabel="Return to Dashboard"
          actionPath="/dashboard"
        />
      </div>
    </DashboardLayout>
  );
}
