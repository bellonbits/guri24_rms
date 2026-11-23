import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Wrench,
  FolderLock,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Building,
  Home,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TenantLayout: React.FC = () => {
  const { currentUserSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Exact 8 Tenant Navigation Items recommended in Section 9:
  // Overview, Rent & Payments, My Lease, Maintenance, Documents, Messages, Notifications, My Profile
  const navItems = [
    {
      to: '/portal/dashboard',
      alias: ['/portal', '/portal/overview'],
      label: 'Overview',
      sublabel: 'Your tenancy at a glance',
      icon: <LayoutDashboard size={18} />,
    },
    {
      to: '/portal/payments',
      alias: ['/portal/financials', '/portal/rent-payments'],
      label: 'Rent & Payments',
      sublabel: 'Balances, payment history and receipts',
      icon: <CreditCard size={18} />,
    },
    {
      to: '/portal/lease',
      alias: ['/portal/properties'],
      label: 'My Lease',
      sublabel: 'Agreements and renewal requests',
      icon: <FileText size={18} />,
    },
    {
      to: '/portal/maintenance',
      alias: [],
      label: 'Maintenance',
      sublabel: 'Report and track issues',
      icon: <Wrench size={18} />,
    },
    {
      to: '/portal/documents',
      alias: [],
      label: 'Documents',
      sublabel: 'Your rental documents',
      icon: <FolderLock size={18} />,
    },
    {
      to: '/portal/messages',
      alias: [],
      label: 'Messages',
      sublabel: 'Talk to property management',
      icon: <MessageSquare size={18} />,
    },
    {
      to: '/portal/notifications',
      alias: [],
      label: 'Notifications',
      sublabel: 'Important updates and reminders',
      icon: <Bell size={18} />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      to: '/portal/profile',
      alias: ['/portal/settings'],
      label: 'My Profile',
      sublabel: 'Personal details and account security',
      icon: <User size={18} />,
    },
  ];

  const isNavActive = (item: typeof navItems[0]) => {
    if (location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)) {
      return true;
    }
    return item.alias.some(
      (a) => location.pathname === a || location.pathname.startsWith(`${a}/`)
    );
  };

  // Format today's date in exact uppercase format: "MONDAY, 23 NOVEMBER 2026"
  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date())
    .toUpperCase();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
        {/* Left Sidebar */}
        <aside
          style={{
            width: isSidebarCollapsed ? '76px' : '260px',
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 40,
            transition: 'width 0.2s ease',
          }}
          className="hidden md:flex"
        >
          {/* Top Branding */}
          <div>
            <div
              style={{
                height: '70px',
                padding: '0 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
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
                    background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    flexShrink: 0,
                  }}
                >
                  U
                </div>
                {!isSidebarCollapsed && (
                  <div>
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        color: '#0f172a',
                      }}
                    >
                      Unit Flow
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Tenant Portal
                    </div>
                  </div>
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

            {/* Current Residence Badge */}
            {!isSidebarCollapsed && (
              <div style={{ padding: '16px 16px 8px 16px' }}>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Home size={13} color="#2563eb" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      Greenview Apartments
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Block A &bull; Unit A-204 &bull; Ruiru
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav
              style={{
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {navItems.map((item) => {
                const active = isNavActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isSidebarCollapsed ? '10px' : '9px 12px',
                      borderRadius: '8px',
                      fontSize: '0.86rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#2563eb' : '#475569',
                      background: active ? '#eff6ff' : 'transparent',
                      textDecoration: 'none',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <span style={{ color: active ? '#2563eb' : '#64748b', flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    )}
                    {!isSidebarCollapsed && item.badge && (
                      <span
                        style={{
                          background: '#ef4444',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          borderRadius: '10px',
                          padding: '1px 6px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Switcher / Log Out */}
          <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
            {!isSidebarCollapsed && (
              <Link
                to="/app/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: '10px',
                }}
              >
                <span>Switch to Property Admin</span>
                <ExternalLink size={12} color="#64748b" />
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: isSidebarCollapsed ? '10px' : '8px 12px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 500,
                color: '#64748b',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              }}
            >
              <LogOut size={16} />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content View */}
        <div
          style={{
            flex: 1,
            marginLeft: isSidebarCollapsed ? '76px' : '260px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            transition: 'margin-left 0.2s ease',
          }}
          className="tenant-main-content-pane"
        >
          {/* Top Application Bar */}
          <header
            style={{
              height: '70px',
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              position: 'sticky',
              top: 0,
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px',
            }}
          >
            {/* Left: Date line from Section 11 recommendation */}
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

              <div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.06em',
                  }}
                >
                  {todayFormatted}
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Good morning, {currentUserSession?.user?.name ? currentUserSession.user.name.split(' ')[0] : 'John'}
                </div>
              </div>
            </div>

            {/* Right: Quick Status, Notifications, Profile Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              {/* Active Tenancy Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                }}
                className="hidden sm:flex"
              >
                <CheckCircle2 size={13} color="#059669" />
                <span>Active Tenancy &bull; Rent Current</span>
              </div>

              {/* Notification Bell */}
              <Link
                to="/portal/notifications"
                style={{
                  position: 'relative',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  textDecoration: 'none',
                }}
              >
                <Bell size={17} />
                {unreadNotifications > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '7px',
                      right: '8px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#ef4444',
                    }}
                  />
                )}
              </Link>

              {/* Profile Avatar Pill */}
              <Link
                to="/portal/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                  alt="Tenant Avatar"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #e2e8f0',
                  }}
                />
                <div className="hidden sm:block" style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                    {currentUserSession?.user?.name || 'John Maina'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Unit A-204</div>
                </div>
              </Link>
            </div>
          </header>

          {/* Child Outlet */}
          <main style={{ flex: 1, padding: '28px 32px 48px 32px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
            <Outlet />
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tenant-main-content-pane {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
