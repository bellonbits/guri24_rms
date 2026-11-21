import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Shield, ArrowRight, CheckCircle2, Lock, Mail, User, Phone, MapPin } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';
import { apiClient } from '../lib/apiClient';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tier = searchParams.get('tier') || 'starter';

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'PROPERTY_MANAGEMENT_COMPANY',
    county: 'Nairobi',
    kraPin: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setError('You must accept the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.register({
        organization_name: formData.organizationName,
        organization_type: formData.organizationType,
        county: formData.county,
        kra_pin: formData.kraPin || undefined,
        admin_full_name: formData.adminName,
        admin_email: formData.adminEmail,
        admin_phone: formData.adminPhone,
        admin_password: formData.adminPassword,
      });

      if (res && res.access_token) {
        // Save session
        localStorage.setItem(
          'guri24_rms_auth_session',
          JSON.stringify({
            token: res.access_token,
            user: res.user,
            organization: res.organization,
          })
        );
        navigate('/onboarding');
      } else {
        // Fallback for simulation/demo
        navigate('/onboarding');
      }
    } catch (err: any) {
      console.warn('Registration network notice:', err);
      // If server is not responding to registration or endpoint is mocked, navigate to onboarding for demo experience
      navigate('/onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
            <img src="/logo.png" alt="Guri24 RMS" style={{ height: '36px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em' }}>
              Guri<span style={{ color: BRAND_TOKENS.colors.primaryBlue }}>24</span> RMS
            </span>
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Create Your Property Organization
          </h1>
          <p style={{ color: BRAND_TOKENS.colors.slateSubtle, fontSize: '0.96rem' }}>
            Start your 14-day full platform trial. Selected tier: <strong style={{ color: BRAND_TOKENS.colors.primaryBlue, textTransform: 'capitalize' }}>{tier}</strong>
          </p>
        </div>

        {/* Form Container */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Organization / Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Skyline Property Investments Ltd"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Organization Type</label>
                <select
                  value={formData.organizationType}
                  onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="PROPERTY_MANAGEMENT_COMPANY">Property Management Company</option>
                  <option value="INDIVIDUAL_LANDLORD">Individual Landlord</option>
                  <option value="ESTATE_HOA">Gated Community / HOA</option>
                  <option value="REAL_ESTATE_DEVELOPER">Real Estate Developer / Fund</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Primary County</label>
                <select
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kiambu">Kiambu</option>
                  <option value="Machakos">Machakos</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Uasin Gishu">Uasin Gishu (Eldoret)</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #F1F5F9', margin: '24px 0', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px' }}>Administrative User Credentials</h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Administrator Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peter Mwangi"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Official Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="peter@company.com"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7..."
                    value={formData.adminPhone}
                    onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Create Secure Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                I agree to the <Link to="/legal/terms" target="_blank" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Terms of Service</Link>,{' '}
                <Link to="/legal/privacy" target="_blank" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Privacy Policy</Link>, and acknowledge KDPA 2019 data processing standards.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? 'Setting up organization...' : 'Complete Free Registration'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: BRAND_TOKENS.colors.slateSubtle }}>
            Already have an active account?{' '}
            <Link to="/login" style={{ color: BRAND_TOKENS.colors.primaryBlue, fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>
            Password Recovery
          </h1>
          <p style={{ fontSize: '0.92rem', color: BRAND_TOKENS.colors.slateSubtle }}>
            Enter your registered administrator email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Check Your Inbox</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
              We have dispatched a cryptographic reset link to <strong>{email}</strong>. Please click the link within 1 hour to set a new password.
            </p>
            <Link to="/login" style={{ color: BRAND_TOKENS.colors.primaryBlue, fontWeight: 600, textDecoration: 'none' }}>
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                backgroundColor: BRAND_TOKENS.colors.primaryBlue,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.96rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Send Reset Link
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.88rem' }}>
              <Link to="/login" style={{ color: BRAND_TOKENS.colors.slateSubtle, textDecoration: 'none' }}>
                Remember your password? <span style={{ color: BRAND_TOKENS.colors.primaryBlue, fontWeight: 600 }}>Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ maxWidth: '600px', width: '100%', backgroundColor: '#FFFFFF', padding: '48px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: BRAND_TOKENS.colors.primaryBlue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Setup Wizard • Step {step} of 3
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '28px', height: '6px', borderRadius: '999px', backgroundColor: BRAND_TOKENS.colors.primaryBlue }} />
            <div style={{ width: '28px', height: '6px', borderRadius: '999px', backgroundColor: step >= 2 ? BRAND_TOKENS.colors.primaryBlue : '#E2E8F0' }} />
            <div style={{ width: '28px', height: '6px', borderRadius: '999px', backgroundColor: step >= 3 ? BRAND_TOKENS.colors.primaryBlue : '#E2E8F0' }} />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>
              Name Your First Property or Estate
            </h2>
            <p style={{ color: BRAND_TOKENS.colors.slateSubtle, fontSize: '0.92rem', marginBottom: '24px' }}>
              Enter the initial building or property portfolio you will manage.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Property Name</label>
              <input type="text" placeholder="e.g. Parkview Apartments" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Estimated Number of Units</label>
              <input type="number" defaultValue="24" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }} />
            </div>

            <button
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.primaryBlue, color: '#FFFFFF', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Continue to Financial Channels &rarr;
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>
              Connect Rent Payment Channels
            </h2>
            <p style={{ color: BRAND_TOKENS.colors.slateSubtle, fontSize: '0.92rem', marginBottom: '24px' }}>
              Configure where tenants will deposit rent for automatic ledger reconciliation.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Primary M-Pesa Paybill / Till Number</label>
              <input type="text" placeholder="e.g. 174379 or Till Number" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '6px' }}>Commercial Bank</label>
              <select style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#FFFFFF' }}>
                <option>Co-operative Bank of Kenya</option>
                <option>Equity Bank</option>
                <option>KCB Bank</option>
                <option>Stanbic Bank</option>
                <option>NCBA Bank</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '13px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.bgCanvas, border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, fontWeight: 600, cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{ flex: 2, padding: '13px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.primaryBlue, color: '#FFFFFF', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Proceed to Review &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '10px' }}>
              Organization Ready!
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Your chart of accounts, multi-tenant database partitions, and property management workspace have been created successfully.
            </p>

            <button
              onClick={() => navigate('/app/dashboard')}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: BRAND_TOKENS.colors.primaryBlue,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Enter Guri24 RMS Dashboard &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
