import React, { useState, useEffect } from 'react';
import { Package, Activity, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Ban, PauseCircle, Loader2, AlertCircle } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';
import { apiClient } from '../api/client';

export const RequirementsView = () => {
  const [expandedReq, setExpandedReq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReqs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/admin/requirements');
      setRequirements(res.data.requirements || []);
    } catch (err) {
      setError('Failed to fetch requirements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReqs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedReq(expandedReq === id ? null : id);
  };

  const handleAction = (req, type) => {
    setSelectedAction({ reqId: req.id, type });
    setModalOpen(true);
  };

  const handleConfirm = async (payload) => {
    try {
      await apiClient.post(`/api/v1/admin/requirements/${selectedAction.reqId}/action`, {
        actionType: selectedAction.type,
        ...payload
      });
      setModalOpen(false);
      fetchReqs();
    } catch (err) {
      alert('Failed to process requirement action');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Requirements & Demands</h1>
          <p className="text-xs text-slate-400">Oversight on buyer requirements, partial matching, and system interventions.</p>
        </div>
        <button onClick={fetchReqs} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 hover:bg-slate-700 transition">
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
            <p className="text-sm font-medium">Loading requirements...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-400">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : requirements.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            No requirements found.
          </div>
        ) : (
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
            <tr>
              <th className="py-3 px-4 w-8"></th>
              <th className="py-3 px-4">Requirement ID</th>
              <th className="py-3 px-4">Buyer ID</th>
              <th className="py-3 px-4">Category / Product</th>
              <th className="py-3 px-4">Fulfillment Status</th>
              <th className="py-3 px-4">Remaining Need</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 text-right">Governance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {requirements.map((req) => (
              <React.Fragment key={req.id}>
                <tr className={`hover:bg-slate-800/30 transition-colors ${req.flagged ? 'bg-amber-950/10' : ''}`}>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleExpand(req.id)} className="text-slate-500 hover:text-slate-300 transition">
                      {expandedReq === req.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-medium">{req.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{req.buyerId}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{req.product}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${((req.totalRequested - req.remainingQty) / req.totalRequested) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {req.totalRequested - req.remainingQty}/{req.totalRequested}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-medium text-amber-300">{req.remainingQty} {req.unit}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      req.status === 'MATCHING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {req.flagged ? 'FLAGGED_REVIEW' : req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {req.status !== 'CLOSED' && req.status !== 'PAUSED' && (
                      <PermissionGate permission="requirements:review">
                        <button 
                          onClick={() => handleAction(req, 'PAUSE')}
                          className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition inline-flex items-center gap-1"
                        >
                          <PauseCircle className="w-3 h-3" /> Pause
                        </button>
                      </PermissionGate>
                    )}
                    {req.status !== 'CLOSED' && (
                      <PermissionGate permission="requirements:override">
                        <button 
                          onClick={() => handleAction(req, 'FORCE_CLOSE')}
                          className="px-2 py-1 text-[11px] bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded hover:bg-rose-600/30 transition inline-flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" /> Force Close
                        </button>
                      </PermissionGate>
                    )}
                  </td>
                </tr>
                
                {/* Expandable Partial Supply Breakdown */}
                {expandedReq === req.id && (
                  <tr className="bg-slate-950/40 border-b border-slate-800/50">
                    <td colSpan={8} className="p-0">
                      <div className="px-14 py-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Activity className="w-3.5 h-3.5" />
                          Supplier Responses & Independent Orders
                        </div>
                        {req.offers && req.offers.length > 0 ? (
                          <table className="w-full text-left text-[11px] border border-slate-800 rounded">
                            <thead className="bg-slate-900 text-slate-500">
                              <tr>
                                <th className="px-3 py-2 font-medium">Offer Ref</th>
                                <th className="px-3 py-2 font-medium">Supplier ID</th>
                                <th className="px-3 py-2 font-medium">Offered Qty</th>
                                <th className="px-3 py-2 font-medium">Negotiation State</th>
                                <th className="px-3 py-2 font-medium">Generated Order Ref</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50 text-slate-400">
                              {req.offers.map(offer => (
                                <tr key={offer.offerId}>
                                  <td className="px-3 py-2 font-mono">{offer.offerId}</td>
                                  <td className="px-3 py-2 font-mono">{offer.sellerId}</td>
                                  <td className="px-3 py-2 font-mono text-slate-300">{offer.offeredQty} {req.unit}</td>
                                  <td className="px-3 py-2">
                                    <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${
                                      offer.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                      {offer.status}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 font-mono text-emerald-500">
                                    {offer.linkedOrder || <span className="text-slate-600">Pending</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">No supplier offers recorded yet.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {modalOpen && selectedAction && (
        <AuditModal
          isOpen={modalOpen}
          title={selectedAction.type === 'FORCE_CLOSE' ? 'Force Close Requirement' : 'Pause Demand Matching'}
          targetEntity={selectedAction.reqId}
          requiresSuperAdmin={selectedAction.type === 'FORCE_CLOSE'}
          onConfirm={handleConfirm}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
