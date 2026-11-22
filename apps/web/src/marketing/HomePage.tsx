import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UsersIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  CheckCircleIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
  ChevronRightIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

export const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    units: '25-100 units',
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setDemoModalOpen(false);
      setDemoForm({ name: '', email: '', phone: '', units: '25-100 units' });
    }, 2400);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        fontFamily: "'Geist', 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Scoped CSS for responsive grids, borderless logos, smooth anchor scrolling, and 3D card perspective */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        section[id] {
          scroll-margin-top: 50px;
        }
        .tt-container {
          width: 100%;
          max-width: 1180px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 24px;
          padding-right: 24px;
          box-sizing: border-box;
        }
        .tt-nav-link {
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.15s ease;
        }
        .tt-nav-link:hover {
          color: #2563EB;
        }
        .tt-btn-blue {
          background-color: #2563EB;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .tt-btn-blue:hover {
          background-color: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }
        .tt-social-float {
          position: absolute;
          z-index: 25;
          user-select: none;
        }
        /* BORDERLESS PARTNER LOGO STRIP */
        .partner-logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          transition: transform 0.2s ease, opacity 0.2s ease;
          cursor: default;
        }
        .partner-logo-item:hover {
          transform: translateY(-3px) scale(1.05);
        }
        .partner-logo-item img {
          max-height: 38px;
          max-width: 140px;
          object-fit: contain;
          display: block;
        }
        /* 3D CARD PERSPECTIVE CONTAINER */
        .card-3d-perspective {
          perspective: 1200px;
        }
        @media (max-width: 900px) {
          .tt-desktop-nav { display: none !important; }
          .tt-mobile-toggle { display: block !important; }
          .tt-hero-title { font-size: 34px !important; line-height: 1.15 !important; }
          .tt-feature-banner { flex-direction: column !important; gap: 24px !important; }
          .tt-feature-banner-right { width: 100% !important; }
          .tt-four-grid { grid-template-columns: 1fr !important; }
          .tt-how-it-works-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .tt-about-grid { grid-template-columns: 1fr !important; }
          .tt-testimonials-grid { grid-template-columns: 1fr !important; }
          .tt-pricing-grid { grid-template-columns: 1fr !important; }
          .tt-footer-content { flex-direction: column !important; gap: 32px !important; }
          .tt-social-float { display: none !important; }
          .hero-3d-layer-behind { display: none !important; }
        }
      `}</style>

      {/* =========================================================================
          SECTION 1: HERO CONTAINER (TRENDTIDE PALETTE & 3D LAYERED MOCKUP)
      ========================================================================== */}
      <section
        style={{
          background: 'linear-gradient(180deg, #E6F2FE 0%, #EDF6FF 45%, #FFFFFF 100%)',
          paddingTop: '20px',
          paddingBottom: '80px',
          position: 'relative',
        }}
      >
        <div className="tt-container">
          {/* ----------------- Top Navigation Bar ----------------- */}
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0 36px 0',
            }}
          >
            {/* Official Guri24 Brand Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="Guri24"
                style={{
                  width: '38px',
                  height: '38px',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.18)',
                }}
              />
              <span style={{ fontSize: '21px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Guri<span style={{ color: '#2563EB' }}>24</span>
              </span>
            </Link>

            {/* Center Menu Links matching reference */}
            <nav className="tt-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <a href="#how-it-works" className="tt-nav-link">How it works</a>
              <a href="#about" className="tt-nav-link">About Us</a>
              <a href="#features" className="tt-nav-link">Features</a>
              <a href="#pricing" className="tt-nav-link">Pricing</a>
            </nav>

            {/* Right Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="tt-btn-blue"
                style={{ fontSize: '13px', padding: '9px 20px' }}
              >
                Book the demo
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="tt-mobile-toggle"
                style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                aria-label="Toggle menu"
              >
                <Bars3Icon style={{ width: '26px', height: '26px', color: '#0F172A' }} />
              </button>
            </div>
          </header>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>How it works</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>About Us</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>Features</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>Pricing</a>
            </div>
          )}

          {/* ----------------- Hero Headline & Subtitle ----------------- */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '20px auto 40px auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                backgroundColor: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#2563EB',
                border: '1px solid #DBEAFE',
                marginBottom: '18px',
                boxShadow: '0 2px 6px rgba(37,99,235,0.06)',
              }}
            >
              <SparklesIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} />
              <span>Instant Invoicing & Automated Daraja C2B</span>
            </div>

            <h1
              className="tt-hero-title"
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 auto',
              }}
            >
              Track, Analyze, and Grow Your <br />
              Property Rentals with Ease
            </h1>

            <p
              style={{
                marginTop: '18px',
                fontSize: '15px',
                color: '#64748B',
                lineHeight: 1.6,
                maxWidth: '560px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Get real-time insights on rent collections, occupancy growth, tenant records, and verified Daraja C2B receipts, all in one place.
            </p>

            <div style={{ marginTop: '28px' }}>
              <Link
                to="/signup"
                className="tt-btn-blue"
                style={{ fontSize: '14px', padding: '13px 32px' }}
              >
                Start your free trial
              </Link>
            </div>
          </div>

          {/* ----------------- 3D Layered Perspective Showcase ----------------- */}
          <div
            className="card-3d-perspective"
            style={{
              position: 'relative',
              maxWidth: '960px',
              margin: '48px auto 0 auto',
            }}
          >
            {/* Ambient Radiant Glow Aura behind tablet */}
            <div
              style={{
                position: 'absolute',
                top: '46%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '740px',
                height: '480px',
                background:
                  'radial-gradient(circle at center, rgba(99, 102, 241, 0.22) 0%, rgba(147, 51, 234, 0.12) 35%, rgba(59, 130, 246, 0.05) 60%, transparent 75%)',
                filter: 'blur(50px)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />

            {/* 6 High-Fidelity Floating Service Badges Hugging Tablet with Bouncing Physics */}
            {/* 1. M-Pesa C2B Paybill (Top-Left) */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1, y: -6 }}
              className="tt-social-float"
              style={{
                top: '10%',
                left: '-8px',
                padding: '7px 14px 7px 8px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 14px 32px rgba(16, 185, 129, 0.22), 0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                zIndex: 30,
                cursor: 'pointer',
              }}
              title="Safaricom Lipa Na M-Pesa C2B Paybill 1343073"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DevicePhoneMobileIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>M-Pesa C2B</span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#059669', lineHeight: 1.2 }}>1343073 Verified</span>
              </div>
            </motion.div>

            {/* 2. Bank Reconciliation (Mid-Left) */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              whileHover={{ scale: 1.1, y: -6 }}
              className="tt-social-float"
              style={{
                top: '46%',
                left: '-24px',
                padding: '7px 14px 7px 8px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                boxShadow: '0 14px 32px rgba(37, 99, 235, 0.22), 0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                zIndex: 30,
                cursor: 'pointer',
              }}
              title="Bank Feeds: KCB, Equity & Co-op"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BuildingLibraryIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>Bank Feeds</span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#2563EB', lineHeight: 1.2 }}>Auto-Reconciled</span>
              </div>
            </motion.div>

            {/* 3. Double-Entry Rent Ledger (Bottom-Left) */}
            <motion.div
              animate={{ y: [0, -11, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
              whileHover={{ scale: 1.1, y: -6 }}
              className="tt-social-float"
              style={{
                bottom: '15%',
                left: '12px',
                padding: '7px 14px 7px 8px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(2, 132, 199, 0.3)',
                boxShadow: '0 14px 32px rgba(2, 132, 199, 0.22), 0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                zIndex: 30,
                cursor: 'pointer',
              }}
              title="Audit-Ready Double-Entry Ledger"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#F0F9FF',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCardIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>Rent Ledger</span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#0284C7', lineHeight: 1.2 }}>DR == CR Balanced</span>
              </div>
            </motion.div>

            {/* 4. AI Assistant (Top-Right) */}
            <motion.div
              animate={{ y: [0, -13, 0] }}
              transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              whileHover={{ scale: 1.1, y: -6 }}
              className="tt-social-float"
              style={{
                top: '10%',
                right: '-8px',
                padding: '7px 14px 7px 8px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                boxShadow: '0 14px 32px rgba(124, 58, 237, 0.22), 0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                zIndex: 30,
                cursor: 'pointer',
              }}
              title="AI Property Intelligence"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#F5F3FF',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SparklesIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>AI Assistant</span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#7C3AED', lineHeight: 1.2 }}>Smart Trends</span>
              </div>
            </motion.div>

            {/* 5. KRA iTax Compliance (Mid-Right) */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              whileHover={{ scale: 1.1, y: -6 }}
              className="tt-social-float"
              style={{
                top: '46%',
                right: '-24px',
                padding: '7px 14px 7px 8px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                boxShadow: '0 14px 32px rgba(220, 38, 38, 0.20), 0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                zIndex: 30,
                cursor: 'pointer',
              }}
              title="KRA iTax Real Estate Withholding & Tax Ready"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheckIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>KRA iTax</span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#DC2626', lineHeight: 1.2 }}>100% Compliant</span>
              </div>
            </motion.div>

            {/* 6. Instant Digital Receipts (Bottom-Right) */}
            <motion.div
              animate={{ y: [0, -13, 0] }}
              transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
              whileHover={{ scale: 1.1, y: -6 }}
              className="tt-social-float"
              style={{
                bottom: '15%',
                right: '12px',
                padding: '7px 14px 7px 8px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                boxShadow: '0 14px 32px rgba(217, 119, 6, 0.20), 0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                zIndex: 30,
                cursor: 'pointer',
              }}
              title="Automated SMS & Email Receipts"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DocumentTextIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>Auto Receipts</span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#D97706', lineHeight: 1.2 }}>Instant SMS</span>
              </div>
            </motion.div>

            {/* Foreground 3D Interactive Framer Motion Dashboard Tablet with Silhouette Drop-Shadow */}
            <motion.div
              whileHover={{
                rotateX: -1.2,
                rotateY: 1.2,
                scale: 1.015,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                position: 'relative',
                zIndex: 10,
                transformStyle: 'preserve-3d',
                filter:
                  'drop-shadow(0 32px 70px rgba(99, 102, 241, 0.26)) drop-shadow(0 12px 28px rgba(15, 23, 42, 0.09))',
              }}
            >
              <img
                src="/dashboard-preview.png"
                alt="Guri24 Rental Management Dashboard Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                }}
              />
            </motion.div>
          </div>

          {/* ----------------- BORDERLESS PARTNER LOGO STRIP (ZERO BORDERS) ----------------- */}
          <div style={{ marginTop: '56px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: '22px' }}>
              Trusted by Kenya's Leading Property & Financial Networks
            </div>

            {/* BORDERLESS, CLEAN LOGOS FLOATING ON CANVAS */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '40px',
              }}
            >
              {/* Safaricom M-Pesa C2B */}
              <div className="partner-logo-item" title="Safaricom Lipa Na M-Pesa C2B">
                <img src="/logos/mpesa-c2b.png" alt="Safaricom M-Pesa C2B" />
              </div>

              {/* KCB Bank */}
              <div className="partner-logo-item" title="KCB Bank">
                <img src="/logos/kcb-bank.png" alt="KCB Bank" />
              </div>

              {/* Equity Group */}
              <div className="partner-logo-item" title="Equity Group">
                <img src="/logos/equity-bank.png" alt="Equity Group" />
              </div>

              {/* Co-operative Bank (WHITE LETTERS PROCESSED TO BLACK FOR PERFECT CONTRAST) */}
              <div className="partner-logo-item" title="Co-operative Bank">
                <img src="/logos/coop-bank.png" alt="Co-operative Bank" />
              </div>

              {/* KRA iTax */}
              <div className="partner-logo-item" title="Kenya Revenue Authority iTax">
                <img src="/logos/kra-itax.png" alt="KRA iTax" />
              </div>

              {/* HassConsult */}
              <div className="partner-logo-item" title="HassConsult Real Estate">
                <img src="/logos/hassconsult.png" alt="HassConsult" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: NARRATIVE STATEMENT WITH HEROICONS (STRICTLY ZERO EMOJIS)
      ========================================================================== */}
      <section style={{ padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.5,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Whether you're aiming to grow your{' '}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                backgroundColor: '#EFF6FF',
                borderRadius: '8px',
                color: '#2563EB',
                verticalAlign: 'middle',
                fontSize: '22px',
                fontWeight: 700,
              }}
            >
              <BuildingOffice2Icon style={{ width: '22px', height: '22px', color: '#2563EB' }} />
              portfolio
            </span>
            , identify new opportunities, or improve occupancy, our dashboard delivers actionable metrics{' '}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                backgroundColor: '#ECFDF5',
                borderRadius: '8px',
                color: '#059669',
                verticalAlign: 'middle',
                fontSize: '22px',
                fontWeight: 700,
              }}
            >
              <ArrowTrendingUpIcon style={{ width: '22px', height: '22px', color: '#059669' }} />
              that help you
            </span>{' '}
            refine your strategy and achieve lasting success.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 3 ALTERNATING PASTEL FEATURE CARDS WITH FRAMER 3D DEPTH
      ========================================================================== */}
      <section id="features" style={{ padding: '0 24px 80px 24px' }}>
        <div className="tt-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* ---------------- CARD 1: SOFT BLUE BANNER (SARAH'S PROPERTY DASHBOARD) ---------------- */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="tt-feature-banner"
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '28px',
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '40px',
              boxShadow: '0 4px 20px rgba(37,99,235,0.04)',
            }}
          >
            {/* Left Content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2563EB',
                  marginBottom: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <UsersIcon style={{ width: '13px', height: '13px' }} />
                <span>Know your tenants better</span>
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
                Audience Growth & Analysis
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '440px' }}>
                Track your occupancy growth in real-time and analyze demographics, payment behaviors, and lease terms. Understand who your tenants are and optimize your agreements based on verified data.
              </p>
              <button onClick={() => setDemoModalOpen(true)} className="tt-btn-blue" style={{ fontSize: '13px', padding: '10px 22px' }}>
                Book a demo
              </button>
            </div>

            {/* Right Embedded 3D Card with Property Manager Dashboard Image */}
            <motion.div
              whileHover={{ rotateY: -3, scale: 1.02 }}
              className="tt-feature-banner-right"
              style={{
                width: '460px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/property-manager-dashboard.jpg"
                alt="Property Manager Live Console"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>
          </motion.div>

          {/* ---------------- CARD 2: SOFT PEACH BANNER (SLEEK CAMPAIGN & METRIC HUD) ---------------- */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="tt-feature-banner"
            style={{
              backgroundColor: '#FFF5EB',
              borderRadius: '28px',
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '40px',
              boxShadow: '0 4px 20px rgba(249,115,22,0.04)',
            }}
          >
            {/* Left Content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#EA580C',
                  marginBottom: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <ChartBarIcon style={{ width: '13px', height: '13px' }} />
                <span>Drive deeper transparency</span>
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
                Improving Collections with Metrics Analysis
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '440px' }}>
                Enhance your rental performance with detailed metrics on on-time collections, arrears aging, and deposit liabilities. Discover which units generate the most consistent returns.
              </p>
              <button onClick={() => setDemoModalOpen(true)} className="tt-btn-blue" style={{ fontSize: '13px', padding: '10px 22px' }}>
                Book a demo
              </button>
            </div>

            {/* Right Embedded 3D Card with Sleek Console Mockup */}
            <motion.div
              whileHover={{ rotateY: -3, scale: 1.02 }}
              className="tt-feature-banner-right"
              style={{
                width: '460px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/sleek-console-mockup.jpg"
                alt="Sleek Metric Performance Console"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>
          </motion.div>

          {/* ---------------- CARD 3: SOFT LAVENDER BANNER (ISOMETRIC 3D CARDS) ---------------- */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="tt-feature-banner"
            style={{
              backgroundColor: '#FAF5FF',
              borderRadius: '28px',
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '40px',
              boxShadow: '0 4px 20px rgba(147,51,234,0.04)',
            }}
          >
            {/* Left Content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#9333EA',
                  marginBottom: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <BanknotesIcon style={{ width: '13px', height: '13px' }} />
                <span>Turn vacancies into revenue</span>
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
                Monetization and Financial Management
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '440px' }}>
                Manage your listings and maximize rental yield. Guri24 helps you track invoices, verify automated M-Pesa C2B receipts, and unlock the full earning potential of your property portfolio.
              </p>
              <button onClick={() => setDemoModalOpen(true)} className="tt-btn-blue" style={{ fontSize: '13px', padding: '10px 22px' }}>
                Book a demo
              </button>
            </div>

            {/* Right Embedded 3D Card with Isometric 3D Cards */}
            <motion.div
              whileHover={{ rotateY: -3, scale: 1.02 }}
              className="tt-feature-banner-right"
              style={{
                width: '460px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/isometric-3d-cards.jpg"
                alt="Isometric 3D Monthly Summaries"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "GET MORE VALUE FROM YOUR TOOLS" (4-GRID HEROICONS)
      ========================================================================== */}
      <section style={{ padding: '60px 24px', backgroundColor: '#FAFCFF', borderTop: '1px solid #F1F5F9' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '8px' }}>
              Our Features
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Get more value from your tools
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '10px' }}>
              Connect your properties, connect your team. With Daraja C2B already built-in, your team's favorite tools are just a click away.
            </p>
          </div>

          <div
            className="tt-four-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px 48px',
              maxWidth: '880px',
              margin: '0 auto',
            }}
          >
            <div>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <BanknotesIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>Monetization Tools</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                Increase your rental earnings potential. Track all unit performance, manage payments, and make data-driven decisions to improve your NOI.
              </p>
            </div>

            <div>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <ChartBarIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>User-Friendly Dashboard</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                All your data in one place. With Guri24's intuitive interface, view and oversee an organized and visually clear dashboard for easy analysis.
              </p>
            </div>

            <div>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <SparklesIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>Real-Time Insights</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                Stay up to date with your property performance. Guri24 provides real-time rent tracking to react quickly to charges and tenant balances.
              </p>
            </div>

            <div>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <UsersIcon style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>Audience Deep Dive</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                Understand your tenants on a deeper level. Access detailed demographic and lease analytics to refine your tenant retention and marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: HOW IT WORKS ("GET STARTED IN 3 EASY STEPS")
      ========================================================================== */}
      <section id="how-it-works" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              How It Works
            </div>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Get Started In Just 3 Easy Steps
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', lineHeight: 1.6 }}>
              Streamline your rental operations with a guided onboarding experience designed for speed, clarity, and complete operational control.
            </p>
          </div>

          <div
            className="tt-how-it-works-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.1fr',
              gap: '48px',
              alignItems: 'center',
              maxWidth: '1080px',
              margin: '0 auto',
            }}
          >
            {/* Left: Interactive 3D Mockup Preview */}
            <motion.div
              whileHover={{ rotateY: 2, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(37,99,235,0.12), 0 0 1px rgba(15,23,42,0.08)',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
              }}
            >
              <img
                src="/property-manager-dashboard.jpg"
                alt="Property Management Workflow Console"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>

            {/* Right: 3 Sequential Step Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  padding: '24px',
                  borderRadius: '18px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '15px',
                    flexShrink: 0,
                  }}
                >
                  01
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                    Simple & Fast Portfolio Setup
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    Add buildings, floors, and rental units in minutes. Set rent amounts, security deposits, and utilities with customizable billing cycles.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  padding: '24px',
                  borderRadius: '18px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: '#F5F3FF',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '15px',
                    flexShrink: 0,
                  }}
                >
                  02
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                    Work Together Effortlessly
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    Invite property managers, caretakers, and accountants with granular RBAC permissions. Register tenants and activate digital leases seamlessly.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  padding: '24px',
                  borderRadius: '18px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '15px',
                    flexShrink: 0,
                  }}
                >
                  03
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                    Monitor Collections & Growth
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    Collect rent automatically via Safaricom Daraja C2B Paybill 1343073. View live payment matching, arrears aging, and double-entry ledgers instantly.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: ABOUT US ("BUILT FOR THE PEOPLE WHO MANAGE PROPERTIES")
      ========================================================================== */}
      <section id="about" style={{ padding: '80px 24px', backgroundColor: '#FAFCFF', borderTop: '1px solid #F1F5F9' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              About Us
            </div>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Built for the People Who Manage Properties
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', lineHeight: 1.6 }}>
              Guri24 brings property owners, managers, accountants, and tenants together through one connected, intelligent property management platform designed for Kenyan real estate.
            </p>

            {/* Audience Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '24px',
              }}
            >
              {[
                'Property Owners',
                'Property Managers',
                'Real Estate Companies',
                'Landlords',
                'Residential Estates',
              ].map((badge, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 16px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #DBEAFE',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* 3 Core Value Cards */}
          <div
            className="tt-about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              maxWidth: '1080px',
              margin: '0 auto',
            }}
          >
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                padding: '32px 24px',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <BuildingOfficeIcon style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                Kenya Real Estate Ready
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Crafted specifically for the nuances of local property administration—from single apartment blocks to sprawling gated communities with localized tenancy conventions.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                padding: '32px 24px',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <DevicePhoneMobileIcon style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                Automated Daraja C2B
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Instant real-time payment matching on Paybill 1343073. Eliminate counterfeit MPESA messages, missed rent allocations, and hours of tedious spreadsheet reconciliation.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                padding: '32px 24px',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#F5F3FF',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <ShieldCheckIcon style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                Bank-Grade Accounting
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Double-entry financial records ensure Debits == Credits. Security deposits post strictly to liability accounts, keeping your NOI and audit reports 100% compliant.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CUSTOMER TESTIMONIALS (SOFT SKY BLUE CONTAINER)
      ========================================================================== */}
      <section style={{ padding: '60px 24px', backgroundColor: '#EBF5FF' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Customer testimonials</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
              What Kenyan landlords, estate executives and property managers say about Guri24.
            </p>
          </div>

          <div
            className="tt-testimonials-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              maxWidth: '880px',
              margin: '0 auto',
            }}
          >
            {[
              {
                quote: "Guri24 has helped me finally understand my property cashflow on a deeper level. The automated Daraja C2B reconciliation means no more missing payment slips.",
                name: "Kristin Watson",
                role: "Residential Estate Landlord",
              },
              {
                quote: "Before using Guri24, we struggled to make sense of all the data across my properties. Now, everything is in one place, and invoices are automatically matched.",
                name: "Jerome Bell",
                role: "Property Manager, Nairobi",
              },
              {
                quote: "I love how easy it is to manage 50+ units with Guri24. The real-time insights are incredibly useful, and I've already seen improvements in collection speed.",
                name: "Theresa Webb",
                role: "Commercial Property Executive",
              },
              {
                quote: "Guri24 has completely transformed how I oversee my portfolio. Automated notifications have cut tenant arrears in half since month one.",
                name: "Bessie Cooper",
                role: "Real Estate Operations Lead",
              },
            ].map((t, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: '0 0 16px 0' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: "FLEXIBLE PLANS FOR EVERY NEED" (PRICING WITH PILL TOGGLE)
      ========================================================================== */}
      <section id="pricing" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '8px' }}>
              Pricing
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Flexible Plans for Every Need
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '10px' }}>
              Whether you're a solo landlord or managing a team, Guri24 offers pricing options tailored to your needs.
            </p>

            {/* Monthly / Annual Billing Toggle matching TrendTide */}
            <div style={{ display: 'inline-flex', padding: '4px', backgroundColor: '#F1F5F9', borderRadius: '9999px', marginTop: '24px' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: billingCycle === 'monthly' ? '#FFFFFF' : 'transparent',
                  color: billingCycle === 'monthly' ? '#0F172A' : '#64748B',
                  boxShadow: billingCycle === 'monthly' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                }}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: billingCycle === 'annual' ? '#FFFFFF' : 'transparent',
                  color: billingCycle === 'annual' ? '#0F172A' : '#64748B',
                  boxShadow: billingCycle === 'annual' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                }}
              >
                Annual billing
              </button>
            </div>
          </div>

          {/* 3 Pricing Cards matching reference */}
          <div
            className="tt-pricing-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              maxWidth: '920px',
              margin: '0 auto',
            }}
          >
            {/* Card 1: Individual Landlords */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Individual Landlords</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Perfect for individual property owners</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginTop: '16px' }}>
                  {billingCycle === 'monthly' ? 'KES 1,500' : 'KES 1,200'} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>/ month</span>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Up to 25 units</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Real-time rent collection tracking</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Automated SMS payment receipts</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Basic maintenance requests</div>
                </div>
              </div>

              <Link to="/signup" className="tt-btn-blue" style={{ marginTop: '28px', fontSize: '13px', padding: '11px 0', width: '100%' }}>
                Subscribe Now
              </Link>
            </div>

            {/* Card 2: Teams & Agencies (Featured Center Card with Light Blue Tint) */}
            <div style={{ backgroundColor: '#F0F7FF', borderRadius: '24px', border: '2px solid #2563EB', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Teams & Agencies</div>
                  <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#2563EB', color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px' }}>Most Popular</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Designed for businesses and rental agencies</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginTop: '16px' }}>
                  {billingCycle === 'monthly' ? 'KES 4,500' : 'KES 3,600'} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>/ month</span>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Multi-account management</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Advanced C2B Paybill 1343073 sync</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Team collaboration tools</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> White-label tenant receipts</div>
                </div>
              </div>

              <Link to="/signup" className="tt-btn-blue" style={{ marginTop: '28px', fontSize: '13px', padding: '11px 0', width: '100%' }}>
                Subscribe Now
              </Link>
            </div>

            {/* Card 3: Custom Plan */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Custom Enterprise</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Designed for large real estate companies</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginTop: '16px' }}>
                  Let's talk!
                </div>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Unlimited properties and units</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Priority 24/7 dedicated support</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> API access for accounting ERPs</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Custom analytics & SLA</div>
                </div>
              </div>

              <button onClick={() => setDemoModalOpen(true)} className="tt-btn-blue" style={{ marginTop: '28px', fontSize: '13px', padding: '11px 0', width: '100%' }}>
                Customize plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: PRE-FOOTER CTA BANNER ("LET'S GROW TOGETHER")
      ========================================================================== */}
      <section style={{ padding: '40px 24px 80px 24px', backgroundColor: '#FFFFFF' }}>
        <div
          className="tt-container"
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '28px',
            padding: '48px 32px 0 32px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '8px' }}>
            Know your properties better
          </div>
          <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#0F172A', margin: '0 0 20px 0' }}>
            Let's Grow Your Property Business Together!
          </h2>
          <button onClick={() => setDemoModalOpen(true)} className="tt-btn-blue" style={{ fontSize: '13px', padding: '10px 24px' }}>
            Book a demo
          </button>

          {/* Embedded Mini Mockup Screen emerging from bottom */}
          <div style={{ maxWidth: '640px', margin: '36px auto 0 auto', backgroundColor: '#FFFFFF', borderRadius: '16px 16px 0 0', border: '1px solid #DBEAFE', borderBottom: 'none', padding: '16px 20px 0 20px', boxShadow: '0 -10px 30px rgba(37,99,235,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>Guri24 Real-Time Analytics</div>
              <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>Online</span>
            </div>
            <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: '12px' }}>
              <div>Total: <strong>KES 240,000</strong></div>
              <div>Occupancy: <strong>94.4%</strong></div>
              <div>Shortcode: <strong>1343073</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: MIDNIGHT DARK FOOTER WITH GIANT WATERMARK (MATCHING TRENDTIDE)
      ========================================================================== */}
      <footer
        style={{
          backgroundColor: '#0D1117',
          color: '#94A3B8',
          padding: '64px 24px 32px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Giant Embossed Watermark behind footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '140px',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.025)',
            userSelect: 'none',
            pointerEvents: 'none',
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
          }}
        >
          Guri24
        </div>

        <div className="tt-container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            className="tt-footer-content"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '48px',
              borderBottom: '1px solid #1E293B',
            }}
          >
            {/* Left Column with Logo */}
            <div style={{ maxWidth: '320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <img
                  src="/logo.png"
                  alt="Guri24"
                  style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '8px' }}
                />
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Guri<span style={{ color: '#3B82F6' }}>24</span>
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                Get real-time insights on occupancy growth, verified collections, and tenant lifecycle, all in one place.
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '16px', fontWeight: 600 }}>
                Follow Us
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px', color: '#94A3B8' }}>
                <span>Twitter</span>
                <span>LinkedIn</span>
                <span>YouTube</span>
              </div>
            </div>

            {/* Center Menu Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <a href="#how-it-works" style={{ textDecoration: 'none', color: '#E2E8F0' }}>How it works</a>
              <a href="#about" style={{ textDecoration: 'none', color: '#E2E8F0' }}>About Us</a>
              <a href="#features" style={{ textDecoration: 'none', color: '#E2E8F0' }}>Features</a>
              <a href="#pricing" style={{ textDecoration: 'none', color: '#E2E8F0' }}>Pricing</a>
            </div>

            {/* Right Newsletter Column */}
            <div style={{ maxWidth: '320px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Subscribe</div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Join our newsletter to stay up to date on features and releases.
              </p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    flex: 1,
                  }}
                />
                <button
                  className="tt-btn-blue"
                  style={{ fontSize: '12px', padding: '8px 16px', borderRadius: '8px' }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
            <div>© 2026 Guri24 Rental Management Ltd. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Use</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE DEMO / STRATEGY CALL MODAL
      ========================================================================== */}
      <AnimatePresence>
        {demoModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              style={{ position: 'relative', width: '100%', maxWidth: '460px', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0', zIndex: 10, boxSizing: 'border-box' }}
            >
              <button onClick={() => setDemoModalOpen(false)} style={{ position: 'absolute', top: '18px', right: '18px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                <XMarkIcon style={{ width: '20px', height: '20px' }} />
              </button>

              {demoSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '9999px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                    <CheckIcon style={{ width: '28px', height: '28px' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Demo Booked!</h3>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>Our team will reach out to <strong style={{ color: '#0F172A' }}>{demoForm.email}</strong> within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Book Guri24 Walkthrough</h3>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>See how our automated Daraja C2B V2 (1343073) reconciliation works.</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peter Gatitu"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="peter@company.com"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="0712 345 678"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Units Managed</label>
                    <select
                      value={demoForm.units}
                      onChange={(e) => setDemoForm({ ...demoForm, units: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                    >
                      <option>1-24 units</option>
                      <option>25-100 units</option>
                      <option>101-500 units</option>
                      <option>500+ units</option>
                    </select>
                  </div>
                  <button type="submit" className="tt-btn-blue" style={{ marginTop: '8px', padding: '12px 0', fontSize: '13px' }}>
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
