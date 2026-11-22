import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Squares2X2Icon,
  CheckCircleIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  LockClosedIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
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

  // Anime.js SVG Integrations Path animation & floating clouds
  const integrationsSvgRef = useRef<SVGSVGElement>(null);
  const cloudLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle Anime.js floating clouds animation
    if (cloudLayerRef.current) {
      try {
        const clouds = cloudLayerRef.current.querySelectorAll('.ethereal-cloud-element');
        if (clouds.length > 0) {
          animate(clouds, {
            translateY: [-12, 12],
            translateX: [-8, 8],
            duration: 7000,
            ease: 'inOutSine',
            alternate: true,
            loop: true,
            delay: (el: any, i: number) => i * 600,
          });
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    // Anime.js glowing SVG pulses for integration nodes
    if (integrationsSvgRef.current) {
      try {
        const lines = integrationsSvgRef.current.querySelectorAll('.pulse-line-element');
        if (lines.length > 0) {
          animate(lines, {
            strokeDashoffset: [50, 0],
            duration: 2200,
            ease: 'linear',
            loop: true,
          });
        }
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
        background: 'linear-gradient(180deg, #EBF5FF 0%, #F5F9FD 35%, #FFFFFF 100%)',
        color: '#0F172A',
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Scoped CSS for responsive breakpoints, hover transitions, and animations */}
      <style>{`
        .guri24-container {
          width: 100%;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 24px;
          padding-right: 24px;
          box-sizing: border-box;
        }
        .nav-pill-link {
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        .nav-pill-link:hover {
          color: #2563EB;
        }
        .feature-card-hover {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.2s ease;
        }
        .feature-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px -8px rgba(37, 99, 235, 0.12);
          border-color: #93C5FD;
        }
        .audience-pill-hover {
          transition: all 0.2s ease;
        }
        .audience-pill-hover:hover {
          background-color: #EFF6FF !important;
          border-color: #93C5FD !important;
          color: #1D4ED8 !important;
        }
        @media (max-width: 900px) {
          .desktop-nav-menu { display: none !important; }
          .desktop-nav-actions { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
          .hero-heading { font-size: 34px !important; line-height: 1.15 !important; }
          .dashboard-mockup-wrapper { display: none !important; }
          .three-card-grid { grid-template-columns: 1fr !important; }
          .features-nine-grid { grid-template-columns: 1fr !important; }
          .solutions-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-cols { grid-template-columns: 1fr !important; gap: 32px !important; }
          .integration-nodes-top { flex-wrap: wrap !important; gap: 10px !important; }
        }
      `}</style>

      {/* =========================================================================
          BACKGROUND CLOUDS (ETHEREAL DRIFTING BACKDROP)
      ========================================================================== */}
      <div
        ref={cloudLayerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '900px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        {/* Radiant Celestial Sunbeam */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(191, 219, 254, 0.5) 0%, rgba(219, 234, 254, 0.2) 50%, transparent 80%)',
            filter: 'blur(60px)',
            borderRadius: '9999px',
          }}
        />

        {/* Left Clouds */}
        <div
          className="ethereal-cloud-element"
          style={{
            position: 'absolute',
            top: '20px',
            left: '-60px',
            width: '450px',
            height: '260px',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.7) 60%, transparent 80%)',
            filter: 'blur(35px)',
            borderRadius: '9999px',
          }}
        />
        <div
          className="ethereal-cloud-element"
          style={{
            position: 'absolute',
            top: '180px',
            left: '-40px',
            width: '360px',
            height: '200px',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.85) 0%, rgba(240, 249, 255, 0.6) 70%, transparent 80%)',
            filter: 'blur(45px)',
            borderRadius: '9999px',
          }}
        />

        {/* Right Clouds */}
        <div
          className="ethereal-cloud-element"
          style={{
            position: 'absolute',
            top: '30px',
            right: '-60px',
            width: '460px',
            height: '280px',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.7) 60%, transparent 80%)',
            filter: 'blur(35px)',
            borderRadius: '9999px',
          }}
        />
        <div
          className="ethereal-cloud-element"
          style={{
            position: 'absolute',
            top: '200px',
            right: '-30px',
            width: '380px',
            height: '220px',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.85) 0%, rgba(240, 249, 255, 0.6) 70%, transparent 80%)',
            filter: 'blur(45px)',
            borderRadius: '9999px',
          }}
        />
      </div>

      {/* =========================================================================
          SECTION 1: FLOATING PILL NAVIGATION (HEROICONS EQUIPPED)
      ========================================================================== */}
      <header
        style={{
          position: 'sticky',
          top: '16px',
          zIndex: 50,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0 20px',
          boxSizing: 'border-box',
        }}
      >
        <nav
          aria-label="Main Navigation"
          style={{
            width: '100%',
            maxWidth: '1160px',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 232, 240, 0.85)',
            boxShadow: '0 8px 28px -6px rgba(37, 99, 235, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            borderRadius: '9999px',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo with Heroicon Building */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#0F172A',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              }}
            >
              <BuildingOffice2Icon style={{ width: '22px', height: '22px' }} />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '20px',
                letterSpacing: '-0.03em',
                color: '#0F172A',
              }}
            >
              Guri<span style={{ color: '#2563EB' }}>24</span>
            </span>
          </Link>

          {/* Center Pill Menu for Desktop */}
          <div
            className="desktop-nav-menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
            }}
          >
            <a href="#hero" className="nav-pill-link" style={{ color: '#2563EB', fontWeight: 700 }}>
              Home
            </a>
            <a href="#features" className="nav-pill-link">
              Features
            </a>
            <a href="#solutions" className="nav-pill-link">
              Solutions
            </a>
            <a href="#how-it-works" className="nav-pill-link">
              How It Works
            </a>
            <a href="#why-guri24" className="nav-pill-link">
              About Us
            </a>
            <a href="#contact" className="nav-pill-link">
              Contact
            </a>
          </div>

          {/* Right Action Cluster */}
          <div
            className="desktop-nav-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Kenya Market / Language Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#F1F5F9',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                border: '1px solid #E2E8F0',
              }}
            >
              <span>🇰🇪</span>
              <span>EN</span>
            </div>

            <Link
              to="/login"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                padding: '6px 12px',
                transition: 'color 0.15s ease',
              }}
            >
              Log in
            </Link>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Get Started</span>
                <ArrowRightIcon style={{ width: '15px', height: '15px' }} />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle"
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: '8px',
              color: '#334155',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon style={{ width: '26px', height: '26px' }} />
            ) : (
              <Bars3Icon style={{ width: '26px', height: '26px' }} />
            )}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                top: '64px',
                left: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 60,
              }}
            >
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>Home</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>Features</a>
              <a href="#solutions" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>Solutions</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>How It Works</a>
              <a href="#why-guri24" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>About Us</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>Contact</a>
              <hr style={{ borderColor: '#F1F5F9', margin: '4px 0' }} />
              <Link to="/login" style={{ textAlign: 'center', textDecoration: 'none', color: '#334155', fontWeight: 600, padding: '8px' }}>Log in</Link>
              <Link to="/signup" style={{ textAlign: 'center', textDecoration: 'none', backgroundColor: '#2563EB', color: '#FFFFFF', fontWeight: 700, padding: '12px', borderRadius: '9999px' }}>Get Started</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================================================
          SECTION 2: HERO SECTION (EXACT DESIGN MATCH WITH HEROICONS & LAYERED MOCKUP)
      ========================================================================== */}
      <section
        id="hero"
        style={{
          position: 'relative',
          paddingTop: '64px',
          paddingBottom: '80px',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          {/* Top Pill Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 246, 255, 0.8)',
              border: '1px solid rgba(191, 219, 254, 0.8)',
              color: '#1D4ED8',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.06)',
            }}
          >
            <SparklesIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} />
            <span>SMART PROPERTY MANAGEMENT PLATFORM</span>
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            className="hero-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              maxWidth: '880px',
              margin: '0 auto',
            }}
          >
            Manage Properties. <br />
            Simplify Rentals. <span style={{ color: '#2563EB' }}>Grow Your Business.</span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              marginTop: '24px',
              fontSize: '18px',
              color: '#475569',
              maxWidth: '680px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}
          >
            Take control of your rental properties with one intelligent platform. Manage tenants, leases, rent collection, maintenance and financial records without the complexity of scattered spreadsheets and paperwork.
          </motion.p>

          {/* Dual CTAs matching Relink */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
            }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  padding: '14px 30px',
                  borderRadius: '9999px',
                  boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Get Started</span>
                <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDemoModalOpen(true)}
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 600,
                padding: '14px 28px',
                borderRadius: '9999px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '9999px',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <span>Book a Demo</span>
            </motion.button>
          </motion.div>

          <p style={{ marginTop: '14px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
            Everything you need to manage your properties, tenants and rental operations in one place.
          </p>

          {/* =====================================================================
              LAYERED 3D DASHBOARD PREVIEW (EXACT DESIGN MATCH)
          ====================================================================== */}
          <div
            className="dashboard-mockup-wrapper"
            style={{
              marginTop: '56px',
              position: 'relative',
              maxWidth: '1040px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {/* Tilted Layer Behind Left */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-30px',
                width: '850px',
                height: '480px',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                border: '1px solid rgba(226, 232, 240, 0.7)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
                transform: 'rotate(-2deg) scale(0.96)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Main Console Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              style={{
                position: 'relative',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 30px 70px -15px rgba(15, 23, 42, 0.16)',
                overflow: 'hidden',
                textAlign: 'left',
                zIndex: 10,
              }}
            >
              {/* Window Header */}
              <div
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #1E293B',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '11px', height: '11px', borderRadius: '9999px', backgroundColor: '#EF4444' }} />
                    <div style={{ width: '11px', height: '11px', borderRadius: '9999px', backgroundColor: '#F59E0B' }} />
                    <div style={{ width: '11px', height: '11px', borderRadius: '9999px', backgroundColor: '#10B981' }} />
                  </div>
                  <div style={{ height: '16px', width: '1px', backgroundColor: '#334155' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        backgroundColor: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      G
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
                      Guri24 Rental Workspace
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8' }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      border: '1px solid #334155',
                      color: '#E2E8F0',
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '9999px', backgroundColor: '#10B981' }} />
                    Daraja C2B V2: 1343073 (Active)
                  </span>
                  <span>Peter Gatitu Mwangi</span>
                </div>
              </div>

              {/* Window Body */}
              <div style={{ display: 'flex', minHeight: '420px', backgroundColor: '#F8FAFC' }}>
                {/* Left Mini Sidebar */}
                <div
                  style={{
                    width: '230px',
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid #E2E8F0',
                    padding: '18px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', padding: '6px 10px', letterSpacing: '0.04em' }}>
                    Navigation
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '13px', fontWeight: 600 }}>
                    <ChartBarIcon style={{ width: '18px', height: '18px', color: '#2563EB' }} />
                    <span>Portfolio Overview</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                    <BuildingOffice2Icon style={{ width: '18px', height: '18px', color: '#94A3B8' }} />
                    <span>Properties & Units</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                    <UsersIcon style={{ width: '18px', height: '18px', color: '#94A3B8' }} />
                    <span>Tenant Directory</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                    <CreditCardIcon style={{ width: '18px', height: '18px', color: '#94A3B8' }} />
                    <span>Rent & C2B Ledger</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                    <WrenchScrewdriverIcon style={{ width: '18px', height: '18px', color: '#94A3B8' }} />
                    <span>Maintenance (3 Open)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                    <SparklesIcon style={{ width: '18px', height: '18px', color: '#3B82F6' }} />
                    <span>AI Assistant</span>
                  </div>

                  <div style={{ marginTop: 'auto', padding: '14px', backgroundColor: '#EFF6FF', borderRadius: '14px', border: '1px solid #DBEAFE' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>C2B Paybill</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>1343073</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Automated invoice allocation</div>
                  </div>
                </div>

                {/* Right Workspace Area */}
                <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Top Bar inside content */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Good morning, Peter!</h2>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>You have 12 verified payments settling today across 4 properties.</p>
                    </div>
                    <div style={{ padding: '4px 12px', backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '12px', fontWeight: 600, borderRadius: '9999px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircleIcon style={{ width: '15px', height: '15px', color: '#10B981' }} />
                      <span>Reconciliation Synced</span>
                    </div>
                  </div>

                  {/* 4 Stat Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Total Properties</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>4</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>54 total units</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Occupied Units</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>51 <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 400 }}>(94.4%)</span></div>
                      <div style={{ fontSize: '11px', color: '#10B981' }}>3 vacant available</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Collected Rent</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>KES 240k</div>
                      <div style={{ fontSize: '11px', color: '#10B981' }}>+14% this month</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Arrears</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>KES 10k</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>1 tenant pending</div>
                    </div>
                  </div>

                  {/* Chart and Activity Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '16px' }}>
                    {/* Bar Chart Matching Relink */}
                    <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Rent Collection Overview</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Jan 2026 – May 2026</div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 10px', borderRadius: '9999px' }}>
                          KES 250,000 Total
                        </span>
                      </div>

                      <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                        {[
                          { month: 'Jan', height: '55%', active: false, val: '180k' },
                          { month: 'Feb', height: '65%', active: false, val: '210k' },
                          { month: 'Mar', height: '60%', active: false, val: '195k' },
                          { month: 'Apr', height: '85%', active: false, val: '230k' },
                          { month: 'May (Now)', height: '94%', active: true, val: 'KES 240k' },
                        ].map((b, i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: b.active ? '#2563EB' : '#94A3B8' }}>{b.val}</div>
                            <div
                              style={{
                                width: '100%',
                                maxWidth: '36px',
                                height: b.height,
                                borderRadius: '8px 8px 0 0',
                                backgroundColor: b.active ? '#2563EB' : '#E2E8F0',
                                boxShadow: b.active ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none',
                              }}
                            />
                            <span style={{ fontSize: '11px', color: b.active ? '#1D4ED8' : '#64748B', fontWeight: b.active ? 700 : 500 }}>
                              {b.month}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Health & C2B Stream */}
                    <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Operational Health</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Automated Daraja C2B Activity</div>

                        <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: '#64748B' }}>Collection Rate</span>
                            <span style={{ fontWeight: 700, color: '#10B981' }}>96.0%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
                            <div style={{ width: '96%', height: '100%', backgroundColor: '#10B981', borderRadius: '9999px' }} />
                          </div>
                        </div>

                        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Recent Verified Payments</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '4px' }}>
                            <span style={{ color: '#0F172A', fontWeight: 600 }}>Apt 4B - Rent</span>
                            <span style={{ color: '#10B981', fontWeight: 700 }}>+25,000</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: '#0F172A', fontWeight: 600 }}>Unit 2A - Partial</span>
                            <span style={{ color: '#10B981', fontWeight: 700 }}>+15,000</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/app/dashboard"
                        style={{
                          marginTop: '12px',
                          padding: '8px',
                          backgroundColor: '#F1F5F9',
                          color: '#2563EB',
                          fontWeight: 700,
                          fontSize: '12px',
                          borderRadius: '10px',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>Open Live Workspace</span>
                        <ArrowTopRightOnSquareIcon style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TRUST & AUDIENCE (HEROICONS)
      ========================================================================== */}
      <section
        style={{
          padding: '48px 0',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container" style={{ textAlign: 'center' }}>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#64748B',
              marginBottom: '12px',
            }}
          >
            Built for the People Who Manage Properties
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#475569',
              maxWidth: '560px',
              margin: '0 auto 28px auto',
              lineHeight: 1.5,
            }}
          >
            Guri24 brings property owners, managers, accountants and tenants together through a connected property management experience.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {[
              { label: 'Property Owners', icon: BuildingOffice2Icon },
              { label: 'Property Managers', icon: UsersIcon },
              { label: 'Real Estate Companies', icon: BriefcaseIcon },
              { label: 'Landlords', icon: BuildingOfficeIcon },
              { label: 'Residential Estates', icon: UserGroupIcon },
            ].map((item, idx) => (
              <div
                key={idx}
                className="audience-pill-hover"
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#1E293B',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                  cursor: 'default',
                }}
              >
                <item.icon style={{ width: '18px', height: '18px', color: '#2563EB' }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "WHY GURI24" - 3-CARD CENTERPIECE (EXACT DESIGN MATCH)
      ========================================================================== */}
      <section
        id="why-guri24"
        style={{
          padding: '88px 0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              WHY GURI24
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Property Management, Made Simpler.
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', marginTop: '12px' }}>
              Spend less time managing scattered records and more time growing your property business.
            </p>
          </div>

          {/* 3-Card Grid Matching The Middle Row of the Reference Screenshot */}
          <div
            className="three-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '28px',
              alignItems: 'stretch',
            }}
          >
            {/* Card 1: One Connected Platform */}
            <motion.div
              whileHover={{ y: -6 }}
              className="feature-card-hover"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '9999px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <ArrowUpRightIcon style={{ width: '22px', height: '22px' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                  One Connected Platform
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  Manage properties, tenants, leases, payments and maintenance from a central workspace.
                </p>
              </div>

              {/* Mini Preview Widget */}
              <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '18px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '12px' }}>
                  <span>Insights Portfolio Growth</span>
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>54 Units</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', height: '60px', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px' }}>
                  <div style={{ width: '16px', height: '35%', backgroundColor: '#CBD5E1', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: '16px', height: '50%', backgroundColor: '#CBD5E1', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: '16px', height: '68%', backgroundColor: '#CBD5E1', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: '16px', height: '95%', backgroundColor: '#2563EB', borderRadius: '4px 4px 0 0', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }} />
                  <div style={{ width: '16px', height: '80%', backgroundColor: '#CBD5E1', borderRadius: '4px 4px 0 0' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                  <span>Portfolio Status</span>
                  <span style={{ color: '#2563EB', fontWeight: 700 }}>94.4% Occupied</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: ELECTRIC BLUE HERO GRADIENT */}
            <motion.div
              whileHover={{ y: -6 }}
              style={{
                background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)',
                color: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <ArrowUpRightIcon style={{ width: '22px', height: '22px' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
                  Better Financial Visibility
                </h3>
                <p style={{ fontSize: '14px', color: '#DBEAFE', lineHeight: 1.55, margin: 0 }}>
                  Know what has been invoiced, collected, allocated and remains outstanding with automated C2B reconciliation.
                </p>
              </div>

              {/* Embedded White Glass Mini Card */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  marginTop: '32px',
                  padding: '18px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  borderRadius: '18px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  <span>Rent & Revenue Analysis</span>
                  <span style={{ color: '#2563EB', fontWeight: 700 }}>2026 Q2</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                  KES 452,000
                </div>
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                  <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                  <span>100% Reconciled via Daraja C2B V2</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Organized Tenant Records */}
            <motion.div
              whileHover={{ y: -6 }}
              className="feature-card-hover"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '9999px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <ArrowUpRightIcon style={{ width: '22px', height: '22px' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                  Organized Tenant Records
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  Keep tenant information, tenancy documents and communication records accessible to authorized staff.
                </p>
              </div>

              {/* Mini Preview Widget */}
              <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '18px', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  <span>Tenancy Verification</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>Active</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '9999px', backgroundColor: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                      JM
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>John Mwangi</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#065F46', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '9999px' }}>
                    Verified
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
                  Instant SMS/Email lease receipts
                </div>
              </div>
            </motion.div>
          </div>

          {/* 2 Additional Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SparklesIcon style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Smarter Operations</h4>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Use automation, reminders and AI-assisted insights to support everyday property management.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheckIcon style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Secure Access</h4>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Give owners, managers, accountants and tenants access to the information and tools relevant to their responsibilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURES SECTION (9 CARDS WITH HEROICONS)
      ========================================================================== */}
      <section
        id="features"
        style={{
          padding: '88px 0',
          borderTop: '1px solid #E2E8F0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              FEATURES & CAPABILITIES
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Everything You Need to Manage Your Properties
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', marginTop: '12px' }}>
              Powerful property management tools designed to simplify everyday rental operations and give you better control of your business.
            </p>
          </div>

          <div
            className="features-nine-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            {[
              {
                icon: BuildingOffice2Icon,
                title: 'Property & Unit Management',
                desc: 'Organize your entire property portfolio in one place. Manage buildings, apartments, units, occupancy, property details and rental information.',
              },
              {
                icon: UsersIcon,
                title: 'Tenant Management',
                desc: 'Maintain organized tenant profiles, contact information, identification documents, emergency contacts, lease details and tenancy history.',
              },
              {
                icon: CreditCardIcon,
                title: 'Rent Collection & Payments',
                desc: 'Track rent invoices, payment records, outstanding balances and collection performance. Support M-Pesa Paybill/Till C2B and configured bank payment workflows.',
                badge: 'C2B: 1343073',
              },
              {
                icon: DocumentCheckIcon,
                title: 'Lease & Booking Management',
                desc: 'Create and manage tenancy agreements, lease periods, renewals, bookings, rent terms and important expiry dates.',
              },
              {
                icon: WrenchScrewdriverIcon,
                title: 'Maintenance Management',
                desc: 'Receive maintenance requests, assign technicians, monitor progress, manage expenses and keep property maintenance records organized.',
              },
              {
                icon: BanknotesIcon,
                title: 'Financial Management',
                desc: 'Get a clearer view of rental income, outstanding invoices, deposits, expenses and financial reports through connected financial management.',
              },
              {
                icon: DocumentMagnifyingGlassIcon,
                title: 'OCR & Document Intelligence',
                desc: 'Extract information from uploaded tenancy agreements, invoices, receipts and other documents. Review and approve extracted information before it is submitted to the relevant system.',
              },
              {
                icon: SparklesIcon,
                title: 'AI Property Assistant',
                desc: 'Get assistance understanding property operations, identifying important trends and interpreting authorized business information with AI-powered insights.',
              },
              {
                icon: ChartBarIcon,
                title: 'Analytics & Reports',
                desc: 'Understand occupancy, rent collection, arrears, property performance and operational trends through interactive dashboards and reports.',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="feature-card-hover"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '26px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px',
                    }}
                  >
                    <f.icon style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      {f.title}
                    </h3>
                    {f.badge && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#ECFDF5',
                          color: '#065F46',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          border: '1px solid #A7F3D0',
                        }}
                      >
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55, marginTop: '10px' }}>
                    {f.desc}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 600, color: '#2563EB' }}>
                  <span>Explore capability</span>
                  <ChevronRightIcon style={{ width: '14px', height: '14px', marginLeft: '4px' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEAMLESS INTEGRATIONS (CONNECTED NODES DIAGRAM)
      ========================================================================== */}
      <section
        style={{
          padding: '72px 0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)',
              borderRadius: '28px',
              border: '1px solid #DBEAFE',
              padding: '48px 32px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              CONNECTIVITY
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Seamless Integrations
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '10px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
              Automate collections and reconciliations through Kenya's leading financial networks.
            </p>

            {/* Nodes Visual Diagram */}
            <div style={{ position: 'relative', maxWidth: '720px', margin: '48px auto 0 auto', padding: '24px 0' }}>
              <svg
                ref={integrationsSvgRef}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                viewBox="0 0 600 240"
                fill="none"
              >
                <path className="pulse-line-element" d="M 120 40 Q 250 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
                <path className="pulse-line-element" d="M 200 40 Q 260 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
                <path className="pulse-line-element" d="M 400 40 Q 340 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
                <path className="pulse-line-element" d="M 480 40 Q 350 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
                <path className="pulse-line-element" d="M 160 200 Q 240 160 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
                <path className="pulse-line-element" d="M 440 200 Q 360 160 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
              </svg>

              {/* Top Row Providers */}
              <div className="integration-nodes-top" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '60px', position: 'relative', zIndex: 10 }}>
                <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#10B981' }} />
                  <span>Safaricom C2B (1343073)</span>
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  KCB Bank
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  Equity Bank
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  Co-op Bank
                </div>
              </div>

              {/* Center Guri24 Hub Node */}
              <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(37, 99, 235, 0.4)',
                    border: '4px solid #FFFFFF',
                  }}
                >
                  <BuildingOffice2Icon style={{ width: '28px', height: '28px' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, marginTop: '2px' }}>Guri24</span>
                </div>
              </div>

              {/* Bottom Row Providers */}
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '60px', position: 'relative', zIndex: 10 }}>
                <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  KRA iTax (WHT 7.5%)
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  Standard Chartered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HOW IT WORKS (3 SIMPLE STEPS)
      ========================================================================== */}
      <section
        id="how-it-works"
        style={{
          padding: '88px 0',
          borderTop: '1px solid #E2E8F0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              GET STARTED
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Get Started in 3 Simple Steps
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', marginTop: '12px' }}>
              Set up your organization and start managing your rental operations from one workspace.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {[
              {
                step: '01',
                title: 'Set Up Your Organization',
                desc: 'Create your Guri24 organization, configure your business details and invite your team.',
              },
              {
                step: '02',
                title: 'Add Properties & Tenants',
                desc: 'Register your buildings, units, tenants, leases and rental information.',
              },
              {
                step: '03',
                title: 'Manage Everything in One Place',
                desc: 'Track rent collection, manage maintenance, organize documents and monitor property performance.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#BFDBFE', marginBottom: '14px' }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: DASHBOARD / PRODUCT SHOWCASE
      ========================================================================== */}
      <section
        style={{
          padding: '72px 0',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div style={{ maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              COMPLETE VISIBILITY
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Your Entire Property Portfolio at a Glance
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '10px' }}>
              Live operational intelligence across every aspect of your tenancy lifecycle.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
              maxWidth: '800px',
              margin: '0 auto 36px auto',
            }}
          >
            {[
              'Occupancy',
              'Rent Invoices',
              'Collected Payments',
              'Outstanding Balances',
              'Maintenance Tickets',
              'Tenancy Documents',
              'Financial Summaries',
              'Team Activity',
            ].map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            to="/signup"
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
              padding: '12px 28px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            }}
          >
            <span>Explore Guri24</span>
            <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: SOLUTIONS (FOR LANDLORDS, MANAGERS, COMPANIES, TENANTS)
      ========================================================================== */}
      <section
        id="solutions"
        style={{
          padding: '88px 0',
          borderTop: '1px solid #E2E8F0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.06em', marginBottom: '8px' }}>
              TAILORED WORKSPACES
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Solutions Tailored to How You Operate
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', marginTop: '12px' }}>
              Dedicated capabilities designed for every stakeholder in the property ecosystem.
            </p>
          </div>

          <div
            className="solutions-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}
          >
            {[
              {
                title: 'For Landlords',
                desc: 'Keep track of rental income, expenses, occupancy and property performance without administrative stress.',
              },
              {
                title: 'For Property Managers',
                desc: 'Manage multiple buildings, units, tenant requests, rent collection and team tasks in one connected system.',
              },
              {
                title: 'For Real Estate Companies',
                desc: 'Oversee property portfolios, staff assignments, business records and operational analytics from a central platform.',
              },
              {
                title: 'For Tenants',
                desc: 'Access tenancy details, view invoices, verify payment records and submit maintenance requests with ease.',
              },
            ].map((sol, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '26px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                    {sol.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                    {sol.desc}
                  </p>
                </div>
                <Link
                  to="/signup"
                  style={{
                    marginTop: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#2563EB',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Learn more</span>
                  <ArrowRightIcon style={{ width: '12px', height: '12px' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: RESULTS & BUSINESS IMPACT
      ========================================================================== */}
      <section
        style={{
          padding: '64px 0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}
          >
            {[
              { metric: '40%', label: 'Faster Processing', sub: 'Automated invoice allocation' },
              { metric: '3×', label: 'Higher Team Alignment', sub: 'Centralized tenant records' },
              { metric: '100%', label: 'Audit Readiness', sub: 'Immutable double-entry ledger' },
              { metric: '10k+', label: 'Active Units Supported', sub: 'Engineered for high scale' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '38px', fontWeight: 900, color: '#2563EB' }}>{stat.metric}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>{stat.label}</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FINAL CTA BANNER (ROYAL BLUE CONTAINER)
      ========================================================================== */}
      <section
        id="contact"
        style={{
          padding: '72px 0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="guri24-container">
          <div
            style={{
              background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)',
              borderRadius: '32px',
              padding: '60px 32px',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: '0 24px 60px -10px rgba(37, 99, 235, 0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
              <h2 style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
                Ready to Take Control of Your Properties?
              </h2>
              <p style={{ fontSize: '16px', color: '#DBEAFE', marginTop: '14px', lineHeight: 1.5 }}>
                Join property managers, landlords and real estate companies using Guri24 to simplify operations and grow their business.
              </p>

              <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <Link
                  to="/signup"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#1D4ED8',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                    padding: '13px 30px',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  style={{
                    backgroundColor: 'rgba(30, 58, 138, 0.65)',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 600,
                    padding: '13px 26px',
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
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: FOOTER (HEROICONS & COMPLETE LINKS)
      ========================================================================== */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '64px 0 32px 0',
          position: 'relative',
          zIndex: 10,
          fontSize: '14px',
          color: '#64748B',
        }}
      >
        <div className="guri24-container">
          <div
            className="footer-cols"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '40px',
              marginBottom: '48px',
            }}
          >
            {/* Brand Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BuildingOffice2Icon style={{ width: '18px', height: '18px' }} />
                </div>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  Guri<span style={{ color: '#2563EB' }}>24</span>
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, maxWidth: '320px', margin: 0 }}>
                Smart property management platform for rental properties, tenants, leases, automated C2B payments and financial records.
              </p>
            </div>

            {/* Platform */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.04em', marginBottom: '14px' }}>
                Platform
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <a href="#features" style={{ textDecoration: 'none', color: '#64748B' }}>Property Management</a>
                <a href="#features" style={{ textDecoration: 'none', color: '#64748B' }}>Tenant Directory</a>
                <a href="#features" style={{ textDecoration: 'none', color: '#64748B' }}>Rent Collection & C2B</a>
                <a href="#features" style={{ textDecoration: 'none', color: '#64748B' }}>Maintenance Tickets</a>
              </div>
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.04em', marginBottom: '14px' }}>
                Company
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <a href="#why-guri24" style={{ textDecoration: 'none', color: '#64748B' }}>About Us</a>
                <a href="#solutions" style={{ textDecoration: 'none', color: '#64748B' }}>Solutions</a>
                <a href="#contact" style={{ textDecoration: 'none', color: '#64748B' }}>Contact Sales</a>
                <Link to="/app/dashboard" style={{ textDecoration: 'none', color: '#64748B' }}>Client Portal</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.04em', marginBottom: '14px' }}>
                Legal & Security
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <Link to="/legal/privacy" style={{ textDecoration: 'none', color: '#64748B' }}>Privacy Policy</Link>
                <Link to="/legal/terms" style={{ textDecoration: 'none', color: '#64748B' }}>Terms of Service</Link>
                <Link to="/legal/data-protection" style={{ textDecoration: 'none', color: '#64748B' }}>Kenya DPA Compliance</Link>
                <span style={{ color: '#94A3B8' }}>Short Code: 1343073</span>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '28px',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#94A3B8',
              gap: '12px',
            }}
          >
            <div>© 2026 Guri24 Rental Management Ltd. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Built for Kenyan Property Managers</span>
              <span>Daraja C2B V2 Powered</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE "BOOK A DEMO" MODAL (FRAMER MOTION & HEROICONS)
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
                    Demo Scheduled!
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                    Our team will reach out at <strong style={{ color: '#0F172A' }}>{demoForm.email}</strong> within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Book a Guri24 Walkthrough
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      See how our C2B V2 payment reconciliation and portfolio tools automate your rentals.
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
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    Confirm Demo Booking
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
