import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Search, GitCompare, AlertTriangle, CheckSquare, ShieldCheck, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const handleStartDemo = () => {
    // Navigate directly to dashboard, the Demo Mode logic handles initial state
    // We could pass state to trigger demo mode auto-load
    navigate('/login', { state: { autoDemo: true } });
  };

  return (
    <div className="min-h-screen bg-surface-dark text-slate-300 font-sans selection:bg-brand-500/30 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-surface-border/50 bg-surface-dark/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">InfoPilot <span className="text-brand-400">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <button 
              onClick={handleStartDemo}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-[0_0_20px_rgba(2,132,199,0.3)] flex items-center gap-2"
            >
              Start Demo <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Hackathon Final Release
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8 max-w-4xl mx-auto">
            Turn Scattered Information Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Actionable Insights.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            InfoPilot AI helps you understand, search, compare, and organize information across multiple documents. Moving you from scattered files to better decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-[0_0_30px_rgba(2,132,199,0.3)] flex items-center justify-center gap-2"
            >
              Try InfoPilot AI
            </Link>
            <a 
              href="#how-it-works" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-300 bg-surface-card hover:bg-surface-border border border-surface-border transition-colors flex items-center justify-center gap-2"
            >
              See How It Works <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="py-20 px-6 border-y border-surface-border/50 bg-surface-card/30">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="p-8 rounded-2xl bg-surface-card border border-rose-500/20 relative">
              <div className="absolute top-0 left-8 w-16 h-1 bg-rose-500 rounded-b-md"></div>
              <h3 className="text-rose-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> The Problem
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                "Important information is often scattered across documents and requires repetitive, error-prone manual review."
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-surface-card border border-emerald-500/20 relative shadow-[0_0_40px_rgba(16,185,129,0.05)]">
              <div className="absolute top-0 left-8 w-16 h-1 bg-emerald-500 rounded-b-md"></div>
              <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> The Solution
              </h3>
              <p className="text-lg text-white leading-relaxed font-medium">
                "InfoPilot AI brings that information together and helps users find important details, identify conflicts, and take action immediately."
              </p>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">The Intelligent Workflow</h2>
            <p className="text-slate-400 text-lg">From raw documents to clear next steps in minutes.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 flex-wrap">
            {['Upload', 'Understand', 'Search', 'Compare', 'Detect', 'Act'].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <div className="flex items-center justify-center w-32 h-16 rounded-xl bg-surface-card border border-surface-border text-white font-bold tracking-wide shadow-sm hover:border-brand-500/50 hover:text-brand-400 transition-colors">
                  {step}
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block" />
                )}
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-slate-600 md:hidden rotate-90 my-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 border-t border-surface-border/50 bg-surface-card/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-8 rounded-2xl bg-surface-card border border-surface-border hover:border-brand-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-6">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Document Understanding</h3>
                <p className="text-slate-400 leading-relaxed">Automatically extract deadlines, budgets, requirements, and metadata the moment you upload.</p>
              </div>

              <div className="p-8 rounded-2xl bg-surface-card border border-surface-border hover:border-brand-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart Search</h3>
                <p className="text-slate-400 leading-relaxed">Ask questions in plain English. Get answers backed by verified source citations across all documents.</p>
              </div>

              <div className="p-8 rounded-2xl bg-surface-card border border-surface-border hover:border-brand-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-6">
                  <GitCompare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Document Comparison</h3>
                <p className="text-slate-400 leading-relaxed">Select multiple documents and automatically generate structured comparison tables highlighting key differences.</p>
              </div>

              <div className="p-8 rounded-2xl bg-surface-card border border-surface-border hover:border-amber-500/30 transition-all md:col-start-1 md:col-end-3 lg:col-start-2 lg:col-end-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Conflict Detection</h3>
                <p className="text-slate-400 leading-relaxed">InfoPilot AI proactively scans for contradicting information like differing budgets or misaligned deadlines.</p>
              </div>

              <div className="p-8 rounded-2xl bg-surface-card border border-surface-border hover:border-emerald-500/30 transition-all md:col-start-1 md:col-end-3 lg:col-start-3 lg:col-end-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Action Items</h3>
                <p className="text-slate-400 leading-relaxed">Turn detected conflicts and requirements into actionable, tracked tasks right from the dashboard.</p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-dark py-12 px-6 relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-brand-400" />
          <span className="text-lg font-bold text-white">InfoPilot AI</span>
        </div>
        <p className="text-sm text-slate-500">
          Hackathon Final Build &bull; Ready for deployment
        </p>
      </footer>
    </div>
  );
}
