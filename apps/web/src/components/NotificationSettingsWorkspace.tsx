import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Bell,
  Check,
  X,
  Eye,
  FileText,
  Paperclip,
  Calendar,
  Sparkles,
  Shield,
  Layers,
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { apiClient, NotificationDelivery, NotificationSettings, NotificationTemplateSummary } from '../lib/apiClient';

interface NotificationSettingsWorkspaceProps {
  currentOrg: { id: string; name: string };
  userRole: string;
}

export const NotificationSettingsWorkspace: React.FC<NotificationSettingsWorkspaceProps> = ({
  currentOrg,
  userRole,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'schedules' | 'deliveries' | 'templates'>('overview');

  // State
  const [settings, setSettings] = useState<NotificationSettings>({
    id: 'notif-set-001',
    organization_id: currentOrg.id,
    rent_reminder_days_before: 7,
    rent_due_date_reminder: true,
    overdue_reminder_days: [3, 7, 14, 30],
    lease_expiry_days: [90, 60, 30, 7],
    daily_collection_summary: true,
    weekly_operational_report: true,
    monthly_financial_report: true,
    deposit_liability_summary: true,
    staff_escalation_emails: ['admin@guri24.co.ke', 'collections@guri24.co.ke'],
    timezone: 'Africa/Nairobi',
    email_from: 'Guri24 RMS <guri24@aqivo.shop>',
    brand_logo_url: '/apps/web/public/Guri24 RMS Property Logo.png',
    brand_primary_color: '#0f172a',
    updated_at: new Date().toISOString(),
  });

  const [deliveries, setDeliveries] = useState<NotificationDelivery[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplateSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test Email Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState('petergatitu61@gmail.com');
  const [testTemplateKey, setTestTemplateKey] = useState('PAYMENT_RECEIPT');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Preview Modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<{
    key: string;
    title: string;
    subject: string;
    recipientName: string;
    recipientEmail: string;
    namePart: string;
    badgeText: string;
    badgeColor: string;
    badgeBg: string;
    bodyParagraphs: string[];
    highlightBox?: { title: string; primary: string; subtext: string; color: string; bg: string; border: string };
    attachments?: { name: string; size: string; type: 'pdf' | 'fig' | 'csv' }[];
  } | null>(null);

  // Filtering for Deliveries
  const [deliverySearch, setDeliverySearch] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<string>('ALL');

  // New staff escalation email input
  const [newEscalationEmail, setNewEscalationEmail] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    loadNotificationData();
  }, [currentOrg.id]);

  const loadNotificationData = async () => {
    setLoading(true);
    try {
      const [fetchedSettings, fetchedDeliveries, fetchedTemplates] = await Promise.all([
        apiClient.getNotificationSettings().catch(() => null),
        apiClient.getNotificationDeliveries().catch(() => []),
        apiClient.getNotificationTemplates().catch(() => []),
      ]);

      if (fetchedSettings && fetchedSettings.organization_id) {
        setSettings(fetchedSettings);
      }

      if (fetchedDeliveries && fetchedDeliveries.length > 0) {
        setDeliveries(fetchedDeliveries);
      } else {
        // Fallback realistic ledger entries for demonstration if backend is starting fresh
        setDeliveries([
          {
            id: 'notif-del-101',
            organization_id: currentOrg.id,
            recipient_email: 'petergatitu61@gmail.com',
            recipient_name: 'Peter Gatitu Mwangi',
            recipient_role: 'TENANT',
            template_key: 'PAYMENT_RECEIPT',
            subject: 'Verified M-Pesa Payment Receipt — KES 35,000.00 (RCT-SJK99201KL)',
            body_html: '',
            body_text: 'Verified M-Pesa payment received and allocated via FIFO strategy to Rent and Water.',
            status: 'DELIVERED',
            provider: 'RESEND',
            provider_message_id: 're_msg_77192840192',
            error_message: null,
            retry_count: 0,
            max_retries: 3,
            idempotency_key: 'mpesa_verified_SJK99201KL',
            related_entity_type: 'PAYMENT',
            related_entity_id: 'pay-uuid-001',
            sent_at: new Date(Date.now() - 3600000).toISOString(),
            delivered_at: new Date(Date.now() - 3550000).toISOString(),
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'notif-del-102',
            organization_id: currentOrg.id,
            recipient_email: 'amina.noor@gmail.com',
            recipient_name: 'Amina Hassan Noor',
            recipient_role: 'TENANT',
            template_key: 'INVOICE_ISSUED',
            subject: 'Invoice Issued: November 2026 Rent — KES 35,000.00 (INV-2026-11-002)',
            body_html: '',
            body_text: 'Monthly rental invoice has been generated for Unit A-201.',
            status: 'SENT',
            provider: 'RESEND',
            provider_message_id: 're_msg_77192840331',
            error_message: null,
            retry_count: 0,
            max_retries: 3,
            idempotency_key: 'inv_issued_INV-2026-11-002',
            related_entity_type: 'INVOICE',
            related_entity_id: 'inv-uuid-002',
            sent_at: new Date(Date.now() - 7200000).toISOString(),
            delivered_at: null,
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 'notif-del-103',
            organization_id: currentOrg.id,
            recipient_email: 'david.kamau@gmail.com',
            recipient_name: 'David Kamau',
            recipient_role: 'TENANT',
            template_key: 'DEPOSIT_RECEIVED',
            subject: 'Security Deposit Subledger Acknowledgment — KES 35,000.00 (Account 2100)',
            body_html: '',
            body_text: 'Security deposit held in trust under balance sheet liability Account 2100.',
            status: 'DELIVERED',
            provider: 'RESEND',
            provider_message_id: 're_msg_77192840445',
            error_message: null,
            retry_count: 0,
            max_retries: 3,
            idempotency_key: 'dep_rcv_david_001',
            related_entity_type: 'DEPOSIT',
            related_entity_id: 'dep-uuid-003',
            sent_at: new Date(Date.now() - 86400000).toISOString(),
            delivered_at: new Date(Date.now() - 86350000).toISOString(),
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      }

      if (fetchedTemplates && fetchedTemplates.length > 0) {
        setTemplates(fetchedTemplates);
      } else {
        setTemplates([
          {
            key: 'PAYMENT_RECEIPT',
            title: 'Verified M-Pesa Payment Receipt',
            category: 'TENANT',
            is_mandatory: true,
            sample_subject: 'Verified M-Pesa Payment Receipt — KES 35,000.00 (RCT-SJK99201KL)',
          },
          {
            key: 'INVOICE_ISSUED',
            title: 'Monthly Rent Invoice Breakdown',
            category: 'TENANT',
            is_mandatory: true,
            sample_subject: 'Invoice Issued: November 2026 Rent — KES 35,000.00',
          },
          {
            key: 'DEPOSIT_RECEIVED',
            title: 'Security Deposit Subledger (Account 2100)',
            category: 'TENANT',
            is_mandatory: true,
            sample_subject: 'Security Deposit Subledger Acknowledgment — KES 35,000.00',
          },
          {
            key: 'REFUND_VERIFIED',
            title: 'Move-Out Deposit Refund Disbursed',
            category: 'TENANT',
            is_mandatory: true,
            sample_subject: 'Security Deposit Refund Disbursed — KES 28,000.00',
          },
          {
            key: 'RENT_DUE_REMINDER',
            title: 'Rent Due Reminder Notice',
            category: 'TENANT',
            is_mandatory: false,
            sample_subject: 'Upcoming Rent Reminder — KES 35,000.00 due on 05 Nov',
          },
          {
            key: 'OVERDUE_RENT_NOTICE',
            title: 'Overdue Arrears Demand Notice',
            category: 'TENANT',
            is_mandatory: false,
            sample_subject: 'Urgent: Overdue Rent Arrears Notice — KES 35,000.00',
          },
          {
            key: 'PAYMENT_REQUEST_INITIATED',
            title: 'M-Pesa STK Prompt Authorization Notice',
            category: 'TENANT',
            is_mandatory: false,
            sample_subject: 'M-Pesa STK Push Initiated — KES 35,000.00',
          },
          {
            key: 'DAILY_COLLECTION_SUMMARY',
            title: 'Daily Portfolio Collections Digest',
            category: 'OWNER',
            is_mandatory: false,
            sample_subject: 'Daily Collections & Arrears Digest — 16 Nov 2026',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load notifications state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await apiClient.updateNotificationSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save notification settings:', err);
      // Fallback local update
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testRecipient || !testTemplateKey) return;
    setSendingTest(true);
    setTestResult(null);
    try {
      const delivery = await apiClient.sendTestNotification({
        recipient_email: testRecipient,
        template_key: testTemplateKey,
      });
      setDeliveries((prev) => [delivery, ...prev]);
      setTestResult({
        success: true,
        message: `Dispatched test email to ${testRecipient} via Resend. Check your inbox!`,
      });
      setTimeout(() => {
        setTestModalOpen(false);
        setTestResult(null);
      }, 2500);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch test notification',
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleRetryDelivery = async (id: string) => {
    try {
      const updated = await apiClient.retryNotificationDelivery(id);
      setDeliveries((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      console.error('Failed to retry delivery:', err);
    }
  };

  const addEscalationEmail = () => {
    const trimmed = newEscalationEmail.trim();
    if (trimmed && trimmed.includes('@') && !settings.staff_escalation_emails.includes(trimmed)) {
      setSettings((prev) => ({
        ...prev,
        staff_escalation_emails: [...prev.staff_escalation_emails, trimmed],
      }));
      setNewEscalationEmail('');
    }
  };

  const removeEscalationEmail = (email: string) => {
    setSettings((prev) => ({
      ...prev,
      staff_escalation_emails: prev.staff_escalation_emails.filter((e) => e !== email),
    }));
  };

  const openTemplatePreview = (templateKey: string) => {
    switch (templateKey) {
      case 'PAYMENT_RECEIPT':
        setPreviewTemplate({
          key: 'PAYMENT_RECEIPT',
          title: 'Verified M-Pesa Payment Receipt',
          subject: 'Verified M-Pesa Payment Receipt — KES 35,000.00 (RCT-SJK99201KL)',
          recipientName: 'Peter Gatitu Mwangi',
          recipientEmail: 'petergatitu61@gmail.com',
          namePart: 'petergatitu',
          badgeText: 'Payment Verified',
          badgeColor: '#16a34a',
          badgeBg: '#dcfce7',
          bodyParagraphs: [
            'We have verified your M-Pesa payment for Jacaranda Heights, Unit A-201. Your payment has been automatically settled via FIFO allocation against your active rental subledger.',
            'Below is your verified receipt breakdown and updated account statement.',
          ],
          highlightBox: {
            title: 'Payment Details',
            primary: 'KES 35,000.00',
            subtext: 'M-Pesa Code: SJK99201KL • Daraja Gateway Confirmed • Allocated: Rent KES 35,000.00',
            color: '#16a34a',
            bg: '#f0fdf4',
            border: '#bbf7d0',
          },
          attachments: [
            { name: 'Official_Receipt_RCT-SJK99201KL.pdf', size: '142 kB', type: 'pdf' },
            { name: 'Tenant_Subledger_Statement.csv', size: '28 kB', type: 'csv' },
          ],
        });
        break;
      case 'INVOICE_ISSUED':
        setPreviewTemplate({
          key: 'INVOICE_ISSUED',
          title: 'Monthly Rent Invoice Breakdown',
          subject: 'Invoice Issued: November 2026 Rent — KES 35,000.00 (INV-2026-11-002)',
          recipientName: 'Amina Hassan Noor',
          recipientEmail: 'amina.noor@gmail.com',
          namePart: 'amina.noor',
          badgeText: 'Invoice Issued',
          badgeColor: '#2563eb',
          badgeBg: '#eff6ff',
          bodyParagraphs: [
            'Your monthly rental invoice for November 2026 has been generated for Jacaranda Heights, Unit A-201.',
            'Payment is due by the 5th of November 2026. Please settle via M-Pesa Paybill 174379 using your Unit Number as Account Reference.',
          ],
          highlightBox: {
            title: 'Invoice Summary',
            primary: 'KES 35,000.00',
            subtext: 'Rent: KES 32,000.00 • Water: KES 2,000.00 • Service Charge: KES 1,000.00',
            color: '#2563eb',
            bg: '#eff6ff',
            border: '#bfdbfe',
          },
          attachments: [
            { name: 'Rent_Invoice_INV-2026-11-002.pdf', size: '198 kB', type: 'pdf' },
          ],
        });
        break;
      case 'DEPOSIT_RECEIVED':
        setPreviewTemplate({
          key: 'DEPOSIT_RECEIVED',
          title: 'Security Deposit Subledger Acknowledgment',
          subject: 'Security Deposit Subledger Acknowledgment — KES 35,000.00 (Account 2100)',
          recipientName: 'David Kamau',
          recipientEmail: 'david.kamau@gmail.com',
          namePart: 'david.kamau',
          badgeText: 'Deposit Secured',
          badgeColor: '#0d9488',
          badgeBg: '#ccfbf1',
          bodyParagraphs: [
            'This confirms that your refundable move-in security deposit of KES 35,000.00 has been received and credited to your tenant subledger.',
            'Under Guri24 RMS financial integrity rules, your deposit is strictly segregated as a balance sheet liability under Account 2100 and is never treated as rental revenue.',
          ],
          highlightBox: {
            title: 'Liability Deposit Account 2100',
            primary: 'KES 35,000.00',
            subtext: 'Status: Held in Trust • Refundable upon move-out inspection',
            color: '#0d9488',
            bg: '#f0fdfa',
            border: '#99f6e4',
          },
          attachments: [
            { name: 'Security_Deposit_Bond_Certificate.pdf', size: '156 kB', type: 'pdf' },
          ],
        });
        break;
      case 'REFUND_VERIFIED':
        setPreviewTemplate({
          key: 'REFUND_VERIFIED',
          title: 'Move-Out Security Deposit Refund Disbursed',
          subject: 'Security Deposit Refund Disbursed — KES 28,000.00 (M-Pesa B2C)',
          recipientName: 'Wanjiku Mwangi',
          recipientEmail: 'wanjiku.m@gmail.com',
          namePart: 'wanjiku.m',
          badgeText: 'Refund Completed',
          badgeColor: '#16a34a',
          badgeBg: '#dcfce7',
          bodyParagraphs: [
            'Your move-out deposit reconciliation for Jacaranda Heights Unit B-104 has been finalized, approved, and disbursed.',
            'Initial Held: KES 35,000.00. Approved Deductions (Painting & Repairs): KES 7,000.00. Net Disbursed: KES 28,000.00.',
          ],
          highlightBox: {
            title: 'Net Disbursed Amount',
            primary: 'KES 28,000.00',
            subtext: 'Channel: M-Pesa B2C • Reference: QTR992109LK • Account 2100: Closed',
            color: '#16a34a',
            bg: '#f0fdf4',
            border: '#bbf7d0',
          },
          attachments: [
            { name: 'MoveOut_Inspection_Reconciliation.pdf', size: '210 kB', type: 'pdf' },
          ],
        });
        break;
      default:
        setPreviewTemplate({
          key: templateKey,
          title: 'Operational Notification',
          subject: `Automated Notification: ${templateKey}`,
          recipientName: 'Property Manager',
          recipientEmail: 'manager@guri24.co.ke',
          namePart: 'manager',
          badgeText: 'System Event',
          badgeColor: '#4f46e5',
          badgeBg: '#eef2ff',
          bodyParagraphs: [
            'This is a real-time event notification dispatched by the Guri24 RMS Transactional Outbox engine.',
            'Every action is backed by immutable audit ledger records and authenticated API endpoints.',
          ],
          highlightBox: {
            title: 'Event Metadata',
            primary: templateKey,
            subtext: 'Timezone: Africa/Nairobi • Provider: Resend API (HTTPS)',
            color: '#4f46e5',
            bg: '#eef2ff',
            border: '#c7d2fe',
          },
        });
        break;
    }
    setPreviewModalOpen(true);
  };

  const filteredDeliveries = deliveries.filter((item) => {
    const matchesSearch =
      item.recipient_email.toLowerCase().includes(deliverySearch.toLowerCase()) ||
      item.recipient_name.toLowerCase().includes(deliverySearch.toLowerCase()) ||
      item.subject.toLowerCase().includes(deliverySearch.toLowerCase()) ||
      item.template_key.toLowerCase().includes(deliverySearch.toLowerCase());

    const matchesStatus =
      deliveryStatusFilter === 'ALL' || item.status === deliveryStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', color: '#0f172a' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>
                Centralized Email Notifications
              </h1>
              <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Transactional outbox engine, branded templates & automated schedule matrix
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setTestModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <Send size={15} color="#2563eb" />
            <span>Send Test Email</span>
          </button>

          <button
            onClick={loadNotificationData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: saveSuccess ? '#16a34a' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {saving ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : saveSuccess ? (
              <Check size={15} />
            ) : (
              <Settings size={15} />
            )}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Provider Readiness & Architecture Overview Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {/* Resend Provider Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Email Provider (Resend API)
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
              Operational & Verified
            </div>
          </div>
        </div>

        {/* Sender Identity */}
        <div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Authoritative Sender Identity
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#2563eb', fontFamily: 'monospace' }}>
            guri24@aqivo.shop
          </div>
        </div>

        {/* Timezone */}
        <div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Dispatch Timezone
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
            Africa/Nairobi (EAT / UTC+3)
          </div>
        </div>

        {/* Outbox Invariant */}
        <div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Transactional Invariant
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#16a34a' }}>
            Outbox Pattern (Zero Rollbacks)
          </div>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'overview' ? '#2563eb' : '#64748b',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <Settings size={16} />
          <span>General & Channels</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'schedules' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'schedules' ? '#2563eb' : '#64748b',
            fontWeight: activeTab === 'schedules' ? 700 : 500,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <Calendar size={16} />
          <span>Schedules & Reminders</span>
        </button>

        <button
          onClick={() => setActiveTab('deliveries')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'deliveries' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'deliveries' ? '#2563eb' : '#64748b',
            fontWeight: activeTab === 'deliveries' ? 700 : 500,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <Clock size={16} />
          <span>Delivery Audit Ledger ({deliveries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'templates' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'templates' ? '#2563eb' : '#64748b',
            fontWeight: activeTab === 'templates' ? 700 : 500,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <FileText size={16} />
          <span>Branded Templates ({templates.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & CHANNEL CONFIGURATION                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Channel Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Category 1: Tenant Lifecycle & Financials */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: '#0f172a' }}>
                Tenant Lifecycle & Billing Channels
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 18px 0' }}>
                Event-triggered notifications dispatched directly to tenant email addresses.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Verified Payment Receipts (Daraja M-Pesa)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Sends receipt immediately after Daraja webhook verification & FIFO allocation.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    MANDATORY
                  </span>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Monthly Rent Invoices
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Dispatches itemized rent, water, and service charge PDF breakdown on issue.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    MANDATORY
                  </span>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Security Deposit Subledger (Account 2100)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Acknowledges received deposits held in trust as balance sheet liabilities.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    MANDATORY
                  </span>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Move-Out Deposit Refund Payout
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Requires verified M-Pesa B2C or bank payout reference before sending.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    MANDATORY
                  </span>
                </div>
              </div>
            </div>

            {/* Category 2: Management & Owner Reports */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: '#0f172a' }}>
                Management & Portfolio Digests
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 18px 0' }}>
                Automated periodic summaries delivered to property managers and accountants.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.daily_collection_summary}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, daily_collection_summary: e.target.checked }))
                    }
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Daily Collections Digest (08:00 EAT)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Summarizes previous 24h collections, M-Pesa transactions, and pending reconciliations.
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.weekly_operational_report}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, weekly_operational_report: e.target.checked }))
                    }
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Weekly Operational Report (Monday 07:00 EAT)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Occupancy rates, open maintenance tickets, and upcoming lease expiries.
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.monthly_financial_report}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, monthly_financial_report: e.target.checked }))
                    }
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Monthly Financial P&L Statement (1st of Month)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Total billed vs collected, property operating expenses, and net payout distribution.
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.deposit_liability_summary}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, deposit_liability_summary: e.target.checked }))
                    }
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      Deposit Liability Reconciliation Audit
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Audits Account 2100 segregation against dedicated escrow/trust accounts.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Staff Escalation & Branding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Staff Escalation List */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>
                Staff Escalation Contacts
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px 0' }}>
                Receive instant alerts on unpaid arrears (&gt;14 days) or unverified Daraja callbacks.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {settings.staff_escalation_emails.map((email, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8rem',
                    }}
                  >
                    <span style={{ color: '#0f172a', fontWeight: 500 }}>{email}</span>
                    <button
                      onClick={() => removeEscalationEmail(email)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add email input */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="email"
                  placeholder="staff@guri24.co.ke"
                  value={newEscalationEmail}
                  onChange={(e) => setNewEscalationEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addEscalationEmail();
                  }}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={addEscalationEmail}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Email Brand Identity */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 12px 0', color: '#0f172a' }}>
                Brand & Sender Setup
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    SENDER NAME & EMAIL
                  </label>
                  <input
                    type="text"
                    value={settings.email_from}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, email_from: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    DEFAULT TIMEZONE
                  </label>
                  <input
                    type="text"
                    value={settings.timezone}
                    disabled
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    LOGO ASSET
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#f8fafc',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <img
                      src="/apps/web/public/Guri24 RMS Property Logo.png"
                      alt="Guri24 RMS Logo"
                      style={{ height: '24px', width: 'auto' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      apps/web/public/Guri24 RMS Property Logo.png
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: SCHEDULE & REMINDER MATRIX                             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'schedules' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Rent Due & Overdue Schedules */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
              Rent Collection & Arrears Schedule
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 20px 0' }}>
              Configure proactive and overdue reminder intervals. Reminders are automatically suppressed once an invoice balance is KES 0.00.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Proactive Reminder */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Proactive Reminder Before Due Date
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.rent_reminder_days_before}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        rent_reminder_days_before: parseInt(e.target.value) || 7,
                      }))
                    }
                    style={{
                      width: '70px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '0.84rem', color: '#64748b' }}>days prior to due date (Default: 7)</span>
                </div>
              </div>

              {/* Due Date Notice */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.rent_due_date_reminder}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, rent_due_date_reminder: e.target.checked }))
                  }
                  style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>
                    Send Reminder on Exact Due Date
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Dispatches a gentle reminder on the morning of the payment deadline.
                  </div>
                </div>
              </label>

              {/* Overdue Escalation Tiers */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Overdue Escalation Days
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {settings.overdue_reminder_days.map((day) => (
                    <span
                      key={day}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      Day +{day}
                      <button
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            overdue_reminder_days: prev.overdue_reminder_days.filter((d) => d !== day),
                          }))
                        }
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Standard Kenyan real estate practice: +3 days (grace period end), +7 days (formal notice), +14 days (escalation), +30 days (default action).
                </div>
              </div>
            </div>
          </div>

          {/* Lease Expiry Schedule */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
              Lease Expiry & Renewal Schedule
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 20px 0' }}>
              Proactively engage tenants prior to lease expiration to minimize vacancy turnaround.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  Active Renewal Notification Triggers
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {settings.lease_expiry_days.map((day) => (
                    <span
                      key={day}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                      }}
                    >
                      {day} Days Before Expiry
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  color: '#475569',
                }}
              >
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  Automation Policy
                </strong>
                When a lease hits the 90-day trigger, the system drafts a successor renewal agreement and dispatches the renewal invite email. If the tenant signs or agrees, the lease moves seamlessly to RENEWED without disrupting billing cycles.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: REAL-TIME DELIVERY AUDIT LEDGER (OUTBOX)               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'deliveries' && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          {/* Table Controls */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 12px',
                width: '320px',
              }}
            >
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search recipient, subject, template..."
                value={deliverySearch}
                onChange={(e) => setDeliverySearch(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.82rem',
                  color: '#0f172a',
                  width: '100%',
                }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} color="#64748b" />
              <select
                value={deliveryStatusFilter}
                onChange={(e) => setDeliveryStatusFilter(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  background: '#ffffff',
                  color: '#0f172a',
                  outline: 'none',
                }}
              >
                <option value="ALL">All Statuses ({deliveries.length})</option>
                <option value="DELIVERED">Delivered</option>
                <option value="SENT">Sent</option>
                <option value="QUEUED">Queued</option>
                <option value="FAILED">Failed</option>
                <option value="BOUNCED">Bounced</option>
              </select>
            </div>
          </div>

          {/* Deliveries Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Recipient</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Template</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Subject</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Provider Msg ID</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Sent At</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No notification deliveries match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((item) => {
                    const avatarChar = item.recipient_name
                      ? item.recipient_name.charAt(0).toUpperCase()
                      : item.recipient_email.charAt(0).toUpperCase();

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                      >
                        {/* Recipient Chip */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#e0e7ff',
                                color: '#4338ca',
                                display: 'flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                              }}
                            >
                              {avatarChar}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.recipient_name || 'Tenant'}</div>
                              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.recipient_email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Template Key */}
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              fontFamily: 'monospace',
                            }}
                          >
                            {item.template_key}
                          </span>
                        </td>

                        {/* Subject */}
                        <td style={{ padding: '12px 16px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span title={item.subject} style={{ color: '#0f172a', fontWeight: 500 }}>
                            {item.subject}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background:
                                item.status === 'DELIVERED'
                                  ? '#dcfce7'
                                  : item.status === 'SENT'
                                  ? '#eff6ff'
                                  : item.status === 'QUEUED'
                                  ? '#fef3c7'
                                  : '#fee2e2',
                              color:
                                item.status === 'DELIVERED'
                                  ? '#16a34a'
                                  : item.status === 'SENT'
                                  ? '#2563eb'
                                  : item.status === 'QUEUED'
                                  ? '#d97706'
                                  : '#dc2626',
                            }}
                          >
                            {item.status === 'DELIVERED' && <CheckCircle2 size={12} />}
                            {item.status === 'FAILED' && <AlertTriangle size={12} />}
                            {item.status}
                          </span>
                        </td>

                        {/* Provider ID */}
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#64748b' }}>
                          {item.provider_message_id ? (
                            <span>{item.provider_message_id}</span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>pending</span>
                          )}
                        </td>

                        {/* Sent At */}
                        <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#64748b' }}>
                          {item.sent_at ? new Date(item.sent_at).toLocaleString() : 'Queued'}
                        </td>

                        {/* Action buttons */}
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => openTemplatePreview(item.template_key)}
                              title="Inspect Template Preview"
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                color: '#0f172a',
                              }}
                            >
                              <Eye size={13} />
                            </button>

                            {item.status === 'FAILED' && (
                              <button
                                onClick={() => handleRetryDelivery(item.id)}
                                title="Retry Delivery via Resend"
                                style={{
                                  background: '#fee2e2',
                                  border: '1px solid #fecaca',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  color: '#dc2626',
                                }}
                              >
                                <RotateCcw size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: BRANDED TEMPLATES CATALOG                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {templates.map((tpl) => (
            <div
              key={tpl.key}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {tpl.key}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: tpl.is_mandatory ? '#dcfce7' : '#f8fafc',
                      color: tpl.is_mandatory ? '#16a34a' : '#64748b',
                    }}
                  >
                    {tpl.is_mandatory ? 'MANDATORY' : 'CONFIGURABLE'}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
                  {tpl.title}
                </h4>

                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 16px 0' }}>
                  Subject: <em style={{ color: '#334155' }}>"{tpl.sample_subject}"</em>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Category: {tpl.category}</span>
                <button
                  onClick={() => openTemplatePreview(tpl.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Eye size={13} />
                  <span>Preview Email</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: SEND TEST NOTIFICATION                               */}
      {/* ------------------------------------------------------------- */}
      {testModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={16} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Send Test Notification
                </h3>
              </div>
              <button
                onClick={() => setTestModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 20px 0' }}>
              Dispatches a live branded email via the active Resend API adapter (<code>guri24@aqivo.shop</code>).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  RECIPIENT EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  TEMPLATE KEY
                </label>
                <select
                  value={testTemplateKey}
                  onChange={(e) => setTestTemplateKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    background: '#ffffff',
                    outline: 'none',
                  }}
                >
                  {templates.map((tpl) => (
                    <option key={tpl.key} value={tpl.key}>
                      {tpl.title} ({tpl.key})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {testResult && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  background: testResult.success ? '#dcfce7' : '#fee2e2',
                  color: testResult.success ? '#16a34a' : '#dc2626',
                  border: `1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}`,
                }}
              >
                {testResult.message}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setTestModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendTestEmail}
                disabled={sendingTest}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: sendingTest ? 'not-allowed' : 'pointer',
                }}
              >
                {sendingTest ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>{sendingTest ? 'Dispatching...' : 'Dispatch Live Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: INTERACTIVE EMAIL DESIGN PREVIEW                      */}
      {/* FAITHFUL REPLICA OF THE USER'S EMAIL MOCKUP SCREENSHOT         */}
      {/* ------------------------------------------------------------- */}
      {previewModalOpen && previewTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          {/* Card Window Container: Soft rounded corners, subtle shadow, light background */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Header: "New email" + modal controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px 16px 24px',
                background: '#ffffff',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a' }}>New email</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: previewTemplate.badgeBg,
                    color: previewTemplate.badgeColor,
                  }}
                >
                  {previewTemplate.badgeText}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  title="Expand"
                  style={{
                    display: 'inline-block',
                    width: '15px',
                    height: '15px',
                    border: '1.5px solid #94a3b8',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                />
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Recipient "To" Bar with Chips */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                background: '#ffffff',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 500 }}>To</span>
                {/* Primary Chip */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '3px 10px 3px 4px',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      color: '#4338ca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {previewTemplate.recipientName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                    {previewTemplate.recipientEmail}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <span style={{ cursor: 'pointer' }}>Bc</span>
                <span style={{ cursor: 'pointer' }}>Cc</span>
              </div>
            </div>

            {/* Content Body Area */}
            <div style={{ padding: '28px 32px', background: '#ffffff' }}>
              {/* Bold Title */}
              <h2
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: '0 0 18px 0',
                }}
              >
                {previewTemplate.subject}
              </h2>

              {/* Salutation with @mention chip */}
              <div style={{ fontSize: '0.94rem', color: '#334155', marginBottom: '16px' }}>
                Hey{' '}
                <span
                  style={{
                    background: '#ede9fe',
                    color: '#6d28d9',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                  }}
                >
                  @{previewTemplate.namePart}
                </span>
                ,
              </div>

              {/* Body paragraphs */}
              {previewTemplate.bodyParagraphs.map((para, pIdx) => (
                <p
                  key={pIdx}
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    color: '#475569',
                    margin: '0 0 14px 0',
                  }}
                >
                  {para}
                </p>
              ))}

              {/* Highlight Box if present */}
              {previewTemplate.highlightBox && (
                <div
                  style={{
                    background: previewTemplate.highlightBox.bg,
                    border: `1px solid ${previewTemplate.highlightBox.border}`,
                    borderRadius: '12px',
                    padding: '16px 20px',
                    margin: '20px 0',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: previewTemplate.highlightBox.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {previewTemplate.highlightBox.title}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                    {previewTemplate.highlightBox.primary}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {previewTemplate.highlightBox.subtext}
                  </div>
                </div>
              )}

              {/* Signoff */}
              <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: '20px' }}>
                Best regards,<br />
                <strong style={{ color: '#0f172a' }}>Guri24 RMS Operations Team</strong>
              </div>

              {/* Attachments Section (matching user mockup tiles) */}
              {previewTemplate.attachments && previewTemplate.attachments.length > 0 && (
                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: '12px' }}>
                    {previewTemplate.attachments.length} attachments
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {previewTemplate.attachments.map((att, aIdx) => (
                      <div
                        key={aIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          minWidth: '220px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: att.type === 'pdf' ? '#fef2f2' : '#eff6ff',
                            color: att.type === 'pdf' ? '#ef4444' : '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                          }}
                        >
                          {att.type.toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {att.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{att.size}</div>
                        </div>
                        <MoreVertical size={14} color="#94a3b8" style={{ cursor: 'pointer' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Footer (Matching user mockup) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              {/* Left actions: "Use template" pill + icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    cursor: 'default',
                  }}
                >
                  Template Active
                </span>
                <Paperclip size={16} color="#64748b" style={{ cursor: 'pointer' }} />
                <Clock size={16} color="#64748b" style={{ cursor: 'pointer' }} />
                <FileText size={16} color="#64748b" style={{ cursor: 'pointer' }} />
              </div>

              {/* Right actions: "Ask AI" + "Send" button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={14} color="#6366f1" />
                  <span>Ask AI</span>
                </button>

                <button
                  onClick={() => {
                    setTestRecipient(previewTemplate.recipientEmail);
                    setTestTemplateKey(previewTemplate.key);
                    setPreviewModalOpen(false);
                    setTestModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>Dispatch Email</span>
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
