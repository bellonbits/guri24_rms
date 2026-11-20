import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Building2, Users, Landmark, Home, CheckCircle, ArrowRight, ShieldCheck, Zap, PieChart } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

interface SolutionConfig {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  heroMetrics: { label: string; value: string }[];
  challenges: { title: string; desc: string }[];
  features: { title: string; desc: string }[];
  idealFor: string[];
}

const SOLUTIONS: Record<string, SolutionConfig> = {
  landlords: {
    id: 'landlords',
    badge: 'For Independent Landlords & Owners',
    title: 'Automate Rent Collections & Stop Chasing M-Pesa Messages',
    subtitle: 'Designed for individual property owners managing residential apartments, single-family homes, or commercial shop lots.',
    heroMetrics: [
      { label: 'Time Saved on Billing', value: '85%' },
      { label: 'Unreconciled M-Pesa', value: '0%' },
      { label: 'On-Time Rent Collections', value: '+34%' },
    ],
    challenges: [
      { title: 'Manual M-Pesa Message Checking', desc: 'Tenants sending screenshots of M-Pesa SMS that require painstaking manual cross-checking against bank records.' },
      { title: 'Disorganized Tenant Ledgers', desc: 'Tracking water bills, rent arrears, and security deposits across notebooks or fragmented spreadsheets.' },
      { title: 'Tax & Return Confusion', desc: 'Scrambling during tax season to calculate rental income and deductible maintenance expenses.' },
    ],
    features: [
      { title: 'Instant M-Pesa Paybill / Till Matching', desc: 'Tenant payments via M-Pesa are automatically matched to unit numbers and issued instant SMS receipts.' },
      { title: 'Digital Lease Expiry Alerts', desc: 'Get notified 60 and 30 days before leases expire to negotiate renewals or plan move-outs.' },
      { title: 'One-Click Tax & Profit Reports', desc: 'Generate KRA-ready rental income and expenditure reports with full audit receipts.' },
    ],
    idealFor: ['Owners with 2 to 50 residential units', 'Commercial shop landlords', 'Diaspora property investors seeking remote oversight'],
  },
  'property-managers': {
    id: 'property-managers',
    badge: 'For Professional Property Managers & Agents',
    title: 'Scale Managed Portfolios Without Adding Back-Office Headcount',
    subtitle: 'Empower your management firm to handle dozens of landlords, hundreds of units, and complex commission split disbursements seamlessly.',
    heroMetrics: [
      { label: 'Disbursement Speed', value: 'Same-day' },
      { label: 'Staff Efficiency', value: '4x Units/Mgr' },
      { label: 'Owner Retention', value: '99.2%' },
    ],
    challenges: [
      { title: 'Landlord Remittance Friction', desc: 'Spending days at month-end preparing owner statements, calculating commission deductions, and remitting net proceeds.' },
      { title: 'Tenant Arrears Escalation', desc: 'Arrears slipping through the cracks when managing multiple buildings across different caretakers.' },
      { title: 'Maintenance Ticket Blackholes', desc: 'Lost repair requests leading to frustrated tenants and angry landlords.' },
    ],
    features: [
      { title: 'Automated Landlord Statements & Splits', desc: 'Generate branded monthly owner statements itemizing collected rent, management fees, and repair deductions.' },
      { title: 'Maintenance Workflow & Vendor Quoting', desc: 'Dispatch work orders to pre-approved plumbers and electricians with landlord budget approval gates.' },
      { title: 'Automated Escalation & Late Penalties', desc: 'Configurable automated SMS/email reminders and statutory late fees applied to delinquent accounts.' },
    ],
    idealFor: ['Independent property management agencies', 'Real estate agents expanding into rent collection', 'Caretaker teams supervising multi-unit estates'],
  },
  'real-estate-companies': {
    id: 'real-estate-companies',
    badge: 'For Real Estate Companies & Institutional Funds',
    title: 'Enterprise Multi-Branch Operations, Double-Entry GL & Compliance',
    subtitle: 'Institutional-grade architecture designed for regional developers, REITs, and enterprise property management corporations with complex entity structures.',
    heroMetrics: [
      { label: 'Audit Readiness', value: '100% GL' },
      { label: 'Multi-Branch Portfolios', value: 'Unlimited' },
      { label: 'Security Isolation', value: 'Row-Level' },
    ],
    challenges: [
      { title: 'Siloed Financial Records', desc: 'Separate branches using disconnected accounting packages without consolidated executive visibility.' },
      { title: 'Statutory & Tax Audit Exposure', desc: 'Lack of immutable double-entry general ledger records exposing the firm to compliance penalties.' },
      { title: 'Multi-Entity Confusion', desc: 'Managing inter-company loans, shared service charges, and segregated landlord bank accounts.' },
    ],
    features: [
      { title: 'Full Double-Entry General Ledger', desc: 'Complete chart of accounts, journal entries, trial balance, P&L, balance sheet, and cash flow statements.' },
      { title: 'Multi-Branch Entity Segregation', desc: 'Segment portfolios by legal entity, subsidiary, or regional branch with consolidated parent roll-ups.' },
      { title: 'Granular Role-Based Permissions (RBAC)', desc: 'Configure strict permission matrices across finance controllers, audit teams, leasing agents, and executive directors.' },
    ],
    idealFor: ['Regional real estate conglomerates', 'Institutional real estate investment trusts (REITs)', 'Multi-branch commercial property managers'],
  },
  'estate-managers': {
    id: 'estate-managers',
    badge: 'For Gated Communities & Estate Associations',
    title: 'Master Community Management, Service Charges & Resident Access',
    subtitle: 'Streamline service charge billing, communal amenity bookings, visitor management, and infrastructure upkeep for gated communities.',
    heroMetrics: [
      { label: 'Service Charge Collection', value: '98%' },
      { label: 'Visitor Processing', value: '< 15 sec' },
      { label: 'Resident Portal Adoption', value: '94%' },
    ],
    challenges: [
      { title: 'Service Charge Deficits', desc: 'Residents falling behind on security, garbage, and lighting levies, leading to communal budget shortfalls.' },
      { title: 'Gate Security & Visitor Congestion', desc: 'Manual paper logbooks at access gates creating vehicle queues and security vulnerabilities.' },
      { title: 'Disorganized AGM Reporting', desc: 'Struggling to provide transparent accounting of resident association reserve funds and maintenance outlays.' },
    ],
    features: [
      { title: 'Recurring Service Charge Levies', desc: 'Automate monthly or quarterly service charge billing with individual homeowner ledger tracking.' },
      { title: 'Resident Self-Service Portal', desc: 'Homeowners can view balances, download statements, submit repair requests, and pay via M-Pesa.' },
      { title: 'Reserve Fund & Capex Accounting', desc: 'Segregate sinking fund contributions from operational maintenance expenses in dedicated ledger accounts.' },
    ],
    idealFor: ['Home Owners Associations (HOAs)', 'Gated estate management committees', 'Commercial office parks and retail plazas'],
  },
};

export const SolutionsPages: React.FC = () => {
  const { pathname } = useLocation();

  // Extract segment
  const segment = pathname.split('/solutions/')[1] || '';
  const currentSolution = SOLUTIONS[segment];

  // If path is purely `/solutions`, render overview index
  if (!currentSolution) {
    return (
      <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 64px' }}>
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
              Tailored Solutions
            </div>
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: BRAND_TOKENS.colors.darkNavy,
                marginBottom: '18px',
                lineHeight: 1.15,
              }}
            >
              Purpose-Built for Every Property Stakeholder
            </h1>
            <p style={{ fontSize: '1.15rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
              Whether you are an individual landlord with a single apartment block or a commercial real estate fund managing thousands of units, Guri24 adapts to your exact operational workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {Object.values(SOLUTIONS).map((sol) => (
              <div
                key={sol.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: BRAND_TOKENS.colors.primaryBlue, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {sol.badge}
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '14px', lineHeight: 1.3 }}>
                    {sol.title}
                  </h2>
                  <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    {sol.subtitle}
                  </p>
                </div>

                <div>
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '10px' }}>Ideal For:</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {sol.idealFor.map((item, i) => (
                        <li key={i} style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={14} color="#10B981" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={`/solutions/${sol.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: BRAND_TOKENS.colors.bgCanvas,
                      border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                      color: BRAND_TOKENS.colors.darkNavy,
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                    }}
                  >
                    Explore Solution <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render dedicated Solution Page
  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: BRAND_TOKENS.colors.slateSubtle, textDecoration: 'none' }}>Home</Link>
          <span style={{ color: BRAND_TOKENS.colors.slateBorder }}>/</span>
          <Link to="/solutions" style={{ color: BRAND_TOKENS.colors.slateSubtle, textDecoration: 'none' }}>Solutions</Link>
          <span style={{ color: BRAND_TOKENS.colors.slateBorder }}>/</span>
          <span style={{ color: BRAND_TOKENS.colors.darkNavy, fontWeight: 600 }}>{currentSolution.badge}</span>
        </div>

        {/* Hero Section */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, padding: '56px 48px', marginBottom: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'inline-flex', padding: '6px 16px', backgroundColor: BRAND_TOKENS.colors.primaryTint, borderRadius: '999px', color: BRAND_TOKENS.colors.primaryBlue, fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px' }}>
            {currentSolution.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '20px', maxWidth: '880px' }}>
            {currentSolution.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.7, maxWidth: '780px', marginBottom: '36px' }}>
            {currentSolution.subtitle}
          </p>

          {/* Hero Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', paddingTop: '28px', borderTop: '1px solid #F1F5F9' }}>
            {currentSolution.heroMetrics.map((metric, i) => (
              <div key={i} style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: BRAND_TOKENS.colors.primaryBlue, marginBottom: '4px' }}>{metric.value}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pain Points vs Solutions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          {/* Challenges */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, padding: '40px 36px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '24px' }}>
              Common Operational Headwinds
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {currentSolution.challenges.map((c, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#B91C1C', marginBottom: '6px' }}>✕ {c.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How Guri24 Solves It */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`, padding: '40px 36px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '24px' }}>
              How Guri24 Solves It Authoritatively
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {currentSolution.features.map((f, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#15803D', marginBottom: '6px' }}>✓ {f.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ backgroundColor: BRAND_TOKENS.colors.darkNavy, borderRadius: '24px', padding: '54px 48px', textAlign: 'center', color: '#FFFFFF' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Ready to upgrade your property operations?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Experience the peace of mind of real-time general ledger accounting and automated rent reconciliation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.primaryBlue, color: '#FFFFFF', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
              Start 14-Day Free Trial <ArrowRight size={18} />
            </Link>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#FFFFFF', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
              Schedule Live Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
