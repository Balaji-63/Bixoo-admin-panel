import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Target, CheckCircle, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';
import { DocumentModal } from '../components/common/DocumentModal';
import { apiClient } from '../api/client';

export const CasesView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalEntity, setDocModalEntity] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/admin/cases');
      setCases(res.data.cases || []);
    } catch (err) {
      setError('Failed to fetch cases');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleAuditSubmit = async (payload) => {
    try {
      await apiClient.post(`/api/v1/admin/cases/${selectedCase.caseId}/resolve`, {
        actionType: 'RESOLVE',
        ...payload
      });
      setModalOpen(false);
      fetchCases(); // Refresh the list
    } catch (err) {
      alert('Failed to submit resolution.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Dispute & Anomaly Resolution</h1>
          <p className="text-xs text-slate-400">Triaging system flags and user-reported disputes across the supply chain.</p>
        </div>
        <button onClick={fetchCases} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 hover:bg-slate-700 transition">
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
            <p className="text-sm font-medium">Loading cases...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-400">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            No active cases found.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 px-4">Case Ref</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Linked Entity</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">SLA / Aging</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {cases.map((c) => (
                <tr key={c.caseId} className={`hover:bg-slate-800/30 ${c.sla === 'BREACHED' ? 'bg-rose-950/10' : ''}`}>
                  <td className="py-3 px-4 font-mono text-emerald-400">{c.caseId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-slate-800 text-slate-300 border-slate-700">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{c.linkedEntity}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{c.reporterId}</td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-1.5 ${
                      c.sla === 'BREACHED' ? 'text-rose-400 font-medium' : 'text-slate-400'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {c.sla}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      c.status === 'INVESTIGATING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => { setDocModalEntity(c.caseId); setDocModalOpen(true); }}
                      className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition">
                      View Evidence
                    </button>
                    {c.status !== 'RESOLVED' && (
                      <PermissionGate permission="cases:triage">
                        <button 
                          onClick={() => {
                            setSelectedCase(c);
                            setModalOpen(true);
                          }}
                          className="px-2 py-1 text-[11px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-600/30 transition"
                        >
                          Resolve
                        </button>
                      </PermissionGate>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {docModalOpen && docModalEntity && (
        <DocumentModal
          isOpen={docModalOpen}
          title={`Evidence File: ${docModalEntity}`}
          targetEntity={docModalEntity}
          onClose={() => setDocModalOpen(false)}
        />
      )}

      {modalOpen && selectedCase && (
        <AuditModal
          isOpen={modalOpen}
          title={`Resolve Dispute: ${selectedCase.caseId}`}
          targetEntity={selectedCase.caseId}
          requiresSuperAdmin={false}
          onConfirm={handleAuditSubmit}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
