import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { AlertCircle } from 'lucide-react';

export default function Conflicts() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Conflicts & Discrepancies</h2>
        <EmptyState 
          title="Conflict Resolution Coming Soon"
          description="The AI will automatically flag contradictory information across your documents. This view will be available later."
          icon={AlertCircle}
          actionLabel="Return to Dashboard"
          actionPath="/dashboard"
        />
      </div>
    </DashboardLayout>
  );
}
