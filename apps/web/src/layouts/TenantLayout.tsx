import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Tv,
  Store,
  ShoppingBag,
  FileText,
  BarChart2,
  DollarSign,
  Grid,
  Settings,
  Bell,
  User,
  LogOut,
  Building,
  CheckCircle2,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  Sparkles,
  CreditCard,
  Wrench,
  FolderLock,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TenantLayout: React.FC = () => {
  const { currentUserSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Exact Navigation Items matching the new modern UI in the reference screenshot:
  // Home, Live, Shop, Commodity, Order, Data, Assets, Application, Set up
  const navItems = [
    {
      to: '/portal/dashboard',
      aliases: ['/portal', '/portal/overview', '/portal/home'],
      label: 'Home',
      icon: <Home size={18} />,
    },
    {
      to: '/portal/live',
      aliases: ['/portal/smart-home', '/portal/residence'],
      label: 'Live',
      icon: <Tv size={18} />,
    },
    {
      to: '/portal/properties',
      aliases: ['/portal/shop', '/portal/units'],
      label: 'Shop',
      hasDropdown: true,
      icon: <Store size={18} />,
    },
    {
      to: '/portal/lease',
      aliases: ['/portal/commodity', '/portal/apartment'],
      label: 'Commodity',
      icon: <ShoppingBag size={18} />,
    },
    {
      to: '/portal/payments',
      aliases: ['/portal/order', '/portal/rent-payments', '/portal/financials'],
      label: 'Order',
      icon: <FileText size={18} />,
    },
    {
      to: '/portal/analytics',
      aliases: ['/portal/data', '/portal/ledger'],
      label: 'Data',
      icon: <BarChart2 size={18} />,
    },
    {
      to: '/portal/documents',
      aliases: ['/portal/assets', '/portal/deposit'],
      label: 'Assets',
      icon: <DollarSign size={18} />,
    },
    {
      to: '/portal/maintenance',
      aliases: ['/portal/application', '/portal/services', '/portal/messages'],
      label: 'Application',
      hasDropdown: true,
      icon: <Grid size={18} />,
    },
    {
      to: '/portal/profile',
      aliases: ['/portal/setup', '/portal/settings', '/portal/account'],
      label: 'Set up',
      icon: <Settings size={18} />,
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
  }).format(new Date());

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#f4f6fc', // Soft light lavender-tinted background from reference screenshot
        color: '#1e293b',
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
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
          className="md:hidden"
        />
      )}

      {/* Modern Light Clean Sidebar matching Reference Screenshot */}
      <aside
        style={{
          width: isSidebarCollapsed ? '76px' : '220px',
          background: '#ffffff',
          color: '#475569',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          borderRight: '1px solid #edf0f7',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          transition: 'width 0.2s ease, transform 0.2s ease',
        }}
        className={`md:flex ${isMobileMenuOpen ? 'flex' : 'hidden'}`}
      >
        <div>
          {/* Top Brand Logo / Header */}
          <div
            style={{
              height: '72px',
              padding: '0 20px',
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
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff5b79 0%, #ff758c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 12px rgba(255, 91, 121, 0.3)',
                  flexShrink: 0,
                }}
              >
                UF
              </div>
              {!isSidebarCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: '#0f172a',
                    }}
                  >
                    Unit Flow
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#ff5b79',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Resident Portal
                  </div>
                </div>
              )}
            </Link>

            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                }}
                title="Collapse sidebar"
              >
                <PanelLeftClose size={15} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav
            style={{
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
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
                    padding: isSidebarCollapsed ? '10px' : '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#ff4b72' : '#64748b', // Coral Pink accent matching image
                    background: active ? '#fff0f3' : 'transparent',
                    textDecoration: 'none',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: active ? '#ff4b72' : '#94a3b8', flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!isSidebarCollapsed && item.hasDropdown && (
                    <ChevronDown size={14} color={active ? '#ff4b72' : '#cbd5e1'} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher / Sign Out */}
        <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
          {!isSidebarCollapsed && (
            <Link
              to="/app/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                fontSize: '0.74rem',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '10px',
              }}
            >
              <span>Property Console</span>
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
          marginLeft: isSidebarCollapsed ? '76px' : '220px',
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
            height: '72px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
          }}
        >
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#0f172a',
                cursor: 'pointer',
                padding: '6px',
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#64748b' }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Resident Portal</span>
              <span>/</span>
              <span style={{ color: '#ff4b72', fontWeight: 600 }}>Overview</span>
            </div>
          </div>

          {/* Right: Date, Status, Notifications Bell, Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }} className="hidden md:block">
              {todayFormatted}
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
                    background: '#ff4b72',
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
                background: '#ffffff',
                padding: '4px 12px 4px 4px',
                borderRadius: '24px',
                border: '1px solid #edf0f7',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Amina Wanjiku"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div className="hidden sm:block" style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                  {currentUserSession?.user?.name || 'Amina Wanjiku'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Unit A-204</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Full-Page Main Content View */}
        <main
          style={{
            flex: 1,
            padding: '24px 32px 40px 32px',
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
