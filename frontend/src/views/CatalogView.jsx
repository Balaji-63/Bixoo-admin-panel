import React, { useState } from 'react';
import { Layers, AlertTriangle, PauseCircle, PlayCircle, EyeOff } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';

export const CatalogView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const listings = [
    {
      id: 'LST-3021',
      sellerId: 'USR-8821',
      category: 'Agricultural Produce / Grains',
      productName: 'Premium Basmati Rice (1000 MT)',
      unitPrice: '₹85.00 / KG',
      status: 'PUBLISHED',
      flagged: false,
    },
    {
      id: 'LST-3099',
      sellerId: 'USR-7011',
      category: 'Industrial / Raw Materials',
      productName: 'Unverified Grade Copper Wire',
      unitPrice: '₹750.00 / KG',
      status: 'FLAGGED',
      flagged: true,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Catalog & Listing Oversight</h1>
          <p className="text-xs text-slate-400">Moderate product taxonomy, review flagged inventory, and enforce catalog guidelines.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
            <tr>
              <th className="py-3 px-4">Listing ID</th>
              <th className="py-3 px-4">Seller ID</th>
              <th className="py-3 px-4">Taxonomy Category</th>
              <th className="py-3 px-4">Product Description</th>
              <th className="py-3 px-4">Listed Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {listings.map((item) => (
              <tr key={item.id} className={`hover:bg-slate-800/30 transition-colors ${item.flagged ? 'bg-amber-950/10' : ''}`}>
                <td className="py-3 px-4 font-mono text-emerald-400">{item.id}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{item.sellerId}</td>
                <td className="py-3 px-4 text-slate-300">{item.category}</td>
                <td className="py-3 px-4 font-medium text-slate-200">{item.productName}</td>
                <td className="py-3 px-4 font-mono">{item.unitPrice}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    item.status === 'PUBLISHED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <PermissionGate permission="catalog:review">
                    {item.status === 'PUBLISHED' ? (
                      <button 
                        onClick={() => { setSelectedListing({ ...item, action: 'PAUSE' }); setModalOpen(true); }}
                        className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition inline-flex items-center gap-1"
                      >
                        <PauseCircle className="w-3 h-3" /> Hide
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setSelectedListing({ ...item, action: 'RESTORE' }); setModalOpen(true); }}
                        className="px-2 py-1 text-[11px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-600/30 transition inline-flex items-center gap-1"
                      >
                        <PlayCircle className="w-3 h-3" /> Restore
                      </button>
                    )}
                  </PermissionGate>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AuditModal
        isOpen={modalOpen}
        title={selectedListing?.action === 'PAUSE' ? 'Hide / Pause Listing' : 'Restore Listing'}
        targetEntity={selectedListing?.id}
        requiresSuperAdmin={false}
        onConfirm={(payload) => {
          console.log('Moderation action logged:', { listingId: selectedListing?.id, ...payload });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};