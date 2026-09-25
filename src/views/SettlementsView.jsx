import React, { useState } from 'react';
import { DollarSign, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';

export const SettlementsView = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const settlements = [
    {
      id: 'SET-9901',
      tripRef: 'TRIP-4899',
      payee: 'Kaveri Logistics Fleet',
      amount: '₹42,500.00',
      proofStatus: 'EPOD_VERIFIED',
      settlementStatus: 'SETTLEMENT_DUE',
      bankRefMasked: 'HDFC••••••9104',
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">Financial Settlements Ledger</h1>
        <p className="text-xs text-slate-400">Reconcile completed trips against verified proof of delivery before triggering wallet credit[cite: 1].</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
            <tr>
              <th className="py-3 px-4">Settlement Ref</th>
              <th className="py-3 px-4">Trip Link</th>
              <th className="py-3 px-4">Payee</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Gate Proof Status</th>
              <th className="py-3 px-4">Payout Account</th>
              <th className="py-3 px-4">Ledger Status</th>
              <th className="py-3 px-4 text-right">Approval Gate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {settlements.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-mono text-emerald-400">{item.id}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{item.tripRef}</td>
                <td className="py-3 px-4 font-medium text-slate-200">{item.payee}</td>
                <td className="py-3 px-4 font-mono font-semibold text-slate-100">{item.amount}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.proofStatus}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{item.bankRefMasked}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {item.settlementStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <PermissionGate 
                    permission="settlements:reconcile" 
                    fallback={
                      <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1 font-mono">
                        <Lock className="w-3 h-3" /> Super Admin Only
                      </span>
                    }
                  >
                    <button
                      onClick={() => {
                        setActiveItem(item);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition"
                    >
                      Authorize Payout
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
        title="Authorize Payout Disbursement"
        targetEntity={activeItem?.id}
        requiresSuperAdmin={true}
        onConfirm={(payload) => {
          console.log('Payout authorized with idempotency check:', { settlementId: activeItem?.id, ...payload });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};