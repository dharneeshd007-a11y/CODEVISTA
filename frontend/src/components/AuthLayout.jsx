import React from 'react';
import { Compass } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-surface-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center animate-fade-in">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="bg-brand-500/10 p-3 rounded-2xl border border-brand-500/20">
            <Compass className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">InfoPilot<span className="text-brand-400">.ai</span></h1>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px] animate-slide-up">
        <div className="glass-card py-8 px-4 sm:px-10 rounded-3xl">
          {children}
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          Find. Understand. Organize. Use.
        </p>
      </div>
    </div>
  );
}
