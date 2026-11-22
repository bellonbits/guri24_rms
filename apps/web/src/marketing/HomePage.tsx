import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  CreditCard,
  FileCheck2,
  Wrench,
  BarChart3,
  Sparkles,
  ScanText,
  PieChart,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Menu,
  X,
  Check,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    unitCount: '10 - 50 Units',
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setIsDemoModalOpen(false);
      setDemoSubmitted(false);
      setDemoForm({ name: '', email: '', phone: '', company: '', unitCount: '10 - 50 Units' });
    }, 2500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#0F172A',
        overflowX: 'hidden',
      }}
    >
      {/* =========================================================================
          1. NAVIGATION
          ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Building2 size={20} color="#FFFFFF" />
            </div>
            <span
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.03em',
              }}
            >
              Guri24
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
            }}
            className="hidden md:flex"
          >
            <a href="#home" style={{ textDecoration: 'none', color: '#0F172A', fontSize: '0.90rem', fontWeight: 600 }}>
              Home
            </a>
            <a href="#features" style={{ textDecoration: 'none', color: '#64748B', fontSize: '0.90rem', fontWeight: 500, transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}>
              Features
            </a>
            <a href="#solutions" style={{ textDecoration: 'none', color: '#64748B', fontSize: '0.90rem', fontWeight: 500, transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}>
              Solutions
            </a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: '#64748B', fontSize: '0.90rem', fontWeight: 500, transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}>
              How It Works
            </a>
            <a href="#why-guri24" style={{ textDecoration: 'none', color: '#64748B', fontSize: '0.90rem', fontWeight: 500, transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}>
              About Us
            </a>
            <a href="#contact" style={{ textDecoration: 'none', color: '#64748B', fontSize: '0.90rem', fontWeight: 500, transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}>
              Contact
            </a>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                color: '#475569',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '8px 16px',
                borderRadius: '9999px',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '9px 20px',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
              }}
              className="flex md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
            className="md:hidden"
          >
            <a href="#home" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600 }}>Home</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#475569' }}>Features</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#475569' }}>Solutions</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#475569' }}>How It Works</a>
            <a href="#why-guri24" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#475569' }}>About Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#475569' }}>Contact</a>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION
          ========================================================================= */}
      <section
        id="home"
        style={{
          position: 'relative',
          padding: '72px 24px 80px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(129, 140, 248, 0.22), rgba(192, 132, 252, 0.12), transparent 75%)',
        }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Small Label Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(238, 242, 255, 0.9)',
              border: '1px solid #E0E7FF',
              color: '#4338CA',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4F46E5' }} />
            <span>SMART PROPERTY MANAGEMENT PLATFORM</span>
          </div>

          {/* Hero Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              marginBottom: '20px',
            }}
          >
            Manage Properties.{' '}
            <span style={{ color: '#4F46E5' }}>Simplify Rentals.</span>{' '}
            Grow Your Business.
          </h1>

          {/* Hero Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.18rem)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 32px auto',
            }}
          >
            Take control of your rental properties with one intelligent platform. Manage tenants, leases, rent collection, maintenance and financial records without the complexity of scattered spreadsheets and paperwork.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '18px',
            }}
          >
            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                fontSize: '0.96rem',
                fontWeight: 600,
                padding: '13px 30px',
                borderRadius: '9999px',
                boxShadow: '0 4px 18px rgba(79, 70, 229, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338CA')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                fontSize: '0.96rem',
                fontWeight: 600,
                padding: '13px 26px',
                borderRadius: '9999px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Calendar size={16} color="#4F46E5" />
              <span>Book a Demo</span>
            </button>
          </div>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: '0.84rem',
              color: '#64748B',
              margin: '0 0 48px 0',
            }}
          >
            Everything you need to manage your properties, tenants and rental operations in one place.
          </p>
        </div>

        {/* =========================================================================
            HERO VISUAL: HIGH-FIDELITY GURI24 APPLICATION DASHBOARD MOCKUP
            ========================================================================= */}
        <div
          style={{
            width: '100%',
            maxWidth: '1120px',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Dashboard Header Bar */}
          <div
            style={{
              backgroundColor: '#0F172A',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginLeft: '8px' }}>
                Guri24 RMS · Portfolio Operations
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                M-Pesa Daraja C2B V2 Connected
              </span>
              <span>Shortcode: 1343073</span>
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1px',
              backgroundColor: '#F1F5F9',
              borderBottom: '1px solid #E2E8F0',
            }}
          >
            {[
              { label: 'Total Properties', val: '24 Estates', tone: '#0F172A' },
              { label: 'Occupied Units', val: '148 / 160 (92.5%)', tone: '#10B981' },
              { label: 'Rent Collected', val: 'KES 3,840,000', tone: '#4F46E5' },
              { label: 'Outstanding Rent', val: 'KES 180,000', tone: '#F59E0B' },
              { label: 'Maintenance Queue', val: '3 Tickets Active', tone: '#64748B' },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px 20px',
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.18rem', fontWeight: 700, color: stat.tone, marginTop: '4px' }}>
                  {stat.val}
                </div>
              </div>
            ))}
          </div>

          {/* Operational Mockup Workspace Body */}
          <div
            style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              backgroundColor: '#F8FAFC',
            }}
          >
            {/* Left Mockup Card: Recent Verified Payments */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#4F46E5" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Recent M-Pesa C2B Collections</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '9999px' }}>
                  Real-Time Verified
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { ref: 'SK88102911', tenant: 'James Otieno (A-102)', amount: 'KES 35,000', time: '10 mins ago', status: 'Allocated' },
                  { ref: 'SK88102904', tenant: 'Grace Wanjiku (B-204)', amount: 'KES 42,000', time: '35 mins ago', status: 'Allocated' },
                  { ref: 'SK88102899', tenant: 'Ahmed Noor (C-301)', amount: 'KES 28,000', time: '1 hr ago', status: 'Allocated' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #F1F5F9',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>{item.tenant}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>TransID: {item.ref} · {item.time}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#10B981' }}>{item.amount}</div>
                      <div style={{ fontSize: '0.70rem', color: '#4F46E5', fontWeight: 600 }}>{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mockup Card: Tenant Leases & Invoices */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck2 size={18} color="#4F46E5" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Tenancy Operations & Renewals</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#4F46E5', fontWeight: 600 }}>Active Portfolio</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { unit: 'Riverside Heights #402', lease: '12-Month Tenancy', rent: 'KES 45,000 / mo', tag: 'Active' },
                  { unit: 'Parklands Executive #12', lease: 'Up for Renewal (20 Days)', rent: 'KES 65,000 / mo', tag: 'Renewal Ready' },
                  { unit: 'Westlands Commercial #B3', lease: 'Corporate Lease Agreement', rent: 'KES 120,000 / mo', tag: 'Verified' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #F1F5F9',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>{item.unit}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.lease}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{item.rent}</div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: item.tag === 'Renewal Ready' ? '#FEF3C7' : '#EFF6FF',
                          color: item.tag === 'Renewal Ready' ? '#B45309' : '#1D4ED8',
                          fontWeight: 700,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. TRUST / AUDIENCE SECTION
          ========================================================================= */}
      <section
        style={{
          padding: '60px 24px',
          borderTop: '1px solid #F1F5F9',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FAFAFA',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            Built for the People Who Manage Properties
          </h2>
          <p
            style={{
              fontSize: '0.94rem',
              color: '#64748B',
              lineHeight: 1.55,
              maxWidth: '680px',
              margin: '0 auto 28px auto',
            }}
          >
            Guri24 brings property owners, managers, accountants and tenants together through a connected property management experience.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {[
              'Property Owners',
              'Property Managers',
              'Real Estate Companies',
              'Landlords',
              'Residential Estates',
            ].map((audience, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#334155',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURES SECTION
          ========================================================================= */}
      <section
        id="features"
        style={{
          padding: '96px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            Everything You Need to Manage Your Properties
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Powerful property management tools designed to simplify everyday rental operations and give you better control of your business.
          </p>
        </div>

        {/* 9 Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            {
              icon: Building2,
              title: 'Property & Unit Management',
              desc: 'Organize your entire property portfolio in one place. Manage buildings, apartments, units, occupancy, property details and rental information.',
            },
            {
              icon: Users,
              title: 'Tenant Management',
              desc: 'Maintain organized tenant profiles, contact information, identification documents, emergency contacts, lease details and tenancy history.',
            },
            {
              icon: CreditCard,
              title: 'Rent Collection & Payments',
              desc: 'Track rent invoices, payment records, outstanding balances and collection performance. Support M-Pesa Paybill/Till C2B and configured bank payment workflows.',
            },
            {
              icon: FileCheck2,
              title: 'Lease & Booking Management',
              desc: 'Create and manage tenancy agreements, lease periods, renewals, bookings, rent terms and important expiry dates.',
            },
            {
              icon: Wrench,
              title: 'Maintenance Management',
              desc: 'Receive maintenance requests, assign technicians, monitor progress, manage expenses and keep property maintenance records organized.',
            },
            {
              icon: BarChart3,
              title: 'Financial Management',
              desc: 'Get a clearer view of rental income, outstanding invoices, deposits, expenses and financial reports through connected financial management.',
            },
            {
              icon: ScanText,
              title: 'OCR & Document Intelligence',
              desc: 'Extract information from uploaded tenancy agreements, invoices, receipts and other documents. Review and approve extracted information before it is submitted to the relevant system.',
            },
            {
              icon: Sparkles,
              title: 'AI Property Assistant',
              desc: 'Get assistance understanding property operations, identifying important trends and interpreting authorized business information with AI-powered insights.',
            },
            {
              icon: PieChart,
              title: 'Analytics & Reports',
              desc: 'Understand occupancy, rent collection, arrears, property performance and operational trends through interactive dashboards and reports.',
            },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.02)';
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={22} />
                </div>
                <h3
                  style={{
                    fontSize: '1.18rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#64748B',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. WHY CHOOSE GURI24?
          ========================================================================= */}
      <section
        id="why-guri24"
        style={{
          padding: '96px 24px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #F1F5F9',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                marginBottom: '14px',
              }}
            >
              Property Management, Made Simpler.
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#64748B',
                lineHeight: 1.6,
                maxWidth: '640px',
                margin: '0 auto',
              }}
            >
              Spend less time managing scattered records and more time growing your property business.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                title: 'One Connected Platform',
                desc: 'Manage properties, tenants, leases, payments and maintenance from a central workspace.',
              },
              {
                title: 'Better Financial Visibility',
                desc: 'Know what has been invoiced, collected, allocated and remains outstanding.',
              },
              {
                title: 'Organized Tenant Records',
                desc: 'Keep tenant information, tenancy documents and communication records accessible to authorized staff.',
              },
              {
                title: 'Smarter Operations',
                desc: 'Use automation, reminders and AI-assisted insights to support everyday property management.',
              },
              {
                title: 'Secure Access',
                desc: 'Give owners, managers, accountants and tenants access to the information and tools relevant to their responsibilities.',
              },
            ].map((pillar, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Check size={16} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                  {pillar.title}
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. HOW IT WORKS
          ========================================================================= */}
      <section
        id="how-it-works"
        style={{
          padding: '96px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '56px' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            Get Started in 3 Simple Steps
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Set up your organization and start managing your rental operations from one workspace.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            textAlign: 'left',
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
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#4F46E5',
                  opacity: 0.25,
                  letterSpacing: '-0.04em',
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '0.90rem',
                  color: '#64748B',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. DASHBOARD / PRODUCT SHOWCASE
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            Your Entire Property Portfolio at a Glance
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 40px auto',
            }}
          >
            Get a clear overview of your properties and daily operations without switching between multiple tools.
          </p>

          {/* Interactive Metric Showcase Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginBottom: '40px',
              textAlign: 'left',
            }}
          >
            {[
              { label: 'Total Properties', sub: 'Buildings & Estates' },
              { label: 'Total Units', sub: 'Residential & Commercial' },
              { label: 'Occupied Units', sub: 'Live Tenant Leases' },
              { label: 'Vacant Units', sub: 'Ready for Assignment' },
              { label: 'Active Tenants', sub: 'Verified Directory' },
              { label: 'Rent Collected', sub: 'M-Pesa C2B & Bank' },
              { label: 'Outstanding Rent', sub: 'Automated Reminders' },
              { label: 'Maintenance Requests', sub: 'Tracked Workflows' },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                }}
              >
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>{card.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          <Link
            to="/signup"
            style={{
              textDecoration: 'none',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 600,
              padding: '13px 32px',
              borderRadius: '9999px',
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Explore Guri24</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          8. SOLUTIONS SECTION
          ========================================================================= */}
      <section
        id="solutions"
        style={{
          padding: '96px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            Designed for Every Property Management Need
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            {
              title: 'For Landlords',
              desc: 'Manage your rental properties, monitor rent collection and keep tenant records organized.',
            },
            {
              title: 'For Property Managers',
              desc: 'Coordinate multiple properties, manage teams, track maintenance and oversee daily rental operations.',
            },
            {
              title: 'For Real Estate Companies',
              desc: 'Centralize property portfolios, standardize workflows and improve operational visibility across your organization.',
            },
            {
              title: 'For Tenants',
              desc: 'Access your tenancy information, view payment records, receive important notifications and manage your rental experience through the tenant portal.',
            },
          ].map((sol, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>{sol.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                {sol.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. RESULTS / BUSINESS BENEFITS
          ========================================================================= */}
      <section
        style={{
          padding: '96px 24px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #F1F5F9',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                marginBottom: '14px',
              }}
            >
              Better Visibility. Better Decisions. Better Property Management.
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#64748B',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              Guri24 helps bring your rental operations together so you can make informed decisions using organized, accessible business information.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                title: 'Centralized Records',
                desc: 'Your property and tenant information organized in one platform.',
              },
              {
                title: 'Improved Rent Tracking',
                desc: 'Understand rental invoices, collections and outstanding balances.',
              },
              {
                title: 'Efficient Operations',
                desc: 'Coordinate maintenance, leases, documents and team responsibilities.',
              },
              {
                title: 'Actionable Insights',
                desc: 'Understand property performance with analytics and AI-assisted interpretation.',
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  {card.title}
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FINAL CALL TO ACTION
          ========================================================================= */}
      <section
        style={{
          padding: '100px 24px',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              marginBottom: '18px',
            }}
          >
            Ready to Take Control of Your Properties?
          </h2>
          <p
            style={{
              fontSize: '1.08rem',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 36px auto',
            }}
          >
            Bring your property management operations together with Guri24. Start organizing your properties, managing tenants and gaining better visibility into your rental business.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                fontSize: '0.98rem',
                fontWeight: 600,
                padding: '14px 34px',
                borderRadius: '9999px',
                boxShadow: '0 4px 18px rgba(79, 70, 229, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Get Started Today</span>
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                fontSize: '0.98rem',
                fontWeight: 600,
                padding: '14px 28px',
                borderRadius: '9999px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Phone size={16} color="#4F46E5" />
              <span>Talk to Our Team</span>
            </button>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#94A3B8', margin: 0, fontWeight: 500 }}>
            Your properties. Your tenants. Your operations. One platform.
          </p>
        </div>
      </section>

      {/* =========================================================================
          11. FOOTER
          ========================================================================= */}
      <footer
        id="contact"
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '80px 24px 36px 24px',
          borderTop: '1px solid #1E293B',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '60px',
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={18} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800 }}>Guri24</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Simplifying property management through connected technology, smarter operations and better business visibility.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#94A3B8' }}>
              <li>Property Management</li>
              <li>Tenant Management</li>
              <li>Rent Collection</li>
              <li>Maintenance</li>
              <li>Analytics & Reports</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#94A3B8' }}>
              <li>About Guri24</li>
              <li>Contact Us</li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                >
                  Book a Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#94A3B8' }}>
              <li>Help Center</li>
              <li>Documentation</li>
              <li>FAQs</li>
              <li>Contact Support</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#94A3B8' }}>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Data Protection (Kenya DPA 2019)</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            paddingTop: '24px',
            borderTop: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '0.80rem',
            color: '#64748B',
          }}
        >
          <div>© 2026 Guri24. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Nairobi, Kenya</span>
            <span>M-Pesa C2B V2 Paybill: 1343073</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          BOOK A DEMO / TALK TO TEAM MODAL
          ========================================================================= */}
      {isDemoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={20} />
            </button>

            {demoSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  Demo Request Received!
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                  Our property technology team will contact you shortly to schedule your personalized live Guri24 demonstration.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  Book a Live Guri24 Demo
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
                  See how Guri24 automates rent collection, leases, tenant management, and property accounting.
                </p>

                <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Kamau"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. david@kamauproperties.co.ke"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +254 712 345 678"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Portfolio Size (Approx Units)
                    </label>
                    <select
                      value={demoForm.unitCount}
                      onChange={(e) => setDemoForm({ ...demoForm, unitCount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                        boxSizing: 'border-box',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="1 - 10 Units">1 - 10 Units</option>
                      <option value="10 - 50 Units">10 - 50 Units</option>
                      <option value="50 - 200 Units">50 - 200 Units</option>
                      <option value="200+ Units">200+ Units (Enterprise)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '8px',
                      backgroundColor: '#4F46E5',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                    }}
                  >
                    Confirm Demo Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
