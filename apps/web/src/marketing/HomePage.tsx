import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { animate } from 'animejs';
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UsersIcon,
  UserGroupIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  ChartPieIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  BanknotesIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

export const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    units: '25-100 units',
    role: 'Property Manager',
  });

  const floatingLeftCardRef = useRef<HTMLDivElement>(null);
  const floatingRightCardRef = useRef<HTMLDivElement>(null);
  const trendLineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Gentle Anime.js float physics for the left and right hero metric badges
    if (floatingLeftCardRef.current && floatingRightCardRef.current) {
      try {
        animate(floatingLeftCardRef.current, {
          translateY: [-6, 6],
          rotate: [-6, -4],
          duration: 4500,
          ease: 'inOutSine',
          alternate: true,
          loop: true,
        });

        animate(floatingRightCardRef.current, {
          translateY: [6, -6],
          rotate: [5, 7],
          duration: 4800,
          ease: 'inOutSine',
          alternate: true,
          loop: true,
        });
      } catch (e) {
        // Fallback gracefully
      }
    }

    // Anime.js stroke line draw for the growth metric card
    if (trendLineRef.current) {
      try {
        animate(trendLineRef.current, {
          strokeDashoffset: [200, 0],
          duration: 2600,
          ease: 'inOutQuad',
          loop: true,
          alternate: true,
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setDemoModalOpen(false);
      setDemoForm({ name: '', email: '', phone: '', units: '25-100 units', role: 'Property Manager' });
    }, 2400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#E8F1FC',
        backgroundImage: 'radial-gradient(circle at 50% 0%, #D4E8FE 0%, #E2EFFE 40%, #EBF4FF 70%, #F1F7FF 100%)',
        color: '#0F172A',
        fontFamily: "'Manrope', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        padding: '36px 16px 64px 16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Scoped CSS for responsive layout, font weights, and hover effects */}
      <style>{`
        .canvas-card {
          width: 100%;
          max-width: 1140px;
          background-color: #FFFFFF;
          border-radius: 36px;
          box-shadow: 0 35px 90px -15px rgba(37, 99, 235, 0.15), 0 0 1px rgba(15, 23, 42, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.85);
          overflow: hidden;
          position: relative;
          z-index: 10;
        }
        .outer-watermark {
          position: fixed;
          top: 35%;
          font-weight: 900;
          font-size: 260px;
          color: rgba(37, 99, 235, 0.035);
          user-select: none;
          pointer-events: none;
          letter-spacing: -0.05em;
          line-height: 1;
          z-index: 1;
        }
        .nav-link {
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .nav-link:hover {
          color: #2563EB;
        }
        .impact-card {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.2s ease;
        }
        .impact-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.14);
          border-color: #93C5FD;
        }
        @media (max-width: 900px) {
          .nav-links-cluster { display: none !important; }
          .hero-floating-badge { display: none !important; }
          .hero-main-title { font-size: 36px !important; line-height: 1.15 !important; }
          .impact-three-grid { grid-template-columns: 1fr !important; }
          .nine-features-grid { grid-template-columns: 1fr !important; }
          .solutions-four-grid { grid-template-columns: 1fr !important; }
          .stats-four-grid { grid-template-columns: 1fr 1fr !important; }
          .partner-logos-strip { gap: 16px !important; }
          .canvas-card { border-radius: 24px !important; }
        }
      `}</style>

      {/* Giant Architectural Background Watermarks ("GURI" on left, "24" on right) */}
      <div className="outer-watermark" style={{ left: '-40px' }}>GURI</div>
      <div className="outer-watermark" style={{ right: '-30px' }}>24</div>

      {/* Floating Design Annotation Tags matching reference (e.g. "Manrope", "4px grid") */}
      <div
        style={{
          position: 'absolute',
          bottom: '180px',
          right: '5%',
          backgroundColor: '#1E293B',
          color: '#F8FAFC',
          fontSize: '11px',
          fontWeight: 700,
          padding: '6px 14px',
          borderRadius: '9999px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          transform: 'rotate(-12deg)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        Manrope
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '5%',
          backgroundColor: '#334155',
          color: '#F8FAFC',
          fontSize: '11px',
          fontWeight: 700,
          padding: '6px 14px',
          borderRadius: '9999px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          transform: 'rotate(8deg)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        4px grid
      </div>

      {/* =========================================================================
          THE ELEVATED SUPER-CANVAS CARD (MATCHING USER REFERENCE IMAGE)
      ========================================================================== */}
      <main className="canvas-card">
        {/* Sky-Blue Glow inside the Canvas Card */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '420px',
            background: 'linear-gradient(180deg, #E0EFFF 0%, #F0F7FF 55%, rgba(255, 255, 255, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* -----------------------------------------------------------------------
            SECTION 1: TOP NAVBAR INSIDE CANVAS
        ------------------------------------------------------------------------ */}
        <header
          style={{
            position: 'relative',
            zIndex: 20,
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo with Real Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="Guri24 Logo"
              style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Guri<span style={{ color: '#2563EB' }}>24</span>
            </span>
          </Link>

          {/* Center Links matching Agency.io in reference */}
          <nav className="nav-links-cluster" style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
            <a href="#hero" className="nav-link" style={{ color: '#2563EB', fontWeight: 700 }}>Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#impact" className="nav-link">Solutions</a>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#why-guri24" className="nav-link">About Us</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          {/* Right Action: Sleek Dark Pill CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                padding: '6px 12px',
              }}
            >
              Log in
            </Link>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDemoModalOpen(true)}
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 22px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
              }}
            >
              Book Strategy call
            </motion.button>
          </div>
        </header>

        {/* -----------------------------------------------------------------------
            SECTION 2: HERO SECTION WITH FLOATING METRIC CARDS & CTAS
        ------------------------------------------------------------------------ */}
        <section
          id="hero"
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '48px 24px 64px 24px',
            textAlign: 'center',
            maxWidth: '920px',
            margin: '0 auto',
          }}
        >
          {/* LEFT FLOATING METRIC BADGE (350%) */}
          <div
            ref={floatingLeftCardRef}
            className="hero-floating-badge"
            style={{
              position: 'absolute',
              top: '40px',
              left: '-70px',
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '16px 18px',
              boxShadow: '0 16px 36px rgba(37, 99, 235, 0.1), 0 2px 6px rgba(0,0,0,0.04)',
              border: '1px solid #E2E8F0',
              textAlign: 'left',
              width: '135px',
              zIndex: 15,
            }}
          >
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
              350%
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', lineHeight: 1.3, marginTop: '4px' }}>
              Rent reconciliation speed
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#EFF6FF', borderRadius: '9999px', marginTop: '8px' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#2563EB', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* RIGHT FLOATING METRIC BADGE (4.2x) */}
          <div
            ref={floatingRightCardRef}
            className="hero-floating-badge"
            style={{
              position: 'absolute',
              top: '70px',
              right: '-60px',
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '16px 18px',
              boxShadow: '0 16px 36px rgba(37, 99, 235, 0.1), 0 2px 6px rgba(0,0,0,0.04)',
              border: '1px solid #E2E8F0',
              textAlign: 'left',
              width: '140px',
              zIndex: 15,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                4.2x
              </span>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#10B981' }} />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', lineHeight: 1.3, marginTop: '4px' }}>
              Operational ROI in 90 days
            </div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#2563EB', marginTop: '6px' }}>
              Daraja C2B Verified
            </div>
          </div>

          {/* Small Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 246, 255, 0.9)',
              border: '1px solid #BFDBFE',
              color: '#1D4ED8',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <SparklesIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} />
            <span>SMART PROPERTY MANAGEMENT PLATFORM</span>
          </div>

          {/* Hero Main Headline matching reference graphical accent */}
          <h1
            className="hero-main-title"
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.14,
              margin: '0 auto',
              maxWidth: '820px',
            }}
          >
            Turn Your Property Portfolio Into{' '}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#2563EB',
                position: 'relative',
              }}
            >
              <ChartBarIcon style={{ width: '38px', height: '38px', color: '#2563EB', display: 'inline-block', verticalAlign: 'middle' }} />
              Revenue Growth
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p
            style={{
              marginTop: '22px',
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '640px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Turn wasted management hours into measurable growth — we help property owners and managers convert scattered spreadsheets into qualified collections and 3x efficiency in just 90 days.
          </p>

          {/* Hero Dual Action Buttons matching reference */}
          <div
            style={{
              marginTop: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              position: 'relative',
            }}
          >
            {/* Playful curved hand-drawn arrow annotation */}
            <div
              style={{
                position: 'absolute',
                left: '24%',
                top: '-20px',
                display: 'none',
              }}
            >
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M5 25C15 25 30 15 35 5M35 5L30 8M35 5L38 12" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDemoModalOpen(true)}
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                padding: '12px 26px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.2)',
              }}
            >
              Book Strategy call
            </motion.button>

            <Link
              to="/signup"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '14px',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '9999px',
                border: '1px solid #CBD5E1',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              Get Started
            </Link>
          </div>

          {/* ---------------------------------------------------------------------
              PARTNER LOGO STRIP (MATCHING REFERENCE "TRUSTED BY")
          ---------------------------------------------------------------------- */}
          <div style={{ marginTop: '56px', paddingTop: '32px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', marginBottom: '20px' }}>
              Trusted by Developer-Focused Property Companies & Estates
            </div>

            <div
              className="partner-logos-strip"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '32px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#334155',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#10B981' }} />
                <span>Safaricom C2B (1343073)</span>
              </div>
              <div>KCB Bank</div>
              <div>Equity Group</div>
              <div>Co-operative Bank</div>
              <div>KRA iTax</div>
              <div>HassConsult</div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SECTION 3: BUSINESS RESULTS - 3 HERO IMPACT CARDS WITH REAL IMAGES & HUD
        ------------------------------------------------------------------------ */}
        <section
          id="impact"
          style={{
            padding: '64px 36px 80px 36px',
            backgroundColor: '#FAFCFF',
            borderTop: '1px solid #EDF4FC',
          }}
        >
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: '#2563EB' }} />
              Business Impact
            </div>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
              Property Management That Delivers Business Results
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '10px', lineHeight: 1.55 }}>
              We help technology and property companies transform their everyday operations into measurable business outcomes that matter to the C-Suite.
            </p>
          </div>

          {/* 3 CARDS WITH VISUAL IMAGES & GRAPHICAL PREVIEWS MATCHING REFERENCE */}
          <div
            className="impact-three-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            {/* CARD 1: PIPELINE ACCELERATION (WITH REAL APARTMENT ARCHITECTURE IMAGE) */}
            <div
              className="impact-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                {/* Top Graphical Box: Real Modern Balcony Architecture + Stacked HUD Badges */}
                <div
                  style={{
                    height: '190px',
                    borderRadius: '16px',
                    background: 'linear-gradient(180deg, #DCEEFE 0%, #EFF6FF 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <img
                    src="/modern-organic-balconies.jpg"
                    alt="Property Units"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85,
                    }}
                  />
                  {/* Subtle Gradient Veil */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(37,99,235,0.15) 0%, rgba(255,255,255,0.7) 100%)' }} />

                  {/* Stacked Floating Feature Badges matching reference */}
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px', width: '85%' }}>
                    <div style={{ padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <BuildingOffice2Icon style={{ width: '14px', height: '14px', color: '#2563EB' }} />
                      <span>54 Units Active & Synced</span>
                    </div>
                    <div style={{ padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <UsersIcon style={{ width: '14px', height: '14px', color: '#10B981' }} />
                      <span>Zero Vacancy Drift (94.4%)</span>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                  Pipeline Acceleration
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  Convert property management into automated tenant workflows and sales opportunities with measurable impact on your bottom line.
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                <span>Explore capability</span>
                <ChevronRightIcon style={{ width: '14px', height: '14px' }} />
              </div>
            </div>

            {/* CARD 2: GROWTH METRICS (WITH LIVE REVENUE GRAPH BOX) */}
            <div
              className="impact-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                {/* Top Graphical Box: Live Revenue Growth Metric Screen */}
                <div
                  style={{
                    height: '190px',
                    borderRadius: '16px',
                    background: 'linear-gradient(180deg, #DCEEFE 0%, #EFF6FF 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>KES 452,000</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Verified Monthly Collections</div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #A7F3D0' }}>
                      +24.8%
                    </span>
                  </div>

                  {/* SVG Growth Line with Anime.js stroke pulse */}
                  <div style={{ height: '70px', width: '100%', position: 'relative' }}>
                    <svg viewBox="0 0 200 60" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <path
                        ref={trendLineRef}
                        d="M 10 50 L 50 35 L 90 42 L 130 20 L 170 28 L 195 8"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="195" cy="8" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May (Now)</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                  Growth Metrics
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  Track and optimize key performance indicators that matter to your C-Suite: collection rates, tenant retention, and net operating income.
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                <span>Explore capability</span>
                <ChevronRightIcon style={{ width: '14px', height: '14px' }} />
              </div>
            </div>

            {/* CARD 3: DEVELOPER & TENANT ADOPTION (WITH REAL LIVING ROOM INTERIOR IMAGE + NODE NETWORK) */}
            <div
              className="impact-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                {/* Top Graphical Box: Real Luxury Interior + Central Node Hub */}
                <div
                  style={{
                    height: '190px',
                    borderRadius: '16px',
                    background: 'linear-gradient(180deg, #DCEEFE 0%, #EFF6FF 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <img
                    src="/luxury-minimalist-living.jpg"
                    alt="Living Interior"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85,
                    }}
                  />
                  {/* Subtle Gradient Veil */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(37,99,235,0.2) 0%, rgba(255,255,255,0.7) 100%)' }} />

                  {/* Connected Avatars & Node Network */}
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '9999px', backgroundColor: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', border: '2px solid #FFFFFF', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                      G24
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      100% Tenant Adoption
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                  Tenant Adoption
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  Drive measurable increases in tenant satisfaction, instant M-Pesa C2B receipts, document access and direct maintenance requests.
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                <span>Explore capability</span>
                <ChevronRightIcon style={{ width: '14px', height: '14px' }} />
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SECTION 4: 9 FEATURES BENTO GRID (WITH HEROICONS)
        ------------------------------------------------------------------------ */}
        <section
          id="features"
          style={{
            padding: '72px 36px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              CAPABILITIES & TOOLS
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              All the Tools You Need for Powerful Property Management
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '10px' }}>
              Everything required to oversee residential units, automated Daraja C2B payments, and audited accounting.
            </p>
          </div>

          <div
            className="nine-features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}
          >
            {[
              { icon: BuildingOffice2Icon, title: 'Property & Unit Management', desc: 'Manage entire buildings, apartments, units, occupancy states and tenancy histories in one central registry.' },
              { icon: UsersIcon, title: 'Tenant Management', desc: 'Maintain organized tenant profiles, identification documents, emergency contacts and active lease records.' },
              { icon: CreditCardIcon, title: 'Rent Collection & Payments', desc: 'Track rent invoices, payment receipts and collection performance. Full Daraja C2B V2 (1343073) & bank sync.' },
              { icon: DocumentCheckIcon, title: 'Lease & Booking Management', desc: 'Create and manage tenancy agreements, lease renewals, deposit requirements and automatic expiry warnings.' },
              { icon: WrenchScrewdriverIcon, title: 'Maintenance Management', desc: 'Receive maintenance tickets, assign technicians, monitor vendor progress and track property repair expenses.' },
              { icon: BanknotesIcon, title: 'Financial Management', desc: 'Get a clearer view of rental revenue, deposit liability (Account 2100), expenses and trial balances.' },
              { icon: DocumentMagnifyingGlassIcon, title: 'OCR & Document Intelligence', desc: 'Extract data from tenancy agreements, invoices and receipts with human-in-the-loop validation.' },
              { icon: SparklesIcon, title: 'AI Property Assistant', desc: 'Get immediate insights on occupancy trends, collection anomalies and draft notices grounded in your records.' },
              { icon: ChartBarIcon, title: 'Analytics & Reports', desc: 'Analyze property performance, arrears aging brackets, occupancy rates and export audit-ready summaries.' },
            ].map((feat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '22px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <feat.icon style={{ width: '22px', height: '22px' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>{feat.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SECTION 5: ARCHITECTURAL HERO SHOWCASE (REAL RESIDENTIAL BUILDING IMAGE)
        ------------------------------------------------------------------------ */}
        <section
          style={{
            padding: '64px 36px',
            backgroundColor: '#FAFCFF',
            borderTop: '1px solid #E2E8F0',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto 36px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              COMPLETE VISIBILITY
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Your Entire Property Portfolio at a Glance
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '10px' }}>
              Designed specifically for Kenyan residential estates, landlords, and commercial agencies.
            </p>
          </div>

          {/* Real Apex Architecture Image with Floating HUD Badges */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.2)',
              border: '1px solid #E2E8F0',
              maxHeight: '440px',
            }}
          >
            <img
              src="/hero-apex-architecture.jpg"
              alt="Apex Architecture"
              style={{ width: '100%', height: '440px', objectFit: 'cover' }}
            />
            {/* Dark glass overlay footer on image */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 32px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.85) 100%)',
                color: '#FFFFFF',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>Apex Residences & Nairobi Estates</div>
                <div style={{ fontSize: '13px', color: '#CBD5E1' }}>Real-time occupancy and automated M-Pesa C2B reconciliation</div>
              </div>

              <Link
                to="/signup"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                }}
              >
                <span>Launch Workspace</span>
                <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SECTION 6: HOW IT WORKS (3 SIMPLE STEPS)
        ------------------------------------------------------------------------ */}
        <section
          id="how-it-works"
          style={{
            padding: '72px 36px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              GET STARTED
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Get Started in 3 Simple Steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', title: 'Set Up Your Organization', desc: 'Create your Guri24 organization, configure your business details and invite your management team.' },
              { step: '02', title: 'Add Properties & Tenants', desc: 'Register your buildings, units, tenants, active leases and rent schedules with zero data entry friction.' },
              { step: '03', title: 'Manage Everything in One Place', desc: 'Track automated C2B payments, handle maintenance tickets and review immutable financial journals.' },
            ].map((s, idx) => (
              <div key={idx} style={{ padding: '28px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#BFDBFE', marginBottom: '10px' }}>{s.step}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SECTION 7: SOLUTIONS & AUDIENCE
        ------------------------------------------------------------------------ */}
        <section
          style={{
            padding: '64px 36px',
            backgroundColor: '#FAFCFF',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              STAKEHOLDER HUBS
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Tailored for Every Property Stakeholder
            </h2>
          </div>

          <div className="solutions-four-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            {[
              { title: 'For Landlords', desc: 'Keep track of rental income, expenses, occupancy and property performance without administrative stress.' },
              { title: 'For Property Managers', desc: 'Manage multiple buildings, units, tenant requests, rent collection and team tasks in one connected system.' },
              { title: 'For Real Estate Companies', desc: 'Oversee property portfolios, staff assignments, business records and operational analytics from a central platform.' },
              { title: 'For Tenants', desc: 'Access tenancy details, view invoices, verify payment records and submit maintenance requests with ease.' },
            ].map((sol, idx) => (
              <div key={idx} style={{ padding: '22px', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>{sol.title}</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>{sol.desc}</p>
                </div>
                <Link to="/signup" style={{ marginTop: '16px', fontSize: '12px', fontWeight: 700, color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Learn more</span>
                  <ArrowRightIcon style={{ width: '12px', height: '12px' }} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SECTION 8: FINAL CTA BANNER (ROYAL BLUE CONTAINER)
        ------------------------------------------------------------------------ */}
        <section
          id="contact"
          style={{
            padding: '48px 36px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)',
              borderRadius: '28px',
              padding: '52px 32px',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: '0 20px 50px -10px rgba(37, 99, 235, 0.35)',
            }}
          >
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                Ready to Take Control of Your Properties?
              </h2>
              <p style={{ fontSize: '15px', color: '#DBEAFE', marginTop: '12px', lineHeight: 1.5 }}>
                Join property managers, landlords and real estate companies using Guri24 to simplify operations and grow their business.
              </p>

              <div style={{ marginTop: '28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Link
                  to="/signup"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#1D4ED8',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  }}
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  style={{
                    backgroundColor: 'rgba(30, 58, 138, 0.7)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                  }}
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SECTION 9: FOOTER INSIDE CANVAS
        ------------------------------------------------------------------------ */}
        <footer
          style={{
            padding: '48px 36px 28px 36px',
            backgroundColor: '#FAFCFF',
            borderTop: '1px solid #E2E8F0',
            fontSize: '13px',
            color: '#64748B',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="Guri24" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Guri<span style={{ color: '#2563EB' }}>24</span></span>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#hero" className="nav-link">Home</a>
              <a href="#features" className="nav-link">Features</a>
              <a href="#impact" className="nav-link">Solutions</a>
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
          </div>

          <div style={{ paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94A3B8', gap: '10px' }}>
            <div>© 2026 Guri24 Rental Management Ltd. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '18px' }}>
              <span>Kenya DPA Compliant</span>
              <span>Daraja C2B V2 (1343073)</span>
            </div>
          </div>
        </footer>
      </main>

      {/* =========================================================================
          INTERACTIVE "BOOK STRATEGY CALL" / DEMO MODAL
      ========================================================================== */}
      <AnimatePresence>
        {demoModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
              }}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                border: '1px solid #E2E8F0',
                zIndex: 10,
                boxSizing: 'border-box',
              }}
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={() => setDemoModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  color: '#94A3B8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                aria-label="Close dialog"
              >
                <XMarkIcon style={{ width: '22px', height: '22px' }} />
              </button>

              {demoSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '9999px',
                      backgroundColor: '#ECFDF5',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                    }}
                  >
                    <CheckIcon style={{ width: '32px', height: '32px' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                    Strategy Call Booked!
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                    Our property operations team will reach out to <strong style={{ color: '#0F172A' }}>{demoForm.email}</strong> within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Book Strategy Call
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      Learn how Guri24 transforms rent collections, Daraja C2B V2 reconciliation and financial accounting.
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peter Gatitu"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid #CBD5E1',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="peter@company.com"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0712 345 678"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Portfolio Size
                      </label>
                      <select
                        value={demoForm.units}
                        onChange={(e) => setDemoForm({ ...demoForm, units: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option>1-24 units</option>
                        <option>25-100 units</option>
                        <option>101-500 units</option>
                        <option>500+ units</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Your Role
                      </label>
                      <select
                        value={demoForm.role}
                        onChange={(e) => setDemoForm({ ...demoForm, role: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option>Property Manager</option>
                        <option>Property Owner / Landlord</option>
                        <option>Real Estate Executive</option>
                        <option>Accountant</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                    }}
                  >
                    Confirm Booking
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
