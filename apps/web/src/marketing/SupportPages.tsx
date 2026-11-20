import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, LifeBuoy, AlertTriangle, CheckCircle, ArrowRight, HelpCircle, Server, FileText } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const SupportPages: React.FC = () => {
  const { pathname } = useLocation();

  // If path is `/status`
  if (pathname === '/status') {
    return (
      <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {/* Status Header */}
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: '#DCFCE7', borderRadius: '999px', color: '#166534', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              All Guri24 Systems Operational
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              System Health & Status
            </h1>
            <p style={{ fontSize: '1.05rem', color: BRAND_TOKENS.colors.slateSubtle }}>
              Real-time uptime metrics, API latency, and automated banking connector health.
            </p>
          </div>

          {/* Systems Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '20px' }}>
              Core Infrastructure Components
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Safaricom Daraja M-Pesa IPN Webhook Receiver', status: 'Operational', uptime: '100.0%', latency: '42ms' },
                { name: 'Double-Entry General Ledger Core (Rust Axum Engine)', status: 'Operational', uptime: '99.99%', latency: '18ms' },
                { name: 'Multi-Tenant PostgreSQL Database Clustered Storage', status: 'Operational', uptime: '100.0%', latency: '4ms' },
                { name: 'Bank Statement OCR Ingestion & Parser Service', status: 'Operational', uptime: '99.95%', latency: '180ms' },
                { name: 'Automated SMS / Email Transaction Dispatcher', status: 'Operational', uptime: '99.98%', latency: '95ms' },
                { name: 'Tenant Self-Service Portal & Web Client', status: 'Operational', uptime: '100.0%', latency: '28ms' },
              ].map((sys, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy }}>{sys.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>Latency: {sys.latency}</span>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>Uptime: {sys.uptime}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>{sys.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If path is `/sitemap`
  if (pathname === '/sitemap') {
    return (
      <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Platform Sitemap
            </h1>
            <p style={{ fontSize: '1rem', color: BRAND_TOKENS.colors.slateSubtle }}>
              Index of all publicly accessible pages, solution guides, feature modules, and compliance resources.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', backgroundColor: '#FFFFFF', padding: '48px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px' }}>Main Navigation</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <li><Link to="/" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Home</Link></li>
                <li><Link to="/about" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>About Guri24</Link></li>
                <li><Link to="/features" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>All 14 Features</Link></li>
                <li><Link to="/solutions" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Solutions Hub</Link></li>
                <li><Link to="/how-it-works" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>How It Works</Link></li>
                <li><Link to="/pricing" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Pricing & Plans</Link></li>
                <li><Link to="/contact" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Contact & Sales</Link></li>
                <li><Link to="/faq" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>FAQ & Help</Link></li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px' }}>Solutions</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <li><Link to="/solutions/landlords" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Independent Landlords</Link></li>
                <li><Link to="/solutions/property-managers" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Property Managers & Agencies</Link></li>
                <li><Link to="/solutions/real-estate-companies" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Real Estate Companies & Funds</Link></li>
                <li><Link to="/solutions/estate-managers" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Gated Estates & Communities</Link></li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px' }}>Legal & Compliance</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <li><Link to="/legal" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Legal Overview Hub</Link></li>
                <li><Link to="/legal/terms" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Terms & Conditions</Link></li>
                <li><Link to="/legal/privacy" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Privacy Policy (KDPA 2019)</Link></li>
                <li><Link to="/legal/cookies" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Cookie Policy</Link></li>
                <li><Link to="/legal/data-protection" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Data Protection & Security</Link></li>
                <li><Link to="/legal/acceptable-use" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Acceptable Use Policy</Link></li>
                <li><Link to="/legal/subscription-and-billing" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Subscription Terms</Link></li>
                <li><Link to="/legal/data-processing" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Data Processing Agreement</Link></li>
                <li><Link to="/security" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Security Architecture</Link></li>
                <li><Link to="/accessibility" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Accessibility Statement</Link></li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px' }}>Account & Authentication</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <li><Link to="/login" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Sign In</Link></li>
                <li><Link to="/register" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Create Organization</Link></li>
                <li><Link to="/forgot-password" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>Password Recovery</Link></li>
                <li><Link to="/status" style={{ color: BRAND_TOKENS.colors.primaryBlue, textDecoration: 'none' }}>System Status</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default /support Hub
  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 54px' }}>
          <div style={{ display: 'inline-flex', padding: '6px 16px', backgroundColor: BRAND_TOKENS.colors.primaryTint, borderRadius: '999px', color: BRAND_TOKENS.colors.primaryBlue, fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
            Customer Support
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            How can we assist you today?
          </h1>
          <p style={{ fontSize: '1.1rem', color: BRAND_TOKENS.colors.slateSubtle }}>
            Access our technical help desk, report operational exceptions, or chat with property accountants.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '48px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: BRAND_TOKENS.colors.primaryTint, color: BRAND_TOKENS.colors.primaryBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <HelpCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Knowledge Base & Documentation</h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '20px' }}>
              Step-by-step guides on M-Pesa setup, bank statement imports, chart of accounts customization, and tenant invoicing.
            </p>
            <Link to="/resources" style={{ color: BRAND_TOKENS.colors.primaryBlue, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Browse Documentation &rarr;
            </Link>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <LifeBuoy size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Direct Support Desk</h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '20px' }}>
              Connect with our Nairobi-based property engineering support team for assistance with complex reconciliations.
            </p>
            <Link to="/contact" style={{ color: '#16A34A', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Open Support Ticket &rarr;
            </Link>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Server size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Live Service Health</h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '20px' }}>
              Check real-time uptime status, API latency metrics, and scheduled maintenance windows.
            </p>
            <Link to="/status" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              View System Status &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomErrorPage: React.FC<{ code: '403' | '404' | '500' | 'maintenance'; title?: string; message?: string }> = ({
  code,
  title,
  message,
}) => {
  const configs = {
    '403': {
      title: title || '403: Access Restricted',
      desc: message || 'You do not have permission to view this resource. Please contact your organization administrator.',
    },
    '404': {
      title: title || '404: Page Not Found',
      desc: message || 'The page or financial ledger view you are looking for does not exist or has been relocated.',
    },
    '500': {
      title: title || '500: System Error',
      desc: message || 'An unexpected server error occurred while processing your request. Our engineering team has been notified.',
    },
    maintenance: {
      title: title || 'Scheduled System Maintenance',
      desc: message || 'Guri24 RMS is undergoing planned infrastructure optimization. All data is securely locked and operations will resume shortly.',
    },
  };

  const current = configs[code] || configs['404'];

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#FFFFFF', padding: '48px 40px', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <AlertTriangle size={32} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '12px' }}>{current.title}</h1>
        <p style={{ fontSize: '0.98rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6, marginBottom: '32px' }}>{current.desc}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.primaryBlue, color: '#FFFFFF', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            Return to Homepage
          </Link>
          <Link to="/support" style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.bgCanvas, border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, color: BRAND_TOKENS.colors.darkNavy, fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};
