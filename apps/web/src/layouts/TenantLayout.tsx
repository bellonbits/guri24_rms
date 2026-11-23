import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  CreditCard,
  Bell,
  Users,
  Home,
  FileCheck,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TenantLayout: React.FC = () => {
  const { currentUserSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Exact 7 navigation items from user's uploaded reference image:
  // Home, Payments, Notification, Community, My Apartment, Resident Portal, Account
  const navItems = [
    {
      to: '/portal/home',
      aliases: ['/portal', '/portal/dashboard'],
      label: 'Home',
      icon: <LayoutGrid size={17} />,
    },
    {
      to: '/portal/payments',
      aliases: ['/portal/financials'],
      label: 'Payments',
      icon: <CreditCard size={17} />,
    },
    {
      to: '/portal/notifications',
      aliases: ['/portal/notification'],
      label: 'Notification',
      icon: <Bell size={17} />,
    },
    {
      to: '/portal/community',
      aliases: ['/portal/messages'],
      label: 'Community',
      icon: <Users size={17} />,
    },
    {
      to: '/portal/apartment',
      aliases: ['/portal/lease', '/portal/properties'],
      label: 'My Apartment',
      icon: <Home size={17} />,
    },
    {
      to: '/portal/services',
      aliases: ['/portal/maintenance', '/portal/documents'],
      label: 'Resident Portal',
      icon: <FileCheck size={17} />,
    },
    {
      to: '/portal/account',
      aliases: ['/portal/profile', '/portal/settings'],
      label: 'Account',
      icon: <User size={17} />,
    },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)) {
      return true;
    }
    return item.aliases.some(
      (a) => location.pathname === a || location.pathname.startsWith(`${a}/`)
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#faf3ee', // Warm peach-cream background matching reference image
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background shape from reference image */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          right: '8%',
          width: '260px',
          height: '110px',
          borderRadius: '55px',
          background: '#f89371',
          opacity: 0.85,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '52%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: '#f89371',
          opacity: 0.8,
          zIndex: 0,
        }}
      />

      {/* Main Floating Rounded Canvas Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1360px',
          minHeight: '800px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Dark Sidebar matching reference image */}
        <aside
          style={{
            width: '210px',
            background: '#131726', // Deep dark navy from screenshot
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '32px 20px 24px 24px',
            flexShrink: 0,
          }}
          className="hidden md:flex"
        >
          <div>
            {/* Top Logo: "resident portal" in white lowercase font */}
            <Link
              to="/portal/home"
              style={{
                textDecoration: 'none',
                display: 'block',
                marginBottom: '40px',
                lineHeight: 1.15,
              }}
            >
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                resident
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                portal
              </div>
            </Link>

            {/* Navigation items list */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.86rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#f27a54' : '#8c95a6', // Coral active color vs muted silver
                      textDecoration: 'none',
                      padding: '6px 0',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <span style={{ color: active ? '#f27a54' : '#8c95a6' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Logout link & Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link
              to="/app/dashboard"
              style={{
                fontSize: '0.72rem',
                color: '#64748b',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Return to Organization Portal"
            >
              <ExternalLink size={12} />
              <span>Property Admin</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8c95a6',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.84rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <div
          style={{
            flex: 1,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            minWidth: 0,
            padding: '36px 44px',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
