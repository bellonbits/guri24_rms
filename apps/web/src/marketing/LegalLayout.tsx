import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, FileText, Lock, Cookie, Scale, AlertCircle, Printer, ArrowLeft } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  version: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  version,
  children,
}) => {
  const { pathname } = useLocation();

  const legalNav = [
    { to: '/legal/terms', label: 'Terms & Conditions', icon: FileText },
    { to: '/legal/privacy', label: 'Privacy Policy', icon: Shield },
    { to: '/legal/cookies', label: 'Cookie Policy', icon: Cookie },
    { to: '/legal/data-protection', label: 'Data Protection (KDPA)', icon: Lock },
    { to: '/legal/acceptable-use', label: 'Acceptable Use Policy', icon: AlertCircle },
    { to: '/legal/subscription-and-billing', label: 'Subscription & Billing', icon: Scale },
    { to: '/legal/data-processing', label: 'Data Processing Agreement', icon: FileText },
    { to: '/security', label: 'Security Architecture', icon: Shield },
    { to: '/accessibility', label: 'Accessibility Statement', icon: FileText },
  ];

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100%', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Breadcrumb */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <Link to="/" style={{ color: BRAND_TOKENS.colors.slateSubtle, textDecoration: 'none' }}>Home</Link>
          <span style={{ color: BRAND_TOKENS.colors.slateBorder }}>/</span>
          <Link to="/legal" style={{ color: BRAND_TOKENS.colors.slateSubtle, textDecoration: 'none' }}>Legal</Link>
          <span style={{ color: BRAND_TOKENS.colors.slateBorder }}>/</span>
          <span style={{ color: BRAND_TOKENS.colors.darkNavy, fontWeight: 600 }}>{title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '48px', alignItems: 'start' }} className="legal-grid">
          {/* Main Legal Content Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
              boxShadow: BRAND_TOKENS.shadows.sm,
              padding: '48px 44px',
            }}
          >
            {/* Header info */}
            <div style={{ borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, paddingBottom: '24px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: BRAND_TOKENS.colors.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Official Legal Document
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.74rem', backgroundColor: BRAND_TOKENS.colors.bgAlt, color: BRAND_TOKENS.colors.darkNavy, padding: '2px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                    Version {version}
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: BRAND_TOKENS.colors.slateSubtle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.80rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Printer size={14} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.4vw, 2.6rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, margin: '0 0 8px', letterSpacing: '-0.025em' }}>
                {title}
              </h1>
              <p style={{ fontSize: '1rem', color: BRAND_TOKENS.colors.slateSubtle, margin: '0 0 14px' }}>
                {subtitle}
              </p>
              <div style={{ fontSize: '0.80rem', color: BRAND_TOKENS.colors.slateSubtle }}>
                Last revised: <strong style={{ color: BRAND_TOKENS.colors.darkNavy }}>{lastUpdated}</strong> • Effective for all active organizations and tenants.
              </div>
            </div>

            {/* Prose Body */}
            <div className="legal-prose" style={{ lineHeight: 1.7, color: '#334155', fontSize: '0.94rem' }}>
              {children}
            </div>
          </div>

          {/* Right Navigation Sidebar */}
          <aside
            style={{
              position: 'sticky',
              top: '100px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
              padding: '24px',
              boxShadow: BRAND_TOKENS.shadows.sm,
            }}
          >
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Legal Navigation
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {legalNav.map((item, idx) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={idx}
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.84rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.slateMuted,
                      backgroundColor: active ? BRAND_TOKENS.colors.primaryLight : 'transparent',
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div style={{ borderTop: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, marginTop: '20px', paddingTop: '16px', fontSize: '0.78rem', color: BRAND_TOKENS.colors.slateSubtle }}>
              Need legal clarification? Contact{' '}
              <a href="mailto:legal@guri24.com" style={{ color: BRAND_TOKENS.colors.primary, fontWeight: 600 }}>
                legal@guri24.com
              </a>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .legal-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .legal-prose h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #021429;
          margin: 36px 0 14px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 8px;
        }
        .legal-prose h3 {
          font-size: 1.10rem;
          font-weight: 700;
          color: #021429;
          margin: 24px 0 10px;
        }
        .legal-prose p {
          margin: 0 0 16px;
        }
        .legal-prose ul, .legal-prose ol {
          margin: 0 0 18px;
          padding-left: 24px;
        }
        .legal-prose li {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};
