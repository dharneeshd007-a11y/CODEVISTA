import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({ title, description, icon: Icon, path }) {
  return (
    <Link to={path} className="group block h-full">
      <div className="glass-card rounded-2xl p-5 h-full flex items-start gap-4 hover:border-brand-500/40 hover:bg-surface-card transition-all duration-300">
        <div className="p-3 rounded-xl bg-surface-border/50 text-slate-300 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-colors shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors flex items-center justify-between">
            {title}
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h4>
          <p className="text-sm text-slate-400 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
