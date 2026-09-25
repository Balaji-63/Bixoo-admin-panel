import React, { useState } from 'react';
import { AlertTriangle, MessageSquare, Paperclip, ShieldAlert } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';

export const CasesView = () => {
  const [activeCase, setActiveCase] = useState(null);

  const cases = [
    {
      caseId: 'CAS-7001',
      type: 'DISPUTE_COMPLETION',
      linkedEntity: 'TRIP-4899', // Trip reference
      reporterId: 'USR-4410', // Buyer reported missing delivery despite trip marking completed
      status: 'INVESTIGATING',
      sla: '24h',
      evidenceAttached: true,
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Case Queue (Left Column) */}
      <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <h2 className="text-sm font-semibold text-slate-100">Reported Cases & Disputes</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {cases.map((c) => (
            <div 
              key={c.caseId}
              onClick={() => setActiveCase(c)}
              className={`p-3 rounded border cursor-pointer transition ${
                activeCase?.caseId === c.caseId 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs font-semibold text-slate-200">{c.caseId}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {c.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Ref: <span className="font-mono text-slate-300">{c.linkedEntity}</span></p>
              <p className="text-[11px] text-slate-400">Reporter: <span className="font-mono text-slate-300">{c.reporterId}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Restricted Evidence Viewer (Right Columns) */}
      <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
        {!activeCase ? (
          <div className="text-center text-slate-500">
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Privacy Sandbox Enforced</p>
            <p className="text-xs mt-1 max-w-sm">Chat transcripts and attached documents are restricted. Select an active case to request scoped access[cite: 1].</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Case Investigation: {activeCase.caseId}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Scoped access granted for entity: {activeCase.linkedEntity}</p>
              </div>
              <button className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-500 transition">
                Resolve Case
              </button>
            </div>
            
            <div className="flex-1 p-6 grid grid-cols-2 gap-6">
              {/* Evidence Docs */}
              <div className="border border-slate-800 rounded bg-slate-950 p-4">
                <div className="flex items-center gap-2 mb-4 text-slate-300 text-xs font-medium border-b border-slate-800 pb-2">
                  <Paperclip className="w-4 h-4" /> Attached Proof Documents
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-mono">gate_receipt_signed.pdf</span>
                  <button className="text-[10px] text-emerald-400 hover:underline">View (Signed URL)</button>
                </div>
              </div>

              {/* Scoped Chat Log */}
              <div className="border border-slate-800 rounded bg-slate-950 p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-slate-300 text-xs font-medium border-b border-slate-800 pb-2">
                  <MessageSquare className="w-4 h-4" /> Restricted Chat Metadata
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto">
                   <div className="bg-slate-900 p-2 rounded text-[11px] text-slate-300 border border-slate-800">
                     <span className="font-mono text-emerald-400">Transporter (09:15):</span> Reached destination gate.
                   </div>
                   <div className="bg-slate-900 p-2 rounded text-[11px] text-slate-300 border border-slate-800">
                     <span className="font-mono text-blue-400">Buyer (10:30):</span> Material missing from bay 4.
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};