import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, LayoutDashboard, FileText, Search, GitCompare, AlertCircle, CheckSquare, Settings, LogOut, Menu, X, Lightbulb } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { conflictMetrics, actionMetrics } = useWorkflow();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Documents', icon: FileText, path: '/documents' },
    { name: 'AI Insights', icon: Lightbulb, path: '/insights' },
    { name: 'Smart Search', icon: Search, path: '/search' },
    { name: 'Compare', icon: GitCompare, path: '/compare' },
    {
      name: 'Conflicts',
      icon: AlertCircle,
      path: '/conflicts',
      badge: conflictMetrics.unresolvedCount > 0 ? conflictMetrics.unresolvedCount : null,
      badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    },
    {
      name: 'Action Center',
      icon: CheckSquare,
      path: '/actions',
      badge: actionMetrics.activeCount > 0 ? actionMetrics.activeCount : null,
      badgeColor: 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-surface-dark/95 backdrop-blur-xl border-r border-surface-border flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-500" />
            <span className="text-lg font-bold text-white tracking-tight">InfoPilot<span className="text-brand-500">.ai</span></span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-brand-500/10 text-brand-400 font-medium' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-card'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 transition-colors group-hover:text-slate-300" />
                <span>{item.name}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-surface-border space-y-1">
          <NavLink
            to="/settings"
            onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-brand-500/10 text-brand-400 font-medium' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-card'
              }
            `}
          >
            <Settings className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
            Settings
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
