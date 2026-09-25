import React, { createContext, useContext, useState } from 'react';

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
  const [currentUser, setCurrentUser] = useState({
    id: 'ADM-9021',
    name: 'Ops Lead',
    role: ROLES.SUPER_ADMIN, // Toggleable for testing RBAC boundaries
  });

  const hasPermission = (permission) => {
    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(permission);
  };

  const switchRole = (newRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, hasPermission, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const PermissionGate = ({ permission, fallback = null, children }) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
};