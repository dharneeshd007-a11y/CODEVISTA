import React from 'react';
import { X, Calendar, FileCheck, CheckSquare, Info, ShieldAlert, ArrowDown } from 'lucide-react';
import Button from './Button';

export default function DocumentDetails({ document, onClose }) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface-dark border border-surface-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border bg-surface-card/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-white">{document.name}</h3>
              {document.isDemo && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Demo Data
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">Document Overview & Key Information</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-surface-border rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Visual Flow (Information Extraction Visual) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card rounded-2xl p-6 bg-surface-card/30 border-brand-500/20">
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider flex items-center justify-center">
                Extraction Flow
              </h4>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-full p-3 rounded-xl bg-surface-dark border border-surface-border text-slate-300 text-sm font-medium">
                  RAW DOCUMENT
                </div>
                <ArrowDown className="w-4 h-4 text-brand-500/50" />
                <div className="w-full p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium">
                  UNDERSTAND
                </div>
                <ArrowDown className="w-4 h-4 text-brand-500/50" />
                <div className="w-full p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                  EXTRACT
                </div>
                <ArrowDown className="w-4 h-4 text-brand-500/50" />
                <div className="w-full p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  ORGANIZE
                </div>
                <ArrowDown className="w-4 h-4 text-brand-500/50" />
                <div className="w-full p-4 rounded-xl bg-surface-border border border-surface-border text-white font-semibold">
                  ACTIONABLE INSIGHTS
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Information & Insights */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-white">Sample AI Insights</h4>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Frontend Prototype Only
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Insight Card: Important Dates */}
              <div className="glass-card rounded-2xl p-5 hover:border-brand-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-brand-400">
                  <Calendar className="w-5 h-5" />
                  <h5 className="font-semibold text-white">Important Dates</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <span className="text-brand-300 font-medium">20 October 2026:</span> Phase 3 Demo presentation scheduled.
                  </p>
                </div>
              </div>

              {/* Insight Card: Requirements */}
              <div className="glass-card rounded-2xl p-5 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-indigo-400">
                  <FileCheck className="w-5 h-5" />
                  <h5 className="font-semibold text-white">Requirements</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Submit completely functional frontend prototype without real AI connectivity.
                  </p>
                </div>
              </div>

              {/* Insight Card: Action Items */}
              <div className="glass-card rounded-2xl p-5 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-emerald-400">
                  <CheckSquare className="w-5 h-5" />
                  <h5 className="font-semibold text-white">Action Items</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border space-y-2">
                  <label className="flex items-start gap-2 cursor-not-allowed">
                    <input type="checkbox" className="mt-1 bg-surface-dark border-surface-border rounded text-emerald-500 focus:ring-emerald-500" disabled />
                    <span className="text-slate-300 text-sm">Review final design requirements</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-not-allowed">
                    <input type="checkbox" className="mt-1 bg-surface-dark border-surface-border rounded text-emerald-500 focus:ring-emerald-500" disabled />
                    <span className="text-slate-300 text-sm">Verify responsive layouts</span>
                  </label>
                </div>
              </div>

              {/* Insight Card: Important Details */}
              <div className="glass-card rounded-2xl p-5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-amber-400">
                  <Info className="w-5 h-5" />
                  <h5 className="font-semibold text-white">Important Details</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Final submission must adhere strictly to the specified components and visually connect the workflow stages.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-surface-card/50 flex justify-end">
          <Button variant="secondary" onClick={onClose} className="max-w-[150px]">
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
