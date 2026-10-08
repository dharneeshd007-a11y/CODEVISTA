import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
        <EmptyState 
          title="Settings Configuration Coming Soon"
          description="Manage your account, API integrations, processing preferences, and team members here."
          icon={SettingsIcon}
          actionLabel="Return to Dashboard"
          actionPath="/dashboard"
        />
      </div>
    </DashboardLayout>
  );
}
