import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';

export const TripsTrackingView = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const trips = [
    {
      tripId: 'TRIP-4901',
      orderId: 'ORD-8802',
      transporter: 'Veloce Fleet (TN-04-AB-4029)',
      route: 'Coimbatore Hub → Chennai Port',
      currentMilestone: 'IN_TRANSIT',
      gpsLastSeen: '2 mins ago',
      isGpsStale: false,
      consigneeProofSubmitted: false,
    },
    {
      tripId: 'TRIP-4899',
      orderId: 'ORD-8790',
      transporter: 'Kaveri Logistics (KA-01-CD-8910)',
      route: 'Salem Depot → Bengaluru Central',
      currentMilestone: 'DELIVERED',
      gpsLastSeen: '45 mins ago',
      isGpsStale: true,
      consigneeProofSubmitted: true,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Live Logistics & Trip Milestones</h1>
          <p className="text-xs text-slate-400">Enforce append-only milestone validation, GPS latency alerts, and ePOD sign-offs[cite: 1].</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {trips.map((trip) => (
          <div key={trip.tripId} className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-emerald-400">{trip.tripId}</span>
                  <span className="text-xs text-slate-500 font-mono">Linked: {trip.orderId}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">{trip.transporter}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {trip.route}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">GPS Last Heartbeat</span>
                  <span className={`text-xs font-mono font-medium ${trip.isGpsStale ? 'text-rose-400' : 'text-slate-300'}`}>
                    {trip.gpsLastSeen}
                  </span>
                </div>

                <PermissionGate permission="trips:reassign">
                  <button
                    onClick={() => {
                      setSelectedTrip(trip);
                      setModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs rounded hover:bg-rose-600/30 transition flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Force Intervention
                  </button>
                </PermissionGate>
              </div>
            </div>

            {/* Linear Milestone Stepper */}
            <div className="grid grid-cols-5 gap-2 mt-4 pt-1">
              {['REQUESTED', 'ACCEPTED', 'PICKUP', 'IN_TRANSIT', 'DELIVERED'].map((step, idx) => {
                const isCurrent = trip.currentMilestone === step;
                return (
                  <div 
                    key={step} 
                    className={`p-2 rounded border text-center transition ${
                      isCurrent 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <p className="text-[10px] font-mono tracking-wider">{idx + 1}. {step}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AuditModal
        isOpen={modalOpen}
        title="Override Trip / Force Load Reassignment"
        targetEntity={selectedTrip?.tripId}
        requiresSuperAdmin={true}
        onConfirm={(payload) => {
          console.log('Trip override audited:', { tripId: selectedTrip?.tripId, ...payload });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};