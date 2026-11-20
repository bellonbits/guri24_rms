import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  Layers,
  Users,
  FileText,
  CreditCard,
  Landmark,
  Scale,
  Wrench,
  Scan,
  BarChart3,
  Sparkles,
  Smartphone,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Video,
  Newspaper,
  Compass,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const MarketingNavbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'product' | 'solutions' | 'resources' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header
      style={{
        position: 'sticky',
        top: '16px', // B7: floating resting state off top edge
        left: 0,
        right: 0,
        margin: '0 auto',
        maxWidth: '1240px',
        width: 'calc(100% - 32px)',
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.86)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px', // B3 radius
        border: `1px solid ${scrolled ? BRAND_TOKENS.colors.slateBorder : 'rgba(226, 232, 240, 0.7)'}`,
        boxShadow: scrolled ? '0 10px 25px -5px rgba(2, 20, 41, 0.08)' : '0 4px 16px rgba(2, 20, 41, 0.04)',
        transition: `all 300ms ${BRAND_TOKENS.motion.baseCurve}`, // B7 base curve
        fontFamily: BRAND_TOKENS.fonts.sans,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <img
            src={BRAND_TOKENS.assets.emblem}
            alt="Guri24 RMS Logo"
            style={{ width: '38px', height: '38px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: BRAND_TOKENS.colors.darkNavy,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Guri24
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: BRAND_TOKENS.colors.primary,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Property Cloud
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav
          aria-label="Desktop Navigation"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav-container"
        >
          {/* 1. Product Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setOpenDropdown('product')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: openDropdown === 'product' ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.darkNavy,
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 4px',
              }}
              aria-expanded={openDropdown === 'product'}
            >
              <span>Product</span>
              <ChevronDown
                size={14}
                style={{
                  transform: openDropdown === 'product' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {openDropdown === 'product' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '-120px',
                  width: '640px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  boxShadow: '0 20px 40px -10px rgba(2, 20, 41, 0.15)',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                {[
                  { to: '/features/property-management', icon: Building2, label: 'Property & Buildings', desc: 'Estates, blocks, floors & occupancy tracking' },
                  { to: '/features/tenant-management', icon: Users, label: 'Tenants & Screening', desc: 'Kenyan KYC, ID verification & communications' },
                  { to: '/features/leases-and-bookings', icon: FileText, label: 'Living Leases', desc: 'Automated billing schedules & renewals' },
                  { to: '/features/mpesa-and-payments', icon: CreditCard, label: 'M-Pesa Daraja Recon', desc: 'Instant STK push & automatic invoice allocation' },
                  { to: '/features/financial-management', icon: Scale, label: 'Double-Entry Ledger', desc: 'Balanced trial balance & Account 2100 deposit trust' },
                  { to: '/features/documents-and-ocr', icon: Scan, label: 'Document Intelligence', desc: 'OCR verification without fake data' },
                  { to: '/features/analytics-and-reporting', icon: BarChart3, label: 'Executive Analytics', desc: 'NOI, arrears aging & multi-bank dashboards' },
                  { to: '/features/ai-assistant', icon: Sparkles, label: 'Grounded AI Assistant', desc: 'Groq Llama 3.3 financial interpreter' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={item.to}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.primaryLight)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: BRAND_TOKENS.colors.primaryLight,
                          color: BRAND_TOKENS.colors.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: BRAND_TOKENS.colors.slateSubtle, marginTop: '2px' }}>
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Solutions Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setOpenDropdown('solutions')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: openDropdown === 'solutions' ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.darkNavy,
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 4px',
              }}
              aria-expanded={openDropdown === 'solutions'}
            >
              <span>Solutions</span>
              <ChevronDown
                size={14}
                style={{
                  transform: openDropdown === 'solutions' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {openDropdown === 'solutions' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '-40px',
                  width: '340px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  boxShadow: '0 20px 40px -10px rgba(2, 20, 41, 0.15)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                {[
                  { to: '/solutions/landlords', label: 'Individual Landlords', sub: 'M-Pesa billing & effortless rent tracking' },
                  { to: '/solutions/property-managers', label: 'Property Management Firms', sub: 'Multi-property portfolios & staff assignment' },
                  { to: '/solutions/real-estate-companies', label: 'Real Estate Companies', sub: 'Multi-bank accounting & corporate scale' },
                  { to: '/solutions/estate-managers', label: 'Gated Estates & Communities', sub: 'Service charges, utilities & security' },
                  { to: '/solutions', label: 'Solutions Overview →', sub: 'Compare operational tailored editions' },
                ].map((s, idx) => (
                  <Link
                    key={idx}
                    to={s.to}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.bgCanvas)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: BRAND_TOKENS.colors.slateSubtle, marginTop: '2px' }}>
                      {s.sub}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 3. Direct Link: How it Works */}
          <Link
            to="/how-it-works"
            style={{
              textDecoration: 'none',
              color: location.pathname === '/how-it-works' ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.darkNavy,
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            How it works
          </Link>

          {/* 4. Direct Link: Pricing */}
          <Link
            to="/pricing"
            style={{
              textDecoration: 'none',
              color: location.pathname === '/pricing' ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.darkNavy,
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            Pricing
          </Link>

          {/* 5. Resources Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setOpenDropdown('resources')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: openDropdown === 'resources' ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.darkNavy,
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 4px',
              }}
              aria-expanded={openDropdown === 'resources'}
            >
              <span>Resources</span>
              <ChevronDown
                size={14}
                style={{
                  transform: openDropdown === 'resources' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {openDropdown === 'resources' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '-40px',
                  width: '320px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  boxShadow: '0 20px 40px -10px rgba(2, 20, 41, 0.15)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                {[
                  { to: '/resources/help', label: 'Help Center', icon: HelpCircle },
                  { to: '/resources/guides', label: 'Property Guides', icon: BookOpen },
                  { to: '/resources/tutorials', label: 'Video Walkthroughs', icon: Video },
                  { to: '/resources/blog', label: 'Property Tech Blog', icon: Newspaper },
                  { to: '/faq', label: 'Frequently Asked Questions', icon: Compass },
                ].map((r, idx) => {
                  const Icon = r.icon;
                  return (
                    <Link
                      key={idx}
                      to={r.to}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: BRAND_TOKENS.colors.darkNavy,
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.bgCanvas)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Icon size={16} color={BRAND_TOKENS.colors.primary} />
                      <span>{r.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 6. Direct Link: About */}
          <Link
            to="/about"
            style={{
              textDecoration: 'none',
              color: location.pathname === '/about' ? BRAND_TOKENS.colors.primary : BRAND_TOKENS.colors.darkNavy,
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            About
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/login"
            style={{
              textDecoration: 'none',
              color: BRAND_TOKENS.colors.darkNavy,
              fontSize: '14px', // Button-sm per B1
              lineHeight: '20px',
              fontWeight: 600,
              padding: '8px 14px', // B2 main button padding
              borderRadius: '8px',
              transition: `background-color 200ms ${BRAND_TOKENS.motion.baseCurve}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.bgAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Log in
          </Link>

          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: BRAND_TOKENS.colors.primary,
              color: '#FFFFFF',
              padding: '8px 16px', // B2 main button padding (8px vert, 12-16px horiz)
              borderRadius: '8px',
              fontSize: '14px', // Button-sm per B1
              lineHeight: '20px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: BRAND_TOKENS.shadows.brand,
              transition: `all 300ms ${BRAND_TOKENS.motion.baseCurve}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.primaryHover;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = BRAND_TOKENS.colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Start free trial</span>
            <ArrowRight size={15} />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: BRAND_TOKENS.colors.darkNavy,
              padding: '6px',
              cursor: 'pointer',
            }}
            className="mobile-hamburger-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 25px -5px rgba(2, 20, 41, 0.1)',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
          }}
        >
          <Link to="/features" style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
            All Features
          </Link>
          <Link to="/solutions" style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
            Solutions
          </Link>
          <Link to="/how-it-works" style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
            How it works
          </Link>
          <Link to="/pricing" style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
            Pricing
          </Link>
          <Link to="/about" style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
            About
          </Link>
          <Link to="/contact" style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
            Contact Us
          </Link>
          <div style={{ height: '1px', backgroundColor: BRAND_TOKENS.colors.slateBorder, margin: '8px 0' }} />
          <Link
            to="/register"
            style={{
              backgroundColor: BRAND_TOKENS.colors.primary,
              color: '#FFFFFF',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            style={{
              backgroundColor: BRAND_TOKENS.colors.bgAlt,
              color: BRAND_TOKENS.colors.darkNavy,
              textAlign: 'center',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Staff Login
          </Link>
        </div>
      )}

      {/* Responsive media query styling */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-container {
            display: flex !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
