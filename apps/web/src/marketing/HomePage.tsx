import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Phone,
  Mail,
  Send,
  Building2,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';
import { TaglineReveal } from './TaglineReveal';

export const HomePage: React.FC = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    units: '25-100 units',
    message: '',
  });

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSubmitted(true);
    setTimeout(() => {
      setConsultationSubmitted(false);
      setIsConsultationOpen(false);
      setConsultationForm({ name: '', email: '', phone: '', units: '25-100 units', message: '' });
    }, 2200);
  };

  const services = [
    {
      num: '01',
      title: 'Portfolio Architecture',
      desc: 'From multi-tier land titles to individual unit sub-metering, zoning, and multi-branch legal ownership.',
      image: '/hero-luxury-architecture.jpg',
      tag: 'Core Operations',
    },
    {
      num: '02',
      title: 'Automated Reconciliation',
      desc: 'Real-time Safaricom Daraja C2B M-Pesa IPN matching and multi-bank statement OCR in under 2 seconds.',
      image: '/luxury-minimalist-living.jpg',
      tag: 'Financial Engine',
    },
    {
      num: '03',
      title: 'Tenant & Lease Governance',
      desc: 'Digital leases, automated renewal alerts, and audited escrow security deposit liability management.',
      image: '/modern-organic-balconies.jpg',
      tag: 'Lease Compliance',
    },
    {
      num: '04',
      title: 'General Ledger Authority',
      desc: 'Immutable double-entry debit-credit accounting, trial balances, balance sheets, and KRA withholding tax reports.',
      image: '/featured_nairobi_apartment.jpg',
      tag: 'Accounting Core',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        fontFamily: BRAND_TOKENS.fonts.sans,
        color: '#0F172A',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* =========================================================================
          SECTION 1: GRAND ARCHITECTURAL HERO CARD (MATCHES APEX ARC REFERENCE)
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
            minHeight: '660px',
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

          {/* Hero Typography & CTA (Positioned cleanly on the bottom left) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '680px',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.4rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: '#FFFFFF',
                marginBottom: '18px',
              }}
            >
              Designing Spaces
              <br />
              That Inspire &amp; Endure
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.22rem)',
                color: 'rgba(255, 255, 255, 0.90)',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '560px',
                fontWeight: 400,
              }}
            >
              We transform property operations into timeless financial architectures, blending automated M-Pesa reconciliation with double-entry excellence.
            </p>

            <button
              onClick={() => setIsConsultationOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#021429',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: '999px',
                fontSize: '0.94rem',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = '#0057FC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = '#021429';
              }}
            >
              <span>Schedule a Free Consultation</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT COMPANY & KEY METRICS (MATCHES APEX ARC REFERENCE)
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
          className="about-company-grid"
        >
          {/* Left Column: Mission & Trust Logos */}
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
                color: '#475569',
                marginBottom: '36px',
                maxWidth: '540px',
              }}
            >
              At Guri24, we believe that property management is more than just collecting rent; it&apos;s about creating financial environments that enhance tenant experience, automate bank reconciliation, and preserve long-term capital value.
            </p>

            {/* Authority / Partner Trust Logos */}
            <div>
              <div
                style={{
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  color: '#94A3B8',
                  marginBottom: '16px',
                }}
              >
                Integrated with Kenya Financial &amp; Telecom Leaders
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  flexWrap: 'wrap',
                  filter: 'grayscale(100%) opacity(70%)',
                }}
              >
                {['Safaricom Daraja', 'Co-op Bank', 'Equity Bank', 'Stanbic Bank', 'KDPA 2019'].map((partner, pi) => (
                  <div
                    key={pi}
                    style={{
                      fontSize: '0.90rem',
                      fontWeight: 800,
                      color: '#021429',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 4 Key Numerals in 2x2 Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px 32px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 'clamp(2.6rem, 4vw, 3.6rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                25+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
                Years of Excellence in Architecture &amp; Real Estate
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(2.6rem, 4vw, 3.6rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                500+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
                Estates &amp; Portfolios Successfully Managed
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(2.6rem, 4vw, 3.6rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                98%
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
                Client &amp; Landlord Retention Rate
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(2.6rem, 4vw, 3.6rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                15+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
                Counties &amp; Urban Centers with Active Estates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "SERVICES WE PROVIDE" (4 CARDS MATCHING REFERENCE EXACTLY)
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1320px',
          margin: '0 auto 100px',
          padding: '0 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Header with Carousel Arrow Controls (matches reference) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '36px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
              fontWeight: 900,
              color: '#021429',
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Services we provide
          </h2>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveServiceIdx((prev) => (prev > 0 ? prev - 1 : services.length - 1))}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#021429',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label="Previous service"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => setActiveServiceIdx((prev) => (prev < services.length - 1 ? prev + 1 : 0))}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#021429',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label="Next service"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* 4 Service Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
          className="services-four-grid"
        >
          {services.map((svc) => (
            <div
              key={svc.num}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Rounded Photographic Card with Badge (matches reference) */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '240px',
                  backgroundColor: '#021429',
                  marginBottom: '18px',
                  boxShadow: '0 8px 24px -6px rgba(2, 20, 41, 0.08)',
                }}
              >
                <img
                  src={svc.image}
                  alt={svc.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Number Badge (top-left) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(2, 20, 41, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.80rem',
                    fontWeight: 800,
                  }}
                >
                  {svc.num}
                </div>
              </div>

              {/* Title & Description */}
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#021429',
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                }}
              >
                {svc.title}
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#64748B',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {svc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "OUR PORTFOLIO OF PIONEERING DESIGN" (MASONRY GRID)
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1320px',
          margin: '0 auto 100px',
          padding: '0 32px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
            gap: '48px',
            alignItems: 'start',
            marginBottom: '40px',
          }}
          className="portfolio-intro-grid"
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
                fontWeight: 900,
                color: '#021429',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Our Portfolio of
              <br />
              Pioneering Design
            </h2>
            <p
              style={{
                fontSize: '1.02rem',
                color: '#64748B',
                lineHeight: 1.6,
                maxWidth: '480px',
              }}
            >
              Explore our selected works that demonstrate our commitment to design excellence, innovation, and client satisfaction.
            </p>
          </div>

          {/* Masonry Photographic Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            {/* Top Left: Commercial Restaurant */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: '190px',
                backgroundColor: '#021429',
              }}
            >
              <img
                src="/hero-luxury-architecture.jpg"
                alt="Commercial Restaurant"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  right: '16px',
                  backgroundColor: 'rgba(2, 20, 41, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                }}
              >
                Commercial Restaurant
              </div>
            </div>

            {/* Tall Right: Private House */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                gridRow: 'span 2',
                minHeight: '390px',
                backgroundColor: '#021429',
              }}
            >
              <img
                src="/hero-apex-architecture.jpg"
                alt="Private House"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(2, 20, 41, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                }}
              >
                Private House
              </div>
            </div>

            {/* Bottom Left 1: Hotel Rooms */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: '190px',
                backgroundColor: '#021429',
              }}
            >
              <img
                src="/luxury-pool-villa.jpg"
                alt="Hotel Rooms"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  right: '16px',
                  backgroundColor: 'rgba(2, 20, 41, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                }}
              >
                Hotel Rooms
              </div>
            </div>
          </div>
        </div>

        {/* Center Button (matches reference "See More Projects") */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link
            to="/features"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 32px',
              borderRadius: '999px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#021429',
              fontSize: '0.90rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#021429';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#021429';
            }}
          >
            <span>See More Projects</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CUSTOMER SAYING (TESTIMONIALS)
          ========================================================================= */}
      <section
        style={{
          padding: '80px 32px',
          backgroundColor: '#FAFBFD',
          borderTop: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                color: '#021429',
                letterSpacing: '-0.025em',
                marginBottom: '12px',
              }}
            >
              Customer Saying
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#64748B' }}>
              Trusted by 500+ leading property management firms and real estate developers across East Africa.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                name: 'Samuel Kamau',
                role: 'Managing Director, Skyline Real Estate Ltd',
                estate: 'Kilimani Executive Suites (84 units)',
                quote:
                  'Guri24 automated our entire month-end close. Previously, reconciling M-Pesa receipts against tenant ledgers consumed 4 days every month. Now, our general ledger is balanced in real time.',
              },
              {
                name: 'Brenda Mutua',
                role: 'Principal Property Manager, Apex Holdings',
                estate: 'Westlands Commercial Tower (140 units)',
                quote:
                  'The double-entry general ledger architecture gives our property owners absolute trust. Our landlords log in to download audit-ready statements without calling our accounting team.',
              },
              {
                name: 'Farah Hussein',
                role: 'Finance Director, Oasis Court HOA',
                estate: 'Lavington Green Gated Community (52 units)',
                quote:
                  'Service charge arrears dropped by 92% within 60 days of rolling out Guri24 automated SMS reminders and STK push payments. Truly transformative software.',
              },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px -6px rgba(2, 20, 41, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <p style={{ color: '#334155', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '24px', fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#021429',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#021429' }}>{t.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{t.role}</div>
                    <div style={{ fontSize: '0.72rem', color: '#0057FC', fontWeight: 600 }}>{t.estate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CONSULTATION MODAL DIALOG
          ========================================================================= */}
      {isConsultationOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 20, 41, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsConsultationOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsConsultationOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={18} />
            </button>

            {consultationSubmitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#021429', marginBottom: '8px' }}>
                  Consultation Booked
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Thank you, {consultationForm.name}. A Guri24 property architecture advisor will connect with you within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit}>
                <div style={{ display: 'inline-flex', padding: '4px 12px', backgroundColor: '#EFF5FF', color: '#0057FC', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
                  Live Executive Demo
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#021429', marginBottom: '8px' }}>
                  Book a Private Consultation
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                  Discover how Guri24 reconciles M-Pesa Paybills, multi-bank statements, and double-entry general ledgers for your properties.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Mwangi"
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="david@company.com"
                        value={consultationForm.email}
                        onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                        Phone (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        placeholder="+254 7..."
                        value={consultationForm.phone}
                        onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                      Units Managed
                    </label>
                    <select
                      value={consultationForm.units}
                      onChange={(e) => setConsultationForm({ ...consultationForm, units: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                    >
                      <option value="1-25 units">1 - 25 units (Starter)</option>
                      <option value="25-100 units">25 - 100 units (Growth)</option>
                      <option value="101-350 units">101 - 350 units (Scale)</option>
                      <option value="350+ units">350+ units (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#021429',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Confirm Consultation</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 960px) {
          .about-company-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .services-four-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
          .portfolio-intro-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .services-four-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
