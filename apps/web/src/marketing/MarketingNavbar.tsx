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
      setScrolled(window.scrollY > 20);
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
    { to: '/about', label: 'About us' },
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
        top: '16px',
        left: 0,
        right: 0,
        margin: '0 auto',
        maxWidth: '1360px',
        width: 'calc(100% - 32px)',
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(2, 20, 41, 0.94)' : 'rgba(2, 20, 41, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '999px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: scrolled
          ? '0 20px 45px -10px rgba(2, 20, 41, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 12px 32px rgba(2, 20, 41, 0.25)',
        transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        fontFamily: BRAND_TOKENS.fonts.sans,
        padding: '8px 18px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: '16px',
        }}
      >
        {/* Left: Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <img
              src="/logo.png"
              alt="Guri24"
              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Guri<span style={{ color: '#03D8BF' }}>24</span>
          </span>
        </Link>

        {/* Center: Desktop Frosted Pill Navigation */}
        <nav
          aria-label="Marketing Navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '4px 6px',
            borderRadius: '999px',
          }}
          className="desktop-pill-nav"
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
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive ? '#021429' : 'rgba(255, 255, 255, 0.88)',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.14)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Social Indicators & Primary Consultation Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Social Badges */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} className="hero-socials">
            {['f', 'ig', 'x'].map((social, i) => (
              <div
                key={i}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {social}
              </div>
            ))}
          </div>

          {/* Consultation Pill Button */}
          <Link
            to="/contact?type=consultation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              color: '#021429',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.84rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Consultation</span>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#021429',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUpRight size={13} />
            </div>
          </Link>

          {/* Login Link */}
          <Link
            to="/login"
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              padding: '6px 12px',
            }}
            className="navbar-login-link"
          >
            Sign in
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
            className="mobile-hamburger-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            marginTop: '16px',
            backgroundColor: '#021429',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#FFFFFF',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: location.pathname === item.to ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)', margin: '4px 0' }} />
          <Link
            to="/register"
            style={{
              backgroundColor: '#0057FC',
              color: '#FFFFFF',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            Start Free Trial
          </Link>
          <Link
            to="/login"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            Staff Login
          </Link>
        </div>
      )}

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 980px) {
          .desktop-pill-nav {
            display: none !important;
          }
          .hero-socials {
            display: none !important;
          }
          .navbar-login-link {
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
