import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    unitCount: '1-50',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 54px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 16px',
              backgroundColor: BRAND_TOKENS.colors.primaryTint,
              borderRadius: '999px',
              color: BRAND_TOKENS.colors.primaryBlue,
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            Get In Touch
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: BRAND_TOKENS.colors.darkNavy,
              marginBottom: '16px',
              lineHeight: 1.15,
            }}
          >
            We are here to support your property operations
          </h1>
          <p style={{ fontSize: '1.1rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
            Have a question about enterprise subscriptions, M-Pesa integration, or need a personalized platform demonstration? Reach out to our team.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }} className="contact-grid">
          {/* Contact Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
              padding: '44px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Enquiry Received</h3>
                <p style={{ color: BRAND_TOKENS.colors.slateSubtle, fontSize: '0.98rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
                  Thank you for reaching out, {formData.name}. A Guri24 client relationship manager will review your details and contact you within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', organization: '', unitCount: '1-50', subject: 'general', message: '' });
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    backgroundColor: BRAND_TOKENS.colors.bgCanvas,
                    border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                    color: BRAND_TOKENS.colors.darkNavy,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '24px' }}>
                  Send an Executive Message
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Mwangi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="david@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Phone Number (with WhatsApp)</label>
                    <input
                      type="tel"
                      placeholder="+254 7..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Portfolio Size (Units)</label>
                    <select
                      value={formData.unitCount}
                      onChange={(e) => setFormData({ ...formData, unitCount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.95rem',
                        outline: 'none',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="1-25">1 - 25 units</option>
                      <option value="26-100">26 - 100 units</option>
                      <option value="101-350">101 - 350 units</option>
                      <option value="350+">350+ units (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Inquiry Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="sales">Sales & Product Demo</option>
                    <option value="enterprise">Custom Enterprise & ERP Integration</option>
                    <option value="support">Technical & Banking Support</option>
                    <option value="partnership">Partner or Bank Integration Inquiry</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your properties, payment channels, or any specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: BRAND_TOKENS.colors.primaryBlue,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Submitting...' : 'Send Message'} <Send size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Direct Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                padding: '36px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '20px' }}>
                Direct Communication Channels
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: BRAND_TOKENS.colors.primaryTint, color: BRAND_TOKENS.colors.primaryBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND_TOKENS.colors.slateSubtle }}>Email Support</div>
                    <a href="mailto:support@guri24.com" style={{ fontSize: '0.98rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
                      support@guri24.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND_TOKENS.colors.slateSubtle }}>Telephone & WhatsApp</div>
                    <a href="tel:+254700000000" style={{ fontSize: '0.98rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, textDecoration: 'none' }}>
                      +254 (0) 700 000 000
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND_TOKENS.colors.slateSubtle }}>Headquarters</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, lineHeight: 1.4 }}>
                      Nairobi Innovation District, Westlands, Kenya
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND_TOKENS.colors.slateSubtle }}>Operating Hours</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy }}>
                      Monday – Friday: 8:00 AM – 6:00 PM EAT
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Weekend On-Call for Enterprise Emergencies</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Card */}
            <div
              style={{
                backgroundColor: BRAND_TOKENS.colors.darkNavy,
                borderRadius: '24px',
                padding: '32px',
                color: '#FFFFFF',
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Need a Guided Walkthrough?</h4>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '16px' }}>
                Schedule a 20-minute Zoom session with a property operations specialist to explore automated M-Pesa reconciliation on real sample portfolios.
              </p>
              <a
                href="mailto:demo@guri24.com?subject=Schedule%20Guri24%20RMS%20Demo"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: BRAND_TOKENS.colors.secondaryCyan,
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Request a Live Demo &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
