import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  Scale,
  Wrench,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  Layers,
  Lock,
  Search,
  ExternalLink,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';
import { AnimeDecorativeGrid } from './MotionUtils';
import { TaglineReveal } from './TaglineReveal';

export const HomePage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* =========================================================================
          SECTION 2: HERO SECTION (FULL WIDTH)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 60px',
          backgroundColor: '#FFFFFF', // B4 flat background (no background gradient)
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
          overflow: 'hidden',
        }}
      >
        <AnimeDecorativeGrid color={BRAND_TOKENS.colors.primary} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: BRAND_TOKENS.colors.primaryLight,
              border: `1px solid rgba(0, 87, 252, 0.15)`,
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 600,
              color: BRAND_TOKENS.colors.primary,
              marginBottom: '24px',
            }}
          >
            <Sparkles size={14} />
            <span>Kenyan property management SaaS • Live M-Pesa recon</span>
          </div>

          {/* Heading with B5 left to right gradient (#000000 -> #666666) & capped at 680px */}
          <h1
            style={{
              fontFamily: BRAND_TOKENS.fonts.sans,
              fontSize: 'clamp(36px, 4.8vw, 60px)', // Heading 1 (60/60) per B1
              fontWeight: 600, // Semibold per B1 (no ultra bold)
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              margin: '0 auto 20px',
              maxWidth: '680px', // B5 cap at 680px
              textWrap: 'balance', // B1 text-wrap balance
              background: 'linear-gradient(90deg, #000000 0%, #666666 100%)', // B5 light theme heading gradient
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Property management,
            <br />
            without the complexity.
          </h1>

          {/* Supporting Content capped at 680px per B5 */}
          <p
            style={{
              fontSize: '18px', // Title 2 (18/28 medium) per B1
              lineHeight: '28px',
              color: BRAND_TOKENS.colors.slateSubtle,
              maxWidth: '680px', // B5 cap at 680px
              margin: '0 auto 36px',
              textWrap: 'pretty', // B1 text-wrap pretty
            }}
          >
            Manage properties, tenants, leases, rent collections, maintenance, and financial operations from one authoritative workspace. Guri24 gives your business complete clarity and audit control.
          </p>

          {/* Primary & Secondary CTAs with B2 Spacing (8px vert, 12px horiz) & B7 base curve */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '60px',
            }}
          >
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: BRAND_TOKENS.colors.primary,
                color: '#FFFFFF',
                padding: '8px 16px', // B2 main button padding (8px vert, 12-16px horiz)
                borderRadius: '8px', // B3 radius
                fontSize: '16px', // Button-md per B1
                lineHeight: '24px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: BRAND_TOKENS.shadows.brand,
                transition: `all 300ms ${BRAND_TOKENS.motion.baseCurve}`, // B7 base curve
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.primaryHover;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Start free trial</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: BRAND_TOKENS.colors.darkNavy,
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                padding: '8px 16px', // B2 main button padding
                borderRadius: '8px', // B3 radius
                fontSize: '16px', // Button-md per B1
                lineHeight: '24px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: BRAND_TOKENS.shadows.sm,
                transition: `all 300ms ${BRAND_TOKENS.motion.baseCurve}`, // B7 base curve
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.bgAlt;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Explore all 14 features</span>
            </Link>
          </div>

          {/* High-Quality Product Interface Preview Showcase */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1140px',
              margin: '0 auto',
              borderRadius: '20px',
              border: `1px solid rgba(2, 20, 41, 0.12)`,
              boxShadow: '0 30px 70px -15px rgba(2, 20, 41, 0.22), 0 0 0 1px rgba(2, 20, 41, 0.04)',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Window bar */}
            <div
              style={{
                backgroundColor: BRAND_TOKENS.colors.darkNavy,
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ color: '#94A3B8', fontSize: '0.78rem', marginLeft: '12px', fontWeight: 500 }}>
                  guri24.com/app/analytics-ledger • Double-Entry General Ledger (DR = CR)
                </span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(3, 216, 191, 0.15)',
                  color: BRAND_TOKENS.colors.secondary,
                  fontSize: '0.70rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                LIVE PRODUCT PREVIEW
              </span>
            </div>

            {/* Application Mockup Graphic */}
            <div style={{ position: 'relative' }}>
              <img
                src={BRAND_TOKENS.assets.heroAppPreview}
                alt="Guri24 RMS Operational Workspace Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: '580px',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
              />

              {/* Floating Live KPI Overlay Cards */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '18px 24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  boxShadow: BRAND_TOKENS.shadows.lg,
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', color: BRAND_TOKENS.colors.slateSubtle, fontWeight: 600 }}>
                    OCCUPANCY RATE
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy }}>
                    94.8%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
                    ↑ 4.2% vs last month
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: BRAND_TOKENS.colors.slateSubtle, fontWeight: 600 }}>
                    M-PESA DARAJA RECON
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: BRAND_TOKENS.colors.primary }}>
                    KES 1,840,000
                  </div>
                  <div style={{ fontSize: '0.72rem', color: BRAND_TOKENS.colors.slateSubtle }}>
                    100% matched automatically
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: BRAND_TOKENS.colors.slateSubtle, fontWeight: 600 }}>
                    DEPOSIT ESCROW (ACC 2100)
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy }}>
                    KES 420,000
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 600 }}>
                    Segregated Trust Account
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: BRAND_TOKENS.colors.slateSubtle, fontWeight: 600 }}>
                    TRIAL BALANCE HEALTH
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16A34A' }}>
                    Balanced
                  </div>
                  <div style={{ fontSize: '0.72rem', color: BRAND_TOKENS.colors.slateSubtle }}>
                    Total DR == Total CR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MANDATORY TAGLINE REVEAL (B11 PER apps/SKILL1.md)
          ========================================================================= */}
      <TaglineReveal
        lines={[
          'Every shilling accounted for,',
          'from M-Pesa to audited general ledger.',
        ]}
      />

      {/* =========================================================================
          SECTION 3: VALUE PROPOSITION (FULL WIDTH)
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '0.80rem',
              fontWeight: 700,
              color: BRAND_TOKENS.colors.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px',
            }}
          >
            Unified Property Architecture
          </div>

          <h2
            style={{
              fontFamily: BRAND_TOKENS.fonts.sans,
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              color: BRAND_TOKENS.colors.darkNavy,
              letterSpacing: '-0.03em',
              margin: '0 auto 20px',
              maxWidth: '840px',
            }}
          >
            Everything Your Property Business Needs. In One Place.
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: BRAND_TOKENS.colors.slateSubtle,
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto 64px',
            }}
          >
            Disconnected spreadsheets and manual banking statements create missed rent, untracked tenant arrears, and compliance risks. Guri24 unifies operations under an authoritative, multi-tenant cloud.
          </p>

          {/* 3 Core Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              textAlign: 'left',
            }}
          >
            {[
              {
                icon: Building2,
                title: 'Living Real Estate Hierarchy',
                desc: 'Model complex multi-estate portfolios with building blocks, floors, and individual units. Track real occupancy states from VacantAvailable to Occupied with strict overlap prevention.',
              },
              {
                icon: CreditCard,
                title: 'Kenyan Payment Native',
                desc: 'Automated Safaricom Daraja STK Push and C2B webhooks with idempotent receipt deduplication. Multi-bank statement reconciliations for Equity, NCBA, KCB, Stanbic, and Co-op.',
              },
              {
                icon: Scale,
                title: 'Double-Entry General Ledger',
                desc: 'Strict accounting invariants where Debits always equal Credits. Tenant security deposit liabilities (Account 2100) are held in trust escrow and never commingled into rental income.',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: BRAND_TOKENS.colors.bgCanvas,
                    padding: '36px 32px',
                    borderRadius: '20px',
                    border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                    boxShadow: BRAND_TOKENS.shadows.sm,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = BRAND_TOKENS.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = BRAND_TOKENS.shadows.sm;
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: BRAND_TOKENS.colors.primaryLight,
                      color: BRAND_TOKENS.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3
                    style={{
                      fontSize: '1.20rem',
                      fontWeight: 700,
                      color: BRAND_TOKENS.colors.darkNavy,
                      margin: '0 0 10px',
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: '0.90rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6, margin: 0 }}>
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PRODUCT SHOWCASE (ALTERNATING LAYOUT)
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          backgroundColor: BRAND_TOKENS.colors.bgCanvas,
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '96px' }}>
          {/* Showcase 1: M-Pesa & Financial Control (Image Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: BRAND_TOKENS.colors.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                M-Pesa & Multi-Bank Settlement
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  color: BRAND_TOKENS.colors.darkNavy,
                  letterSpacing: '-0.025em',
                  margin: '0 0 16px',
                }}
              >
                Zero-Reconciliation Hassle. Instant Rent Clearances.
              </h2>
              <p style={{ fontSize: '0.98rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6, margin: '0 0 24px' }}>
                Tenants trigger prompt mobile STK push payments on their safaricom phone. Receipts match against outstanding invoices using FIFO allocation, creating verified ledger entries automatically.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Deduplication by CheckoutRequestID & MpesaReceiptNumber',
                  'Partial payments settle oldest open invoice first',
                  'Multi-bank CSV and Excel statement imports without exposing credentials',
                  'Instant tenant SMS confirmation via isolated outbox queue',
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.90rem', color: BRAND_TOKENS.colors.slateMuted }}>
                    <CheckCircle2 size={18} color="#16A34A" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/features/mpesa-and-payments"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: BRAND_TOKENS.colors.primary,
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  textDecoration: 'none',
                }}
              >
                <span>Learn more about M-Pesa Recon</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Visual Box */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '24px',
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                boxShadow: BRAND_TOKENS.shadows.lg,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                  Recent M-Pesa Real-Time Receipts
                </span>
                <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>● LIVE WEBHOOK</span>
              </div>

              {[
                { ref: 'QDH719AKZ1', tenant: 'Grace Njeri', unit: 'Kilimani Prime - B4', amt: 'KES 45,000', status: 'MATCHED' },
                { ref: 'QDH720LMP2', tenant: 'Peter Gatitu Mwangi', unit: 'Riverside Heights - 12A', amt: 'KES 65,000', status: 'MATCHED' },
                { ref: 'QDH721XWR9', tenant: 'Omar Said', unit: 'Coastal Haven - Villa 2', amt: 'KES 80,000', status: 'MATCHED' },
              ].map((tx, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: idx % 2 === 0 ? BRAND_TOKENS.colors.bgCanvas : '#FFFFFF',
                    border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                      {tx.tenant} • {tx.unit}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: BRAND_TOKENS.colors.slateSubtle }}>
                      Ref: {tx.ref} • Allocated FIFO
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#16A34A' }}>{tx.amt}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16A34A' }}>{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Showcase 2: Double-Entry Trust Accounting (Image Left) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Visual Box Left */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '28px',
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                boxShadow: BRAND_TOKENS.shadows.lg,
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px' }}>
                Account 2100: Segregated Trust Escrow
              </div>

              <div
                style={{
                  backgroundColor: BRAND_TOKENS.colors.primaryLight,
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid rgba(0, 87, 252, 0.15)',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '0.74rem', color: BRAND_TOKENS.colors.primary, fontWeight: 700 }}>
                  INVARIANT ENFORCED
                </div>
                <div style={{ fontSize: '1.20rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, margin: '4px 0' }}>
                  Deposits ≠ Revenue
                </div>
                <p style={{ fontSize: '0.80rem', color: BRAND_TOKENS.colors.slateSubtle, margin: 0 }}>
                  Security deposit receipts post exclusively to Tenant Deposit Liability (2100) and are permanently excluded from Rental Revenue (4000) and Net Operating Income.
                </p>
              </div>

              <div style={{ fontSize: '0.82rem', color: BRAND_TOKENS.colors.slateSubtle }}>
                Double-Entry Balance Equation:{' '}
                <strong style={{ color: BRAND_TOKENS.colors.darkNavy }}>Assets == Liabilities + Equity</strong>
              </div>
            </div>

            {/* Text Right */}
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: BRAND_TOKENS.colors.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                Financial Integrity
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  color: BRAND_TOKENS.colors.darkNavy,
                  letterSpacing: '-0.025em',
                  margin: '0 0 16px',
                }}
              >
                See Where Your Property Business Stands.
              </h2>
              <p style={{ fontSize: '0.98rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6, margin: '0 0 24px' }}>
                Authoritative financial reporting built on spring services and double-entry general ledger. Customers configure their own commercial banks, M-Pesa shortcodes, and petty cash floats with zero data fabrication.
              </p>

              <Link
                to="/features/financial-management"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: BRAND_TOKENS.colors.primary,
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  textDecoration: 'none',
                }}
              >
                <span>Explore General Ledger & Audit Trail</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: GROUNDED AI ASSISTANT
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          backgroundColor: BRAND_TOKENS.colors.darkNavy,
          color: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(3, 216, 191, 0.15)',
              color: BRAND_TOKENS.colors.secondary,
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '0.80rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} />
            <span>Groq Llama 3.3 Intelligence</span>
          </div>

          <h2
            style={{
              fontFamily: BRAND_TOKENS.fonts.sans,
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              margin: '0 auto 18px',
              maxWidth: '820px',
            }}
          >
            Understand Your Data. Make Better Decisions.
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 56px',
            }}
          >
            Ask complex operational questions in plain language. Our grounded AI calculates collection efficiency, analyzes arrears aging beyond 60 days, and drafts renewal reminders with exact record citations.
          </p>

          {/* Interactive AI Preview Card */}
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              backgroundColor: BRAND_TOKENS.colors.darkSurface,
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '36px',
              textAlign: 'left',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(0, 87, 252, 0.25)',
                padding: '14px 18px',
                borderRadius: '14px',
                marginBottom: '20px',
                border: '1px solid rgba(0, 87, 252, 0.4)',
                fontSize: '0.90rem',
                color: '#FFFFFF',
              }}
            >
              "What is our collection efficiency this month, and which tenants owe rent beyond 30 days?"
            </div>

            <div style={{ color: '#E2E8F0', fontSize: '0.88rem', lineHeight: 1.65 }}>
              <div style={{ fontWeight: 700, color: BRAND_TOKENS.colors.secondary, marginBottom: '8px' }}>
                Guri24 Intelligence Analysis:
              </div>
              <div>• <strong>Current Collection Efficiency:</strong> 92.4% across 46 active units.</div>
              <div>• <strong>Total Invoiced:</strong> KES 1,840,000 | <strong>Collected:</strong> KES 1,700,000.</div>
              <div>• <strong>Overdue Arrears (&gt;30 Days):</strong> 2 tenants (Unit B4 KES 45,000; Unit 12A KES 25,000).</div>
              <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#94A3B8' }}>
                Grounded sources: Spring financial transactions table, Safaricom Daraja ledger cache.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: HOW IT WORKS (4 STEPS)
          ========================================================================= */}
      <section
        id="how-it-works"
        style={{
          padding: '96px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.80rem', fontWeight: 700, color: BRAND_TOKENS.colors.primary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Structured Implementation
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.025em', margin: '0 0 54px' }}>
            How Guri24 Works
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              textAlign: 'left',
            }}
          >
            {[
              {
                step: '01',
                title: 'Create Your Organization',
                desc: 'Register your legal entity, base currency (KES), tax PIN, and administrator profile with strict database-level isolation.',
              },
              {
                step: '02',
                title: 'Configure Your Workspace',
                desc: 'Use the 10-step Client Finance Configuration Wizard to map commercial bank accounts, Paybill shortcodes, and petty cash floats.',
              },
              {
                step: '03',
                title: 'Add Properties & Invite Team',
                desc: 'Set up buildings, floors, and units. Send secure single-use invitation tokens with scoped role-based access control.',
              },
              {
                step: '04',
                title: 'Manage Your Operations',
                desc: 'Collect rent via automated M-Pesa STK push, log maintenance requests, and review balanced double-entry financial statements.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: BRAND_TOKENS.colors.bgCanvas,
                  padding: '32px 28px',
                  borderRadius: '20px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: BRAND_TOKENS.colors.primary, marginBottom: '12px' }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '1.10rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, margin: '0 0 10px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.55, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: CUSTOMER TYPES
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          backgroundColor: BRAND_TOKENS.colors.bgCanvas,
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.025em', margin: '0 0 54px' }}>
            Built for Every Property Professional
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              textAlign: 'left',
            }}
          >
            {[
              {
                to: '/solutions/landlords',
                title: 'Individual Landlords',
                desc: 'Simple mobile M-Pesa collections, tenant SMS reminders, and instant visibility into occupancy and unpaid rent.',
              },
              {
                to: '/solutions/property-managers',
                title: 'Property Managers',
                desc: 'Multi-property portfolios, property-scoped staff management, vendor maintenance tickets, and landlord reports.',
              },
              {
                to: '/solutions/real-estate-companies',
                title: 'Real Estate Companies',
                desc: 'Corporate scale with multi-bank accounting, multi-branch tracking, and enterprise role-based governance.',
              },
              {
                to: '/solutions/estate-managers',
                title: 'Gated Communities & Estates',
                desc: 'Service charge assessments, security guard gate communications, and common amenity maintenance tracking.',
              },
            ].map((cust, idx) => (
              <Link
                key={idx}
                to={cust.to}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '32px 28px',
                  borderRadius: '20px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: BRAND_TOKENS.shadows.sm,
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = BRAND_TOKENS.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = BRAND_TOKENS.colors.slateBorder;
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, margin: '0 0 10px' }}>
                    {cust.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.55, margin: 0 }}>
                    {cust.desc}
                  </p>
                </div>
                <div style={{ marginTop: '20px', fontSize: '0.84rem', fontWeight: 700, color: BRAND_TOKENS.colors.primary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>View solution</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: SECURITY & PRIVACY
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <ShieldCheck size={28} />
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.025em', margin: '0 0 16px' }}>
            Your Business. Your Workspace. Your Data.
          </h2>

          <p style={{ fontSize: '1.02rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 48px' }}>
            Every customer organization has an independent workspace. Data is logically isolated via PostgreSQL row-level security and organization-scoped foreign keys.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              textAlign: 'left',
            }}
          >
            {[
              { title: 'Strict Multi-Tenant Isolation', desc: 'Queries and mutations are strictly scoped to verified JWT tenant context. Cross-organization access is impossible.' },
              { title: 'Transactional Outbox Pattern', desc: 'Financial ledgers commit atomically. SMS and email deliveries are decoupled into an asynchronous retry queue.' },
              { title: 'KDPA 2019 Alignment', desc: 'Designed in compliance with the Kenya Data Protection Act 2019 principles for lawful, transparent tenant data processing.' },
            ].map((sec, idx) => (
              <div key={idx} style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, padding: '24px', borderRadius: '16px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, margin: '0 0 8px' }}>
                  {sec.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.55, margin: 0 }}>
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: PRICING PREVIEW
          ========================================================================= */}
      <section
        id="pricing"
        style={{
          padding: '96px 24px',
          backgroundColor: BRAND_TOKENS.colors.bgCanvas,
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.025em', margin: '0 0 16px' }}>
            Transparent Kenyan SaaS Pricing
          </h2>
          <p style={{ fontSize: '1.02rem', color: BRAND_TOKENS.colors.slateSubtle, margin: '0 auto 56px' }}>
            Authoritative plans backed by backend enforcement. No hidden charges.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'stretch',
            }}
          >
            {[
              {
                name: 'Starter',
                price: 'KES 25,000',
                cadence: '/ month',
                units: 'Up to 20 units',
                features: ['1 Bank Account & 1 M-Pesa Till', 'Automated STK Push Billing', 'Living Leases State Machine', 'Tenant SMS Notifications', 'Standard Support'],
                popular: false,
              },
              {
                name: 'Growth Professional',
                price: 'KES 45,000',
                cadence: '/ month',
                units: 'Up to 100 units',
                features: ['Multiple Bank Accounts (Equity, NCBA, KCB)', 'Multiple M-Pesa Paybills', 'Double-Entry General Ledger', 'Grounded AI Financial Assistant', 'Document Intelligence OCR', 'Priority WhatsApp Support'],
                popular: true,
              },
              {
                name: 'Enterprise KE',
                price: 'KES 65,000',
                cadence: '/ month',
                units: 'Unlimited units',
                features: ['Unlimited Properties & Units', 'Custom Bank Reconciliation Mappings', 'Dedicated Multi-Tenant SLA', 'Full Audit Log Exports', 'Dedicated Customer Success Manager'],
                popular: false,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  border: plan.popular ? `2px solid ${BRAND_TOKENS.colors.primary}` : `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  boxShadow: plan.popular ? BRAND_TOKENS.shadows.xl : BRAND_TOKENS.shadows.sm,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: BRAND_TOKENS.colors.primary,
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 16px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: BRAND_TOKENS.colors.slateSubtle, marginTop: '4px' }}>
                    {plan.units}
                  </div>

                  <div style={{ margin: '24px 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '2.1rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: '0.86rem', color: BRAND_TOKENS.colors.slateSubtle }}>
                      {plan.cadence}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {plan.features.map((f, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: BRAND_TOKENS.colors.slateMuted }}>
                        <CheckCircle2 size={16} color="#16A34A" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/register"
                  style={{
                    backgroundColor: plan.popular ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.darkNavy,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  Get Started with {plan.name}
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '36px' }}>
            <Link to="/pricing" style={{ color: BRAND_TOKENS.colors.primary, fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none' }}>
              View full detailed pricing comparison matrix →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: FAQ ACCORDION
          ========================================================================= */}
      <section
        id="faq"
        style={{
          padding: '96px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.025em', margin: '0 0 14px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '1rem', color: BRAND_TOKENS.colors.slateSubtle }}>
              Everything you need to know about Guri24 RMS operations and onboarding.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                q: 'How does M-Pesa automated reconciliation work?',
                a: 'Guri24 integrates directly with Safaricom Daraja API. When a tenant pays via STK Push or Paybill, Daraja dispatches a C2B webhook. Guri24 verifies idempotency using the CheckoutRequestID and MpesaReceiptNumber, settles the oldest outstanding invoice FIFO, and posts the payment to the general ledger without human intervention.',
              },
              {
                q: 'How are tenant security deposits handled?',
                a: 'Tenant deposits post exclusively to Account 2100 (Tenant Security Deposit Liability held in escrow). In accordance with strict accounting rules, security deposits never touch Account 4000 (Rental Revenue) and are excluded from Net Operating Income.',
              },
              {
                q: 'Can I connect multiple commercial bank accounts?',
                a: 'Yes. Guri24 supports multiple commercial bank accounts (e.g. Equity Bank, NCBA, KCB, Stanbic, Co-op). You can assign distinct bank accounts to specific properties for rent collections, security deposit escrow, or operating expense disbursements.',
              },
              {
                q: 'Can I import my existing Excel spreadsheets?',
                a: 'Yes. Our Import Wizard and Bulk Editable Grid allow you to copy-paste or upload CSV and Excel spreadsheets for units, tenants, active leases, invoices, and historical opening balances with immediate validation before committing.',
              },
              {
                q: 'Is our tenant data secure and compliant with the Kenya Data Protection Act?',
                a: 'Yes. Guri24 enforces multi-tenant row-level database isolation. Tenant data is processed strictly for lawful lease execution under KDPA 2019 standards and is never shared across organizations or third-party marketing brokers.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  borderRadius: '16px',
                  backgroundColor: openFaqIndex === idx ? BRAND_TOKENS.colors.bgCanvas : '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: BRAND_TOKENS.colors.darkNavy,
                  }}
                  aria-expanded={openFaqIndex === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openFaqIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                      marginLeft: '12px',
                    }}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div
                    style={{
                      padding: '0 24px 20px',
                      fontSize: '0.90rem',
                      color: BRAND_TOKENS.colors.slateSubtle,
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: FINAL CALL TO ACTION
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          background: `linear-gradient(135deg, ${BRAND_TOKENS.colors.primary} 0%, #0036A8 100%)`,
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 18px',
            }}
          >
            Bring Your Property Management Into One Place.
          </h2>

          <p
            style={{
              fontSize: '1.08rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto 40px',
            }}
          >
            Start your free organization workspace today. Reconcile M-Pesa payments in seconds, maintain a balanced double-entry ledger, and give your tenants a premium experience.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                backgroundColor: '#FFFFFF',
                color: BRAND_TOKENS.colors.primary,
                padding: '14px 36px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
