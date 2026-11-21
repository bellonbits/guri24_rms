import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Building2,
  Layers,
  Users,
  FileCheck2,
  DollarSign,
  Smartphone,
  Landmark,
  Scale,
  Wrench,
  ScanLine,
  BarChart3,
  Bot,
  UserCheck,
  Bell,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export interface FeatureData {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  icon: any;
  overview: string;
  benefits: { title: string; desc: string }[];
  technicalSpecs: string[];
  workflow: { step: string; title: string; desc: string }[];
}

export const FEATURES_CATALOG: Record<string, FeatureData> = {
  'property-management': {
    slug: 'property-management',
    name: 'Property Portfolio Architecture',
    tagline: 'Multi-entity hierarchy for estates, commercial buildings, and scattered portfolios',
    category: 'Core Operations',
    icon: Building2,
    overview: 'Consolidate multiple land titles, estate developments, commercial shopping centers, and residential blocks in one unified tree hierarchy. Segment operational costs, assign caretakers, and manage owner distributions with surgical accuracy.',
    benefits: [
      { title: 'Multi-Tier Hierarchy', desc: 'Organize by Organization > Estate > Building > Wing / Floor > Individual Unit with inherited property policies.' },
      { title: 'Landlord Remittance Accounting', desc: 'Automate commission deduction formulas and generate itemized owner payout disbursement schedules.' },
      { title: 'Zoning & Utility Sub-Metering', desc: 'Track dedicated water meters, electricity tokens, and service charge tariffs per property block.' },
    ],
    technicalSpecs: ['Row-level multi-tenant isolation', 'Granular ownership split equity ratios', 'Customizable property metadata attributes', 'GPS coordinate mapping and boundary polygons'],
    workflow: [
      { step: '01', title: 'Register Property Entity', desc: 'Enter estate name, land registration numbers, and operational ownership structure.' },
      { step: '02', title: 'Map Buildings & Zones', desc: 'Define physical blocks, floors, elevator access zones, and communal amenities.' },
      { step: '03', title: 'Assign Caretaker & Rules', desc: 'Designate on-site staff with mobile caretaker permissions for meter readings and inspections.' },
    ],
  },
  'units-and-estates': {
    slug: 'units-and-estates',
    name: 'Units & Estates Management',
    tagline: 'Precision inventory control, occupancy status, and unit-level sub-metering',
    category: 'Core Operations',
    icon: Layers,
    overview: 'Track every single unit from vacant readiness to active tenancy. Monitor square footage, targeted base rent, deposit requirements, amenity fixtures, and utility meters with instant historical turnover logs.',
    benefits: [
      { title: 'Real-Time Occupancy Radar', desc: 'Instantly visualize occupied, vacant, under-turnover, and reserved units across entire estates.' },
      { title: 'Sub-Meter Utility Billing', desc: 'Log previous and current water/power meter readings to automatically append utility line items to monthly invoices.' },
      { title: 'Unit Inspection Checklists', desc: 'Complete move-in and move-out condition reports with photographic timestamped evidence.' },
    ],
    technicalSpecs: ['Automated vacancy rate telemetry', 'Unit turnover turnaround time tracking', 'Bulk unit CSV configuration import', 'Multi-room co-living & shared unit support'],
    workflow: [
      { step: '01', title: 'Unit Batch Creation', desc: 'Generate 100+ units in seconds with sequential numbering (e.g. A101-A120, B201-B220).' },
      { step: '02', title: 'Configure Rates & Deposit', desc: 'Set base rent, trash fee, security deposit formula, and sub-meter identifiers.' },
      { step: '03', title: 'Live Occupancy Monitoring', desc: 'Monitor rent readiness status and transition seamlessly to lease assignment.' },
    ],
  },
  'tenant-management': {
    slug: 'tenant-management',
    name: 'Tenant Lifecycle & Screening',
    tagline: 'Comprehensive tenant screening, digital KYC, ledger balances, and dispute resolution',
    category: 'Tenancy',
    icon: Users,
    overview: 'Complete digital KYC recordkeeping for every tenant. Maintain national ID records, verified emergency contacts, employment proof, previous landlord references, and automated compliance verification.',
    benefits: [
      { title: 'Digital KYC & Document Storage', desc: 'Securely archive encrypted national IDs, passports, KRA PIN certificates, and company registration forms.' },
      { title: 'Authoritative Individual Ledgers', desc: 'Every tenant has an immutable ledger reflecting billed charges, payments, deposit escrow, and running balance.' },
      { title: 'Dispute & Communication Log', desc: 'Track formal notices, late rent warnings, maintenance requests, and email/SMS audit histories.' },
    ],
    technicalSpecs: ['KDPA 2019 privacy compliance', 'Encrypted PII document storage (AES-256)', 'Automated tenant portal invite tokens', 'Single-click tenant statement PDF generation'],
    workflow: [
      { step: '01', title: 'Tenant Onboarding & KYC', desc: 'Capture applicant details, verify identity documents, and assign to unit.' },
      { step: '02', title: 'Automated Welcome Dispatch', desc: 'System transmits lease agreement, M-Pesa payment instructions, and portal login.' },
      { step: '03', title: 'Continuous Ledger Tracking', desc: 'All rent payments automatically decrement tenant accounts receivable in real time.' },
    ],
  },
  'leases-and-bookings': {
    slug: 'leases-and-bookings',
    name: 'Digital Leases & Bookings',
    tagline: 'Legally enforceable digital agreements, renewal automation, and reservation deposits',
    category: 'Tenancy',
    icon: FileCheck2,
    overview: 'Eliminate expiring lease surprises. Guri24 creates structured digital leases with automated escalation clauses (e.g. 5% annual escalation), fixed-term or periodic renewals, and reservation fee holding accounts.',
    benefits: [
      { title: 'Automated Renewal Workflows', desc: 'Trigger automated renewal negotiation notices 60 and 30 days prior to contract termination.' },
      { title: 'Custom Escalation Schedules', desc: 'Define compound or fixed annual rent increases applied automatically on contract anniversaries.' },
      { title: 'Advance Unit Reservation', desc: 'Accept non-refundable booking fees that temporarily lock inventory and convert into initial deposits.' },
    ],
    technicalSpecs: ['Dynamic PDF lease contract compilation', 'Digital signature timestamp hash', 'Automated lease status state machine', 'Security deposit requirement binding'],
    workflow: [
      { step: '01', title: 'Draft Agreement Terms', desc: 'Select standard template, enter duration, monthly rent, and deposit requirement.' },
      { step: '02', title: 'Digital Execution', desc: 'Send to tenant for electronic review and signature with cryptographic verification.' },
      { step: '03', title: 'Activate Billing Schedule', desc: 'System automatically schedules monthly invoice generation for the lease lifecycle.' },
    ],
  },
  'rent-collection': {
    slug: 'rent-collection',
    name: 'Rent Invoicing & Collections Engine',
    tagline: 'Automated 1st-of-month invoice generation, late fees, and multi-channel billing',
    category: 'Financial Operations',
    icon: DollarSign,
    overview: 'Generate hundreds of itemized invoices in milliseconds on the 1st of every month. Combine base rent, water consumption, power tokens, service charges, and parking fees into one consolidated statement with clear payment barcodes.',
    benefits: [
      { title: 'Batch Invoice Generation', desc: 'Automatically produce and email/SMS monthly invoices across entire estates on scheduled dates.' },
      { title: 'Statutory Late Fee Rules', desc: 'Apply percentage or flat late penalties automatically when rent is unsettled past grace periods.' },
      { title: 'Consolidated Billing Statements', desc: 'Combine rent and variable utility usage into single clear invoices for straightforward tenant payment.' },
    ],
    technicalSpecs: ['Multi-currency support (KES / USD)', 'Configurable grace period rules (e.g. 5th of month)', 'Automated invoice PDF generation', 'Account 1100 AR automatic debit ledger booking'],
    workflow: [
      { step: '01', title: 'Automated Batch Run', desc: 'Engine evaluates active leases and recurring charges on the 1st of each month.' },
      { step: '02', title: 'Notification Dispatch', desc: 'Tenants receive SMS notification with invoice amount and unique payment reference.' },
      { step: '03', title: 'Payment Allocation', desc: 'Incoming funds clear oldest outstanding invoices first (FIFO principle).' },
    ],
  },
  'mpesa-and-payments': {
    slug: 'mpesa-and-payments',
    name: 'M-Pesa Real-Time Reconciliation',
    tagline: 'Instant Safaricom C2B, STK Push, and Paybill/Till automated transaction matching',
    category: 'Financial Operations',
    icon: Smartphone,
    overview: 'The gold standard for Kenyan property financial operations. Zero human intervention: tenant pays via M-Pesa Paybill or Till, our instant payment notification (IPN) webhook matches the unit number, credits the tenant ledger, marks invoices paid, and sends an SMS receipt.',
    benefits: [
      { title: 'Zero Manual Data Entry', desc: 'End the nightmare of manual spreadsheet cross-referencing and fake SMS payment claims.' },
      { title: 'STK Push In-App Checkout', desc: 'Tenants can initiate one-click STK push payments directly from the web portal or mobile notification.' },
      { title: 'Duplicate Transaction Shield', desc: 'Cryptographic receipt validation ensures an M-Pesa transaction code can never be credited twice.' },
    ],
    technicalSpecs: ['Safaricom Daraja API v2 integration', 'Sub-second webhook processing time', 'Idempotent transaction deduplication', 'Automated Account 1010 M-Pesa clearing debit'],
    workflow: [
      { step: '01', title: 'Tenant Makes Payment', desc: 'Tenant enters Paybill / Till with their Unit Code (e.g. "B104") as Account Number.' },
      { step: '02', title: 'Instant IPN Validation', desc: 'Guri24 securely receives and validates the transaction webhook from Safaricom.' },
      { step: '03', title: 'Ledger Post & Receipt', desc: 'Invoice cleared, general ledger credited, and instant SMS confirmation dispatched.' },
    ],
  },
  'bank-and-cash-management': {
    slug: 'bank-and-cash-management',
    name: 'Multi-Bank & Cash Accounting',
    tagline: 'Multi-bank statement OCR imports, petty cash vouchers, and EFT reconciliations',
    category: 'Financial Operations',
    icon: Landmark,
    overview: 'Manage multiple commercial bank accounts (Equity, Co-op, KCB, Stanbic, NCBA) and physical cash offices in one centralized workspace. Import bank statements in CSV/Excel/PDF format and run rule-based reconciliation in seconds.',
    benefits: [
      { title: 'Multi-Bank Segregation', desc: 'Maintain separate ledger accounts for each banking partner and branch with dedicated reconciliations.' },
      { title: 'Petty Cash Voucher Control', desc: 'Enforce dual authorization for cash disbursements with physical signed voucher uploads.' },
      { title: 'Reconciliation Exception Queues', desc: 'Flag bank fees, unexplained credits, or missing references into a structured resolution queue.' },
    ],
    technicalSpecs: ['Automated bank statement CSV/Excel parser', 'Account 1020-1090 bank sub-ledgers', 'Audit-ready monthly bank reconciliation reports', 'Dual-control petty cash approvals'],
    workflow: [
      { step: '01', title: 'Import Bank Statement', desc: 'Upload statement file downloaded directly from internet banking portal.' },
      { step: '02', title: 'Automated Rule Matching', desc: 'Engine matches bank credits against tenant invoices and debits against vendor bills.' },
      { step: '03', title: 'Sign Off Reconciliation', desc: 'Produce formal monthly reconciliation statement balancing bank vs. book balance.' },
    ],
  },
  'financial-management': {
    slug: 'financial-management',
    name: 'Double-Entry General Ledger',
    tagline: 'Institutional chart of accounts, journal entries, trial balance, and financial statements',
    category: 'Financial Operations',
    icon: Scale,
    overview: 'Guri24 is not a lightweight tracker; it is an authoritative double-entry general ledger. Every operational transaction satisfies the mathematical invariant Debit == Credit, providing certified accounting integrity.',
    benefits: [
      { title: 'Customizable Chart of Accounts', desc: 'Standard 4-digit accounting structure (Assets 1000s, Liabilities 2000s, Equity 3000s, Revenue 4000s, Expenses 5000s).' },
      { title: 'One-Click Financial Statements', desc: 'Generate Trial Balance, Profit & Loss (Income Statement), Balance Sheet, and Cash Flow on demand.' },
      { title: 'Manual & Adjusting Journals', desc: 'Post depreciation, accruals, prepayments, and bad debt write-offs with audit justifications.' },
    ],
    technicalSpecs: ['Double-entry balance check enforced at DB transaction level', 'Real-time closing periods with lock flags', 'Immutable audit trail for every journal line', 'IFRS and GAAP compliant reporting'],
    workflow: [
      { step: '01', title: 'Operational Event Triggers GL', desc: 'Billing, collections, or vendor expenses generate balancing journal entries.' },
      { step: '02', title: 'Real-Time Ledger Rollup', desc: 'Account balances update instantly without requiring batch night-time processing.' },
      { step: '03', title: 'Export Audited Reports', desc: 'Download formal trial balances and financial statements for external auditor review.' },
    ],
  },
  maintenance: {
    slug: 'maintenance',
    name: 'Maintenance & Work Orders',
    tagline: 'Tenant ticket dispatch, vendor quotes, budget authorizations, and cost tracking',
    category: 'Facilities',
    icon: Wrench,
    overview: 'Streamline property repairs from initial tenant ticket to verified contractor settlement. Keep tenants updated, enforce manager budget authorization gates, and automatically capitalize or expense repair costs in the general ledger.',
    benefits: [
      { title: 'Tenant Photo & Video Tickets', desc: 'Tenants submit repair tickets with photos and description directly from their mobile portal.' },
      { title: 'Vendor Quotation Comparison', desc: 'Request bids from vetted electricians, plumbers, and painters before issuing work orders.' },
      { title: 'Direct Expense Ledger Posting', desc: 'Approved vendor payments post directly to Account 5100 (Property Repairs & Maintenance).' },
    ],
    technicalSpecs: ['Configurable approval thresholds by role', 'SLA ticket countdown timers', 'Vendor compliance & insurance document tracking', 'Unit-level maintenance cost history'],
    workflow: [
      { step: '01', title: 'Ticket Submission', desc: 'Tenant or caretaker logs issue with priority level and photos.' },
      { step: '02', title: 'Work Order & Quote', desc: 'Property manager approves job and assigns to preferred service provider.' },
      { step: '03', title: 'Sign-Off & Settlement', desc: 'Tenant verifies repair, invoice approved, and payment disbursed with GL entry.' },
    ],
  },
  'documents-and-ocr': {
    slug: 'documents-and-ocr',
    name: 'OCR Document Intelligence',
    tagline: 'AI-powered document extraction for paper leases, utility bills, and bank statements',
    category: 'Automation',
    icon: ScanLine,
    overview: 'Eliminate manual data entry with our purpose-built OCR pipeline. Upload scanned tenancy contracts, utility bills (Kenya Power, Nairobi Water), or physical bank pay-in slips, and our AI automatically extracts structured entities.',
    benefits: [
      { title: 'Scanned Lease Extraction', desc: 'Instantly pull tenant names, ID numbers, rent amounts, and start dates from legacy paper contracts.' },
      { title: 'Utility Bill Digitization', desc: 'Extract account numbers, meter consumption units, and billing periods from water/electricity bills.' },
      { title: 'Encrypted Digital Vault', desc: 'All original uploaded documents are encrypted and linked directly to corresponding database records.' },
    ],
    technicalSpecs: ['Python computer vision & OCR pipeline', 'Multi-format support (PDF, JPEG, PNG, TIFF)', 'Field-level confidence scoring', 'Human-in-the-loop review interface'],
    workflow: [
      { step: '01', title: 'Upload Document Scan', desc: 'Drag and drop single or multi-page PDF documents into the OCR portal.' },
      { step: '02', title: 'Automated Field Extraction', desc: 'AI engine parses key entities, amounts, reference codes, and dates.' },
      { step: '03', title: 'One-Click Record Creation', desc: 'Review extracted data side-by-side with original document and commit to database.' },
    ],
  },
  'analytics-and-reporting': {
    slug: 'analytics-and-reporting',
    name: 'Analytics & Executive Intelligence',
    tagline: 'Real-time Net Operating Income (NOI), aging arrears, and portfolio yield metrics',
    category: 'Intelligence',
    icon: BarChart3,
    overview: 'Make data-backed investment and operational decisions. Analyze portfolio collection efficiency, track 30/60/90+ day accounts receivable aging, monitor maintenance cost per square foot, and forecast annual rental yields.',
    benefits: [
      { title: 'Live Net Operating Income (NOI)', desc: 'Track gross operating income minus operating expenses in real time across any date range.' },
      { title: 'Accounts Receivable Aging Matrix', desc: 'Categorize unpaid rent by 0-30, 31-60, 61-90, and 90+ days with automated escalation flags.' },
      { title: 'Executive PDF & Excel Exports', desc: 'Generate presentation-ready executive board decks and rent rolls with one click.' },
    ],
    technicalSpecs: ['Interactive SVG chart rendering', 'Filtered multi-property comparative analytics', 'Historical collection trend regressions', 'CSV and formatted Excel workbook exports'],
    workflow: [
      { step: '01', title: 'Select Filter & Period', desc: 'Filter by entire portfolio, individual estate, or specific building.' },
      { step: '02', title: 'Analyze Yield & Aging', desc: 'Inspect collection efficiency, occupancy rates, and delinquent tenant accounts.' },
      { step: '03', title: 'Export Executive Pack', desc: 'Download comprehensive financial intelligence pack for stakeholders and owners.' },
    ],
  },
  'ai-assistant': {
    slug: 'ai-assistant',
    name: 'Guri24 AI Property Assistant',
    tagline: 'Context-aware intelligence for financial diagnostics, lease queries, and drafting',
    category: 'Intelligence',
    icon: Bot,
    overview: 'Your 24/7 financial and operational copilot. Ask complex natural language questions about your portfolio, draft legal tenancy notice letters, diagnose sudden collection dips, and receive predictive maintenance alerts.',
    benefits: [
      { title: 'Natural Language Portfolio Queries', desc: 'Ask: "Which units in Kilimani Estate are behind on rent by over 2 months?" and receive immediate tables.' },
      { title: 'Automated Notice Drafting', desc: 'Draft legally compliant rent review notices, eviction warnings, and maintenance updates in seconds.' },
      { title: 'Predictive Arrears Warning', desc: 'Identify tenants displaying delayed payment patterns before they enter serious delinquency.' },
    ],
    technicalSpecs: ['RAG architecture grounded in your tenant & GL database', 'Zero hallucination guardrails for financial figures', 'Contextual tenant memory & conversation history', 'Role-scoped response permissions'],
    workflow: [
      { step: '01', title: 'Open Assistant Workspace', desc: 'Launch the AI copilot interface from any screen in the RMS.' },
      { step: '02', title: 'Prompt in Plain English', desc: 'Type inquiries about cash flow, arrears, lease renewals, or tenant communications.' },
      { step: '03', title: 'Take Action Directly', desc: 'Execute recommended actions (send reminder, export report, adjust bill) with one click.' },
    ],
  },
  'tenant-portal': {
    slug: 'tenant-portal',
    name: 'Self-Service Tenant Portal',
    tagline: 'Mobile-responsive tenant workspace for payments, statements, and repair requests',
    category: 'Tenancy',
    icon: UserCheck,
    overview: 'Give your tenants a polished digital home. Tenants can securely log in to review their lease terms, download itemized monthly invoices, initiate instant M-Pesa payments, and track maintenance tickets in real time.',
    benefits: [
      { title: '24/7 Self-Service Access', desc: 'Tenants download payment receipts and historical statements without calling management.' },
      { title: 'Frictionless M-Pesa Checkout', desc: 'Single-tap STK Push payments from mobile devices with zero account number typing errors.' },
      { title: 'Live Ticket Status Tracking', desc: 'Tenants receive progress alerts when their maintenance issue is scheduled and completed.' },
    ],
    technicalSpecs: ['Progressive Web App (PWA) compatible', 'Passwordless magic link or SMS OTP authentication', 'Multi-tenant branded organization skin', 'WCAG 2.1 AA accessible interface'],
    workflow: [
      { step: '01', title: 'Tenant Receives Invite', desc: 'SMS or email invitation dispatched automatically upon lease signing.' },
      { step: '02', title: 'Access Dashboard', desc: 'Tenant views current balance, payment instructions, and announcement notices.' },
      { step: '03', title: 'Direct Engagement', desc: 'Pay rent via M-Pesa, log repair requests, or download tax-compliant receipts.' },
    ],
  },
  notifications: {
    slug: 'notifications',
    name: 'Automated Communications & Alerts',
    tagline: 'Multi-channel SMS, email, and WhatsApp automated dispatch schedules',
    category: 'Automation',
    icon: Bell,
    overview: 'Ensure no invoice, receipt, or important notice is ever missed. Configure trigger-based automated notifications that keep tenants, landlords, and staff informed without lifting a finger.',
    benefits: [
      { title: 'Trigger-Based Dispatch', desc: 'Send automated alerts upon invoice generation, payment confirmation, lease renewal, and late rent.' },
      { title: 'Multi-Channel Reach', desc: 'Support for high-deliverability SMS, branded HTML email, and WhatsApp business notifications.' },
      { title: 'Custom Template Builder', desc: 'Personalize messages with dynamic placeholders: {{tenant_name}}, {{unit_number}}, {{balance}}, {{due_date}}.' },
    ],
    technicalSpecs: ['Direct telecom SMS gateway integration', 'Delivery receipt telemetry and failure retry queue', 'Custom sender ID branding support', 'Unsubscribe and communication preference compliance'],
    workflow: [
      { step: '01', title: 'Choose Notification Trigger', desc: 'Select trigger event (e.g. "Invoice Generated", "Rent Overdue by 5 Days").' },
      { step: '02', title: 'Customize Template', desc: 'Personalize email/SMS wording with organization branding and variables.' },
      { step: '03', title: 'Monitor Delivery Logs', desc: 'Track sent, delivered, opened, and bounced message telemetry in real time.' },
    ],
  },
};

export const FeatureDetailPage: React.FC = () => {
  const { pathname } = useLocation();
  const slug = pathname.split('/features/')[1] || '';
  const feature = FEATURES_CATALOG[slug];

  if (!feature) {
    return (
      <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '16px' }}>Feature Not Found</h2>
        <p style={{ color: BRAND_TOKENS.colors.slateSubtle, marginBottom: '24px' }}>The requested feature module does not exist or has moved.</p>
        <Link to="/features" style={{ padding: '12px 24px', backgroundColor: BRAND_TOKENS.colors.primaryBlue, color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>
          Browse All Features
        </Link>
      </div>
    );
  }

  const Icon = feature.icon;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: '48px 32px 100px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        fontFamily: BRAND_TOKENS.fonts.sans,
      }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: BRAND_TOKENS.colors.slateSubtle, textDecoration: 'none' }}>Home</Link>
          <span style={{ color: BRAND_TOKENS.colors.slateBorder }}>/</span>
          <Link to="/features" style={{ color: BRAND_TOKENS.colors.slateSubtle, textDecoration: 'none' }}>Features</Link>
          <span style={{ color: BRAND_TOKENS.colors.slateBorder }}>/</span>
          <span style={{ color: BRAND_TOKENS.colors.darkNavy, fontWeight: 600 }}>{feature.name}</span>
        </div>

        {/* Hero Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            padding: '56px 48px',
            marginBottom: '48px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: BRAND_TOKENS.colors.primaryTint,
                color: BRAND_TOKENS.colors.primaryBlue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: BRAND_TOKENS.colors.primaryBlue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {feature.category}
              </span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: '2px' }}>
                {feature.name}
              </h1>
            </div>
          </div>

          <p style={{ fontSize: '1.25rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6, marginBottom: '28px', maxWidth: '820px' }}>
            {feature.tagline}
          </p>

          <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.7, maxWidth: '880px', marginBottom: '36px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
            {feature.overview}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                borderRadius: '12px',
                backgroundColor: BRAND_TOKENS.colors.primaryBlue,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.96rem',
                textDecoration: 'none',
              }}
            >
              Start Free Trial with {feature.name} <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                borderRadius: '12px',
                backgroundColor: BRAND_TOKENS.colors.bgCanvas,
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                color: BRAND_TOKENS.colors.darkNavy,
                fontWeight: 600,
                fontSize: '0.96rem',
                textDecoration: 'none',
              }}
            >
              Request Feature Demo
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '28px' }}>
            Core Capabilities & Value Delivered
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {feature.benefits.map((b, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  padding: '32px 28px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <CheckCircle2 size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Progression */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            padding: '48px',
            marginBottom: '56px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '32px' }}>
            How It Works In Practice
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            {feature.workflow.map((w) => (
              <div key={w.step} style={{ position: 'relative' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: BRAND_TOKENS.colors.primaryBlue, opacity: 0.35, marginBottom: '8px' }}>
                  {w.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>
                  {w.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '36px 40px',
            marginBottom: '56px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color={BRAND_TOKENS.colors.primaryBlue} /> Technical & Architectural Invariants
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {feature.technicalSpecs.map((spec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: BRAND_TOKENS.colors.primaryBlue }} />
                {spec}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ backgroundColor: BRAND_TOKENS.colors.darkNavy, borderRadius: '24px', padding: '48px', textAlign: 'center', color: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
            Ready to integrate {feature.name} into your operations?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Set up your organization in minutes and experience modern property management.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 26px',
              borderRadius: '12px',
              backgroundColor: BRAND_TOKENS.colors.primaryBlue,
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.96rem',
              textDecoration: 'none',
            }}
          >
            Start 14-Day Free Trial <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const FeaturesHubPage: React.FC = () => {
  const categories = ['All', 'Core Operations', 'Tenancy', 'Financial Operations', 'Facilities', 'Automation', 'Intelligence'];
  const [selectedCat, setSelectedCat] = React.useState('All');

  const filtered = selectedCat === 'All'
    ? Object.values(FEATURES_CATALOG)
    : Object.values(FEATURES_CATALOG).filter((f) => f.category === selectedCat);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: BRAND_TOKENS.fonts.sans,
        color: '#0F172A',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* =========================================================================
          SECTION 1: ROUNDED ARCHITECTURAL HERO CARD
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '12px auto 80px',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            minHeight: '560px',
            backgroundImage: 'url(/hero-apex-architecture.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 46%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '64px 54px',
            boxSizing: 'border-box',
            boxShadow: '0 25px 60px -15px rgba(2, 20, 41, 0.25)',
          }}
        >
          {/* Dark Vignette Overlay on the Left for Readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(2, 20, 41, 0.88) 0%, rgba(2, 20, 41, 0.72) 42%, rgba(2, 20, 41, 0.2) 78%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '16px',
              }}
            >
              <span>07 &bull; MODULE CATALOG</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: '#FFFFFF',
                marginBottom: '18px',
              }}
            >
              Engineered for Authoritative
              <br />
              Property Control
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
                color: 'rgba(255, 255, 255, 0.90)',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '560px',
              }}
            >
              Explore all 14 core modules designed to eliminate manual paper receipts, spreadsheet errors, and unallocated bank transfers.
            </p>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: selectedCat === cat ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.25)',
                    backgroundColor: selectedCat === cat ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)',
                    color: selectedCat === cat ? '#021429' : 'rgba(255, 255, 255, 0.88)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURE GRID
          ========================================================================= */}
      <section
        style={{
          padding: '88px 48px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {filtered.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.slug}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px -6px rgba(2, 20, 41, 0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px -8px rgba(2, 20, 41, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(2, 20, 41, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '14px',
                          backgroundColor: '#EFF5FF',
                          color: '#0057FC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', backgroundColor: '#F1F5F9', padding: '4px 12px', borderRadius: '999px' }}>
                        {feat.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#021429', marginBottom: '8px' }}>
                      {feat.name}
                    </h3>
                    <p style={{ fontSize: '0.90rem', color: '#64748B', lineHeight: 1.55, marginBottom: '20px', minHeight: '44px' }}>
                      {feat.tagline}
                    </p>
                  </div>

                  <div>
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#021429', marginBottom: '6px' }}>Key Architecture:</div>
                      <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                        {feat.benefits[0]?.desc}
                      </div>
                    </div>

                    <Link
                      to={`/features/${feat.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '11px',
                        borderRadius: '999px',
                        backgroundColor: '#FAFBFD',
                        border: '1px solid #CBD5E1',
                        color: '#021429',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>View Module Details</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
