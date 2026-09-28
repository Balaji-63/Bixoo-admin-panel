import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, CheckCircle, Clock, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { StepUpGuard } from '../components/common/StepUpGuard';
import { AuditModal } from '../components/common/AuditModal';
import { DocumentModal } from '../components/common/DocumentModal';
import { apiClient } from '../api/client';

export const SettlementsView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalEntity, setDocModalEntity] = useState(null);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  
  const [settlements, setSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettlements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/admin/settlements');
      setSettlements(res.data.settlements || []);
    } catch (err) {
      setError('Failed to fetch settlements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleAuditSubmit = async (payload) => {
    try {
      await apiClient.post(`/api/v1/admin/settlements/${selectedSettlement.settlementId}/reconcile`, {
        actionType: 'RECONCILE',
        ...payload
      });
      setModalOpen(false);
      fetchSettlements(); // Refresh the list
    } catch (err) {
      alert('Failed to submit reconciliation.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Financial Settlements Ledger</h1>
          <p className="text-xs text-slate-400">Reconcile payments and verify ePOD artifacts prior to initiating banking instructions.</p>
        </div>
        <button onClick={fetchSettlements} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 hover:bg-slate-700 transition">
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
            <p className="text-sm font-medium">Loading settlements...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-400">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : settlements.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            No settlements pending.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 px-4">Settlement ID</th>
                <th className="py-3 px-4">Linked Trip</th>
                <th className="py-3 px-4">Payee Entity</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">ePOD / Proof</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {settlements.map((settlement) => (
                <tr key={settlement.settlementId} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono text-emerald-400">{settlement.settlementId}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{settlement.tripId}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-200">{settlement.payee}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{settlement.bankRefMasked}</p>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{settlement.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-1.5 ${
                      settlement.proofStatus === 'EPOD_VERIFIED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {settlement.proofStatus === 'EPOD_VERIFIED' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {settlement.proofStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      settlement.settlementStatus === 'CLEARED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {settlement.settlementStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => { setDocModalEntity(settlement.settlementId); setDocModalOpen(true); }}
                      className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition">
                      View Documents
                    </button>
                    {settlement.settlementStatus !== 'CLEARED' && (
                      <PermissionGate permission="settlements:reconcile">
                        <StepUpGuard actionName={`RECONCILE_${settlement.settlementId}`} onVerified={() => {
                          setSelectedSettlement(settlement);
                          setModalOpen(true);
                        }}>
                          <button className="px-2 py-1 text-[11px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-600/30 transition">
                            Reconcile
                          </button>
                        </StepUpGuard>
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
          title={`ePOD Document: ${docModalEntity}`}
          targetEntity={docModalEntity}
          onClose={() => setDocModalOpen(false)}
        />
      )}

      {modalOpen && selectedSettlement && (
        <AuditModal
          isOpen={modalOpen}
          title="Manual Settlement Reconciliation"
          targetEntity={selectedSettlement.settlementId}
          requiresSuperAdmin={true}
          onConfirm={handleAuditSubmit}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
