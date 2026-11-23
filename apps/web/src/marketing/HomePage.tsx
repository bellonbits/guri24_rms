import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
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
  ArrowUpRightIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const PARTNER_LOGOS = [
  { name: 'Safaricom Lipa Na M-Pesa C2B', src: '/logos/mpesa-c2b.png' },
  { name: 'KCB Bank', src: '/logos/kcb-bank.png' },
  { name: 'Equity Group', src: '/logos/equity-bank.png' },
  { name: 'Co-operative Bank', src: '/logos/coop-bank.png' },
  { name: 'Kenya Revenue Authority iTax', src: '/logos/kra-itax.png' },
  { name: 'HassConsult Real Estate', src: '/logos/hassconsult.png' },
];

export const HomePage: React.FC = () => {
  const { isAuthenticated, currentUserSession, currentUserRole, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    units: '25-100 units',
  });

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userDisplayName = currentUserSession?.fullName?.trim() || currentUserSession?.email?.split('@')[0] || 'User';
  const userFirstName = userDisplayName.split(' ')[0] || 'User';
  const userInitials = (
    userDisplayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('') || 'U'
  );

  const formatRole = (role?: string | null) => {
    if (!role) return 'Member';
    return role
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

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
          SECTION 1: HERO CONTAINER (DREAMY SKY CLOUDS PALETTE & TABLET MOCKUP)
      ========================================================================== */}
      <section
        style={{
          backgroundImage: "url('/hero-sky-clouds.jpg')",
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#EFF6FF',
          paddingTop: '20px',
          paddingBottom: '80px',
          position: 'relative',
        }}
      >
        {/* Soft bottom ambient fade into white content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.75) 55%, #FFFFFF 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        <div className="tt-container" style={{ position: 'relative', zIndex: 10 }}>
          {/* ----------------- Top Navigation Bar ----------------- */}
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0 36px 0',
            }}
          >
            {/* Official UnitFlow Brand Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="UnitFlow"
                style={{
                  width: '38px',
                  height: '38px',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.18)',
                }}
              />
              <span style={{ fontSize: '21px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Unit<span style={{ color: '#2563EB' }}>Flow</span>
              </span>
            </Link>

            {/* Center Menu Links matching reference */}
            <nav className="tt-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <a href="#how-it-works" className="tt-nav-link">How it works</a>
              <a href="#about" className="tt-nav-link">About Us</a>
              <a href="#features" className="tt-nav-link">Features</a>
              <a href="#pricing" className="tt-nav-link">Pricing</a>
            </nav>

            {/* Right Action / Auth Area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              {isAuthenticated && currentUserSession ? (
                <>
                  {/* Direct Dashboard Link */}
                  <Link
                    to="/app/dashboard"
                    className="tt-desktop-nav"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.22)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Squares2X2Icon style={{ width: '15px', height: '15px' }} />
                    <span>Dashboard</span>
                  </Link>

                  {/* Profile Avatar Trigger Button */}
                  <div ref={userMenuRef} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 12px 4px 4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(226, 232, 240, 0.9)',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease',
                      }}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      title="View account profile"
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          letterSpacing: '0.02em',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 2px 6px rgba(37,99,235,0.28)',
                          flexShrink: 0,
                        }}
                      >
                        {userInitials}
                      </div>
                      <span
                        className="tt-desktop-nav"
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0F172A',
                          maxWidth: '120px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {userFirstName}
                      </span>
                      <ChevronDownIcon
                        style={{
                          width: '14px',
                          height: '14px',
                          color: '#64748B',
                          transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>

                    {/* Floating Profile Dropdown Card */}
                    {userMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 10px)',
                          right: 0,
                          width: '260px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '16px',
                          boxShadow: '0 20px 40px -10px rgba(15,23,42,0.18), 0 0 0 1px rgba(15,23,42,0.06)',
                          padding: '16px',
                          zIndex: 1000,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          textAlign: 'left',
                        }}
                      >
                        {/* User Info Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '15px',
                              fontWeight: 800,
                              flexShrink: 0,
                              border: '2px solid #DBEAFE',
                            }}
                          >
                            {userInitials}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#0F172A',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {currentUserSession.fullName || userDisplayName}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: '#64748B',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {currentUserSession.email}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'inline-flex',
                            alignSelf: 'flex-start',
                            padding: '3px 8px',
                            backgroundColor: '#EFF6FF',
                            borderRadius: '9999px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#1D4ED8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {formatRole(currentUserRole || currentUserSession.role)}
                        </div>

                        <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '2px 0' }} />

                        {/* Navigation Items */}
                        <Link
                          to="/app/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#1E293B',
                            textDecoration: 'none',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <Squares2X2Icon style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                          <span>Open Dashboard</span>
                        </Link>

                        <Link
                          to="/app/properties-units"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#1E293B',
                            textDecoration: 'none',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <BuildingOffice2Icon style={{ width: '16px', height: '16px', color: '#64748B' }} />
                          <span>Properties & Units</span>
                        </Link>

                        <Link
                          to="/app/settings"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#1E293B',
                            textDecoration: 'none',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <Cog6ToothIcon style={{ width: '16px', height: '16px', color: '#64748B' }} />
                          <span>Account Settings</span>
                        </Link>

                        <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '2px 0' }} />

                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#EF4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <ArrowRightOnRectangleIcon style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setDemoModalOpen(true)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(203, 213, 225, 0.9)',
                      color: '#334155',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    className="tt-desktop-nav"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#94A3B8';
                      e.currentTarget.style.color = '#0F172A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.9)';
                      e.currentTarget.style.color = '#334155';
                    }}
                  >
                    Book demo
                  </button>

                  <Link
                    to="/login"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      textDecoration: 'none',
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
                  >
                    Log in
                  </Link>

                  <Link
                    to="/signup"
                    className="tt-btn-blue"
                    style={{
                      fontSize: '13px',
                      padding: '9px 20px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Sign up
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle Button */}
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
            <div
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {isAuthenticated && currentUserSession ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800,
                      }}
                    >
                      {userInitials}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                        {currentUserSession.fullName || userDisplayName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{currentUserSession.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/app/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="tt-btn-blue"
                    style={{
                      fontSize: '13px',
                      padding: '10px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Squares2X2Icon style={{ width: '16px', height: '16px' }} />
                    <span>Open Dashboard</span>
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#0F172A',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="tt-btn-blue"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              )}

              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600, padding: '6px 0' }}>How it works</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600, padding: '6px 0' }}>About Us</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600, padding: '6px 0' }}>Features</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600, padding: '6px 0' }}>Pricing</a>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  style={{
                    marginTop: '6px',
                    padding: '8px 0',
                    border: 'none',
                    background: 'none',
                    color: '#EF4444',
                    fontWeight: 600,
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ArrowRightOnRectangleIcon style={{ width: '16px', height: '16px' }} />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}

          {/* ----------------- Hero Headline & Subtitle (Relink Aesthetic) ----------------- */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '24px auto 44px auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#2563EB',
                border: '1px solid rgba(219, 234, 254, 0.8)',
                marginBottom: '18px',
                boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <SparklesIcon style={{ width: '15px', height: '15px', color: '#2563EB' }} />
              <span>One platform. Every property. Complete control.</span>
            </div>

            <h1
              className="tt-hero-title"
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.035em',
                lineHeight: 1.15,
                margin: '0 auto',
              }}
            >
              Your Properties Should Work for You. <br />
              <span style={{ color: '#2563EB' }}>Not the Other Way Around.</span>
            </h1>

            <p
              style={{
                marginTop: '18px',
                fontSize: '16px',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: 500,
              }}
            >
              Managing rental properties can quickly become overwhelming. Rent follow-ups, tenant calls, lease documents, maintenance requests and financial records can turn every day into a list of tasks you never seem to finish.
            </p>
            <p
              style={{
                marginTop: '10px',
                fontSize: '15px',
                color: '#1E293B',
                lineHeight: 1.6,
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: 600,
              }}
            >
              Unit Flow brings everything together, giving you more control, better visibility and more time to grow your property business.
            </p>

            {/* Dual Pill CTA Buttons */}
            <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                className="tt-btn-blue"
                style={{ fontSize: '14px', padding: '13px 34px' }}
              >
                Get Started
              </Link>
              <button
                onClick={() => setDemoModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '13px 26px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
                  transition: 'transform 0.15s ease, background-color 0.15s ease',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                Book a Demo
              </button>
            </div>

            <div style={{ marginTop: '14px', fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
              One platform. Every property. Complete control.
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
                alt="UnitFlow Rental Management Dashboard Preview"
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

          {/* ----------------- BORDERLESS PARTNER LOGO STRIP (LEFT-TO-RIGHT INFINITE FRAMER MOTION STREAM) ----------------- */}
          <div style={{ marginTop: '56px', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: '22px' }}>
              Trusted by Kenya's Leading Property & Financial Networks
            </div>

            {/* Seamless Left-To-Right Animated Stream with Feathered Edge Fade Masks */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                padding: '12px 0 20px 0',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              }}
            >
              <motion.div
                animate={{ x: ['-50%', '0%'] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 25,
                    ease: 'linear',
                  },
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '56px',
                  width: 'max-content',
                  willChange: 'transform',
                }}
              >
                {/* 4 concatenated sets of authentic Kenyan partner logos for a seamless loop */}
                {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.12, y: -4 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 18px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                    title={partner.name}
                  >
                    <img
                      src={partner.src}
                      alt={partner.name}
                      style={{
                        maxHeight: '38px',
                        maxWidth: '140px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE PROBLEM ("IT STARTS WITH ONE PROPERTY")
      ========================================================================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div className="tt-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', marginBottom: '8px' }}>
                The Problem
              </div>
              <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', letterSpacing: '-0.025em' }}>
                It Starts with One Property.
              </h2>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: '0 0 10px 0' }}>
                You buy or manage your first rental property. Things seem manageable.
              </p>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                You know your tenants, remember their rent dates and keep track of payments in a notebook or spreadsheet.
              </p>
            </div>
            <div>
              <a
                href="#how-it-works"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#2563EB',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>How It Works</span>
                <ArrowUpRightIcon style={{ width: '15px', height: '15px' }} />
              </a>
            </div>
          </div>

          {/* 3 Story Cards Grid: The Progression */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            {/* Stage 1: Then You Grow */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <ArrowTrendingUpIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
                  Then You Grow.
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                  You acquire more units. More tenants move in. Some pay late. Others report maintenance issues. Lease agreements need renewing.
                </p>
              </div>

              {/* Embedded Mini UI Widget */}
              <div
                style={{
                  marginTop: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '12px' }}>
                  <span>Portfolio Growth</span>
                  <span style={{ color: '#2563EB' }}>+82 Units Added</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '48px' }}>
                  {[12, 24, 38, 52, 68, 85, 110, 142].map((v, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: i === 7 ? '#2563EB' : '#E2E8F0', height: `${(v / 142) * 100}%`, borderRadius: '4px' }} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stage 2: Receipts Get Misplaced (FEATURED BLUE CARD) */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                background: 'linear-gradient(180deg, #1D4ED8 0%, #2563EB 55%, #3B82F6 100%)',
                borderRadius: '24px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                boxShadow: '0 16px 36px rgba(37,99,235,0.25)',
              }}
            >
              <div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <DocumentTextIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>
                  Receipts Get Misplaced.
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.7, margin: 0 }}>
                  You spend hours checking messages, updating spreadsheets and trying to understand how much your properties actually earn.
                </p>
              </div>

              {/* Embedded Mini UI Widget */}
              <div
                style={{
                  marginTop: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '16px',
                  color: '#0F172A',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
                  <span>Dispersed Records</span>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#DC2626' }}>5+ Separate Apps</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', fontSize: '10px', color: '#64748B' }}>
                  <span style={{ padding: '3px 8px', backgroundColor: '#F1F5F9', borderRadius: '6px' }}>WhatsApp</span>
                  <span style={{ padding: '3px 8px', backgroundColor: '#F1F5F9', borderRadius: '6px' }}>Excel</span>
                  <span style={{ padding: '3px 8px', backgroundColor: '#F1F5F9', borderRadius: '6px' }}>Receipts</span>
                  <span style={{ padding: '3px 8px', backgroundColor: '#F1F5F9', borderRadius: '6px' }}>SMS</span>
                </div>
              </div>
            </motion.div>

            {/* Stage 3: The Struggle */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <WrenchScrewdriverIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
                  The Management Struggle.
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                  Suddenly, managing properties becomes more difficult than growing them. Rent follow-ups and uncoordinated repairs consume your time.
                </p>
              </div>

              {/* Embedded Mini UI Widget */}
              <div
                style={{
                  marginTop: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
                  <span>Unresolved Admin Friction</span>
                  <span style={{ color: '#DC2626' }}>High</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#FEE2E2', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', backgroundColor: '#EF4444', borderRadius: '9999px' }} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section 2 Callout Punchline Banner */}
          <div
            style={{
              padding: '24px 32px',
              backgroundColor: '#F1F5F9',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              maxWidth: '820px',
              margin: '0 auto',
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
              The problem isn't your properties. It's having to manage everything separately.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE TURNING POINT ("THERE IS A BETTER WAY TO MANAGE RENTALS")
      ========================================================================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', marginBottom: '8px' }}>
              The Turning Point
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', letterSpacing: '-0.025em' }}>
              There is a better way to manage rentals.
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              Imagine opening one platform and immediately knowing:
            </p>
          </div>

          {/* 7 Core Visibility Points Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              maxWidth: '1000px',
              margin: '0 auto 40px auto',
            }}
          >
            {[
              'Which properties and units you manage.',
              'Which units are occupied or vacant.',
              'Which tenants have paid and who still owes rent.',
              'Which leases are expiring.',
              'Which maintenance requests need attention.',
              'How much rent you have collected.',
              'How your property business is performing.',
            ].map((point, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3, scale: 1.01 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '18px 22px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                }}
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
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', lineHeight: 1.5 }}>
                  {point}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Turning Point Conclusion Banner */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: '680px',
              margin: '0 auto',
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #DBEAFE',
              boxShadow: '0 8px 24px rgba(37,99,235,0.06)',
            }}
          >
            <div style={{ fontSize: '15px', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
              No scattered spreadsheets. No unnecessary back-and-forth. No guessing.
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB' }}>
              That is what Unit Flow is built to deliver.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE SOLUTION ("EVERYTHING CONNECTED. EVERYTHING UNDER CONTROL.")
      ========================================================================== */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', marginBottom: '8px' }}>
              The Solution
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', letterSpacing: '-0.025em' }}>
              Everything Connected. Everything Under Control.
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Unit Flow gives you one organized place to manage your entire rental operation.
            </p>
          </div>

          {/* 8 Feature Cards Grid (4x2 on desktop) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1140px',
              margin: '0 auto',
            }}
          >
            {[
              {
                title: 'Property Management',
                desc: 'Manage buildings, properties and individual units from one central workspace.',
                icon: <BuildingOffice2Icon style={{ width: '22px', height: '22px' }} />,
                color: '#2563EB',
                bg: '#EFF6FF',
              },
              {
                title: 'Tenant Management',
                desc: 'Keep tenant information, contact details, tenancy records and documents organized.',
                icon: <UsersIcon style={{ width: '22px', height: '22px' }} />,
                color: '#059669',
                bg: '#ECFDF5',
              },
              {
                title: 'Lease Management',
                desc: 'Track agreements, rental periods, renewals, expirations and tenancy status.',
                icon: <DocumentCheckIcon style={{ width: '22px', height: '22px' }} />,
                color: '#7C3AED',
                bg: '#F5F3FF',
              },
              {
                title: 'Rent Collection',
                desc: 'Monitor rent schedules, payments, outstanding balances and collection activity.',
                icon: <BanknotesIcon style={{ width: '22px', height: '22px' }} />,
                color: '#2563EB',
                bg: '#EFF6FF',
              },
              {
                title: 'Maintenance Management',
                desc: 'Record maintenance requests, assign work and follow progress until issues are resolved.',
                icon: <WrenchScrewdriverIcon style={{ width: '22px', height: '22px' }} />,
                color: '#EA580C',
                bg: '#FFF7ED',
              },
              {
                title: 'Financial Management',
                desc: 'Understand income, expenses, balances and financial performance through organized records.',
                icon: <ChartBarIcon style={{ width: '22px', height: '22px' }} />,
                color: '#0891B2',
                bg: '#ECFEFF',
              },
              {
                title: 'Document Intelligence',
                desc: 'Upload documents and use OCR to extract information, reducing manual data entry while keeping important records accessible.',
                icon: <DocumentMagnifyingGlassIcon style={{ width: '22px', height: '22px' }} />,
                color: '#4F46E5',
                bg: '#EEF2FF',
              },
              {
                title: 'AI Property Assistant',
                desc: 'Get help understanding property information, finding insights and navigating your property operations.',
                icon: <SparklesIcon style={{ width: '22px', height: '22px' }} />,
                color: '#D97706',
                bg: '#FEF3C7',
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: feat.bg,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: THE TRANSFORMATION ("FROM CONSTANTLY CHASING TASKS TO MANAGING WITH CONFIDENCE")
      ========================================================================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', marginBottom: '8px' }}>
              The Transformation
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', letterSpacing: '-0.025em' }}>
              From constantly chasing tasks to managing with confidence.
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              See what changes when your entire portfolio lives in one coherent operating system.
            </p>
          </div>

          {/* Two-Column Comparison Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              maxWidth: '960px',
              margin: '0 auto 36px auto',
            }}
          >
            {/* Before Unit Flow */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #FEE2E2',
                padding: '36px 32px',
                boxShadow: '0 4px 16px rgba(239,68,68,0.04)',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '20px',
                }}
              >
                Before Unit Flow
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Rent tracking across spreadsheets and notebooks.',
                  'Constant tenant payment follow-ups.',
                  'Difficulty locating lease agreements.',
                  'Maintenance requests scattered across messages.',
                  'Limited visibility into property performance.',
                  'Time-consuming manual reporting.',
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <XMarkIcon style={{ width: '13px', height: '13px' }} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With Unit Flow */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #DBEAFE',
                padding: '36px 32px',
                boxShadow: '0 8px 24px rgba(37,99,235,0.08)',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '20px',
                }}
              >
                With Unit Flow
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Organized property and unit records.',
                  'Clear rent collection visibility.',
                  'Accessible tenant and lease information.',
                  'Centralized maintenance tracking.',
                  'Better financial visibility.',
                  'Reports and insights to support decisions.',
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#0F172A', fontWeight: 600, lineHeight: 1.5 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <CheckIcon style={{ width: '13px', height: '13px' }} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Spend less time managing scattered information and more time growing your property business.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HOW IT WORKS ("GET YOUR PROPERTY BUSINESS ORGANIZED.")
      ========================================================================== */}
      <section id="how-it-works" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              How It Works
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Get Your Property Business Organized.
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', lineHeight: 1.6 }}>
              A clean, sequential pathway to take complete control of your rental portfolio.
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

            {/* Right: 4 Sequential Step Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                {
                  step: '01',
                  title: 'Set Up Your Properties',
                  desc: 'Add your buildings, properties and rental units.',
                  color: '#2563EB',
                  bg: '#EFF6FF',
                },
                {
                  step: '02',
                  title: 'Organize Your Tenants',
                  desc: 'Register tenants, assign units and maintain their tenancy records.',
                  color: '#7C3AED',
                  bg: '#F5F3FF',
                },
                {
                  step: '03',
                  title: 'Manage Your Operations',
                  desc: 'Handle leases, rent collection, maintenance and documents from one workspace.',
                  color: '#059669',
                  bg: '#ECFDF5',
                },
                {
                  step: '04',
                  title: 'Understand Your Performance',
                  desc: 'Use reports, analytics and AI-assisted insights to make informed decisions.',
                  color: '#EA580C',
                  bg: '#FFF7ED',
                },
              ].map((stepItem, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    padding: '22px 24px',
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
                      backgroundColor: stepItem.bg,
                      color: stepItem.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '15px',
                      flexShrink: 0,
                    }}
                  >
                    {stepItem.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                      {stepItem.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                      {stepItem.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHO IS UNIT FLOW FOR?
      ========================================================================== */}
      <section id="about" style={{ padding: '80px 24px', backgroundColor: '#FAFCFF', borderTop: '1px solid #F1F5F9' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Who It's For
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Who Is Unit Flow For?
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', marginTop: '12px', lineHeight: 1.6 }}>
              Whether you manage a few rental units or an expanding property portfolio, Unit Flow helps you stay organized.
            </p>
          </div>

          {/* 5 Audience Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1080px',
              margin: '0 auto',
            }}
          >
            {[
              {
                role: 'Landlords',
                desc: 'Take control of your rental properties without relying on scattered records.',
                icon: <BuildingOfficeIcon style={{ width: '22px', height: '22px' }} />,
                bg: '#EFF6FF',
                color: '#2563EB',
              },
              {
                role: 'Property Owners',
                desc: 'Understand how your investments are performing.',
                icon: <ArrowTrendingUpIcon style={{ width: '22px', height: '22px' }} />,
                bg: '#ECFDF5',
                color: '#059669',
              },
              {
                role: 'Property Managers',
                desc: 'Manage multiple properties, tenants and daily operations more efficiently.',
                icon: <UsersIcon style={{ width: '22px', height: '22px' }} />,
                bg: '#F5F3FF',
                color: '#7C3AED',
              },
              {
                role: 'Real Estate Companies',
                desc: 'Bring property management processes into one connected platform.',
                icon: <BuildingOffice2Icon style={{ width: '22px', height: '22px' }} />,
                bg: '#FEF3C7',
                color: '#D97706',
              },
              {
                role: 'Residential Estates',
                desc: 'Organize units, tenants, maintenance and rental operations.',
                icon: <BuildingLibraryIcon style={{ width: '22px', height: '22px' }} />,
                bg: '#F1F5F9',
                color: '#0F172A',
              },
            ].map((aud, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                style={{
                  padding: '30px 24px',
                  borderRadius: '20px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: aud.bg,
                    color: aud.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {aud.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {aud.role}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  {aud.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: THE BIGGER PICTURE ("YOUR PROPERTIES ARE AN INVESTMENT. MANAGE THEM LIKE ONE.")
      ========================================================================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div className="tt-container">
          <div
            style={{
              maxWidth: '880px',
              margin: '0 auto',
              backgroundColor: '#EFF6FF',
              borderRadius: '28px',
              padding: '48px 40px',
              border: '1px solid #DBEAFE',
              boxShadow: '0 12px 32px rgba(37,99,235,0.06)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', marginBottom: '12px' }}>
              The Bigger Picture
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', margin: '0 0 20px 0', letterSpacing: '-0.025em' }}>
              Your properties are an investment. Manage them like one.
            </h2>
            <p style={{ fontSize: '16px', color: '#334155', lineHeight: 1.7, margin: '0 0 16px 0', fontWeight: 500 }}>
              Property management is more than collecting rent. It is about protecting your investment, maintaining good tenant relationships, making informed financial decisions and building a property business that can grow.
            </p>
            <p style={{ fontSize: '16px', color: '#2563EB', lineHeight: 1.7, margin: '0 0 20px 0', fontWeight: 700 }}>
              Unit Flow gives you the tools and visibility to do that.
            </p>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              Your next property shouldn't mean twice the paperwork, twice the stress and twice the follow-ups. <strong style={{ color: '#0F172A' }}>It should mean growth.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: "CHOOSE YOUR PLAN" (RELINK PRICING TIERS)
      ========================================================================== */}
      <section id="pricing" style={{ padding: '80px 24px', backgroundColor: '#FAFCFF', borderTop: '1px solid #F1F5F9' }}>
        <div className="tt-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Choose Your Plan
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '12px', lineHeight: 1.6 }}>
              Get the best value for your property portfolio with our tailored pricing options. Whether you need basic features or a fully customized solution, we've got you covered.
            </p>

            {/* Monthly / Annual Billing Toggle matching Relink */}
            <div style={{ display: 'inline-flex', padding: '4px', backgroundColor: '#F1F5F9', borderRadius: '9999px', marginTop: '24px' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '7px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: billingCycle === 'monthly' ? '#2563EB' : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFFFFF' : '#64748B',
                  boxShadow: billingCycle === 'monthly' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                style={{
                  padding: '7px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: billingCycle === 'annual' ? '#2563EB' : 'transparent',
                  color: billingCycle === 'annual' ? '#FFFFFF' : '#64748B',
                  boxShadow: billingCycle === 'annual' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Annually
              </button>
            </div>
          </div>

          {/* 3 Tall Pricing Cards */}
          <div
            className="tt-pricing-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '28px',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            {/* Card 1: Basic */}
            <motion.div
              whileHover={{ y: -6 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Basic</div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  For individual landlords managing up to 10 units.
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A' }}>KES 0</span>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>/ month</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#F1F5F9', marginBottom: '24px' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475569' }}>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Up to 10 rental units</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Digital lease creation</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Standard invoice generation</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Community support</li>
                </ul>
              </div>
              <Link to="/signup" className="tt-btn-blue" style={{ marginTop: '32px', textAlign: 'center', backgroundColor: '#F1F5F9', color: '#0F172A', boxShadow: 'none' }}>
                Get Started
              </Link>
            </motion.div>

            {/* Card 2: Pro (FEATURED) */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                backgroundColor: '#EFF6FF',
                borderRadius: '24px',
                border: '2px solid #2563EB',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 16px 36px rgba(37,99,235,0.12)',
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563EB', color: '#FFFFFF', padding: '3px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Most Popular
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Pro</div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  For active landlords & growing property companies.
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A' }}>{billingCycle === 'monthly' ? 'KES 4,500' : 'KES 3,600'}</span>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>/ month</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#DBEAFE', marginBottom: '24px' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#1E293B' }}>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Up to 150 units</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Automated M-Pesa C2B (1343073)</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Double-entry financial ledger</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> SMS & WhatsApp automated reminders</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> AI Assistant & OCR extraction</li>
                </ul>
              </div>
              <Link to="/signup" className="tt-btn-blue" style={{ marginTop: '32px', textAlign: 'center' }}>
                Get Started
              </Link>
            </motion.div>

            {/* Card 3: Enterprise */}
            <motion.div
              whileHover={{ y: -6 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Enterprise</div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  For commercial developments & large multi-estates.
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A' }}>Custom</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#F1F5F9', marginBottom: '24px' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475569' }}>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Unlimited properties & units</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Dedicated C2B shortcode integration</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Custom ERP & KRA eTIMS sync</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} /> 24/7 dedicated account manager & SLA</li>
                </ul>
              </div>
              <button onClick={() => setDemoModalOpen(true)} className="tt-btn-blue" style={{ marginTop: '32px', textAlign: 'center', backgroundColor: '#0F172A', color: '#FFFFFF', boxShadow: 'none' }}>
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: FINAL CTA ("READY TO TAKE CONTROL?")
      ========================================================================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div className="tt-container">
          <div
            className="tt-sky-newsletter-card"
            style={{
              borderRadius: '28px',
              padding: '56px 48px',
              backgroundImage: 'url(/hero-sky-clouds.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 20px 50px rgba(37,99,235,0.14)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '40px',
              flexWrap: 'wrap',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Soft glass overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(8px)',
                zIndex: 1,
              }}
            />

            {/* Left Content */}
            <div style={{ maxWidth: '560px', position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', marginBottom: '8px' }}>
                Ready to Take Control?
              </div>
              <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                Stop Managing Properties the Hard Way.
              </h2>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: '0 0 28px 0' }}>
                Bring your properties, tenants, leases, rent collection and operations together with Unit Flow. Start building a more organized and manageable property business today.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <Link
                  to="/signup"
                  className="tt-btn-blue"
                  style={{ fontSize: '14px', padding: '13px 32px' }}
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '13px 26px',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                  Book a Demo
                </button>
              </div>

              <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 700, color: '#2563EB' }}>
                Unit Flow — Property management, brought together.
              </div>
            </div>

            {/* Embedded Floating Analytics Mockup Card */}
            <motion.div
              whileHover={{ rotateY: -3, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                width: '360px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Unit Flow Console</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '9999px' }}>Live</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>One Connected Hub</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '16px' }}>Properties • Tenants • Leases • Collections</div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#EFF6FF', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#2563EB', borderRadius: '9999px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#64748B', marginTop: '8px' }}>
                <span>Operations Synced</span>
                <span style={{ color: '#2563EB' }}>100% Complete</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: MIDNIGHT DARK FOOTER
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
          Unit Flow
        </div>

        <div className="tt-container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            className="tt-footer-content"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
              gap: '32px',
              paddingBottom: '48px',
              borderBottom: '1px solid #1E293B',
            }}
          >
            {/* Left Column with Logo & Tagline */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <img
                  src="/logo.png"
                  alt="Unit Flow"
                  style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '8px' }}
                />
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Unit <span style={{ color: '#3B82F6' }}>Flow</span>
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                Everything you need to manage your rental properties, tenants and daily operations in one place.
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

            {/* Column 1: Platform */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>Platform</div>
              <a href="#features" style={{ textDecoration: 'none', color: '#E2E8F0' }}>Features</a>
              <Link to="/features/property-management" style={{ textDecoration: 'none', color: '#94A3B8' }}>Property Management</Link>
              <Link to="/features/tenant-management" style={{ textDecoration: 'none', color: '#94A3B8' }}>Tenant Management</Link>
              <Link to="/features/rent-collection" style={{ textDecoration: 'none', color: '#94A3B8' }}>Rent Collection</Link>
              <Link to="/features/maintenance" style={{ textDecoration: 'none', color: '#94A3B8' }}>Maintenance</Link>
              <Link to="/features/analytics" style={{ textDecoration: 'none', color: '#94A3B8' }}>Analytics</Link>
            </div>

            {/* Column 2: Company */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>Company</div>
              <a href="#about" style={{ textDecoration: 'none', color: '#E2E8F0' }}>About Unit Flow</a>
              <Link to="/contact" style={{ textDecoration: 'none', color: '#94A3B8' }}>Contact</Link>
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '13px',
                  color: '#94A3B8',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                Book a Demo
              </button>
            </div>

            {/* Column 3: Support */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>Support</div>
              <Link to="/support" style={{ textDecoration: 'none', color: '#94A3B8' }}>Help Center</Link>
              <Link to="/support/contact" style={{ textDecoration: 'none', color: '#94A3B8' }}>Get Support</Link>
            </div>

            {/* Column 4: Legal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>Legal</div>
              <Link to="/legal/privacy" style={{ textDecoration: 'none', color: '#94A3B8' }}>Privacy Policy</Link>
              <Link to="/legal/terms" style={{ textDecoration: 'none', color: '#94A3B8' }}>Terms of Service</Link>
              <Link to="/legal/terms" style={{ textDecoration: 'none', color: '#94A3B8' }}>Terms of Use</Link>
            </div>
          </div>

          <div style={{ paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748B' }}>
            <div>Copyright © 2026 Unit Flow. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/legal/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/legal/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Use</Link>
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
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Book UnitFlow Walkthrough</h3>
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
