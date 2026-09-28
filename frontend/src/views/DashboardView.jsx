import React, { useState, useEffect } from 'react';
import { Users, Truck, AlertTriangle, DollarSign, Activity, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiClient } from '../api/client';

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

const TimeAgo = ({ dateString }) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 1000 / 60);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export const DashboardView = () => {
  const [metrics, setMetrics] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [dateFilter, setDateFilter] = useState('14D');

  const fetchDashboardData = () => {
    apiClient.get('/api/v1/admin/dashboard/metrics')
      .then(res => setMetrics(res.data))
      .catch(console.error);
      
    apiClient.get('/api/v1/admin/dashboard/buyer-seller-growth')
      .then(res => setGrowthData(res.data.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchDashboardData();
    // Simulate real-time event stream hook
    const interval = setInterval(fetchDashboardData, 30000); 
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return (
    <div className="flex flex-col items-center justify-center h-96 text-slate-500">
      <Activity className="w-8 h-8 animate-pulse mb-3 text-emerald-500" />
      <p className="text-sm font-medium">Aggregating real-time telemetry...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
             <Activity className="w-5 h-5 text-emerald-400" />
             Operations Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">Unified KPIs, backlogs, and database-driven telemetry.</p>
        </div>
        <div className="flex gap-2">
            {['7D', '14D', '30D'].map(f => (
                <button 
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`px-3 py-1.5 text-xs rounded border transition ${dateFilter === f ? 'bg-slate-700 text-slate-100 border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* KPI Row 1: Operational Backlogs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Verification Backlog" 
          count={metrics.verification_backlog} 
          icon={Users} 
          trend="Accounts pending approval"
        />
        <MetricCard 
          title="Overdue Trips / Missing Proof" 
          count={metrics.overdue_trips} 
          icon={Truck} 
          alert={metrics.overdue_trips > 0} 
          trend="Action required per SLA"
        />
        <MetricCard 
          title="Pending Settlements Ledger" 
          count={metrics.pending_settlements_value} 
          icon={DollarSign} 
          trend="Ready for reconciliation"
        />
        <MetricCard 
          title="Open Dispute Cases" 
          count={metrics.open_disputes} 
          icon={AlertTriangle} 
          alert={metrics.open_disputes > 0} 
          trend="Escalated tickets"
        />
      </div>

      {/* KPI Row 2: Secondary Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4">
           <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Total Buyers</p>
           <p className="text-xl font-bold font-mono text-emerald-400">{metrics.total_buyers}</p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4">
           <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Total Sellers</p>
           <p className="text-xl font-bold font-mono text-blue-400">{metrics.total_sellers}</p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4">
           <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Total Reqs</p>
           <p className="text-xl font-bold font-mono text-slate-200">{metrics.total_requirements}</p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4">
           <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Completed Trips</p>
           <p className="text-xl font-bold font-mono text-slate-200">{metrics.completed_trips}</p>
        </div>
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
            <div>
               <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Matching Engine</p>
               <p className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-2">
                 <Activity className="w-4 h-4" /> {metrics.matching_engine_lag}
               </p>
            </div>
            <div className="text-right">
               <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Auction Fails</p>
               <p className="text-xl font-bold font-mono text-slate-200">{metrics.auction_close_failures}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Buyer & Seller Network Growth
            </h3>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            {growthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" name="Buyers" dataKey="buyers" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Sellers" dataKey="sellers" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">No chart data available</div>
            )}
          </div>
        </div>

        {/* Audit / Overrides Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-full">
           <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">Recent Admin Overrides</h3>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
             {metrics.recent_overrides && metrics.recent_overrides.length > 0 ? (
                 metrics.recent_overrides.map((override, idx) => (
                    <div key={idx} className="text-[11px] bg-slate-950 p-2.5 border border-slate-800 rounded flex flex-col gap-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-slate-300 font-medium">{override.action.replace(/_/g, ' ')}</span>
                        <span className="text-slate-500 font-mono"><TimeAgo dateString={override.timestamp} /></span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-emerald-400 font-mono text-[10px]">{override.target}</span>
                         <span className="text-slate-400">Actor: {override.actor_id}</span>
                      </div>
                    </div>
                 ))
             ) : (
                 <div className="text-slate-500 text-xs text-center py-6">No recent overrides.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Lucide icon helper
function ShieldAlert(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}