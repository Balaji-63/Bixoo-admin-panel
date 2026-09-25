import React, { useState } from 'react';
import { 
  Users, Package, TrendingUp, Truck, DollarSign, 
  AlertTriangle, Settings, ShieldAlert, ChevronRight, LogOut 
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export const AdminLayout = ({ children, currentPath = '/admin/overview' }) => {
  const { currentUser, switchRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/admin/overview', icon: TrendingUp, role: ROLES.ADMIN },
    { name: 'Accounts & KYC', href: '/admin/accounts', icon: Users, role: ROLES.ADMIN },
    { name: 'Requirements & Offers', href: '/admin/requirements', icon: Package, role: ROLES.ADMIN },
    { name: 'Logistics & Trips', href: '/admin/trips', icon: Truck, role: ROLES.ADMIN },
    { name: 'Settlements', href: '/admin/settlements', icon: DollarSign, role: ROLES.ADMIN },
    { name: 'Disputes & Cases', href: '/admin/cases', icon: AlertTriangle, role: ROLES.ADMIN },
    { name: 'Governance & Settings', href: '/admin/settings', icon: Settings, role: ROLES.SUPER_ADMIN },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <div className="h-8 w-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold tracking-wider">
              BX
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wide block">BIXOO OPS</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">Unified Admin Console</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navigation
              // Hides SUPER_ADMIN links if the current user is only a standard ADMIN
              .filter(item => item.role === ROLES.ADMIN || currentUser.role === ROLES.SUPER_ADMIN)
              .map((item) => {
                const isSuperOnly = item.role === ROLES.SUPER_ADMIN;
                const isCurrent = currentPath === item.href;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isCurrent 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {isSuperOnly && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono font-medium">
                        SUPER
                      </span>
                    )}
                  </a>
                );
            })}
          </nav>
        </div>

        {/* User Badge & Dev Role Switcher */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <p className="text-xs font-medium text-slate-200">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">{currentUser.id}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
              currentUser.role === ROLES.SUPER_ADMIN 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {currentUser.role}
            </span>
          </div>

          <button
            onClick={() => switchRole(currentUser.role === ROLES.SUPER_ADMIN ? ROLES.ADMIN : ROLES.SUPER_ADMIN)}
            className="w-full text-center text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded transition font-mono border border-slate-700"
          >
            Switch to {currentUser.role === ROLES.SUPER_ADMIN ? 'Standard Admin' : 'Super Admin'}
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-900/30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 capitalize font-medium">{currentPath.split('/')[2] || 'Console'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Event Stream Connected
            </span>
          </div>
        </header>

        <section className="p-8">
          {children}
        </section>
      </main>
    </div>
  );
};