import React, { useState } from 'react';
import { ShieldAlert, Key } from 'lucide-react';

export const StepUpGuard = ({ children, onVerified, actionName }) => {
  const [isPrompting, setIsPrompting] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    // Simulate server-side TOTP validation (000000 is the hardcoded test pin)
    if (code === '000000') { 
      setIsPrompting(false);
      setCode('');
      onVerified();
    } else {
      setError('Invalid authenticator code.');
    }
  };

  if (!isPrompting) {
    // Intercept click event of the wrapped button
    return React.cloneElement(children, {
      onClick: (e) => {
        e.preventDefault();
        setIsPrompting(true);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-lg max-w-sm w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-rose-600" />
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Step-Up Authentication</h3>
          <p className="text-xs text-slate-400 mt-1">
            Elevated privileges required for: <span className="font-mono text-slate-300">{actionName}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="000000"
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-center tracking-[0.5em] text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            {error && <p className="text-[10px] text-rose-400 mt-1.5">{error}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsPrompting(false);
                setCode('');
              }}
              className="flex-1 py-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={code.length !== 6}
              className="flex-1 py-2 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};