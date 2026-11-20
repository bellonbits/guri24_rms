import React from 'react';
import { Link } from 'react-router-dom';
import { Building, UploadCloud, Cpu, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Configure Your Organization & Chart of Accounts',
      desc: 'Set up your company, add buildings, estate clusters, and individual units. Configure custom rental rates, deposit escrow requirements, and connect your bank accounts and M-Pesa Paybill / Till numbers.',
      icon: Building,
    },
    {
      num: '02',
      title: 'Digitize Leases & Onboard Tenants',
      desc: 'Create enforceable digital leases with automated start and termination triggers. Upload existing paper leases or scan them directly using our integrated OCR pipeline to auto-extract tenant contacts and rent terms.',
      icon: UploadCloud,
    },
    {
      num: '03',
      title: 'Automated Billing & Instant Reconciliation',
      desc: 'On the 1st of each month, invoices with itemized rent, water, and trash are generated. When tenants pay via M-Pesa or bank transfer, our system matches the payment to the exact tenant ledger within seconds.',
      icon: Cpu,
    },
    {
      num: '04',
      title: 'Real-Time Financial Intelligence & Reports',
      desc: 'Generate authoritative general ledger entries, trial balances, income statements, and cash flows. Export audit-ready tax reports or consult our AI Assistant for instant portfolio health diagnostics.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 64px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 16px',
              backgroundColor: BRAND_TOKENS.colors.primaryTint,
              borderRadius: '999px',
              color: BRAND_TOKENS.colors.primaryBlue,
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            Streamlined Workflow
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.3rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: BRAND_TOKENS.colors.darkNavy,
              marginBottom: '16px',
              lineHeight: 1.15,
            }}
          >
            How Guri24 RMS Powers Modern Property Portfolios
          </h1>
          <p style={{ fontSize: '1.1rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
            From day one of onboarding to closing your monthly general ledger, here is how our automated platform eliminates operational friction.
          </p>
        </div>

        {/* 4 Step Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '80px' }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  padding: '44px 40px',
                  display: 'grid',
                  gridTemplateColumns: '80px minmax(0, 1fr)',
                  gap: '32px',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: idx % 2 === 0 ? BRAND_TOKENS.colors.primaryTint : '#F0FDF4',
                    color: idx % 2 === 0 ? BRAND_TOKENS.colors.primaryBlue : '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  <Icon size={30} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: BRAND_TOKENS.colors.primaryBlue, letterSpacing: '0.08em', marginBottom: '6px' }}>
                    STEP {step.num}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '10px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div
          style={{
            backgroundColor: BRAND_TOKENS.colors.darkNavy,
            borderRadius: '24px',
            padding: '54px 48px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Transform your property management workflow in 15 minutes
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Sign up today, import your current properties, and enjoy stress-free automated rent collections.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '12px',
              backgroundColor: BRAND_TOKENS.colors.primaryBlue,
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
