import React, { useState } from 'react';
import {
  Shield,
  Key,
  Smartphone,
  Bell,
  Globe,
  Moon,
  Sun,
  Laptop,
  LogOut,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface SettingsViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack, showToast }) => {
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'privacy'>('security');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification preferences
  const [notifSettings, setNotifSettings] = useState({
    emailRent: true,
    emailMaintenance: true,
    emailAnnouncements: true,
    smsRent: true,
    smsEmergency: true,
    smsMaintenance: false,
    inAppAll: true,
  });

  const [currencyPref, setCurrencyPref] = useState<'KES' | 'USD'>('KES');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      if (showToast) showToast('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      if (showToast) showToast('Password must be at least 8 characters.');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (showToast) showToast('Password updated securely.');
    }, 900);
  };

  const handleToggleMfa = () => {
    setMfaEnabled(!mfaEnabled);
    if (showToast) {
      showToast(!mfaEnabled ? 'Two-Factor Authentication (SMS OTP) enabled.' : 'Two-Factor Authentication disabled.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '3px 10px', borderRadius: '12px' }}>
            Account Control
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>•</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Security & Preferences</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131726', letterSpacing: '-0.02em', margin: 0 }}>
          Account Settings
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
          Manage your login credentials, multi-factor authentication, active sessions, and communication channels.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '28px' }}>
        {[
          { id: 'security', label: 'Security & Sessions', icon: Shield },
          { id: 'notifications', label: 'Notification Channels', icon: Bell },
          { id: 'privacy', label: 'Privacy & Data Export', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                color: activeTab === tab.id ? '#2563eb' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Change Password */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Key size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: 0 }}>
                  Change Password
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Ensure your account uses a secure password of at least 8 characters.
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} style={{ maxWidth: '480px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                style={{
                  padding: '10px 20px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: savingPassword ? 'not-allowed' : 'pointer',
                }}
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* 2FA Toggle */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: mfaEnabled ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mfaEnabled ? '#15803d' : '#64748b' }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: 0 }}>
                    Two-Factor Authentication (2FA)
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Receive a 6-digit verification code via SMS to +44 9999 999 999 on login.
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleMfa}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: mfaEnabled ? '1px solid #86efac' : '1px solid #cbd5e1',
                  background: mfaEnabled ? '#f0fdf4' : '#ffffff',
                  color: mfaEnabled ? '#15803d' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {mfaEnabled ? <CheckCircle2 size={16} /> : null}
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: 0 }}>
                  Active Device Sessions
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Devices currently signed in to your Courtney Henry tenant account.
                </div>
              </div>
              <button
                onClick={() => {
                  if (showToast) showToast('Logged out of all other device sessions.');
                }}
                style={{
                  padding: '8px 14px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Log Out Other Devices
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Laptop size={20} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#131726' }}>
                      Chrome on macOS (Current Session)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Nairobi, Kenya • IP 102.217.64.12 • Active Now
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px' }}>
                  Current
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Smartphone size={20} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#131726' }}>
                      Safari on iPhone 15 Pro
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Nairobi, Kenya • 2 hours ago
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (showToast) showToast('Session revoked.');
                  }}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: '0 0 4px 0' }}>
            Notification Channels & Triggers
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Customize which alerts you receive via Email and SMS.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { id: 'emailRent', label: 'Rent Invoices & Payment Receipts (Email)', desc: 'Sent when monthly rent is billed and when C2B payments are verified.' },
              { id: 'emailMaintenance', label: 'Maintenance Progress Updates (Email)', desc: 'Sent when a technician is scheduled or a ticket is resolved.' },
              { id: 'emailAnnouncements', label: 'Estate Notices & Water/Power Alerts (Email)', desc: 'Bulletins and planned utility interruption notices.' },
              { id: 'smsRent', label: 'Rent Due Reminders (SMS to mobile)', desc: 'Friendly SMS reminders 3 days before rent due date.' },
              { id: 'smsEmergency', label: 'Emergency Estate Broadcasts (SMS)', desc: 'Security, fire drills, or urgent perimeter safety alerts (Mandatory).' },
            ].map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#131726' }}>{item.label}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={(notifSettings as any)[item.id] !== false}
                  disabled={item.id === 'smsEmergency'}
                  onChange={(e) => {
                    setNotifSettings({ ...notifSettings, [item.id]: e.target.checked });
                    if (showToast) showToast('Preferences updated.');
                  }}
                  style={{ width: '18px', height: '18px', cursor: item.id === 'smsEmergency' ? 'not-allowed' : 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: '0 0 4px 0' }}>
            Privacy & Data Sovereignty
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 20px 0' }}>
            In compliance with the Kenya Data Protection Act 2019 and international GDPR privacy standards.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#131726' }}>
                  Export Personal Tenancy Data
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Download an archive containing your lease agreements, payment history, maintenance records, and profile details.
                </div>
              </div>
              <button
                onClick={() => {
                  if (showToast) showToast('Data export initiated. You will receive a secure download link via email.');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={15} /> Export Archive (ZIP)
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#991b1b' }}>
                  Account Closure & Data Anonymisation
                </div>
                <div style={{ fontSize: '0.76rem', color: '#7f1d1d' }}>
                  Account closure is only permitted after lease termination, move-out inspection sign-off, and zero outstanding balance.
                </div>
              </div>
              <button
                disabled
                style={{
                  padding: '9px 16px',
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'not-allowed',
                }}
              >
                Active Tenancy Locked
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
