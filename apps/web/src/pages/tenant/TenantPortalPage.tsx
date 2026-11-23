import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  FileText,
  Wrench,
  FolderLock,
  Bell,
  MessageSquare,
  HelpCircle,
  User,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Download,
  Upload,
  Calendar,
  Home,
  Shield,
  Smartphone,
  Search,
  Plus,
  Send,
  Eye,
  Check,
  ChevronDown,
  Info,
  RefreshCw,
} from 'lucide-react';
import { formatNairobiDate } from '../../lib/formatters';

interface TenantPortalPageProps {
  view:
    | 'dashboard'
    | 'payments'
    | 'lease'
    | 'maintenance'
    | 'documents'
    | 'notifications'
    | 'messages'
    | 'support'
    | 'profile'
    | 'settings';
}

export const TenantPortalPage: React.FC<TenantPortalPageProps> = ({ view }) => {
  // Mock Tenant State with Kenya Real Estate context
  const [tenantData, setTenantData] = useState({
    id: 't-1082',
    name: 'David Maina',
    phone: '+254 712 345 678',
    email: 'david.maina@example.com',
    idNumber: 'ID-29481032',
    property: 'Riverside Heights Apartments',
    propertyAddress: 'Riverside Drive, Nairobi, Kenya',
    unit: 'Unit B-402',
    unitType: '2-Bedroom Master Ensuite',
    parkingSlot: 'Bay P-14',
    leaseStatus: 'ACTIVE',
    leaseStart: '2025-11-01',
    leaseEnd: '2026-10-31',
    monthlyRent: 45000,
    serviceCharge: 3500,
    depositHeld: 45000,
    nextDueDate: '2026-12-05',
    outstandingBalance: 0,
    paybillNumber: '247247',
    accountNumber: 'RIV-B402',
  });

  // Maintenance tickets state
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    {
      id: 'MNT-8921',
      title: 'Master bathroom mixer tap leaking',
      category: 'Plumbing',
      urgency: 'Medium',
      status: 'IN_PROGRESS',
      reportedDate: '2026-11-20',
      technician: 'John Kamau (Master Plumber)',
      notes: 'Parts purchased. Scheduled repair for today at 2:00 PM.',
    },
    {
      id: 'MNT-8410',
      title: 'Balcony drainage clearing',
      category: 'Maintenance',
      urgency: 'Low',
      status: 'RESOLVED',
      reportedDate: '2026-10-14',
      technician: 'Estate Facilities Team',
      notes: 'Debris cleared from rainwater drain pipe. Completed.',
    },
  ]);

  // Payment receipts state
  const [payments, setPayments] = useState([
    {
      id: 'REC-2026-1102',
      receiptNo: 'RCP-89214',
      date: '2026-11-03',
      amount: 48500,
      breakdown: 'KES 45,000 Rent + KES 3,500 Service Charge',
      channel: 'M-Pesa Daraja C2B V2',
      reference: 'QJ92K81N2P',
      status: 'VERIFIED',
    },
    {
      id: 'REC-2026-1002',
      receiptNo: 'RCP-87192',
      date: '2026-10-02',
      amount: 48500,
      breakdown: 'KES 45,000 Rent + KES 3,500 Service Charge',
      channel: 'M-Pesa Daraja C2B V2',
      reference: 'QI81M39X4A',
      status: 'VERIFIED',
    },
    {
      id: 'REC-2026-0902',
      receiptNo: 'RCP-85210',
      date: '2026-09-04',
      amount: 48500,
      breakdown: 'KES 45,000 Rent + KES 3,500 Service Charge',
      channel: 'M-Pesa Daraja C2B V2',
      reference: 'QH72P91V2Z',
      status: 'VERIFIED',
    },
  ]);

  // Document inventory
  const documents = [
    {
      id: 'doc-1',
      name: 'Counter-Signed Residential Lease Agreement (2025-2026)',
      category: 'Lease Agreement',
      date: '2025-11-01',
      size: '2.4 MB',
      type: 'PDF',
    },
    {
      id: 'doc-2',
      name: 'Unit Move-In Schedule & Condition Inspection Report',
      category: 'Inspection',
      date: '2025-11-01',
      size: '4.8 MB',
      type: 'PDF',
    },
    {
      id: 'doc-3',
      name: 'Official Security Deposit Receipt (Account 2100)',
      category: 'Receipt',
      date: '2025-10-28',
      size: '412 KB',
      type: 'PDF',
    },
    {
      id: 'doc-4',
      name: 'Riverside Heights Estate Bylaws & Resident Handbook',
      category: 'Estate Rules',
      date: '2025-11-01',
      size: '1.1 MB',
      type: 'PDF',
    },
  ];

  // Modals & Interactive Form States
  const [showPayModal, setShowPayModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [paymentEvidenceNotice, setPaymentEvidenceNotice] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Verification Search State
  const [searchRef, setSearchRef] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  // New Maintenance Form
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: 'Plumbing',
    urgency: 'Medium',
    description: '',
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
  });

  // Handle Maintenance Submit
  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title.trim()) return;

    const created = {
      id: `MNT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicket.title,
      category: newTicket.category,
      urgency: newTicket.urgency,
      status: 'SUBMITTED',
      reportedDate: new Date().toISOString().split('T')[0],
      technician: 'Pending Assignment',
      notes: 'Received by management desk. Property officer is reviewing technician availability.',
    };

    setMaintenanceTickets([created, ...maintenanceTickets]);
    setShowMaintenanceModal(false);
    setNewTicket({
      title: '',
      category: 'Plumbing',
      urgency: 'Medium',
      description: '',
      preferredTime: 'Morning (9:00 AM - 12:00 PM)',
    });
    setFeedbackMessage('Maintenance request submitted successfully! Ticket ID: ' + created.id);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  // Handle Receipt Search
  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchRef.trim().toUpperCase();
    if (!query) return;

    const found = payments.find((p) => p.reference.toUpperCase() === query);
    if (found) {
      setSearchResult(`Found verified Daraja transaction: ${found.reference} for KES ${found.amount.toLocaleString()} on ${found.date}. Reconciled to Account 4000 (Rental Revenue).`);
    } else {
      setSearchResult(`Reference ${query} has not yet been processed by Safaricom Daraja C2B V2 webhook. Please allow up to 2 minutes or contact the management office.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Feedback Banner */}
      {feedbackMessage && (
        <div
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: TENANT DASHBOARD
      ========================================================================== */}
      {view === 'dashboard' && (
        <>
          {/* Welcome & Tenancy Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 10px 25px rgba(30, 27, 75, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                <Home size={12} />
                <span>{tenantData.property}</span>
                <span>&bull;</span>
                <span>{tenantData.unit}</span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                Welcome back, {tenantData.name}
              </h1>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '640px', lineHeight: 1.5 }}>
                Your tenancy is in good standing. Your next scheduled payment of{' '}
                <strong style={{ color: '#ffffff' }}>KES {(tenantData.monthlyRent + tenantData.serviceCharge).toLocaleString()}</strong> is due on{' '}
                <strong>{tenantData.nextDueDate}</strong>.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowPayModal(true)}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <CreditCard size={16} />
                  <span>Pay Rent via M-Pesa</span>
                </button>
                <button
                  onClick={() => setShowMaintenanceModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Wrench size={16} />
                  <span>Report Maintenance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Metric 1: Verified Balance */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Outstanding Balance
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                KES {tenantData.outstandingBalance.toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#059669' }}>
                <CheckCircle2 size={13} />
                <span>Zero arrears &bull; All accounts settled</span>
              </div>
            </div>

            {/* Metric 2: Monthly Rent */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Monthly Obligations
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                KES {(tenantData.monthlyRent + tenantData.serviceCharge).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                Rent KES 45,000 + SC KES 3,500
              </div>
            </div>

            {/* Metric 3: Active Lease */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Lease Agreement
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4f46e5', marginTop: '6px' }}>
                {tenantData.leaseStatus}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                Expires {tenantData.leaseEnd} (11 months)
              </div>
            </div>

            {/* Metric 4: Deposit Held */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Security Deposit Held
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                KES {tenantData.depositHeld.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                Segregated in Trust Account 2100
              </div>
            </div>
          </div>

          {/* Building Announcement & Open Tickets */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Announcement Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Bell size={18} style={{ color: '#0284c7' }} />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>Estate Announcements</h3>
              </div>
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1' }}>
                    Elevator Servicing & Water Tank Cleaning
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#0284c7' }}>This Saturday</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                  Routine bi-annual rooftop water tank pressure cleaning and elevator servicing will occur between 9:00 AM and 1:00 PM. Water pressure may temporarily fluctuate.
                </p>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Questions? Direct message the caretaker via the Messages tab.
              </div>
            </div>

            {/* Active Maintenance Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={18} style={{ color: '#4f46e5' }} />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>Active Maintenance</h3>
                </div>
                <Link to="/portal/maintenance" style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                  View All &rarr;
                </Link>
              </div>

              {maintenanceTickets.slice(0, 1).map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{t.title}</span>
                    <span
                      style={{
                        background: '#e0e7ff',
                        color: '#4338ca',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Ticket {t.id} &bull; Technician: {t.technician}
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.78rem', color: '#475569' }}>
                    {t.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Receipts Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent Verified Receipts</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  All receipts are cryptographically verified by Safaricom Daraja C2B V2 and posted to double-entry ledger.
                </p>
              </div>
              <Link to="/portal/payments" style={{ fontSize: '0.82rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                Full Ledger History &rarr;
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '8px 12px' }}>Receipt #</th>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                    <th style={{ padding: '8px 12px' }}>Amount</th>
                    <th style={{ padding: '8px 12px' }}>Channel</th>
                    <th style={{ padding: '8px 12px' }}>M-Pesa Trans ID</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#1e293b' }}>{p.receiptNo}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{p.date}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                        KES {p.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{p.channel}</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>
                        {p.reference}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                          }}
                        >
                          VERIFIED
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setFeedbackMessage(`Downloading official PDF receipt ${p.receiptNo}...`);
                            setTimeout(() => setFeedbackMessage(null), 3000);
                          }}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: '#334155',
                          }}
                        >
                          PDF Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: RENT & PAYMENTS
      ========================================================================== */}
      {view === 'payments' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Rent & Payment Operations
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Reconciled in real time via Safaricom Daraja C2B V2. No manual delays or spreadsheet errors.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowPayModal(true)}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Smartphone size={16} />
                <span>M-Pesa Payment Guide</span>
              </button>
              <button
                onClick={() => setShowDiscrepancyModal(true)}
                style={{
                  background: '#ffffff',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Report Discrepancy
              </button>
            </div>
          </div>

          {/* Payment Instructions Card */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, marginBottom: '8px' }}>
                <Smartphone size={18} />
                <span>Safaricom M-Pesa Daraja C2B V2 Instructions</span>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#14532d', lineHeight: 1.5 }}>
                Follow these exact steps from your Safaricom Sim Toolkit or M-Pesa App. Transactions are automatically verified and cleared within seconds.
              </p>
              <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Select <strong>Pay Bill</strong> from Lipa na M-Pesa</li>
                <li>Enter Business No: <strong>{tenantData.paybillNumber}</strong></li>
                <li>Enter Account No: <strong>{tenantData.accountNumber}</strong></li>
                <li>Enter Amount: <strong>KES {(tenantData.monthlyRent + tenantData.serviceCharge).toLocaleString()}</strong></li>
                <li>Enter your M-Pesa PIN and confirm</li>
              </ol>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                Daraja C2B V2 Integration Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Live & Instant Reconcile</span>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                *Note: STK Push is disabled on tenant portals for regulatory compliance. Only confirmed C2B webhook callbacks credit your account.
              </p>
            </div>
          </div>

          {/* Reference Lookup Tool */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 8px 0' }}>
              Lookup M-Pesa Receipt / Transaction Status
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#64748b' }}>
              Paid recently? Enter your Safaricom receipt code (e.g., QJ92K81N2P) to verify posting status against our financial ledger.
            </p>
            <form onSubmit={handleVerifySearch} style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
              <input
                type="text"
                placeholder="e.g. QJ92K81N2P"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Search size={15} />
                <span>Verify</span>
              </button>
            </form>
            {searchResult && (
              <div
                style={{
                  marginTop: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  color: '#334155',
                }}
              >
                {searchResult}
              </div>
            )}
          </div>

          {/* All Receipts Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              Complete Payment History & Receipts
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '8px 12px' }}>Receipt #</th>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                    <th style={{ padding: '8px 12px' }}>Description</th>
                    <th style={{ padding: '8px 12px' }}>Amount</th>
                    <th style={{ padding: '8px 12px' }}>Channel</th>
                    <th style={{ padding: '8px 12px' }}>Reference</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{p.receiptNo}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{p.date}</td>
                      <td style={{ padding: '12px', color: '#334155' }}>{p.breakdown}</td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>KES {p.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{p.channel}</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>
                        {p.reference}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                          }}
                        >
                          VERIFIED
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setFeedbackMessage(`Downloading official tax receipt ${p.receiptNo}...`);
                            setTimeout(() => setFeedbackMessage(null), 3000);
                          }}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 3: MY LEASE
      ========================================================================== */}
      {view === 'lease' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Lease & Tenancy Agreement
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Active binding tenancy contract for {tenantData.unit} at {tenantData.property}.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowRenewalModal(true)}
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Request Lease Renewal
              </button>
              <button
                onClick={() => setShowVacateModal(true)}
                style={{
                  background: '#ffffff',
                  color: '#ef4444',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Notice to Vacate
              </button>
            </div>
          </div>

          {/* Active Lease Overview Grid */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Leased Premises
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                {tenantData.property}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                {tenantData.unit} &bull; {tenantData.unitType}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Assigned Parking: {tenantData.parkingSlot}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Tenancy Period
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                12 Months Fixed
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                From: <strong>{tenantData.leaseStart}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                To: <strong>{tenantData.leaseEnd}</strong>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Monthly Rental Fee
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                KES {tenantData.monthlyRent.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                Service Charge: KES {tenantData.serviceCharge.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
                Due on or before 5th of every month
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Security Deposit
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                KES {tenantData.depositHeld.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                Account 2100 &bull; Escrow Protection
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Refundable upon move-out clearance
              </div>
            </div>
          </div>

          {/* Key Tenancy Terms & Clauses */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Summary of Tenancy Terms</h3>
              <button
                onClick={() => {
                  setFeedbackMessage('Downloading official PDF lease contract...');
                  setTimeout(() => setFeedbackMessage(null), 3000);
                }}
                style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} />
                <span>Download Counter-Signed PDF</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem', color: '#334155' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <strong>1. Payment Grace Period & Late Fees:</strong> Rent is payable on or before the 5th day of each calendar month. Payments made after the 10th day incur a 5% statutory late charge.
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <strong>2. Notice to Vacate:</strong> Either party may terminate the tenancy upon giving one (1) full calendar month notice in writing or payment of one month rent in lieu thereof.
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <strong>3. Subletting & Alterations:</strong> The tenant shall not sublet, assign, or make structural alterations to the premises without prior written consent of the Landlord.
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <strong>4. Utilities & Metering:</strong> Electricity is metered via KPLC Prepaid Token. Water is metered via building sub-meter and billed monthly in arrears on your statement.
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 4: MAINTENANCE REQUESTS
      ========================================================================== */}
      {view === 'maintenance' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Maintenance Requests & Repairs
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Report unit repairs, track assigned technicians, and confirm work completion.
              </p>
            </div>
            <button
              onClick={() => setShowMaintenanceModal(true)}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              <span>New Request</span>
            </button>
          </div>

          {/* Status Pipeline Visualization */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflowX: 'auto',
              gap: '12px',
            }}
          >
            {['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((step, idx) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: idx <= 3 ? '#4f46e5' : '#e2e8f0',
                    color: idx <= 3 ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: idx <= 3 ? 700 : 500, color: idx <= 3 ? '#1e293b' : '#94a3b8' }}>
                  {step}
                </span>
                {idx < 5 && <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>&rarr;</span>}
              </div>
            ))}
          </div>

          {/* Tickets List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {maintenanceTickets.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace' }}>
                      {t.id}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{t.title}</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: t.urgency === 'High' ? '#fef2f2' : '#fefce8',
                        color: t.urgency === 'High' ? '#ef4444' : '#ca8a04',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      Urgency: {t.urgency}
                    </span>
                    <span
                      style={{
                        background: t.status === 'RESOLVED' ? '#ecfdf5' : '#eff6ff',
                        color: t.status === 'RESOLVED' ? '#059669' : '#2563eb',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', margin: '14px 0', fontSize: '0.82rem', color: '#64748b' }}>
                  <div>
                    Category: <strong style={{ color: '#334155' }}>{t.category}</strong>
                  </div>
                  <div>
                    Reported: <strong style={{ color: '#334155' }}>{t.reportedDate}</strong>
                  </div>
                  <div>
                    Assigned: <strong style={{ color: '#334155' }}>{t.technician}</strong>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', fontSize: '0.82rem', color: '#334155' }}>
                  <strong>Progress Notes:</strong> {t.notes}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                  {t.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => {
                        setMaintenanceTickets(
                          maintenanceTickets.map((item) =>
                            item.id === t.id ? { ...item, status: 'RESOLVED', notes: 'Confirmed resolved by tenant.' } : item
                          )
                        );
                        setFeedbackMessage(`Ticket ${t.id} marked as resolved!`);
                        setTimeout(() => setFeedbackMessage(null), 4000);
                      }}
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Confirm Issue Resolved
                    </button>
                  )}
                  {t.status === 'RESOLVED' && (
                    <button
                      onClick={() => {
                        setMaintenanceTickets(
                          maintenanceTickets.map((item) =>
                            item.id === t.id ? { ...item, status: 'IN_PROGRESS', notes: 'Reopened by tenant.' } : item
                          )
                        );
                        setFeedbackMessage(`Ticket ${t.id} reopened.`);
                        setTimeout(() => setFeedbackMessage(null), 4000);
                      }}
                      style={{
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 5: MY DOCUMENTS
      ========================================================================== */}
      {view === 'documents' && (
        <>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Authorized Tenancy Documents
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Protected document vault containing official contracts, tax receipts, and inspection reports.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: '#e0e7ff',
                          color: '#4338ca',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {doc.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.size}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>Issued: {doc.date}</div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setFeedbackMessage(`Opening ${doc.name}...`);
                        setTimeout(() => setFeedbackMessage(null), 3000);
                      }}
                      style={{
                        flex: 1,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#334155',
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setFeedbackMessage(`Downloading ${doc.name}...`);
                        setTimeout(() => setFeedbackMessage(null), 3000);
                      }}
                      style={{
                        flex: 1,
                        background: '#4f46e5',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 6: NOTIFICATIONS
      ========================================================================== */}
      {view === 'notifications' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Tenancy Notifications
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Important payment receipts, service alerts, and lease updates.
              </p>
            </div>
            <button
              onClick={() => {
                setFeedbackMessage('All notifications marked as read.');
                setTimeout(() => setFeedbackMessage(null), 3000);
              }}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Mark all as read
            </button>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {[
              {
                id: 1,
                title: 'Daraja C2B Payment Confirmed',
                body: 'Your payment of KES 48,500.00 via M-Pesa reference QJ92K81N2P has been reconciled. Receipt RCP-89214 is ready.',
                time: 'Yesterday, 10:14 AM',
                category: 'FINANCE',
                unread: false,
              },
              {
                id: 2,
                title: 'Technician Assigned to MNT-8921',
                body: 'Plumber John Kamau has been assigned to your ticket for Master Bathroom tap leakage. Arriving today around 2:00 PM.',
                time: 'Today, 8:30 AM',
                category: 'MAINTENANCE',
                unread: true,
              },
              {
                id: 3,
                title: 'Rooftop Water Tank Cleaning',
                body: 'Notice: Bi-annual water tank cleaning this Saturday 9am-1pm. Please store drinking water in advance.',
                time: '2 days ago',
                category: 'ESTATE',
                unread: true,
              },
            ].map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: n.unread ? '#f0fdf4' : '#f8fafc',
                  border: n.unread ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{n.title}</span>
                    {n.unread && (
                      <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#334155', lineHeight: 1.4 }}>{n.body}</p>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 7: MESSAGES & SUPPORT
      ========================================================================== */}
      {view === 'messages' && (
        <>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Property Management Desk
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Direct encrypted communication channel with the Riverside Heights management team.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              height: '520px',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Estate Caretaker & Management Office</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Average response time: &lt; 15 mins</div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', background: '#f0f9ff', padding: '3px 8px', borderRadius: '4px' }}>
                Online
              </span>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
                <div style={{ background: '#f1f5f9', color: '#1e293b', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem' }}>
                  Hello David, plumber John Kamau has picked up the mixer tap replacement kit. He will be at Unit B-402 at 2:00 PM. Please ensure someone is home or grant gate entry authorization.
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>Today, 9:15 AM &bull; Management</span>
              </div>

              <div style={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
                <div style={{ background: '#4f46e5', color: '#ffffff', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem' }}>
                  Confirmed. I have notified the estate gate security to clear John upon arrival. Thank you!
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', display: 'block', textAlign: 'right' }}>Today, 9:22 AM &bull; You</span>
              </div>
            </div>

            {/* Input Form */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type a message to the estate management..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                }}
              />
              <button
                onClick={() => {
                  setFeedbackMessage('Message sent to management office.');
                  setTimeout(() => setFeedbackMessage(null), 3000);
                }}
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Send size={15} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 8: MY PROFILE
      ========================================================================== */}
      {view === 'profile' && (
        <>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Tenant Profile & Identity
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Verified personal information recorded under the Kenya Data Protection Act (KDPA).
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '720px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Full Legal Name</label>
                <input
                  type="text"
                  readOnly
                  value={tenantData.name}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Primary Mobile (M-Pesa)</label>
                <input
                  type="text"
                  readOnly
                  value={tenantData.phone}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Email Address</label>
                <input
                  type="text"
                  readOnly
                  value={tenantData.email}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Masked National ID</label>
                <input
                  type="text"
                  readOnly
                  value="••••••32 (Verified KDPA)"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Assigned Parking Bay</label>
                <input
                  type="text"
                  readOnly
                  value={tenantData.parkingSlot}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Emergency Contact</label>
                <input
                  type="text"
                  readOnly
                  value="Grace Wanjiku (+254 722 987 654) - Sister"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    marginTop: '4px',
                  }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                onClick={() => {
                  setFeedbackMessage('Profile update request sent to management desk.');
                  setTimeout(() => setFeedbackMessage(null), 3000);
                }}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Request Information Update
              </button>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 9: ACCOUNT SETTINGS
      ========================================================================== */}
      {view === 'settings' && (
        <>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Tenant Account & Security Settings
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Configure your credentials, two-factor authentication, and notification delivery options.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '720px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Password Change */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0' }}>Change Portal Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="password"
                  placeholder="Current password"
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <input
                  type="password"
                  placeholder="New secure password"
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <button
                  onClick={() => {
                    setFeedbackMessage('Password updated successfully.');
                    setTimeout(() => setFeedbackMessage(null), 3000);
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0' }} />

            {/* 2FA */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0' }}>Two-Factor Authentication (2FA)</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#64748b' }}>
                Protect your tenancy account by requiring an SMS OTP code whenever signing in.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>SMS Two-Factor Verification</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Code sent to +254 712 *** 678</div>
                </div>
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '12px',
                  }}
                >
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          MODALS & ACTIONS
      ========================================================================== */}

      {/* Pay Modal */}
      {showPayModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={20} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Lipa na M-Pesa Instructions</h3>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Daraja C2B V2 Business Shortcode:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d', letterSpacing: '0.05em' }}>
                {tenantData.paybillNumber}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, marginTop: '8px' }}>Account Number:</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em' }}>
                {tenantData.accountNumber}
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              1. Open M-Pesa &bull; 2. Select Lipa na M-Pesa &bull; 3. Pay Bill &bull; 4. Enter Business No: <strong>{tenantData.paybillNumber}</strong> &bull; 5. Enter Acc: <strong>{tenantData.accountNumber}</strong> &bull; 6. Enter Amount.
            </p>

            <button
              onClick={() => {
                setShowPayModal(false);
                setFeedbackMessage('Payment instructions copied. Complete via M-Pesa.');
                setTimeout(() => setFeedbackMessage(null), 3000);
              }}
              style={{
                width: '100%',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Done & Return to Portal
            </button>
          </div>
        </div>
      )}

      {/* New Maintenance Modal */}
      {showMaintenanceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Report Maintenance Issue</h3>
              <button
                onClick={() => setShowMaintenanceModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleMaintenanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Problem Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master bedroom shower leaking"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Locks & Security">Locks & Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Urgency Level</label>
                  <select
                    value={newTicket.urgency}
                    onChange={(e) => setNewTicket({ ...newTicket, urgency: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="Low">Low (Routine)</option>
                    <option value="Medium">Medium (Fix soon)</option>
                    <option value="High">High (Immediate)</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details about location, when it started, and symptoms..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Preferred Technician Access Time</label>
                <select
                  value={newTicket.preferredTime}
                  onChange={(e) => setNewTicket({ ...newTicket, preferredTime: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                  <option value="Anytime (Caretaker has key)">Anytime (Caretaker has key)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewalModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Request Tenancy Lease Renewal</h3>
              <button
                onClick={() => setShowRenewalModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 16px 0' }}>
              Current lease for <strong>{tenantData.unit}</strong> expires on <strong>{tenantData.leaseEnd}</strong>. Submit your requested renewal duration to the Property Manager.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Requested Term</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="12">12 Months (Standard Fixed)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="6">6 Months (Short Extension)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Notes for Landlord / Manager</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Would like to renew under current terms. Kindly prepare the agreement."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => setShowRenewalModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRenewalModal(false);
                    setFeedbackMessage('Lease renewal request transmitted to Property Manager.');
                    setTimeout(() => setFeedbackMessage(null), 4000);
                  }}
                  style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Send Renewal Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacate Modal */}
      {showVacateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ef4444' }}>Submit Notice to Vacate</h3>
              <button
                onClick={() => setShowVacateModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 16px 0' }}>
              In accordance with your tenancy agreement, a minimum of thirty (30) days formal notice is required. Move-out inspection and deposit refund from Account 2100 will be scheduled accordingly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Intended Move-Out Date</label>
                <input
                  type="date"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Deposit Refund Bank / M-Pesa Details</label>
                <input
                  type="text"
                  placeholder="e.g. M-Pesa 0712345678 or Bank Account"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => setShowVacateModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowVacateModal(false);
                    setFeedbackMessage('Notice to vacate submitted. Property manager will contact you for inspection scheduling.');
                    setTimeout(() => setFeedbackMessage(null), 5000);
                  }}
                  style={{ background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Submit Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discrepancy Modal */}
      {showDiscrepancyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Report Billing Discrepancy</h3>
              <button
                onClick={() => setShowDiscrepancyModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 16px 0' }}>
              Notice an unfamiliar charge or missing M-Pesa payment? Submit the details to the accounting team.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>M-Pesa Transaction Ref or Invoice #</label>
                <input
                  type="text"
                  placeholder="e.g. QJ92K81N2P or INV-2026-1102"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Discrepancy Details</label>
                <textarea
                  rows={3}
                  placeholder="Explain the issue..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => setShowDiscrepancyModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDiscrepancyModal(false);
                    setFeedbackMessage('Billing discrepancy inquiry submitted to Accountant.');
                    setTimeout(() => setFeedbackMessage(null), 4000);
                  }}
                  style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Submit Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
