import React from 'react';
import { X, Play, HelpCircle } from 'lucide-react';
import Button from './Button';

export default function DemoGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: 'Upload / Load Demo Documents', desc: 'Click "Load Demo Data" on the dashboard to populate the environment.' },
    { num: 2, title: 'Open Document Details', desc: 'Click any document on the Documents page to view extracted information.' },
    { num: 3, title: 'Ask AI', desc: 'Go to AI Search and ask: "What are all the deadlines?"' },
    { num: 4, title: 'Check Conflicts', desc: 'Ask: "Are there conflicting deadlines?" to see contradiction handling.' },
    { num: 5, title: 'Compare Sources', desc: 'Navigate to Compare and select Project Proposal and Meeting Report.' },
    { num: 6, title: 'Detect Issues', desc: 'View the active conflict on the Conflicts page.' },
    { num: 7, title: 'Create Action', desc: 'Convert the conflict into an Action Item.' },
    { num: 8, title: 'Complete Task', desc: 'Go to Action Items and mark the task as Complete.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-surface-dark border border-surface-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Presentation Demo Guide</h2>
              <p className="text-xs text-slate-400">Follow these steps for the perfect Hackathon pitch.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-4 p-4 rounded-xl bg-surface-card border border-surface-border relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-surface-border group-hover:bg-brand-500 transition-colors" />
              <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                {step.num}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-border bg-surface-card/30 flex justify-end">
          <Button onClick={onClose} className="px-6 flex items-center gap-2">
            Got it <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
