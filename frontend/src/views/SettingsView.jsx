import React, { useState, useEffect } from 'react';
import { Settings, Shield, Server, FileText, Lock, Loader2, AlertCircle, Activity, Webhook, Database } from 'lucide-react';
import { apiClient } from '../api/client';

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('AUDIT_LOGS');
  
  const [auditEvents, setAuditEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuditLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/admin/settings/audit-logs');
      setAuditEvents(res.data.logs || []);
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'AUDIT_LOGS') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            Governance & Audit Controls
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure automated policies and review immutable intervention logs.</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 space-y-1">
          {[
            { id: 'AUDIT_LOGS', label: 'Immutable Audit Log', icon: FileText },
            { id: 'POLICIES', label: 'Governed Policies', icon: Shield },
            { id: 'THRESHOLDS', label: 'Financial Thresholds', icon: Settings },
            { id: 'SYSTEM', label: 'System Integration', icon: Server },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-6 min-h-[500px]">
          {activeTab === 'AUDIT_LOGS' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-slate-200">System Intervention Audit Trail</h2>
                <button onClick={fetchAuditLogs} className="px-3 py-1 bg-slate-800 text-xs rounded border border-slate-700 text-slate-300">Refresh</button>
              </div>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
                  <p className="text-sm font-medium">Loading audit logs...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-rose-400">
                  <AlertCircle className="w-8 h-8 mb-3" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              ) : auditEvents.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                  No audit logs found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="pb-2 font-medium">Timestamp</th>
                        <th className="pb-2 font-medium">Actor ID</th>
                        <th className="pb-2 font-medium">Action</th>
                        <th className="pb-2 font-medium">Target Entity</th>
                        <th className="pb-2 font-medium">IP Address</th>
                        <th className="pb-2 font-medium">Reason & Case Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300">
                      {auditEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-slate-950/50">
                          <td className="py-3 font-mono text-slate-500">{new Date(evt.timestamp).toLocaleString()}</td>
                          <td className="py-3 font-mono text-purple-400">{evt.actorId}</td>
                          <td className="py-3">
                            <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[9px]">{evt.action}</span>
                          </td>
                          <td className="py-3 font-mono text-emerald-400">{evt.targetId}</td>
                          <td className="py-3 font-mono text-slate-500">{evt.ipAddress || '127.0.0.1'}</td>
                          <td className="py-3">
                            <p className="text-slate-300">{evt.reasonCode}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'POLICIES' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Configured Open Policies</h2>
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex justify-between items-center p-3 border border-slate-800 rounded bg-slate-950">
                  <span>Document Verification Expiry (Days)</span>
                  <input type="number" defaultValue={365} className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-800 rounded bg-slate-950">
                  <span>GPS Last-Seen Latency Alert Threshold (Minutes)</span>
                  <input type="number" defaultValue={15} className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-800 rounded bg-slate-950">
                  <span>Auto-close Requirements on Partial Fulfillment</span>
                  <select className="bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono focus:outline-none focus:border-purple-500">
                    <option value="false">Disabled (Keep Open)</option>
                    <option value="true">Enabled (Close)</option>
                  </select>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs transition">
                Save Policy Configuration
              </button>
            </div>
          )}

          {activeTab === 'THRESHOLDS' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Financial Limits & Triggers</h2>
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex justify-between items-center p-3 border border-slate-800 rounded bg-slate-950">
                  <span>Maximum Automated Escrow Clearance (₹)</span>
                  <input type="text" defaultValue="5,00,000" className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-800 rounded bg-slate-950">
                  <span>Standard Escrow Holding Period (Hours)</span>
                  <input type="number" defaultValue={48} className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-800 rounded bg-slate-950">
                  <span>Super Admin Required Over (₹)</span>
                  <input type="text" defaultValue="10,00,000" className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs transition">
                Apply Thresholds
              </button>
            </div>
          )}

          {activeTab === 'SYSTEM' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">API Webhooks & Integration Status</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-800 rounded bg-slate-950 flex items-start gap-3">
                  <Webhook className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">Banking Gateway API</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Status: <span className="text-emerald-400 font-mono">CONNECTED</span></p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Last Sync: Just now</p>
                  </div>
                </div>
                
                <div className="p-4 border border-slate-800 rounded bg-slate-950 flex items-start gap-3">
                  <Activity className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">Matching Engine Microservice</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Status: <span className="text-emerald-400 font-mono">HEALTHY</span></p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Latency: 45ms</p>
                  </div>
                </div>

                <div className="p-4 border border-slate-800 rounded bg-slate-950 flex items-start gap-3">
                  <Database className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">ERP Sync Adapter</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Status: <span className="text-amber-400 font-mono">WARNING</span></p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Last Sync: 4 hours ago (Failed)</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs transition">
                  Run Diagnostic Ping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
