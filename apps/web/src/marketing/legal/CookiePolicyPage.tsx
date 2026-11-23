import React from 'react';
import { LegalLayout } from '../LegalLayout';
import { triggerCookieSettingsDialog } from '../CookieConsent';
import { BRAND_TOKENS } from '../BrandTokens';

export const CookiePolicyPage: React.FC = () => {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Detailed technical inventory of cookies and local storage tokens utilized by Unit Flow."
      lastUpdated="November 20, 2026"
      version="1.4"
    >
      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies and similar storage technologies (including browser LocalStorage and SessionStorage) are small data files placed on your device when you visit websites. They enable session security, remember user preferences, and help us analyze aggregated website performance.
      </p>

      <h2>2. Why Unit Flow Uses Cookies</h2>
      <p>
        We use cookies strictly to operate our multi-tenant SaaS platform securely, maintain authenticated staff and tenant sessions, and improve navigation efficiency.
      </p>

      <h2>3. Technical Cookie Inventory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', fontSize: '0.86rem' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px' }}>Cookie / Key</th>
            <th style={{ padding: '10px 12px' }}>Category</th>
            <th style={{ padding: '10px 12px' }}>Lifespan</th>
            <th style={{ padding: '10px 12px' }}>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '10px 12px', fontWeight: 600 }}>guri24_rms_auth_session</td>
            <td style={{ padding: '10px 12px' }}>Strictly Necessary</td>
            <td style={{ padding: '10px 12px' }}>Session / 7 Days</td>
            <td style={{ padding: '10px 12px' }}>Cryptographically signed JWT bearer token for multi-tenant API authentication.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '10px 12px', fontWeight: 600 }}>guri24_cookie_consent_v1</td>
            <td style={{ padding: '10px 12px' }}>Strictly Necessary</td>
            <td style={{ padding: '10px 12px' }}>365 Days</td>
            <td style={{ padding: '10px 12px' }}>Records your explicit consent choices across categories.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '10px 12px', fontWeight: 600 }}>guri24_ui_theme</td>
            <td style={{ padding: '10px 12px' }}>Functional (Optional)</td>
            <td style={{ padding: '10px 12px' }}>Persistent</td>
            <td style={{ padding: '10px 12px' }}>Stores light/dark mode and table density preferences.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '10px 12px', fontWeight: 600 }}>_ga / _gid (Optional)</td>
            <td style={{ padding: '10px 12px' }}>Analytics (Optional)</td>
            <td style={{ padding: '10px 12px' }}>2 Years / 24 Hours</td>
            <td style={{ padding: '10px 12px' }}>Only loaded if Analytics consent is explicitly granted via the consent banner.</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Managing and Withdrawing Consent</h2>
      <p>
        You can review, modify, or revoke your optional cookie preferences at any time by clicking the button below:
      </p>

      <div style={{ margin: '24px 0' }}>
        <button
          type="button"
          onClick={triggerCookieSettingsDialog}
          style={{
            backgroundColor: BRAND_TOKENS.colors.primary,
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.90rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Open Cookie Settings Manager
        </button>
      </div>
    </LegalLayout>
  );
};
