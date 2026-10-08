import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { GitCompare, AlertTriangle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

const DocumentSelector = ({ label, selected, onSelect }) => {
  const docs = [
    { id: 'none', name: 'Select a document...' },
    { id: 'doc-a', name: 'Project Proposal' },
    { id: 'doc-b', name: 'Project Requirements' },
  ];

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">{label}</label>
      <div className="relative">
        <select 
          className="w-full appearance-none bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all cursor-pointer"
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
        >
          {docs.map(doc => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <FileText className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
};

const ComparisonPanel = ({ title, items, docName, isDiff }) => {
  return (
    <div className="flex-1 bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
      <div className="bg-surface-dark px-6 py-4 border-b border-surface-border">
        <h4 className="font-semibold text-slate-300 text-sm tracking-wider uppercase text-center">{title}</h4>
      </div>
      <div className="p-6 space-y-6">
        {items.map((item, i) => (
          <div key={i}>
            <div className="text-xs text-slate-500 uppercase font-semibold mb-2">{item.label}</div>
            <div className={`p-4 rounded-xl border ${isDiff && item.diff ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-surface-dark border-surface-border text-slate-300'}`}>
              {item.value}
              {item.extra && (
                <div className="mt-2 pt-2 border-t border-amber-500/20 text-brand-300 font-medium">
                  + {item.extra}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Compare() {
  const [docA, setDocA] = useState('none');
  const [docB, setDocB] = useState('none');
  const [isComparing, setIsComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const canCompare = docA !== 'none' && docB !== 'none' && docA !== docB;

  const handleCompare = () => {
    if (!canCompare) return;
    setIsComparing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsComparing(false);
      setShowResults(true);
    }, 1500);
  };

  const itemsA = [
    { label: 'Deadline', value: '20 October 2026', diff: true },
    { label: 'Requirement', value: 'Submit project documentation', diff: false }
  ];

  const itemsB = [
    { label: 'Deadline', value: '25 October 2026', diff: true },
    { label: 'Requirement', value: 'Submit project documentation', extra: 'review checklist', diff: true }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Compare Documents</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Compare information from multiple sources and identify differences. Compare sources. Discover differences. Act with confidence.
          </p>
        </div>

        {/* Document Selection */}
        <div className="bg-surface-card border border-surface-border rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <DocumentSelector label="Document A" selected={docA} onSelect={setDocA} />
            <div className="hidden md:flex pb-3 items-center justify-center w-12 h-12 bg-surface-dark rounded-full border border-surface-border text-slate-400 shrink-0">
              VS
            </div>
            <DocumentSelector label="Document B" selected={docB} onSelect={setDocB} />
            <button
              onClick={handleCompare}
              disabled={!canCompare || isComparing}
              className={`w-full md:w-auto px-8 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                canCompare && !isComparing
                  ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-surface-dark text-slate-500 border border-surface-border cursor-not-allowed'
              }`}
            >
              {isComparing ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                  Comparing...
                </>
              ) : (
                <>
                  <GitCompare className="w-5 h-5" />
                  Compare Documents
                </>
              )}
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!showResults && !isComparing && (
          <div className="text-center py-20 px-4 border border-surface-border/50 border-dashed rounded-3xl bg-surface-dark/50 mt-8">
            <div className="w-16 h-16 bg-surface-card rounded-2xl flex items-center justify-center mx-auto mb-6 border border-surface-border">
              <GitCompare className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Select two documents to compare</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Compare multiple sources to discover differences and missing information. Ensure consistency across your project documentation.
            </p>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-card border border-surface-border p-5 rounded-2xl">
                <div className="text-slate-400 text-sm mb-1">Information Compared</div>
                <div className="text-2xl font-bold text-white">2 Documents</div>
              </div>
              <div className="bg-surface-card border border-surface-border p-5 rounded-2xl">
                <div className="text-slate-400 text-sm mb-1">Matching Items</div>
                <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> 1
                </div>
              </div>
              <div className="bg-surface-card border border-surface-border p-5 rounded-2xl">
                <div className="text-slate-400 text-sm mb-1">Differences</div>
                <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                  <GitCompare className="w-5 h-5" /> 2
                </div>
              </div>
              <div className="bg-surface-card border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/5"></div>
                <div className="relative">
                  <div className="text-amber-200/80 text-sm mb-1">Potential Conflicts</div>
                  <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> 1
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <span className="text-xs font-semibold tracking-wider uppercase bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full border border-brand-500/20">
                Demo Comparison
              </span>
            </div>

            {/* Conflict Preview */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-amber-300 flex items-center gap-2 mb-2">
                    Conflict Detected
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-500/30">
                      Needs Verification
                    </span>
                  </h4>
                  <p className="text-amber-200/80 mb-6 text-sm">
                    Different deadlines were found across the selected documents.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-dark/50 border border-amber-500/20 rounded-xl p-4">
                      <div className="text-xs text-amber-500/70 font-semibold uppercase mb-1">Project Proposal</div>
                      <div className="text-amber-100 font-medium">20 October 2026</div>
                    </div>
                    <div className="bg-surface-dark/50 border border-amber-500/20 rounded-xl p-4">
                      <div className="text-xs text-amber-500/70 font-semibold uppercase mb-1">Project Requirements</div>
                      <div className="text-amber-100 font-medium">25 October 2026</div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/conflicts"
                    className="inline-flex items-center gap-2 bg-amber-500 text-amber-950 font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm"
                  >
                    Review Conflict <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Side by side comparison */}
            <div className="flex flex-col md:flex-row gap-6 mt-8">
              <ComparisonPanel 
                title="Project Proposal" 
                items={itemsA} 
                isDiff={true} 
              />
              <ComparisonPanel 
                title="Project Requirements" 
                items={itemsB} 
                isDiff={true} 
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
