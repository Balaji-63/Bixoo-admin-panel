import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle, Clock, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';
import { AuditModal } from '../components/common/AuditModal';
import { apiClient } from '../api/client';

export const TripsTrackingView = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/admin/trips');
      setTrips(res.data.trips || []);
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAuditSubmit = async (payload) => {
    try {
      await apiClient.post(`/api/v1/admin/trips/${selectedTrip.tripId}/intervention`, {
        actionType: 'FORCE_INTERVENTION',
        ...payload
      });
      setModalOpen(false);
      fetchTrips(); // Refresh the list
    } catch (err) {
      alert('Failed to submit intervention request.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Live Logistics & Trip Milestones</h1>
          <p className="text-xs text-slate-400">Enforce append-only milestone validation, GPS latency alerts, and ePOD sign-offs.</p>
        </div>
        <button onClick={fetchTrips} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 hover:bg-slate-700 transition">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-900 border border-slate-800 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
            <p className="text-sm font-medium">Loading trips...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-400 bg-slate-900 border border-slate-800 rounded-lg">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm bg-slate-900 border border-slate-800 rounded-lg">
            No active trips found.
          </div>
        ) : (
          trips.map((trip) => (
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

                  {trip.currentMilestone !== 'DELIVERED' && trip.currentMilestone !== 'INTERVENTION_REQUIRED' && (
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
                  )}
                  {trip.currentMilestone === 'INTERVENTION_REQUIRED' && (
                     <span className="px-3 py-1 text-[11px] bg-rose-900 text-rose-300 rounded border border-rose-700 font-mono flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> ESCALATED
                     </span>
                  )}
                </div>
              </div>

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
          ))
        )}
      </div>

      {modalOpen && selectedTrip && (
        <AuditModal
          isOpen={modalOpen}
          title="Override Trip / Force Load Reassignment"
          targetEntity={selectedTrip.tripId}
          requiresSuperAdmin={true}
          onConfirm={handleAuditSubmit}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
