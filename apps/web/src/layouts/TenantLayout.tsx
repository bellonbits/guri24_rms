import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Wrench,
  FolderLock,
  Bell,
  MessageSquare,
  HelpCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Home,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TenantLayout: React.FC = () => {
  const { currentUserSession, currentUserRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const navItems = [
    { to: '/portal/dashboard', label: 'My Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/portal/payments', label: 'Rent & Payments', icon: <CreditCard size={18} /> },
    { to: '/portal/lease', label: 'My Lease', icon: <FileText size={18} /> },
    { to: '/portal/maintenance', label: 'Maintenance Requests', icon: <Wrench size={18} /> },
    { to: '/portal/documents', label: 'My Documents', icon: <FolderLock size={18} /> },
    {
      to: '/portal/notifications',
      label: 'Notifications',
      icon: <Bell size={18} />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { to: '/portal/messages', label: 'Messages & Support', icon: <MessageSquare size={18} /> },
    { to: '/portal/profile', label: 'My Profile', icon: <User size={18} /> },
    { to: '/portal/settings', label: 'Account Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sidebar - Desktop */}
      <aside
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
        }}
        className="hidden md:flex"
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to="/portal/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#0f172a',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              U
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Unit Flow
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#4f46e5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Tenant Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Assigned Property & Unit Summary Card */}
        <div style={{ padding: '16px 16px 8px 16px' }}>
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Home size={14} style={{ color: '#4f46e5' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                Riverside Heights
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unit B-402 &bull; 2-Bedroom</div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '6px',
                background: '#ecfdf5',
                color: '#059669',
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Active Tenancy
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: '12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#4f46e5' : '#475569',
                  background: isActive ? '#eff6ff' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: isActive ? '#4f46e5' : '#64748b' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      borderRadius: '10px',
                      padding: '2px 7px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Environment Switcher Links (for staff previewing or testing) */}
        <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>
            Environment Access
          </div>
          <Link
            to="/app/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#334155',
              background: '#f8fafc',
              textDecoration: 'none',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={13} style={{ color: '#0284c7' }} />
              <span>Property Manager Portal</span>
            </div>
            <ChevronRight size={13} style={{ color: '#94a3b8' }} />
          </Link>

          {currentUserRole === 'SAAS_SUPER_ADMINISTRATOR' && (
            <Link
              to="/platform/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#38bdf8',
                background: '#090d16',
                textDecoration: 'none',
                border: '1px solid #1e293b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={13} style={{ color: '#38bdf8' }} />
                <span>Platform Super Admin</span>
              </div>
              <ChevronRight size={13} style={{ color: '#64748b' }} />
            </Link>
          )}
        </div>

        {/* User Footer */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#e0e7ff',
                color: '#4338ca',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {currentUserSession?.user?.name ? currentUserSession.user.name[0].toUpperCase() : 'T'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentUserSession?.user?.name || 'David Maina (Tenant)'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Verified Tenant</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }} className="tenant-main-wrap">
        {/* Top Header */}
        <header
          style={{
            height: '60px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                padding: '6px',
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
              Tenancy Self-Service Portal
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Quick Rent Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ color: '#64748b' }}>Current Balance:</span>
              <strong style={{ color: '#059669' }}>KES 0.00</strong>
            </div>

            <Link
              to="/portal/notifications"
              style={{
                position: 'relative',
                color: '#64748b',
                padding: '6px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                  }}
                />
              )}
            </Link>

            <Link
              to="/portal/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                DM
              </div>
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main style={{ flex: 1, padding: '24px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tenant-main-wrap {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
