import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Users,
  Shield,
  CreditCard,
  FileText,
  Activity,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Server,
  Sparkles,
  ExternalLink,
  ChevronRight,
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
          background: '#f8fafc',
          color: '#0f172a',
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
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              background: '#fef3c7',
              color: '#d97706',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>
            Platform Boundary Restricted
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 24px 0' }}>
            The <code>/platform/*</code> control plane requires authoritative <strong>SAAS_SUPER_ADMINISTRATOR</strong> credentials.
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
                color: '#64748b',
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

  const currentNav = navItems.find((n) => location.pathname === n.to) || navItems[0];

  return (
    <div
      className="platform-light-theme"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        colorScheme: 'light',
      }}
    >
      {/* Platform Sidebar */}
      <aside
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          zIndex: 30,
        }}
      >
        {/* Brand Banner */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(37,99,235,0.25)',
              flexShrink: 0,
            }}
          >
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', letterSpacing: '-0.2px' }}>
              Guri24 RMS
            </div>
            <div style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Multi-Tenant Controls
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
          <div
            style={{
              padding: '4px 10px 8px 10px',
              fontSize: '0.68rem',
              color: '#64748b',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}
          >
            Multi-Tenant Controls
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
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
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#0284c7' : '#475569',
                  background: isActive ? '#e0f2fe' : 'transparent',
                  borderLeft: isActive ? '3px solid #0284c7' : '3px solid transparent',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                <span style={{ color: isActive ? '#0284c7' : '#64748b' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Return to Tenant App & Administrator Profile Footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', background: '#fafafa' }}>
          <Link
            to="/app/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#0f172a',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              textDecoration: 'none',
              fontWeight: 600,
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <ArrowLeft size={14} color="#64748b" />
            <span>Return to Tenant App</span>
          </Link>

          {/* Minimal Administrator Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                SA
              </div>
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                  Super Admin
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '125px',
                  }}
                  title={currentUserSession?.email || 'admin@guri24rms.co.ke'}
                >
                  {currentUserSession?.email || 'admin@guri24rms.co.ke'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '56px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          {/* Breadcrumb line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
            <span style={{ color: '#0284c7', fontWeight: 600 }}>Guri24 RMS</span>
            <ChevronRight size={13} color="#cbd5e1" />
            <span style={{ color: '#64748b', fontWeight: 500 }}>Multi-Tenant Controls</span>
            <ChevronRight size={13} color="#cbd5e1" />
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{currentNav.label}</span>
          </div>

          {/* Right Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                color: '#047857',
                border: '1px solid #a7f3d0',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Production Active
            </span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div style={{ padding: '24px 28px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
