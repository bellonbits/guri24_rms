import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Home,
  User,
  CreditCard,
  Wrench,
  FileText,
  Settings,
  LogOut,
  Bell,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TenantLayout: React.FC = () => {
  const { currentUserSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Exact navigation items from user reference screenshots
  const navItems = [
    { to: '/portal/dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { to: '/portal/properties', label: 'Properties', icon: <Home size={18} /> },
    { to: '/portal/tenants', label: 'Tenants', icon: <User size={18} /> },
    { to: '/portal/financials', label: 'Financials', icon: <CreditCard size={18} /> },
    { to: '/portal/maintenance', label: 'Maintenance', icon: <Wrench size={18} /> },
    { to: '/portal/documents', label: 'Documents', icon: <FileText size={18} /> },
    { to: '/portal/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  // Helper to determine active state
  const isItemActive = (to: string) => {
    if (to === '/portal/tenants') {
      return (
        location.pathname === '/portal/tenants' ||
        location.pathname.startsWith('/portal/tenants/') ||
        location.pathname === '/portal' ||
        location.pathname === '/portal/profile'
      );
    }
    if (to === '/portal/financials') {
      return location.pathname === '/portal/financials' || location.pathname === '/portal/payments';
    }
    if (to === '/portal/properties') {
      return location.pathname === '/portal/properties' || location.pathname === '/portal/lease';
    }
    return location.pathname === to;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#eef2f6',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Floating Application Shell Container (Rounded card from screenshot) */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          minHeight: 'calc(100vh - 32px)',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left Sidebar */}
        <aside
          style={{
            width: isSidebarCollapsed ? '72px' : '220px',
            background: '#ffffff',
            borderRight: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 16px',
            transition: 'width 0.2s ease',
            flexShrink: 0,
          }}
          className="hidden md:flex"
        >
          {/* Brand & Collapse Header */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                marginBottom: '32px',
                padding: '0 4px',
              }}
            >
              <Link
                to="/portal/tenants"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: '#0f172a',
                }}
              >
                {/* PropEasy / Unit Flow Badge Icon */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <Home size={18} />
                </div>
                {!isSidebarCollapsed && (
                  <span
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: '#1e3a8a',
                    }}
                  >
                    Unit Flow
                  </span>
                )}
              </Link>

              {!isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: 0,
                  }}
                  title="Collapse sidebar"
                >
                  <PanelLeftClose size={14} />
                </button>
              )}
            </div>

            {/* Nav list */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const active = isItemActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isSidebarCollapsed ? '10px' : '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#2563eb' : '#475569',
                      background: active ? '#eff6ff' : 'transparent',
                      textDecoration: 'none',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ color: active ? '#2563eb' : '#64748b', flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Log Out */}
          <div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isSidebarCollapsed ? '10px' : '10px 14px',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 500,
                color: '#64748b',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              }}
            >
              <LogOut size={16} />
              {!isSidebarCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
          {/* Top Bar matching screenshot */}
          <header
            style={{
              padding: '24px 32px 16px 32px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              background: '#ffffff',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '0 0 10px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                Tenants
              </h1>

              {/* Breadcrumb line from screenshot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem' }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    color: '#475569',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <ChevronLeft size={13} />
                  <span>Back</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                  <Home size={12} color="#64748b" />
                  <Link
                    to="/portal/tenants"
                    style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Tenants
                  </Link>
                  <span>/</span>
                  <Home size={12} color="#2563eb" />
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>Tenant Details</span>
                </div>
              </div>
            </div>

            {/* Right Profile & Notifications */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Notification Bell */}
              <button
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid #f1f5f9',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <Bell size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '9px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ef4444',
                  }}
                />
              </button>

              {/* Profile Avatar & Info from screenshot (Courtney Henry) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                  alt="Courtney Henry"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #e2e8f0',
                  }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                    Courtney Henry
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    courtney@example.com
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Child Page Content */}
          <main style={{ flex: 1, padding: '0 32px 32px 32px' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
