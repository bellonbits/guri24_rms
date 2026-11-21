import React, { useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import {
  Building2,
  Users,
  Landmark,
  Home,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  PieChart,
  Layers,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

interface SolutionConfig {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  heroMetrics: { label: string; value: string }[];
  challenges: { title: string; desc: string }[];
  features: { title: string; desc: string }[];
  idealFor: string[];
}

const SOLUTIONS: Record<string, SolutionConfig> = {
  landlords: {
    id: 'landlords',
    badge: 'Independent Landlords & Owners',
    title: 'Automate Rent Collections & Eliminate Paper Ledgers',
    subtitle: 'Designed for individual property owners managing residential blocks, boutique apartments, or commercial storefronts.',
    image: '/hero-luxury-architecture.jpg',
    heroMetrics: [
      { label: 'Time Saved on Billing', value: '85%' },
      { label: 'Unreconciled M-Pesa', value: '0%' },
      { label: 'On-Time Rent Collections', value: '+34%' },
    ],
    challenges: [
      { title: 'Manual M-Pesa Code Checking', desc: 'Tenants sending screenshots of M-Pesa SMS requiring tedious manual cross-checking against bank statements.' },
      { title: 'Disorganized Tenant Ledgers', desc: 'Tracking water bills, rent arrears, and security deposits across notebooks or fragmented spreadsheets.' },
      { title: 'Tax & Annual Return Confusion', desc: 'Scrambling during tax season to calculate rental income and deductible maintenance expenses.' },
    ],
    features: [
      { title: 'Instant M-Pesa Paybill / Till Matching', desc: 'Tenant payments via M-Pesa are automatically matched to unit numbers and issued instant SMS receipts.' },
      { title: 'Digital Lease Expiry Alerts', desc: 'Get notified 60 and 30 days before leases expire to negotiate renewals or plan move-outs.' },
      { title: 'One-Click Tax & Profit Reports', desc: 'Generate KRA-ready rental income and expenditure reports with full audit receipts.' },
    ],
    idealFor: ['Owners with 2 to 50 residential units', 'Commercial shop landlords', 'Diaspora property investors seeking remote oversight'],
  },
  'property-managers': {
    id: 'property-managers',
    badge: 'Professional Property Managers & Agencies',
    title: 'Scale Managed Portfolios Without Adding Back-Office Headcount',
    subtitle: 'Empower your management firm to handle dozens of landlords, hundreds of units, and complex commission split disbursements seamlessly.',
    image: '/modern-organic-balconies.jpg',
    heroMetrics: [
      { label: 'Disbursement Speed', value: 'Same-day' },
      { label: 'Staff Efficiency', value: '4x Units/Mgr' },
      { label: 'Owner Retention', value: '99.2%' },
    ],
    challenges: [
      { title: 'Landlord Remittance Friction', desc: 'Spending days at month-end preparing owner statements, calculating commission deductions, and remitting net proceeds.' },
      { title: 'Tenant Arrears Escalation', desc: 'Arrears slipping through the cracks when managing multiple buildings across different caretakers.' },
      { title: 'Maintenance Ticket Blackholes', desc: 'Lost repair requests leading to frustrated tenants and angry landlords.' },
    ],
    features: [
      { title: 'Automated Landlord Statements & Splits', desc: 'Generate branded monthly owner statements itemizing collected rent, management fees, and repair deductions.' },
      { title: 'Maintenance Workflow & Vendor Quoting', desc: 'Dispatch work orders to pre-approved plumbers and electricians with landlord budget approval gates.' },
      { title: 'Automated Escalation & Late Penalties', desc: 'Configurable automated SMS/email reminders and statutory late fees applied to delinquent accounts.' },
    ],
    idealFor: ['Independent property management agencies', 'Real estate agents expanding into rent collection', 'Caretaker teams supervising multi-unit estates'],
  },
  'real-estate-companies': {
    id: 'real-estate-companies',
    badge: 'Real Estate Developers & REITs',
    title: 'Institutional Portfolio Governance with Double-Entry Authority',
    subtitle: 'Enterprise-grade accounting segregation, fund management, and KRA withholding tax compliance across large-scale assets.',
    image: '/luxury-pool-villa.jpg',
    heroMetrics: [
      { label: 'Trial Balance Accuracy', value: '100%' },
      { label: 'Audit Prep Time', value: '-80%' },
      { label: 'Portfolio Net Yield', value: '+14%' },
    ],
    challenges: [
      { title: 'Entity & Branch Co-mingling', desc: 'Difficulty segregating operational funds and tax liabilities across multiple holding companies and special purpose vehicles.' },
      { title: 'Disparate Bank Account Reconciliations', desc: 'Managing corporate accounts across multiple commercial banks with manual spreadsheet exports.' },
      { title: 'Executive Reporting Delays', desc: 'Waiting 3 weeks after month-end to compile trial balances, balance sheets, and occupancy reports.' },
    ],
    features: [
      { title: 'Multi-Entity Chart of Accounts', desc: 'Authoritative double-entry general ledger with branch segregation and automated inter-company balance elimination.' },
      { title: 'Direct Host-to-Host Bank Integration', desc: 'Direct corporate banking API webhooks for automated statement ingestion and sweep verification.' },
      { title: 'Executive BI & Occupancy Dashboards', desc: 'Real-time Net Operating Income (NOI), tenant churn analysis, and automated KRA withholding tax exports.' },
    ],
    idealFor: ['Real Estate Investment Trusts (REITs)', 'Commercial mixed-use developers', 'Private equity property asset managers'],
  },
  'gated-communities': {
    id: 'gated-communities',
    badge: 'Gated Communities & HOAs',
    title: 'Transparent Service Charge Accounting & Amenity Governance',
    subtitle: 'Purpose-built for resident associations, community committees, and court management trusts seeking trust and transparency.',
    image: '/luxury-minimalist-living.jpg',
    heroMetrics: [
      { label: 'Levy Collection Rate', value: '98.5%' },
      { label: 'Dispute Reduction', value: '-90%' },
      { label: 'Resident Trust', value: '99%' },
    ],
    challenges: [
      { title: 'Service Charge Arrears & Deficits', desc: 'Struggling to collect communal service charges needed for security guards, borehole pumps, and trash collection.' },
      { title: 'Lack of Financial Transparency', desc: 'Residents disputing utility bills or questioning how monthly maintenance reserves are disbursed.' },
      { title: 'Visitor & Security Log Jam', desc: 'Uncoordinated access control leading to security lapses at the estate main gate.' },
    ],
    features: [
      { title: 'Communal Levy Invoicing & M-Pesa Matching', desc: 'Automate monthly service charge billing with instant M-Pesa confirmation and arrears tracking.' },
      { title: 'Audited Sinking Fund & Expense Reporting', desc: 'Transparent breakdown of estate operating expenses and sinking fund reserve balances shared with owners.' },
      { title: 'Security Gate & Visitor Pass Logs', desc: 'Digital pass generation for visitors and contractors with automated entry notifications.' },
    ],
    idealFor: ['Homeowners Associations (HOAs)', 'Residential court management committees', 'Serviced apartment clusters'],
  },
};

export const SolutionsPages: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const activeSlug = pathParts[2] || 'landlords';
  const solution = SOLUTIONS[activeSlug] || SOLUTIONS['landlords'];

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
          backgroundImage: `url(${solution.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
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
              'linear-gradient(180deg, rgba(2, 20, 41, 0.78) 0%, rgba(2, 20, 41, 0.52) 50%, rgba(2, 20, 41, 0.9) 100%)',
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
            fontSize: 'clamp(50px, 13vw, 175px)',
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
          PORTFOLIO SOLUTIONS
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '860px', margin: '0 auto' }}>
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
            <span style={{ color: '#03D8BF' }}>06</span>
            <span>&bull;</span>
            <span>{solution.badge}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.6vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              lineHeight: 1.12,
              marginBottom: '20px',
            }}
          >
            {solution.title.split('&')[0]} &amp;{' '}
            <span style={{ color: '#B89047' }}>{solution.title.split('&')[1] || 'SaaS Authority'}</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 32px',
            }}
          >
            {solution.subtitle}
          </p>

          {/* Solutions Switcher Tabs */}
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
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { id: 'landlords', label: 'Landlords' },
              { id: 'property-managers', label: 'Property Managers' },
              { id: 'real-estate-companies', label: 'REITs & Developers' },
              { id: 'gated-communities', label: 'Gated Communities' },
            ].map((tab) => {
              const isCurrent = activeSlug === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={`/solutions/${tab.id}`}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    backgroundColor: isCurrent ? '#FFFFFF' : 'transparent',
                    color: isCurrent ? '#021429' : 'rgba(255, 255, 255, 0.88)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: METRICS ROW
          ========================================================================= */}
      <section
        style={{
          padding: '60px 48px',
          backgroundColor: '#FFFFFF',
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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            textAlign: 'center',
          }}
          className="metrics-row-grid-3"
        >
          {solution.heroMetrics.map((m, mi) => (
            <div key={mi}>
              <div style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 900, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.86rem', color: '#64748B', fontWeight: 600, marginTop: '6px' }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CHALLENGES VS GURI24 CAPABILITIES
          ========================================================================= */}
      <section
        style={{
          padding: '96px 48px',
          backgroundColor: '#FAFBFD',
          borderBottom: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
            }}
            className="challenges-vs-features-grid"
          >
            {/* Common Friction */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                border: '1px solid #E2E8F0',
                padding: '44px',
                boxShadow: '0 8px 24px -6px rgba(2, 20, 41, 0.04)',
              }}
            >
              <div style={{ fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#EF4444', fontWeight: 800, marginBottom: '12px' }}>
                Operational Friction Solved
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#021429', marginBottom: '28px' }}>
                Legacy Workflow Pitfalls
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {solution.challenges.map((c, ci) => (
                  <div key={ci}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#021429', marginBottom: '6px' }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: '0.90rem', color: '#64748B', lineHeight: 1.55 }}>
                      {c.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Guri24 Advantage */}
            <div
              style={{
                backgroundColor: '#021429',
                color: '#FFFFFF',
                borderRadius: '28px',
                padding: '44px',
                boxShadow: '0 20px 45px -10px rgba(2, 20, 41, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#03D8BF', fontWeight: 800, marginBottom: '12px' }}>
                The Guri24 Engine
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '28px' }}>
                Automated Architectural Advantage
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {solution.features.map((f, fi) => (
                  <div key={fi}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#03D8BF', marginBottom: '6px' }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: '0.90rem', color: '#CBD5E1', lineHeight: 1.55 }}>
                      {f.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CLOSING CALLOUT
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
              Ready to Modernize Your Operations?
            </h2>
            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '32px' }}>
              Explore how Guri24 fits your specific property structure.
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
              <Link
                to="/contact?type=consultation"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  textDecoration: 'none',
                }}
              >
                <span>Book Consultation</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 900px) {
          .challenges-vs-features-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .metrics-row-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};
