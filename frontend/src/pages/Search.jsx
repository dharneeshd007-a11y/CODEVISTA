import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Search as SearchIcon, FileText, ArrowRight, Loader2, Sparkles, X, AlertTriangle } from 'lucide-react';

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
  const [state, setState] = useState('idle');
  const [results, setResults] = useState([]);

  const demoData = {
    "What are all the deadlines?": {
      answer: "I found 3 deadline references across your documents.\n\n• Project Proposal.pdf — 20 October 2026\n• Meeting Report.pdf — 22 October 2026\n• Requirements.pdf — 20 October 2026",
      conflict: "The Meeting Report contains a different deadline.",
      results: [
        { title: "Project Proposal", type: "Deadline", source: "Project Proposal.pdf", content: "The final submission deadline for the proposal is 20 October 2026.", highlight: "20 October 2026" },
        { title: "Meeting Report", type: "Deadline", source: "Meeting Report.pdf", content: "Action item: Deliver final project by 22 October 2026.", highlight: "22 October 2026" },
        { title: "Requirements", type: "Deadline", source: "Requirements.pdf", content: "Contractual requirements mandate submission by 20 October 2026.", highlight: "20 October 2026" }
      ]
    },
    "What are the important requirements?": {
      answer: "I found 2 important requirement sections across your documents.\n\n• Submit project documentation and review checklist\n• Teams must submit project documentation outlining the architecture",
      results: [
        { title: "Project Requirements", type: "Requirement", source: "Project Requirements.pdf", content: "Submit project documentation and review checklist before proceeding to Phase 5.", highlight: "Submit project documentation and review checklist" },
        { title: "Project Proposal", type: "Requirement", source: "Project Proposal.pdf", content: "Teams must submit project documentation outlining the architecture.", highlight: "Submit project documentation" }
      ]
    },
    "Are there any conflicting values?": {
      answer: "Yes, I detected 2 conflicting values across your documents.\n\n1. Deadline conflict: 20 October 2026 vs 22 October 2026.\n2. Budget conflict: ₹50,000 vs ₹60,000.",
      conflict: "Multiple conflicts detected in critical project parameters.",
      results: [
        { title: "Project Proposal", type: "Conflict", source: "Project Proposal.pdf", content: "Deadline: 20 October 2026. Budget: ₹50,000.", highlight: "20 October 2026" },
        { title: "Meeting Report", type: "Conflict", source: "Meeting Report.pdf", content: "Revised deadline: 22 October 2026. Budget revised to ₹60,000.", highlight: "22 October 2026" }
      ]
    },
    "What action items were identified?": {
      answer: "I found 3 action items assigned to your team.\n\n• Verify final submission deadline (High Priority)\n• Review budget allocation (Medium Priority)\n• Update project requirements (Medium Priority)",
      results: [
        { title: "Action Item", type: "Task", source: "Meeting Report.pdf", content: "Action Item: Verify final submission deadline before the end of the week.", highlight: "Verify final submission deadline" },
        { title: "Action Item", type: "Task", source: "Project Requirements.pdf", content: "Action Item: Review budget allocation and update project requirements.", highlight: "Review budget allocation" }
      ]
    },
    "What information is missing?": {
      answer: "I found 1 piece of missing critical information.\n\n• No budget allocation has been specified in the Project Proposal.",
      results: [
        { title: "Missing Information", type: "Flag", source: "System Analysis", content: "No budget allocation has been specified in the Project Proposal.", highlight: "No budget allocation" }
      ]
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setState('loading');
    
    setTimeout(() => {
      const matchKey = Object.keys(demoData).find(k => query.toLowerCase().includes(k.toLowerCase().replace('?', '').split(' ')[0]));
      const match = demoData[query] || demoData[matchKey];
      
      if (match) {
        setResults(match);
        setState('results');
      } else {
        setResults(null);
        setState('no-results');
      }
    }, 1200);
  };

  const setDemoQuery = (q) => {
    setQuery(q);
    setState('loading');
    setTimeout(() => {
      setResults(demoData[q] || null);
      setState(demoData[q] ? 'results' : 'no-results');
    }, 1000);
  };

  const hasDeadlineConflict = results?.conflict && state === 'results';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <SearchIcon className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Workflow Step 1 • Smart Search
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Smart Search</h2>
            <p className="text-slate-400 text-lg">
              Find important information across your documents. Don't search through every document. Find what matters.
            </p>
          </div>

          <Link
            to="/compare"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-300 hover:text-white bg-brand-500/10 hover:bg-brand-600/30 border border-brand-500/30 transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Compare Sources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div>
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

        {/* Potential Conflict Banner from AI Answer */}
        {hasDeadlineConflict && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in">
            <div className="flex items-center gap-2.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>⚠️ Conflict detected:</strong> {results.conflict}
              </span>
            </div>
            <Link
              to="/conflicts"
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 shrink-0"
            >
              Inspect in Conflict Detection
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

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

          {state === 'results' && results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* AI Conversational Answer */}
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                  <h3 className="text-xl font-bold text-white">AI Answer</h3>
                </div>
                <div className="text-slate-200 text-lg whitespace-pre-wrap leading-relaxed">
                  {results.answer}
                </div>
                {results.conflict && (
                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="flex items-start gap-2 text-amber-400">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-1">Conflict detected:</strong>
                        <span className="text-amber-200/80">{results.conflict}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-6 pt-6 border-t border-brand-500/20">
                  <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Sources Consulted</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(results.results.map(r => r.source))).map((src, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark border border-surface-border rounded-lg text-sm text-slate-300">
                        <FileText className="w-3.5 h-3.5 text-brand-400" />
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 mt-12 border-b border-surface-border">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  Extracted Information Segments
                </h3>
                <span className="text-xs font-semibold tracking-wider uppercase bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full border border-brand-500/20">
                  DEMO RESULTS
                </span>
              </div>
              
              <div className="grid gap-4">
                {results.results.map((res, i) => (
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
