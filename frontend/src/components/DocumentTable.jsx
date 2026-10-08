import React from 'react';
import { FileText, Eye, GitCompare, Trash2, ShieldAlert } from 'lucide-react';

export default function DocumentTable({ documents, onView, onCompare, onDelete }) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-surface-border bg-surface-card/30">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-surface-dark/50 border-b border-surface-border text-slate-400 uppercase text-xs font-semibold tracking-wider">
          <tr>
            <th className="px-6 py-4 rounded-tl-2xl">Document</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Last Updated</th>
            <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-surface-card/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white flex items-center gap-2">
                      {doc.name}
                      {doc.isDemo && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          Demo Data
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-surface-border text-xs font-medium">
                  {doc.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'Processed' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-brand-500/10 text-brand-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    doc.status === 'Processed' ? 'bg-emerald-400' : 'bg-brand-400'
                  }`} />
                  {doc.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-400">
                {doc.lastUpdated}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onView(doc)}
                    className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onCompare(doc)}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="Compare"
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
