import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const MarketingNavbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            alt="Guri24"
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
            Guri<span style={{ color: '#0057FC' }}>24</span>
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

          {/* Action Buttons: Consultation + Create Account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px' }}>
            <Link
              to="/contact?type=consultation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'transparent',
                color: '#021429',
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1px solid #CBD5E1',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#021429';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
            >
              <span>Consultation</span>
              <ArrowUpRight size={13} />
            </Link>

            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#021429',
                color: '#FFFFFF',
                padding: '9px 20px',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(2, 20, 41, 0.18)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Create Account</span>
              <ArrowUpRight size={13} />
            </Link>
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
          <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />
          <Link
            to="/register"
            style={{
              backgroundColor: '#021429',
              color: '#FFFFFF',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.90rem',
              textDecoration: 'none',
            }}
          >
            Create Account
          </Link>
          <Link
            to="/contact?type=consultation"
            style={{
              backgroundColor: '#F1F5F9',
              color: '#021429',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.90rem',
              textDecoration: 'none',
            }}
          >
            Schedule a Free Consultation
          </Link>
          <Link
            to="/login"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#021429',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.90rem',
              textDecoration: 'none',
            }}
          >
            Staff Login
          </Link>
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
