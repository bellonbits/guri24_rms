import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Landmark,
  Award,
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  Layers,
  Users,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const AboutPage: React.FC = () => {
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
          SECTION 1: "VELA ARMON" ARCHITECTURAL HERO (EDGE-TO-EDGE FULL BLEED)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          minHeight: '92vh',
          backgroundImage: 'url(/hero-luxury-architecture.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 46%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px 48px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* Atmospheric Twilight Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(2, 20, 41, 0.45) 0%, rgba(2, 20, 41, 0.15) 30%, rgba(2, 20, 41, 0.3) 70%, rgba(2, 20, 41, 0.8) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Top Floating Mini Tagline */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: '0.74rem',
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: '0.08em',
              textTransform: 'lowercase',
              fontStyle: 'italic',
            }}
          >
            defined by trust &bull; sculpted by design &bull; automated by intelligence
          </div>
        </div>

        {/* Hero Title: Lowercase Architectural Luxury ("guri armon") */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1440px',
            margin: 'auto auto 40px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.4rem', color: '#03D8BF' }}>✳</span>
            <div
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 600,
              }}
            >
              A SCULPTURAL FORM RISING ABOVE THE ORDINARY
            </div>
          </div>

          <h1
            style={{
              fontSize: 'clamp(3.4rem, 8.5vw, 7.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#FFFFFF',
              margin: '0 0 16px',
              textTransform: 'lowercase',
            }}
          >
            guri<br />armon
          </h1>
        </div>

        {/* Floating Glass Stats Badge (Right Side) */}
        <div
          style={{
            position: 'absolute',
            right: '48px',
            top: '46%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: '220px',
          }}
          className="about-floating-stats"
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.24)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '18px 22px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }}>15</div>
            <div style={{ fontSize: '0.76rem', marginTop: '4px', opacity: 0.92, lineHeight: 1.3 }}>
              Years of Experience
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.24)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '18px 22px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }}>549</div>
            <div style={{ fontSize: '0.76rem', marginTop: '4px', opacity: 0.92, lineHeight: 1.3 }}>
              Estates Managed &amp; Delivered
            </div>
          </div>
        </div>

        {/* Scalloped Center Cutout with "Contact us ↗" Pill Button */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '12px 28px 0',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link
              to="/contact?type=consultation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '999px',
                backgroundColor: '#F1F5F9',
                color: '#021429',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                marginBottom: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Contact us</span>
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#021429',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                }}
              >
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "ABOUT US" EDITORIAL MANIFESTO WITH INLINE MINI PHOTO PILLS
          ========================================================================= */}
      <section
        style={{
          width: '100%',
          padding: '110px 48px 90px',
          backgroundColor: '#FFFFFF',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.8fr)',
            gap: '64px',
            alignItems: 'flex-start',
          }}
          className="about-manifesto-grid"
        >
          {/* Left Column: Lowercase Heading & Subtitle */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.2rem', color: '#D97706' }}>✳</span>
              <span style={{ fontSize: '0.76rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748B', fontWeight: 600 }}>
                development &bull; premium
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(3rem, 6vw, 5.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: '#021429',
                margin: '0 0 40px',
                textTransform: 'lowercase',
              }}
            >
              about us
            </h2>

            {/* Two Horizontal Architectural Detail Cards */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '140px',
                  height: '90px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src="/hero-apex-architecture.jpg"
                  alt="Detail 1"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  width: '140px',
                  height: '90px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src="/luxury-minimalist-living.jpg"
                  alt="Detail 2"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Flowing Editorial Typography with Inline Photo Pills */}
          <div>
            <p
              style={{
                fontSize: 'clamp(1.25rem, 2.3vw, 2.1rem)',
                fontWeight: 700,
                lineHeight: 1.45,
                letterSpacing: '-0.02em',
                color: '#021429',
                margin: '0 0 48px',
                textTransform: 'uppercase',
              }}
            >
              WE DEVELOP CONTEMPORARY PROPERTY ECOSYSTEMS WHERE ARCHITECTURE, FINANCIAL LEDGER{' '}
              <span
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: '54px',
                  height: '28px',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  margin: '0 6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src="/luxury-pool-villa.jpg"
                  alt="Inline Villa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </span>{' '}
              AND LANDSCAPE EXIST IN PERFECT{' '}
              <span
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: '54px',
                  height: '28px',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  margin: '0 6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src="/modern-organic-balconies.jpg"
                  alt="Inline Balcony"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </span>{' '}
              <span style={{ color: '#D97706' }}>BALANCE</span> OUR FOCUS IS NOT JUST TO COLLECT RENT &mdash; BUT TO CREATE SPACES THAT ELEVATE LIVING ///{' '}
              <span
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: '54px',
                  height: '28px',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  margin: '0 6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src="/hero-luxury-architecture.jpg"
                  alt="Inline Estate"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </span>
            </p>

            {/* Dual Explanatory Paragraphs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px',
                color: '#64748B',
                fontSize: '0.94rem',
                lineHeight: 1.65,
              }}
            >
              <div>
                By integrating innovative M-Pesa automated ledgers and double-entry accounting solutions,
                we ensure long-term value and zero leakage for both estate owners and investors across East Africa.
              </div>
              <div>
                By uniting architectural vision, automated tenant leasing, and legal compliance,
                we deliver exceptional residences that reflect confidence, operational clarity, and enduring distinction.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "WHU GURI ARMON" (WHY GURI24 WITH 4 FLOATING FROSTED CARDS)
          ========================================================================= */}
      <section
        style={{
          width: '100%',
          padding: '100px 48px',
          backgroundColor: '#FAFCFE',
          borderTop: '1px solid #EDF2F7',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
              gap: '64px',
              alignItems: 'center',
            }}
            className="why-grid"
          >
            {/* Left: Sculptural Lowercase Title */}
            <div>
              <div style={{ fontSize: '0.76rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, marginBottom: '12px' }}>
                architectural &bull; precision
              </div>

              <h2
                style={{
                  fontSize: 'clamp(3rem, 6.5vw, 5.8rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  margin: '0 0 24px',
                }}
              >
                <span style={{ color: '#021429' }}>whu</span>
                <br />
                <span style={{ color: '#D97706' }}>guri</span>
                <br />
                <span style={{ color: '#D97706' }}>armon</span>
              </h2>

              <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.65, maxWidth: '440px', marginBottom: '32px' }}>
                Architecture that remains relevant beyond trends and seasons &mdash; engineered with automated Kenyan financial rails, tenant portals, and immutable auditability.
              </p>

              <Link
                to="/features"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 26px',
                  borderRadius: '999px',
                  backgroundColor: '#021429',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(2, 20, 41, 0.2)',
                }}
              >
                <span>Explore Platform Architecture</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: Modern Villa Facade with 4 Floating Frosted Glass Cards */}
            <div
              style={{
                position: 'relative',
                borderRadius: '32px',
                overflow: 'hidden',
                minHeight: '520px',
                backgroundImage: 'url(/hero-apex-architecture.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.2)',
                padding: '40px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              {/* Card 1 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.28)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                <div style={{ fontSize: '0.90rem', fontWeight: 600, lineHeight: 1.5 }}>
                  Architectural experience shaped by years of refined practice.
                </div>
              </div>

              {/* Card 2 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.28)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                <div style={{ fontSize: '0.90rem', fontWeight: 600, lineHeight: 1.5 }}>
                  Consistently executed financial reconciliations with clarity and precision.
                </div>
              </div>

              {/* Card 3 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: '24px',
                  color: '#021429',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                <div style={{ fontSize: '0.90rem', fontWeight: 700, lineHeight: 1.5 }}>
                  Every residence shaped around your vision and tenant satisfaction.
                </div>
              </div>

              {/* Card 4 */}
              <div
                style={{
                  backgroundColor: 'rgba(2, 20, 41, 0.72)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
              >
                <div style={{ fontSize: '0.90rem', fontWeight: 600, lineHeight: 1.5 }}>
                  From concept to completion &mdash; seamless, M-Pesa automated, and transparent.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CORE ENGINEERING PILLARS & COMPLIANCE
          ========================================================================= */}
      <section
        style={{
          width: '100%',
          padding: '90px 48px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EDF2F7',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#03D8BF', marginBottom: '8px' }}>
              Operational Foundation
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', fontWeight: 900, color: '#021429', letterSpacing: '-0.03em', margin: 0 }}>
              The Four Engineering Pillars
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}
            className="pillars-grid"
          >
            {[
              {
                num: '01',
                title: 'Strict Double-Entry',
                desc: 'Debit == Credit verified on every automated transaction. Reversal entries maintain immutable audit records.',
                icon: Landmark,
              },
              {
                num: '02',
                title: 'Automated M-Pesa C2B',
                desc: 'Safaricom Daraja 2.0 webhooks allocate payments via FIFO to invoices in sub-second intervals with zero human delay.',
                icon: ShieldCheck,
              },
              {
                num: '03',
                title: 'Granular RBAC',
                desc: 'Caretakers log meter readings without seeing financial ledgers. Landlords see portfolio returns with zero operational clutter.',
                icon: Layers,
              },
              {
                num: '04',
                title: 'KDPA 2019 Certified',
                desc: 'All tenant IDs, phone numbers, and lease agreements are encrypted at rest and compliant with Kenyan data privacy laws.',
                icon: Award,
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  style={{
                    backgroundColor: '#FAFCFE',
                    borderRadius: '24px',
                    padding: '32px 28px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          backgroundColor: '#021429',
                          color: '#03D8BF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#CBD5E1' }}>{pillar.num}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#021429', marginBottom: '10px' }}>
                      {pillar.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 900px) {
          .about-manifesto-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .why-grid {
            grid-template-columns: 1fr !important;
          }
          .pillars-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .about-floating-stats {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
