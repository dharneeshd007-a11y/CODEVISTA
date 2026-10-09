import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle, Loader2 } from 'lucide-react';
import Button from './Button';

export default function DocumentUpload({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const fileInputRef = useRef(null);

  const processSteps = [
    'Uploading...',
    'Processing...',
    'Understanding...',
    'Extracting Information...',
    'Completed ✓'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Only accept supported file types
    const ext = file.name.split('.').pop().toLowerCase();
    if (['pdf', 'docx', 'txt', 'csv'].includes(ext)) {
      setSelectedFile({
        name: file.name,
        type: ext.toUpperCase(),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        rawFile: file
      });
    } else {
      alert("Please select a PDF, DOCX, TXT, or CSV file.");
    }
  };

  const startProcessing = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setProcessStep(0);
    
    // Simulate initial steps for UX
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < processSteps.length - 1) {
        setProcessStep(currentStep);
      }
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile.rawFile);

      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const newDoc = await response.json();
      
      clearInterval(interval);
      setProcessStep(processSteps.length - 1); // Completed
      
      setTimeout(() => {
        setIsProcessing(false);
        setSelectedFile(null);
        setProcessStep(0);
        onUploadComplete({
          id: newDoc.id,
          name: newDoc.name,
          type: newDoc.type,
          status: newDoc.status,
          lastUpdated: newDoc.lastUpdated
        });
      }, 800);

    } catch (error) {
      console.error('Upload Error:', error);
      clearInterval(interval);
      setIsProcessing(false);
      setProcessStep(0);
      alert('Failed to upload document. Please check the backend connection.');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Upload your documents</h3>
        <p className="text-sm text-slate-400">
          Add documents to extract important information, compare sources and discover what matters.
        </p>
      </div>

      {!selectedFile && (
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isDragging ? 'border-brand-500 bg-brand-500/5' : 'border-surface-border hover:border-brand-500/50 hover:bg-surface-card/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.txt,.csv"
            />
            <div className="w-16 h-16 rounded-full bg-surface-dark border border-surface-border flex items-center justify-center mb-4 text-slate-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-white font-medium mb-1">Drag & Drop your files here</p>
            <p className="text-sm text-slate-400 mb-4">or</p>
            <Button variant="secondary" className="max-w-[200px]" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              Choose Files
            </Button>
            <p className="text-xs text-slate-500 mt-4">Accepted demo types: PDF, DOCX, TXT, CSV</p>
          </div>
          
          <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Your uploaded documents are used securely to provide information analysis within the application.
          </div>
          <p className="text-white font-medium mb-1">Drag & Drop your files here</p>
          <p className="text-sm text-slate-400 mb-4">or</p>
          <Button variant="secondary" className="max-w-[200px]" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Choose Files
          </Button>
          <p className="text-xs text-slate-500 mt-4">Accepted file types: PDF, DOCX, TXT, CSV</p>
        </div>
      )}

      {selectedFile && !isProcessing && (
        <div className="border border-surface-border rounded-2xl p-6 bg-surface-dark/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
              <File className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-slate-400">{selectedFile.type} • {selectedFile.size}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Ready
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setSelectedFile(null)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={startProcessing} className="flex-1">
              Start Processing
            </Button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="border border-surface-border rounded-2xl p-8 bg-surface-dark/50 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mx-auto mb-6 relative">
            <Loader2 className="w-8 h-8 animate-spin" />
            {processStep === processSteps.length - 1 && (
              <div className="absolute inset-0 bg-surface-dark/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            )}
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">{processSteps[processStep]}</h4>
          <div className="w-full max-w-xs mx-auto bg-surface-border rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-brand-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${(processStep / (processSteps.length - 1)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-brand-300 mt-4 font-medium animate-pulse">
            Extracting insights using AI...
          </p>
        </div>
      )}
    </div>
  );
}
