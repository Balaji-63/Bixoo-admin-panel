import React, { useState } from 'react';
import { GitPullRequest, Search, FileText, Ban } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';

export const OffersView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const offers = [
    {
      id: 'OFF-110',
      requirementId: 'REQ-5091',
      buyerId: 'USR-1022',
      sellerId: 'USR-8821',
      offeredQty: '2500 KG',
      latestPrice: '₹85.00 / KG',
      status: 'COUNTERED',
      historyCount: 3,
    },
    {
      id: 'OFF-112',
      requirementId: 'REQ-5091',
      buyerId: 'USR-1022',
      sellerId: 'USR-9044',
      offeredQty: '1000 KG',
      latestPrice: '₹82.50 / KG',
      status: 'ACCEPTED',
      historyCount: 1,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Offers & Deal Negotiations</h1>
          <p className="text-xs text-slate-400">Inspect immutable negotiation logs, partial quantity offers, and handle deal disputes[cite: 1].</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
            <tr>
              <th className="py-3 px-4">Offer Ref</th>
              <th className="py-3 px-4">Source Requirement</th>
              <th className="py-3 px-4">Buyer / Seller</th>
              <th className="py-3 px-4">Offered Quantity</th>
              <th className="py-3 px-4">Current Price</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono text-emerald-400">{offer.id}</td>
                <td className="py-3 px-4 font-mono text-blue-400">{offer.requirementId}</td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  {offer.buyerId} <span className="text-slate-600">↔</span> {offer.sellerId}
                </td>
                <td className="py-3 px-4 font-mono">{offer.offeredQty}</td>
                <td className="py-3 px-4 font-mono font-medium text-slate-200">{offer.latestPrice}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    offer.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {offer.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition inline-flex items-center gap-1">
                    <GitPullRequest className="w-3 h-3" /> Log ({offer.historyCount})
                  </button>
                  <PermissionGate permission="orders:override">
                     <button 
                        onClick={() => { setSelectedOffer(offer); setModalOpen(true); }}
                        className="px-2 py-1 text-[11px] bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded hover:bg-rose-600/30 transition inline-flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" /> Cancel
                      </button>
                  </PermissionGate>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AuditModal
        isOpen={modalOpen}
        title="Force Cancel Offer / Negotiation"
        targetEntity={selectedOffer?.id}
        requiresSuperAdmin={true}
        onConfirm={(payload) => {
          console.log('Offer cancelled via admin intervention:', { offerId: selectedOffer?.id, ...payload });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};