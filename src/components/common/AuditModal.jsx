import React, { useState } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';

export const AuditModal = ({ isOpen, title, targetEntity, onConfirm, onCancel, requiresSuperAdmin = false }) => {
  const [reasonCode, setReasonCode] = useState('POLICY_VIOLATION');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    onConfirm({ reasonCode, notes, timestamp: new Date().toISOString() });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded ${requiresSuperAdmin ? 'bg-purple-500/10 text-purple-400' : 'bg-amber-500/10 text-amber-400'}`}>
            {requiresSuperAdmin ? <Lock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400">Target ID: <span className="font-mono text-slate-200">{targetEntity}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Reason Code</label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="POLICY_VIOLATION">Policy Non-Compliance</option>
              <option value="SUSPICIOUS_KYC">Document Discrepancy / Fake Identity</option>
              <option value="DISPUTE_ESCALATION">Manual Intervention via Arbitration</option>
              <option value="PAYOUT_RECONCILIATION">Settlement Adjustment & Reconciliation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Explanation (Logged to Audit Table)</label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State precise reason for this administrative intervention..."
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded border border-slate-800 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !notes.trim()}
              className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Intervention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};