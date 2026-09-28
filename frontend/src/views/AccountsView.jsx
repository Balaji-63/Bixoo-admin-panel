import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, FileText, Ban, Loader2, AlertCircle, Search, Eye, Filter } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';
import { apiClient } from '../api/client';

export const AccountsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/admin/accounts', {
        params: {
          status: statusFilter,
          search: searchQuery
        }
      });
      setAccounts(res.data.accounts || []);
    } catch (err) {
      setError('Failed to load accounts queue. Please check your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQueue();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery]);

  const handleAction = (account, actionType) => {
    setSelectedEntity({ ...account, actionType });
    setIsModalOpen(true);
  };

  const handleAuditSubmit = async (payload) => {
    try {
      await apiClient.post(`/api/v1/admin/accounts/${selectedEntity.id}/decisions`, {
        actionType: selectedEntity.actionType,
        ...payload
      });
      
      setIsModalOpen(false);
      fetchQueue();
    } catch (err) {
      alert('Failed to submit decision. Conflict or network error occurred.');
      console.error(err);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>;
      case 'SUSPENDED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">SUSPENDED</span>;
      case 'UNVERIFIED':
      case 'PENDING_REVIEW':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">{status}</span>;
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

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-lg">
        <div className="flex gap-2">
          {['ALL', 'VERIFIED', 'UNVERIFIED', 'SUSPENDED'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs rounded border transition ${
                statusFilter === f 
                  ? 'bg-purple-600 border-purple-500 text-white' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search Entity ID, Name, GSTIN..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
          />
        </div>
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
            No accounts found matching your criteria.
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
                  <td className="py-3 px-4 font-mono text-slate-400">{acc.contactMasked || '-'}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{acc.gstin || '-'}</td>
                  <td className="py-3 px-4">
                    {renderStatusBadge(acc.verificationStatus)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedEntity(acc);
                        setIsDetailsModalOpen(true);
                      }}
                      className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>

                    {acc.verificationStatus !== 'VERIFIED' && acc.verificationStatus !== 'SUSPENDED' && (
                      <PermissionGate permission="accounts:verify">
                        <button 
                          onClick={() => handleAction(acc, 'VERIFY')}
                          className="px-2.5 py-1 text-[11px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-600/30 transition"
                        >
                          Verify
                        </button>
                      </PermissionGate>
                    )}

                    {acc.verificationStatus === 'VERIFIED' && (
                      <PermissionGate permission="accounts:verify">
                        <button 
                          onClick={() => handleAction(acc, 'UNVERIFY')}
                          className="px-2.5 py-1 text-[11px] bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-600/30 transition"
                        >
                          Unverify
                        </button>
                      </PermissionGate>
                    )}

                    {acc.verificationStatus === 'SUSPENDED' ? (
                      <PermissionGate permission="accounts:suspend">
                        <button 
                          onClick={() => handleAction(acc, 'REACTIVATE')}
                          className="px-2.5 py-1 text-[11px] bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/30 transition inline-flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3 h-3" /> Reactivate
                        </button>
                      </PermissionGate>
                    ) : (
                      <PermissionGate permission="accounts:suspend">
                        <button 
                          onClick={() => handleAction(acc, 'SUSPEND')}
                          className="px-2.5 py-1 text-[11px] bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded hover:bg-rose-600/30 transition inline-flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" /> Suspend
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

      {isModalOpen && selectedEntity && (
        <AuditModal
          isOpen={isModalOpen}
          title={`${selectedEntity.actionType.charAt(0) + selectedEntity.actionType.slice(1).toLowerCase()} Account`}
          targetEntity={selectedEntity.id}
          requiresSuperAdmin={selectedEntity.actionType === 'SUSPEND'}
          onConfirm={handleAuditSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {/* Account Details Modal */}
      {isDetailsModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="text-sm font-semibold text-slate-200">Account Details: {selectedEntity.id}</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-500 hover:text-slate-300">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Business Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-400">Name:</span> <span className="text-slate-200">{selectedEntity.businessName}</span></p>
                    <p><span className="text-slate-400">Type:</span> <span className="text-slate-200">{selectedEntity.type}</span></p>
                    <p><span className="text-slate-400">Reg No:</span> <span className="font-mono text-slate-300">{selectedEntity.registrationNumber || 'N/A'}</span></p>
                    <p><span className="text-slate-400">GSTIN:</span> <span className="font-mono text-slate-300">{selectedEntity.gstin || 'N/A'}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact & Status</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-400">Email:</span> <span className="text-slate-200">{selectedEntity.email || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Phone:</span> <span className="font-mono text-slate-300">{selectedEntity.contactNumber || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Verification:</span> {renderStatusBadge(selectedEntity.verificationStatus)}</p>
                    <p><span className="text-slate-400">Fleet Docs:</span> <span className="text-slate-300">{selectedEntity.fleetDocsStatus || 'N/A'}</span></p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Registered Address</h4>
                <p className="text-sm text-slate-300 p-3 bg-slate-950 border border-slate-800 rounded">
                  {selectedEntity.address || 'No address provided.'}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-200 text-sm rounded hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
