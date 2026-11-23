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
  updateOrganization: (updated: Partial<Organization>) => Promise<Organization>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: SystemRole | SystemRole[]) => boolean;
}

const DEFAULT_ORG: Organization = {
  id: 'org-guri24-001',
  name: 'Unit Flow Property Management Ltd',
  slug: 'unit-flow-property-management',
  organization_type: 'PROPERTY_MANAGEMENT_COMPANY',
  kra_pin: '',
  contact_email: '',
  contact_phone: '',
  county: 'Nairobi',
  currency: 'KES',
  timezone: 'Africa/Nairobi',
  mpesa_paybill_shortcode: '',
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

  // Synchronize token with apiClient and refresh authentic organization profile
  useEffect(() => {
    if (currentUserSession?.token) {
      apiClient.setToken(currentUserSession.token);

      // Fetch authentic organization profile for current tenant
      let isMounted = true;
      apiClient
        .getCurrentOrganization()
        .then((org) => {
          if (!isMounted || !org || !org.id) return;
          setOrganizations((prev) => {
            const idx = prev.findIndex((o) => o.id === org.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = { ...next[idx], ...org };
              return next;
            }
            return [...prev, org];
          });
        })
        .catch(() => {
          // Graceful ignore if offline or mock
        });

      return () => {
        isMounted = false;
      };
    } else {
      apiClient.setToken(null);
    }
  }, [currentUserSession?.token, currentUserSession?.organizationId]);

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
    if (session.organizationId && session.organizationName) {
      setOrganizations((prev) => {
        const match = prev.find((o) => o.id === session.organizationId);
        if (match) {
          return prev.map((o) =>
            o.id === session.organizationId
              ? { ...o, name: session.organizationName || o.name, contact_email: session.email || o.contact_email }
              : o
          );
        }
        return [
          ...prev,
          {
            ...DEFAULT_ORG,
            id: session.organizationId,
            name: session.organizationName,
            contact_email: session.email || '',
            contact_phone: session.phone || '',
          },
        ];
      });
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
    const orgId = activeOrgId || currentUserSession?.organizationId;
    const match = organizations.find((o) => o.id === orgId);
    if (match) return match;

    if (currentUserSession?.organizationName) {
      return {
        ...DEFAULT_ORG,
        id: orgId || DEFAULT_ORG.id,
        name: currentUserSession.organizationName,
        contact_email: currentUserSession.email || '',
        contact_phone: currentUserSession.phone || '',
      };
    }

    return DEFAULT_ORG;
  }, [organizations, activeOrgId, currentUserSession]);

  const updateOrganization = useCallback(
    async (updated: Partial<Organization>): Promise<Organization> => {
      try {
        const res = await apiClient.updateCurrentOrganization(updated);
        setOrganizations((prev) => {
          const idx = prev.findIndex((o) => o.id === res.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], ...res };
            return next;
          }
          return [...prev, res];
        });
        if (updated.name) {
          setCurrentUserSession((prev) => {
            if (!prev) return null;
            const next = { ...prev, organizationName: updated.name! };
            localStorage.setItem('guri24_rms_auth_session', JSON.stringify(next));
            return next;
          });
        }
        return res;
      } catch {
        // Fallback update in state and session
        const orgId = activeOrgId || currentUserSession?.organizationId || DEFAULT_ORG.id;
        const merged: Organization = {
          ...currentOrg,
          ...updated,
          id: orgId,
        };
        setOrganizations((prev) => {
          const idx = prev.findIndex((o) => o.id === orgId);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = merged;
            return next;
          }
          return [...prev, merged];
        });
        if (updated.name) {
          setCurrentUserSession((prev) => {
            if (!prev) return null;
            const next = { ...prev, organizationName: updated.name! };
            localStorage.setItem('guri24_rms_auth_session', JSON.stringify(next));
            return next;
          });
        }
        return merged;
      }
    },
    [activeOrgId, currentOrg, currentUserSession?.organizationId]
  );

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
      updateOrganization,
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
      updateOrganization,
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
