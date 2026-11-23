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
  ChevronLeft,
  Shield,
  Smartphone,
  Info,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Eye,
  Check,
  Search,
  Printer,
  Phone,
  Archive,
  Smile,
  Paperclip,
  MoreVertical,
  X,
  Sparkles,
  ArrowRight,
  ChevronDown,
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
    | 'profile'
    | 'community'
    | 'apartment'
    | 'services'
    | 'account'
    | 'home';
}

export const TenantPortalPage: React.FC<TenantPortalPageProps> = ({ view }) => {
  const location = useLocation();

  // Resolve current view from prop or route
  const currentView = React.useMemo(() => {
    if (view === 'payments' || view === 'financials') return 'payments';
    if (view === 'lease' || view === 'apartment' || view === 'properties') return 'lease';
    if (view === 'maintenance' || view === 'services') return 'maintenance';
    if (view === 'documents') return 'documents';
    if (view === 'messages' || view === 'community') return 'messages';
    if (view === 'notifications' || view === 'notification') return 'notifications';
    if (view === 'profile' || view === 'account' || view === 'settings') return 'profile';
    if (view === 'dashboard' || view === 'home') return 'dashboard';

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

  // Tenancy State matching Blueprint (Greenview Apartments, Block A, Unit A-204)
  const [tenancy, setTenancy] = useState({
    tenantName: 'Amina Wanjiku',
    phone: '+254 722 000 492',
    email: 'amina.wanjiku@example.com',
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

  // Currency toggle state
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'KES'>('USD');

  // Ledger transactions matching Image 1: Resident Portal Payments
  const [ledgerTransactions, setLedgerTransactions] = useState([
    {
      id: 'tx-1',
      date: 'May 2, 2026',
      type: 'Rest Control',
      typeColor: '#2563eb',
      typeBg: '#dbeafe',
      source: 'Property',
      amountUsd: 782.01,
      amountKes: 2500,
      isPayment: false,
      balanceUsd: 782.01,
      balanceKes: 2500,
      ticketId: '0120077398910288',
      ref: 'TX-RC-8891',
    },
    {
      id: 'tx-2',
      date: 'May 2, 2026',
      type: 'Water',
      typeColor: '#0d9488',
      typeBg: '#ccfbf1',
      source: 'Property',
      amountUsd: 1586.63,
      amountKes: 1586,
      isPayment: false,
      balanceUsd: 1586.63,
      balanceKes: 1586,
      ticketId: '0120077398910289',
      ref: 'TX-WT-4912',
    },
    {
      id: 'tx-3',
      date: 'May 2, 2026',
      type: 'Recurring Concession',
      typeColor: '#9333ea',
      typeBg: '#f3e8ff',
      source: 'Property',
      amountUsd: 1677.42,
      amountKes: 5000,
      isPayment: false,
      balanceUsd: 1677.42,
      balanceKes: 5000,
      ticketId: '0120077398910290',
      ref: 'TX-CC-2018',
    },
    {
      id: 'tx-4',
      date: 'May 2, 2026',
      type: 'Rest Control',
      typeColor: '#2563eb',
      typeBg: '#dbeafe',
      source: 'Property',
      amountUsd: 782.01,
      amountKes: 2500,
      isPayment: false,
      balanceUsd: 782.01,
      balanceKes: 2500,
      ticketId: '0120077398910291',
      ref: 'TX-RC-8892',
    },
    {
      id: 'tx-5',
      date: 'April 1, 2026',
      type: 'Trash Removal',
      typeColor: '#ea580c',
      typeBg: '#ffedd5',
      source: 'Property',
      amountUsd: 1451.76,
      amountKes: 500,
      isPayment: false,
      balanceUsd: 1451.76,
      balanceKes: 500,
      ticketId: '0120077398910292',
      ref: 'TX-TR-1029',
    },
    {
      id: 'tx-6',
      date: 'April 1, 2026',
      type: 'Recurring Concession',
      typeColor: '#9333ea',
      typeBg: '#f3e8ff',
      source: 'Property',
      amountUsd: 782.01,
      amountKes: 2500,
      isPayment: false,
      balanceUsd: 782.01,
      balanceKes: 2500,
      ticketId: '0120077398910293',
      ref: 'TX-CC-2019',
    },
    {
      id: 'tx-7',
      date: 'April 1, 2026',
      type: 'Rest Control',
      typeColor: '#2563eb',
      typeBg: '#dbeafe',
      source: 'Property',
      amountUsd: 473.85,
      amountKes: 1500,
      isPayment: false,
      balanceUsd: 473.85,
      balanceKes: 1500,
      ticketId: '0120077398910294',
      ref: 'TX-RC-8893',
    },
    {
      id: 'tx-8',
      date: 'April 1, 2026',
      type: 'Trash Removal',
      typeColor: '#ea580c',
      typeBg: '#ffedd5',
      source: 'Property',
      amountUsd: 2100.26,
      amountKes: 2100,
      isPayment: false,
      balanceUsd: 2100.26,
      balanceKes: 2100,
      ticketId: '0120077398910295',
      ref: 'TX-TR-1030',
    },
    {
      id: 'tx-9',
      date: 'Nov 1, 2026',
      type: 'Rent Payment',
      typeColor: '#16a34a',
      typeBg: '#dcfce7',
      source: 'M-Pesa Daraja C2B',
      amountUsd: 2345.76,
      amountKes: 27500,
      isPayment: true,
      balanceUsd: 0.0,
      balanceKes: 0.0,
      ticketId: '0120077398910288',
      ref: 'QJ92K81N2P',
    },
  ]);

  // Auto payments from Image 1
  const autoPayments = [
    { id: 1, title: 'Charge - Trash Removal', date: 'May 2, 2026', amountUsd: '$ 2,627.51', amountKes: 'KES 500.00' },
    { id: 2, title: 'Charge - Trash Removal', date: 'May 2, 2026', amountUsd: '$ 2,627.51', amountKes: 'KES 25,000.00' },
    { id: 3, title: 'Charge - Trash Removal', date: 'May 2, 2026', amountUsd: '$ 2,627.51', amountKes: 'KES 1,586.00' },
    { id: 4, title: 'Charge - Trash Removal', date: 'May 2, 2026', amountUsd: '$ 2,627.51', amountKes: 'KES 2,000.00' },
  ];

  // Conversations matching Image 2: All Messages
  const [conversations] = useState([
    {
      id: 'kathy',
      name: 'Katherine Moss',
      handle: '@kathy',
      role: 'Property Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      online: true,
      lastMessage: "Sure thing, I'll have a look today. They're looking great!",
      time: '20min ago',
      unread: false,
    },
    {
      id: 'phoenix',
      name: 'Phoenix Baker',
      handle: '@phoenix',
      role: 'Lead Caretaker',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      online: true,
      lastMessage: 'Hey Olivia, Katherine sent me over the latest doc. I just have a quick question about the...',
      time: '5min ago',
      unread: true,
    },
    {
      id: 'mollie',
      name: 'Mollie Hall',
      handle: '@mollie',
      role: 'Accounts & Billing',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      online: false,
      lastMessage: "I've just published the site again. Looks like it fixed it. How weird! I'll keep an eye on it...",
      time: '1hr ago',
      unread: false,
    },
    {
      id: 'rosalee',
      name: 'Rosalee Melvin',
      handle: '@rosalee',
      role: 'Concierge Desk',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
      online: false,
      lastMessage: 'Hey Liv — just wanted to say thanks for chasing up the release for me. Really...',
      time: '2hr ago',
      unread: false,
    },
    {
      id: 'analah',
      name: 'Analah Whitten',
      handle: '@analah',
      role: 'Leasing Coordinator',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
      online: false,
      lastMessage: "Good news! Jack accepted the offer. I've sent over a contract for him to review but...",
      time: '2hr ago',
      unread: false,
    },
    {
      id: 'koray',
      name: 'Koray Okumus',
      handle: '@koray',
      role: 'Field Technician',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      online: true,
      lastMessage: 'Thanks! Looks great!',
      time: '4hr ago',
      unread: false,
    },
    {
      id: 'eva',
      name: 'Eva Bond',
      handle: '@eva',
      role: 'Estate Admin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      online: false,
      lastMessage: "The press release went out! It's been picked up by a few people... Here's the link if you...",
      time: '4hr ago',
      unread: false,
    },
  ]);
  const [selectedConversationId, setSelectedConversationId] = useState('kathy');

  // Messages thread state matching Image 2
  const [threadMessages, setThreadMessages] = useState([
    {
      id: 'msg-1',
      sender: 'Katherine Moss',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      text: "Thanks Olivia! Almost there. I'll work on making those changes you suggested and will shoot it over.",
      time: 'Thursday 11:40am',
      isMe: false,
    },
    {
      id: 'msg-2',
      sender: 'Katherine Moss',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      text: "Hey Olivia, I've finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over.",
      time: 'Thursday 11:40am',
      isMe: false,
      attachment: {
        name: 'Tech requirements.pdf',
        size: '1.2 MB',
      },
    },
    {
      id: 'msg-3',
      sender: 'You',
      text: "Awesome! Thanks. I'll look at this today.",
      time: 'Thursday 11:41am',
      isMe: true,
    },
    {
      id: 'msg-4',
      sender: 'Katherine Moss',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      text: "No rush though — we still have to wait for Lana's designs.",
      time: 'Thursday 11:44am',
      isMe: false,
    },
    {
      id: 'msg-5',
      sender: 'Katherine Moss',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      text: 'Hey Olivia, can you please review the latest design when you can?',
      time: 'Today 2:20pm',
      isMe: false,
    },
    {
      id: 'msg-6',
      sender: 'You',
      text: "Sure thing, I'll have a look today. They're looking great!",
      time: 'Just now',
      isMe: true,
      reactions: ['❤️', '👏'],
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Maintenance tickets state
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    {
      id: 'REQ-0492',
      title: 'Kitchen sink mixer tap leaking',
      category: 'Plumbing',
      priority: 'High',
      status: 'IN_PROGRESS',
      reportedDate: '21 Nov 2026',
      assignedTo: 'Fundi Peter Kariuki (Lead Plumber)',
      lastUpdate: 'Parts purchased. Caretaker confirmed technician access window: Tomorrow 10:00 AM - 12:00 PM.',
      stageIndex: 3,
    },
    {
      id: 'REQ-0481',
      title: 'Balcony sliding door latch sticking',
      category: 'Doors and locks',
      priority: 'Medium',
      status: 'RESOLVED',
      reportedDate: '10 Nov 2026',
      assignedTo: 'James Macharia (Carpentry)',
      lastUpdate: 'Lock mechanism lubricated and strike plate realigned. Verified functional.',
      stageIndex: 4,
    },
    {
      id: 'REQ-0419',
      title: 'Water heater circuit breaker trip',
      category: 'Electrical',
      priority: 'Emergency',
      status: 'CLOSED',
      reportedDate: '18 Oct 2026',
      assignedTo: 'Apex Electrical Services Ltd',
      lastUpdate: 'Replaced faulty 20A double-pole isolator switch. Fully tested and closed.',
      stageIndex: 5,
    },
  ]);

  // Documents state
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

  // Modals state
  const [showPayModal, setShowPayModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [showMissingPayModal, setShowMissingPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active receipt data for ticket stub modal (Image 3)
  const [receiptData, setReceiptData] = useState({
    ticketId: '0120077398910288',
    amountUsd: '$3,800.00',
    amountKes: 'KES 25,000.00',
    dateTime: '22 AUG, 2025 | 13:29',
    cardBrand: 'Mastercard ending in 4567',
    expiry: '10/27',
    barcode: '400600890050002070013',
  });

  // Active invoice data for invoice modal (Image 4)
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: '024/2024',
    invoiceDate: 'January 28, 2024',
    dueDate: 'February 12, 2024',
    recipient: {
      name: 'WADE WARREN',
      address: '3303 Liberty Avenue, 322612 Tustin, CA',
      vatNo: '432879',
      email: 'nic.k@gmail.com',
      phone: '+1 551 239 0523',
    },
    senderEmail: 'goodwin@gmail.com',
    senderPhone: '+1 951 239 0402',
    bank: 'FTSBUS21',
    iban: 'G885-1232-4321-5645',
    items: [
      { desc: 'ipod fix', hours: 42, rate: 35, amount: 1470 },
      { desc: 'New desc', hours: 12, rate: 35, amount: 420 },
    ],
    subtotal: 1890,
    discountPct: 5,
    discountAmount: 94.5,
    total: 1795.5,
  });

  const handleOpenReceipt = (ticketId: string = '0120077398910288', amountUsd: number = 2345.76) => {
    setReceiptData({
      ticketId,
      amountUsd: `$${amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      amountKes: 'KES 25,000.00',
      dateTime: '22 AUG, 2025 | 13:29',
      cardBrand: 'Mastercard ending in 4567',
      expiry: '10/27',
      barcode: '400600890050002070013',
    });
    setShowReceiptModal(true);
  };

  const handleOpenInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: chatInput.trim(),
      time: 'Just now',
      isMe: true,
    };
    setThreadMessages([...threadMessages, newMsg]);
    setChatInput('');
    showToast('Message sent to property management.');
  };

  const currentChatUser = conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
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
          SECTION 1: OVERVIEW DASHBOARD
      ========================================================================== */}
      {currentView === 'dashboard' && (
        <>
          {/* Welcome Banner & Residence */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f27a59', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Tenant Self-Service Portal
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Greenview Apartments · Unit A-204</span>
              </div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Welcome back, {tenancy.tenantName}
              </h1>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                {tenancy.location} · {tenancy.town}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleOpenReceipt()}
                style={{
                  background: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🎟️ Latest Receipt</span>
              </button>
              <button
                onClick={() => handleOpenInvoice()}
                style={{
                  background: '#f27a59',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(242, 122, 89, 0.25)',
                }}
              >
                <span>📄 Preview Invoice</span>
              </button>
            </div>
          </div>

          {/* 4 Summary KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Monthly Rent
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                KES {tenancy.monthlyRent.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                Plus KES 2,500 service charge
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Outstanding Balance
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                KES {tenancy.outstandingBalance.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '4px' }}>
                ✓ Zero unpaid balance
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Next Due Date
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                {tenancy.nextDueDate}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                5-day grace period
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Lease Status
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', marginTop: '6px' }}>
                {tenancy.leaseStatus}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                Expires: {tenancy.leaseExpires}
              </div>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
              Quick Tenancy Actions:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Link
                to="/portal/payments"
                style={{
                  textDecoration: 'none',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CreditCard size={14} color="#f27a59" />
                <span>View Payments</span>
              </Link>
              <Link
                to="/portal/maintenance"
                style={{
                  textDecoration: 'none',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Wrench size={14} color="#0284c7" />
                <span>Report an Issue</span>
              </Link>
              <Link
                to="/portal/lease"
                style={{
                  textDecoration: 'none',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FileText size={14} color="#059669" />
                <span>View Lease</span>
              </Link>
              <Link
                to="/portal/messages"
                style={{
                  textDecoration: 'none',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MessageSquare size={14} color="#7c3aed" />
                <span>Contact Manager</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          SECTION 2: PAYMENTS (IMAGE 1 DESIGN)
      ========================================================================== */}
      {currentView === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
              Payments
            </h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Currency:</span>
              <button
                onClick={() => setCurrencyMode(currencyMode === 'USD' ? 'KES' : 'USD')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#f27a59',
                  cursor: 'pointer',
                }}
              >
                {currencyMode === 'USD' ? 'USD ($)' : 'KES (KSh)'}
              </button>
            </div>
          </div>

          {/* Top Two Cards Row matching Image 1 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Left Card: Sleek Virtual Card + Balance + Make Payment Button */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Dark Virtual Card */}
                <div
                  style={{
                    width: '240px',
                    height: '144px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #181c2e 0%, #0d101d 100%)',
                    color: '#ffffff',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 25px rgba(19, 23, 38, 0.35)',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {/* Subtle topo wave lines simulation */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-20px',
                      bottom: '-20px',
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.06)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: '-40px',
                      bottom: '-40px',
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.04)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.02em' }}>
                      Bank of America
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff' }}>
                      VISA
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#cbd5e1', letterSpacing: '0.02em' }}>
                      {tenancy.tenantName === 'Amina Wanjiku' ? 'Dariia Boichuk' : tenancy.tenantName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                      xxxx 1234 &nbsp; 06/24
                    </div>
                  </div>
                </div>

                {/* Balance & Make Payment Action */}
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px' }}>
                    Credit Balance
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#131726', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    {currencyMode === 'USD' ? '$ 2,345.76' : 'KES 0.00'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
                    <button
                      onClick={() => handleOpenReceipt()}
                      style={{
                        background: '#f27a59', // Peach / Coral button exactly matching Image 1
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '11px 22px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(242, 122, 89, 0.35)',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      Make Payment
                    </button>
                    <button
                      onClick={() => handleOpenInvoice()}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f8fafc' }}>
                <button
                  onClick={() => setShowPayModal(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={14} />
                  <span>Add New Card</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span>1/2</span>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Auto - Payment matching Image 1 */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#131726', margin: 0 }}>
                  Auto - Payment
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer' }}>
                  <span>June</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {autoPayments.map((ap) => (
                  <div
                    key={ap.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#131726', fontSize: '1rem', fontWeight: 700 }}>&rarr;</span>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#131726' }}>
                          {ap.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          {ap.date}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#131726' }}>
                      {currencyMode === 'USD' ? ap.amountUsd : ap.amountKes}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600 }}>
                  ✓ Scheduled automatic collection active
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Table: Ledger Transactions matching Image 1 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#131726', margin: 0 }}>
                Ledger transactions
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#94a3b8', cursor: 'pointer' }}>
                <span>Full Ledger</span>
                <ChevronDown size={14} />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', fontSize: '0.78rem', borderBottom: '1px solid #f1f5f9' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Date</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Type</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Source</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500, textAlign: 'right' }}>Charges / Payments</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500, textAlign: 'right' }}>Balance</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid #f8fafc',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '16px', color: '#131726', fontWeight: 500 }}>
                        {tx.date}
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: tx.typeBg,
                            color: tx.typeColor,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            display: 'inline-block',
                          }}
                        >
                          {tx.type}
                        </span>
                      </td>

                      <td style={{ padding: '16px', color: '#64748b' }}>
                        {tx.source}
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: tx.isPayment ? '#059669' : '#f27a59', // Peach/coral charges matching Image 1
                        }}
                      >
                        {tx.isPayment ? '+ ' : ''}
                        {currencyMode === 'USD'
                          ? `$ ${tx.amountUsd.toFixed(2)}`
                          : `KES ${tx.amountKes.toLocaleString()}`}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#131726' }}>
                        {currencyMode === 'USD'
                          ? `$ ${tx.balanceUsd.toFixed(2)}`
                          : `KES ${tx.balanceKes.toLocaleString()}`}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenReceipt(tx.ticketId, tx.amountUsd)}
                            title="View Perforated Ticket Receipt"
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: '#334155',
                            }}
                          >
                            🎟️ Ticket
                          </button>
                          <button
                            onClick={() => handleOpenInvoice()}
                            title="Preview Modern Invoice"
                            style={{
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: '#2563eb',
                            }}
                          >
                            📄 Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: ALL MESSAGES (IMAGE 2 DESIGN)
      ========================================================================== */}
      {currentView === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Header */}
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
            All messages
          </h1>

          {/* Two-Pane Chat Container matching Image 2 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
              display: 'flex',
              minHeight: '680px',
            }}
          >
            {/* Left Column: Messages List (340px) */}
            <div
              style={{
                width: '340px',
                borderRight: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                flexShrink: 0,
              }}
            >
              {/* Top search & title */}
              <div style={{ padding: '20px 20px 14px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#131726' }}>Messages</span>
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#64748b',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: '10px',
                      }}
                    >
                      40
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('New thread prompt ready.')}
                    style={{
                      background: 'transparent',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#475569',
                    }}
                    title="Compose message"
                  >
                    ✏️
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '8px 12px',
                  }}
                >
                  <Search size={15} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Search"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '0.84rem',
                      width: '100%',
                      color: '#0f172a',
                    }}
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {conversations.map((c) => {
                  const isSelected = c.id === selectedConversationId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        borderLeft: isSelected ? '3px solid #7c3aed' : '3px solid transparent', // Purple active indicator matching Image 2
                        background: isSelected ? '#fbf9ff' : 'transparent',
                        borderBottom: '1px solid #f8fafc',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Avatar with status */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                          src={c.avatar}
                          alt={c.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        {c.online && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#10b981',
                              border: '2px solid #ffffff',
                            }}
                          />
                        )}
                        {c.unread && (
                          <span
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: '-6px',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#7c3aed',
                            }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: isSelected ? 700 : 600, color: '#131726' }}>
                            {c.name}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{c.time}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#7c3aed', fontWeight: 500, marginBottom: '2px' }}>
                          {c.handle}
                        </div>
                        <div
                          style={{
                            fontSize: '0.76rem',
                            color: '#64748b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {c.lastMessage}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Chat Pane matching Image 2 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
              {/* Header */}
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={currentChatUser.avatar}
                    alt={currentChatUser.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#131726' }}>
                        {currentChatUser.name}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
                        ● Online
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 500 }}>
                      {currentChatUser.handle} · {currentChatUser.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => showToast(`Calling ${currentChatUser.name} (+254 722 000 111)...`)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Phone size={14} />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => showToast('Conversation archived.')}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => showToast(`Opening profile for ${currentChatUser.name}...`)}
                    style={{
                      background: '#7c3aed', // Purple pill button matching Image 2
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 16px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    View profile
                  </button>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div
                style={{
                  flex: 1,
                  padding: '24px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  background: '#ffffff',
                }}
              >
                {/* Date separator */}
                <div style={{ textAlign: 'center', margin: '6px 0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>Thursday 11:40am</span>
                </div>

                {threadMessages.map((m) => {
                  if (m.isMe) {
                    return (
                      <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                          You · {m.time}
                        </div>
                        <div
                          style={{
                            background: '#7c3aed', // Purple message bubble matching Image 2
                            color: '#ffffff',
                            padding: '12px 16px',
                            borderRadius: '16px 16px 4px 16px',
                            fontSize: '0.86rem',
                            lineHeight: 1.45,
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
                          }}
                        >
                          {m.text}
                        </div>
                        {m.reactions && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '4px',
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '20px',
                              padding: '2px 6px',
                              fontSize: '0.8rem',
                              marginTop: '-8px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            }}
                          >
                            {m.reactions.map((r, i) => (
                              <span key={i}>{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '75%', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <img
                        src={m.avatar || currentChatUser.avatar}
                        alt={m.sender}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#131726' }}>{m.sender}</span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{m.time}</span>
                        </div>
                        <div
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#131726',
                            padding: '12px 16px',
                            borderRadius: '4px 16px 16px 16px',
                            fontSize: '0.86rem',
                            lineHeight: 1.45,
                          }}
                        >
                          {m.text}
                        </div>

                        {/* File Attachment Card matching Image 2 */}
                        {m.attachment && (
                          <div
                            style={{
                              marginTop: '8px',
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '260px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  background: '#f3e8ff',
                                  color: '#7c3aed',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                📄
                              </div>
                              <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#131726' }}>
                                  {m.attachment.name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                  {m.attachment.size}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => showToast(`Downloading ${m.attachment?.name}...`)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#7c3aed' }}
                            >
                              <Download size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <img
                    src={currentChatUser.avatar}
                    alt={currentChatUser.name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      background: '#f1f5f9',
                      padding: '6px 10px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8' }} />
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8' }} />
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{currentChatUser.name} is typing...</span>
                </div>
              </div>

              {/* Chat Input Bar matching Image 2 */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid #f1f5f9',
                  background: '#ffffff',
                }}
              >
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <textarea
                    placeholder="Send a message"
                    rows={2}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontSize: '0.86rem',
                      fontFamily: 'inherit',
                      color: '#0f172a',
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                      <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <Smile size={18} />
                      </button>
                      <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <Paperclip size={18} />
                      </button>
                      <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: '#7c3aed', // Purple send button matching Image 2
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '7px 18px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: MY LEASE
      ========================================================================== */}
      {currentView === 'lease' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
              My Lease Agreement
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
              Official counter-signed tenancy terms, escrow deposit account, and renewal actions.
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
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Premises</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {tenancy.propertyName}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px' }}>
                {tenancy.location}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Lease Reference</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {tenancy.leaseReference}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                ● Active Lease
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Security Deposit Held</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                KES {tenancy.securityDeposit.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
                Segregated Escrow (Account 2100)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Expiry Date</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {tenancy.leaseExpires}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
                Annual Renewal Notice Required
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowRenewalModal(true)}
              style={{
                background: '#f27a59',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '0.84rem',
                fontWeight: 700,
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
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Submit Notice to Vacate
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: MAINTENANCE
      ========================================================================== */}
      {currentView === 'maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
                Maintenance Requests
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                Report unit repairs, track assigned technicians, and inspect resolution logs.
              </p>
            </div>
            <button
              onClick={() => setShowMaintenanceModal(true)}
              style={{
                background: '#f27a59',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 18px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              <span>Report New Issue</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {maintenanceTickets.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{t.id}</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{t.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        background: t.priority === 'Emergency' ? '#fee2e2' : t.priority === 'High' ? '#ffedd5' : '#f1f5f9',
                        color: t.priority === 'Emergency' ? '#dc2626' : t.priority === 'High' ? '#ea580c' : '#475569',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {t.priority}
                    </span>
                    <span
                      style={{
                        background: t.status === 'RESOLVED' || t.status === 'CLOSED' ? '#ecfdf5' : '#eff6ff',
                        color: t.status === 'RESOLVED' || t.status === 'CLOSED' ? '#059669' : '#2563eb',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  {t.lastUpdate}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f8fafc', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <span>Assigned: {t.assignedTo}</span>
                  <span>Reported: {t.reportedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: DOCUMENTS
      ========================================================================== */}
      {currentView === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
              My Rental Documents
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
              Counter-signed lease agreements, deposit certificates, and property inspection reports.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {documents.map((d) => (
              <div
                key={d.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f27a59', textTransform: 'uppercase' }}>
                      {d.category}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{d.size}</span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#131726', lineHeight: 1.35 }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Issued: {d.date}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => showToast(`Opening ${d.name}...`)}
                    style={{
                      flex: 1,
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '7px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#334155',
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => showToast(`Downloading ${d.name}...`)}
                    style={{
                      flex: 1,
                      background: '#f27a59',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: NOTIFICATIONS
      ========================================================================== */}
      {currentView === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
                Notifications
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                Important tenancy updates, rent receipts, and estate maintenance notices.
              </p>
            </div>
            <button
              onClick={() => showToast('All notifications marked as read.')}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Mark all as read
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f27a59', marginTop: '6px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#131726' }}>Rent payment confirmed (KES 27,500.00)</span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>1 Nov 2026</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Safaricom Daraja C2B V2 (Ref QJ92K81N2P) reconciled. Receipt RCP-2026-1101 ready in Documents.
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f27a59', marginTop: '6px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#131726' }}>Maintenance ticket REQ-0492 dispatched</span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>21 Nov 2026</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Technician Peter Kariuki assigned. Inspection scheduled tomorrow 10:00 AM - 12:00 PM.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 8: MY PROFILE
      ========================================================================== */}
      {currentView === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
              My Profile & Settings
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
              Personal contact records, emergency contacts, and account security.
            </p>
          </div>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Profile"
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{tenancy.tenantName}</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>{tenancy.email} · {tenancy.phone}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '10px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Full Legal Name</label>
                <input
                  type="text"
                  defaultValue={tenancy.tenantName}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Phone Number (M-Pesa)</label>
                <input
                  type="text"
                  defaultValue={tenancy.phone}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                onClick={() => showToast('Profile details updated successfully.')}
                style={{
                  background: '#f27a59',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 20px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          IMAGE 3: PERFORATED TICKET-STUB RECEIPT MODAL
      ========================================================================== */}
      {showReceiptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '420px',
              maxWidth: '95vw',
              background: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
              padding: '36px 32px 30px',
              textAlign: 'center',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowReceiptModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={16} />
            </button>

            {/* Top Confetti / Party Popper Icon matching Image 3 */}
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 14px',
                borderRadius: '50%',
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              🎉
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#131726', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Thank you
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 24px 0' }}>
              Your payment has been processed successfully.
            </p>

            {/* Perforated tear line with circular notches */}
            <div style={{ position: 'relative', margin: '24px -32px' }}>
              {/* Left semi-circle notch */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '36px',
                  borderRadius: '0 18px 18px 0',
                  background: 'rgba(15, 23, 42, 0.75)',
                }}
              />
              {/* Right semi-circle notch */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '36px',
                  borderRadius: '18px 0 0 18px',
                  background: 'rgba(15, 23, 42, 0.75)',
                }}
              />
              <div style={{ borderBottom: '2px dashed #cbd5e1', margin: '0 24px' }} />
            </div>

            {/* Ticket details grid matching Image 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'left', gap: '16px', margin: '20px 0 16px 0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                  TICKET ID
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#131726', marginTop: '2px' }}>
                  {receiptData.ticketId}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                  AMOUNT
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#131726', marginTop: '2px' }}>
                  {receiptData.amountUsd}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                DATE & TIME
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#131726', marginTop: '2px' }}>
                {receiptData.dateTime}
              </div>
            </div>

            {/* Payment Method Chip matching Image 3 */}
            <div
              style={{
                background: '#f0f4ff',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              {/* Mastercard interlocking circles */}
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '32px', height: '20px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#eb001b', opacity: 0.95 }} />
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f79e1b', opacity: 0.95, marginLeft: '-8px' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                  {receiptData.cardBrand}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Expiry: {receiptData.expiry}
                </div>
              </div>
            </div>

            {/* Authentic Barcode Graphic matching Image 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <svg width="220" height="38" viewBox="0 0 220 38" fill="none">
                <rect x="0" y="0" width="3" height="38" fill="#131726" />
                <rect x="6" y="0" width="2" height="38" fill="#131726" />
                <rect x="12" y="0" width="4" height="38" fill="#131726" />
                <rect x="18" y="0" width="1" height="38" fill="#131726" />
                <rect x="23" y="0" width="5" height="38" fill="#131726" />
                <rect x="31" y="0" width="2" height="38" fill="#131726" />
                <rect x="36" y="0" width="3" height="38" fill="#131726" />
                <rect x="42" y="0" width="1" height="38" fill="#131726" />
                <rect x="46" y="0" width="4" height="38" fill="#131726" />
                <rect x="53" y="0" width="2" height="38" fill="#131726" />
                <rect x="58" y="0" width="5" height="38" fill="#131726" />
                <rect x="66" y="0" width="1" height="38" fill="#131726" />
                <rect x="70" y="0" width="3" height="38" fill="#131726" />
                <rect x="76" y="0" width="2" height="38" fill="#131726" />
                <rect x="81" y="0" width="6" height="38" fill="#131726" />
                <rect x="90" y="0" width="2" height="38" fill="#131726" />
                <rect x="95" y="0" width="3" height="38" fill="#131726" />
                <rect x="101" y="0" width="1" height="38" fill="#131726" />
                <rect x="105" y="0" width="4" height="38" fill="#131726" />
                <rect x="112" y="0" width="2" height="38" fill="#131726" />
                <rect x="117" y="0" width="5" height="38" fill="#131726" />
                <rect x="125" y="0" width="2" height="38" fill="#131726" />
                <rect x="130" y="0" width="4" height="38" fill="#131726" />
                <rect x="137" y="0" width="1" height="38" fill="#131726" />
                <rect x="141" y="0" width="3" height="38" fill="#131726" />
                <rect x="147" y="0" width="2" height="38" fill="#131726" />
                <rect x="152" y="0" width="5" height="38" fill="#131726" />
                <rect x="160" y="0" width="2" height="38" fill="#131726" />
                <rect x="165" y="0" width="3" height="38" fill="#131726" />
                <rect x="171" y="0" width="1" height="38" fill="#131726" />
                <rect x="175" y="0" width="4" height="38" fill="#131726" />
                <rect x="182" y="0" width="2" height="38" fill="#131726" />
                <rect x="187" y="0" width="5" height="38" fill="#131726" />
                <rect x="195" y="0" width="1" height="38" fill="#131726" />
                <rect x="199" y="0" width="3" height="38" fill="#131726" />
                <rect x="205" y="0" width="2" height="38" fill="#131726" />
                <rect x="210" y="0" width="4" height="38" fill="#131726" />
                <rect x="217" y="0" width="3" height="38" fill="#131726" />
              </svg>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', fontFamily: 'monospace', color: '#131726', fontWeight: 600 }}>
                {receiptData.barcode}
              </span>
            </div>

            {/* Scalloped semicircles along bottom edge matching Image 3 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '24px -32px -30px',
                padding: '0 6px',
                overflow: 'hidden',
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '28px',
                    height: '16px',
                    borderRadius: '14px 14px 0 0',
                    background: 'rgba(15, 23, 42, 0.75)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          IMAGE 4: MODERN INVOICE PREVIEW MODAL
      ========================================================================== */}
      {showInvoiceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              width: '640px',
              maxWidth: '96vw',
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '92vh',
            }}
          >
            {/* Top Preview Bar matching Image 4 */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#ffffff',
              }}
            >
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#131726', margin: 0 }}>
                Preview
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => showToast('Downloading invoice PDF...')}
                  title="Download PDF"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => window.print()}
                  title="Print invoice"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  title="Close preview"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Clean Invoice Sheet matching Image 4 */}
            <div style={{ padding: '36px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Logo & Contact Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* Red/Black Modern Logo matching Image 4 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #1e1b4b 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '1rem',
                    }}
                  >
                    N
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    UNIT FLOW
                  </span>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                  <div>{invoiceData.senderEmail}</div>
                  <div>{invoiceData.senderPhone}</div>
                </div>
              </div>

              {/* Recipient & Invoice Meta Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                    RECIPIENT
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#131726', marginTop: '4px' }}>
                    {invoiceData.recipient.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, marginTop: '2px' }}>
                    {invoiceData.recipient.address}<br />
                    VAT no.: {invoiceData.recipient.vatNo}<br />
                    {invoiceData.recipient.email}<br />
                    {invoiceData.recipient.phone}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131726', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                    Invoice
                  </h1>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                    INVOICE NO.
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#131726', marginBottom: '6px' }}>
                    {invoiceData.invoiceNo}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                    INVOICE DATE
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#131726' }}>
                    {invoiceData.invoiceDate}
                  </div>
                </div>
              </div>

              {/* Items Table matching Image 4 */}
              <div style={{ marginTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', fontSize: '0.78rem', borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '8px 0', fontWeight: 500 }}>Task description</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'center' }}>Hours</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'right' }}>Rate</th>
                      <th style={{ padding: '8px 0', fontWeight: 500, textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '14px 0', color: '#2563eb', fontWeight: 500 }}>
                          {it.desc}
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', color: '#131726', fontWeight: 600 }}>
                          {it.hours}
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'right', color: '#131726' }}>
                          {it.rate} USD
                        </td>
                        <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: '#131726' }}>
                          {it.amount.toLocaleString()} USD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '0.84rem', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#131726' }}>{invoiceData.subtotal.toLocaleString()} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '0.84rem', color: '#64748b' }}>
                  <span>Discount 5%</span>
                  <span style={{ fontWeight: 700, color: '#131726' }}>{invoiceData.discountAmount} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '1.05rem', color: '#2563eb', fontWeight: 800, borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  <span>Total</span>
                  <span>{invoiceData.total.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Transfer Strip matching Image 4 */}
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '0.74rem', color: '#64748b', textAlign: 'center' }}>
                Transfer the amount to the business account below. Please include invoice number on your check.<br />
                <span style={{ fontWeight: 700, color: '#131726', marginTop: '4px', display: 'inline-block' }}>
                  BANK: {invoiceData.bank} &bull; IBAN: {invoiceData.iban}
                </span>
              </div>

              {/* Notes */}
              <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, color: '#131726', marginBottom: '2px' }}>NOTES</div>
                All amounts are in dollars. Please make the payment within 15 days from the issue of date of this invoice. Tax is not charged on the basis of paragraph 1 of Article 94 of the Value Added Tax Act (I am not liable for VAT).<br />
                Thank you for your confidence in my work.
              </div>

              {/* Footer matching Image 4 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px', fontSize: '0.7rem', color: '#94a3b8' }}>
                <div>NOVEN &bull; 2123 Hart Ridge Road, 12323 Gaines, MI</div>
                <div>The company is registered in the business register under no. 21250034</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OTHER OPERATIONAL MODALS
      ========================================================================== */}
      {/* Pay Modal */}
      {showPayModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>M-Pesa Paybill Instructions</h3>
              <button onClick={() => setShowPayModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.76rem', color: '#166534', fontWeight: 600 }}>Business Paybill Number:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>{tenancy.paybillNumber}</div>
              <div style={{ fontSize: '0.76rem', color: '#166534', fontWeight: 600, marginTop: '8px' }}>Account Reference:</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{tenancy.accountNumber}</div>
            </div>
            <button
              onClick={() => {
                setShowPayModal(false);
                showToast('Paybill details copied. Reconciled automatically within 60s.');
              }}
              style={{ width: '100%', background: '#059669', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 700, cursor: 'pointer' }}
            >
              Copy Details & Close
            </button>
          </div>
        </div>
      )}

      {/* Report Missing Payment Modal */}
      {showMissingPayModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Report Missing Payment</h3>
              <button onClick={() => setShowMissingPayModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px 0' }}>
              Enter your M-Pesa transaction reference or bank transfer slip for verification.
            </p>
            <input
              type="text"
              placeholder="e.g. QJ92K81N2P"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', textTransform: 'uppercase', marginBottom: '14px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowMissingPayModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  setShowMissingPayModal(false);
                  showToast('Payment submitted for accountant verification.');
                }}
                style={{ background: '#f27a59', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Reference
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Request Modal */}
      {showMaintenanceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Submit Maintenance Request</h3>
              <button onClick={() => setShowMaintenanceModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen tap mixer leaking"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Category</label>
                  <select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', marginTop: '4px' }}>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Doors & Locks</option>
                    <option>Appliances</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Priority</label>
                  <select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', marginTop: '4px' }}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue and technician access window..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setShowMaintenanceModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  setShowMaintenanceModal(false);
                  showToast('Maintenance request submitted and assigned to Caretaker.');
                }}
                style={{ background: '#f27a59', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lease Renewal Modal */}
      {showRenewalModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 800 }}>Request Lease Renewal</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
              Your current lease expires on {tenancy.leaseExpires}. Requesting renewal will notify Greenview Property Holdings Ltd to issue successor terms.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setShowRenewalModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  setShowRenewalModal(false);
                  showToast('Renewal request transmitted to property manager.');
                }}
                style={{ background: '#f27a59', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Renewal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice to Vacate Modal */}
      {showVacateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>Notice to Vacate</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
              A 30-day statutory notice is required. Move-out inspection will assess security deposit refund deductions.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setShowVacateModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  setShowVacateModal(false);
                  showToast('Notice to vacate submitted. Move-out inspection initiated.');
                }}
                style={{ background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}
              >
                Confirm Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
