import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  HelpCircle,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Building2,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const tiers = [
    {
      name: 'Starter',
      badge: 'Independent Landlords',
      description: 'Essential billing automation, digital leases, and tenant ledgers for boutique portfolios.',
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
      description: 'Complete multi-property management with automated bank statement OCR & reconciliation.',
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
      badge: 'Property Agencies',
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
      badge: 'REITs & Large Portfolios',
      description: 'Dedicated infrastructure, custom API webhooks, SLA guarantees, and on-premise options.',
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
    <div
      style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: BRAND_TOKENS.fonts.sans,
        color: '#0F172A',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* =========================================================================
          SECTION 1: ARCHITECTURAL HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '65vh',
          backgroundImage: 'url(/luxury-pool-villa.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '100px 32px 80px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(2, 20, 41, 0.75) 0%, rgba(2, 20, 41, 0.5) 50%, rgba(2, 20, 41, 0.88) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(54px, 14vw, 175px)',
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: 'rgba(255, 255, 255, 0.08)',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex: 1,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          CAPITAL ARCHITECTURE
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '840px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '20px',
            }}
          >
            <span style={{ color: '#03D8BF' }}>02</span>
            <span>&bull;</span>
            <span>TIER ARCHITECTURE</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              lineHeight: 1.12,
              marginBottom: '20px',
            }}
          >
            Predictable Pricing for{' '}
            <span style={{ color: '#B89047' }}>Property Leaders</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 32px',
            }}
          >
            Invest in financial precision. All subscriptions include double-entry ledger invariance, real-time M-Pesa IPN reconciliation, and KDPA 2019 compliance.
          </p>

          {/* Billing Cycle Pill Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '999px',
              padding: '5px',
            }}
          >
            <button
              onClick={() => setBillingCycle('annual')}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: billingCycle === 'annual' ? '#FFFFFF' : 'transparent',
                color: billingCycle === 'annual' ? '#021429' : 'rgba(255, 255, 255, 0.88)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: '#03D8BF',
                  color: '#021429',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 800,
                }}
              >
                SAVE 20%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: billingCycle === 'monthly' ? '#FFFFFF' : 'transparent',
                color: billingCycle === 'monthly' ? '#021429' : 'rgba(255, 255, 255, 0.88)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Monthly Billing
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 4 TIER CARDS GRID
          ========================================================================= */}
      <section
        style={{
          padding: '80px 48px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'stretch',
            }}
          >
            {tiers.map((tier, idx) => {
              const isHighlight = tier.highlighted;
              const price = billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isHighlight ? '#021429' : '#FFFFFF',
                    color: isHighlight ? '#FFFFFF' : '#0F172A',
                    borderRadius: '28px',
                    border: isHighlight ? '2px solid #0057FC' : '1px solid #E2E8F0',
                    padding: '36px 30px',
                    boxShadow: isHighlight
                      ? '0 25px 60px -15px rgba(0, 87, 252, 0.35)'
                      : '0 8px 24px -6px rgba(2, 20, 41, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div>
                    {/* Badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        backgroundColor: isHighlight ? 'rgba(0, 87, 252, 0.25)' : '#F1F5F9',
                        color: isHighlight ? '#03D8BF' : '#475569',
                        marginBottom: '16px',
                        border: isHighlight ? '1px solid rgba(3, 216, 191, 0.3)' : 'none',
                      }}
                    >
                      {tier.badge}
                    </div>

                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>
                      {tier.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: isHighlight ? '#94A3B8' : '#64748B',
                        lineHeight: 1.5,
                        minHeight: '44px',
                        marginBottom: '20px',
                      }}
                    >
                      {tier.description}
                    </p>

                    {/* Pricing */}
                    <div style={{ marginBottom: '24px' }}>
                      {price === 'Custom' ? (
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                          Custom
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 600, color: isHighlight ? '#94A3B8' : '#64748B' }}>
                            KES
                          </span>
                          <span style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                            {price}
                          </span>
                          <span style={{ fontSize: '0.84rem', color: isHighlight ? '#94A3B8' : '#64748B' }}>
                            / mo
                          </span>
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: '0.80rem',
                          color: isHighlight ? '#03D8BF' : '#0057FC',
                          fontWeight: 700,
                          marginTop: '4px',
                        }}
                      >
                        {tier.units}
                      </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: isHighlight ? 'rgba(255,255,255,0.1)' : '#F1F5F9', marginBottom: '24px' }} />

                    {/* Features list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                      {tier.features.map((f, fi) => (
                        <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: isHighlight ? 'rgba(3, 216, 191, 0.2)' : '#EFF5FF',
                              color: isHighlight ? '#03D8BF' : '#0057FC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span
                            style={{
                              fontSize: '0.86rem',
                              lineHeight: 1.45,
                              color: isHighlight ? '#CBD5E1' : '#475569',
                            }}
                          >
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA button */}
                  <Link
                    to={tier.ctaLink}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '999px',
                      backgroundColor: isHighlight ? '#0057FC' : '#021429',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isHighlight ? '0 10px 25px rgba(0, 87, 252, 0.4)' : 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ENTERPRISE CUSTOM CONSULTATION CALLOUT
          ========================================================================= */}
      <section
        style={{
          padding: '80px 48px',
          backgroundColor: '#FAFBFD',
          borderBottom: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '64px',
            alignItems: 'center',
          }}
          className="enterprise-callout-grid"
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                padding: '4px 14px',
                borderRadius: '999px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '16px',
              }}
            >
              <span>Custom Enterprise Infrastructure</span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
                fontWeight: 900,
                color: '#021429',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Managing Over 500 Units or Need Bespoke ERP Integration?
            </h2>
            <p style={{ color: '#64748B', lineHeight: 1.65, fontSize: '0.98rem', marginBottom: '24px' }}>
              We partner directly with institutional real estate funds, listed REITs, and large commercial developers to deliver dedicated isolated database instances, custom SAP/Oracle ERP chart-of-accounts webhooks, and white-label tenant communication portals.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link
                to="/contact?type=enterprise"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#021429',
                  color: '#FFFFFF',
                  padding: '12px 26px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <span>Schedule Enterprise Review</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              padding: '36px',
              boxShadow: '0 8px 30px -8px rgba(2, 20, 41, 0.06)',
            }}
          >
            <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0057FC', fontWeight: 800, marginBottom: '16px' }}>
              Enterprise SLA Guarantee
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: '99.95% Availability SLA', desc: 'Legally binding uptime guarantee with financial penalty credit.' },
                { title: 'Direct Bank Webhooks', desc: 'Co-op Bank, Equity Bank, KCB, Stanbic host-to-host API integrations.' },
                { title: 'Dedicated Customer Architect', desc: 'Named senior engineer and priority 30-minute response desk.' },
                { title: 'On-Premise or Private Cloud', desc: 'Deploy on dedicated AWS Africa (Cape Town) or on-premise hardware.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0057FC', marginTop: '7px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#021429' }}>{item.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 900px) {
          .enterprise-callout-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};
