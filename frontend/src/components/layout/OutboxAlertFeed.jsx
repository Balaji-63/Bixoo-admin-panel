// src/components/layout/OutboxAlertFeed.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';
import { notificationsActions } from '../../store/slices/notificationsSlice';

export const OutboxAlertFeed = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, unreadCount, connected } = useSelector((state) => state.notifications);

  const getIcon = (level) => {
    switch(level) {
      case 'CRITICAL': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (unreadCount > 0) dispatch(notificationsActions.markAllRead());
        }}
        className="relative p-2 text-slate-400 hover:text-slate-200 transition bg-slate-900 rounded-full border border-slate-800"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
            <h3 className="text-xs font-semibold text-slate-200">System Outbox Events</h3>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {connected ? 'LIVE' : 'DISCONNECTED'}
            </span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500 italic">No recent system events.</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 hover:bg-slate-800/30 transition flex gap-3 group">
                    <div className="mt-0.5 shrink-0">
                      {getIcon(alert.level)}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-300 leading-relaxed">{alert.message}</p>
                      <p className="text-[9px] text-slate-500 mt-1 font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => dispatch(notificationsActions.clearAlert({ id: alert.id }))}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};