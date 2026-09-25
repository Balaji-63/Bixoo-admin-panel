import React, { useState } from 'react';
import { PackageCheck, ShieldAlert, Truck } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { StepUpGuard } from '../components/common/StepUpGuard';
import { AuditModal } from '../components/common/AuditModal';

export const OrdersView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 'ORD-8801',
      buyerId: 'USR-1022',
      sellerId: 'USR-8821',
      sourceType: 'OFFER',
      sourceRef: 'OFF-110',
      agreedQty: '2500 KG',
      totalValue: '₹212,500',
      logisticsLinked: 'TRIP-4901',
      status: 'LOGISTICS_PENDING',
    },
    {
      id: 'ORD-8991',
      buyerId: 'USR-3301',
      sellerId: 'USR-8821',
      sourceType: 'AUCTION',
      sourceRef: 'AUC-1099',
      agreedQty: '500 MT',
      totalValue: '₹12,500,000',
      logisticsLinked: null,
      status: 'FULFILLED',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Product Orders & Fulfillment</h1>
          <p className="text-xs text-slate-400">Track final order execution linked securely to either an offer or winning auction bid[cite: 1].</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Source Origin</th>
              <th className="py-3 px-4">Buyer / Seller</th>
              <th className="py-3 px-4">Agreed Terms</th>
              <th className="py-3 px-4">Logistics Link</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 text-right">Overrides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono text-emerald-400 font-medium">{order.id}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500">{order.sourceType}</span>
                    <span className="font-mono text-blue-400">{order.sourceRef}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  {order.buyerId} <span className="text-slate-600">↔</span> {order.sellerId}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono">{order.agreedQty}</span>
                    <span className="font-mono text-slate-400">{order.totalValue}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {order.logisticsLinked ? (
                    <span className="inline-flex items-center gap-1 font-mono text-emerald-500">
                      <Truck className="w-3 h-3" /> {order.logisticsLinked}
                    </span>
                  ) : (
                    <span className="text-slate-600 font-mono">None</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    order.status === 'FULFILLED' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <PermissionGate permission="orders:override">
                    <StepUpGuard actionName={`OVERRIDE_ORDER_${order.id}`} onVerified={() => {
                      setSelectedOrder(order);
                      setModalOpen(true);
                    }}>
                      <button className="px-2 py-1 text-[11px] bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-600/30 transition inline-flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Override
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
        title="Admin Override: Modify Order State"
        targetEntity={selectedOrder?.id}
        requiresSuperAdmin={true}
        onConfirm={(payload) => {
          console.log('Order overridden:', { orderId: selectedOrder?.id, ...payload });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};