import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Users,
  Shield,
  CreditCard,
  Radio,
  FileText,
  Activity,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Server,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PlatformLayout: React.FC = () => {
  const { currentUserRole, currentUserSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authoritative super-admin check
  const isSuperAdmin = currentUserRole === 'SAAS_SUPER_ADMINISTRATOR';

  if (!isSuperAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              background: '#451a03',
              color: '#f97316',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc' }}>
            Platform Boundary Restricted
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px 0' }}>
            The <code>/platform/*</code> boundary requires authoritative <strong>SAAS_SUPER_ADMINISTRATOR</strong> credentials.
            Organization-level administrators cannot access multi-tenant infrastructure controls.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/app/dashboard"
              style={{
                background: '#0284c7',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <ArrowLeft size={16} />
              Return to Organization Workspace
            </Link>
            <button
              type="button"
              onClick={logout}
              style={{
                background: 'transparent',
                color: '#94a3b8',
                border: 'none',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '6px',
              }}
            >
              Sign out of this session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/platform/dashboard', label: 'Platform Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/platform/organizations', label: 'Organizations', icon: <Building size={16} /> },
    { to: '/platform/users', label: 'Platform Users', icon: <Users size={16} /> },
    { to: '/platform/subscriptions', label: 'Plans & Pricing', icon: <CreditCard size={16} /> },
    { to: '/platform/integrations', label: 'Infrastructure & Mesh', icon: <Server size={16} /> },
    { to: '/platform/audit-logs', label: 'Platform Audit Logs', icon: <FileText size={16} /> },
    { to: '/platform/system-health', label: 'System Telemetry', icon: <Activity size={16} /> },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#090d16',
        color: '#f1f5f9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Platform Sidebar */}
      <aside
        style={{
          width: '260px',
          background: '#0d1322',
          borderRight: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Brand Banner */}
        <div
          style={{
            padding: '20px 18px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff', letterSpacing: '0.3px' }}>
              GURI24 PLATFORM
            </div>
            <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.5px' }}>
              SUPER ADMINISTRATOR
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ padding: '4px 10px', fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Multi-Tenant Controls
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? '#1e293b' : 'transparent',
                  borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                <span style={{ color: isActive ? '#38bdf8' : 'inherit' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Client App & User Info */}
        <div style={{ padding: '14px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/app/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              color: '#38bdf8',
              background: '#0c2238',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Tenant App</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px' }}>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUserSession?.email || 'admin@guri24rms.co.ke'}
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        <header
          style={{
            height: '56px',
            borderBottom: '1px solid #1e293b',
            background: '#0d1322',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Guri24 RMS SaaS Engine</span>
            <span>&bull;</span>
            <span>Global Multi-Tenant Authority</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#052e16',
                color: '#4ade80',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
              Production Active
            </span>
          </div>
        </header>

        <div style={{ padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
