import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { SystemRole, Organization } from '../types';
import { AuthUserSession } from '../components/AuthExperience';
import { apiClient } from '../lib/apiClient';
import { ROLE_PERMISSIONS, hasPermission as checkPermission } from '../lib/api';

interface AuthContextType {
  currentUserSession: AuthUserSession | null;
  currentUserRole: SystemRole | null;
  currentOrg: Organization;
  organizations: Organization[];
  isAuthenticated: boolean;
  login: (session: AuthUserSession) => void;
  logout: () => void;
  switchOrganization: (orgId: string) => void;
  switchRole: (role: SystemRole) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: SystemRole | SystemRole[]) => boolean;
}

const DEFAULT_ORG: Organization = {
  id: 'org-guri24-001',
  name: 'Guri24 Rental Management Ltd',
  slug: 'guri24-rental-management',
  organization_type: 'PROPERTY_MANAGEMENT_COMPANY',
  kra_pin: 'P051892341K',
  contact_email: 'petergatitu61@gmail.com',
  contact_phone: '+254712345678',
  county: 'Nairobi',
  currency: 'KES',
  timezone: 'Africa/Nairobi',
  mpesa_paybill_shortcode: '174379',
  late_fee_percentage: 5.0,
  late_fee_grace_days: 5,
  rent_calculation_strategy: 'FIXED_MONTHLY',
  payment_allocation_strategy: 'FIFO_OLDEST_FIRST',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserSession, setCurrentUserSession] = useState<AuthUserSession | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        if (window.location.search.includes('auth') || window.location.search.includes('logout')) {
          localStorage.removeItem('guri24_rms_auth_session');
          localStorage.removeItem('guri24_token');
          return null;
        }
        const stored = localStorage.getItem('guri24_rms_auth_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.token === 'string' && parsed.token.startsWith('eyJ')) {
            return parsed;
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [organizations, setOrganizations] = useState<Organization[]>([DEFAULT_ORG]);
  const [activeOrgId, setActiveOrgId] = useState<string>(
    currentUserSession?.organizationId || DEFAULT_ORG.id
  );

  // Authoritative role resolution:
  // If unauthenticated or role is missing/undefined, role is null.
  // Never default to admin access when a user's role is missing or undefined!
  const currentUserRole: SystemRole | null = useMemo(() => {
    if (!currentUserSession || !currentUserSession.role) {
      return null;
    }
    return currentUserSession.role as SystemRole;
  }, [currentUserSession]);

  const isAuthenticated = useMemo(() => {
    return !!currentUserSession?.token && !!currentUserRole;
  }, [currentUserSession, currentUserRole]);

  // Synchronize token with apiClient
  useEffect(() => {
    if (currentUserSession?.token) {
      apiClient.setToken(currentUserSession.token);
    } else {
      apiClient.setToken(null);
    }
  }, [currentUserSession]);

  const logout = useCallback(() => {
    apiClient.clearToken();
    localStorage.removeItem('guri24_rms_auth_session');
    localStorage.removeItem('guri24_token');
    localStorage.removeItem('guri24_refresh_token');
    setCurrentUserSession(null);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };
    window.addEventListener('guri24_auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('guri24_auth_expired', handleAuthExpired);
    };
  }, [logout]);

  const login = useCallback((session: AuthUserSession) => {
    setCurrentUserSession(session);
    setActiveOrgId(session.organizationId);
    if (session.token) {
      apiClient.setToken(session.token);
    }
  }, []);

  const switchOrganization = useCallback((orgId: string) => {
    setActiveOrgId(orgId);
    setCurrentUserSession((prev) => {
      if (!prev) return null;
      const foundOrg = organizations.find((o) => o.id === orgId);
      const updated = {
        ...prev,
        organizationId: orgId,
        organizationName: foundOrg?.name || prev.organizationName,
      };
      localStorage.setItem('guri24_rms_auth_session', JSON.stringify(updated));
      return updated;
    });
  }, [organizations]);

  const switchRole = useCallback((role: SystemRole) => {
    setCurrentUserSession((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        role,
      };
      localStorage.setItem('guri24_rms_auth_session', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const currentOrg = useMemo(() => {
    return (
      organizations.find((o) => o.id === activeOrgId) ||
      organizations.find((o) => o.id === currentUserSession?.organizationId) ||
      DEFAULT_ORG
    );
  }, [organizations, activeOrgId, currentUserSession]);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!currentUserRole) return false;
      return checkPermission(currentUserRole, permission);
    },
    [currentUserRole]
  );

  const hasRole = useCallback(
    (roles: SystemRole | SystemRole[]) => {
      if (!currentUserRole) return false;
      if (Array.isArray(roles)) {
        return roles.includes(currentUserRole);
      }
      return currentUserRole === roles;
    },
    [currentUserRole]
  );

  const value = useMemo(
    () => ({
      currentUserSession,
      currentUserRole,
      currentOrg,
      organizations,
      isAuthenticated,
      login,
      logout,
      switchOrganization,
      switchRole,
      hasPermission,
      hasRole,
    }),
    [
      currentUserSession,
      currentUserRole,
      currentOrg,
      organizations,
      isAuthenticated,
      login,
      logout,
      switchOrganization,
      switchRole,
      hasPermission,
      hasRole,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
