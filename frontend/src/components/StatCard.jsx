import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="glass-card rounded-2xl p-6 group hover:border-brand-500/30 hover:bg-surface-card transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-surface-border/50 text-slate-300 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
      </div>
    </div>
  );
}
