import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';

// View Imports
import { DashboardView } from '../views/DashboardView';
import { AccountsView } from '../views/AccountsView';
import { RequirementsView } from '../views/RequirementsView';
import { AuctionsView } from '../views/AuctionsView';
import { TripsTrackingView } from '../views/TripsTrackingView';
import { SettlementsView } from '../views/SettlementsView';
import { CasesView } from '../views/CasesView';
import { SettingsView } from '../views/SettingsView';

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && currentUser.role !== ROLES.SUPER_ADMIN) {
    return <Navigate to="/admin/overview" replace />;
  }

  return children;
};

const RouteWrapper = ({ children, requireSuperAdmin = false }) => {
  const location = useLocation();
  return (
    <ProtectedRoute requireSuperAdmin={requireSuperAdmin}>
      <AdminLayout currentPath={location.pathname}>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/overview" replace />} />
        
        {/* Standard Admin Routes */}
        <Route path="/admin/overview" element={<RouteWrapper><DashboardView /></RouteWrapper>} />
        <Route path="/admin/accounts" element={<RouteWrapper><AccountsView /></RouteWrapper>} />
        <Route path="/admin/requirements" element={<RouteWrapper><RequirementsView /></RouteWrapper>} />
        <Route path="/admin/auctions" element={<RouteWrapper><AuctionsView /></RouteWrapper>} />
        <Route path="/admin/trips" element={<RouteWrapper><TripsTrackingView /></RouteWrapper>} />
        <Route path="/admin/settlements" element={<RouteWrapper><SettlementsView /></RouteWrapper>} />
        <Route path="/admin/cases" element={<RouteWrapper><CasesView /></RouteWrapper>} />
        
        {/* Super Admin Restricted Routes */}
        <Route 
          path="/admin/settings" 
          element={
            <RouteWrapper requireSuperAdmin={true}>
              <SettingsView />
            </RouteWrapper>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
};