import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'accounts:verify',
    'catalog:review',
    'requirements:review',
    'trips:view',
    'cases:triage',
  ],
  [ROLES.SUPER_ADMIN]: [
    'accounts:verify',
    'accounts:suspend',
    'catalog:review',
    'catalog:override',
    'requirements:review',
    'requirements:override',
    'auctions:void',
    'orders:override',
    'trips:view',
    'trips:reassign',
    'settlements:reconcile',
    'comms:inspect',
    'settings:manage',
  ],
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('admin_jwt');
      if (!token) {
        setIsAuthLoading(false);
        return;
      }
      try {
        const response = await apiClient.get('/api/v1/auth/me');
        setCurrentUser(response.data);
      } catch (err) {
        console.error('Session restore failed', err);
        localStorage.removeItem('admin_jwt');
      } finally {
        setIsAuthLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(permission);
  };

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('admin_jwt');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthLoading, hasPermission, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const PermissionGate = ({ permission, fallback = null, children }) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
};