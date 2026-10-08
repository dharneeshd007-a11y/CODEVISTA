import React, { useState } from 'react';
import { Search, Filter, FileText } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import DocumentUpload from '../components/DocumentUpload';
import DocumentTable from '../components/DocumentTable';
import DocumentDetails from '../components/DocumentDetails';
import EmptyState from '../components/EmptyState';

const DEMO_DOCUMENTS = [
  {
    id: 'demo-1',
    name: 'Project Proposal',
    type: 'PDF',
    status: 'Processed',
    lastUpdated: '10 Oct 2026',
    isDemo: true
  },
  {
    id: 'demo-2',
    name: 'Project Requirements',
    type: 'DOCX',
    status: 'Processed',
    lastUpdated: '12 Oct 2026',
    isDemo: true
  },
  {
    id: 'demo-3',
    name: 'Project Guidelines',
    type: 'TXT',
    status: 'Processed',
    lastUpdated: '15 Oct 2026',
    isDemo: true
  }
];

export default function Documents() {
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleUploadComplete = (newDoc) => {
    setDocuments([newDoc, ...documents]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
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
        <section className="text-center sm:text-left mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Documents</h2>
          <p className="text-slate-400 text-lg">Bring your information together and discover what matters.</p>
          <p className="text-brand-400 font-medium mt-2">Turn scattered information into clear, actionable insights.</p>
        </section>

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
              onCompare={() => alert('Compare feature coming in next phase.')}
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
