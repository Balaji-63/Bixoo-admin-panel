import React from 'react';
import { X, FileText, Download, CheckCircle } from 'lucide-react';

export const DocumentModal = ({ isOpen, title, targetEntity, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800 bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            {title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Attached to Entity</p>
              <p className="text-sm font-mono text-emerald-400">{targetEntity}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Verification Status</p>
              <p className="text-xs font-medium text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" /> System Verified
              </p>
            </div>
          </div>

          <div className="h-48 bg-slate-950 border border-slate-800 rounded flex items-center justify-center flex-col relative overflow-hidden group">
            {/* Mock Document Visual */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="h-full w-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>
            
            <FileText className="w-12 h-12 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400">Document Scan Mockup</p>
            <p className="text-[10px] text-slate-500 mt-1">PDF • 1.2 MB • Scanned today</p>
            
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
               <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs transition flex items-center gap-2">
                 <Download className="w-3.5 h-3.5" />
                 Download Original
               </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
