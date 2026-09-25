import React, { useState } from 'react';
import { Settings, Shield, Server, FileText, Lock } from 'lucide-react';

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('AUDIT_LOGS');

  const auditEvents = [
    {
      id: 'EVT-9092',
      timestamp: '2026-09-25T14:45:00Z',
      actor: 'ADM-9021',
      action: 'VOID_AUCTION',
      target: 'AUC-1099',
      reason: 'POLICY_VIOLATION: Suspicious bidding pattern detected.',
      ip: '192.168.1.104',
      caseRef: 'CAS-6992',
    },
    {
      id: 'EVT-9091',
      timestamp: '2026-09-25T13:12:30Z',
      actor: 'ADM-8804',
      action: 'RECONCILE_SETTLEMENT',
      target: 'SET-9901',
      reason: 'PAYOUT_RECONCILIATION: Manual adjustment for missing toll fee.',
      ip: '10.0.0.45',
      caseRef: 'N/A',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            Governance & Audit Controls
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure automated policies and review immutable intervention logs[cite: 1].</p>
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
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-6 min-h-[500px]">
          {activeTab === 'AUDIT_LOGS' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">System Intervention Audit Trail</h2>
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
                        <td className="py-3 font-mono text-purple-400">{evt.actor}</td>
                        <td className="py-3">
                          <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[9px]">{evt.action}</span>
                        </td>
                        <td className="py-3 font-mono text-emerald-400">{evt.target}</td>
                        <td className="py-3 font-mono text-slate-500">{evt.ip}</td>
                        <td className="py-3">
                          <p className="text-slate-300">{evt.reason}</p>
                          {evt.caseRef !== 'N/A' && (
                            <span className="text-[9px] font-mono text-slate-500 block mt-0.5">Ref: {evt.caseRef}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        </div>
      </div>
    </div>
  );
};