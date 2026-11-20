import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  X,
  Check,
  Building2,
  Wallet,
  FileText,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'features' | 'how-it-works' | 'integrations' | 'pricing'>('features');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoDemoTab, setVideoDemoTab] = useState<'recon' | 'leases' | 'ledger' | 'ai'>('recon');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F3F2EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 16px',
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#111827',
      }}
    >
      {/* Outer Luxury Frame Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1360px',
          backgroundColor: '#FAF9F6',
          borderRadius: '28px',
          border: '1px solid rgba(0, 0, 0, 0.07)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Subtle top ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.35), rgba(168, 85, 247, 0.35), transparent)',
            filter: 'blur(1px)',
            pointerEvents: 'none',
          }}
        />

        {/* =========================================================================
            HEADER NAVIGATION
            ========================================================================= */}
        <header
          style={{
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'baseline',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.04em' }}>Guri24</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>°</span>
          </Link>

          {/* Center Pill Menu */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              padding: '4px',
              borderRadius: '9999px',
              border: '1px solid rgba(0, 0, 0, 0.04)',
            }}
          >
            {(
              [
                { key: 'features', label: 'Features', href: '#features' },
                { key: 'how-it-works', label: 'How it works', href: '#how-it-works' },
                { key: 'integrations', label: 'Integrations', href: '#integrations' },
                { key: 'pricing', label: 'Pricing', href: '#pricing' },
              ] as const
            ).map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.key);
                  const el = document.getElementById(item.key);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  textDecoration: 'none',
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  color: activeTab === item.key ? '#0F172A' : '#64748B',
                  backgroundColor: activeTab === item.key ? '#FFFFFF' : 'transparent',
                  boxShadow: activeTab === item.key ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/app/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                padding: '9px 20px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
                transition: 'transform 0.15s ease, background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
            >
              <span>Get the app</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </header>

        {/* =========================================================================
            HERO SECTION
            ========================================================================= */}
        <section
          style={{
            position: 'relative',
            paddingTop: '36px',
            paddingBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Rotating Stamp in Top Right */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '48px',
              width: '84px',
              height: '84px',
              pointerEvents: 'none',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{
                width: '100%',
                height: '100%',
                animation: 'spin 22s linear infinite',
              }}
            >
              <defs>
                <path
                  id="stampCirclePath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                />
              </defs>
              <text
                style={{
                  fontSize: '7.8px',
                  fontWeight: 600,
                  letterSpacing: '2.4px',
                  fill: '#1F2937',
                  textTransform: 'uppercase',
                }}
              >
                <textPath href="#stampCirclePath" startOffset="0%">
                  ★ MORE FOCUSED YOU ★ EVERYDAY
                </textPath>
              </text>
              {/* 4-point star in center */}
              <path
                d="M 50 42 Q 50 50 42 50 Q 50 50 50 58 Q 50 50 58 50 Q 50 50 50 42 Z"
                fill="#1F2937"
              />
            </svg>
          </div>

          {/* Headline */}
          <div style={{ maxWidth: '820px', padding: '0 20px', zIndex: 2 }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
                fontSize: 'clamp(2.8rem, 5.2vw, 4.4rem)',
                fontWeight: 600,
                lineHeight: 1.12,
                color: '#0F172A',
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              A clearer mind
              <br />
              <span
                style={{
                  fontStyle: 'italic',
                  fontWeight: 400,
                  display: 'inline-block',
                  color: '#0F172A',
                }}
              >
                for a brighter you.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                marginTop: '18px',
                fontSize: '0.98rem',
                lineHeight: 1.55,
                color: '#64748B',
                maxWidth: '520px',
                marginInline: 'auto',
                fontWeight: 400,
              }}
            >
              Guri24 helps you capture ideas, organize your properties, and stay focused — all in one beautiful space.
            </p>

            {/* CTAs */}
            <div
              style={{
                marginTop: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/app/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '12px 26px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.16)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
              >
                <span>Get started free</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FAF9F6',
                  color: '#0F172A',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF9F6';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Play size={10} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '1px' }} />
                </div>
                <span>Watch video</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              HERO ARTWORK & TETHERED FLOATING CARDS
              ========================================================================= */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1080px',
              marginTop: '28px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* SVG Connecting Wires */}
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
              }}
              viewBox="0 0 1080 440"
              fill="none"
            >
              {/* Left tether from card to head */}
              <path
                d="M 210 130 C 260 170, 340 210, 470 230"
                stroke="#D6D3CD"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Right tether from card to head */}
              <path
                d="M 870 170 C 800 210, 710 230, 590 235"
                stroke="#D6D3CD"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>

            {/* Left Tethered Card */}
            <div
              style={{
                position: 'absolute',
                left: '28px',
                top: '40px',
                zIndex: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '16px 20px',
                width: '200px',
                textAlign: 'left',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Soundwave Icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  marginBottom: '10px',
                  color: '#0F172A',
                }}
              >
                <div style={{ width: '2.5px', height: '10px', backgroundColor: '#0F172A', borderRadius: '1px' }} />
                <div style={{ width: '2.5px', height: '16px', backgroundColor: '#0F172A', borderRadius: '1px' }} />
                <div style={{ width: '2.5px', height: '8px', backgroundColor: '#0F172A', borderRadius: '1px' }} />
                <div style={{ width: '2.5px', height: '13px', backgroundColor: '#0F172A', borderRadius: '1px' }} />
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                Turn thoughts into progress.
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '6px', lineHeight: 1.35 }}>
                Capture, organise and do more.
              </div>
            </div>

            {/* Right Tethered Card */}
            <div
              style={{
                position: 'absolute',
                right: '40px',
                top: '80px',
                zIndex: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '16px 20px',
                width: '190px',
                textAlign: 'left',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* 3 Avatars + Plus */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80',
                ].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="User"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #FFFFFF',
                      marginLeft: idx > 0 ? '-6px' : 0,
                    }}
                  />
                ))}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    border: '2px solid #FFFFFF',
                    marginLeft: '-6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#64748B',
                  }}
                >
                  +
                </div>
              </div>

              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                Ideas, anytime, anywhere.
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '6px', lineHeight: 1.35 }}>
                Sync across all your devices.
              </div>
            </div>

            {/* Central Visual: Figure with Translucent Cards */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
              }}
            >
              <img
                src="/hero-character-clean.png"
                alt="Guri24 RMS Intelligence Composite"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'contrast(1.02) drop-shadow(0 20px 30px rgba(0,0,0,0.06))',
                }}
              />
            </div>
          </div>

          {/* =========================================================================
              BOTTOM HERO METRICS & SOCIAL PROOF BADGES
              ========================================================================= */}
          <div
            style={{
              width: '100%',
              maxWidth: '1200px',
              padding: '16px 40px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 3,
              marginTop: '-16px',
            }}
          >
            {/* Bottom Left: Trusted by 50,000+ creators */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
                Trusted by 50,000+ creators worldwide.
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
                ].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Member"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #FAF9F6',
                      marginLeft: idx > 0 ? '-8px' : 0,
                    }}
                  />
                ))}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#E2E8F0',
                    border: '2px solid #FAF9F6',
                    marginLeft: '-8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#475569',
                  }}
                >
                  +
                </div>
              </div>
            </div>

            {/* Bottom Right: Minimal sparkle & Less chaos */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              {/* 4-point sparkle */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F172A">
                <path d="M12 0 Q 12 12 0 12 Q 12 12 12 24 Q 12 12 24 12 Q 12 12 12 0 Z" />
              </svg>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500, marginTop: '4px' }}>
                — Less chaos.
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
                More clarity.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: FEATURES MATRIX (Anchor: #features)
            ========================================================================= */}
        <section
          id="features"
          style={{
            padding: '72px 48px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ maxWidth: '1100px', marginInline: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F1F5F9',
                  color: '#0F172A',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '14px',
                }}
              >
                <Sparkles size={13} />
                <span>Everything in one space</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Crafted for clarity, designed for speed.
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.96rem', marginTop: '12px', maxWidth: '580px', marginInline: 'auto' }}>
                Stop toggling between spreadsheets, bank statements, and WhatsApp chats. Guri24 unites operations under one authoritative engine.
              </p>
            </div>

            {/* Grid of 4 Feature Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                {
                  icon: <Wallet size={22} color="#0F172A" />,
                  title: 'Instant M-Pesa & Multi-Bank Recon',
                  desc: 'Daraja STK push and C2B webhooks reconcile against tenant invoices in sub-second time. Supports Equity, NCBA, KCB, Stanbic, and Co-op statements.',
                },
                {
                  icon: <Building2 size={22} color="#0F172A" />,
                  title: 'Living Property Hierarchies',
                  desc: 'Model estates, buildings, floors, and units with real-time occupancy tracking, tenant profiles, and automated lease lifecycle transitions.',
                },
                {
                  icon: <FileText size={22} color="#0F172A" />,
                  title: 'Double-Entry General Ledger',
                  desc: 'Immutable trial balance where Debits always equal Credits. Tenant deposit liabilities (Account 2100) are strictly segregated from rental income.',
                },
                {
                  icon: <Sparkles size={22} color="#0F172A" />,
                  title: 'Grounded AI Financial Assistant',
                  desc: 'Ask complex financial questions in plain language. Llama 3.3 computes collection efficiencies, arrears aging, and variance analysis with exact citations.',
                },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FAF9F6',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      marginBottom: '18px',
                    }}
                  >
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {feat.desc.split('.')[0]}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: HOW IT WORKS (Anchor: #how-it-works)
            ========================================================================= */}
        <section
          id="how-it-works"
          style={{
            padding: '72px 48px',
            backgroundColor: '#FAF9F6',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ maxWidth: '1000px', marginInline: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Simple, effortless onboarding
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '2.4rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginTop: '6px',
                  marginBottom: '10px',
                }}
              >
                Three steps to peace of mind.
              </h2>
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
                  title: 'Setup your Organization & Bank Accounts',
                  desc: 'Use the 10-step Client Finance Wizard to configure your legal entity, commercial bank accounts (Equity, NCBA, KCB), and M-Pesa Paybill channels.',
                },
                {
                  step: '02',
                  title: 'Import Properties & Active Leases',
                  desc: 'Upload CSV/Excel schedules or drag-and-drop lease documents. Our OCR engine extracts tenant details, rent rates, and deposit escrow amounts.',
                },
                {
                  step: '03',
                  title: 'Automate Collections & Ledger',
                  desc: 'Tenants receive automated STK push notifications. Invoices settle in real time, and double-entry journals update your live balance sheet.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '32px 28px',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '2.2rem',
                      fontWeight: 700,
                      color: '#E2E8F0',
                      marginBottom: '12px',
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: INTEGRATIONS (Anchor: #integrations)
            ========================================================================= */}
        <section
          id="integrations"
          style={{
            padding: '72px 48px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ maxWidth: '1000px', marginInline: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Connected to Kenya's financial core
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2.4rem',
                fontWeight: 600,
                color: '#0F172A',
                marginTop: '6px',
                marginBottom: '14px',
              }}
            >
              Native Integrations with Banks & Telcos.
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.94rem', maxWidth: '600px', marginInline: 'auto', marginBottom: '40px' }}>
              Direct connectivity with Safaricom Daraja, multi-bank statement parsers, and automated notification gateways.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '18px',
              }}
            >
              {[
                { name: 'Safaricom M-Pesa', badge: 'STK Push & C2B Webhook' },
                { name: 'Equity Bank', badge: 'Direct Wire & Statement Recon' },
                { name: 'NCBA Group', badge: 'Automated Account Routing' },
                { name: 'KCB Bank', badge: 'Petty Cash & Escrow Feeds' },
                { name: 'Co-operative Bank', badge: 'Rent Collection Mappings' },
                { name: 'Stanbic Bank', badge: 'Operating Expense Clearing' },
              ].map((prov, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FAF9F6',
                    padding: '20px 16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>{prov.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>{prov.badge}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: PRICING (Anchor: #pricing)
            ========================================================================= */}
        <section
          id="pricing"
          style={{
            padding: '72px 48px',
            backgroundColor: '#FAF9F6',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ maxWidth: '1050px', marginInline: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Simple, transparent pricing
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '2.4rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginTop: '6px',
                  marginBottom: '10px',
                }}
              >
                Plans that scale with your portfolio.
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.94rem' }}>
                All plans include M-Pesa automated reconciliation, double-entry trust accounting, and tenant portal.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                alignItems: 'stretch',
              }}
            >
              {[
                {
                  name: 'Starter',
                  price: 'KES 25,000',
                  cadence: '/ month',
                  desc: 'Ideal for independent landlords and small estates up to 20 units.',
                  features: ['Up to 20 Units', '1 Commercial Bank Account', '1 M-Pesa Till / Paybill', 'Automated STK Push Billing', 'Standard Email Support'],
                  highlighted: false,
                },
                {
                  name: 'Professional',
                  price: 'KES 45,000',
                  cadence: '/ month',
                  desc: 'For property management firms operating multi-building portfolios up to 100 units.',
                  features: ['Up to 100 Units', '3 Commercial Bank Accounts', 'Multiple M-Pesa Channels', 'AI Financial Assistant', 'Double-Entry General Ledger', 'Priority WhatsApp Support'],
                  highlighted: true,
                },
                {
                  name: 'Enterprise',
                  price: 'KES 65,000',
                  cadence: '/ month',
                  desc: 'Full-scale solution for corporate property developers with unlimited units.',
                  features: ['Unlimited Units & Estates', 'Unlimited Bank Accounts', 'Custom Reconciliation Rules', 'Dedicated Database Isolation', '24/7 Dedicated Account Manager'],
                  highlighted: false,
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '36px 32px',
                    border: plan.highlighted ? '2px solid #0F172A' : '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: plan.highlighted ? '0 20px 40px rgba(0, 0, 0, 0.08)' : '0 4px 12px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {plan.highlighted && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-13px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '4px 14px',
                        borderRadius: '9999px',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>{plan.name}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px', minHeight: '38px' }}>
                      {plan.desc}
                    </div>

                    <div style={{ margin: '24px 0 20px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A' }}>{plan.price}</span>
                      <span style={{ fontSize: '0.84rem', color: '#64748B' }}>{plan.cadence}</span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {plan.features.map((f, fIdx) => (
                        <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#334155' }}>
                          <Check size={16} color="#16A34A" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/login"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: plan.highlighted ? '#0F172A' : '#F1F5F9',
                      color: plan.highlighted ? '#FFFFFF' : '#0F172A',
                      padding: '12px 20px',
                      borderRadius: '9999px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Choose {plan.name}</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CALL TO ACTION
            ========================================================================= */}
        <section
          style={{
            padding: '72px 48px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '720px', marginInline: 'auto' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2.6rem',
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: '14px',
              }}
            >
              Ready to experience modern rental intelligence?
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.98rem', marginBottom: '32px' }}>
              Join forward-thinking property managers across Nairobi, Mombasa, and Kisumu who manage their entire lifecycle on Guri24.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                to="/app/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  padding: '13px 28px',
                  borderRadius: '9999px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
                }}
              >
                <span>Launch Guri24 RMS</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FOOTER
            ========================================================================= */}
        <footer
          style={{
            padding: '32px 48px',
            backgroundColor: '#FAF9F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.82rem',
            color: '#64748B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: '#0F172A' }}>Guri24°</span>
            <span>© 2026 Guri24 Rental Management Ltd. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/login" style={{ color: '#64748B', textDecoration: 'none' }}>Staff Login</Link>
            <Link to="/app/analytics-ledger" style={{ color: '#64748B', textDecoration: 'none' }}>Financial Ledger</Link>
            <Link to="/platform/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Platform Admin</Link>
          </div>
        </footer>
      </div>

      {/* =========================================================================
          INTERACTIVE DEMO / VIDEO WALKTHROUGH MODAL
          ========================================================================= */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Guri24 RMS Interactive Walkthrough"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '880px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                  Guri24 RMS — Product Walkthrough
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Interactive live inspection of the core workflows
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Subnav */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                padding: '0 24px',
              }}
            >
              {[
                { key: 'recon', label: '1. M-Pesa Automated Recon' },
                { key: 'leases', label: '2. Living Leases & Tenants' },
                { key: 'ledger', label: '3. Double-Entry Ledger' },
                { key: 'ai', label: '4. AI Financial Assistant' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setVideoDemoTab(tab.key as any)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.82rem',
                    fontWeight: videoDemoTab === tab.key ? 700 : 500,
                    color: videoDemoTab === tab.key ? '#0F172A' : '#64748B',
                    borderBottom: videoDemoTab === tab.key ? '2px solid #0F172A' : '2px solid transparent',
                    background: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderTop: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Preview Body */}
            <div style={{ padding: '28px', backgroundColor: '#FAF9F6' }}>
              {videoDemoTab === 'recon' && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Safaricom Daraja STK Push & Webhook Deduplication
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    When a tenant pays via M-Pesa, Guri24 captures the <code>MpesaReceiptNumber</code> and <code>CheckoutRequestID</code>, deduplicating callbacks atomically. Invoices are settled FIFO, partial receipts generate accurate balances, and tenant SMS receipts dispatch via transactional outbox.
                  </p>
                </div>
              )}
              {videoDemoTab === 'leases' && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Living Property & Lease State Machine
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    Track occupancy from VacantAvailable to Occupied. Overlapping active leases on the same unit are prohibited by PostgreSQL exclusion constraints. Renewals transition prior leases cleanly while preserving deposit liability balances.
                  </p>
                </div>
              )}
              {videoDemoTab === 'ledger' && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Double-Entry General Ledger with Account 2100 Segregation
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    Every transaction satisfies <code>Total Debits == Total Credits</code>. Security deposits post strictly to Account 2100 (Liability held in trust escrow) and are never commingled into Account 4000 (Rental Revenue), protecting Net Operating Income accuracy.
                  </p>
                </div>
              )}
              {videoDemoTab === 'ai' && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Grounded AI Financial Interpreter
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    Embedded right inside the Analytics & Ledger workspace, the AI assistant computes collections efficiency, explains arrears aging trends, and confirms trial balance health with direct record citations.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsVideoModalOpen(false);
                  navigate('/app/dashboard');
                }}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Launch Live App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Style for Keyframe Animations */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};