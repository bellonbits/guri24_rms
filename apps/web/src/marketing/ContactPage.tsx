import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    unitCount: '25-100 units',
    subject: 'consultation',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: BRAND_TOKENS.fonts.sans,
        color: '#0F172A',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* =========================================================================
          SECTION 1: ARCHITECTURAL HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '60vh',
          backgroundImage: 'url(/luxury-minimalist-living.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '100px 32px 70px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(2, 20, 41, 0.78) 0%, rgba(2, 20, 41, 0.52) 50%, rgba(2, 20, 41, 0.9) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(50px, 13vw, 170px)',
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: 'rgba(255, 255, 255, 0.08)',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex: 1,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          CONNECT WITH US
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '820px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '20px',
            }}
          >
            <span style={{ color: '#03D8BF' }}>03</span>
            <span>&bull;</span>
            <span>DIRECT ADVISORY</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.6vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              lineHeight: 1.12,
              marginBottom: '20px',
            }}
          >
            Executive Consultation &amp;{' '}
            <span style={{ color: '#B89047' }}>Advisory Desk</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Have a question regarding enterprise migration, Safaricom Daraja C2B Paybill setup, or need a private demonstration? Connect with our senior architects in Nairobi.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SPLIT CONSULTATION & OFFICE GRID
          ========================================================================= */}
      <section
        style={{
          padding: '88px 48px',
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
            alignItems: 'start',
          }}
          className="contact-split-grid"
        >
          {/* Left Column: Interactive Consultation Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              border: '1px solid #E2E8F0',
              padding: '48px',
              boxShadow: '0 16px 40px -10px rgba(2, 20, 41, 0.08)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#021429', marginBottom: '10px' }}>
                  Consultation Request Received
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.96rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 28px' }}>
                  Thank you, {formData.name}. A Guri24 client relationship manager will review your property portfolio specifications and contact you within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', organization: '', unitCount: '25-100 units', subject: 'consultation', message: '' });
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '999px',
                    backgroundColor: '#021429',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'inline-flex',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    backgroundColor: '#EFF5FF',
                    color: '#0057FC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: '16px',
                  }}
                >
                  Priority Booking
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#021429', marginBottom: '8px' }}>
                  Request an Executive Demonstration
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '28px' }}>
                  Discover how Guri24 eliminates unreconciled M-Pesa balances and automates multi-property accounting.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#021429', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Mwangi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#021429', marginBottom: '6px' }}>
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. david@skyline.co.ke"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#021429', marginBottom: '6px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 7..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#021429', marginBottom: '6px' }}>
                      Units Managed
                    </label>
                    <select
                      value={formData.unitCount}
                      onChange={(e) => setFormData({ ...formData, unitCount: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.92rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                    >
                      <option value="1-25 units">1 - 25 units (Starter)</option>
                      <option value="25-100 units">25 - 100 units (Growth)</option>
                      <option value="101-350 units">101 - 350 units (Scale)</option>
                      <option value="350+ units">350+ units (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#021429', marginBottom: '6px' }}>
                    Notes or Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your estates, existing systems, or specific integration requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.92rem', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '999px',
                    backgroundColor: '#021429',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 20px rgba(2, 20, 41, 0.2)',
                  }}
                >
                  <span>{loading ? 'Submitting request...' : 'Book Private Consultation'}</span>
                  <ArrowUpRight size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Westlands Office & Concierge Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Office Card */}
            <div
              style={{
                backgroundColor: '#021429',
                color: '#FFFFFF',
                borderRadius: '28px',
                padding: '40px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 45px -10px rgba(2, 20, 41, 0.3)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-40%',
                  right: '-20%',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(0, 87, 252, 0.4) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#03D8BF', boxShadow: '0 0 10px #03D8BF' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#03D8BF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Nairobi Headquarters
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 900, marginBottom: '16px', lineHeight: 1.25 }}>
                  The Mirage, Tower 2, 7th Floor
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
                  Chiromo Road, Westlands, Nairobi, Kenya.
                  <br />
                  Open Monday &ndash; Friday, 8:00 AM &ndash; 6:00 PM EAT.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={18} style={{ color: '#03D8BF' }} />
                    <span style={{ fontSize: '0.94rem', fontWeight: 600 }}>+254 700 000 000</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={18} style={{ color: '#03D8BF' }} />
                    <span style={{ fontSize: '0.94rem', fontWeight: 600 }}>advisory@guri24.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={18} style={{ color: '#03D8BF' }} />
                    <span style={{ fontSize: '0.92rem', color: '#94A3B8' }}>Average Response: 24 minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KDPA Trust Card */}
            <div
              style={{
                backgroundColor: '#FAFBFD',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '30px',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                <ShieldCheck size={24} style={{ color: '#0057FC' }} />
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#021429' }}>
                  KDPA 2019 Certified Privacy
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55 }}>
                All discussions, portfolio figures, and client tenant records remain strictly confidential under Kenya Data Protection Act standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 900px) {
          .contact-split-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};
