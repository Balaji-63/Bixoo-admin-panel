import React from 'react';
import { Users, Truck, AlertTriangle, DollarSign, Activity } from 'lucide-react';

const MetricCard = ({ title, count, icon: Icon, alert, trend }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-start justify-between relative overflow-hidden">
    {alert && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />}
    <div>
      <p className="text-xs font-medium text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-100 font-mono">{count}</h3>
      {trend && <p className="text-[10px] text-slate-500 mt-2">{trend}</p>}
    </div>
    <div className={`p-3 rounded-lg ${alert ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

export const DashboardView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">Operations Overview</h1>
        <p className="text-xs text-slate-400">Unified KPIs, backlogs, and real-time operational alerts[cite: 1].</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Verification Backlog" 
          count="14" 
          icon={Users} 
          trend="Accounts pending approval"
        />
        <MetricCard 
          title="Overdue Trips / Missing Proof" 
          count="3" 
          icon={Truck} 
          alert={true} 
          trend="Action required per SLA"
        />
        <MetricCard 
          title="Pending Settlements Ledger" 
          count="₹4.2M" 
          icon={DollarSign} 
          trend="Ready for reconciliation"
        />
        <MetricCard 
          title="Open Dispute Cases" 
          count="7" 
          icon={AlertTriangle} 
          alert={true} 
          trend="2 escalated to Super Admin"
        />
      </div>

      {/* Secondary Dashboard Row: Actionable Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">System Metrics & Lag Watch</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Matching Engine Lag</span>
              <span className="font-mono text-emerald-400">45ms</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Auction Close Failures (24h)</span>
              <span className="font-mono text-slate-300">0</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Pending Settlement Age</span>
              <span className="font-mono text-amber-400">&lt; 12 hours</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
           <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-200">Recent Admin Overrides</h3>
          </div>
          <div className="space-y-3">
             <div className="text-[11px] bg-slate-950 p-2 border border-slate-800 rounded flex justify-between">
               <span className="text-slate-300">Voided Auction <span className="font-mono text-emerald-400">AUC-1044</span></span>
               <span className="text-slate-500 font-mono">10m ago (Admin: OPS-90)</span>
             </div>
             <div className="text-[11px] bg-slate-950 p-2 border border-slate-800 rounded flex justify-between">
               <span className="text-slate-300">Suspended Entity <span className="font-mono text-emerald-400">USR-8199</span></span>
               <span className="text-slate-500 font-mono">1h ago (Admin: OPS-90)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};