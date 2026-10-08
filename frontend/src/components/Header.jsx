import React, { useState } from 'react';
import { Menu, Search, Bell, AlertCircle, ChevronDown, User, Settings, LogOut, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/documents': return 'Documents';
      case '/search': return 'Smart Search';
      case '/compare': return 'Compare';
      case '/conflicts': return 'Conflicts';
      case '/actions': return 'Action Center';
      case '/settings': return 'Settings';
      default: return 'InfoPilot AI';
    }
  };

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
          <h1 className="text-lg font-semibold text-white hidden sm:block">{getPageTitle()}</h1>
          <p className="text-xs text-slate-400 hidden md:block">Understand your information. Take better action.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Demo Mode Badge */}
        <div className="relative">
          <button 
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            <AlertCircle className="w-3 h-3" />
            DEMO MODE
          </button>
          
          {showDemoInfo && (
            <div className="absolute top-full right-0 mt-2 w-64 p-3 rounded-xl bg-surface-card border border-surface-border shadow-xl z-50">
              <div className="flex items-start gap-2 text-slate-300 text-xs">
                <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <p>Demo Mode uses sample frontend data. Backend and AI processing will be connected in the next implementation stage.</p>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-surface-card transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-surface-card transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-surface-dark"></span>
        </button>
        
        <div className="h-8 w-px bg-surface-border mx-1 sm:mx-2"></div>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1 hover:opacity-80 transition-opacity"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">Alex User</p>
              <p className="text-xs text-slate-400">Pro Plan</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-brand-500/20 ring-2 ring-surface-dark">
              AU
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-dark border border-surface-border shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-surface-border bg-surface-card/30">
                  <p className="text-sm font-semibold text-white">Alex User</p>
                  <p className="text-xs text-slate-400 truncate">alex@infopilot.ai</p>
                </div>
                <div className="p-2">
                  <button onClick={() => { navigate('/settings'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-surface-border rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button onClick={() => { navigate('/settings'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-surface-border rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
                <div className="p-2 border-t border-surface-border">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
