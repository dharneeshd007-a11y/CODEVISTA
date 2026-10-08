import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Lightbulb, ShieldAlert, Calendar, FileCheck, CheckSquare, 
  Info, ArrowRight, BookOpen, Search, GitCompare,
  FileText
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const DEMO_DOCUMENTS = [
  { id: 'demo-1', name: 'Project Proposal' },
  { id: 'demo-2', name: 'Project Requirements' },
  { id: 'demo-3', name: 'Project Guidelines' }
];

const INSIGHTS_DATA = {
  'demo-1': {
    summary: "This document describes the project proposal, key requirements, important deadlines and expected submission details.",
    importantDates: [
      { date: '20 October 2026', desc: 'Project Submission Deadline' },
      { date: '25 October 2026', desc: 'Requirement Verification Deadline' }
    ],
    requirements: [
      "Submit project documentation",
      "Review project requirements",
      "Verify final deadline"
    ],
    actionItems: [
      { id: 'a1', title: "Verify final submission deadline", priority: "High" },
      { id: 'a2', title: "Review project requirements", priority: "Medium" }
    ],
    importantDetails: [
      "Submission deadline",
      "Required documentation",
      "Verification requirement",
      "Potential conflicting information"
    ],
    reviewItems: [
      { label: "Important information identified", type: "High Attention" },
      { label: "Requirements identified", type: "Important" },
      { label: "Potential conflict identified", type: "Needs Verification" }
    ],
    relatedSources: ['Project Requirements', 'Project Guidelines']
  },
  'demo-2': {
    summary: "Detailed project requirements including architectural guidelines, supported frameworks, and delivery milestones.",
    importantDates: [
      { date: '22 October 2026', desc: 'Architecture Review' },
      { date: '30 October 2026', desc: 'Final Delivery' }
    ],
    requirements: [
      "Implement responsive layouts",
      "Ensure cross-browser compatibility",
      "Follow accessibility guidelines"
    ],
    actionItems: [
      { id: 'a3', title: "Validate accessibility contrast", priority: "Medium" }
    ],
    importantDetails: [
      "Strict adherence to responsive breakpoints required",
      "No external CSS libraries permitted without approval"
    ],
    reviewItems: [
      { label: "Strict requirements listed", type: "High Attention" }
    ],
    relatedSources: ['Project Proposal']
  },
  'demo-3': {
    summary: "General project guidelines covering communication protocols, code style, and contribution rules.",
    importantDates: [
      { date: '15 October 2026', desc: 'Kickoff Meeting' }
    ],
    requirements: [
      "Follow ESLint configuration",
      "Use descriptive commit messages"
    ],
    actionItems: [
      { id: 'a4', title: "Setup ESLint on local machine", priority: "Low" }
    ],
    importantDetails: [
      "All commits must be reviewed by a peer",
      "Daily standup at 10:00 AM"
    ],
    reviewItems: [
      { label: "Process guidelines identified", type: "Important" }
    ],
    relatedSources: ['Project Proposal', 'Project Requirements']
  }
};

export default function Insights() {
  const location = useLocation();
  
  // Check if a document ID was passed via state (e.g. from DocumentDetails)
  const initialDocId = location.state?.documentId || '';
  
  const [selectedDocId, setSelectedDocId] = useState(initialDocId);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Analyzing document...",
    "Finding important information...",
    "Organizing insights...",
    "Ready"
  ];

  useEffect(() => {
    if (selectedDocId) {
      setIsLoading(true);
      setLoadingStep(0);
      
      const interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= loadingSteps.length - 1) {
            clearInterval(interval);
            setIsLoading(false);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      
      return () => clearInterval(interval);
    }
  }, [selectedDocId, loadingSteps.length]);

  const handleDocSelect = (e) => {
    setSelectedDocId(e.target.value);
  };

  const selectedData = INSIGHTS_DATA[selectedDocId];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Insights</h2>
            <p className="text-slate-400 text-lg">Understand what matters in your information.</p>
          </div>
          
          <div className="w-full md:w-80">
            <label className="block text-sm font-medium text-slate-400 mb-2">Select Document</label>
            <div className="relative">
              <select 
                value={selectedDocId}
                onChange={handleDocSelect}
                className="w-full glass-input pl-4 pr-10 py-3 rounded-xl text-sm appearance-none cursor-pointer bg-surface-dark border-surface-border text-white"
              >
                <option value="" disabled>Choose a document...</option>
                {DEMO_DOCUMENTS.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider flex items-center gap-1 inline-flex">
                <ShieldAlert className="w-3 h-3" />
                DEMO DATA
              </span>
            </div>
          </div>
        </section>

        {/* Dynamic Content */}
        {!selectedDocId ? (
          <EmptyState 
            title="Select a document to view insights"
            description="Choose one of your processed documents from the dropdown above to discover extracted information and action items."
            icon={Lightbulb}
            actionLabel="Go to Documents"
            actionPath="/documents"
          />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-indigo-500 animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-brand-400">
                <Lightbulb className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">{loadingSteps[loadingStep]}</h3>
              <p className="text-sm text-slate-400">
                <ShieldAlert className="w-4 h-4 inline-block mr-1 text-amber-500" />
                Demo Processing (Frontend Prototype Only)
              </p>
            </div>
          </div>
        ) : selectedData ? (
          <div className="space-y-10 animate-fade-in">
            
            {/* Visual Workflow (Insights -> Action) */}
            <div className="glass-card rounded-2xl p-6 overflow-x-auto border-surface-border">
               <div className="flex items-center justify-between min-w-[700px] text-center px-4">
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-surface-dark border border-surface-border flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">DOCUMENT</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto mb-3 text-brand-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-brand-400">UNDERSTAND</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-indigo-400">KEY INFO</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-amber-400">FINDINGS</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                      <CheckSquare className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-400">ACTION</span>
                  </div>
               </div>
            </div>

            {/* Summary */}
            <section className="glass-card rounded-2xl p-6 border-l-4 border-l-brand-500">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-brand-400" />
                <h3 className="text-xl font-bold text-white">Document Summary</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-dark border border-surface-border text-slate-400 ml-auto">
                  Sample AI Summary
                </span>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                {selectedData.summary}
              </p>
            </section>

            {/* Key Information 4-Grid */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6">Key Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card rounded-2xl p-5 border-surface-border">
                   <Calendar className="w-5 h-5 text-brand-400 mb-3" />
                   <h4 className="font-semibold text-white mb-1">Important Dates</h4>
                   <p className="text-sm text-slate-400 line-clamp-2">{selectedData.importantDates[0]?.date || 'None'}</p>
                </div>
                <div className="glass-card rounded-2xl p-5 border-surface-border">
                   <FileCheck className="w-5 h-5 text-indigo-400 mb-3" />
                   <h4 className="font-semibold text-white mb-1">Requirements</h4>
                   <p className="text-sm text-slate-400 line-clamp-2">{selectedData.requirements[0] || 'None'}</p>
                </div>
                <div className="glass-card rounded-2xl p-5 border-surface-border">
                   <CheckSquare className="w-5 h-5 text-emerald-400 mb-3" />
                   <h4 className="font-semibold text-white mb-1">Action Items</h4>
                   <p className="text-sm text-slate-400 line-clamp-2">{selectedData.actionItems[0]?.title || 'None'}</p>
                </div>
                <div className="glass-card rounded-2xl p-5 border-surface-border">
                   <Info className="w-5 h-5 text-amber-400 mb-3" />
                   <h4 className="font-semibold text-white mb-1">Important Details</h4>
                   <p className="text-sm text-slate-400 line-clamp-2">{selectedData.importantDetails[0] || 'None'}</p>
                </div>
              </div>
            </section>

            {/* Detailed Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Important Dates */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Important Dates</h3>
                  <span className="text-xs text-slate-400">Sample Extracted Information</span>
                </div>
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
                  {selectedData.importantDates.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-dark bg-brand-500/20 text-brand-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4 rounded-xl border border-surface-border">
                        <div className="text-brand-300 font-bold mb-1">{item.date}</div>
                        <div className="text-sm text-slate-300">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Requirements */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Requirements</h3>
                  <span className="text-xs text-slate-400">Sample Data</span>
                </div>
                <div className="glass-card rounded-2xl p-1 border-surface-border">
                  <ul className="divide-y divide-surface-border">
                    {selectedData.requirements.map((req, idx) => (
                      <li key={idx} className="p-4 flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-200">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Detected Action Items */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">Detected Action Items</h3>
                <div className="space-y-3">
                  {selectedData.actionItems.map((action, idx) => (
                    <div key={idx} className="glass-card rounded-xl p-4 border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-200 font-medium">{idx + 1}. {action.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            action.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                            action.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            Priority: {action.priority}
                          </span>
                        </div>
                      </div>
                      <Link to="/actions" state={{ newAction: action.title }}>
                        <Button variant="secondary" size="sm" className="whitespace-nowrap flex items-center gap-2">
                          <CheckSquare className="w-4 h-4" />
                          Create Action
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* Important Details */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">Important Details</h3>
                <div className="glass-card rounded-2xl p-5 border-surface-border space-y-3 bg-gradient-to-br from-surface-card/40 to-brand-900/10">
                  <ul className="space-y-3 list-inside">
                    {selectedData.importantDetails.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-400 font-bold mt-0.5">•</span>
                        <span className="text-slate-200">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              
              {/* Information Confidence / Review */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">Information Review</h3>
                <div className="space-y-3">
                  {selectedData.reviewItems.map((item, idx) => (
                    <div key={idx} className="glass-card rounded-xl p-4 border-surface-border flex items-center justify-between">
                      <span className="text-slate-300">{item.label}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.type === 'High Attention' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        item.type === 'Important' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Related Sources */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">Related Sources</h3>
                <div className="space-y-3">
                  {selectedData.relatedSources.map((source, idx) => (
                    <div key={idx} className="glass-card rounded-xl p-4 border-surface-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-200 font-medium">{source}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/documents">
                          <Button variant="secondary" size="sm" className="text-xs">
                            View
                          </Button>
                        </Link>
                        <Link to="/compare">
                          <Button variant="secondary" size="sm" className="text-xs flex items-center gap-1">
                            <GitCompare className="w-3 h-3" />
                            Compare
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

          </div>
        ) : null}

      </div>
    </DashboardLayout>
  );
}

// Helper icon component
function ChevronDownIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
