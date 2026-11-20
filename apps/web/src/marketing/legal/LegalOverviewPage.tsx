import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Lock, Cookie, Scale, AlertCircle, ArrowRight } from 'lucide-react';
import { BRAND_TOKENS } from '../BrandTokens';

export const LegalOverviewPage: React.FC = () => {
  const documents = [
    { to: '/legal/terms', title: 'Terms & Conditions of Service', desc: 'SaaS licensing agreement governing organizational usage, subscriptions, and liabilities.', icon: FileText },
    { to: '/legal/privacy', title: 'Privacy Policy', desc: 'Transparency on personal data handling, tenant records, and data subject rights.', icon: Shield },
    { to: '/legal/cookies', title: 'Cookie Policy', desc: 'Detailed inventory of first-party and optional cookies, persistence, and consent management.', icon: Cookie },
    { to: '/legal/data-protection', title: 'Data Protection Architecture', desc: 'Alignment with the Kenya Data Protection Act 2019 and ODPC guidelines.', icon: Lock },
    { to: '/legal/acceptable-use', title: 'Acceptable Use Policy', desc: 'Rules prohibiting fraud, unauthorized scraping, abuse, and platform misuse.', icon: AlertCircle },
    { to: '/legal/subscription-and-billing', title: 'Subscription & Billing Policy', desc: 'Rules governing plans, renewal, cancellation, upgrades, and refunds.', icon: Scale },
    { to: '/legal/data-processing', title: 'Data Processing Agreement (DPA)', desc: 'Standard contractual clauses for Guri24 acting as Data Processor.', icon: FileText },
    { to: '/security', title: 'Security Architecture', desc: 'Technical overview of tenant isolation, encryption, and audit logging.', icon: Shield },
    { to: '/accessibility', title: 'Accessibility Statement', desc: 'Commitment to WCAG AA accessibility, keyboard navigation, and screen reader labels.', icon: FileText },
  ];

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100%', padding: '64px 24px 96px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontSize: '0.80rem', fontWeight: 700, color: BRAND_TOKENS.colors.primary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Trust & Compliance
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Legal & Compliance Center
          </h1>
          <p style={{ fontSize: '1.05rem', color: BRAND_TOKENS.colors.slateSubtle, maxWidth: '640px', margin: '0 auto' }}>
            Transparent legal agreements, security disclosures, and privacy policies governing the Guri24 Rental Management platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {documents.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <Link
                key={idx}
                to={doc.to}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: BRAND_TOKENS.shadows.sm,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = BRAND_TOKENS.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = BRAND_TOKENS.shadows.sm;
                }}
              >
                <div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.primaryLight, color: BRAND_TOKENS.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, margin: '0 0 8px' }}>
                    {doc.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.55, margin: 0 }}>
                    {doc.desc}
                  </p>
                </div>
                <div style={{ marginTop: '20px', fontSize: '0.84rem', fontWeight: 700, color: BRAND_TOKENS.colors.primary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Read document</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
