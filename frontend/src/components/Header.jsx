import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

export default function Header({ toggleSidebar }) {
  return (
    <header className="h-16 border-b border-surface-border bg-surface-dark/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-card transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-white hidden sm:block">Dashboard</h1>
          <p className="text-xs text-slate-400 hidden md:block">Understand your information. Take better action.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-surface-card transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-surface-card transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-surface-dark"></span>
        </button>
        
        <div className="h-8 w-px bg-surface-border mx-1 sm:mx-2"></div>
        
        <div className="flex items-center gap-3 pl-1">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">Alex User</p>
            <p className="text-xs text-slate-400">Pro Plan</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-brand-500/20 ring-2 ring-surface-dark">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
