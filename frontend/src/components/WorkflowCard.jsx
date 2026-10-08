import React from 'react';

export default function WorkflowCard({ title, description, step, icon: Icon, isLast }) {
  return (
    <div className="relative flex-1 group">
      <div className="glass-card rounded-2xl p-6 h-full border border-surface-border/50 hover:border-brand-500/40 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] transition-all duration-300 z-10 relative bg-surface-card">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-surface-border to-surface-dark border border-surface-border shadow-inner text-slate-300 group-hover:text-brand-400 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {step}</span>
        </div>
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
      
      {/* Connector Line (hidden on mobile) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-surface-border to-brand-500/30 -translate-y-1/2 z-0"></div>
      )}
    </div>
  );
}
