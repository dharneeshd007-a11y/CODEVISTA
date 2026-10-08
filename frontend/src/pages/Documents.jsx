import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import DashboardLayout from '../components/DashboardLayout';
import DocumentUpload from '../components/DocumentUpload';
import DocumentTable from '../components/DocumentTable';
import DocumentDetails from '../components/DocumentDetails';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function Documents() {
  const { documents, addDocument, removeDocument } = useWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleUploadComplete = (newDoc) => {
    addDocument(newDoc);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this document?')) {
      removeDocument(id);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Documents</h2>
            <p className="text-slate-400 text-lg">Bring your information together and discover what matters.</p>
            <p className="text-brand-400 font-medium mt-1 text-sm">Turn scattered information into clear, actionable insights.</p>
          </div>

          <Link to="/conflicts">
            <Button className="px-4 py-2.5 flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-4 h-4 text-amber-200" />
              <span>View Conflicts</span>
            </Button>
          </Link>
        </section>

        {/* Phase 5 Conflict Alert Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-300">
                Conflict Detected Across Documents
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Conflicting submission dates were detected between <strong className="text-white">Project Proposal</strong> and <strong className="text-white">Project Requirements</strong>.
              </p>
            </div>
          </div>
          <Link
            to="/conflicts"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Inspect Conflicts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Upload Section */}
        <section>
          <DocumentUpload onUploadComplete={handleUploadComplete} />
        </section>

        {/* Document List Section */}
        <section className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold text-white">Your Documents</h3>
            
            {documents.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-sm"
                  />
                </div>

                {/* Filter */}
                <div className="relative w-full sm:w-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Filter className="w-4 h-4" />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full sm:w-auto glass-input pl-10 pr-8 py-2 rounded-xl text-sm appearance-none cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="TXT">TXT</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {documents.length === 0 ? (
            <EmptyState 
              title="No documents yet"
              description="Upload your first document to start discovering important information."
              icon={FileText}
              actionLabel="Upload Document"
              actionPath="#"
            />
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12 bg-surface-card/30 rounded-2xl border border-surface-border">
              <p className="text-slate-400">No documents found matching your search or filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterType('All'); }}
                className="mt-2 text-brand-400 hover:text-brand-300 font-medium text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <DocumentTable 
              documents={filteredDocuments} 
              onView={setSelectedDoc}
              onCompare={() => window.location.href = '/compare'}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>

      {/* Document Details Modal */}
      {selectedDoc && (
        <DocumentDetails 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </DashboardLayout>
  );
}
