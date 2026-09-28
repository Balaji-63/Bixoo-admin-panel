import React, { useState, useEffect } from 'react';
import { Gavel, Ban, PauseCircle, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { StepUpGuard } from '../components/common/StepUpGuard';
import { AuditModal } from '../components/common/AuditModal';
import { apiClient } from '../api/client';

export const AuctionsView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/admin/auctions');
      setAuctions(res.data.auctions || []);
    } catch (err) {
      setError('Failed to fetch auctions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleVoid = async (payload) => {
    try {
      await apiClient.post(`/api/v1/admin/auctions/${selectedAuction.lotId}/void`);
      setModalOpen(false);
      fetchAuctions();
    } catch (err) {
      alert('Failed to void auction');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Live Auctions & Lot Oversight</h1>
          <p className="text-xs text-slate-400">Monitor live bids, verify single-winner computation logic, and manage terminal void states.</p>
        </div>
        <button onClick={fetchAuctions} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 hover:bg-slate-700 transition">
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
            <p className="text-sm font-medium">Loading auctions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-400">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : auctions.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            No auctions found.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 px-4">Lot ID</th>
                <th className="py-3 px-4">Seller ID</th>
                <th className="py-3 px-4">Lot Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Winning Bid / Order</th>
                <th className="py-3 px-4 text-right">Integrity Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auctions.map((auction) => (
                <tr key={auction.lotId} className={`hover:bg-slate-800/30 ${auction.flagged ? 'bg-rose-950/10' : ''}`}>
                  <td className="py-3 px-4 font-mono text-emerald-400">{auction.lotId}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{auction.sellerId}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{auction.product}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      auction.status === 'CLOSED' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {auction.winnerComputed ? (
                      <div>
                        <p className="font-mono text-emerald-300">{auction.winningBid?.amount} ({auction.winningBid?.buyerId})</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">Order: {auction.linkedOrder}</p>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Computing...</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition">
                      View Bid Log
                    </button>
                    {auction.status !== 'VOIDED' && (
                      <PermissionGate permission="auctions:void">
                        <StepUpGuard actionName={`VOID_AUCTION_${auction.lotId}`} onVerified={() => {
                          setSelectedAuction(auction);
                          setModalOpen(true);
                        }}>
                          <button className="px-2 py-1 text-[11px] bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded hover:bg-rose-600/30 transition inline-flex items-center gap-1">
                            <Ban className="w-3 h-3" /> Void Lot
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

      {modalOpen && selectedAuction && (
        <AuditModal
          isOpen={modalOpen}
          title="Void Auction Terminal State"
          targetEntity={selectedAuction.lotId}
          requiresSuperAdmin={true}
          onConfirm={handleVoid}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
