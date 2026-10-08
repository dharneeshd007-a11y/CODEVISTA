import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Search as SearchIcon, FileText, ArrowRight, Loader2, Sparkles, X } from 'lucide-react';

const SearchInput = ({ query, setQuery, onSearch }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Sparkles className="w-5 h-5 text-brand-400" />
      </div>
      <input
        type="text"
        className="w-full pl-12 pr-24 py-4 bg-surface-dark border border-surface-border rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-lg shadow-lg"
        placeholder="Ask about deadlines, requirements, action items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="p-2 text-slate-400 hover:text-white transition-colors mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onSearch}
          className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20"
        >
          Search
        </button>
      </div>
    </div>
  );
};

const SearchResult = ({ title, type, source, content, highlight }) => {
  // Simple highlight logic
  const renderContent = () => {
    if (!highlight) return <p className="text-slate-300">{content}</p>;
    const parts = content.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <p className="text-slate-300">
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() 
            ? <span key={i} className="bg-brand-500/20 text-brand-300 px-1 rounded font-medium">{part}</span>
            : part
        )}
      </p>
    );
  };

  return (
    <div className="bg-surface-card border border-surface-border p-6 rounded-2xl hover:border-brand-500/50 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="bg-surface-dark px-2 py-1 rounded-md border border-surface-border text-xs uppercase tracking-wider">{type}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Source: {source}
            </span>
          </div>
        </div>
        <Link to="/documents" className="flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors text-sm font-medium opacity-0 group-hover:opacity-100">
          View Document <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="bg-surface-dark p-4 rounded-xl border border-surface-border/50">
        {renderContent()}
      </div>
    </div>
  );
};

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('idle'); // idle, loading, results, no-results
  const [results, setResults] = useState([]);

  const demoData = {
    "What are the deadlines?": [
      {
        title: "Project Proposal",
        type: "Deadline",
        source: "Project Proposal",
        content: "The final submission deadline for the proposal is 20 October 2026.",
        highlight: "20 October 2026"
      },
      {
        title: "Project Requirements",
        type: "Deadline",
        source: "Project Requirements",
        content: "All technical requirements must be reviewed by 25 October 2026.",
        highlight: "25 October 2026"
      }
    ],
    "What are the project requirements?": [
      {
        title: "Project Requirements",
        type: "Requirement",
        source: "Project Requirements",
        content: "Submit project documentation and review checklist before proceeding to Phase 5.",
        highlight: "Submit project documentation and review checklist"
      },
      {
        title: "Project Proposal",
        type: "Requirement",
        source: "Project Proposal",
        content: "Teams must submit project documentation outlining the architecture.",
        highlight: "Submit project documentation"
      }
    ],
    "What actions are required?": [
      {
        title: "Action Item",
        type: "Task",
        source: "Project Requirements",
        content: "Review checklist must be completed by the lead engineer.",
        highlight: "Review checklist"
      }
    ],
    "What information is missing?": [
      {
        title: "Missing Information",
        type: "Flag",
        source: "System Analysis",
        content: "No budget allocation has been specified in the Project Proposal.",
        highlight: "No budget allocation"
      }
    ]
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setState('loading');
    
    // Simulate AI thinking
    setTimeout(() => {
      const match = Object.keys(demoData).find(k => query.toLowerCase().includes(k.toLowerCase().replace('?', '')));
      if (match) {
        setResults(demoData[match]);
        setState('results');
      } else if (demoData[query]) {
        setResults(demoData[query]);
        setState('results');
      } else {
        setResults([]);
        setState('no-results');
      }
    }, 1500);
  };

  const setDemoQuery = (q) => {
    setQuery(q);
    
    setState('loading');
    setTimeout(() => {
      setResults(demoData[q] || []);
      setState(demoData[q] ? 'results' : 'no-results');
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Smart Search</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Find important information across your documents. Don't search through every document. Find what matters.
          </p>
        </div>

        <div className="mb-12">
          <SearchInput query={query} setQuery={setQuery} onSearch={handleSearch} />
          
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="text-sm text-slate-500 font-medium mr-2">Try asking:</span>
            {Object.keys(demoData).map((q, i) => (
              <button
                key={i}
                onClick={() => setDemoQuery(q)}
                className="text-xs px-3 py-1.5 bg-surface-card border border-surface-border rounded-full text-slate-300 hover:text-brand-400 hover:border-brand-500/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* State Management */}
        <div className="transition-all duration-500 ease-in-out">
          {state === 'idle' && (
            <div className="text-center py-16 px-4 border border-surface-border/50 border-dashed rounded-3xl bg-surface-dark/50">
              <SearchIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">Search across your information</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Enter a question above to instantly find answers, dates, and requirements from your uploaded documents.
              </p>
            </div>
          )}

          {state === 'loading' && (
            <div className="text-center py-24">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Finding relevant information...</h3>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          )}

          {state === 'results' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-400" /> 
                  Relevant Information
                </h3>
                <span className="text-xs font-semibold tracking-wider uppercase bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full border border-brand-500/20">
                  DEMO RESULTS
                </span>
              </div>
              
              <div className="grid gap-4">
                {results.map((res, i) => (
                  <SearchResult key={i} {...res} />
                ))}
              </div>
            </div>
          )}

          {state === 'no-results' && (
            <div className="text-center py-16 px-4 border border-surface-border/50 border-dashed rounded-3xl bg-surface-dark/50">
              <div className="w-16 h-16 bg-surface-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-surface-border">
                <SearchIcon className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No relevant information found</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                We couldn't find an answer to your query in the available documents. Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
