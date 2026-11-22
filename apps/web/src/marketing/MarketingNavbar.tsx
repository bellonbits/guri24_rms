import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND_TOKENS } from './BrandTokens';

export const MarketingNavbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, currentUserSession, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userDisplayName = currentUserSession?.fullName?.trim() || currentUserSession?.email?.split('@')[0] || 'User';
  const userInitials = (
    userDisplayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('') || 'U'
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/features', label: 'Features' },
    { to: '/solutions', label: 'Solutions' },
    { to: '/how-it-works', label: 'How it works' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contacts' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        width: '100%',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.96)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
        transition: 'all 200ms ease',
        fontFamily: BRAND_TOKENS.fonts.sans,
        padding: '16px 36px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          width: '100%',
        }}
      >
        {/* Left: Brand Wordmark (Direct logo without card wrapper) */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <img
            src="/logo.png"
            alt="UnitFlow"
            style={{ width: '34px', height: '34px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#021429',
            }}
          >
            Unit<span style={{ color: '#2563EB' }}>Flow</span>
          </span>
        </Link>

        {/* Right: Clean Minimal Navigation Links */}
        <nav
          aria-label="Desktop Navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '26px',
          }}
          className="desktop-clean-nav"
        >
          {navLinks.map((item, idx) => {
            const isActive =
              item.to === '/'
                ? location.pathname === '/' || location.pathname === '/home'
                : location.pathname.startsWith(item.to);

            return (
              <Link
                key={idx}
                to={item.to}
                style={{
                  fontSize: '0.90rem',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#021429' : '#475569',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive ? '2px solid #021429' : '2px solid transparent',
                  paddingBottom: '2px',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#021429';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#475569';
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Action Buttons: Consultation + Profile Avatar / Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px' }}>
            {isAuthenticated && currentUserSession ? (
              <>
                <Link
                  to="/app/dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.22)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/app/settings"
                  title={`${userDisplayName} (Profile)`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.80rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                    flexShrink: 0,
                  }}
                >
                  {userInitials}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 14px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#021429',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#021429')}
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    padding: '9px 20px',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Sign up</span>
                  <ArrowUpRight size={13} />
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: '#021429',
            padding: '6px',
            cursor: 'pointer',
          }}
          className="mobile-hamburger-btn"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            marginTop: '16px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 30px rgba(0,0,0,0.08)',
          }}
        >
          {isAuthenticated && currentUserSession ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                  }}
                >
                  {userInitials}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{userDisplayName}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{currentUserSession.email}</div>
                </div>
              </div>
              <Link
                to="/app/dashboard"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <LayoutDashboard size={15} />
                <span>Open Dashboard</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <Link
                to="/login"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '999px',
                  border: '1px solid #CBD5E1',
                  color: '#021429',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '999px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                }}
              >
                Sign up
              </Link>
            </div>
          )}

          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#021429',
                textDecoration: 'none',
                padding: '6px 0',
              }}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              style={{
                marginTop: '6px',
                border: 'none',
                background: 'none',
                color: '#EF4444',
                fontWeight: 600,
                fontSize: '0.90rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 0',
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-clean-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
