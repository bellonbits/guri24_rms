import React, { useState } from 'react';
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
          SECTION 1: ARCHITECTURAL HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '70vh',
          backgroundImage: 'url(/hero-luxury-architecture.jpg)',
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
        {/* Dark Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(2, 20, 41, 0.72) 0%, rgba(2, 20, 41, 0.45) 50%, rgba(2, 20, 41, 0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Giant Sky Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(64px, 15vw, 190px)',
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
          OUR STORY
        </div>

        {/* Content Wrapper */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '880px', margin: '0 auto' }}>
          {/* Category Pill */}
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
              marginBottom: '24px',
            }}
          >
            <span style={{ color: '#03D8BF' }}>01</span>
            <span>&bull;</span>
            <span>ABOUT GURI24</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              lineHeight: 1.12,
              marginBottom: '24px',
            }}
          >
            Engineering The Future of{' '}
            <span style={{ color: '#B89047' }}>Property Ecosystems</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.65,
              maxWidth: '720px',
              margin: '0 auto 36px',
              fontWeight: 400,
            }}
          >
            Guri24 replaces paper receipts, chaotic WhatsApp spreadsheets, and manual M-Pesa statement reconciliation with an authoritative, enterprise-grade property cloud.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/contact?type=consultation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#021429',
                padding: '12px 28px',
                borderRadius: '999px',
                fontSize: '0.92rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <span>Book Executive Demo</span>
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '999px',
                fontSize: '0.92rem',
                fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <span>Explore Platform</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "WHO WE ARE" & ASYMMETRIC STORY GRID
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
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '64px',
            alignItems: 'center',
          }}
          className="editorial-about-grid"
        >
          {/* Left Column: Heading & Mission */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '999px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '20px',
              }}
            >
              <span>01</span>
              <span>-</span>
              <span>our foundation</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: '#021429',
                margin: '0 0 24px',
              }}
            >
              WHO <span style={{ color: '#B89047' }}>WE ARE</span>
            </h2>

            <p
              style={{
                fontSize: '1.18rem',
                lineHeight: 1.65,
                color: '#1E293B',
                fontWeight: 500,
                marginBottom: '20px',
              }}
            >
              We are a forward-thinking technology team creating unique property management architectures that blend modern software design, double-entry financial discipline, and automated banking reconciliation together.
            </p>

            <p style={{ color: '#64748B', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '28px' }}>
              For decades, property management across Kenya has operated on manual friction: tenants paying via disparate Paybills, caretakers scribbling receipts in duplicate books, bank statements arriving weeks after month-end, and landlords left guessing their actual Net Operating Income.
            </p>

            <p style={{ color: '#64748B', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '36px' }}>
              We engineered Guri24 RMS to solve this fundamentally. Built with memory-safe Rust services and automated banking connectors, Guri24 guarantees that every shilling billed matches an immutable general ledger entry.
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  border: '1px solid #021429',
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
              <Link
                to="/pricing"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#0057FC',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>View tier pricing</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: High-End Asymmetric Architectural Photo Card */}
          <div
            style={{
              position: 'relative',
              borderRadius: '28px',
              overflow: 'hidden',
              backgroundColor: '#021429',
              boxShadow: '0 25px 60px -15px rgba(2, 20, 41, 0.25)',
              minHeight: '480px',
            }}
          >
            <img
              src="/modern-organic-balconies.jpg"
              alt="Organic curved modern architecture"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Detail Lens Floating Overlay */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Westlands HQ</span>
              <ArrowUpRight size={14} />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '28px',
                background: 'linear-gradient(0deg, rgba(2,20,41,0.85) 0%, transparent 100%)',
                color: '#FFFFFF',
              }}
            >
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#03D8BF', fontWeight: 700, marginBottom: '4px' }}>
                Architecture &bull; Technology
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                High-Performance Real Estate Infrastructure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: KEY METRICS BAR
          ========================================================================= */}
      <section
        style={{
          padding: '64px 48px',
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
            textAlign: 'left',
          }}
          className="metrics-row-grid"
        >
          <div>
            <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              300+
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, marginTop: '6px' }}>
              Satisfied Client Portfolios
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              620+
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, marginTop: '6px' }}>
              Estates &amp; Buildings Managed
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              100%
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, marginTop: '6px' }}>
              Double-Entry Ledger Invariance
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              KDPA
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, marginTop: '6px' }}>
              Kenya Data Protection Certified
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CORE ENGINEERING PRINCIPLES
          ========================================================================= */}
      <section
        style={{
          padding: '88px 48px',
          backgroundColor: '#FAFBFD',
          borderBottom: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px' }}>
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
              <span>02</span>
              <span>-</span>
              <span>engineering discipline</span>
            </div>
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

      {/* =========================================================================
          SECTION 5: CLOSING CONSULTATION BANNER
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
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(0, 87, 252, 0.35) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
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
              Partner with the Property Cloud Built for Scale
            </h2>
            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '32px' }}>
              Schedule a personalized walkthrough with our senior property technology architects today.
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
