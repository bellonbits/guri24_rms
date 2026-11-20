import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Phone, ArrowUpRight, Cookie } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';
import { triggerCookieSettingsDialog } from './CookieConsent';

export const MarketingFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: BRAND_TOKENS.colors.darkNavy,
        color: '#FFFFFF',
        fontFamily: BRAND_TOKENS.fonts.sans,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Upper CTA Banner */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '64px 24px',
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
            gap: '32px',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: BRAND_TOKENS.fonts.serif,
                fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                fontWeight: 600,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Bring Your Property Management Into One Place.
            </h3>
            <p
              style={{
                color: '#94A3B8',
                fontSize: '0.98rem',
                margin: '8px 0 0',
                maxWidth: '620px',
              }}
            >
              Join residential estates, landlords, and property firms across Kenya managing their entire operations on Guri24 RMS.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontSize: '0.92rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Talk to Sales
            </Link>

            <Link
              to="/register"
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                backgroundColor: BRAND_TOKENS.colors.primary,
                color: '#FFFFFF',
                fontSize: '0.92rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0, 87, 252, 0.4)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.primary)}
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
          }}
        >
          {/* Column 1: Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img
                src={BRAND_TOKENS.assets.emblem}
                alt="Guri24 RMS"
                style={{ width: '36px', height: '36px', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Guri24
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.84rem', lineHeight: 1.6, margin: '0 0 18px' }}>
              Multi-tenant residential rental management SaaS for Kenya. Real-time M-Pesa Daraja billing, living lease tracking, and double-entry general ledger.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color={BRAND_TOKENS.colors.primary} />
                <span>Nairobi, Kenya</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color={BRAND_TOKENS.colors.primary} />
                <span>support@guri24.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Product
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/features/property-management', label: 'Property & Units' },
                { to: '/features/tenant-management', label: 'Tenant Screening & KYC' },
                { to: '/features/leases-and-bookings', label: 'Living Leases' },
                { to: '/features/mpesa-and-payments', label: 'M-Pesa Reconciliation' },
                { to: '/features/bank-and-cash-management', label: 'Multi-Bank Accounts' },
                { to: '/features/financial-management', label: 'General Ledger' },
                { to: '/features/maintenance', label: 'Maintenance Operations' },
                { to: '/features/ai-assistant', label: 'AI Assistant' },
                { to: '/features', label: 'All 14 Features →' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{ color: '#94A3B8', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Solutions
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/solutions/landlords', label: 'Individual Landlords' },
                { to: '/solutions/property-managers', label: 'Property Managers' },
                { to: '/solutions/real-estate-companies', label: 'Real Estate Companies' },
                { to: '/solutions/estate-managers', label: 'Gated Communities' },
                { to: '/how-it-works', label: 'Product Workflow' },
                { to: '/pricing', label: 'Pricing Plans' },
                { to: '/solutions', label: 'Solutions Overview' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{ color: '#94A3B8', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources & Support */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Resources & Support
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/resources', label: 'Resource Center' },
                { to: '/resources/help', label: 'Help Center' },
                { to: '/resources/guides', label: 'Best Practice Guides' },
                { to: '/resources/tutorials', label: 'Video Walkthroughs' },
                { to: '/resources/blog', label: 'Property Insights Blog' },
                { to: '/faq', label: 'Frequently Asked Questions' },
                { to: '/status', label: 'System Telemetry Status' },
                { to: '/support', label: 'Contact Support' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{ color: '#94A3B8', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal & Trust */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Legal & Compliance
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/legal/terms', label: 'Terms & Conditions' },
                { to: '/legal/privacy', label: 'Privacy Policy' },
                { to: '/legal/cookies', label: 'Cookie Policy' },
                { to: '/legal/data-protection', label: 'Data Protection (KDPA 2019)' },
                { to: '/legal/acceptable-use', label: 'Acceptable Use Policy' },
                { to: '/legal/subscription-and-billing', label: 'Billing & Cancellation' },
                { to: '/legal/data-processing', label: 'Data Processing Agreement' },
                { to: '/security', label: 'Security Overview' },
                { to: '/accessibility', label: 'Accessibility Statement' },
                { to: '/sitemap', label: 'Sitemap' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{ color: '#94A3B8', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Cookie Preferences Button */}
        <div
          style={{
            marginTop: '56px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.82rem',
            color: '#64748B',
          }}
        >
          <div>
            © {new Date().getFullYear()} Guri24 Rental Management Ltd. All rights reserved. Registered in Kenya.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* Permanent Cookie Settings Trigger as required by Section 10 */}
            <button
              type="button"
              onClick={triggerCookieSettingsDialog}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              <Cookie size={14} />
              <span>Cookie Settings</span>
            </button>

            <Link to="/legal" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Legal Center
            </Link>
            <Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
