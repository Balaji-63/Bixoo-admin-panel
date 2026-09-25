import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, FileText, Ban, Loader2, AlertCircle } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';
import { accountsApi } from '../api/services/accounts';

export const AccountsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from the backend on component mount
  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Calls GET /admin/accounts
      const data = await accountsApi.getAccounts({ status: 'PENDING_REVIEW' });
      setAccounts(data.accounts || []);
    } catch (err) {
      setError('Failed to load accounts queue. Please check your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = (account, actionType) => {
    setSelectedEntity({ ...account, actionType });
    setIsModalOpen(true);
  };

  const handleAuditSubmit = async (payload) => {
    try {
      // Calls POST /admin/accounts/{id}/decisions
      await accountsApi.submitDecision(selectedEntity.id, {
        actionType: selectedEntity.actionType,
        ...payload
      });
      
      // Close modal and refresh the table to remove the processed row
      setIsModalOpen(false);
      fetchQueue();
    } catch (err) {
      alert('Failed to submit decision. Conflict or network error occurred.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Verification & Accounts Queue</h1>
          <p className="text-xs text-slate-400">Review business registration, GSTIN filings, and fleet documentation.</p>
        </div>
        <button 
          onClick={fetchQueue}
          className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 hover:bg-slate-700 transition"
        >
          Refresh Queue
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
            <p className="text-sm font-medium">Loading verification queue...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-400">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            No pending accounts found in the queue.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Contact (Masked)</th>
                <th className="py-3 px-4">Tax / GSTIN</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{acc.id}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {acc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">{acc.businessName}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{acc.contactMasked}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{acc.gstin}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {acc.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button 
                      onClick={() => handleAction(acc, 'APPROVE')}
                      className="px-2.5 py-1 text-[11px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-600/30 transition"
                    >
                      Verify
                    </button>
                    <PermissionGate permission="accounts:suspend">
                      <button 
                        onClick={() => handleAction(acc, 'SUSPEND')}
                        className="px-2.5 py-1 text-[11px] bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded hover:bg-rose-600/30 transition inline-flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" />
                        Suspend
                      </button>
                    </PermissionGate>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && selectedEntity && (
        <AuditModal
          isOpen={isModalOpen}
          title={selectedEntity.actionType === 'SUSPEND' ? 'Suspend Account' : 'Verify Account'}
          targetEntity={selectedEntity.id}
          requiresSuperAdmin={selectedEntity.actionType === 'SUSPEND'}
          onConfirm={handleAuditSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};