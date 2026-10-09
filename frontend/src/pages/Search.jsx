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

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setState('loading');
    
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/documents/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      
      const mappedResults = data.map(doc => ({
        title: doc.name,
        type: doc.type,
        source: 'Database',
        content: doc.summary || 'No text extracted for this document yet.',
        highlight: query // just a basic highlighting attempt
      }));
      
      setResults(mappedResults);
      setState(mappedResults.length > 0 ? 'results' : 'no-results');
    } catch (err) {
      console.error(err);
      setResults([]);
      setState('no-results');
    }
  };

  const hasDeadlineConflict = false;

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
            {/* Removed hardcoded demo suggestions */}
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
                  RESULTS
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
