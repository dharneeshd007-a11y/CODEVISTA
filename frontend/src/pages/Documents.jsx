import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { FileText } from 'lucide-react';

export default function Documents() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Documents</h2>
        <EmptyState 
          title="Document Management Coming Soon"
          description="This feature will be fully implemented in Phase 3. You will be able to upload, manage, and process your files here."
          icon={FileText}
          actionLabel="Return to Dashboard"
          actionPath="/dashboard"
        />
      </div>
    </DashboardLayout>
  );
}
