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
          {/* Subtle Dark Vignette Overlay on the Left for Crystal-Clear Text */}
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
              <span>01 &bull; ABOUT GURI24</span>
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
              Engineering Spaces
              <br />
              That Inspire &amp; Endure
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
              Guri24 replaces paper receipts, chaotic WhatsApp spreadsheets, and manual M-Pesa statement reconciliation with an authoritative, enterprise-grade property cloud.
            </p>

            <Link
              to="/contact?type=consultation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
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
              <span>Schedule a Free Consultation</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "ABOUT COMPANY" & 4 KEY STATS
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1320px',
          margin: '0 auto 96px',
          padding: '0 32px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '64px',
            alignItems: 'center',
          }}
          className="editorial-about-grid"
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
                fontWeight: 900,
                color: '#021429',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                lineHeight: 1.15,
              }}
            >
              About Company
            </h2>

            <p
              style={{
                fontSize: '1.08rem',
                lineHeight: 1.65,
                color: '#1E293B',
                fontWeight: 500,
                marginBottom: '16px',
              }}
            >
              We are a forward-thinking technology team creating unique property management architectures that blend modern software design, double-entry financial discipline, and automated banking reconciliation together.
            </p>

            <p style={{ color: '#64748B', lineHeight: 1.65, fontSize: '0.96rem', marginBottom: '32px' }}>
              Built with memory-safe Rust services and automated banking connectors, Guri24 guarantees that every shilling billed matches an immutable general ledger entry.
            </p>

            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '999px',
                backgroundColor: '#021429',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              <span>Consultation</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* 4 Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '36px 28px',
            }}
            className="metrics-row-grid"
          >
            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 900, color: '#021429', letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '6px' }}>
                25+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500 }}>
                Years of Excellence in Architecture &amp; Real Estate
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 900, color: '#021429', letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '6px' }}>
                500+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500 }}>
                Estates &amp; Portfolios Successfully Managed
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 900, color: '#021429', letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '6px' }}>
                98%
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500 }}>
                Client &amp; Landlord Retention Rate
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 900, color: '#021429', letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '6px' }}>
                15+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500 }}>
                Counties with Active Residential Estates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CORE ENGINEERING PRINCIPLES
          ========================================================================= */}
      <section
        style={{
          padding: '88px 32px 100px',
          backgroundColor: '#FAFBFD',
          borderTop: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.6vw, 3rem)',
                fontWeight: 900,
                color: '#021429',
                letterSpacing: '-0.03em',
                marginBottom: '14px',
              }}
            >
              Foundational Architectural Principles
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.6 }}>
              Our platform is built upon four non-negotiable operational standards that guarantee accuracy and security.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: Landmark,
                title: 'Zero Guesswork Accounting',
                desc: 'Every financial entry satisfies double-entry debit-credit balance. No ghost balances or fabricated metrics.',
              },
              {
                icon: Sparkles,
                title: 'Instant M-Pesa IPN Reconciliation',
                desc: 'Real-time Safaricom Daraja C2B webhooks match payments directly to tenant lease ledgers in under 2 seconds.',
              },
              {
                icon: Layers,
                title: 'Multi-Tier Portfolio Hierarchy',
                desc: 'Easily organize by Organization > Estate > Building > Floor > Unit with inherited billing policies.',
              },
              {
                icon: ShieldCheck,
                title: 'Bank-Grade Tenant Isolation',
                desc: 'Hardened database row-level security isolates each client organization with TLS 1.3 and AES-256 encryption.',
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '36px',
                    boxShadow: '0 8px 24px -6px rgba(2, 20, 41, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: '#EFF5FF',
                        color: '#0057FC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#021429', marginBottom: '10px' }}>
                      {p.title}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {p.desc}
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
          .editorial-about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .metrics-row-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};
