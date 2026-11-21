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
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Giant Architectural Background Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(50px, 11vw, 150px)',
          fontWeight: 900,
          letterSpacing: '0.12em',
          color: 'rgba(255, 255, 255, 0.025)',
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
          EDITORIAL NAVIGATION & COLUMNS (5-COLUMN LUXURY STRUCTURE)
          ========================================================================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '80px 32px 56px',
          maxWidth: '1320px',
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
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '18px' }}>
              <img
                src="/logo.png"
                alt="Guri24"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
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
                { to: '/solutions/gated-communities', label: 'Gated Communities & HOAs' },
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
              Resources &amp; Insights
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/resources', label: 'Latest Editorial Publications' },
                { to: '/about', label: 'About Company & Story' },
                { to: '/faq', label: 'Frequently Asked Questions' },
                { to: '/status', label: 'Live System Health Status' },
                { to: '/sitemap', label: 'Platform Sitemap Index' },
                { to: '/contact', label: 'Direct Advisory Desk' },
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

          {/* Column 5: Trust, Legal & Contact */}
          <div>
            <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Trust &amp; Office
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem', color: '#94A3B8', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: '#03D8BF', marginTop: '2px', flexShrink: 0 }} />
                <span>The Mirage, Tower 2, 7th Fl, Chiromo Rd, Westlands, Nairobi</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={16} style={{ color: '#03D8BF', flexShrink: 0 }} />
                <span>+254 700 000 000</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={16} style={{ color: '#03D8BF', flexShrink: 0 }} />
                <span>advisory@guri24.com</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '8px' }}>
                <ShieldCheck size={14} style={{ color: '#0057FC' }} />
                <span>KDPA 2019 Certified Compliant</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                <Link to="/legal/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy</Link>
                <span style={{ color: '#334155' }}>&bull;</span>
                <Link to="/legal/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms</Link>
                <span style={{ color: '#334155' }}>&bull;</span>
                <Link to="/legal/cookies" style={{ color: '#64748B', textDecoration: 'none' }}>Cookies</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Horizontal Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: '56px',
            paddingTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.80rem',
            color: '#64748B',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Guri24 RMS Ltd. All rights reserved. Registered in Kenya.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => triggerCookieSettingsDialog()}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '0.80rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
              }}
            >
              <Cookie size={14} />
              <span>Cookie Settings</span>
            </button>
            <span>&bull;</span>
            <Link to="/security" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Security Center
            </Link>
            <span>&bull;</span>
            <Link to="/accessibility" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Accessibility
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 960px) {
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
