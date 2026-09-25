import React, { useState } from 'react';
import { Gavel, Ban, PauseCircle, CheckCircle, Clock } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { StepUpGuard } from '../components/common/StepUpGuard';
import { AuditModal } from '../components/common/AuditModal';

export const AuctionsView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const auctions = [
    {
      lotId: 'AUC-1099',
      sellerId: 'USR-8821',
      product: '500 MT Wheat (Grade A)',
      status: 'CLOSED',
      winnerComputed: true,
      winningBid: { buyerId: 'USR-3301', amount: '₹12,500,000', timestamp: '2026-09-25T14:29:59Z' },
      linkedOrder: 'ORD-8991',
      flagged: false,
    },
    {
      lotId: 'AUC-1102',
      sellerId: 'USR-9044',
      product: '2000 Liters Sunflower Oil',
      status: 'LIVE',
      winnerComputed: false,
      winningBid: null,
      linkedOrder: null,
      flagged: true, // Requires admin intervention due to reported dispute
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Live Auctions & Lot Oversight</h1>
          <p className="text-xs text-slate-400">Monitor live bids, verify single-winner computation logic, and manage terminal void states.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
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
                      <p className="font-mono text-emerald-300">{auction.winningBid.amount} ({auction.winningBid.buyerId})</p>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AuditModal
        isOpen={modalOpen}
        title="Void Auction Terminal State"
        targetEntity={selectedAuction?.lotId}
        requiresSuperAdmin={true}
        onConfirm={(payload) => {
          console.log('Auction Voided:', { lotId: selectedAuction?.lotId, ...payload });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};