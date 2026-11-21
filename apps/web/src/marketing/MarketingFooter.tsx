import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Cookie,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';
import { triggerCookieSettingsDialog } from './CookieConsent';

export const MarketingFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#021429',
        color: '#FFFFFF',
        fontFamily: BRAND_TOKENS.fonts.sans,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Giant Architectural Background Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(54px, 11vw, 150px)',
          fontWeight: 900,
          letterSpacing: '0.12em',
          color: 'rgba(255, 255, 255, 0.035)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        GURI24 ARCHITECTURE
      </div>

      {/* =========================================================================
          UPPER EXECUTIVE CONSULTATION & CALL-TO-ACTION SECTION
          ========================================================================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '80px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '40px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(3, 216, 191, 0.12)',
                border: '1px solid rgba(3, 216, 191, 0.3)',
                color: '#03D8BF',
                fontSize: '0.80rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '16px',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} /> Authoritative Real Estate Operations
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                color: '#FFFFFF',
                margin: 0,
                maxWidth: '680px',
              }}
            >
              Designing the Property Operations of the Future.
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginTop: '16px',
                maxWidth: '580px',
              }}
            >
              Join 500+ residential estates, property management firms, and commercial landlords across Kenya managing their entire lifecycle with zero manual reconciliation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: '#FFFFFF',
                color: '#021429',
                padding: '10px 10px 10px 24px',
                borderRadius: '999px',
                fontSize: '0.94rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Start 14-Day Free Trial</span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#021429',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowUpRight size={17} />
              </div>
            </Link>

            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: '0.90rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.18)',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <span>Schedule Live Demo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EDITORIAL NAVIGATION & COLUMNS (5-COLUMN LUXURY STRUCTURE)
          ========================================================================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '80px 32px 64px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) repeat(4, minmax(0, 1fr))',
            gap: '48px',
          }}
          className="footer-editorial-grid"
        >
          {/* Column 1: Brand & Operational Identity */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '18px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Guri<span style={{ color: '#03D8BF' }}>24</span> RMS
              </span>
            </Link>

            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', maxWidth: '320px' }}>
              Authoritative multi-tenant property management platform engineered for Kenyan residential estates, commercial portfolios, and diaspora real estate investors.
            </p>

            {/* Live Infrastructure Beacon */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34D399',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>All Systems Operational (99.98%)</span>
            </div>
          </div>

          {/* Column 2: Platform Architecture */}
          <div>
            <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Platform Modules
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/features/mpesa-and-payments', label: 'M-Pesa IPN Reconciliation' },
                { to: '/features/financial-management', label: 'Double-Entry General Ledger' },
                { to: '/features/bank-and-cash-management', label: 'Multi-Bank Statement OCR' },
                { to: '/features/leases-and-bookings', label: 'Digital Leases & Renewals' },
                { to: '/features/maintenance', label: 'Maintenance & Work Orders' },
                { to: '/features/analytics-and-reporting', label: 'Real-Time NOI & Aging' },
                { to: '/features/ai-assistant', label: 'AI Property Copilot' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#94A3B8',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Audience Solutions */}
          <div>
            <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Solutions
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/solutions/landlords', label: 'Independent Landlords' },
                { to: '/solutions/property-managers', label: 'Property Managers & Agencies' },
                { to: '/solutions/real-estate-companies', label: 'Real Estate Funds & REITs' },
                { to: '/solutions/estate-managers', label: 'Gated Communities & HOAs' },
                { to: '/pricing', label: 'Transparent Pricing Tiers' },
                { to: '/how-it-works', label: 'Platform Workflow' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#94A3B8',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources & Insights */}
          <div>
            <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Resources
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/resources/guides', label: 'Property Accounting Guides' },
                { to: '/resources/tutorials', label: 'Video Walkthroughs' },
                { to: '/resources/blog', label: 'PropTech Industry Insights' },
                { to: '/faq', label: 'Frequently Asked Questions' },
                { to: '/status', label: 'Live System Telemetry' },
                { to: '/support', label: 'Support Help Desk' },
                { to: '/sitemap', label: 'Platform Sitemap' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#94A3B8',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Trust & Governance (KDPA 2019) */}
          <div>
            <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Trust & Legal
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/legal/terms', label: 'Terms & Conditions' },
                { to: '/legal/privacy', label: 'Privacy Policy (KDPA)' },
                { to: '/legal/cookies', label: 'Cookie Policy' },
                { to: '/legal/data-protection', label: 'Data Protection Architecture' },
                { to: '/legal/acceptable-use', label: 'Acceptable Use Policy' },
                { to: '/legal/subscription-and-billing', label: 'Subscription & Billing' },
                { to: '/security', label: 'Security & Row-Level Isolation' },
                { to: '/accessibility', label: 'Accessibility Statement' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#94A3B8',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={triggerCookieSettingsDialog}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#03D8BF',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Cookie size={14} />
                  <span>Cookie Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LOWER FOOTER BAR: COPYRIGHT & EXECUTIVE CONTACTS
          ========================================================================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '28px 32px',
          backgroundColor: '#010E1D',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '0.82rem',
            color: '#64748B',
          }}
        >
          <div>
            &copy; 2026 Guri24 Rental Management Ltd. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
              <MapPin size={13} color="#03D8BF" /> Westlands Innovation District, Nairobi, Kenya
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
              <Mail size={13} color="#03D8BF" /> support@guri24.com
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
              <Phone size={13} color="#03D8BF" /> +254 (0) 700 000 000
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-editorial-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 36px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-editorial-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
