import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SystemRole } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRoles?: SystemRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredPermission,
  requiredRoles,
}) => {
  const { isAuthenticated, currentUserRole, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  // Permission-based route guards
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Access Restricted
        </h2>
        <p style={{ maxWidth: '440px', color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
          Your current role (<strong>{currentUserRole || 'Unassigned'}</strong>) does not have
          the required permission (<code>{requiredPermission}</code>) to view this module.
        </p>
        <a
          href="/app/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            background: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </a>
      </div>
    );
  }

  // Role-based route guards
  if (requiredRoles && currentUserRole && !requiredRoles.includes(currentUserRole)) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Role Authorization Required
        </h2>
        <p style={{ maxWidth: '440px', color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
          This section requires one of the following roles: {requiredRoles.join(', ')}. Your role is{' '}
          <strong>{currentUserRole}</strong>.
        </p>
        <a
          href="/app/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            background: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
