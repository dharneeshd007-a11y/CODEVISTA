import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, Bell, Monitor, Info, ShieldAlert } from 'lucide-react';
import Button from '../components/Button';
import { useWorkflow } from '../context/WorkflowContext';

export default function Settings() {
  const { showToast } = useWorkflow();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully', 'success');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <section>
          <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
          <p className="text-slate-400 text-lg">Manage your account and application preferences.</p>
        </section>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Section */}
          <section className="glass-card rounded-2xl border border-surface-border overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border bg-surface-card/50 flex items-center gap-3">
              <User className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <input type="text" defaultValue="Alex User" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <input type="email" defaultValue="alex@infopilot.ai" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm" disabled />
                  <p className="text-[10px] text-slate-500">Email cannot be changed.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Application Section */}
          <section className="glass-card rounded-2xl border border-surface-border overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border bg-surface-card/50 flex items-center gap-3">
              <Monitor className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-semibold text-white">Application Settings</h3>
            </div>
            <div className="p-6 space-y-6">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-medium text-white mb-1 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    Push Notifications
                  </h4>
                  <p className="text-xs text-slate-400">Receive alerts for new conflicts and action items.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                </label>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="glass-card rounded-2xl border border-surface-border overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border bg-surface-card/50 flex items-center gap-3">
              <Info className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-semibold text-white">About InfoPilot AI</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Version</span>
                <span className="text-sm font-medium text-white">Phase 12 (Production)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Framework</span>
                <span className="text-sm font-medium text-white">React + Vite + Tailwind CSS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Architecture</span>
                <span className="text-sm font-medium text-white">Frontend-only Prototype</span>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => window.history.back()}>Cancel</Button>
            <Button type="submit">Save Preferences</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
