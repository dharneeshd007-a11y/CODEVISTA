import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, FileCheck, CheckSquare, ShieldAlert, ArrowDown, Lightbulb } from 'lucide-react';
import Button from './Button';

export default function DocumentDetails({ document, onClose }) {
  const navigate = useNavigate();
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
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">{document.name}</h3>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-surface-dark border border-surface-border text-slate-300">
                {document.type || 'PDF'}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {document.status || 'Processed'}
              </span>
              {document.isDemo && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Demo Data
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              Uploaded: {document.lastUpdated || '10 Oct 2026'} • 1.2 MB
            </p>
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
            
            <div className="flex items-center gap-3 mb-2 pb-2 border-b border-surface-border">
              <h4 className="text-lg font-semibold text-white">Extracted Information</h4>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Demo Mode
              </span>
            </div>

            {/* Summary */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-4">
              <h5 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Summary</h5>
              <p className="text-slate-300 text-sm leading-relaxed">
                This document describes the project proposal, key requirements, important deadlines and expected submission details. It serves as the primary source of truth for initial planning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Insight Card: Key Dates */}
              <div className="glass-card rounded-2xl p-5 hover:border-brand-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-brand-400">
                  <Calendar className="w-5 h-5" />
                  <h5 className="font-semibold text-white">Key Dates</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <span className="text-brand-300 font-medium">20 October 2026:</span> Phase 3 Demo presentation scheduled.
                  </p>
                </div>
              </div>

              {/* Insight Card: Key Amounts */}
              <div className="glass-card rounded-2xl p-5 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-indigo-400">
                  <FileCheck className="w-5 h-5" />
                  <h5 className="font-semibold text-white">Key Amounts</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <span className="text-indigo-300 font-medium">Budget:</span> ₹50,000 allocated for initial project phases.
                  </p>
                </div>
              </div>

              {/* Insight Card: Requirements */}
              <div className="glass-card rounded-2xl p-5 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-emerald-400">
                  <CheckSquare className="w-5 h-5" />
                  <h5 className="font-semibold text-white">Requirements</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border space-y-2">
                  <div className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-400">•</span> Submit completely functional frontend prototype.
                  </div>
                  <div className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-400">•</span> Ensure responsive design across devices.
                  </div>
                </div>
              </div>

              {/* Insight Card: Important Information & Insights */}
              <div className="glass-card rounded-2xl p-5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-amber-400">
                  <Lightbulb className="w-5 h-5" />
                  <h5 className="font-semibold text-white">AI Insights</h5>
                </div>
                <div className="p-3 bg-surface-dark/50 rounded-xl border border-surface-border">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    The document implies a strict adherence to visually connecting workflow stages without relying on real backend APIs.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-4">
              <h5 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Detected Action Items
              </h5>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 bg-surface-dark/50 border border-surface-border rounded-lg cursor-not-allowed">
                  <input type="checkbox" className="mt-0.5 bg-surface-dark border-surface-border rounded text-brand-500 focus:ring-brand-500" disabled />
                  <div className="flex-1">
                    <span className="text-slate-200 text-sm font-medium block">Review final design requirements</span>
                    <span className="text-slate-400 text-xs">Assigned to team • High Priority</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-right">
              Source Reference: Extracted via Demo Parsing Engine v1.0
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-surface-card/50 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} className="w-24">
            Close
          </Button>
          <Button 
            onClick={() => {
              onClose();
              navigate('/insights', { state: { documentId: document.id } });
            }} 
            className="flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            View Insights
          </Button>
        </div>

      </div>
    </div>
  );
}
