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
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../lib/apiClient';

interface AuthViewsProps {
  mode: 'login' | 'invitation' | 'verify' | 'forgot-password' | 'reset-password' | 'welcome';
  onNavigate: (route: string) => void;
  showToast?: (msg: string) => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({ mode, onNavigate, showToast }) => {
  const { login } = useAuth();

  // Login form state
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // OTP state
  const [otpCode, setOtpCode] = useState('');

  // Welcome Step
  const [welcomeStep, setWelcomeStep] = useState(1);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      if (loginMethod === 'email') {
        const res = await apiClient.login({ email, password });
        if (res && res.token) {
          login({
            token: res.token,
            userId: res.user?.id || 'tenant-user',
            name: res.user?.name || email.split('@')[0],
            email: res.user?.email || email,
            role: (res.user?.role as any) || 'TENANT',
            organizationId: res.user?.organization_id || 'org-guri24-001',
          });
          if (showToast) showToast('Logged in successfully!');
          onNavigate('/portal/dashboard');
        } else {
          setAuthError('Authentication failed. Check your email and password.');
        }
      } else {
        await apiClient.sendOtp({ phone, channel: 'SMS' });
        if (showToast) showToast('Verification code sent via SMS.');
        onNavigate('/portal/verify');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const res = await apiClient.verifyOtp({ phone, code: otpCode });
      if (res) {
        if (showToast) showToast('Phone number verified successfully.');
        onNavigate('/portal/dashboard');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      await apiClient.resetPassword({ email, new_password: 'requested_reset_link' });
      if (showToast) showToast('Password reset link sent to your registered email.');
      onNavigate('/portal/login');
    } catch (err: any) {
      setAuthError(err?.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  // 1. LOGIN VIEW
  if (mode === 'login') {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '440px', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#eff6ff', borderRadius: '20px', color: '#2563eb', marginBottom: '12px' }}>
              <Building2 size={18} />
              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Unit Flow Resident</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Tenant Self-Service Portal
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
              Access your lease, statements, rent payments, and maintenance requests.
            </p>
          </div>

          {authError && (
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', fontSize: '0.82rem', marginBottom: '18px' }}>
              {authError}
            </div>
          )}

          {/* Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              style={{
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                background: loginMethod === 'email' ? '#ffffff' : 'transparent',
                color: loginMethod === 'email' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              style={{
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                background: loginMethod === 'phone' ? '#ffffff' : 'transparent',
                color: loginMethod === 'phone' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
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
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Password</label>
                    <button
                      type="button"
                      onClick={() => onNavigate('/portal/forgot-password')}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                    required
                  />
                </div>
              </>
            ) : (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                  required
                />
              </div>
            )}

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
              }}
            >
              {loading ? 'Authenticating...' : loginMethod === 'email' ? 'Sign In' : 'Send SMS PIN'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. VERIFY OTP
  if (mode === 'verify') {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '420px', padding: '36px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Verify SMS Code
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Enter the 6-digit one-time PIN sent to your phone.
          </p>

          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              style={{ width: '100%', padding: '12px', textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.3em', fontWeight: 700, borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '20px' }}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. FORGOT / RESET PASSWORD
  if (mode === 'forgot-password' || mode === 'reset-password') {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '420px', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Password Recovery
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Enter your registered tenant email to receive recovery instructions.
          </p>

          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: '18px' }}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Sending...' : 'Send Recovery Instructions'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. WELCOME WALKTHROUGH
  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '580px', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          Welcome to Your Resident Portal
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          Your self-service portal is ready. Here you can check your rent balances, download lease agreements, report maintenance defects, and view notices.
        </p>

        <button
          onClick={() => onNavigate('/portal/dashboard')}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
};
