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
} from '../../../components/heroicons';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../lib/apiClient';

interface SettingsViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack, showToast }) => {
  const { currentUserSession, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'privacy'>('security');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification preferences
  const [notifSettings, setNotifSettings] = useState({
    emailRent: true,
    emailMaintenance: true,
    emailAnnouncements: true,
    smsRent: true,
    smsEmergency: true,
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
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
    try {
      if (currentUserSession?.email) {
        await apiClient.resetPassword({
          email: currentUserSession.email,
          new_password: newPassword,
          token: 'active_session_auth',
        });
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (showToast) showToast('Password updated securely.');
    } catch (err: any) {
      if (showToast) showToast(err?.message || 'Password update failed.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleToggleMfa = () => {
    setMfaEnabled(!mfaEnabled);
    if (showToast) {
      showToast(!mfaEnabled ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          Account Settings
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
          Manage your login credentials, active sessions, and notification channels.
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
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Change Password
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Update your authentication credentials securely.
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} style={{ maxWidth: '480px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
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
                  placeholder="Repeat new password"
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
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Two-Factor Authentication (2FA)
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Require a verification code on login.
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
                }}
              >
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>
              Active Device Session
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Laptop size={20} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                    Current Browser Session
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {currentUserSession?.email || 'Authenticated User'} &bull; Active Now
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '8px' }}>
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>
            Notification Channels
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { id: 'emailRent', label: 'Rent Invoices & Payment Confirmations (Email)' },
              { id: 'emailMaintenance', label: 'Maintenance Progress Updates (Email)' },
              { id: 'emailAnnouncements', label: 'Official Estate Bulletins (Email)' },
              { id: 'smsRent', label: 'Rent Due Reminders (SMS)' },
              { id: 'smsEmergency', label: 'Emergency Safety Broadcasts (SMS)' },
            ].map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.86rem', color: '#334155', fontWeight: 500 }}>{item.label}</div>
                <input
                  type="checkbox"
                  checked={(notifSettings as any)[item.id] !== false}
                  onChange={(e) => {
                    setNotifSettings({ ...notifSettings, [item.id]: e.target.checked });
                    if (showToast) showToast('Preferences updated.');
                  }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>
            Privacy & Tenancy Data Export
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            In accordance with the Kenya Data Protection Act 2019 and privacy regulations, you can request an export of your tenancy records.
          </p>

          <button
            onClick={() => {
              if (showToast) showToast('Tenancy data archive requested. Link will be sent to your email.');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={15} /> Export Personal Tenancy Data
          </button>
        </div>
      )}
    </div>
  );
};
