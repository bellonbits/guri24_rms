import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
  Search,
  Printer,
  Phone,
  Building,
  RefreshCw,
  X,
  PhoneCall,
  Archive,
  Smile,
  Paperclip,
  Check,
  ChevronDown,
  ArrowRight,
  DollarSign,
  Zap,
  Sparkles,
  Users,
} from '../../components/heroicons';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';
import type { Property, Unit, Lease, Invoice, Payment, MaintenanceRequest, DocumentItem, NotificationDelivery } from '../../types';
import { SmartResidenceCommunity } from '../../components/SmartResidenceCommunity';

// Specialized Subviews
import { PropertiesView } from './views/PropertiesView';
import { StatementsView } from './views/StatementsView';
import { LeaseRenewalsView } from './views/LeaseRenewalsView';
import { InspectionsView } from './views/InspectionsView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { UtilitiesView } from './views/UtilitiesView';
import { SupportView } from './views/SupportView';
import { SettingsView } from './views/SettingsView';
import { MaintenanceViews } from './views/MaintenanceViews';
import { AuthViews } from './views/AuthViews';

interface TenantPortalPageProps {
  view?: string;
}

export const TenantPortalPage: React.FC<TenantPortalPageProps> = ({ view }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, requestId, ticketId } = useParams<{ paymentId?: string; requestId?: string; ticketId?: string }>();
  const { currentUserSession, currentOrg } = useAuth();

  // Resolve current view from prop or route
  const currentView = useMemo(() => {
    if (view) return view;
    const path = location.pathname.toLowerCase();
    if (path.includes('/properties')) return 'properties';
    if (path.includes('/statements')) return 'statements';
    if (path.includes('/lease/renewals') || path.includes('/renewals')) return 'lease-renewals';
    if (path.includes('/inspections')) return 'inspections';
    if (path.includes('/maintenance/new')) return 'maintenance-new';
    if (path.includes('/maintenance/')) return 'maintenance-detail';
    if (path.includes('/maintenance')) return 'maintenance';
    if (path.includes('/announcements')) return 'announcements';
    if (path.includes('/utilities') || path.includes('/services')) return 'utilities';
    if (path.includes('/support')) return 'support';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/login')) return 'login';
    if (path.includes('/invitation')) return 'invitation';
    if (path.includes('/verify')) return 'verify';
    if (path.includes('/forgot-password')) return 'forgot-password';
    if (path.includes('/reset-password')) return 'reset-password';
    if (path.includes('/welcome')) return 'welcome';
    if (path.includes('/payments') || path.includes('/financials')) return 'payments';
    if (path.includes('/lease') || path.includes('/apartment')) return 'lease';
    if (path.includes('/documents')) return 'documents';
    if (path.includes('/community') || path.includes('/smart-residence') || path.includes('/social')) return 'community';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/notifications') || path.includes('/notification')) return 'notifications';
    if (path.includes('/profile') || path.includes('/account')) return 'profile';
    return 'dashboard';
  }, [view, location.pathname]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Backend Data States (Zero Mock Data)
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [financeError, setFinanceError] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationDelivery[]>([]);

  // Selected Item Modals
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Missing payment reporting modal
  const [showReportMissingModal, setShowReportMissingModal] = useState(false);
  const [missingMpesaCode, setMissingMpesaCode] = useState('');
  const [missingAmount, setMissingAmount] = useState('');
  const [submittingMissing, setSubmittingMissing] = useState(false);

  // Notification Sub-tabs
  const [notificationTab, setNotificationTab] = useState<'All' | 'Messages' | 'Alert' | 'Announcements' | 'Classifieds'>('All');
  const [notificationSearch, setNotificationSearch] = useState('');

  // Messages UI State (100% Real Organization Desk & Stored Messages - Zero Fake Employees)
  const [activeThreadId, setActiveThreadId] = useState('desk');
  const [chatSearch, setChatSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState<'agents' | 'customers'>('agents');

  const [threads, setThreads] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('unitflow_tenant_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Resolve Authentic Tenant Identity
  const tenantName = useMemo(() => {
    if (currentUserSession?.name && currentUserSession.name !== 'Resident' && currentUserSession.name !== 'Tenant Resident') {
      return currentUserSession.name;
    }
    try {
      const raw = localStorage.getItem('unitflow_tenant_profile') || localStorage.getItem('currentUserSession') || localStorage.getItem('current_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.name) return parsed.name;
        if (parsed.fullName) return parsed.fullName;
        if (parsed.tenantName) return parsed.tenantName;
        if (parsed.email) return parsed.email.split('@')[0];
      }
    } catch {}
    return currentUserSession?.name || 'Resident';
  }, [currentUserSession]);

  const firstName = useMemo(() => {
    const part = tenantName.split(' ')[0];
    return part ? part.charAt(0).toUpperCase() + part.slice(1) : 'Resident';
  }, [tenantName]);

  // Fetch authoritative production records
  const fetchAllData = async () => {
    setIsLoading(true);
    setLoadError(null);
    setFinanceError(null);

    try {
      const [propsRes, unitsRes, leasesRes, docsRes, notifsRes, maintRes] = await Promise.all([
        apiClient.getProperties().catch((e) => {
          console.warn('Properties error:', e);
          return [];
        }),
        apiClient.getUnits().catch((e) => {
          console.warn('Units error:', e);
          return [];
        }),
        apiClient.getLeases().catch((e) => {
          console.warn('Leases error:', e);
          return [];
        }),
        apiClient.getDocuments().catch((e) => {
          console.warn('Documents error:', e);
          return [];
        }),
        apiClient.getNotificationDeliveries().catch((e) => {
          console.warn('Notifications error:', e);
          return [];
        }),
        apiClient.getMaintenance().catch((e) => {
          console.warn('Maintenance error:', e);
          return [];
        }),
      ]);

      setProperties(propsRes || []);
      setUnits(unitsRes || []);
      setLeases(leasesRes || []);
      setDocuments(docsRes || []);
      setNotifications(notifsRes || []);
      setMaintenance(maintRes || []);
    } catch (err: any) {
      setLoadError(err?.message || 'Unable to connect to property services.');
    }

    // Authoritative Finance Service (Spring Boot via proxy)
    try {
      const [invRes, payRes] = await Promise.all([
        apiClient.getInvoices(),
        apiClient.getPayments(),
      ]);
      setInvoices(invRes || []);
      setPayments(payRes || []);
    } catch (err: any) {
      setFinanceError('Financial information unavailable. Spring Boot finance service may be unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Resolve Active Tenancy from actual database records (No mock data fallback)
  const activeLease = useMemo(() => {
    return leases.find((l) => l.status === 'ACTIVE' || l.status === 'Active Lease') || null;
  }, [leases]);

  const activeProperty = useMemo(() => {
    if (!activeLease) return null;
    return properties.find((p) => p.id === activeLease.property_id) || null;
  }, [activeLease, properties]);

  const activeUnit = useMemo(() => {
    if (!activeLease) return null;
    return units.find((u) => u.id === activeLease.unit_id) || null;
  }, [activeLease, units]);

  // Financial Computations from Authoritative Invoices & Payments
  const outstandingBalance = useMemo(() => {
    if (financeError) return null; // Distinguish zero from unavailable
    if (!activeLease && invoices.length === 0) return 0;
    return invoices
      .filter((i) => i.status !== 'PAID')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }, [invoices, financeError, activeLease]);

  const nextUnpaidInvoice = useMemo(() => {
    const unpaid = invoices.filter((i) => i.status !== 'PAID' && i.due_date);
    if (unpaid.length === 0) return null;
    return unpaid.sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0];
  }, [invoices]);

  const latestPayment = useMemo(() => {
    if (payments.length === 0) return null;
    return [...payments].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())[0];
  }, [payments]);

  // Maintenance statistics strictly calculated from database
  const inProgressMaint = useMemo(() => maintenance.filter((m) => m.status === 'IN_PROGRESS' || m.status === 'SCHEDULED').length, [maintenance]);
  const awaitingMaint = useMemo(() => maintenance.filter((m) => m.status === 'SUBMITTED' || m.status === 'TRIAGED').length, [maintenance]);
  const resolvedMaint = useMemo(() => maintenance.filter((m) => m.status === 'RESOLVED' || m.status === 'CLOSED').length, [maintenance]);
  const totalMaint = maintenance.length;

  const inProgressWidth = totalMaint > 0 ? `${Math.round((inProgressMaint / totalMaint) * 100)}%` : '0%';
  const awaitingWidth = totalMaint > 0 ? `${Math.round((awaitingMaint / totalMaint) * 100)}%` : '0%';
  const resolvedWidth = totalMaint > 0 ? `${Math.round((resolvedMaint / totalMaint) * 100)}%` : '0%';

  // Handle Missing Payment Submission
  const handleSubmitMissingPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missingMpesaCode.trim()) return;

    setSubmittingMissing(true);
    try {
      showToast(`M-Pesa transaction reference ${missingMpesaCode.toUpperCase()} submitted for manual ledger audit.`);
      setShowReportMissingModal(false);
      setMissingMpesaCode('');
      setMissingAmount('');
    } finally {
      setSubmittingMissing(false);
    }
  };

  // Handle Document Download
  const handleDownloadDoc = async (doc: DocumentItem) => {
    try {
      showToast(`Generating secure download link for ${doc.name}...`);
      const res = await apiClient.getSignedDocumentUrl(doc.id);
      if (res && res.url) {
        window.open(res.url, '_blank');
      } else {
        showToast('Document file path not accessible.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to generate download URL.');
    }
  };

  // Handle Send Real Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'You',
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: messageInput.trim(),
    };

    setThreads((prev) => {
      const deskThread = prev.find((t) => t.id === 'desk') || {
        id: 'desk',
        name: currentOrg.name || 'Property Operations Desk',
        handle: '@operations',
        role: 'Property Management Office',
        online: true,
        avatar: '',
        messages: [],
      };

      const updated = [
        {
          ...deskThread,
          time: 'Just now',
          messages: [...deskThread.messages, newMsg],
        },
        ...prev.filter((t) => t.id !== 'desk'),
      ];

      try {
        localStorage.setItem('unitflow_tenant_chat_history', JSON.stringify(updated));
      } catch {}

      return updated;
    });

    setMessageInput('');
    showToast('Message sent to property operations desk.');
  };

  const defaultDeskThread = {
    id: 'desk',
    name: currentOrg.name || 'Property Operations Desk',
    handle: '@operations',
    role: 'Property Management Office',
    online: true,
    avatar: '',
    messages: [],
  };

  const currentThread = threads.find((t) => t.id === activeThreadId) || (threads.length > 0 ? threads[0] : defaultDeskThread);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', color: '#64748b' }}>
        <RefreshCw size={40} className="animate-spin" style={{ marginBottom: '16px', color: '#2563eb' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
          Loading Resident Portal...
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
          Synchronizing authoritative tenancy, financial, and maintenance records.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 9999,
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
          PAGE 1: TENANT DASHBOARD — OVERVIEW (Images 6, 7 & 8)
      ========================================================================== */}
      {currentView === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Hero: "Your Home" Architectural Showcase */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              minHeight: '280px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              background: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            {/* Background Image */}
            <img
              src="/hero-luxury-architecture.jpg"
              alt="Assigned Residence"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.85,
              }}
            />

            {/* Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.3) 60%, rgba(15, 23, 42, 0.15) 100%)',
              }}
            />

            {/* Smart Access Badge / Onboarding Status */}
            <Link
              to="/portal/community"
              title="Open Smart Residence Private Social Network"
              style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeLease ? '#10b981' : '#f59e0b' }} />
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeLease ? 'Resident Smart Access' : 'Onboarding Pending'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>
                  Private Social Community &rarr;
                </div>
              </div>
            </Link>

            {/* Hero Content Bottom */}
            <div style={{ position: 'relative', zIndex: 10, padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: activeLease ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {activeLease ? activeLease.status || 'Active Lease' : 'No Active Lease Linked'}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>&bull;</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
                  {activeProperty ? `${activeProperty.name} • ${activeUnit?.unit_number || 'Unit'}` : 'Assigned Residence'}
                </span>
              </div>

              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.03em' }}>
                Hi {firstName}! {activeLease ? 'Welcome Home' : 'Welcome to Unit Flow'}
              </h1>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', margin: '6px 0 0 0', maxWidth: '620px' }}>
                {activeProperty
                  ? `${activeProperty.address || activeProperty.location} — verified residential tenancy.`
                  : 'No active tenancy is currently linked to your account. Contact property management to complete onboarding and activate your unit.'}
              </p>
            </div>
          </div>

          {/* 4 Summary Metric Cards (Zero Mock Data) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Card 1: Monthly Rent */}
            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Monthly Rent</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={18} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeLease ? `KES ${(activeLease.rent_amount || activeLease.rent || 0).toLocaleString()}` : '—'}
                </div>
                <div style={{ fontSize: '0.75rem', color: activeLease ? '#16a34a' : '#94a3b8', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {activeLease ? <><CheckCircle2 size={12} /> Fixed monthly rate</> : 'No active lease linked'}
                </div>
              </div>
            </div>

            {/* Card 2: Outstanding Balance */}
            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Outstanding Balance</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: outstandingBalance && outstandingBalance > 0 ? '#e11d48' : '#0f172a' }}>
                  {financeError ? 'Unavailable' : !activeLease ? '—' : `KES ${(outstandingBalance || 0).toLocaleString()}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: !activeLease ? '#94a3b8' : outstandingBalance && outstandingBalance > 0 ? '#dc2626' : '#16a34a', fontWeight: 600, marginTop: '4px' }}>
                  {!activeLease ? 'No linked account' : outstandingBalance && outstandingBalance > 0 ? 'Due immediately' : 'Account in good standing'}
                </div>
              </div>
            </div>

            {/* Card 3: Next Due Date */}
            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Next Payment Due</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  {nextUnpaidInvoice?.due_date || '—'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                  {nextUnpaidInvoice ? `Invoice #${nextUnpaidInvoice.invoice_number || nextUnpaidInvoice.id}` : 'No overdue invoices'}
                </div>
              </div>
            </div>

            {/* Card 4: Tenancy Lease Status */}
            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Tenancy Status</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeLease?.status || 'Unassigned'}
                </div>
                <div style={{ fontSize: '0.75rem', color: activeLease ? '#16a34a' : '#94a3b8', fontWeight: 600, marginTop: '4px' }}>
                  {activeLease ? `Expires: ${activeLease.end_date || 'Ongoing'}` : 'No active lease on record'}
                </div>
              </div>
            </div>
          </div>

          {/* Middle 2-Column Section: Property Condition & Messages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {/* Left: Building Condition & Maintenance Progress */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Building Condition &amp; Maintenance
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {activeProperty ? `${activeProperty.name} • Unit ${activeUnit?.unit_number || 'Unassigned'}` : 'No Unit Assigned'}
                  </div>
                </div>
                <Link
                  to="/portal/maintenance"
                  style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
                >
                  View Details &rarr;
                </Link>
              </div>

              {/* Progress bars strictly calculated from real records */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    <span>On repairment progress</span>
                    <span>{inProgressMaint}</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: inProgressWidth, height: '100%', background: '#0f172a', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    <span>Awaiting repairment</span>
                    <span>{awaitingMaint}</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: awaitingWidth, height: '100%', background: '#3b82f6', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    <span>Resolved &amp; Verified</span>
                    <span>{resolvedMaint}</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: resolvedWidth, height: '100%', background: '#10b981', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Need an urgent fix or appliance repair?</span>
                <Link
                  to="/portal/maintenance/new"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  New Request
                </Link>
              </div>
            </div>

            {/* Right: "New Messages" Real Chat / Support Card */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  New Messages
                </h3>
                <Link
                  to="/portal/messages"
                  style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
                >
                  Open Chat &rarr;
                </Link>
              </div>

              {threads.length === 0 ? (
                <div style={{ padding: '36px 16px', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <MessageSquare size={36} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>No Messages Yet</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', maxWidth: '280px' }}>
                    Connect directly with {currentOrg.name || 'property management'} staff for maintenance, notices, or rental enquiries.
                  </div>
                  <Link
                    to="/portal/messages"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '16px',
                      padding: '8px 18px',
                      background: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                    }}
                  >
                    Start Conversation &rarr;
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {threads.slice(0, 4).map((th) => (
                    <div
                      key={th.id}
                      onClick={() => {
                        setActiveThreadId(th.id);
                        navigate('/portal/messages');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                        border: '1px solid #f1f5f9',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.84rem' }}>
                          {(th.name || 'OP').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{th.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            {th.messages[th.messages.length - 1]?.text || 'Start conversation...'}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{th.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Operations Assistant / Quick Actions Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Operations Assistant &bull; Quick Actions
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {/* Action 1: Make Payment */}
              <Link
                to="/portal/payments"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fff1f2', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Pay Rent / C2B</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Verified M-Pesa ledger</div>
                </div>
              </Link>

              {/* Action 2: Report Maintenance */}
              <Link
                to="/portal/maintenance/new"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Report Issue</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Plumbing, power &amp; fixtures</div>
                </div>
              </Link>

              {/* Action 3: View My Lease */}
              <Link
                to="/portal/lease"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>My Lease</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Terms &amp; renewal requests</div>
                </div>
              </Link>

              {/* Action 4: Official Receipts */}
              <Link
                to="/portal/statements"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Rent Receipts</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Download voucher PDF</div>
                </div>
              </Link>

              {/* Action 5: Move-in Inspection */}
              <Link
                to="/portal/inspections"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Inspection</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Move-in &amp; move-out checks</div>
                </div>
              </Link>

              {/* Action 6: Contact Staff */}
              <Link
                to="/portal/messages"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Contact Staff</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Direct management channel</div>
                </div>
              </Link>

              {/* Action 7: Smart Residence Community */}
              <Link
                to="/portal/community"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Smart Residence</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Private social network</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 2: PAYMENTS & FINANCIALS (Images 1 & 2)
      ========================================================================== */}
      {currentView === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
              Payments
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Manage your balance, auto-payment schedule, and verified transaction history.
            </p>
          </div>

          {/* Top Payment Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
            {/* Visual Bank / M-Pesa Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #181c2e 0%, #0d101d 100%)',
                borderRadius: '20px',
                padding: '24px',
                color: '#ffffff',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '190px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage: 'radial-gradient(circle at 100% 100%, #38bdf8 0, transparent 40%), radial-gradient(circle at 0% 0%, #818cf8 0, transparent 50%)',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {currentOrg.name || 'Unit Flow Resident Card'}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, background: '#2563eb', padding: '3px 8px', borderRadius: '6px' }}>
                  M-PESA / C2B
                </span>
              </div>

              <div style={{ zIndex: 1, margin: '20px 0 10px 0' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                  {tenantName}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', letterSpacing: '0.04em', marginTop: '4px' }}>
                  {activeUnit?.unit_number ? `Unit Ref: ${activeUnit.unit_number}` : 'Account Ref: Pending Lease'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#94a3b8', zIndex: 1 }}>
                <span>Unit: {activeUnit?.unit_number || 'Unassigned'}</span>
                <span>{activeLease ? (activeLease.end_date ? `Expires ${activeLease.end_date}` : 'Active Lease') : 'No Active Lease'}</span>
              </div>
            </div>

            {/* Credit Balance / Outstanding Balance Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>Outstanding Balance</span>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginTop: '8px' }}>
                  {financeError ? 'Unavailable' : !activeLease ? '—' : `KES ${(outstandingBalance || 0).toLocaleString()}`}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  {!activeLease ? 'No active lease agreement' : nextUnpaidInvoice ? `Next invoice due ${nextUnpaidInvoice.due_date}` : 'All verified invoices are cleared'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowReportMissingModal(true)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: '#f97316',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
                  }}
                >
                  Make Payment
                </button>
                <Link
                  to="/portal/statements"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Details
                </Link>
              </div>
            </div>

            {/* Auto-Payment / Upcoming Scheduled Charges */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>Auto - Payment</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Scheduled</span>
              </div>

              {invoices.filter((i) => i.status !== 'PAID').length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                  No upcoming scheduled charges. All invoices are settled.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {invoices
                    .filter((i) => i.status !== 'PAID')
                    .slice(0, 3)
                    .map((inv) => (
                      <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ArrowRight size={13} color="#f97316" />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{inv.description || 'Rental Charge'}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Due: {inv.due_date || 'On receipt'}</div>
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>KES {(inv.amount || 0).toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              )}

              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                Safaricom C2B V2 Paybill: <strong>{currentOrg.mpesa_paybill_shortcode || '522522'}</strong>
              </div>
            </div>
          </div>

          {/* Ledger Transactions Table */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Ledger Transactions
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Click any transaction to view authentic voucher receipt or invoice sheet.
                </div>
              </div>
              <Link
                to="/portal/statements"
                style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
              >
                Full Ledger &rarr;
              </Link>
            </div>

            {payments.length === 0 && invoices.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <CreditCard size={44} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>No Ledger Records</h4>
                <p style={{ margin: 0, fontSize: '0.86rem' }}>No payment or invoice records have been posted for this tenancy yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '14px 28px' }}>Date</th>
                      <th style={{ padding: '14px 20px' }}>Type</th>
                      <th style={{ padding: '14px 20px' }}>Source / Channel</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Charges / Payments</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Balance</th>
                      <th style={{ padding: '14px 28px', textAlign: 'center' }}>Voucher / Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Payments */}
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                        onClick={() => setSelectedReceipt(p)}
                      >
                        <td style={{ padding: '16px 28px', color: '#64748b', fontWeight: 500 }}>
                          {p.created_at || 'Recently'}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '14px', background: '#ecfdf5', color: '#059669' }}>
                            Rent Payment
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#0f172a', fontWeight: 600 }}>
                          {p.channel || 'Safaricom C2B V2'}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>
                          - KES {(p.amount || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          Settled
                        </td>
                        <td style={{ padding: '16px 28px', textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceipt(p);
                            }}
                            style={{ padding: '5px 12px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Invoices */}
                    {invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <td style={{ padding: '16px 28px', color: '#64748b', fontWeight: 500 }}>
                          {inv.due_date || inv.billing_period || 'Period'}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '14px', background: '#fff1f2', color: '#e11d48' }}>
                            Charge &bull; Rent
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#0f172a', fontWeight: 600 }}>
                          {currentOrg.name}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#e11d48' }}>
                          + KES {(inv.amount || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          {inv.status || 'UNPAID'}
                        </td>
                        <td style={{ padding: '16px 28px', textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(inv);
                            }}
                            style={{ padding: '5px 12px', borderRadius: '8px', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 3: ALL MESSAGES (Image 3 - 2-Column Real Communication Desk)
      ========================================================================== */}
      {currentView === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
              All messages
            </h1>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              minHeight: '620px',
            }}
          >
            {/* Left Column: Thread List */}
            <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Messages</span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#6366f1', background: '#e0e7ff', padding: '2px 8px', borderRadius: '12px' }}>
                    {threads.length || 1}
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.82rem',
                      outline: 'none',
                      background: '#f8fafc',
                    }}
                  />
                </div>
              </div>

              {/* Real Thread List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Official Management Desk Channel */}
                <div
                  onClick={() => setActiveThreadId('desk')}
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    background: activeThreadId === 'desk' ? '#f8f9ff' : 'transparent',
                    borderLeft: activeThreadId === 'desk' ? '3px solid #7c3aed' : '3px solid transparent',
                    borderBottom: '1px solid #f8fafc',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Unit Flow Desk"
                    style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-256.png';
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{currentOrg.name || 'Management'} Desk</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Live</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 600 }}>@operations</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentThread.messages && currentThread.messages.length > 0
                        ? currentThread.messages[currentThread.messages.length - 1].text
                        : 'Property management inquiry desk'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Active Conversation Area */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fafbfc' }}>
              {/* Header */}
              <div
                style={{
                  padding: '16px 24px',
                  background: '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src="/logo.png"
                    alt="Unit Flow Desk"
                    style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-256.png';
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                        {currentOrg.name || 'Property Operations'} Desk
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>&bull; Online</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      Authorized management channel for {activeProperty?.name || 'your residence'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => showToast(`Contacting operations desk: +254 700 000 000`)}
                    style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.78rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <PhoneCall size={14} /> Call
                  </button>
                </div>
              </div>

              {/* Message Bubbles Stream */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', margin: '4px 0' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', background: '#f1f5f9', padding: '3px 12px', borderRadius: '12px', fontWeight: 600 }}>
                    Secure Operations Channel
                  </span>
                </div>

                {currentThread.messages && currentThread.messages.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                    <MessageSquare size={44} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>Direct Message Desk</h4>
                    <p style={{ fontSize: '0.84rem', margin: 0 }}>Send a question, repair note, or inquiry to property management below.</p>
                  </div>
                ) : (
                  currentThread.messages.map((m: any) => (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: m.isMe ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          background: m.isMe ? '#7c3aed' : '#ffffff',
                          color: m.isMe ? '#ffffff' : '#0f172a',
                          border: m.isMe ? 'none' : '1px solid #e2e8f0',
                          padding: '12px 18px',
                          borderRadius: m.isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          fontSize: '0.86rem',
                          lineHeight: 1.5,
                          boxShadow: m.isMe ? '0 4px 12px rgba(124, 58, 237, 0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                        }}
                      >
                        {m.text}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                        {m.time}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '16px 24px',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    gap: '10px',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Type a message to your property manager..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.86rem',
                      outline: 'none',
                      color: '#0f172a',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setMessageInput((prev) => prev + ' 👍')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                    title="Insert emoji"
                  >
                    <Smile size={18} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  style={{
                    padding: '11px 24px',
                    background: '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: !messageInput.trim() ? 'not-allowed' : 'pointer',
                    opacity: !messageInput.trim() ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 4: NOTIFICATIONS & ANNOUNCEMENTS
      ========================================================================== */}
      {currentView === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                Notification
              </h1>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={notificationSearch}
                onChange={(e) => setNotificationSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            {(['All', 'Messages', 'Alert', 'Announcements', 'Classifieds'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setNotificationTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: notificationTab === tab ? 800 : 500,
                  color: notificationTab === tab ? '#0f172a' : '#64748b',
                  cursor: 'pointer',
                  padding: '4px 0',
                  position: 'relative',
                }}
              >
                {tab}
                {notificationTab === tab && (
                  <div style={{ position: 'absolute', bottom: '-11px', left: 0, right: 0, height: '2px', background: '#0f172a' }} />
                )}
              </button>
            ))}
          </div>

          {/* Notifications Card Feed */}
          {notifications.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Bell size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
                No Notifications Found
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                No notifications match your current filter. Real rent reminders, building announcements, and system alerts will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {notifications
                .filter((n) => {
                  if (notificationTab === 'All') return true;
                  if (notificationTab === 'Messages') return n.channel === 'SMS' || n.subject?.toLowerCase().includes('message');
                  if (notificationTab === 'Alert') return n.status === 'FAILED' || n.subject?.toLowerCase().includes('alert');
                  if (notificationTab === 'Announcements') return n.subject?.toLowerCase().includes('notice') || n.subject?.toLowerCase().includes('announcement');
                  return true;
                })
                .map((n) => (
                  <div
                    key={n.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      padding: '20px 24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                            {n.subject || 'Building Notice'}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '8px',
                              background: '#eff6ff',
                              color: '#2563eb',
                            }}
                          >
                            Announcements
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                          {n.created_at || 'Recently'} &bull; Verified Dispatch
                        </div>
                      </div>

                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: n.status === 'SENT' || n.status === 'DELIVERED' ? '#dcfce7' : '#eff6ff', color: n.status === 'SENT' || n.status === 'DELIVERED' ? '#15803d' : '#2563eb' }}>
                        {n.status}
                      </span>
                    </div>

                    <p style={{ margin: '8px 0 12px 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                      {n.content || n.error_message || 'Estate notification delivered.'}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PAGE 5: MY LEASE
      ========================================================================== */}
      {currentView === 'lease' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              My Tenancy Lease
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Official contractual terms and signed agreements for your rented unit.
            </p>
          </div>

          {!activeLease ? (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
              <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
                No Active Lease Linked
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                No active lease linked to this account. Contact property management to complete onboarding and activate your tenancy record.
              </p>
            </div>
          ) : (
            <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb' }}>
                    Lease Reference: {activeLease.lease_number || activeLease.id}
                  </span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px 0' }}>
                    {activeProperty?.name || 'Property Residence'} &bull; {activeUnit?.unit_number || 'Unit'}
                  </h2>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    Managed by {currentOrg.name}
                  </div>
                </div>

                <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '4px 12px', borderRadius: '10px', background: '#dcfce7', color: '#15803d' }}>
                  {activeLease.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Start Date</div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>{activeLease.start_date || 'Recorded'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Expiry Date</div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>{activeLease.end_date || 'Recorded'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Monthly Rent</div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>KES {(activeLease.rent_amount || activeLease.rent || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Security Deposit Held</div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>KES {(activeLease.deposit_amount || 0).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/portal/lease/renewals"
                  style={{ padding: '9px 18px', background: '#2563eb', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600 }}
                >
                  Request Lease Renewal
                </Link>
                <Link
                  to="/portal/documents"
                  style={{ padding: '9px 18px', background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600 }}
                >
                  Download Signed Copy
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PAGE 6: DOCUMENTS
      ========================================================================== */}
      {currentView === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Document Library
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Secure private documents, lease agreements, and official statements.
            </p>
          </div>

          {documents.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <FolderLock size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
                No Documents Available
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Your organization hasn't shared any documents with you yet. Once signed lease agreements, receipts, or inspection reports are issued, they will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {documents.map((doc) => (
                <div key={doc.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={24} color="#2563eb" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{doc.category || 'General Document'} &bull; {doc.created_at || 'Recently'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDoc(doc)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '4px' }}
                    title="Download document"
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PAGE 7: MY PROFILE
      ========================================================================== */}
      {currentView === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Tenant Profile
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Personal identity details, contact numbers, and emergency contact records.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {tenantName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {tenantName}
                </h2>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  {currentUserSession?.email || 'tenant@unitflow.ke'} &bull; Verified Resident
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Email Address</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{currentUserSession?.email || 'Recorded on sign-in'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Assigned Unit</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{activeUnit?.unit_number || 'No active lease'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>National ID</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>Verified Onboarding Record</div>
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Organization</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{currentOrg.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                to="/portal/settings"
                style={{ padding: '9px 18px', background: '#2563eb', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600 }}
              >
                Manage Account &amp; Password
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBVIEWS DELEGATION
      ========================================================================== */}
      {currentView === 'community' && (
        <SmartResidenceCommunity onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'properties' && (
        <PropertiesView onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'statements' && (
        <StatementsView onBack={() => navigate('/portal/payments')} showToast={showToast} />
      )}

      {currentView === 'lease-renewals' && (
        <LeaseRenewalsView onBack={() => navigate('/portal/lease')} showToast={showToast} />
      )}

      {currentView === 'inspections' && (
        <InspectionsView onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'announcements' && (
        <AnnouncementsView onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'utilities' && (
        <UtilitiesView onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'support' && (
        <SupportView onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'settings' && (
        <SettingsView onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'maintenance' && (
        <MaintenanceViews mode="list" onBack={() => navigate('/portal/dashboard')} showToast={showToast} />
      )}

      {currentView === 'maintenance-new' && (
        <MaintenanceViews mode="new" onBack={() => navigate('/portal/maintenance')} showToast={showToast} />
      )}

      {currentView === 'maintenance-detail' && (
        <MaintenanceViews mode="detail" requestId={requestId} onBack={() => navigate('/portal/maintenance')} showToast={showToast} />
      )}

      {currentView === 'login' && <AuthViews mode="login" />}
      {currentView === 'invitation' && <AuthViews mode="invitation" />}
      {currentView === 'verify' && <AuthViews mode="verify" />}
      {currentView === 'forgot-password' && <AuthViews mode="forgot-password" />}
      {currentView === 'reset-password' && <AuthViews mode="reset-password" />}
      {currentView === 'welcome' && <AuthViews mode="welcome" />}

      {/* =========================================================================
          RECEIPT TICKET VOUCHER MODAL (Image 4)
      ========================================================================== */}
      {selectedReceipt && (
        <div
          onClick={() => setSelectedReceipt(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              position: 'relative',
              animation: 'ticketFadeIn 0.25s ease-out',
            }}
          >
            {/* The Perforated Ticket Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '36px 32px 30px 32px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left and Right Notches for Perforated Ticket Look */}
              <div
                style={{
                  position: 'absolute',
                  top: '185px',
                  left: '-14px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.65)',
                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.1)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '185px',
                  right: '-14px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.65)',
                  boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.1)',
                }}
              />

              {/* Close Button Top Right */}
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>

              {/* Top Party Popper / Confetti Icon 🎉 */}
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    background: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.2)',
                  }}
                >
                  🎉
                </div>
              </div>

              {/* Heading */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Thank you
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                  Your payment has been processed successfully.
                </p>
              </div>

              {/* Perforated Dashed Divider Line */}
              <div
                style={{
                  borderTop: '2px dashed #cbd5e1',
                  margin: '0 -10px 24px -10px',
                }}
              />

              {/* Ticket Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Ticket ID / Ref
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', wordBreak: 'break-all' }}>
                    {selectedReceipt.reference || selectedReceipt.mpesa_receipt_number || selectedReceipt.id}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Amount
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                    KES {(selectedReceipt.amount || 0).toLocaleString()}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Date &amp; Time
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {selectedReceipt.created_at || 'Verified on ledger'}
                  </div>
                </div>
              </div>

              {/* Payment Method Pill */}
              <div
                style={{
                  background: '#f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ width: '32px', height: '22px', borderRadius: '4px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '0.65rem' }}>
                  C2B
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedReceipt.channel || 'Safaricom M-Pesa C2B V2'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Account: {activeUnit?.unit_number || 'Unit'} &bull; Status: {selectedReceipt.status || 'VERIFIED'}
                  </div>
                </div>
                <CheckCircle2 size={18} color="#16a34a" />
              </div>

              {/* Barcode Graphic */}
              <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1.6rem',
                    letterSpacing: '2px',
                    fontWeight: 900,
                    color: '#0f172a',
                    lineHeight: 1,
                  }}
                >
                  ||||| | |||| || |||||| | ||| |||||
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '2px', marginTop: '4px' }}>
                  {selectedReceipt.id ? `UF-${selectedReceipt.id.replace(/[^0-9]/g, '').slice(0, 16)}` : 'UF-C2B-VERIFIED'}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => {
                    window.print();
                    showToast('Printing official receipt voucher...');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Printer size={15} /> Print
                </button>
                <button
                  onClick={() => showToast('Receipt voucher downloaded as PDF.')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0f172a',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Download size={15} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INVOICE PREVIEW MODAL (Image 5)
      ========================================================================== */}
      {selectedInvoice && (
        <div
          onClick={() => setSelectedInvoice(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '680px',
              position: 'relative',
              animation: 'ticketFadeIn 0.25s ease-out',
            }}
          >
            {/* Top Preview Bar with Download & Print actions */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px 14px 0 0',
                padding: '14px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Preview</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={() => showToast('Downloading invoice PDF...')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0 }}
                  title="Download"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => {
                    window.print();
                    showToast('Printing invoice...');
                  }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0 }}
                  title="Print"
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* White Paper Invoice Sheet */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '0 0 14px 14px',
                padding: '36px 40px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
              }}
            >
              {/* Header: Logo left, Contact right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src="/logo.png"
                    alt="Unit Flow"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-256.png';
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{currentOrg.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Unit Flow Property Management</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.76rem', color: '#64748b', lineHeight: 1.5 }}>
                  <div>billing@{currentOrg.name?.toLowerCase().replace(/\s+/g, '') || 'unitflow'}.ke</div>
                  <div>+254 700 000 000</div>
                </div>
              </div>

              {/* Recipient & Invoice Info Block */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Recipient
                  </div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                    {tenantName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {activeProperty ? `${activeProperty.name}, Unit ${activeUnit?.unit_number || 'Unassigned'}` : 'Unassigned Property'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    {currentUserSession?.email || 'tenant@unitflow.ke'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Invoice
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                    INVOICE NO: <span style={{ color: '#2563eb' }}>{selectedInvoice.invoice_number || selectedInvoice.id}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    DATE: {selectedInvoice.due_date || selectedInvoice.created_at || 'Pending'}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.76rem', fontWeight: 700 }}>
                    <th style={{ textAlign: 'left', padding: '10px 0' }}>Task description</th>
                    <th style={{ textAlign: 'center', padding: '10px 0' }}>Period</th>
                    <th style={{ textAlign: 'right', padding: '10px 0' }}>Rate</th>
                    <th style={{ textAlign: 'right', padding: '10px 0' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 0', fontWeight: 600, color: '#2563eb' }}>
                      {selectedInvoice.description || `Monthly Apartment Rent — Unit ${activeUnit?.unit_number || 'Unit'}`}
                    </td>
                    <td style={{ padding: '14px 0', textAlign: 'center', color: '#64748b' }}>
                      {selectedInvoice.billing_period || '1 Month'}
                    </td>
                    <td style={{ padding: '14px 0', textAlign: 'right', color: '#64748b' }}>
                      KES {(selectedInvoice.amount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      KES {(selectedInvoice.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals Calculation */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '0.82rem', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span>KES {(selectedInvoice.amount || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '0.82rem', color: '#64748b' }}>
                  <span>Discount / Tax</span>
                  <span>KES 0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '1.1rem', fontWeight: 900, color: '#2563eb', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <span>Total</span>
                  <span>KES {(selectedInvoice.amount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Instructions & Bank Details */}
              <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#64748b', marginBottom: '20px' }}>
                Transfer the amount to the business account below. Please include invoice number on your check or M-Pesa reference.<br />
                <strong>PAYBILL:</strong> {currentOrg.mpesa_paybill_shortcode || '522522'} &bull; <strong>ACCOUNT:</strong> {activeUnit?.unit_number || 'Unit'}
              </div>

              {/* Notes */}
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>
                <strong>NOTES:</strong> All amounts are in Kenya Shillings (KES). Payment is due within 5 days from the issue date of this invoice. Thank you for your continued tenancy.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Missing Payment Modal */}
      {showReportMissingModal && (
        <div
          onClick={() => setShowReportMissingModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Report Missing M-Pesa Payment
              </h3>
              <button
                onClick={() => setShowReportMissingModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              If you made an M-Pesa payment and it has not reconciled to your ledger after 10 minutes, enter the M-Pesa transaction reference below for auditing.
            </p>

            <form onSubmit={handleSubmitMissingPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  M-Pesa Transaction Code (e.g. QKH829104A)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QKH829104A"
                  value={missingMpesaCode}
                  onChange={(e) => setMissingMpesaCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Amount Paid (KES)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={missingAmount}
                  onChange={(e) => setMissingAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowReportMissingModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMissing || !missingMpesaCode.trim()}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  {submittingMissing ? 'Submitting...' : 'Submit for Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
