import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { Search } from 'lucide-react';

export default function SmartSearch() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Smart Search</h2>
        <EmptyState 
          title="Semantic Search Coming Soon"
          description="This feature will allow you to query your processed documents using natural language in a future phase."
          icon={Search}
          actionLabel="Return to Dashboard"
          actionPath="/dashboard"
        />
      </div>
    </DashboardLayout>
  );
}
