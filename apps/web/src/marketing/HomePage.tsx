import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
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
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';
import { TaglineReveal } from './TaglineReveal';

export const HomePage: React.FC = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
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
          SECTION 1: HERO SECTION ("AXIOMA / GURI24" LUXURY ARCHITECTURE)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          minHeight: '94vh',
          backgroundImage: 'url(/hero-luxury-architecture.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 48%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px 40px 48px',
          boxSizing: 'border-box',
        }}
      >
          {/* Subtle Atmospheric Dark Vignette Overlay for Crisp Readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(2, 20, 41, 0.55) 0%, rgba(2, 20, 41, 0.15) 35%, rgba(2, 20, 41, 0.25) 70%, rgba(2, 20, 41, 0.75) 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Giant Typographic Watermark in Background Sky ("GURI24") */}
          <div
            style={{
              position: 'absolute',
              top: '11%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 'clamp(68px, 14vw, 185px)',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: 'rgba(255, 255, 255, 0.28)',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              zIndex: 1,
              userSelect: 'none',
              whiteSpace: 'nowrap',
              lineHeight: 1,
            }}
          >
            GURI24
          </div>

          {/* --- HERO TOP NAVIGATION BAR --- */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              maxWidth: '1360px',
              margin: '0 auto',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {/* Brand Logo Mark */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                color: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Guri24"
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Guri<span style={{ color: '#03D8BF' }}>24</span>
              </span>
            </Link>

            {/* Pill Navigation Capsule */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '5px 8px',
                borderRadius: '999px',
              }}
              className="desktop-hero-nav"
            >
              {[
                { to: '/', label: 'Home', active: true },
                { to: '/about', label: 'About us' },
                { to: '/features', label: 'Features' },
                { to: '/solutions', label: 'Solutions' },
                { to: '/pricing', label: 'Pricing' },
                { to: '/contact', label: 'Contacts' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: item.active ? '#021429' : 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: item.active ? '#FFFFFF' : 'transparent',
                    boxShadow: item.active ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right: Social Indicators & Primary Consultation Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="hero-socials">
                {['f', 'ig', 'x'].map((social, i) => (
                  <div
                    key={i}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {social}
                  </div>
                ))}
              </div>

              {/* Consultation Pill Button with Black Circular Arrow (matches reference) */}
              <button
                onClick={() => setIsConsultationOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#021429',
                  padding: '7px 7px 7px 18px',
                  borderRadius: '999px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Consultation</span>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#021429',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowUpRight size={15} />
                </div>
              </button>
            </div>
          </div>

          {/* --- HERO EDITORIAL CORNER MICRO-NOTES --- */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              maxWidth: '1360px',
              margin: '28px auto',
              width: '100%',
            }}
          >
            <div
              style={{
                maxWidth: '240px',
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              We design property ecosystems that combine aesthetics, intelligence, and financial authority.
            </div>

            <div
              style={{
                maxWidth: '220px',
                textAlign: 'right',
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              Designing the property management infrastructure of the future.
            </div>
          </div>

          {/* --- HERO FLOATING STAT BADGES OVER VILLA (RIGHT SIDE MATCHING REFERENCE) --- */}
          <div
            style={{
              position: 'absolute',
              right: '36px',
              top: '48%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            className="hero-floating-badges"
          >
            {/* Top Stat Card */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '18px',
                padding: '16px 20px',
                color: '#FFFFFF',
                width: '190px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '4px' }}>
                15+
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.35 }}>
                Years of architectural excellence & automated reconciliation
              </div>
            </div>

            {/* Lower Stat Card */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '18px',
                padding: '16px 20px',
                color: '#FFFFFF',
                width: '190px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '4px' }}>
                549+
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.35 }}>
                Active residential & commercial estates managed with excellence
              </div>
            </div>
          </div>

          {/* --- HERO BOTTOM FOOTER CONTROLS --- */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              maxWidth: '1360px',
              margin: '0 auto',
              width: '100%',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Bottom Left Note */}
            <div
              style={{
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.92)',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              Closer to design,
              <br />
              closer to yourself.
            </div>

            {/* Center Pill Button (matches the reference Consultation pill) */}
            <div style={{ margin: '0 auto' }}>
              <button
                onClick={() => setIsConsultationOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#021429',
                  padding: '9px 9px 9px 24px',
                  borderRadius: '999px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.22)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>Consultation</span>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#021429',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowUpRight size={17} />
                </div>
              </button>
            </div>

            {/* Bottom Right Tag */}
            <div
              style={{
                fontSize: '0.80rem',
                color: 'rgba(255, 255, 255, 0.75)',
                fontWeight: 500,
              }}
            >
              Guri24 RMS • Nairobi &bull; KES
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: "01 - about us" & "WHO WE ARE" (EDITORIAL ASYMMETRIC GRID)
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
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
              {/* Step / Category Pill */}
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
                  color: '#64748B',
                  marginBottom: '28px',
                  textTransform: 'lowercase',
                  letterSpacing: '0.04em',
                }}
              >
                01 - about us
              </div>

              {/* Bold Title with Ochre/Gold Accent */}
              <h2
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  fontWeight: 800,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.08,
                  marginBottom: '24px',
                  textTransform: 'uppercase',
                }}
              >
                WHO <span style={{ color: '#C59B27' }}>WE ARE</span>
              </h2>

              {/* Editorial Lead Paragraph */}
              <p
                style={{
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.22rem)',
                  color: '#334155',
                  lineHeight: 1.6,
                  marginBottom: '36px',
                  fontWeight: 500,
                  maxWidth: '540px',
                }}
              >
                We are a forward-thinking property & financial technology team creating authoritative living spaces and management ecosystems that blend modern design, comfort, automated M-Pesa reconciliation, and double-entry accounting together.
              </p>

              {/* Consultation Pill Action */}
              <button
                onClick={() => setIsConsultationOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#021429',
                  padding: '9px 9px 9px 24px',
                  borderRadius: '999px',
                  fontSize: '0.90rem',
                  fontWeight: 700,
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#021429';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Consultation</span>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#021429',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowUpRight size={16} />
                </div>
              </button>
            </div>

            {/* Right Column: Architectural Photo with Curved Organic Balconies */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '28px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 50px -15px rgba(2, 20, 41, 0.12)',
                  aspectRatio: '4 / 4.4',
                  maxHeight: '480px',
                  width: '100%',
                  backgroundColor: '#F1F5F9',
                }}
              >
                <img
                  src="/modern-organic-balconies.jpg"
                  alt="Modern organic curved balconies"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: VISUAL SHOWCASE / ARCHITECTURAL GALLERY (ASYMMETRIC GRID)
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
              gridTemplateColumns: '1.45fr 0.65fr 1.35fr',
              gap: '20px',
              alignItems: 'stretch',
            }}
            className="gallery-asymmetric-grid"
          >
            {/* Card 1: Wide Sunset Glass Facade with Frosted Detail Badge */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#0F172A',
                minHeight: '380px',
                boxShadow: '0 16px 36px -10px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="/featured_nairobi_apartment.jpg"
                alt="Architectural glass building at sunset"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Centered Frosted "Detail ↗" Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.28)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                }}
              >
                Detail ↗
              </div>

              {/* Bottom Pill Badges */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: '20px',
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {['Best of Best', 'Quality Guarantee', 'Good to buy'].map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#021429',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: Two Stacked Vertical Architectural Photos */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: '#E2E8F0',
                }}
              >
                <img
                  src="/hero-luxury-architecture.jpg"
                  alt="Modern architectural detail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: '#E2E8F0',
                }}
              >
                <img
                  src="/luxury-pool-villa.jpg"
                  alt="Contemporary exterior"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Card 3: Minimalist Ocean Living Room with Circular "View All" Overlay */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#0F172A',
                minHeight: '380px',
                boxShadow: '0 16px 36px -10px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="/luxury-minimalist-living.jpg"
                alt="Luxury living room overlooking ocean"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Large Concentric Rings "View All" Target Overlay */}
              <Link
                to="/features"
                style={{
                  position: 'absolute',
                  top: '28%',
                  right: '18%',
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  color: '#021429',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  transition: 'transform 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>↗</span>
                </div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700 }}>View All</div>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: KEY METRICS BAR (HIGH-IMPACT NUMERALS MATCHING REFERENCE)
            ========================================================================= */}
        <section
          style={{
            padding: '54px 48px',
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
                Satisfied Client&apos;s &amp; Portfolios
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                620+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, marginTop: '6px' }}>
                Projects &amp; Estates Compiled
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                60+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, marginTop: '6px' }}>
                Expert Team &amp; Bank Channels
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#021429', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                4.8%
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500, marginTop: '6px' }}>
                Reviews Ratings &amp; Yield Rise
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: "Read our latest Resources" (EDITORIAL MAGAZINE CARDS)
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1F5F9',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            {/* Section Header Split */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '40px',
              marginBottom: '48px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
                  fontWeight: 800,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  maxWidth: '380px',
                  margin: 0,
                }}
              >
                Read our latest
                <br />
                Resources
              </h2>
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#64748B',
                  lineHeight: 1.6,
                  maxWidth: '440px',
                  margin: 0,
                }}
              >
                Experience urban sophistication in this modern apartment featuring open-plan living, floor-to-ceiling glass, automated M-Pesa rent reconciliation, and general ledger compliance.
              </p>
            </div>
          </div>

          {/* Two Editorial Cards Matching Reference */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
            className="editorial-cards-grid"
          >
            {/* Card 1: Villa Architecture */}
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(2, 20, 41, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ height: '260px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                <img
                  src="/hero-luxury-architecture.jpg"
                  alt="Modern architectural residence"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#021429',
                      lineHeight: 1.35,
                      marginBottom: '16px',
                    }}
                  >
                    How to Start Earning Passive Income with Rental Properties.
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.80rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> April 14, 2026
                  </div>
                  <Link
                    to="/resources/guides"
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#021429',
                      textDecoration: 'none',
                    }}
                  >
                    Read More articles
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Infinity Pool Villa */}
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(2, 20, 41, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ height: '260px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                <img
                  src="/luxury-pool-villa.jpg"
                  alt="Modern infinity pool villa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#021429',
                      lineHeight: 1.35,
                      marginBottom: '16px',
                    }}
                  >
                    10 Common Mistakes to Avoid When Buying a Home.
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.80rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> April 14, 2026
                  </div>
                  <Link
                    to="/resources/guides"
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#021429',
                      textDecoration: 'none',
                    }}
                  >
                    Read More articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: TAGLINE REVEAL (B11 OF apps/SKILL1.md)
          ========================================================================= */}
        <TaglineReveal
          lines={[
            'Every shilling accounted for,',
            'from M-Pesa to audited general ledger.',
          ]}
        />

        {/* =========================================================================
            SECTION 7: CUSTOMER SAYING (TESTIMONIALS MATCHING REFERENCE)
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
            backgroundColor: '#FAFBFD',
            borderBottom: '1px solid #F1F5F9',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.5vw, 2.8rem)',
                fontWeight: 800,
                color: '#021429',
                letterSpacing: '-0.025em',
                marginBottom: '12px',
              }}
            >
              Customer Saying
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#64748B' }}>
              Trusted by 300+ leading property management firms and real estate developers across East Africa.
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
                  'Guri24 transformed our monthly rent closing. What used to take our accountants four days of manual M-Pesa spreadsheet cross-referencing now happens automatically within seconds.',
              },
              {
                name: 'Amina Warsame',
                role: 'Senior Portfolio Manager, Apex Properties',
                estate: 'Parklands Residency & Lavington Villas (142 units)',
                quote:
                  'The double-entry general ledger is authoritative and immaculate. When our external tax auditors examined our records, every bank receipt matched an itemized tenant invoice.',
              },
              {
                name: 'David Ochieng',
                role: 'Estate Chairman, Karen Plains HOA',
                estate: 'Karen Gated Community (56 private residences)',
                quote:
                  'Resident service charges are collected effortlessly. Our tenants appreciate receiving instant Safaricom receipts directly on their phones, and arrears dropped to under 1.2%.',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  padding: '36px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                }}
              >
                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.65, marginBottom: '24px', fontStyle: 'normal' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#0057FC',
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
          SECTION 8: CLOSING CTA BANNER
          ========================================================================= */}
      <section
        style={{
          padding: '64px 32px 80px',
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
            padding: '64px 48px',
            textAlign: 'center',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(0, 87, 252, 0.35) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Experience Architectural Financial Authority
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginBottom: '36px',
              }}
            >
              Join 500+ forward-thinking property owners and management companies. Start your 14-day free trial today.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
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
                  boxShadow: '0 8px 24px rgba(0, 87, 252, 0.35)',
                }}
              >
                <span>Start free trial</span>
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => setIsConsultationOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer',
                }}
              >
                <span>Schedule consultation</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
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
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="david@company.com"
                        value={consultationForm.email}
                        onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem' }}
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
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem' }}
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
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem', backgroundColor: '#FFFFFF' }}
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
        @media (max-width: 900px) {
          .editorial-about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .gallery-asymmetric-grid {
            grid-template-columns: 1fr !important;
          }
          .metrics-row-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
          .editorial-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .desktop-hero-nav {
            display: none !important;
          }
          .hero-floating-badges {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
