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
  CheckCircle2,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TenantLayout: React.FC = () => {
  const { currentUserSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Exact 8 Tenant Navigation Items mandated in Section 9:
  // 1. Overview — Your tenancy at a glance
  // 2. Rent & Payments — Balances, payment history and receipts
  // 3. My Lease — Agreements and renewal requests
  // 4. Maintenance — Report and track issues
  // 5. Documents — Your rental documents
  // 6. Messages — Talk to property management
  // 7. Notifications — Important updates and reminders
  // 8. My Profile — Personal details and account security
  const navItems = [
    {
      to: '/portal/dashboard',
      aliases: ['/portal', '/portal/overview', '/portal/home'],
      label: 'Overview',
      sublabel: 'Your tenancy at a glance',
      icon: <LayoutDashboard size={19} />,
    },
    {
      to: '/portal/payments',
      aliases: ['/portal/financials', '/portal/rent-payments', '/portal/order'],
      label: 'Rent & Payments',
      sublabel: 'Balances, payment history and receipts',
      icon: <CreditCard size={19} />,
    },
    {
      to: '/portal/lease',
      aliases: ['/portal/apartment', '/portal/properties', '/portal/commodity'],
      label: 'My Lease',
      sublabel: 'Agreements and renewal requests',
      icon: <FileText size={19} />,
    },
    {
      to: '/portal/maintenance',
      aliases: ['/portal/services', '/portal/application'],
      label: 'Maintenance',
      sublabel: 'Report and track issues',
      icon: <Wrench size={19} />,
    },
    {
      to: '/portal/documents',
      aliases: ['/portal/assets'],
      label: 'Documents',
      sublabel: 'Your rental documents',
      icon: <FolderLock size={19} />,
    },
    {
      to: '/portal/messages',
      aliases: ['/portal/community'],
      label: 'Messages',
      sublabel: 'Talk to property management',
      icon: <MessageSquare size={19} />,
    },
    {
      to: '/portal/notifications',
      aliases: ['/portal/notification'],
      label: 'Notifications',
      sublabel: 'Important updates and reminders',
      icon: <Bell size={19} />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      to: '/portal/profile',
      aliases: ['/portal/account', '/portal/settings', '/portal/setup'],
      label: 'My Profile',
      sublabel: 'Personal details and account security',
      icon: <User size={19} />,
    },
  ];

  const isNavActive = (item: typeof navItems[0]) => {
    if (location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)) {
      return true;
    }
    return item.aliases.some(
      (a) => location.pathname === a || location.pathname.startsWith(`${a}/`)
    );
  };

  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date())
    .toUpperCase();

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('unitflow_tenant_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      tenantName: 'Courtney Henry',
      email: 'courtney@example.com',
      unitNumber: 'Unit A-204',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    };
  });

  const tenantName = profile.tenantName || currentUserSession?.user?.name || 'Courtney Henry';
  const tenantEmail = profile.email || currentUserSession?.user?.email || 'courtney@example.com';
  const tenantAvatar = profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80';
  const firstName = tenantName.split(' ')[0] || 'Courtney';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
      }}
    >
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            zIndex: 45,
          }}
          className="md:hidden"
        />
      )}

      {/* Modern High-End Sidebar */}
      <aside
        style={{
          width: isSidebarCollapsed ? '76px' : '260px',
          background: '#0f172a', // Deep elegant navy slate
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transition: 'width 0.2s ease, transform 0.2s ease',
          borderRight: '1px solid #1e293b',
        }}
        className={`md:flex ${isMobileMenuOpen ? 'flex' : 'hidden'}`}
      >
        <div>
          {/* Top Brand Header */}
          <div
            style={{
              height: '70px',
              padding: '0 20px',
              borderBottom: '1px solid #1e293b',
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
                gap: '12px',
                textDecoration: 'none',
                color: '#ffffff',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  flexShrink: 0,
                }}
              >
                UF
              </div>
              {!isSidebarCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: '#ffffff',
                    }}
                  >
                    Unit Flow
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#60a5fa',
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
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                }}
                title="Collapse sidebar"
              >
                <PanelLeftClose size={14} />
              </button>
            )}
          </div>

          {/* Current Residence Summary (Immediate answer to "Where am I staying?") */}
          {!isSidebarCollapsed && (
            <div style={{ padding: '16px 16px 8px 16px' }}>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Home size={13} color="#38bdf8" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                      Greenview Apartments
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '2px 6px',
                      borderRadius: '8px',
                    }}
                  >
                    Active
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Block A &bull; Unit A-204 &bull; Ruiru
                </div>
              </div>
            </div>
          )}

          {/* Recommended Tenant Navigation (Section 9) */}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isSidebarCollapsed ? '10px' : '9px 12px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#ffffff' : '#94a3b8',
                    background: active ? '#2563eb' : 'transparent',
                    textDecoration: 'none',
                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  title={isSidebarCollapsed ? `${item.label} — ${item.sublabel}` : undefined}
                >
                  <span style={{ color: active ? '#ffffff' : '#94a3b8', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, lineHeight: 1.2 }}>
                      <span style={{ fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: active ? '#bfdbfe' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.sublabel}
                      </span>
                    </div>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <span
                      style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                        padding: '1px 7px',
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

        {/* Bottom Switcher / Sign Out */}
        <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
          {!isSidebarCollapsed && (
            <Link
              to="/app/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '0.74rem',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '10px',
              }}
            >
              <span>Property Manager Console</span>
              <ExternalLink size={12} color="#94a3b8" />
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
              color: '#94a3b8',
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

      {/* Main Full-Page Content Pane */}
      <div
        style={{
          flex: 1,
          marginLeft: isSidebarCollapsed ? '76px' : '260px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease',
        }}
        className="tenant-fullpage-main"
      >
        {/* Full-Width Top Header Bar */}
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
          {/* Left: Mobile Toggle + Date & Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Good morning, {firstName}
              </div>
            </div>
          </div>

          {/* Right: Quick Status, Notifications Bell, Profile Avatar */}
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
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
              className="hidden sm:flex"
            >
              <CheckCircle2 size={13} color="#059669" />
              <span>Active Lease &bull; Rent Current</span>
            </div>

            {/* Notification Bell */}
            <Link
              to="/portal/notifications"
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                textDecoration: 'none',
              }}
              title="Notifications"
            >
              <Bell size={17} />
              {unreadNotifications > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '9px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#ef4444',
                  }}
                />
              )}
            </Link>

            {/* Profile Avatar Pill matching PropEasy Image */}
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
                src={tenantAvatar}
                alt={tenantName}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #e2e8f0',
                }}
              />
              <div className="hidden sm:block" style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                  {tenantName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{tenantEmail}</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Full-Page Main Content View */}
        <main
          style={{
            flex: 1,
            padding: '32px',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tenant-fullpage-main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
