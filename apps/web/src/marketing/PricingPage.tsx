import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, HelpCircle, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const tiers = [
    {
      name: 'Starter',
      badge: 'For Independent Landlords',
      description: 'Everything essential to automate rent collection, leases, and tenant communication.',
      monthlyPrice: '4,500',
      annualPrice: '3,600',
      units: 'Up to 25 units',
      highlighted: false,
      ctaText: 'Start 14-Day Free Trial',
      ctaLink: '/register?tier=starter',
      features: [
        'Up to 25 residential or commercial units',
        'Automated M-Pesa Paybill / Till matching',
        'Digital lease creation & renewal tracking',
        'Tenant rent ledger & arrears tracking',
        'Automated SMS & Email payment receipts',
        'Basic maintenance ticketing & dispatch',
        'Standard PDF reports & rent roll export',
        'Community email support (24hr SLA)',
      ],
    },
    {
      name: 'Growth',
      badge: 'Most Popular',
      description: 'Complete multi-property operational management with automated bank statement reconciliation.',
      monthlyPrice: '12,000',
      annualPrice: '9,600',
      units: 'Up to 100 units',
      highlighted: true,
      ctaText: 'Start 14-Day Free Trial',
      ctaLink: '/register?tier=growth',
      features: [
        'Up to 100 managed units across properties',
        'All Starter features included',
        'Multi-bank statement CSV/Excel OCR import',
        'Full double-entry general ledger & chart of accounts',
        'Automated late rent reminders & penalty rules',
        'Vendor expense management & petty cash tracking',
        'Escrow tenant deposit liability management',
        'AI Assistant (property financial diagnostics)',
        'Priority email & WhatsApp support (4hr SLA)',
      ],
    },
    {
      name: 'Scale',
      badge: 'For Property Agencies',
      description: 'Advanced financial management, multi-user role permissions, and executive reporting.',
      monthlyPrice: '28,000',
      annualPrice: '22,400',
      units: 'Up to 350 units',
      highlighted: false,
      ctaText: 'Start 14-Day Free Trial',
      ctaLink: '/register?tier=scale',
      features: [
        'Up to 350 managed units & unlimited estates',
        'All Growth features included',
        'Multi-entity & branch accounting segregation',
        'Granular role-based permissions (Landlord, Agent, Accountant)',
        'Trial balance, P&L, balance sheet & cash flow statements',
        'Automated KRA withholding tax reporting',
        'OCR document scanning for physical receipts & contracts',
        'Custom invoice branding with organization logo',
        'Dedicated account manager & telephone onboarding',
      ],
    },
    {
      name: 'Enterprise',
      badge: 'For REITs & Large Portfolios',
      description: 'Dedicated infrastructure, custom API integrations, SLA guarantees, and on-premise options.',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      units: 'Unlimited units',
      highlighted: false,
      ctaText: 'Contact Enterprise Sales',
      ctaLink: '/contact?type=enterprise',
      features: [
        'Unlimited units, buildings, and estates',
        'All Scale features included',
        'Direct bank API webhooks (Co-op, Equity, KCB, Stanbic)',
        'Custom chart of accounts & ERP integration (SAP, Oracle)',
        'Custom domain & white-label tenant portal',
        'Dedicated database instance with 99.95% uptime SLA',
        'Custom contract, invoicing & bespoke compliance audit',
        'On-site staff training & 24/7 priority emergency hotline',
      ],
    },
  ];

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: BRAND_TOKENS.colors.primaryTint,
              borderRadius: '999px',
              color: BRAND_TOKENS.colors.primaryBlue,
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            <Sparkles size={16} /> Transparent Pricing, Zero Hidden Fees
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: BRAND_TOKENS.colors.darkNavy,
              marginBottom: '16px',
              lineHeight: 1.15,
            }}
          >
            Predictable plans designed for property portfolios of every size
          </h1>
          <p style={{ fontSize: '1.1rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
            Every plan includes a 14-day fully functional trial. No credit card required to start.
          </p>

          {/* Billing Cycle Switch */}
          <div style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', backgroundColor: '#E2E8F0', padding: '4px', borderRadius: '999px' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: billingCycle === 'monthly' ? '#FFFFFF' : 'transparent',
                color: billingCycle === 'monthly' ? BRAND_TOKENS.colors.darkNavy : BRAND_TOKENS.colors.slateSubtle,
                boxShadow: billingCycle === 'monthly' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: billingCycle === 'annual' ? '#FFFFFF' : 'transparent',
                color: billingCycle === 'annual' ? BRAND_TOKENS.colors.darkNavy : BRAND_TOKENS.colors.slateSubtle,
                boxShadow: billingCycle === 'annual' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Annual Billing
              <span style={{ fontSize: '0.75rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'stretch', marginBottom: '80px' }}>
          {tiers.map((tier) => {
            const price = billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.name}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: tier.highlighted ? `2px solid ${BRAND_TOKENS.colors.primaryBlue}` : `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  padding: '36px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: tier.highlighted ? '0 20px 40px -15px rgba(0, 87, 252, 0.15)' : '0 4px 12px rgba(0,0,0,0.02)',
                  transform: tier.highlighted ? 'scale(1.02)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              >
                {tier.highlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: BRAND_TOKENS.colors.primaryBlue,
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 14px',
                      borderRadius: '999px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tier.badge}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>{tier.name}</h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND_TOKENS.colors.primaryBlue, marginBottom: '12px' }}>{tier.units}</div>
                  <p style={{ fontSize: '0.9rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.5, minHeight: '54px' }}>{tier.description}</p>
                </div>

                {/* Price Display */}
                <div style={{ margin: '24px 0 28px', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '20px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    {price !== 'Custom' && <span style={{ fontSize: '1.1rem', fontWeight: 600, color: BRAND_TOKENS.colors.slateSubtle }}>KES</span>}
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em' }}>{price}</span>
                    {price !== 'Custom' && <span style={{ fontSize: '0.9rem', color: BRAND_TOKENS.colors.slateSubtle }}>/ month</span>}
                  </div>
                  {price !== 'Custom' && billingCycle === 'annual' && (
                    <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '4px', fontWeight: 600 }}>Billed annually (save 2 months free)</div>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  to={tier.ctaLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    backgroundColor: tier.highlighted ? BRAND_TOKENS.colors.primaryBlue : BRAND_TOKENS.colors.darkNavy,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    marginBottom: '32px',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {tier.ctaText} <ArrowRight size={16} />
                </Link>

                {/* Features List */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px' }}>
                    Included Capabilities
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                    {tier.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#334155', lineHeight: 1.45 }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          <Check size={12} color={BRAND_TOKENS.colors.primaryBlue} strokeWidth={3} />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Guarantee */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            padding: '48px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.primaryTint, color: BRAND_TOKENS.colors.primaryBlue, marginBottom: '16px' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Security & Compliance Guarantee</h3>
            <p style={{ fontSize: '0.95rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
              All subscriptions include multi-tenant row-level database isolation, TLS 1.3 transit encryption, AES-256 storage, and full Kenya Data Protection Act (KDPA 2019) compliance.
            </p>
          </div>
          <div>
            <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#16A34A', marginBottom: '16px' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Seamless Migration & Onboarding</h3>
            <p style={{ fontSize: '0.95rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
              Switching from Excel, spreadsheets, or another property system? Our customer success team provides white-glove rent roll and tenant data imports at zero additional cost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
