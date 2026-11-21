import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
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
      title: 'Arch Design',
      desc: 'From initial concept development and schematic design to full spatial optimization.',
      image: '/hero-luxury-architecture.jpg',
      tag: 'Architecture & Zoning',
    },
    {
      num: '02',
      title: 'Interior Design',
      desc: 'Creating cohesive interior spaces that reflect prestige, comfort, and operational longevity.',
      image: '/luxury-minimalist-living.jpg',
      tag: 'Spatial Aesthetics',
    },
    {
      num: '03',
      title: 'Urban Planning',
      desc: 'Designing sustainable outdoor living environments, gate access, and common amenity ecosystems.',
      image: '/modern-organic-balconies.jpg',
      tag: 'Master Planning',
    },
    {
      num: '04',
      title: 'Project Manage',
      desc: 'Overseeing contractors, milestone escrow disbursements, and compliance across Kenya.',
      image: '/luxury-pool-villa.jpg',
      tag: 'Lifecycle Governance',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#EAEFF5', // Soft luxury architectural backdrop matching reference canvas
        minHeight: '100vh',
        padding: '24px 16px 80px',
        fontFamily: BRAND_TOKENS.fonts.sans,
        color: '#0F172A',
        boxSizing: 'border-box',
      }}
    >
      {/* =========================================================================
          ELEVATED MASTER EDITORIAL CONTAINER
          ========================================================================= */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '32px',
          boxShadow: '0 30px 80px -20px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* =========================================================================
            SECTION 1: HERO SECTION ("AXIOMA / GURI24" LUXURY ARCHITECTURE)
            ========================================================================= */}
        <section
          style={{
            position: 'relative',
            margin: '16px',
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: '720px',
            backgroundImage: 'url(/hero-luxury-architecture.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 48%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '28px 32px 36px',
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
                padding: '6px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="desktop-hero-nav"
            >
              <Link
                to="/"
                style={{
                  padding: '7px 18px',
                  borderRadius: '999px',
                  backgroundColor: '#FFFFFF',
                  color: '#021429',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                Home
              </Link>
              <Link
                to="/about"
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                About us
              </Link>
              <Link
                to="/features"
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Features
              </Link>
              <Link
                to="/solutions"
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Solutions
              </Link>
              <Link
                to="/pricing"
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Contacts
              </Link>
            </nav>

            {/* Social & Consultation Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }} className="hero-social-links">
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  F
                </span>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  IG
                </span>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  X
                </span>
              </div>

              <button
                onClick={() => setIsConsultationOpen(true)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  backgroundColor: '#FFFFFF',
                  color: '#021429',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <span>Consultation</span>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#021429',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                  }}
                >
                  ↗
                </span>
              </button>
            </div>
          </div>

          {/* --- HERO FLOATING STATS CARDS (RIGHT SIDE) --- */}
          <div
            style={{
              position: 'absolute',
              right: '36px',
              top: '46%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              maxWidth: '240px',
            }}
            className="hero-floating-badges"
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.28)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '18px',
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1 }}>15+</div>
              <div style={{ fontSize: '0.74rem', marginTop: '4px', opacity: 0.92, lineHeight: 1.3 }}>
                Years of architectural excellence & innovation
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.28)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '18px',
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1 }}>549+</div>
              <div style={{ fontSize: '0.74rem', marginTop: '4px', opacity: 0.92, lineHeight: 1.3 }}>
                Active residential & commercial estates managed with excellence
              </div>
            </div>
          </div>

          {/* --- HERO BOTTOM FOOTER CALLOUTS --- */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: '100%',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            {/* Bottom Left Narrative */}
            <div style={{ maxWidth: '340px' }}>
              <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, marginBottom: '6px' }}>
                We design property ecosystems that combine aesthetics, intelligence, and financial authority.
              </div>
              <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Closer to design,
                <br />
                closer to yourself.
              </div>
            </div>

            {/* Bottom Center Pill Consultation Button */}
            <button
              onClick={() => setIsConsultationOpen(true)}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                backgroundColor: '#FFFFFF',
                color: '#021429',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                margin: '0 auto',
              }}
            >
              <span>Consultation</span>
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
            </button>

            {/* Bottom Right Attribution */}
            <div style={{ textAlign: 'right', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', fontWeight: 500 }}>
              Guri24 RMS • Nairobi • KES
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
            position: 'relative',
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
            {/* Left Content Column */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  marginBottom: '20px',
                }}
              >
                01 - about us
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.08,
                  color: '#021429',
                  marginBottom: '24px',
                }}
              >
                WHO <span style={{ color: '#D97706' }}>WE ARE</span>
              </h2>

              <p
                style={{
                  fontSize: '1.14rem',
                  lineHeight: 1.65,
                  color: '#334155',
                  marginBottom: '32px',
                  maxWidth: '520px',
                }}
              >
                We are a forward-thinking team creating unique living spaces that blend modern design,
                comfort, innovation, and sustainability together.
              </p>

              <button
                onClick={() => setIsConsultationOpen(true)}
                style={{
                  padding: '11px 26px',
                  borderRadius: '999px',
                  backgroundColor: '#FFFFFF',
                  color: '#021429',
                  border: '1.5px solid #021429',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <span>Consultation</span>
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
                    fontSize: '0.7rem',
                  }}
                >
                  ↗
                </span>
              </button>
            </div>

            {/* Right Image: Curved Balcony Architecture */}
            <div
              style={{
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.15)',
                position: 'relative',
                maxHeight: '460px',
              }}
            >
              <img
                src="/modern-organic-balconies.jpg"
                alt="Organic Curved Architectural Balconies"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: "SERVICES WE PROVIDE" (APEX ARC CAROUSEL CARDS)
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
            backgroundColor: '#FAFCFE',
            borderTop: '1px solid #EDF2F7',
            borderBottom: '1px solid #EDF2F7',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '36px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#03D8BF',
                  marginBottom: '8px',
                }}
              >
                Operational Scope
              </div>
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
            </div>

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
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                {/* Photo with Number Badge */}
                <div
                  style={{
                    position: 'relative',
                    height: '230px',
                    overflow: 'hidden',
                    backgroundColor: '#021429',
                  }}
                >
                  <img
                    src={svc.image}
                    alt={svc.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: 'rgba(2, 20, 41, 0.72)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '8px',
                    }}
                  >
                    {svc.num}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#021429',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 9px',
                      borderRadius: '999px',
                    }}
                  >
                    {svc.tag}
                  </div>
                </div>

                {/* Text Info */}
                <div style={{ padding: '20px 22px' }}>
                  <h3
                    style={{
                      fontSize: '1.14rem',
                      fontWeight: 800,
                      color: '#021429',
                      marginBottom: '8px',
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#64748B',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {svc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: VISUAL SHOWCASE / ARCHITECTURAL GALLERY (ASYMMETRIC GRID)
            ========================================================================= */}
        <section
          style={{
            padding: '64px 48px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
              gap: '24px',
            }}
            className="gallery-asymmetric-grid"
          >
            {/* Large Wide Building with Floating Tags & Hover Badge */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                minHeight: '440px',
                boxShadow: '0 16px 40px -10px rgba(15, 23, 42, 0.12)',
              }}
            >
              <img
                src="/hero-apex-architecture.jpg"
                alt="Architectural Glass Living Pavilion"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Floating "Detail" Glass Circle Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '36%',
                  right: '18%',
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.28)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                }}
              >
                Detail ↗
              </div>

              {/* Bottom Left Trust Pills: Best of Best, Quality Guarantee, Good to buy */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#021429',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                >
                  Best of Best
                </span>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#021429',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                >
                  Quality Guarantee
                </span>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#021429',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                >
                  Good to buy
                </span>
              </div>
            </div>

            {/* Right Column: Two Vertical Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gap: '24px',
              }}
            >
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  minHeight: '208px',
                  boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.1)',
                }}
              >
                <img
                  src="/luxury-pool-villa.jpg"
                  alt="Coastal Villa with Ocean Horizon"
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
                  borderRadius: '24px',
                  overflow: 'hidden',
                  minHeight: '208px',
                  boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.1)',
                }}
              >
                <img
                  src="/luxury-minimalist-living.jpg"
                  alt="Minimalist Ocean Living Room"
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
            SECTION 5: "OUR PORTFOLIO OF PIONEERING DESIGN" (MASONRY GRID)
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
            backgroundColor: '#FAFCFE',
            borderTop: '1px solid #EDF2F7',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
              gap: '48px',
              alignItems: 'start',
              marginBottom: '36px',
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
                  marginBottom: '28px',
                }}
              >
                Explore our selected works that demonstrate our commitment to design excellence, innovation, and client satisfaction.
              </p>

              <Link
                to="/features"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  backgroundColor: '#FFFFFF',
                  color: '#021429',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <span>See More Projects</span>
                <ArrowRight size={15} />
              </Link>
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
        </section>

        {/* =========================================================================
            SECTION 6: "ABOUT COMPANY" & PARTNER TRUST STRIP
            ========================================================================= */}
        <section
          style={{
            padding: '54px 48px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #EDF2F7',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '32px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748B',
                  marginBottom: '10px',
                }}
              >
                Kenyan Banking &amp; Regulatory Partners
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '28px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#021429', letterSpacing: '-0.02em' }}>
                  SAFARICOM M-PESA
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#021429', letterSpacing: '-0.02em' }}>
                  CO-OP BANK
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#021429', letterSpacing: '-0.02em' }}>
                  EQUITY BANK
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#021429', letterSpacing: '-0.02em' }}>
                  STANBIC BANK
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#021429', letterSpacing: '-0.02em' }}>
                  KDPA 2019
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#021429', lineHeight: 1 }}>98%</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Client Retention</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#021429', lineHeight: 1 }}>15+</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Counties Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: KEY METRICS BAR (HIGH-IMPACT NUMERALS MATCHING REFERENCE)
            ========================================================================= */}
        <section
          style={{
            padding: '54px 48px',
            backgroundColor: '#FAFCFE',
            borderTop: '1px solid #EDF2F7',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px',
              textAlign: 'left',
            }}
            className="metrics-row-grid"
          >
            <div>
              <div
                style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                300+
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 500 }}>
                Satisfied Client's
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                620+
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 500 }}>
                Projects Completed
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                60+
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 500 }}>
                Expert team member
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                4.8%
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 500 }}>
                Reviews Ratings
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: "Read our latest Resources" (EDITORIAL MAGAZINE CARDS)
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #EDF2F7',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Read our latest
                <br />
                Resources
              </h2>
            </div>
            <div style={{ maxWidth: '380px', color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Experience urban sophistication in this modern apartment featuring open-plan living,
              floor-to-ceiling windows, and automated property management.
            </div>
          </div>

          {/* Dual Magazine Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: '32px',
            }}
            className="editorial-cards-grid"
          >
            {/* Card 1: Rental Income */}
            <div
              style={{
                borderRadius: '24px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '260px', overflow: 'hidden' }}>
                <img
                  src="/hero-luxury-architecture.jpg"
                  alt="Modern Residence"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>April 14, 2025</span>
                  </div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#021429',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                      marginBottom: '16px',
                    }}
                  >
                    How to Start Earning Passive Income with Rental Properties.
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Link
                    to="/resources"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#021429',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    Read More articles
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Mistakes when buying a home */}
            <div
              style={{
                borderRadius: '24px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '260px', overflow: 'hidden' }}>
                <img
                  src="/luxury-pool-villa.jpg"
                  alt="Coastal Infinity Pool"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>April 14, 2025</span>
                  </div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#021429',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                      marginBottom: '16px',
                    }}
                  >
                    10 Common Mistakes to Avoid When Buying a Home.
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Link
                    to="/resources"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#021429',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    Read More articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: TAGLINE REVEAL
            ========================================================================= */}
        <TaglineReveal
          eyebrow="Architectural Integrity"
          text="Modern Living, Engineered with Precision."
          description="Guri24 unites double-entry financial governance with automated leasing operations for premier residential and commercial portfolios across Kenya."
        />

        {/* =========================================================================
            SECTION 10: CUSTOMER SAYING (TESTIMONIALS MATCHING REFERENCE)
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
            backgroundColor: '#FAFCFE',
            borderTop: '1px solid #EDF2F7',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
              gap: '48px',
              alignItems: 'center',
            }}
            className="editorial-about-grid"
          >
            {/* Left Image: Luxury Living Interior */}
            <div
              style={{
                borderRadius: '28px',
                overflow: 'hidden',
                position: 'relative',
                maxHeight: '380px',
                boxShadow: '0 16px 40px -10px rgba(15, 23, 42, 0.1)',
              }}
            >
              <img
                src="/luxury-minimalist-living.jpg"
                alt="Luxury Modern Interior"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Circular "View All" Button Badge Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '28px',
                  right: '28px',
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.78)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#021429',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                <span>↗</span>
                <span>View All</span>
              </div>
            </div>

            {/* Right Quote & Details */}
            <div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
                  fontWeight: 900,
                  color: '#021429',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                }}
              >
                Customer Saying
              </h2>

              <p
                style={{
                  fontSize: '1.08rem',
                  lineHeight: 1.65,
                  color: '#475569',
                  fontStyle: 'italic',
                  marginBottom: '28px',
                }}
              >
                "Switching our 480-unit portfolio in Westlands and Kilimani to Guri24 reduced rent
                reconciliation from 5 days to real-time M-Pesa automated allocation. The architectural
                clarity of the financial ledger is unparalleled."
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#021429',
                    color: '#03D8BF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                  }}
                >
                  WK
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#021429', fontSize: '0.98rem' }}>
                    Wanjiku Kamau
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Managing Director, Prime Capital Properties Nairobi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          CONSULTATION POPUP MODAL
          ========================================================================= */}
      {isConsultationOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(2, 20, 41, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
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
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
              }}
              aria-label="Close consultation modal"
            >
              <X size={20} />
            </button>

            {consultationSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#021429', marginBottom: '8px' }}>
                  Consultation Scheduled!
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Our property engineering team has received your brief. A senior RMS consultant will
                  contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#03D8BF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Enterprise Advisory
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#021429', letterSpacing: '-0.02em', margin: '4px 0 8px' }}>
                    Schedule a Consultation
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0, lineHeight: 1.4 }}>
                    Speak directly with a Guri24 solutions architect to evaluate portfolio modeling, M-Pesa integration, and automated bookkeeping.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. David Mwangi"
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="david@estate.co.ke"
                        value={consultationForm.email}
                        onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.92rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#021429', marginBottom: '4px' }}>
                        Phone Number *
                      </label>
                      <input
                        required
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
          .services-four-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
          .portfolio-intro-grid {
            grid-template-columns: 1fr !important;
          }
          .desktop-hero-nav {
            display: none !important;
          }
          .hero-floating-badges {
            display: none !important;
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
