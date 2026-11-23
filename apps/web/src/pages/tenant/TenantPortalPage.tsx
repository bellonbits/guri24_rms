import React, { useState, useEffect, useMemo } from 'react';
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
  RefreshCw,
  Building,
  Tv,
  Video,
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Users,
  DollarSign,
  Megaphone,
  Award,
  Wallet,
  Percent,
  BarChart3,
  Share2,
  Sliders,
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
  const currentView = useMemo(() => {
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

  // Persistent Tenancy State
  const [tenancy, setTenancy] = useState(() => {
    try {
      const saved = localStorage.getItem('unitflow_tenant_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      tenantName: 'Amina Wanjiku',
      phone: '+254 722 000 492',
      email: 'amina.wanjiku@unitflow.ke',
      nationalId: '29849201',
      kraPin: 'A012984920X',
      propertyName: 'Greenview Apartments',
      location: 'Block A · Unit A-204 · Ruiru',
      unitNumber: 'Unit A-204',
      unitType: '2 Bedroom Master Ensuite',
      block: 'Block A',
      town: 'Ruiru, Kiambu County',
      leaseReference: 'UF-LS-2026-A204',
      leaseStatus: 'Active Lease',
      monthlyRent: 25000,
      serviceCharge: 2500,
      securityDeposit: 25000,
      outstandingBalance: 0,
      nextDueDate: '1 Dec 2026',
      leaseStart: '1 Jan 2026',
      leaseExpires: '31 Dec 2026',
      paybillNumber: '247247',
      accountNumber: 'GRE-A204',
      landlordName: 'Greenview Property Holdings Ltd',
      managerName: 'Katherine Moss',
      managerPhone: '+254 722 000 111',
      managerEmail: 'management@unitflow.ke',
      caretakerName: 'Peter Kariuki',
      caretakerPhone: '+254 711 223 344',
      emergencyContactName: 'James Mwangi',
      emergencyContactPhone: '+254 733 998 877',
      smsTwoFactor: true,
      emailNotifications: true,
    };
  });

  // Save tenancy changes
  useEffect(() => {
    try {
      localStorage.setItem('unitflow_tenant_profile', JSON.stringify(tenancy));
    } catch {
      // ignore
    }
  }, [tenancy]);

  // Currency toggle state: USD vs KES
  const [currencyMode, setCurrencyMode] = useState<'KES' | 'USD'>('KES');

  // Format currency helper
  const fmt = (amountKes: number, amountUsd?: number) => {
    if (currencyMode === 'USD') {
      const val = amountUsd !== undefined ? amountUsd : amountKes / 130;
      return `$ ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `KES ${amountKes.toLocaleString()}`;
  };

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real Ledger Transactions matching Image 1
  const [ledgerTransactions, setLedgerTransactions] = useState([
    {
      id: 'tx-001',
      date: '1 Nov 2026',
      type: 'Rent Payment',
      typeColor: '#15803d',
      typeBg: '#dcfce7',
      source: 'M-Pesa Daraja C2B',
      amountKes: 27500,
      amountUsd: 211.54,
      isPayment: true,
      balanceKes: 0,
      balanceUsd: 0.0,
      receiptNo: 'RCP-2026-1101',
      ticketId: '0120077398910288',
      mpesaRef: 'QKH782910X',
      description: 'Rent & Service Charge (Nov 2026)',
    },
    {
      id: 'tx-002',
      date: '1 Nov 2026',
      type: 'Monthly Rent',
      typeColor: '#2563eb',
      typeBg: '#dbeafe',
      source: 'Property Management',
      amountKes: 25000,
      amountUsd: 192.31,
      isPayment: false,
      balanceKes: 25000,
      balanceUsd: 192.31,
      receiptNo: 'INV-2026-1101',
      ticketId: '0120077398910287',
      mpesaRef: 'INV-A204-11',
      description: 'Standard Monthly Lease Commitment',
    },
    {
      id: 'tx-003',
      date: '1 Nov 2026',
      type: 'Service Charge',
      typeColor: '#9333ea',
      typeBg: '#f3e8ff',
      source: 'Estate Facilities',
      amountKes: 2500,
      amountUsd: 19.23,
      isPayment: false,
      balanceKes: 27500,
      balanceUsd: 211.54,
      receiptNo: 'SC-2026-1101',
      ticketId: '0120077398910286',
      mpesaRef: 'SC-A204-11',
      description: '24/7 Security, Garbage & Common Amenities',
    },
    {
      id: 'tx-004',
      date: '15 Oct 2026',
      type: 'Water',
      typeColor: '#0d9488',
      typeBg: '#ccfbf1',
      source: 'Metrix Utility',
      amountKes: 1586,
      amountUsd: 12.2,
      isPayment: false,
      balanceKes: 1586,
      balanceUsd: 12.2,
      receiptNo: 'WTR-2026-1015',
      ticketId: '0120077398910285',
      mpesaRef: 'WTR-MTR-204',
      description: 'Meter Reading M-204 Consumption (14 Units)',
    },
    {
      id: 'tx-005',
      date: '1 Oct 2026',
      type: 'Rent Payment',
      typeColor: '#15803d',
      typeBg: '#dcfce7',
      source: 'M-Pesa Daraja C2B',
      amountKes: 27500,
      amountUsd: 211.54,
      isPayment: true,
      balanceKes: 0,
      balanceUsd: 0.0,
      receiptNo: 'RCP-2026-1001',
      ticketId: '0120077398910284',
      mpesaRef: 'QJ92K81N2P',
      description: 'Rent & Service Charge (Oct 2026)',
    },
    {
      id: 'tx-006',
      date: '1 Oct 2026',
      type: 'Monthly Rent',
      typeColor: '#2563eb',
      typeBg: '#dbeafe',
      source: 'Property Management',
      amountKes: 25000,
      amountUsd: 192.31,
      isPayment: false,
      balanceKes: 25000,
      balanceUsd: 192.31,
      receiptNo: 'INV-2026-1001',
      ticketId: '0120077398910283',
      mpesaRef: 'INV-A204-10',
      description: 'Standard Monthly Lease Commitment',
    },
    {
      id: 'tx-007',
      date: '1 Oct 2026',
      type: 'Trash Removal',
      typeColor: '#ea580c',
      typeBg: '#ffedd5',
      source: 'Greenview Sanitization',
      amountKes: 500,
      amountUsd: 3.85,
      isPayment: false,
      balanceKes: 500,
      balanceUsd: 3.85,
      receiptNo: 'TR-2026-1001',
      ticketId: '0120077398910282',
      mpesaRef: 'TR-A204-10',
      description: 'Monthly Waste Management & Sorting',
    },
  ]);

  // Transaction filter
  const [ledgerFilter, setLedgerFilter] = useState('All');
  const filteredTransactions = useMemo(() => {
    if (ledgerFilter === 'Payments') return ledgerTransactions.filter((t) => t.isPayment);
    if (ledgerFilter === 'Charges') return ledgerTransactions.filter((t) => !t.isPayment);
    return ledgerTransactions;
  }, [ledgerTransactions, ledgerFilter]);

  // Auto payments schedule
  const autoPayments = [
    { id: 1, title: 'Charge - Monthly Rent (Unit A-204)', date: 'Due 1 Dec 2026', amountKes: 25000, amountUsd: 192.31 },
    { id: 2, title: 'Charge - Estate Service Charge', date: 'Due 1 Dec 2026', amountKes: 2500, amountUsd: 19.23 },
    { id: 3, title: 'Charge - Water Utility Consumption', date: 'Due 15 Dec 2026', amountKes: 1586, amountUsd: 12.2 },
    { id: 4, title: 'Charge - Waste & Trash Removal', date: 'Due 1 Dec 2026', amountKes: 500, amountUsd: 3.85 },
  ];

  // Real Contacts & Conversations matching Image 2
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
      phone: '+254 722 000 111',
    },
    {
      id: 'peter',
      name: 'Peter Kariuki',
      handle: '@peter',
      role: 'Estate Caretaker & Maintenance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      online: true,
      lastMessage: 'Tap replacement parts arrived. Will be at Unit A-204 tomorrow 10:00 AM.',
      time: '5min ago',
      unread: true,
      phone: '+254 711 223 344',
    },
    {
      id: 'daniel',
      name: 'Daniel Ochieng',
      handle: '@daniel',
      role: 'Head of Accounts & Billing',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      online: false,
      lastMessage: 'M-Pesa payment QKH782910X verified and reconciled to Account 2100.',
      time: '1hr ago',
      unread: false,
      phone: '+254 720 334 455',
    },
    {
      id: 'rosalee',
      name: 'Rosalee Melvin',
      handle: '@rosalee',
      role: 'Front Gate Security Concierge',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
      online: false,
      lastMessage: 'Courier parcel delivered at the gate guardhouse for Unit A-204.',
      time: '2hr ago',
      unread: false,
      phone: '+254 799 112 233',
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] = useState('kathy');
  const [searchContact, setSearchContact] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchContact.trim()) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
        c.role.toLowerCase().includes(searchContact.toLowerCase()) ||
        c.handle.toLowerCase().includes(searchContact.toLowerCase())
    );
  }, [conversations, searchContact]);

  // Real Chat Messages Threads
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Array<{
    id: string;
    sender: string;
    avatar?: string;
    text: string;
    time: string;
    isMe: boolean;
    attachment?: { name: string; size: string; url?: string };
    reactions?: string[];
  }>>>({
    kathy: [
      {
        id: 'msg-k1',
        sender: 'Katherine Moss',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Hello Amina! I reviewed your annual lease renewal questionnaire. Everything looks in order.',
        time: 'Thursday 11:40am',
        isMe: false,
      },
      {
        id: 'msg-k2',
        sender: 'Katherine Moss',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        text: "I've uploaded the draft lease renewal and the move-in inspection verification document for your records.",
        time: 'Thursday 11:40am',
        isMe: false,
        attachment: {
          name: 'Tech requirements.pdf',
          size: '1.2 MB',
        },
      },
      {
        id: 'msg-k3',
        sender: 'You',
        text: "Awesome! Thanks Katherine. I'll review and countersign it today.",
        time: 'Thursday 11:41am',
        isMe: true,
      },
      {
        id: 'msg-k4',
        sender: 'Katherine Moss',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'No rush though — caretaker Peter is also scheduled to service the kitchen tap tomorrow.',
        time: 'Thursday 11:44am',
        isMe: false,
      },
      {
        id: 'msg-k5',
        sender: 'Katherine Moss',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Hey Amina, can you please confirm if tomorrow 10:00 AM works for you for the maintenance visit?',
        time: 'Today 2:20pm',
        isMe: false,
      },
      {
        id: 'msg-k6',
        sender: 'You',
        text: "Sure thing, I'll be home. 10:00 AM works perfectly!",
        time: 'Just now',
        isMe: true,
        reactions: ['❤️', '👏'],
      },
    ],
    peter: [
      {
        id: 'msg-p1',
        sender: 'Peter Kariuki',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Good morning Amina. I picked up the original Coburn mixer cartridge for ticket REQ-0492.',
        time: 'Today 8:30am',
        isMe: false,
      },
      {
        id: 'msg-p2',
        sender: 'You',
        text: 'Thank you Peter. Please check the shutoff valve underneath the sink as well.',
        time: 'Today 8:45am',
        isMe: true,
      },
    ],
    daniel: [
      {
        id: 'msg-d1',
        sender: 'Daniel Ochieng',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Confirming receipt of M-Pesa KES 27,500.00 (Ref QKH782910X). Your rent and service charge are settled.',
        time: '1 Nov 2026',
        isMe: false,
      },
    ],
    rosalee: [
      {
        id: 'msg-r1',
        sender: 'Rosalee Melvin',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Hi Amina, your DHL document delivery has been logged at reception. You can collect it anytime.',
        time: 'Yesterday 4:00pm',
        isMe: false,
      },
    ],
  });

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const currentChatUser = conversations.find((c) => c.id === selectedConversationId) || conversations[0];
  const activeMessages = messagesByThread[selectedConversationId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const outgoingText = chatInput.trim();
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: outgoingText,
      time: 'Just now',
      isMe: true,
    };

    setMessagesByThread((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMsg],
    }));
    setChatInput('');

    // Trigger realistic auto-reply after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: currentChatUser.name,
        avatar: currentChatUser.avatar,
        text: `Got it, Amina. I have noted this in your tenancy records for Unit A-204.`,
        time: 'Just now',
        isMe: false,
      };
      setMessagesByThread((prev) => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), replyMsg],
      }));
    }, 1800);
  };

  // Maintenance Tickets State
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    {
      id: 'REQ-0492',
      title: 'Kitchen sink mixer tap leaking',
      category: 'Plumbing',
      priority: 'High',
      status: 'IN_PROGRESS',
      reportedDate: '21 Nov 2026',
      assignedTo: 'Peter Kariuki (Lead Caretaker)',
      phone: '+254 711 223 344',
      preferredAccess: 'Morning (10:00 AM - 12:00 PM)',
      description: 'Continuous dripping from the mixer cartridge causing water accumulation on the counter.',
      stages: [
        { name: 'Submitted', done: true, time: '21 Nov, 8:15 AM' },
        { name: 'Under Review', done: true, time: '21 Nov, 9:00 AM' },
        { name: 'Assigned', done: true, time: '21 Nov, 10:30 AM' },
        { name: 'In Progress', done: true, time: '22 Nov, 8:30 AM' },
        { name: 'Resolved', done: false, time: 'Pending completion' },
        { name: 'Closed', done: false, time: 'Pending sign-off' },
      ],
      stageIndex: 3,
    },
    {
      id: 'REQ-0481',
      title: 'Balcony sliding door latch sticking',
      category: 'Doors & Locks',
      priority: 'Medium',
      status: 'RESOLVED',
      reportedDate: '10 Nov 2026',
      assignedTo: 'James Macharia (Carpentry)',
      phone: '+254 722 554 433',
      preferredAccess: 'Afternoon (2:00 PM - 5:00 PM)',
      description: 'Sliding latch was stiff and required forceful pushing to lock.',
      stages: [
        { name: 'Submitted', done: true, time: '10 Nov' },
        { name: 'Under Review', done: true, time: '10 Nov' },
        { name: 'Assigned', done: true, time: '11 Nov' },
        { name: 'In Progress', done: true, time: '11 Nov' },
        { name: 'Resolved', done: true, time: '12 Nov' },
        { name: 'Closed', done: true, time: '12 Nov' },
      ],
      stageIndex: 5,
    },
    {
      id: 'REQ-0419',
      title: 'Instant shower circuit breaker tripping',
      category: 'Electrical',
      priority: 'Emergency',
      status: 'CLOSED',
      reportedDate: '18 Oct 2026',
      assignedTo: 'Apex Electrical Services Ltd',
      phone: '+254 700 889 900',
      preferredAccess: 'Immediate / Emergency',
      description: 'Breaker tripped whenever high heat was engaged on the shower heater.',
      stages: [
        { name: 'Submitted', done: true, time: '18 Oct' },
        { name: 'Under Review', done: true, time: '18 Oct' },
        { name: 'Assigned', done: true, time: '18 Oct' },
        { name: 'In Progress', done: true, time: '18 Oct' },
        { name: 'Resolved', done: true, time: '19 Oct' },
        { name: 'Closed', done: true, time: '19 Oct' },
      ],
      stageIndex: 5,
    },
  ]);

  const [ticketFilter, setTicketFilter] = useState('ALL');
  const filteredTickets = useMemo(() => {
    if (ticketFilter === 'IN_PROGRESS') return maintenanceTickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'SUBMITTED');
    if (ticketFilter === 'RESOLVED') return maintenanceTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED');
    return maintenanceTickets;
  }, [maintenanceTickets, ticketFilter]);

  // Selected ticket for detailed view modal
  const [selectedTicket, setSelectedTicket] = useState<typeof maintenanceTickets[0] | null>(null);

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: 'Plumbing',
    priority: 'High',
    preferredAccess: 'Morning (9:00 AM - 12:00 PM)',
    description: '',
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title.trim()) return;

    const created = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicket.title.trim(),
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'SUBMITTED',
      reportedDate: 'Today',
      assignedTo: 'Property Office (Dispatch Pending)',
      phone: tenancy.managerPhone,
      preferredAccess: newTicket.preferredAccess,
      description: newTicket.description || 'Issue submitted via Tenant Self-Service Portal.',
      stages: [
        { name: 'Submitted', done: true, time: 'Just now' },
        { name: 'Under Review', done: false, time: 'Pending review' },
        { name: 'Assigned', done: false, time: 'Pending dispatch' },
        { name: 'In Progress', done: false, time: 'Pending start' },
        { name: 'Resolved', done: false, time: 'Pending resolution' },
        { name: 'Closed', done: false, time: 'Pending inspection' },
      ],
      stageIndex: 0,
    };

    setMaintenanceTickets([created, ...maintenanceTickets]);
    setShowMaintenanceModal(false);
    setNewTicket({
      title: '',
      category: 'Plumbing',
      priority: 'High',
      preferredAccess: 'Morning (9:00 AM - 12:00 PM)',
      description: '',
    });
    showToast(`Ticket ${created.id} submitted! Caretaker will contact you shortly.`);
  };

  const handleConfirmResolved = (ticketId: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED', stageIndex: 4 } : t))
    );
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: 'RESOLVED', stageIndex: 4 } : null));
    }
    showToast(`Ticket ${ticketId} marked as RESOLVED by tenant.`);
  };

  const handleReopenTicket = (ticketId: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'IN_PROGRESS', stageIndex: 3 } : t))
    );
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: 'IN_PROGRESS', stageIndex: 3 } : null));
    }
    showToast(`Ticket ${ticketId} reopened and escalated to Caretaker.`);
  };

  // Real Documents Vault
  const documents = [
    {
      id: 'doc-lease',
      name: 'Residential Lease Agreement (2026)',
      category: 'Lease Agreement',
      date: '1 Jan 2026',
      size: '2.4 MB',
      type: 'PDF',
      description: 'Official bilateral tenancy agreement between Greenview Property Holdings Ltd and Amina Wanjiku.',
    },
    {
      id: 'doc-deposit',
      name: 'Security Deposit Escrow Receipt (Account 2100)',
      category: 'Deposit Certificate',
      date: '28 Dec 2025',
      size: '480 KB',
      type: 'PDF',
      description: 'KES 25,000.00 held in statutory segregated liability escrow pursuant to Kenyan Landlord & Tenant law.',
    },
    {
      id: 'doc-inspection',
      name: 'Move-in Inventory & Condition Report (Unit A-204)',
      category: 'Inspection Report',
      date: '1 Jan 2026',
      size: '4.8 MB',
      type: 'PDF',
      description: 'Photographic inventory and fixture checklist counter-signed at handover.',
    },
    {
      id: 'doc-rules',
      name: 'Greenview Estate House Rules & Amenities Policy',
      category: 'Estate Rules',
      date: '1 Jan 2026',
      size: '1.2 MB',
      type: 'PDF',
      description: 'Rules regarding parking slot P-204, quiet hours (10:00 PM), and gym/swimming access.',
    },
  ];

  // Document preview modal state
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);

  // Modals state
  const [showPayModal, setShowPayModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [showMissingPayModal, setShowMissingPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Modern Operations Dashboard States (Reference Screenshot)
  const [dashboardMode, setDashboardMode] = useState<'operations' | 'residence'>('operations');
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showProductUploadModal, setShowProductUploadModal] = useState(false);
  const [showSalesChannelModal, setShowSalesChannelModal] = useState(false);
  const [selectedAssistantTile, setSelectedAssistantTile] = useState<{
    title: string;
    subtitle: string;
    details: string;
    actionText: string;
    icon: string;
  } | null>(null);

  // Ticket Receipt Data
  const [activeReceipt, setActiveReceipt] = useState({
    ticketId: '0120077398910288',
    mpesaRef: 'QKH782910X',
    amountKes: 27500,
    amountUsd: 211.54,
    dateTime: '01 NOV, 2026 | 09:14 AM',
    paybill: '247247',
    account: 'GRE-A204',
    cardBrand: 'Mastercard ending in 4567',
    expiry: '10/27',
    barcode: '400600890050002070013',
    purpose: 'Monthly Lease & Estate Service Charge',
  });

  const handleOpenReceipt = (t?: typeof ledgerTransactions[0]) => {
    if (t) {
      setActiveReceipt({
        ticketId: t.ticketId,
        mpesaRef: t.mpesaRef,
        amountKes: t.amountKes,
        amountUsd: t.amountUsd,
        dateTime: `${t.date} | 09:14 AM`,
        paybill: tenancy.paybillNumber,
        account: tenancy.accountNumber,
        cardBrand: 'Mastercard ending in 4567',
        expiry: '10/27',
        barcode: '400600890050002070013',
        purpose: t.description,
      });
    }
    setShowReceiptModal(true);
  };

  // Invoice Data
  const [activeInvoice, setActiveInvoice] = useState({
    invoiceNo: 'UF-INV-2026-1102',
    invoiceDate: 'November 1, 2026',
    dueDate: 'December 1, 2026',
    recipient: {
      name: tenancy.tenantName,
      address: `${tenancy.propertyName}, ${tenancy.location}`,
      county: tenancy.town,
      kraPin: tenancy.kraPin,
      email: tenancy.email,
      phone: tenancy.phone,
    },
    items: [
      { desc: `Monthly Rent — ${tenancy.unitNumber} (${tenancy.unitType})`, qty: '1 Mo', rateKes: 25000, amountKes: 25000, rateUsd: 192.31, amountUsd: 192.31 },
      { desc: 'Estate Service Charge, 24/7 Guards & Common Lighting', qty: '1 Mo', rateKes: 2500, amountKes: 2500, rateUsd: 19.23, amountUsd: 19.23 },
      { desc: 'Metrix Water Utility Surcharge (Meter M-204)', qty: '14 Units', rateKes: 1586, amountKes: 1586, rateUsd: 12.2, amountUsd: 12.2 },
      { desc: 'Waste Removal & Bi-Weekly Sanitation', qty: '1 Mo', rateKes: 500, amountKes: 500, rateUsd: 3.85, amountUsd: 3.85 },
    ],
    subtotalKes: 29586,
    subtotalUsd: 227.59,
    discountKes: 2086,
    discountUsd: 16.05,
    totalKes: 27500,
    totalUsd: 211.54,
  });

  const handleOpenInvoice = (t?: typeof ledgerTransactions[0]) => {
    setActiveInvoice((prev) => ({
      ...prev,
      recipient: {
        name: tenancy.tenantName,
        address: `${tenancy.propertyName}, ${tenancy.location}`,
        county: tenancy.town,
        kraPin: tenancy.kraPin,
        email: tenancy.email,
        phone: tenancy.phone,
      },
    }));
    setShowInvoiceModal(true);
  };

  // Functional simulated M-Pesa payment
  const [simPhone, setSimPhone] = useState(tenancy.phone);
  const [simAmount, setSimAmount] = useState('27500');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPayModal(false);

      const generatedCode = `QK${Math.floor(10000000 + Math.random() * 90000000)}X`;
      const numAmount = parseInt(simAmount, 10) || 27500;

      const newTx = {
        id: `tx-${Date.now()}`,
        date: 'Today',
        type: 'Rent Payment',
        typeColor: '#15803d',
        typeBg: '#dcfce7',
        source: 'M-Pesa Daraja C2B',
        amountKes: numAmount,
        amountUsd: numAmount / 130,
        isPayment: true,
        balanceKes: 0,
        balanceUsd: 0.0,
        receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ticketId: `0120077398910${Math.floor(100 + Math.random() * 900)}`,
        mpesaRef: generatedCode,
        description: 'Instant Lipa Na M-Pesa C2B Settled',
      };

      setLedgerTransactions([newTx, ...ledgerTransactions]);
      showToast(`M-Pesa payment of KES ${numAmount.toLocaleString()} (Ref: ${generatedCode}) verified and settled!`);
      handleOpenReceipt(newTx);
    }, 2200);
  };

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    tenantName: tenancy.tenantName,
    phone: tenancy.phone,
    email: tenancy.email,
    nationalId: tenancy.nationalId,
    emergencyContactName: tenancy.emergencyContactName,
    emergencyContactPhone: tenancy.emergencyContactPhone,
    smsTwoFactor: tenancy.smsTwoFactor,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setTenancy((prev) => ({
      ...prev,
      tenantName: profileForm.tenantName,
      phone: profileForm.phone,
      email: profileForm.email,
      nationalId: profileForm.nationalId,
      emergencyContactName: profileForm.emergencyContactName,
      emergencyContactPhone: profileForm.emergencyContactPhone,
      smsTwoFactor: profileForm.smsTwoFactor,
    }));
    showToast('Tenant profile details updated and saved successfully!');
  };

  // Functional Download helper
  const handleDownloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded ${filename}`);
  };

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
            zIndex: 150,
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
          SECTION 1: OVERVIEW DASHBOARD (REFERENCE SCREENSHOT DESIGN)
      ========================================================================== */}
      {currentView === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Header Switcher & Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', background: '#ffffff', padding: '4px', borderRadius: '12px', border: '1px solid #edf0f7', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <button
                type="button"
                onClick={() => setDashboardMode('operations')}
                style={{
                  border: 'none',
                  background: dashboardMode === 'operations' ? '#fff0f3' : 'transparent',
                  color: dashboardMode === 'operations' ? '#ff4b72' : '#64748b',
                  fontWeight: dashboardMode === 'operations' ? 700 : 500,
                  fontSize: '0.84rem',
                  padding: '7px 16px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Operations Dashboard
              </button>
              <button
                type="button"
                onClick={() => setDashboardMode('residence')}
                style={{
                  border: 'none',
                  background: dashboardMode === 'residence' ? '#fff0f3' : 'transparent',
                  color: dashboardMode === 'residence' ? '#ff4b72' : '#64748b',
                  fontWeight: dashboardMode === 'residence' ? 700 : 500,
                  fontSize: '0.84rem',
                  padding: '7px 16px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Residence Overview
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleOpenReceipt()}
                style={{
                  background: '#ffffff',
                  color: '#475569',
                  border: '1px solid #edf0f7',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <span>🎟️ Latest Receipt</span>
              </button>
              <button
                onClick={() => handleOpenInvoice()}
                style={{
                  background: 'linear-gradient(135deg, #ff5b79 0%, #ff758c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(255, 91, 121, 0.25)',
                }}
              >
                <span>📄 Preview Invoice</span>
              </button>
            </div>
          </div>

          {/* MODE 1: Operations Dashboard matching Reference Screenshot */}
          {dashboardMode === 'operations' && (
            <>
              {/* TOP ONBOARDING CARD: "Well begun is half done" */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '28px 32px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  border: '1px solid #f1f4fb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '24px',
                }}
              >
                {/* Left Text */}
                <div style={{ minWidth: '260px', flex: '1 1 280px' }}>
                  <h1
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: '#ff4b72', // Coral Rose headline from image
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Well begun is half done
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                    Complete the following steps to sell
                  </p>
                </div>

                {/* Right: 3 Gradient Step Cards */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    flex: '2 1 600px',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Step 1: Certification */}
                  <div
                    style={{
                      flex: '1 1 180px',
                      minWidth: '180px',
                      maxWidth: '220px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #ff6b8b 0%, #ff8e9b 100%)',
                      color: '#ffffff',
                      padding: '16px 18px',
                      boxShadow: '0 8px 20px rgba(255, 107, 139, 0.28)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '84px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                        1.certification
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCertificationModal(true)}
                        style={{
                          background: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '3px 12px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          transition: 'transform 0.1s ease',
                        }}
                      >
                        GO
                      </button>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.25 }}>
                      Upload qualification information
                    </span>
                  </div>

                  {/* Step 2: Upload a product */}
                  <div
                    style={{
                      flex: '1 1 180px',
                      minWidth: '180px',
                      maxWidth: '220px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)',
                      color: '#ffffff',
                      padding: '16px 18px',
                      boxShadow: '0 8px 20px rgba(79, 172, 254, 0.28)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '84px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                        2.Upload a product
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowProductUploadModal(true)}
                        style={{
                          background: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '3px 12px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          transition: 'transform 0.1s ease',
                        }}
                      >
                        GO
                      </button>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.25 }}>
                      Fill in product information
                    </span>
                  </div>

                  {/* Step 3: Open for sale */}
                  <div
                    style={{
                      flex: '1 1 180px',
                      minWidth: '180px',
                      maxWidth: '220px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #a18cd1 0%, #c394fc 100%)',
                      color: '#ffffff',
                      padding: '16px 18px',
                      boxShadow: '0 8px 20px rgba(161, 140, 209, 0.28)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '84px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                        3.Open for sale
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSalesChannelModal(true)}
                        style={{
                          background: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '3px 12px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          transition: 'transform 0.1s ease',
                        }}
                      >
                        GO
                      </button>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.25 }}>
                      Choose to open any sales channel
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: "Today's data" */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Today's data
                  </h2>
                  <button
                    type="button"
                    onClick={() => setDashboardMode('residence')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ff4b72',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    More
                  </button>
                </div>

                {/* Top 4 Colorful Metric Cards with Circular Badge Icons */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {/* Card 1: Payment amount (Pastel Pink) */}
                  <div
                    style={{
                      background: '#fff0f3',
                      border: '1px solid #ffe4ea',
                      borderRadius: '18px',
                      padding: '22px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                        Payment amount
                      </div>
                      <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        8,992
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                        Yesterday 8638
                      </div>
                    </div>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#ff4b72',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        boxShadow: '0 4px 12px rgba(255, 75, 114, 0.3)',
                        flexShrink: 0,
                      }}
                    >
                      ¥
                    </div>
                  </div>

                  {/* Card 2: Payment order (Pastel Blue) */}
                  <div
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #dbeafe',
                      borderRadius: '18px',
                      padding: '22px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                        Payment order
                      </div>
                      <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        793
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                        Yesterday 753
                      </div>
                    </div>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={20} />
                    </div>
                  </div>

                  {/* Card 3: Paying customer (Pastel Purple) */}
                  <div
                    style={{
                      background: '#f5f3ff',
                      border: '1px solid #ede9fe',
                      borderRadius: '18px',
                      padding: '22px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                        Paying customer
                      </div>
                      <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        280
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                        Yesterday 320
                      </div>
                    </div>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#8b5cf6',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        flexShrink: 0,
                      }}
                    >
                      <Users size={20} />
                    </div>
                  </div>

                  {/* Card 4: Pending orders (Pastel Mint Green) */}
                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #d1fae5',
                      borderRadius: '18px',
                      padding: '22px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                        Pending orders
                      </div>
                      <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        480
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                        Yesterday 470
                      </div>
                    </div>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#10b981',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        flexShrink: 0,
                      }}
                    >
                      <Truck size={20} />
                    </div>
                  </div>
                </div>

                {/* Bottom 4 Clean White Metric Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div style={{ background: '#ffffff', border: '1px solid #f1f4fb', borderRadius: '18px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                    <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                      Live stream viewers
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      23,466
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                      Yesterday 22089
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #f1f4fb', borderRadius: '18px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                    <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                      New attention
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      4,890
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                      Yesterday 3800
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #f1f4fb', borderRadius: '18px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                    <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                      Cumulative attention
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      135,743
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                      Yesterday 130493
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #f1f4fb', borderRadius: '18px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                    <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
                      Number of orders
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      5,249
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '8px' }}>
                      Yesterday 4680
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: "Operations Assistant" */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Operations Assistant
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'All Operations Assistant Tools',
                        subtitle: 'Comprehensive Property & Store Capabilities',
                        details: 'Access live broadcast, mini program deployment, referral network, and automated marketing tools.',
                        actionText: 'Explore All Tools',
                        icon: 'sparkles',
                      });
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ff4b72',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    More
                  </button>
                </div>

                {/* 8 Action Tiles (2 rows x 4 columns) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {/* Tile 1: Small telecast live */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Small telecast live',
                        subtitle: 'Live sales in WeChat / Virtual Walkthrough',
                        details: 'Broadcast live HD walkthroughs of available penthouse units and scheduled maintenance demonstrations directly to registered residents and prospects.',
                        actionText: 'Launch Live Telecast',
                        icon: 'tv',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#fff0f3',
                        color: '#ff4b72',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Tv size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Small telecast live
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        Live sales in WeChat
                      </div>
                    </div>
                  </div>

                  {/* Tile 2: Mini Program Store */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Mini Program Store',
                        subtitle: 'WeChat Mini Program Store / Resident Portal',
                        details: 'Enable seamless one-tap tenant payments, guest gate clearances, and amenity booking directly from mobile WeChat / WhatsApp mini apps.',
                        actionText: 'Open Mini Program Config',
                        icon: 'smartphone',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#ecfdf5',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Mini Program Store
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        WeChat Mini Program Store
                      </div>
                    </div>
                  </div>

                  {/* Tile 3: Distribution market */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Distribution market',
                        subtitle: 'One-click promotion & Multi-channel Syndication',
                        details: 'Syndicate your property listings to leading rental portals and referral brokers with automated inventory sync and lease commission tracking.',
                        actionText: 'Manage Distribution Channels',
                        icon: 'share',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#eff6ff',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Share2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Distribution market
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        One-click promotion
                      </div>
                    </div>
                  </div>

                  {/* Tile 4: Coupon */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Coupon',
                        subtitle: 'Store marketing essentials & Rent Credits',
                        details: 'Issue early-payment discounts, move-in fee vouchers, and parking concession coupons with automated ledger balancing.',
                        actionText: 'Generate Coupon Code',
                        icon: 'tag',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#fff0f3',
                        color: '#ff4b72',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Tag size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Coupon
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        Store marketing essentials
                      </div>
                    </div>
                  </div>

                  {/* Tile 5: Store construction */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Store construction',
                        subtitle: 'Custom branding & Portal Themes',
                        details: 'Customize tenant portal layouts, color palettes, custom subdomains, and legal agreement templates with real-time preview.',
                        actionText: 'Customize Portal Theme',
                        icon: 'store',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#eff6ff',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Store size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Store construction
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        Can be customized
                      </div>
                    </div>
                  </div>

                  {/* Tile 6: Promoting ads */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Promoting ads',
                        subtitle: 'WeChat billion-level exposure & Meta Ads',
                        details: 'Deploy AI-optimized digital billboard ads across search and social channels to fill vacant units 3x faster with qualified tenants.',
                        actionText: 'Launch Ad Campaign',
                        icon: 'megaphone',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#fff0f3',
                        color: '#ff4b72',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Promoting ads
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        WeChat billion-level exposure
                      </div>
                    </div>
                  </div>

                  {/* Tile 7: Promotion rebate */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Promotion rebate',
                        subtitle: 'Help you sell goods / Tenant Referrals',
                        details: 'Incentivize existing tenants to refer friends and colleagues with verified rent rebate discounts upon lease execution.',
                        actionText: 'Set Referral Rebates',
                        icon: 'award',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#fff0f3',
                        color: '#ff4b72',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Award size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Promotion rebate
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        Help you sell goods
                      </div>
                    </div>
                  </div>

                  {/* Tile 8: Asset Management */}
                  <div
                    onClick={() => {
                      setSelectedAssistantTile({
                        title: 'Asset Management',
                        subtitle: 'Income and withdrawal / Escrow Management',
                        details: 'Automated M-Pesa B2C disbursements, landlord rent remittances, security deposit trust fund yields, and audit-ready financial statements.',
                        actionText: 'Open Asset Dashboard',
                        icon: 'wallet',
                      });
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f1f4fb',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#ecfdf5',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Wallet size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Asset Management
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        Income and withdrawal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* MODE 2: Residence Overview (Tenancy, Balance & Maintenance) */}
          {dashboardMode === 'residence' && (
            <>
              {/* Welcome Residence Banner */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ff4b72', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Tenant Self-Service Portal
                    </span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{tenancy.propertyName} · {tenancy.unitNumber}</span>
                  </div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
                    Welcome back, {tenancy.tenantName}
                  </h1>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                    {tenancy.location} · {tenancy.town} &bull; Tenancy Status: <strong style={{ color: '#059669' }}>{tenancy.leaseStatus}</strong>
                  </p>
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
                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Monthly Rent
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#131726', marginTop: '6px' }}>
                    {fmt(tenancy.monthlyRent)}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Plus {fmt(tenancy.serviceCharge)} estate service charge
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Outstanding Balance
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                    {fmt(tenancy.outstandingBalance)}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '4px' }}>
                    ✓ Account verified & up to date
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Next Due Date
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#131726', marginTop: '6px' }}>
                    {tenancy.nextDueDate}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Safaricom Paybill {tenancy.paybillNumber}
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Active Maintenance
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ff4b72', marginTop: '6px' }}>
                    {maintenanceTickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'SUBMITTED').length} Open
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    REQ-0492: Assigned to Caretaker
                  </div>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '16px',
                  padding: '18px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}
              >
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                  Quick Navigation Shortcuts:
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
                    <CreditCard size={14} color="#ff4b72" />
                    <span>Rent & Payments</span>
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
                    <span>Maintenance Requests</span>
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
                    <span>My Lease</span>
                  </Link>
                  <Link
                    to="/portal/documents"
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
                    <FolderLock size={14} color="#64748b" />
                    <span>Documents</span>
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
                    <span>Talk to Management</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: RENT & PAYMENTS (IMAGE 1 DESIGN)
      ========================================================================== */}
      {currentView === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
              Payments
            </h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Currency View:</span>
              <button
                onClick={() => setCurrencyMode(currencyMode === 'KES' ? 'USD' : 'KES')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#f27a59',
                  cursor: 'pointer',
                }}
              >
                {currencyMode === 'KES' ? 'KES (Kenya Shillings)' : 'USD ($ Dollars)'}
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
                      Equity Bank / M-Pesa
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff' }}>
                      VISA
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.02em' }}>
                      {tenancy.tenantName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                      xxxx 4567 &nbsp; 10/27
                    </div>
                  </div>
                </div>

                {/* Balance & Make Payment Action */}
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px' }}>
                    Credit Balance
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#131726', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    {fmt(tenancy.outstandingBalance, 2345.76)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
                    <button
                      onClick={() => setShowPayModal(true)}
                      style={{
                        background: '#f27a59',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '11px 22px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(242, 122, 89, 0.35)',
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
                  <span>Add New Card / Paybill</span>
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
                  <span>December 2026</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                      {fmt(ap.amountKes, ap.amountUsd)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600 }}>
                  ✓ Daraja C2B V2 Instant Auto-Reconcile Active
                </span>
                <button
                  onClick={() => setShowMissingPayModal(true)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.76rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Report Missing
                </button>
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
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Payments', 'Charges'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLedgerFilter(filter)}
                    style={{
                      background: ledgerFilter === filter ? '#f27a59' : '#f8fafc',
                      color: ledgerFilter === filter ? '#ffffff' : '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {filter}
                  </button>
                ))}
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
                    <th style={{ padding: '12px 16px', fontWeight: 500, textAlign: 'center' }}>Official Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
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
                        <div>{tx.source}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>{tx.mpesaRef}</div>
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: tx.isPayment ? '#059669' : '#f27a59',
                        }}
                      >
                        {tx.isPayment ? '+ ' : '- '}
                        {fmt(tx.amountKes, tx.amountUsd)}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#131726' }}>
                        {fmt(tx.balanceKes, tx.balanceUsd)}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenReceipt(tx)}
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
                            onClick={() => handleOpenInvoice(tx)}
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
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
            All messages
          </h1>

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
                      {conversations.length}
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('New management thread initiated.')}
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
                    placeholder="Search conversations..."
                    value={searchContact}
                    onChange={(e) => setSearchContact(e.target.value)}
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
                {filteredConversations.map((c) => {
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
                        borderLeft: isSelected ? '3px solid #7c3aed' : '3px solid transparent',
                        background: isSelected ? '#fbf9ff' : 'transparent',
                        borderBottom: '1px solid #f8fafc',
                        transition: 'background 0.15s ease',
                      }}
                    >
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
                          {c.handle} · {c.role}
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
                      {currentChatUser.handle} · {currentChatUser.role} &bull; {currentChatUser.phone}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => {
                      showToast(`Calling ${currentChatUser.name} at ${currentChatUser.phone}...`);
                      window.location.href = `tel:${currentChatUser.phone}`;
                    }}
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
                    onClick={() => showToast('Conversation thread archived.')}
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
                    onClick={() => showToast(`Staff profile for ${currentChatUser.name} verified.`)}
                    style={{
                      background: '#7c3aed',
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
                <div style={{ textAlign: 'center', margin: '6px 0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>Encrypted Tenant-Management Channel</span>
                </div>

                {activeMessages.map((m) => {
                  if (m.isMe) {
                    return (
                      <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                          You · {m.time}
                        </div>
                        <div
                          style={{
                            background: '#7c3aed',
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

                        {/* File Attachment Card */}
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
                              onClick={() => handleDownloadFile(m.attachment?.name || 'document.pdf', 'Official Tenancy Document - Unit Flow RMS')}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#7c3aed' }}
                              title="Download attachment"
                            >
                              <Download size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Live typing indicator */}
                {isTyping && (
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
                )}
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
                    placeholder={`Message ${currentChatUser.name}...`}
                    rows={2}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
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
                      <button
                        type="button"
                        onClick={() => setChatInput((prev) => prev + ' 👍')}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                      >
                        <Smile size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Attachment browser opened. Select PDF or image.')}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                      >
                        <Paperclip size={18} />
                      </button>
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: '#7c3aed',
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
              Authoritative terms, escrow deposit account, and renewal management.
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
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Demised Premises</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {tenancy.propertyName}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px' }}>
                {tenancy.unitNumber} ({tenancy.unitType}) &bull; Parking P-204
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Lease Reference</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {tenancy.leaseReference}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                ● {tenancy.leaseStatus}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Security Deposit in Trust</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {fmt(tenancy.securityDeposit)}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
                Segregated Escrow (Account 2100)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Term & Expiry</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {tenancy.leaseStart} to {tenancy.leaseExpires}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
                30-day notice period required
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowRenewalModal(true)}
              style={{
                background: '#f27a59',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '0.86rem',
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
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Submit Notice to Vacate
            </button>
            <button
              onClick={() => handleDownloadFile('UnitFlow_Residential_Lease_A204.txt', `RESIDENTIAL LEASE AGREEMENT\nLandlord: ${tenancy.landlordName}\nTenant: ${tenancy.tenantName}\nUnit: ${tenancy.unitNumber}, ${tenancy.propertyName}\nRent: KES ${tenancy.monthlyRent}/month\nDeposit: KES ${tenancy.securityDeposit}\nStart: ${tenancy.leaseStart}\nExpiry: ${tenancy.leaseExpires}`)}
              style={{
                background: '#f8fafc',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Download size={15} />
              <span>Download Signed Lease</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: MAINTENANCE
      ========================================================================== */}
      {currentView === 'maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
                Maintenance Requests
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                Self-service repair reporting, live technician progress, and work order closure.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'flex', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2px' }}>
                {['ALL', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTicketFilter(f)}
                    style={{
                      background: ticketFilter === f ? '#f27a59' : 'transparent',
                      color: ticketFilter === f ? '#ffffff' : '#64748b',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
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
                <span>Submit New Issue</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f27a59', fontFamily: 'monospace' }}>
                      {t.id}
                    </span>
                    <span style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a' }}>
                      {t.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        background: t.priority === 'Emergency' ? '#fee2e2' : t.priority === 'High' ? '#ffedd5' : '#f1f5f9',
                        color: t.priority === 'Emergency' ? '#dc2626' : t.priority === 'High' ? '#ea580c' : '#475569',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 9px',
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
                        padding: '3px 9px',
                        borderRadius: '6px',
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                  {t.description}
                </div>

                {/* 6-Stage Visual Lifecycle Bar */}
                <div style={{ margin: '4px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: '6px' }}>
                    <span>Stage: {t.stages[t.stageIndex]?.name || t.status}</span>
                    <span>Reported: {t.reportedDate}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                    {t.stages.map((st, i) => (
                      <div
                        key={i}
                        title={`${st.name}: ${st.time}`}
                        style={{
                          height: '6px',
                          borderRadius: '3px',
                          background: i <= t.stageIndex ? '#f27a59' : '#e2e8f0',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f8fafc', fontSize: '0.8rem', color: '#64748b' }}>
                  <span>Assigned: <strong>{t.assignedTo}</strong> ({t.phone})</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {t.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleConfirmResolved(t.id)}
                        style={{
                          background: '#ecfdf5',
                          color: '#059669',
                          border: '1px solid #a7f3d0',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Confirm Resolved
                      </button>
                    )}
                    {t.status === 'RESOLVED' && (
                      <button
                        onClick={() => handleReopenTicket(t.id)}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Reopen Issue
                      </button>
                    )}
                  </div>
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
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f27a59', textTransform: 'uppercase' }}>
                      {d.category}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{d.size}</span>
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#131726', lineHeight: 1.35 }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', lineHeight: 1.45 }}>
                    {d.description}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '8px' }}>
                    Issued: {d.date}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedDoc(d)}
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
                    View Document
                  </button>
                  <button
                    onClick={() => handleDownloadFile(`${d.id}.txt`, `DOCUMENT: ${d.name}\nCategory: ${d.category}\nDate: ${d.date}\nTenant: ${tenancy.tenantName}\nUnit: ${tenancy.unitNumber}`)}
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
                  Safaricom Daraja C2B V2 (Ref QKH782910X) reconciled. Receipt RCP-2026-1101 is available in Documents.
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
          SECTION 8: MY PROFILE & SETTINGS
      ========================================================================== */}
      {currentView === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#131726', margin: 0, letterSpacing: '-0.02em' }}>
              My Profile & Account Settings
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
              Update verified contact records, emergency numbers, and two-factor SMS authentication.
            </p>
          </div>

          <form
            onSubmit={handleSaveProfile}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Profile"
                style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{tenancy.tenantName}</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {tenancy.email} &bull; {tenancy.phone} &bull; Unit: {tenancy.unitNumber}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Full Legal Name</label>
                <input
                  type="text"
                  value={profileForm.tenantName}
                  onChange={(e) => setProfileForm({ ...profileForm, tenantName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Mobile Number (Lipa Na M-Pesa)</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>National ID / Passport Number</label>
                <input
                  type="text"
                  value={profileForm.nationalId}
                  onChange={(e) => setProfileForm({ ...profileForm, nationalId: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Emergency Contact Name</label>
                <input
                  type="text"
                  value={profileForm.emergencyContactName}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Emergency Contact Phone</label>
                <input
                  type="text"
                  value={profileForm.emergencyContactPhone}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>SMS Two-Factor Authentication</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Receive instant security code on login to {profileForm.phone}</div>
              </div>
              <input
                type="checkbox"
                checked={profileForm.smsTwoFactor}
                onChange={(e) => setProfileForm({ ...profileForm, smsTwoFactor: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="submit"
                style={{
                  background: '#f27a59',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px 24px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(242, 122, 89, 0.3)',
                }}
              >
                Save Profile Changes
              </button>
            </div>
          </form>
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

            {/* Confetti party popper icon */}
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
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 20px 0' }}>
              Your rent payment has been processed successfully.
            </p>

            {/* Perforated tear line with circular notches */}
            <div style={{ position: 'relative', margin: '20px -32px' }}>
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

            {/* Ticket details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'left', gap: '16px', margin: '18px 0 16px 0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                  TICKET ID / REF
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#131726', marginTop: '2px', fontFamily: 'monospace' }}>
                  {activeReceipt.mpesaRef}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                  AMOUNT
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#131726', marginTop: '2px' }}>
                  {fmt(activeReceipt.amountKes, activeReceipt.amountUsd)}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                DATE & TIME
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#131726', marginTop: '2px' }}>
                {activeReceipt.dateTime}
              </div>
            </div>

            {/* Payment Method Chip */}
            <div
              style={{
                background: '#f0f4ff',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '32px', height: '20px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#059669', opacity: 0.95 }} />
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', opacity: 0.95, marginLeft: '-8px' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                  Safaricom M-Pesa C2B Paybill
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Paybill: {activeReceipt.paybill} &bull; Acc: {activeReceipt.account}
                </div>
              </div>
            </div>

            {/* Barcode Graphic */}
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
                {activeReceipt.barcode}
              </span>
            </div>

            {/* Bottom Download & Print Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={() => handleDownloadFile(`Receipt_${activeReceipt.mpesaRef}.txt`, `OFFICIAL RENT RECEIPT\nReference: ${activeReceipt.mpesaRef}\nAmount: KES ${activeReceipt.amountKes}\nTenant: ${tenancy.tenantName}\nUnit: ${tenancy.unitNumber}\nDate: ${activeReceipt.dateTime}\nPaybill: ${activeReceipt.paybill} Account: ${activeReceipt.account}`)}
                style={{
                  flex: 1,
                  background: '#f27a59',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Print
              </button>
            </div>

            {/* Scalloped semicircles along bottom edge */}
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
              width: '660px',
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
            {/* Top Preview Bar */}
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
                  onClick={() => handleDownloadFile(`Invoice_${activeInvoice.invoiceNo}.txt`, `RENT INVOICE\nInvoice: ${activeInvoice.invoiceNo}\nTenant: ${activeInvoice.recipient.name}\nUnit: ${tenancy.unitNumber}\nAmount: KES ${activeInvoice.totalKes}\nDue Date: ${activeInvoice.dueDate}`)}
                  title="Download Invoice"
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

            {/* Clean Invoice Sheet */}
            <div style={{ padding: '36px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #f27a59 0%, #1e1b4b 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '1rem',
                    }}
                  >
                    UF
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      UNIT FLOW
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Property Management Ltd</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                  <div>billing@unitflow.ke</div>
                  <div>+254 700 123 456</div>
                </div>
              </div>

              {/* Recipient & Invoice Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                    RECIPIENT
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#131726', marginTop: '4px' }}>
                    {activeInvoice.recipient.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, marginTop: '2px' }}>
                    {activeInvoice.recipient.address}<br />
                    {activeInvoice.recipient.county}<br />
                    KRA PIN: {activeInvoice.recipient.kraPin}<br />
                    {activeInvoice.recipient.email} &bull; {activeInvoice.recipient.phone}
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
                    {activeInvoice.invoiceNo}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                    INVOICE DATE &bull; DUE DATE
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#131726' }}>
                    {activeInvoice.invoiceDate} &bull; {activeInvoice.dueDate}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ marginTop: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', fontSize: '0.78rem', borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '8px 0', fontWeight: 500 }}>Task description</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'center' }}>Units</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'right' }}>Rate</th>
                      <th style={{ padding: '8px 0', fontWeight: 500, textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeInvoice.items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px 0', color: '#2563eb', fontWeight: 500 }}>
                          {it.desc}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#131726', fontWeight: 600 }}>
                          {it.qty}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#131726' }}>
                          {fmt(it.rateKes, it.rateUsd)}
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#131726' }}>
                          {fmt(it.amountKes, it.amountUsd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px', fontSize: '0.84rem', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#131726' }}>{fmt(activeInvoice.subtotalKes, activeInvoice.subtotalUsd)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px', fontSize: '0.84rem', color: '#64748b' }}>
                  <span>Concession / Discount</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>- {fmt(activeInvoice.discountKes, activeInvoice.discountUsd)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px', fontSize: '1.1rem', color: '#2563eb', fontWeight: 800, borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  <span>Total Due</span>
                  <span>{fmt(activeInvoice.totalKes, activeInvoice.totalUsd)}</span>
                </div>
              </div>

              {/* Transfer Details */}
              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', fontSize: '0.76rem', color: '#64748b', textAlign: 'center' }}>
                Remit rent via M-Pesa Paybill: <strong>{tenancy.paybillNumber}</strong> &bull; Account: <strong>{tenancy.accountNumber}</strong><br />
                <span style={{ fontWeight: 700, color: '#131726', marginTop: '4px', display: 'inline-block' }}>
                  Bank: Equity Bank &bull; Branch: Ruiru &bull; Account: 0110-9283-4921
                </span>
              </div>

              {/* Notes */}
              <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, color: '#131726', marginBottom: '2px' }}>NOTES</div>
                All amounts are in Kenya Shillings. Rent is payable on or before the 1st of each calendar month. A grace period of 5 days applies before statutory late interest. Thank you for choosing Unit Flow.
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px', fontSize: '0.7rem', color: '#94a3b8' }}>
                <div>Unit Flow Property Management Ltd &bull; Nairobi, Kenya</div>
                <div>Registered in Kenya under Companies Act no. CPR/2026/091823</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE PAYBILL PAYMENT SIMULATION MODAL
      ========================================================================== */}
      {showPayModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '460px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={22} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Lipa na M-Pesa Online</h3>
              </div>
              <button onClick={() => setShowPayModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>Business Paybill:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803d' }}>{tenancy.paybillNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>Account Reference:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{tenancy.accountNumber}</span>
              </div>
            </div>

            <form onSubmit={handleSimulatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>M-Pesa Mobile Number</label>
                <input
                  type="text"
                  value={simPhone}
                  onChange={(e) => setSimPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Rent Amount (KES)</label>
                <input
                  type="number"
                  value={simAmount}
                  onChange={(e) => setSimAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', marginTop: '4px', fontWeight: 700 }}
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                style={{
                  background: isProcessingPayment ? '#94a3b8' : '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                }}
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing Daraja STK Push...</span>
                  </>
                ) : (
                  <span>Send M-Pesa STK Push / Pay Now</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOCUMENT PREVIEW MODAL
      ========================================================================== */}
      {selectedDoc && (
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
          }}
        >
          <div
            style={{
              width: '600px',
              maxWidth: '95vw',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#f27a59', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedDoc.category}
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#131726' }}>
                  {selectedDoc.name}
                </h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
              <strong>CERTIFIED TENANCY RECORD</strong><br />
              Property: {tenancy.propertyName} &bull; Demised Unit: {tenancy.unitNumber}<br />
              Tenant: {tenancy.tenantName} (ID: {tenancy.nationalId})<br />
              Registration Seal: CPR/2026/091823<br /><br />
              This document is securely stored on the Unit Flow Private Document Repository and is authenticated against the double-entry accounting ledger.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedDoc(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadFile(`${selectedDoc.id}.txt`, `DOCUMENT: ${selectedDoc.name}\nTenant: ${tenancy.tenantName}\nUnit: ${tenancy.unitNumber}`);
                  setSelectedDoc(null);
                }}
                style={{ background: '#f27a59', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NEW MAINTENANCE TICKET MODAL
      ========================================================================== */}
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
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Submit Maintenance Request</h3>
              <button onClick={() => setShowMaintenanceModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master bedroom toilet flush sticking"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', marginTop: '4px' }}
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Doors & Locks</option>
                    <option>Appliances</option>
                    <option>Painting</option>
                    <option>Cleaning</option>
                    <option>Structural</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Priority Level</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', marginTop: '4px' }}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Preferred Caretaker Access Window</label>
                <input
                  type="text"
                  value={newTicket.preferredAccess}
                  onChange={(e) => setNewTicket({ ...newTicket, preferredAccess: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Issue Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe the problem in detail for the caretaker..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowMaintenanceModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '9px 16px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#f27a59', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          LEASE RENEWAL MODAL
      ========================================================================== */}
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
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Request Lease Renewal</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Your current lease expires on {tenancy.leaseExpires}. Submit your desired renewal term for Greenview Property Holdings Ltd approval.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Renewal Duration</label>
                <select style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}>
                  <option>12 Months (Standard Renewal)</option>
                  <option>6 Months (Short Extension)</option>
                  <option>24 Months (Two-Year Fixed Rate)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setShowRenewalModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '9px 16px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTenancy((prev) => ({ ...prev, leaseStatus: 'Renewal Requested' }));
                    setShowRenewalModal(false);
                    showToast('Renewal request submitted! Property manager Katherine Moss will issue successor contract.');
                  }}
                  style={{ background: '#f27a59', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NOTICE TO VACATE MODAL
      ========================================================================== */}
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
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>Notice to Vacate</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Per Clause 14 of your lease, a 30-day statutory notice is required. Move-out inspection and deposit escrow refund (KES 25,000.00) will be initiated.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Intended Vacate Date</label>
                <input
                  type="date"
                  defaultValue="2026-12-31"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setShowVacateModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '9px 16px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTenancy((prev) => ({ ...prev, leaseStatus: 'Notice to Vacate Submitted' }));
                    setShowVacateModal(false);
                    showToast('Notice to vacate registered. Caretaker scheduled for preliminary move-out walkthrough.');
                  }}
                  style={{ background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REPORT MISSING PAYMENT MODAL
      ========================================================================== */}
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
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Report Missing Payment</h3>
              <button onClick={() => setShowMissingPayModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.45 }}>
              Enter your M-Pesa transaction code or bank transfer reference for manual reconciliation by Accountant Daniel Ochieng.
            </p>
            <input
              type="text"
              placeholder="e.g. QKH782910X"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowMissingPayModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '9px 16px', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  setShowMissingPayModal(false);
                  showToast('Payment reference queued for accountant investigation.');
                }}
                style={{ background: '#f27a59', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Reference
              </button>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          STEP 1: CERTIFICATION & KYC MODAL
      ========================================================================== */}
      {showCertificationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fff0f3', color: '#ff4b72', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>1. Certification & KYC</h3>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Upload qualification information</div>
                </div>
              </div>
              <button onClick={() => setShowCertificationModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Verify your identity, national ID / passport, and employment documents to complete compliance certification for tenancy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '14px', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color="#ff4b72" />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>National ID / Passport</div>
                    <div style={{ fontSize: '0.72rem', color: '#10b981' }}>✓ Verified (Amina Wanjiku)</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '3px 8px', borderRadius: '10px' }}>Done</span>
              </div>

              <div style={{ padding: '14px', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color="#3b82f6" />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>KRA PIN Certificate</div>
                    <div style={{ fontSize: '0.72rem', color: '#10b981' }}>✓ A012984920X Attached</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '3px 8px', borderRadius: '10px' }}>Done</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowCertificationModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCertificationModal(false);
                  showToast('Qualification documents re-verified & certified.');
                }}
                style={{ background: 'linear-gradient(135deg, #ff6b8b 0%, #ff8e9b 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Save & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: UPLOAD A PRODUCT / RENT COMMITMENT MODAL
      ========================================================================== */}
      {showProductUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>2. Upload a Product / Unit</h3>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Fill in product information</div>
                </div>
              </div>
              <button onClick={() => setShowProductUploadModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Configure unit amenities, monthly rental schedule, and optional parking slots or storage units assigned to your lease agreement.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Assigned Unit
                </label>
                <input
                  type="text"
                  readOnly
                  value="Greenview Apartments · Unit A-204"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.86rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Monthly Rate
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="KES 25,000 / month"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.86rem', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Billing Cycle
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="1st of Every Month"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.86rem', fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowProductUploadModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProductUploadModal(false);
                  showToast('Unit and rental parameters synchronized.');
                }}
                style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Confirm Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: OPEN FOR SALE / SALES CHANNELS & ACCESS MODAL
      ========================================================================== */}
      {showSalesChannelModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>3. Open for Sale & Channels</h3>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Choose to open any sales channel</div>
                </div>
              </div>
              <button onClick={() => setShowSalesChannelModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Activate sales channels and resident digital access: WeChat mini program, mobile web portal, digital gate pass, and community board.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>Online Rent Collection (M-Pesa / Card)</span>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.78rem' }}>● Active</span>
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>WeChat & WhatsApp Resident Channel</span>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.78rem' }}>● Active</span>
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>Smart Door Access & Keypad Pass</span>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.78rem' }}>● Synced</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowSalesChannelModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSalesChannelModal(false);
                  showToast('All sales channels and resident digital passes enabled!');
                }}
                style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #c394fc 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Confirm Channels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OPERATIONS ASSISTANT TILE DETAILS MODAL
      ========================================================================== */}
      {selectedAssistantTile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '480px', width: '100%', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fff0f3', color: '#ff4b72', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedAssistantTile.title}
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                    {selectedAssistantTile.subtitle}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAssistantTile(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, margin: '0 0 24px 0' }}>
              {selectedAssistantTile.details}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedAssistantTile(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = selectedAssistantTile.actionText;
                  setSelectedAssistantTile(null);
                  showToast(`${action} activated successfully!`);
                }}
                style={{ background: 'linear-gradient(135deg, #ff5b79 0%, #ff758c 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255, 91, 121, 0.25)' }}
              >
                {selectedAssistantTile.actionText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
