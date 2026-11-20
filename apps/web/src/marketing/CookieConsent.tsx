import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, Settings, Check, X, Info } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export interface CookiePreferences {
  strictlyNecessary: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  policyVersion: string;
  source: 'BANNER' | 'PREFERENCES_MODAL';
}

const STORAGE_KEY = 'guri24_cookie_consent_v1';
const CURRENT_POLICY_VERSION = '1.0.0';

export function getStoredCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.strictlyNecessary === 'boolean') {
      return parsed;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function saveCookieConsent(
  prefs: Omit<CookiePreferences, 'timestamp' | 'policyVersion'>,
  source: 'BANNER' | 'PREFERENCES_MODAL' = 'PREFERENCES_MODAL'
): CookiePreferences {
  const fullConsent: CookiePreferences = {
    ...prefs,
    strictlyNecessary: true,
    timestamp: new Date().toISOString(),
    policyVersion: CURRENT_POLICY_VERSION,
    source,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConsent));

    // Google Consent Mode v2 update dispatch
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        analytics_storage: fullConsent.analytics ? 'granted' : 'denied',
        ad_storage: fullConsent.marketing ? 'granted' : 'denied',
        functionality_storage: fullConsent.functional ? 'granted' : 'denied',
        personalization_storage: fullConsent.functional ? 'granted' : 'denied',
        security_storage: 'granted',
      });
    }

    // Custom DOM event for optional scripts
    window.dispatchEvent(
      new CustomEvent('guri24:consent_updated', {
        detail: fullConsent,
      })
    );
  }

  return fullConsent;
}

export const CookieConsentBanner: React.FC = () => {
  const [consent, setConsent] = useState<CookiePreferences | null>(() => getStoredCookieConsent());
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);

  // Local draft state for preferences modal
  const [draftFunctional, setDraftFunctional] = useState(false);
  const [draftAnalytics, setDraftAnalytics] = useState(false);
  const [draftMarketing, setDraftMarketing] = useState(false);

  useEffect(() => {
    if (!consent) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  // Listener for footer "Cookie Settings" trigger
  useEffect(() => {
    const handleOpenSettings = () => {
      const current = getStoredCookieConsent();
      setDraftFunctional(current?.functional ?? false);
      setDraftAnalytics(current?.analytics ?? false);
      setDraftMarketing(current?.marketing ?? false);
      setShowPreferencesModal(true);
      setShowBanner(false);
    };

    window.addEventListener('guri24:open_cookie_settings', handleOpenSettings);
    return () => window.removeEventListener('guri24:open_cookie_settings', handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    const saved = saveCookieConsent(
      {
        strictlyNecessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      },
      'BANNER'
    );
    setConsent(saved);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const handleRejectOptional = () => {
    const saved = saveCookieConsent(
      {
        strictlyNecessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      },
      'BANNER'
    );
    setConsent(saved);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const handleOpenCustomize = () => {
    setDraftFunctional(consent?.functional ?? false);
    setDraftAnalytics(consent?.analytics ?? false);
    setDraftMarketing(consent?.marketing ?? false);
    setShowPreferencesModal(true);
  };

  const handleSaveCustomPreferences = () => {
    const saved = saveCookieConsent(
      {
        strictlyNecessary: true,
        functional: draftFunctional,
        analytics: draftAnalytics,
        marketing: draftMarketing,
      },
      'PREFERENCES_MODAL'
    );
    setConsent(saved);
    setShowPreferencesModal(false);
    setShowBanner(false);
  };

  return (
    <>
      {/* 1. First Visit Bottom Consent Banner */}
      {showBanner && !consent && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            right: '24px',
            maxWidth: '1060px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            borderRadius: '20px',
            boxShadow: '0 20px 45px -10px rgba(2, 20, 41, 0.18), 0 0 0 1px rgba(2, 20, 41, 0.04)',
            padding: '24px 28px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            animation: 'slideUpConsent 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontFamily: BRAND_TOKENS.fonts.sans,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: BRAND_TOKENS.colors.primaryLight,
                color: BRAND_TOKENS.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Cookie size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.02rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                Your privacy matters
              </div>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: BRAND_TOKENS.colors.slateSubtle,
                  lineHeight: 1.55,
                  margin: '6px 0 0',
                }}
              >
                Guri24 uses cookies and similar technologies to operate the website, remember your preferences, understand website usage, and improve your experience. You can choose which optional cookies to allow. Read our{' '}
                <Link
                  to="/legal/cookies"
                  style={{ color: BRAND_TOKENS.colors.primary, textDecoration: 'underline', fontWeight: 600 }}
                >
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link
                  to="/legal/privacy"
                  style={{ color: BRAND_TOKENS.colors.primary, textDecoration: 'underline', fontWeight: 600 }}
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Equal Prominence Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              flexWrap: 'wrap',
              paddingTop: '8px',
              borderTop: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            }}
          >
            <button
              type="button"
              onClick={handleOpenCustomize}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                backgroundColor: '#FFFFFF',
                color: BRAND_TOKENS.colors.slateMuted,
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Settings size={15} />
              <span>Customize Preferences</span>
            </button>

            <button
              type="button"
              onClick={handleRejectOptional}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 22px',
                borderRadius: '10px',
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                backgroundColor: BRAND_TOKENS.colors.bgAlt,
                color: BRAND_TOKENS.colors.darkNavy,
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Reject Optional</span>
            </button>

            <button
              type="button"
              onClick={handleAcceptAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: BRAND_TOKENS.colors.primary,
                color: '#FFFFFF',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: BRAND_TOKENS.shadows.brand,
                transition: 'all 0.15s ease',
              }}
            >
              <Check size={16} />
              <span>Accept All</span>
            </button>
          </div>
        </aside>
      )}

      {/* 2. Detailed Cookie Preferences Modal */}
      {showPreferencesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 20, 41, 0.72)',
            backdropFilter: 'blur(5px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: BRAND_TOKENS.fonts.sans,
          }}
          onClick={() => setShowPreferencesModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(2, 20, 41, 0.35)',
              border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h3
                  id="cookie-preferences-title"
                  style={{ fontSize: '1.25rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, margin: 0 }}
                >
                  Cookie & Privacy Preferences
                </h3>
                <p style={{ fontSize: '0.86rem', color: BRAND_TOKENS.colors.slateSubtle, margin: '6px 0 0' }}>
                  Manage your consent categories. Strictly necessary cookies are always active to maintain security and authentication.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: BRAND_TOKENS.colors.slateSubtle,
                  cursor: 'pointer',
                  padding: '4px',
                }}
                aria-label="Close preferences"
              >
                <X size={20} />
              </button>
            </div>

            {/* Categories List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category 1: Strictly Necessary */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  backgroundColor: BRAND_TOKENS.colors.bgCanvas,
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                      Strictly Necessary Cookies
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      Always Active
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: BRAND_TOKENS.colors.slateSubtle, margin: '4px 0 0', lineHeight: 1.5 }}>
                    Required for essential platform operations, user sessions, CSRF protection, and multi-tenant security isolation. These cannot be disabled.
                  </p>
                </div>
                <input type="checkbox" checked disabled style={{ cursor: 'not-allowed', marginTop: '4px' }} />
              </div>

              {/* Category 2: Functional */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                    Functional Cookies
                  </div>
                  <p style={{ fontSize: '0.82rem', color: BRAND_TOKENS.colors.slateSubtle, margin: '4px 0 0', lineHeight: 1.5 }}>
                    Remember your visual theme preferences, currency formatting, and property filters across sessions.
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={draftFunctional}
                    onChange={(e) => setDraftFunctional(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Category 3: Analytics */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                    Analytics & Performance Cookies
                  </div>
                  <p style={{ fontSize: '0.82rem', color: BRAND_TOKENS.colors.slateSubtle, margin: '4px 0 0', lineHeight: 1.5 }}>
                    Help us understand aggregated site navigation, page latency, and feature usage without tracking identifiable personal tenant or lease records.
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={draftAnalytics}
                    onChange={(e) => setDraftAnalytics(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Category 4: Marketing */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy }}>
                    Marketing & Advertising Cookies
                  </div>
                  <p style={{ fontSize: '0.82rem', color: BRAND_TOKENS.colors.slateSubtle, margin: '4px 0 0', lineHeight: 1.5 }}>
                    Measure the effectiveness of Guri24 acquisition campaigns and partner announcements. Never applied to tenant or financial transactions.
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={draftMarketing}
                    onChange={(e) => setDraftMarketing(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '16px',
                borderTop: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
              }}
            >
              <button
                type="button"
                onClick={handleRejectOptional}
                style={{
                  background: 'none',
                  border: 'none',
                  color: BRAND_TOKENS.colors.slateSubtle,
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 4px',
                  textDecoration: 'underline',
                }}
              >
                Reject All Optional
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSaveCustomPreferences}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                    backgroundColor: BRAND_TOKENS.colors.bgAlt,
                    color: BRAND_TOKENS.colors.darkNavy,
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Selected Preferences
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: BRAND_TOKENS.colors.primary,
                    color: '#FFFFFF',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: BRAND_TOKENS.shadows.brand,
                  }}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Cookie Banner Slide */}
      <style>{`
        @keyframes slideUpConsent {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export function triggerCookieSettingsDialog() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('guri24:open_cookie_settings'));
  }
}
