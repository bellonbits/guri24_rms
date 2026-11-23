import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CreditCard,
  FileText,
  Wrench,
  FolderLock,
  MessageSquare,
  Bell,
  User,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Plus,
  Send,
  ExternalLink,
  ChevronRight,
  Shield,
  Smartphone,
  Info,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Eye,
  Check,
  Search,
} from 'lucide-react';

interface TenantPortalPageProps {
  view?:
    | 'dashboard'
    | 'payments'
    | 'lease'
    | 'maintenance'
    | 'documents'
    | 'messages'
    | 'notifications'
    | 'profile';
}

export const TenantPortalPage: React.FC<TenantPortalPageProps> = ({ view }) => {
  const location = useLocation();

  // Resolve current view from prop or route
  const currentView = React.useMemo(() => {
    if (view) return view;
    if (location.pathname.includes('/payments') || location.pathname.includes('/financials')) {
      return 'payments';
    }
    if (location.pathname.includes('/lease') || location.pathname.includes('/apartment') || location.pathname.includes('/properties')) {
      return 'lease';
    }
    if (location.pathname.includes('/maintenance') || location.pathname.includes('/services')) {
      return 'maintenance';
    }
    if (location.pathname.includes('/documents')) {
      return 'documents';
    }
    if (location.pathname.includes('/messages') || location.pathname.includes('/community')) {
      return 'messages';
    }
    if (location.pathname.includes('/notifications') || location.pathname.includes('/notification')) {
      return 'notifications';
    }
    if (location.pathname.includes('/profile') || location.pathname.includes('/account') || location.pathname.includes('/settings')) {
      return 'profile';
    }
    return 'dashboard';
  }, [view, location.pathname]);

  // Tenancy State matching Section 11 recommendation (Greenview Apartments, Block A, Unit A-204)
  const [tenancy, setTenancy] = useState({
    tenantName: 'John Maina',
    phone: '+254 712 345 678',
    email: 'john.maina@example.com',
    propertyName: 'Greenview Apartments',
    location: 'Block A · Unit A-204 · Ruiru',
    unitNumber: 'Unit A-204',
    block: 'Block A',
    town: 'Ruiru, Kiambu County',
    leaseReference: 'LSE-2026-A204',
    leaseStatus: 'Active Lease',
    monthlyRent: 25000,
    serviceCharge: 2500,
    securityDeposit: 25000,
    outstandingBalance: 0,
    nextDueDate: '1 Dec 2026',
    leaseExpires: '31 Dec 2026',
    paybillNumber: '247247',
    accountNumber: 'GRE-A204',
    landlordName: 'Greenview Property Holdings Ltd',
    managerPhone: '+254 722 000 111',
  });

  // Maintenance tickets state (Section 4)
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    {
      id: 'REQ-1082',
      title: 'Water pressure low in master bathroom',
      category: 'Plumbing',
      priority: 'High',
      status: 'IN_PROGRESS',
      reportedDate: '2026-11-20',
      assignedTo: 'John Kamau (Master Plumber)',
      lastUpdate: 'Booster pump inspected. Replacement valve scheduled for 2:00 PM today.',
      stageIndex: 3, // In Progress
    },
    {
      id: 'REQ-1049',
      title: 'Kitchen cabinet hinge adjustment',
      category: 'Doors and locks',
      priority: 'Low',
      status: 'RESOLVED',
      reportedDate: '2026-10-14',
      assignedTo: 'Estate Facilities Team',
      lastUpdate: 'Hinge replaced and aligned. Confirmed by resident.',
      stageIndex: 4, // Resolved
    },
  ]);

  // Payment receipts state (Section 2)
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 'PAY-89210',
      date: '1 Nov 2026',
      receiptNo: 'RCP-2026-1101',
      description: 'Rent payment received · Monthly rent & service charge',
      amount: 27500,
      channel: 'M-Pesa Daraja C2B V2 (Paybill 247247)',
      reference: 'QJ92K81N2P',
      status: 'Paid',
    },
    {
      id: 'PAY-87192',
      date: '1 Oct 2026',
      receiptNo: 'RCP-2026-1001',
      description: 'Rent payment received · Monthly rent & service charge',
      amount: 27500,
      channel: 'M-Pesa Daraja C2B V2 (Paybill 247247)',
      reference: 'QI81M39X4A',
      status: 'Paid',
    },
    {
      id: 'PAY-85210',
      date: '1 Sep 2026',
      receiptNo: 'RCP-2026-0901',
      description: 'Rent payment received · Monthly rent & service charge',
      amount: 27500,
      channel: 'M-Pesa Daraja C2B V2 (Paybill 247247)',
      reference: 'QH72P91V2Z',
      status: 'Paid',
    },
  ]);

  // Document Library (Section 5)
  const documents = [
    {
      id: 'doc-lease',
      name: 'Counter-Signed Residential Lease Agreement (2026)',
      category: 'Lease agreement',
      date: '1 Jan 2026',
      size: '2.4 MB',
      type: 'PDF',
    },
    {
      id: 'doc-deposit',
      name: 'Security Deposit Escrow Receipt (Account 2100)',
      category: 'Rent receipts',
      date: '28 Dec 2025',
      size: '480 KB',
      type: 'PDF',
    },
    {
      id: 'doc-movein',
      name: 'Move-in Condition & Inventory Inspection Report',
      category: 'Move-in inspection',
      date: '1 Jan 2026',
      size: '4.8 MB',
      type: 'PDF',
    },
    {
      id: 'doc-rules',
      name: 'Greenview Estate House Rules & Resident Regulations',
      category: 'House rules',
      date: '1 Jan 2026',
      size: '1.2 MB',
      type: 'PDF',
    },
  ];

  // Messages Thread State (Section 6)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Management',
      text: 'Hello John, plumber John Kamau has picked up the booster replacement part. He will arrive at Unit A-204 at 2:00 PM. Please ensure gate security is authorized.',
      time: 'Today, 9:15 AM',
      isMe: false,
    },
    {
      id: 2,
      sender: 'You',
      text: 'Received. I have cleared him at the main security gate. Thank you!',
      time: 'Today, 9:22 AM',
      isMe: true,
    },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Modals state
  const [showPayModal, setShowPayModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [showMissingPayModal, setShowMissingPayModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New Maintenance ticket form state
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: 'Plumbing',
    priority: 'High',
    description: '',
    preferredAccess: 'Morning (9:00 AM - 12:00 PM)',
  });

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title.trim()) return;

    const created = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicket.title,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'SUBMITTED',
      reportedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      assignedTo: 'Property Office (Pending Assignment)',
      lastUpdate: 'Received by management desk. Reviewing technician dispatch schedule.',
      stageIndex: 0,
    };

    setMaintenanceTickets([created, ...maintenanceTickets]);
    setShowMaintenanceModal(false);
    setNewTicket({
      title: '',
      category: 'Plumbing',
      priority: 'High',
      description: '',
      preferredAccess: 'Morning (9:00 AM - 12:00 PM)',
    });
    showToast(`Maintenance request ${created.id} submitted successfully!`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: messageInput.trim(),
      time: 'Just now',
      isMe: true,
    };
    setMessages([...messages, newMsg]);
    setMessageInput('');
    showToast('Message transmitted to property manager.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Toast notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: TENANT DASHBOARD — OVERVIEW (RECOMMENDED BLUEPRINT)
      ========================================================================== */}
      {(currentView === 'dashboard') && (
        <>
          {/* Top 5 Important Questions Header & Residence Banner */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  My Residence
                </div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0', letterSpacing: '-0.02em' }}>
                  {tenancy.propertyName}
                </h1>
                <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                  {tenancy.location}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  {tenancy.leaseStatus}
                </span>

                <button
                  onClick={() => setShowPayModal(true)}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  <CreditCard size={15} />
                  <span>Pay Rent</span>
                </button>
              </div>
            </div>

            {/* Answers to the 5 Important Questions: 4 Summary KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                paddingTop: '8px',
              }}
            >
              {/* Question 2: How much rent do I owe? -> Outstanding Balance */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Outstanding
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                  KES {tenancy.outstandingBalance.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} />
                  <span>All accounts current</span>
                </div>
              </div>

              {/* Monthly Rent */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Monthly Rent
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  KES {tenancy.monthlyRent.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                  + KES {tenancy.serviceCharge.toLocaleString()} Service Charge
                </div>
              </div>

              {/* Question 3: When is my next payment due? -> Next Due Date */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Next Due Date
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {tenancy.nextDueDate}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#2563eb', marginTop: '4px', fontWeight: 600 }}>
                  Grace period until 5 Dec 2026
                </div>
              </div>

              {/* Lease Status & Expiry */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Lease Expires
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {tenancy.leaseExpires}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                  Ref: {tenancy.leaseReference}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar (Recommended Section 1) */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Quick Actions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={() => setShowPayModal(true)}
                style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CreditCard size={14} />
                <span>View Payments</span>
              </button>

              <button
                onClick={() => setShowMaintenanceModal(true)}
                style={{
                  background: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Wrench size={14} />
                <span>Report an Issue</span>
              </button>

              <Link
                to="/portal/lease"
                style={{
                  background: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FileText size={14} />
                <span>View Lease</span>
              </Link>

              <Link
                to="/portal/documents"
                style={{
                  background: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FolderLock size={14} />
                <span>My Documents</span>
              </Link>

              <Link
                to="/portal/messages"
                style={{
                  background: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MessageSquare size={14} />
                <span>Contact Property Manager</span>
              </Link>
            </div>
          </div>

          {/* Question 4 & Question 5: Recent Activity & Maintenance Status Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
              gap: '24px',
            }}
            className="tenant-dashboard-sections-grid"
          >
            {/* LEFT: Recent Payment Activity (Section 1 Recommendation) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Recent Activity
                </h3>
                <Link
                  to="/portal/payments"
                  style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                >
                  View All Receipts &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Activity 1 */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#ecfdf5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                        Rent payment received
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Illustrative example &bull; 1 Nov 2026 &bull; KES 27,500.00
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    Paid
                  </span>
                </div>

                {/* Activity 2 */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                        Lease agreement
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Available in My Documents &bull; Counter-signed PDF
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/portal/documents"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      textDecoration: 'none',
                    }}
                  >
                    Download
                  </Link>
                </div>
              </div>

              {/* Building Announcement */}
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '10px',
                  padding: '14px',
                  marginTop: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Bell size={15} color="#0284c7" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}>
                    Estate Notice: Rooftop Water Tank Cleaning
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  Scheduled water reservoir pressure cleaning this Saturday from 9:00 AM to 1:00 PM. Water supply may temporarily drop.
                </p>
              </div>
            </div>

            {/* RIGHT: Maintenance Request Status (Question 4) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Maintenance Requests
                </h3>
                <Link
                  to="/portal/maintenance"
                  style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                >
                  View All &rarr;
                </Link>
              </div>

              {maintenanceTickets.slice(0, 1).map((ticket) => (
                <div
                  key={ticket.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                      {ticket.title}
                    </span>
                    <span
                      style={{
                        background: '#ccfbf1',
                        color: '#0f766e',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  {/* 6-Stage Tracking Pipeline from Section 4 */}
                  <div style={{ margin: '12px 0 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginBottom: '4px' }}>
                      <span>Submitted</span>
                      <span>Assigned</span>
                      <strong style={{ color: '#0f766e' }}>In Progress</strong>
                      <span>Resolved</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '70%', height: '100%', background: '#0d9488', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '10px' }}>
                    <strong>Assigned:</strong> {ticket.assignedTo}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                    {ticket.lastUpdate}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowMaintenanceModal(true)}
                style={{
                  width: '100%',
                  background: '#f8fafc',
                  color: '#2563eb',
                  border: '1px dashed #bfdbfe',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={15} />
                <span>Submit New Maintenance Request</span>
              </button>
            </div>
          </div>

          {/* Section 11 Illustrative Disclaimer */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.75rem',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            Illustrative dashboard using fictional tenant and property data, connected to authoritative double-entry accounting.
          </div>
        </>
      )}

      {/* =========================================================================
          SECTION 2: RENT AND PAYMENTS
      ========================================================================== */}
      {currentView === 'payments' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Rent & Payment Obligations
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Complete transparency about verified payments, current balances, and payment instructions.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowPayModal(true)}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Smartphone size={15} />
                <span>M-Pesa Paybill Instructions</span>
              </button>
              <button
                onClick={() => setShowMissingPayModal(true)}
                style={{
                  background: '#ffffff',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Report Missing Payment
              </button>
            </div>
          </div>

          {/* Balance & Payment Status Labels */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Current Rent Balance
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                KES {tenancy.outstandingBalance.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px' }}>
                Zero unpaid balance &bull; Verified
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Monthly Commitment
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                KES {(tenancy.monthlyRent + tenancy.serviceCharge).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Rent KES 25,000 + SC KES 2,500
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Security Deposit Held
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                KES {tenancy.securityDeposit.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Segregated Trust Account 2100
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Daraja C2B V2 Status
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0284c7', marginTop: '4px' }}>
                Instant Reconcile
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Paybill {tenancy.paybillNumber} &bull; Acc {tenancy.accountNumber}
              </div>
            </div>
          </div>

          {/* Payment Status Legend from Section 2 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.78rem',
            }}
          >
            <span style={{ fontWeight: 700, color: '#475569' }}>Supported Ledger Statuses:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Paid</span>
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Pending Verification</span>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Partially Paid</span>
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Overdue</span>
              <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Unallocated</span>
              <span style={{ background: '#fae8ff', color: '#9333ea', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Under Investigation</span>
            </div>
          </div>

          {/* Payment History Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Verified Payment Receipts & Ledger History
              </h3>
              <button
                onClick={() => showToast('Downloading complete annual tax statement...')}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Export Statement (PDF)
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                    <th style={{ padding: '8px 12px' }}>Receipt #</th>
                    <th style={{ padding: '8px 12px' }}>Description</th>
                    <th style={{ padding: '8px 12px' }}>Amount</th>
                    <th style={{ padding: '8px 12px' }}>Channel / Ref</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px', color: '#64748b' }}>{p.date}</td>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{p.receiptNo}</td>
                      <td style={{ padding: '12px', color: '#334155' }}>{p.description}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                        KES {p.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', color: '#2563eb' }}>
                        {p.reference}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => showToast(`Downloading official receipt ${p.receiptNo}...`)}
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          PDF
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
          SECTION 3: MY LEASE
      ========================================================================== */}
      {currentView === 'lease' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                My Lease & Tenancy Agreement
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Binding lease agreement terms and renewal/vacate procedures for {tenancy.unitNumber}.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowRenewalModal(true)}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.84rem',
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
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Submit Notice to Vacate
              </button>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Property & Unit
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                {tenancy.propertyName}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                {tenancy.location}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Lease Reference & Status
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2563eb', marginTop: '4px' }}>
                {tenancy.leaseReference}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                {tenancy.leaseStatus}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Lease Term Duration
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                1 Year Fixed
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                From 1 Jan 2026 to {tenancy.leaseExpires}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Security Deposit (Escrow)
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                KES {tenancy.securityDeposit.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Trust Account 2100 &bull; Refundable
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                Official Counter-Signed Lease Document
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                Landlord: {tenancy.landlordName} &bull; Emergency Contact: {tenancy.managerPhone}
              </p>
            </div>

            <button
              onClick={() => showToast('Downloading counter-signed lease agreement PDF...')}
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={14} />
              <span>Download PDF Agreement</span>
            </button>
          </div>
        </>
      )}

      {/* =========================================================================
          SECTION 4: MAINTENANCE REQUESTS
      ========================================================================== */}
      {currentView === 'maintenance' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Maintenance Requests & Repairs
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Report unit problems, track assigned technician progress, and verify resolutions.
              </p>
            </div>

            <button
              onClick={() => setShowMaintenanceModal(true)}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              <span>New Maintenance Request</span>
            </button>
          </div>

          {/* 6-Stage Tracking Pipeline from Section 4 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflowX: 'auto',
              gap: '12px',
            }}
          >
            {['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((stage, idx) => (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: idx <= 3 ? '#2563eb' : '#e2e8f0',
                    color: idx <= 3 ? '#ffffff' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: idx <= 3 ? 700 : 500, color: idx <= 3 ? '#0f172a' : '#94a3b8' }}>
                  {stage}
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
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb', fontSize: '0.84rem' }}>
                      {t.id}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{t.title}</h3>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        background: t.priority === 'High' ? '#fee2e2' : '#fef3c7',
                        color: t.priority === 'High' ? '#dc2626' : '#d97706',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      Priority: {t.priority}
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

                <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: '#64748b' }}>
                  <div>Category: <strong style={{ color: '#0f172a' }}>{t.category}</strong></div>
                  <div>Reported: <strong style={{ color: '#0f172a' }}>{t.reportedDate}</strong></div>
                  <div>Assigned: <strong style={{ color: '#0f172a' }}>{t.assignedTo}</strong></div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '0.82rem', color: '#334155' }}>
                  <strong>Progress Update:</strong> {t.lastUpdate}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  {t.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => {
                        setMaintenanceTickets(
                          maintenanceTickets.map((item) =>
                            item.id === t.id ? { ...item, status: 'RESOLVED', lastUpdate: 'Confirmed resolved by resident.' } : item
                          )
                        );
                        showToast(`Ticket ${t.id} marked as resolved.`);
                      }}
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Confirm Work Resolved
                    </button>
                  )}
                  {t.status === 'RESOLVED' && (
                    <button
                      onClick={() => {
                        setMaintenanceTickets(
                          maintenanceTickets.map((item) =>
                            item.id === t.id ? { ...item, status: 'IN_PROGRESS', lastUpdate: 'Reopened by resident.' } : item
                          )
                        );
                        showToast(`Ticket ${t.id} reopened.`);
                      }}
                      style={{
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
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
          SECTION 5: MY DOCUMENTS
      ========================================================================== */}
      {currentView === 'documents' && (
        <>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              My Rental Documents
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Secure private repository containing counter-signed lease agreements, rent receipts, and inspection reports.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {doc.category}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{doc.size}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>Issued: {doc.date}</div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => showToast(`Opening ${doc.name}...`)}
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
                    onClick={() => showToast(`Downloading ${doc.name}...`)}
                    style={{
                      flex: 1,
                      background: '#2563eb',
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
        </>
      )}

      {/* =========================================================================
          SECTION 6: MESSAGES & COMMUNICATION
      ========================================================================== */}
      {currentView === 'messages' && (
        <>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Talk to Property Management
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Direct messaging desk with Greenview Apartments caretaker and property managers.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              height: '560px',
            }}
          >
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
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>Estate Caretaker & Management Desk</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Online &bull; Mon - Sat 8:00 AM - 5:00 PM</div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((m) => (
                <div key={m.id} style={{ alignSelf: m.isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  <div
                    style={{
                      background: m.isMe ? '#2563eb' : '#f1f5f9',
                      color: m.isMe ? '#ffffff' : '#0f172a',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.84rem',
                    }}
                  >
                    {m.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', display: 'block', textAlign: m.isMe ? 'right' : 'left' }}>
                    {m.time} &bull; {m.sender}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type your message to estate management..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <button
                type="submit"
                style={{
                  background: '#2563eb',
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
            </form>
          </div>
        </>
      )}

      {/* =========================================================================
          SECTION 7: NOTIFICATIONS
      ========================================================================== */}
      {currentView === 'notifications' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Notifications & Reminders
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Rent reminders, verified payment confirmations, and maintenance updates.
              </p>
            </div>
            <button
              onClick={() => showToast('All notifications marked as read.')}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Mark all as read
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                id: 1,
                title: 'Rent payment received (KES 27,500.00)',
                body: 'Safaricom Daraja C2B V2 payment (Ref QJ92K81N2P) reconciled. Receipt RCP-2026-1101 ready in My Documents.',
                time: '1 Nov 2026',
                unread: false,
              },
              {
                id: 2,
                title: 'Technician Assigned: Master Bathroom Water Pressure',
                body: 'Plumber John Kamau assigned to REQ-1082. Arriving today at 2:00 PM.',
                time: 'Today, 8:30 AM',
                unread: true,
              },
              {
                id: 3,
                title: 'Rooftop Water Tank Cleaning',
                body: 'Annual water tank pressure cleaning this Saturday 9am-1pm. Water pressure may temporarily fluctuate.',
                time: '2 days ago',
                unread: true,
              },
            ].map((item) => (
              <div
                key={item.id}
                style={{
                  background: item.unread ? '#eff6ff' : '#ffffff',
                  border: item.unread ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</span>
                    {item.unread && (
                      <span style={{ background: '#2563eb', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>{item.body}</p>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* =========================================================================
          SECTION 8: MY PROFILE & ACCOUNT SETTINGS
      ========================================================================== */}
      {currentView === 'profile' && (
        <>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              My Profile & Account Settings
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Manage personal details, emergency contacts, password, and two-factor authentication.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '800px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={tenancy.tenantName}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Primary Phone (M-Pesa)</label>
                <input
                  type="text"
                  readOnly
                  value={tenancy.phone}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Email Address</label>
                <input
                  type="text"
                  readOnly
                  value={tenancy.email}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Emergency Contact</label>
                <input
                  type="text"
                  readOnly
                  value="Grace Wanjiku (+254 722 987 654) - Sister"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 700 }}>Security & 2FA</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>SMS Two-Factor Authentication</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>One-time passcode sent to +254 712 *** 678 upon login</div>
                </div>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '10px' }}>
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          MODALS
      ========================================================================== */}
      {/* M-Pesa Payment Instructions Modal */}
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
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={20} color="#059669" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Lipa na M-Pesa Paybill</h3>
              </div>
              <button onClick={() => setShowPayModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>
                &times;
              </button>
            </div>

            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>Business Paybill Number:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d', letterSpacing: '0.04em' }}>{tenancy.paybillNumber}</div>
              <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600, marginTop: '8px' }}>Account Reference Number:</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>{tenancy.accountNumber}</div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              1. Open M-Pesa &bull; 2. Select Lipa na M-Pesa &bull; 3. Pay Bill &bull; 4. Enter Business No: <strong>{tenancy.paybillNumber}</strong> &bull; 5. Enter Acc: <strong>{tenancy.accountNumber}</strong> &bull; 6. Enter Rent Amount.
            </p>

            <button
              onClick={() => {
                setShowPayModal(false);
                showToast('Payment details copied. Reconciled automatically within 60s.');
              }}
              style={{
                width: '100%',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Done & Return to Portal
            </button>
          </div>
        </div>
      )}

      {/* New Maintenance Modal (Section 4 Categories) */}
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
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Report Maintenance Issue</h3>
              <button onClick={() => setShowMaintenanceModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Problem Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master bathroom tap dripping"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Category</label>
                  {/* Categories from Section 4 */}
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water supply">Water supply</option>
                    <option value="Doors and locks">Doors and locks</option>
                    <option value="Painting">Painting</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Structural issues">Structural issues</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
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
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Description of the Problem</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe location, symptoms, when it started..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Preferred Access Time</label>
                <select
                  value={newTicket.preferredAccess}
                  onChange={(e) => setNewTicket({ ...newTicket, preferredAccess: e.target.value })}
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
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Submit Request
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
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Request Lease Renewal</h3>
              <button onClick={() => setShowRenewalModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 16px 0' }}>
              Current lease expires on <strong>{tenancy.leaseExpires}</strong>. Submit your requested renewal duration to the Property Manager.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Requested Renewal Period</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="6">6 Months (Short Extension)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setShowRenewalModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRenewalModal(false);
                    showToast('Renewal request transmitted to Property Manager.');
                  }}
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Send Request
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
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#dc2626' }}>Submit Notice to Vacate</h3>
              <button onClick={() => setShowVacateModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 16px 0' }}>
              A minimum of thirty (30) days formal notice is required under tenancy terms. Move-out inspection and deposit refund from Account 2100 will be scheduled.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Intended Move-Out Date</label>
                <input type="date" required style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setShowVacateModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowVacateModal(false);
                    showToast('Notice to vacate registered. Property manager will contact you.');
                  }}
                  style={{ background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Submit Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missing Payment / Discrepancy Modal */}
      {showMissingPayModal && (
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
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Report Missing Payment</h3>
              <button onClick={() => setShowMissingPayModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 14px 0' }}>
              Enter your M-Pesa transaction reference or upload proof of payment for administrative investigation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="e.g. QJ92K81N2P"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', textTransform: 'uppercase' }}
              />
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                *Note: Uploaded evidence is marked PENDING_REVIEW and does not automatically confirm payment until verified.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setShowMissingPayModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowMissingPayModal(false);
                    showToast('Payment reference submitted for accountant verification.');
                  }}
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Submit for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .tenant-dashboard-sections-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
