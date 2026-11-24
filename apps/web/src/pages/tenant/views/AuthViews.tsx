import React, { useState } from 'react';
import {
  Building2,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

interface AuthViewsProps {
  mode: 'login' | 'invitation' | 'verify' | 'forgot-password' | 'reset-password' | 'welcome';
  onNavigate: (route: string) => void;
  showToast?: (msg: string) => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({ mode, onNavigate, showToast }) => {
  // Login form state
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('courtney@example.com');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(['5', '8', '2', '9', '', '']);

  // Welcome Walkthrough Step (1 to 4)
  const [welcomeStep, setWelcomeStep] = useState(1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (showToast) showToast('Welcome back, Courtney Henry!');
      onNavigate('/portal/dashboard');
    }, 700);
  };

  const handleAcceptInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (showToast) showToast('Account activated successfully! Welcome to Unit Flow.');
      onNavigate('/portal/welcome');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (showToast) showToast('Phone number verified successfully.');
      onNavigate('/portal/dashboard');
    }, 800);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (showToast) showToast('Password reset link sent to your registered email.');
      onNavigate('/portal/login');
    }, 800);
  };

  // 1. LOGIN VIEW
  if (mode === 'login') {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            width: '100%',
            maxWidth: '460px',
            padding: '36px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}
        >
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#eff6ff', borderRadius: '20px', color: '#2563eb', marginBottom: '12px' }}>
              <Building2 size={18} />
              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Unit Flow Resident</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#131726', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Tenant Self-Service Portal
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
              Access your lease, statements, rent payments, and maintenance requests.
            </p>
          </div>

          {/* Login Method Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '22px' }}>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              style={{
                padding: '9px',
                borderRadius: '9px',
                border: 'none',
                background: loginMethod === 'email' ? '#ffffff' : 'transparent',
                color: loginMethod === 'email' ? '#131726' : '#64748b',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: loginMethod === 'email' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              style={{
                padding: '9px',
                borderRadius: '9px',
                border: 'none',
                background: loginMethod === 'phone' ? '#ffffff' : 'transparent',
                color: loginMethod === 'phone' ? '#131726' : '#64748b',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: loginMethod === 'phone' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Mobile SMS OTP
            </button>
          </div>

          <form onSubmit={handleLogin}>
            {loginMethod === 'email' ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 36px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Password</label>
                    <button
                      type="button"
                      onClick={() => onNavigate('/portal/forgot-password')}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 36px 11px 36px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '11px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Mobile Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 36px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                  We will send a 6-digit one-time PIN via Safaricom SMS.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
                Remember this trusted device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              }}
            >
              {loading ? 'Authenticating...' : loginMethod === 'email' ? 'Sign In to Portal' : 'Send SMS Login PIN'}
            </button>
          </form>

          {/* Footer links */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Received an invitation from your landlord? </span>
            <button
              type="button"
              onClick={() => onNavigate('/portal/invitation/mock-token-2026')}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Activate Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACCEPT INVITATION VIEW
  if (mode === 'invitation') {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '520px', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '4px 12px', borderRadius: '20px' }}>
              Invitation Verified
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131726', margin: '10px 0 6px 0' }}>
              Activate Your Tenancy Account
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
              You've been invited by Greenview Luxury Residences for <strong>Unit A-204</strong>.
            </p>
          </div>

          <form onSubmit={handleAcceptInvitation}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Tenant Full Name:</span>
                <span style={{ fontWeight: 700, color: '#131726' }}>Courtney Henry</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Property & Unit:</span>
                <span style={{ fontWeight: 700, color: '#131726' }}>Greenview Residences • Unit A-204</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Assigned Mobile:</span>
                <span style={{ fontWeight: 700, color: '#131726' }}>+44 9999 999 999</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Create Password
              </label>
              <input
                type="password"
                placeholder="At least 8 characters"
                defaultValue="SecureUnit2026!"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat password"
                defaultValue="SecureUnit2026!"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '24px' }}>
              <input type="checkbox" id="terms" defaultChecked style={{ marginTop: '3px' }} required />
              <label htmlFor="terms" style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                I agree to the <strong>Unit Flow Tenancy Terms & Portal Code of Conduct</strong>, and authorize official digital communication for rent notices.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Activating Account...' : 'Complete Activation & Proceed'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. VERIFY CONTACT (OTP)
  if (mode === 'verify') {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '440px', padding: '36px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Smartphone size={24} />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#131726', margin: '0 0 6px 0' }}>
            Verify Your Mobile Number
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 24px 0' }}>
            We've sent a 6-digit confirmation PIN to <strong>+254 712 345 678</strong>.
          </p>

          <form onSubmit={handleVerifyOtp}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {['5', '8', '2', '9', '1', '4'].map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  defaultValue={val}
                  style={{
                    width: '44px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (showToast) showToast('New OTP sent via SMS.');
              }}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Didn't receive code? Resend SMS in (0:45)
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. FORGOT / RESET PASSWORD
  if (mode === 'forgot-password' || mode === 'reset-password') {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '440px', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#131726', margin: '0 0 6px 0' }}>
            {mode === 'forgot-password' ? 'Reset Your Password' : 'Enter New Password'}
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0' }}>
            {mode === 'forgot-password'
              ? 'Enter your registered tenant email and we will send password reset instructions.'
              : 'Choose a strong password of at least 8 characters.'}
          </p>

          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                defaultValue="courtney@example.com"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => onNavigate('/portal/login')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 5. WELCOME WALKTHROUGH (PAGE 25)
  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '600px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
        {/* Step Progress Indicators */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: step <= welcomeStep ? '#2563eb' : '#e2e8f0',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {welcomeStep === 1 && (
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', background: '#eef2ff', padding: '3px 10px', borderRadius: '12px' }}>
              Step 1 of 4: Your Tenancy
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131726', margin: '12px 0 8px 0' }}>
              Welcome to Greenview Luxury Residences!
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              We're delighted to have you as a resident. Your primary tenancy is Unit A-204, leased through 21 June 2027.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Unit Number:</span>
                <span style={{ fontWeight: 700, color: '#131726' }}>Unit A-204 (2 Bedrooms, 2 Baths)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Monthly Rent:</span>
                <span style={{ fontWeight: 700, color: '#131726' }}>KES 50,000 / month</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Due Date:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>1st of every month</span>
              </div>
            </div>
          </div>
        )}

        {welcomeStep === 2 && (
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '3px 10px', borderRadius: '12px' }}>
              Step 2 of 4: Paying Rent
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131726', margin: '12px 0 8px 0' }}>
              Safaricom C2B V2 Paybill Confirmation
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Unit Flow automates reconciliation using authoritative bank and M-Pesa webhooks. Never wait for manual receipting!
            </p>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                How to pay via M-Pesa:
              </div>
              <div style={{ fontSize: '0.82rem', color: '#15803d', lineHeight: 1.6 }}>
                1. Go to M-Pesa &gt; Lipa na M-Pesa &gt; <strong>Paybill</strong><br />
                2. Enter Business Number: <strong>247247</strong><br />
                3. Enter Account Number: <strong>GRE-A204</strong><br />
                4. Enter Amount and M-Pesa PIN. Your portal updates automatically within 30 seconds!
              </div>
            </div>
          </div>
        )}

        {welcomeStep === 3 && (
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '3px 10px', borderRadius: '12px' }}>
              Step 3 of 4: Facilities & Repairs
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131726', margin: '12px 0 8px 0' }}>
              Seamless Maintenance Triage
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Any issue in your unit can be reported in 30 seconds with photos. Track contractor progress and sign off when satisfied.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#131726' }}>Standard Defect</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>48-hour SLA response with certified local contractors.</div>
              </div>
              <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#dc2626' }}>Emergency Issues</div>
                <div style={{ fontSize: '0.76rem', color: '#991b1b', marginTop: '2px' }}>Leaks, electrical sparks, or lockouts dispatched immediately.</div>
              </div>
            </div>
          </div>
        )}

        {welcomeStep === 4 && (
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 10px', borderRadius: '12px' }}>
              Step 4 of 4: Ready to Begin!
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131726', margin: '12px 0 8px 0' }}>
              You're All Set, Courtney!
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Your self-service portal is active. You can now download your lease agreement, review statements, or submit requests at any time.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <CheckCircle2 size={24} color="#16a34a" />
              <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                Tenancy profile verified • Move-in inspection completed • Emergency contacts on file.
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {welcomeStep > 1 ? (
            <button
              type="button"
              onClick={() => setWelcomeStep(welcomeStep - 1)}
              style={{
                padding: '10px 18px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {welcomeStep < 4 ? (
            <button
              type="button"
              onClick={() => setWelcomeStep(welcomeStep + 1)}
              style={{
                padding: '10px 22px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (showToast) showToast('Welcome home! Enjoy your Unit Flow experience.');
                onNavigate('/portal/dashboard');
              }}
              style={{
                padding: '12px 26px',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
              }}
            >
              Go to My Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
