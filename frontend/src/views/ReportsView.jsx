import React, { useState } from 'react';
import { Download, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { PermissionGate } from '../context/AuthContext';

export const ReportsView = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (reportName) => {
    setIsExporting(true);
    // Simulate API export generation delay
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Exported ${reportName} successfully.`);
    }, 1500);
  };

  const reports = [
    {
      id: 'REP-01',
      title: 'Settlement Reconciliation Ledger',
      description: 'Daily export of all pending, reconciled, and settled wallet entries[cite: 1].',
      lastRun: '2026-09-24 23:59:00',
      format: 'CSV'
    },
    {
      id: 'REP-02',
      title: 'Dispute & SLA Breach Report',
      description: 'Audit of cases exceeding 24h SLA and manual admin interventions.',
      lastRun: '2026-09-25 08:00:00',
      format: 'XLSX'
    },
    {
      id: 'REP-03',
      title: 'Partial Fulfillment & Orphaned Demand',
      description: 'Tracks requirements closed with remaining unsatisfied quantities[cite: 1].',
      lastRun: '2026-09-22 18:00:00',
      format: 'CSV'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Operational Reports & Exports</h1>
          <p className="text-xs text-slate-400">Generate filtered data dumps for financial reconciliation and audit tracing[cite: 1].</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-slate-950 border border-slate-800 rounded">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {report.format}
              </span>
            </div>
            
            <h3 className="text-sm font-semibold text-slate-200 mb-1">{report.title}</h3>
            <p className="text-xs text-slate-400 flex-1 mb-4">{report.description}</p>
            
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between mt-auto">
              <div className="text-[10px] text-slate-500 font-mono">
                Last Run: <br/>{report.lastRun}
              </div>
              <button 
                onClick={() => handleExport(report.id)}
                disabled={isExporting}
                className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded text-xs hover:bg-blue-600/30 transition inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {isExporting ? 'Processing...' : <><Download className="w-3.5 h-3.5" /> Export</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};