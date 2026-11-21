import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  UploadCloud,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Configure Hierarchy & Chart of Accounts',
      desc: 'Model your organization by Estate > Building > Floor > Unit. Establish your chart of accounts with custom rental rates, deposit escrow rules, and connect your bank accounts and Safaricom Paybill / Till channels.',
      icon: Building2,
      highlights: ['Row-level multi-tenant isolation', 'Granular ownership split equity ratios', 'Customizable property metadata attributes'],
    },
    {
      num: '02',
      title: 'Digitize Leases & Ingest Paper Records',
      desc: 'Create legally enforceable digital leases with automated start and termination triggers. Scan legacy paper leases directly using our OCR pipeline to automatically extract tenant contacts, KYC IDs, and rental terms.',
      icon: UploadCloud,
      highlights: ['OCR verification confidence scores', 'Statutory rent escalation formulas', 'Digital signature and tenant portal onboarding'],
    },
    {
      num: '03',
      title: 'Automated Billing & Instant M-Pesa Reconciliation',
      desc: 'On the 1st of each month, itemized invoices covering rent, water, and amenities are dispatched. When tenants pay via M-Pesa or bank transfer, our system matches the payment to the exact lease ledger in under 2 seconds.',
      icon: Cpu,
      highlights: ['Real-time Safaricom Daraja C2B IPN webhooks', 'Multi-bank statement CSV/Excel OCR import', 'Automated SMS and email receipts'],
    },
    {
      num: '04',
      title: 'Authoritative General Ledger & Asset Diagnostics',
      desc: 'Every transaction creates immutable balancing debit and credit entries. Generate real-time trial balances, profit & loss, balance sheets, and consult our grounded AI Assistant for instant portfolio health diagnostics.',
      icon: CheckCircle2,
      highlights: ['100% double-entry ledger balance guaranteed', 'KRA withholding tax and VAT reports', 'Grounded AI conversational financial queries'],
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
          SECTION 1: ROUNDED ARCHITECTURAL HERO CARD
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '12px auto 80px',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            minHeight: '560px',
            backgroundImage: 'url(/hero-apex-architecture.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 46%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '64px 54px',
            boxSizing: 'border-box',
            boxShadow: '0 25px 60px -15px rgba(2, 20, 41, 0.25)',
          }}
        >
          {/* Dark Vignette Overlay on the Left for Readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(2, 20, 41, 0.88) 0%, rgba(2, 20, 41, 0.72) 42%, rgba(2, 20, 41, 0.2) 78%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '16px',
              }}
            >
              <span>04 &bull; SYSTEM ARCHITECTURE</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: '#FFFFFF',
                marginBottom: '18px',
              }}
            >
              How Guri24 Automates
              <br />
              Property Portfolios
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
                color: 'rgba(255, 255, 255, 0.90)',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '560px',
              }}
            >
              From your first day of organizational setup to closing your monthly double-entry ledger, discover how our automated engine eliminates operational friction.
            </p>

            <Link
              to="/contact?type=consultation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#021429',
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '999px',
                fontSize: '0.90rem',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span>Schedule Architecture Walkthrough</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 4-STEP TIMELINE EDITORIAL CARDS
          ========================================================================= */}
      <section
        style={{
          padding: '96px 48px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '28px',
                    border: '1px solid #E2E8F0',
                    padding: '48px',
                    boxShadow: '0 12px 32px -8px rgba(2, 20, 41, 0.06)',
                    display: 'grid',
                    gridTemplateColumns: '120px minmax(0, 1fr)',
                    gap: '40px',
                    alignItems: 'flex-start',
                  }}
                  className="step-timeline-card"
                >
                  {/* Step Num & Icon */}
                  <div>
                    <div
                      style={{
                        fontSize: '3.4rem',
                        fontWeight: 900,
                        color: '#CBD5E1',
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        marginBottom: '12px',
                      }}
                    >
                      {step.num}
                    </div>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        backgroundColor: '#EFF5FF',
                        color: '#0057FC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={28} />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div>
                    <h3
                      style={{
                        fontSize: '1.65rem',
                        fontWeight: 900,
                        color: '#021429',
                        letterSpacing: '-0.025em',
                        marginBottom: '12px',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        color: '#64748B',
                        fontSize: '1.02rem',
                        lineHeight: 1.65,
                        marginBottom: '24px',
                      }}
                    >
                      {step.desc}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {step.highlights.map((h, hi) => (
                        <div
                          key={hi}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#FAFBFD',
                            border: '1px solid #E2E8F0',
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#021429',
                          }}
                        >
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0057FC' }} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CLOSING CALLOUT
          ========================================================================= */}
      <section
        style={{
          padding: '80px 32px 100px',
          backgroundColor: '#FFFFFF',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            borderRadius: '28px',
            backgroundColor: '#021429',
            padding: '72px 48px',
            textAlign: 'center',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                lineHeight: 1.15,
              }}
            >
              Ready to Upgrade Your Operational Architecture?
            </h2>
            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '32px' }}>
              Start your 14-day free trial or book a custom migration consultation today.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0057FC',
                  color: '#FFFFFF',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <span>Start Free Trial</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 768px) {
          .step-timeline-card {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};
