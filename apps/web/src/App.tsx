import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  BedDouble,
  Bookmark,
  Bot,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  ClipboardCheck,
  Command,
  CreditCard,
  Crown,
  Download,
  Droplets,
  FileCheck2,
  FileSearch,
  FileText,
  Globe,
  Home,
  Hourglass,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Mic,
  MoreHorizontal,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  PenSquare,
  Play,
  Plus,
  Scan,
  Search,
  Send,
  Settings,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Smartphone,
  Sparkles,
  Star,
  Trophy,
  Upload,
  UploadCloud,
  User,
  Users,
  Wallet,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { AssistantAttachment } from './types';
import { AuthExperience, AuthUserSession } from './components/AuthExperience';
import { apiClient } from './lib/apiClient';
import {
  createEmptyRmsState,
  createInitialRmsState,
  sanitizeWorkspaceState,
  executeEndToEndOnboardingChain,
  generateIdempotentInvoice,
  getNextMaintenanceStatuses,
  hasPermission,
  processVerifiedMpesaPayment,
  resolveAssistantConfirmation,
  resolveDependentUnitHierarchy,
  reviewOcrDocumentJob,
  RmsPlatformState,
  ROLE_PERMISSIONS,
  sendAssistantPrompt,
  submitOcrDocumentJob,
} from './lib/api';
import {
  formatKes,
  formatNairobiDate,
  yieldToMain,
} from './lib/formatters';
import {
  FeaturedPropertyIllustration,
  MiniSparkline,
  ModalDialog,
  ResponsiveTable,
  SegmentedTickBar,
  StatusBadge,
} from './components/ui/Primitives';
import {
  JournalEntry,
  MaintenanceStatus,
  OcrDocumentCategory,
  OcrJobRecord,
  PropertyExpense,
  SystemRole,
} from './types';
import { ImportWizard } from './components/ImportWizard';
import { BulkEditableGrid } from './components/BulkEditableGrid';
import { DocumentScanner } from './components/DocumentScanner';
import { OCRReviewForm } from './components/OCRReviewForm';
import { VoiceInput } from './components/VoiceInput';
import { ImportHistory } from './components/ImportHistory';
import {
  ImportModuleKey,
  MODULE_TEMPLATES,
  exportRowsToCsv,
} from './lib/importEngine';
import { FullPageAssistant } from './components/FullPageAssistant';
import { FinancialOperationsWorkspace } from './components/FinancialOperationsWorkspace';
import { NotificationSettingsWorkspace } from './components/NotificationSettingsWorkspace';
import { AnalyticsLedgerWorkspace } from './components/AnalyticsLedgerWorkspace';

export type NavSection =
  | 'dashboard'
  | 'leases'
  | 'properties'
  | 'tenants'
  | 'payments'
  | 'locations'
  | 'maintenance'
  | 'ocr'
  | 'assistant'
  | 'analytics'
  | 'notifications'
  | 'settings';

const MAIN_MENU_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  hasChevron?: boolean;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={16} aria-hidden="true" /> },
  {
    id: 'leases',
    label: 'Leases & Bookings',
    icon: <Calendar size={16} aria-hidden="true" />,
  },
  {
    id: 'properties',
    label: 'Properties & Units',
    icon: <Building2 size={16} aria-hidden="true" />,
  },
  { id: 'tenants', label: 'Tenants', icon: <Users size={16} aria-hidden="true" /> },
  {
    id: 'payments',
    label: 'Payments & M-Pesa',
    icon: <CreditCard size={16} aria-hidden="true" />,
  },
  {
    id: 'locations',
    label: 'Estates & Deposits',
    icon: <MapPin size={16} aria-hidden="true" />,
  },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={16} aria-hidden="true" /> },
  {
    id: 'ocr',
    label: 'OCR & Documents',
    icon: <FileSearch size={16} aria-hidden="true" />,
  },
  {
    id: 'assistant',
    label: 'AI Assistant',
    icon: <Bot size={16} aria-hidden="true" />,
  },
  {
    id: 'analytics',
    label: 'Analytics & Ledger',
    icon: <BarChart3 size={16} aria-hidden="true" />,
    hasChevron: true,
  },
  {
    id: 'notifications',
    label: 'Automated Emails',
    icon: <Mail size={16} aria-hidden="true" />,
  },
  { id: 'settings', label: 'Settings & Portal', icon: <Settings size={16} aria-hidden="true" /> },
];

const ROLES_LIST: SystemRole[] = [
  'SAAS_SUPER_ADMINISTRATOR',
  'ORGANIZATION_ADMINISTRATOR',
  'PROPERTY_OWNER',
  'PROPERTY_MANAGER',
  'ACCOUNTANT',
  'RECEPTIONIST',
  'MAINTENANCE_OFFICER',
  'TENANT',
  'VENDOR',
];

function formatUnitTypeLabel(rawType: string, bedrooms?: number): string {
  const clean = rawType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return bedrooms !== undefined ? `${clean} (${bedrooms}BR)` : clean;
}

function StructuredAssistantResponse({
  content,
  blockedReason,
}: {
  content: string;
  blockedReason?: string;
}) {
  if (blockedReason) {
    return (
      <div
        style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '12px 14px',
          color: '#991b1b',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <ShieldAlert size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#b91c1c', display: 'block', marginBottom: '2px' }}>
            Security & Grounding Guard
          </strong>
          {content}
        </div>
      </div>
    );
  }

  const cleanLine = (str: string) => str.replace(/\*\*/g, '').replace(/###\s*/g, '').trim();
  const kesMatches = content.match(/KES\s?[\d,]+(\.\d{2})?/gi);
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', lineHeight: 1.6, color: '#0f172a' }}>
      {kesMatches && kesMatches.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBlockEnd: '4px' }}>
          {Array.from(new Set(kesMatches)).slice(0, 3).map((amt, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '4px 10px',
                color: '#065f46',
                fontWeight: 700,
                fontSize: '0.82rem',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <CircleDollarSign size={13} color="#059669" />
              <span>{amt}</span>
            </span>
          ))}
        </div>
      )}

      {lines.map((line, idx) => {
        const isBullet = line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line);
        const isHeading = line.startsWith('###') || (line.endsWith(':') && line.length < 60);

        if (isHeading) {
          return (
            <div
              key={idx}
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBlockStart: idx > 0 ? '6px' : '0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="#2563eb" />
              <span>{cleanLine(line)}</span>
            </div>
          );
        }

        if (isBullet) {
          const textOnly = line.replace(/^[-*]\s+|\d+\.\s+/, '');
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#0f172a',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>{cleanLine(textOnly)}</span>
            </div>
          );
        }

        return (
          <p key={idx} style={{ margin: 0, color: '#0f172a', fontSize: '0.86rem', lineHeight: 1.6 }}>
            {cleanLine(line)}
          </p>
        );
      })}
    </div>
  );
}

function ModuleActionToolbar({
  moduleKey,
  onAddNew,
  addNewLabel = 'Add New',
  onOpenImport,
  onOpenBulkGrid,
  onOpenScanner,
  onExportCsv,
  onOpenHistory,
  scannerLabel = 'Scan / QR',
}: {
  moduleKey: ImportModuleKey;
  onAddNew?: () => void;
  addNewLabel?: string;
  onOpenImport: (mod: ImportModuleKey) => void;
  onOpenBulkGrid: (mod: ImportModuleKey) => void;
  onOpenScanner?: (mod: ImportModuleKey) => void;
  onExportCsv: (mod: ImportModuleKey) => void;
  onOpenHistory: () => void;
  scannerLabel?: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      {onAddNew && (
        <button type="button" className="btn-dark" onClick={onAddNew}>
          <Plus size={15} aria-hidden="true" />
          <span>{addNewLabel}</span>
        </button>
      )}
      <button
        type="button"
        className="btn-outline"
        onClick={() => onOpenImport(moduleKey)}
        title="Import CSV or Excel (.xlsx) file with column mapping and validation"
      >
        <Upload size={14} aria-hidden="true" />
        <span>Import CSV/Excel</span>
      </button>
      <button
        type="button"
        className="btn-outline"
        onClick={() => onOpenBulkGrid(moduleKey)}
        title="Spreadsheet inline edit and Paste from Excel or Google Sheets"
      >
        <Layers size={14} aria-hidden="true" />
        <span>Bulk Add / Paste</span>
      </button>
      {onOpenScanner && (
        <button
          type="button"
          className="btn-outline"
          onClick={() => onOpenScanner(moduleKey)}
          title="Mobile camera capture and QR / document auto-detection"
        >
          <Scan size={14} aria-hidden="true" />
          <span>{scannerLabel}</span>
        </button>
      )}
      <button
        type="button"
        className="btn-outline"
        onClick={() => onExportCsv(moduleKey)}
        title="Export records to CSV"
      >
        <Download size={14} aria-hidden="true" />
        <span>Export CSV</span>
      </button>
      <button
        type="button"
        className="btn-outline"
        onClick={onOpenHistory}
        title="View import history and integrity audits"
      >
        <Hourglass size={14} aria-hidden="true" />
        <span>Import History</span>
      </button>
    </div>
  );
}

export function App() {
  const [state, setState] = useState<RmsPlatformState>(() => createInitialRmsState());
  const [activeNav, setActiveNav] = useState<NavSection>('dashboard');
  const [propertySubTab, setPropertySubTab] = useState<'units' | 'properties' | 'buildings' | 'floors'>('units');
  const [maintenanceSubTab, setMaintenanceSubTab] = useState<'work_orders' | 'vendors' | 'inspections'>('work_orders');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'ledger' | 'expenses' | 'documents' | 'reports'>('ledger');
  const [settingsSubTab, setSettingsSubTab] = useState<'org' | 'mpesa' | 'notifications' | 'rbac' | 'integrations' | 'subscription' | 'portal'>('org');

  const [darajaForm, setDarajaForm] = useState({
    shortcode: '4098123',
    consumerKey: '',
    consumerSecret: '',
    passkey: '',
    callbackUrl: 'https://api.guri24rms.co.ke/api/v1/payments/mpesa/callback',
    environment: 'sandbox',
    status: 'UNCONFIGURED',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isOcrUploadModalOpen, setIsOcrUploadModalOpen] = useState(false);
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState(false);

  // Bulk Import, Acquisition & Data Entry Modals
  const [importWizardModule, setImportWizardModule] = useState<ImportModuleKey | null>(null);
  const [bulkGridModule, setBulkGridModule] = useState<ImportModuleKey | null>(null);
  const [scannerModule, setScannerModule] = useState<ImportModuleKey | null>(null);
  const [isImportHistoryOpen, setIsImportHistoryOpen] = useState(false);
  const [ocrReviewModalJob, setOcrReviewModalJob] = useState<OcrJobRecord | null>(null);

  // OCR & Assistant UI state
  const [selectedOcrJobId, setSelectedOcrJobId] = useState<string>('');
  const [ocrCorrections, setOcrCorrections] = useState<Record<string, string>>({});
  const [ocrReviewNotes, setOcrReviewNotes] = useState<string>(
    'Verified against original physical document.'
  );
  const [assistantPromptInput, setAssistantPromptInput] = useState<string>('');
  const [assistantAttachedFile, setAssistantAttachedFile] = useState<{
    name: string;
    sizeKb: number;
    mimeType: string;
    kind: 'document' | 'audio' | 'image';
  } | null>(null);
  const [assistantAudioPlaying, setAssistantAudioPlaying] = useState(false);
  const assistantFileInputRef = useRef<HTMLInputElement | null>(null);

  // Frontier AI Workspace State
  const [isFrontierSidebarCollapsed, setIsFrontierSidebarCollapsed] = useState(false);
  const [hideFrontierVideo, setHideFrontierVideo] = useState(false);
  const [hideFrontierAnnouncement, setHideFrontierAnnouncement] = useState(false);

  // OCR Interactive Drag-Drop & Direct Upload
  const [ocrDragActive, setOcrDragActive] = useState(false);
  const ocrDirectFileInputRef = useRef<HTMLInputElement | null>(null);

  // User Authentication & Session State (Only accepts verified JWT tokens)
  const [currentUserSession, setCurrentUserSession] = useState<AuthUserSession | null>(() => {
    try {
      if (typeof window !== 'undefined' && (window.location.search.includes('auth') || window.location.search.includes('logout'))) {
        localStorage.removeItem('guri24_rms_auth_session');
        localStorage.removeItem('guri24_token');
        return null;
      }
      const stored = localStorage.getItem('guri24_rms_auth_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only accept real cryptographic JWT tokens (format: eyJ...)
        if (parsed && typeof parsed.token === 'string' && parsed.token.startsWith('eyJ')) {
          return parsed;
        }
      }
      // Purge any stale legacy mock sessions
      localStorage.removeItem('guri24_rms_auth_session');
      localStorage.removeItem('guri24_token');
      return null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('guri24_rms_auth_session');
    localStorage.removeItem('guri24_token');
    setCurrentUserSession(null);
    announce('Logged out of Guri24 RMS');
  };

  const mainHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const announce = (msg: string) => {
    setLiveAnnouncement(msg);
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Default fallback organization structure for clean bootstrapping
  const defaultOrg = useMemo(
    () => ({
      id: 'org-guri24-001',
      name: 'Guri24 Rental Management Ltd',
      slug: 'guri24-ke',
      organization_type: 'PROPERTY_MANAGEMENT_COMPANY' as const,
      kra_pin: 'P051892341K',
      contact_email: 'admin@guri24rms.co.ke',
      contact_phone: '254712345678',
      county: 'Nairobi',
      currency: 'KES' as const,
      timezone: 'Africa/Nairobi' as const,
      mpesa_paybill_shortcode: '174379',
      late_fee_percentage: 5.0,
      late_fee_grace_days: 5,
      rent_calculation_strategy: 'FIXED_MONTHLY' as const,
      payment_allocation_strategy: 'FIFO_OLDEST_FIRST' as const,
    }),
    []
  );

  // Synchronize API client token with active user session
  useEffect(() => {
    if (currentUserSession?.token) {
      apiClient.setToken(currentUserSession.token);
    } else {
      apiClient.setToken(null);
    }
  }, [currentUserSession]);

  // Strict multi-tenant scoping
  const currentOrg = useMemo(
    () =>
      state.organizations.find((o) => o.id === state.currentOrganizationId) ??
      state.organizations[0] ??
      defaultOrg,
    [state.organizations, state.currentOrganizationId, defaultOrg]
  );

  const currentUserRole: SystemRole = state.currentRole;

  // Real backend API initialization & reload function
  const loadWorkspaceSnapshot = useCallback(async () => {
    try {
      const [integrationsRes, snapshotRes] = await Promise.allSettled([
        apiClient.getIntegrationsStatus(),
        apiClient.getWorkspaceSnapshot(),
      ]);

      const liveIntegrations = integrationsRes.status === 'fulfilled' ? integrationsRes.value : [];
      const snapshot = snapshotRes.status === 'fulfilled' ? snapshotRes.value : null;

      if (snapshot && snapshot.organizations && snapshot.organizations.length > 0) {
        const sanitized = sanitizeWorkspaceState(snapshot);
        setState((prev) => ({
          ...prev,
          ...sanitized,
          currentOrganizationId: currentUserSession?.organizationId || sanitized.currentOrganizationId || prev.currentOrganizationId,
          integrationsStatus: liveIntegrations.length > 0 ? liveIntegrations : (sanitized.integrationsStatus || []),
        }));
        // Persist sanitized state to remote store to permanently purge any legacy mock records
        apiClient.saveWorkspaceSnapshot(sanitized).catch(() => {});
      } else {
        // If no remote snapshot yet, fetch collections from backend REST API
        const [propsRes, unitsRes, leasesRes, invsRes, paysRes] = await Promise.allSettled([
          apiClient.getProperties(),
          apiClient.getUnits(),
          apiClient.getLeases(),
          apiClient.getInvoices(),
          apiClient.getPayments(),
        ]);

        const liveProps = propsRes.status === 'fulfilled' ? propsRes.value : [];
        const liveUnits = unitsRes.status === 'fulfilled' ? unitsRes.value : [];
        const liveLeases = leasesRes.status === 'fulfilled' ? leasesRes.value : [];
        const liveInvs = invsRes.status === 'fulfilled' ? invsRes.value : [];
        const livePays = paysRes.status === 'fulfilled' ? paysRes.value : [];

        const activeOrgId = currentUserSession?.organizationId || defaultOrg.id;
        const userOrg = {
          id: activeOrgId,
          name: currentUserSession?.organizationName || defaultOrg.name,
          slug: (currentUserSession?.organizationName || defaultOrg.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          organization_type: 'PROPERTY_MANAGEMENT_COMPANY' as const,
          kra_pin: 'P051892341K',
          contact_email: currentUserSession?.email || defaultOrg.contact_email,
          contact_phone: currentUserSession?.phone || defaultOrg.contact_phone,
          county: 'Nairobi',
          currency: 'KES' as const,
          timezone: 'Africa/Nairobi' as const,
          mpesa_paybill_shortcode: '174379',
          late_fee_percentage: 5.0,
          late_fee_grace_days: 5,
          rent_calculation_strategy: 'FIXED_MONTHLY' as const,
          payment_allocation_strategy: 'FIFO_OLDEST_FIRST' as const,
        };

        setState((prev) => ({
          ...prev,
          currentOrganizationId: activeOrgId,
          organizations: prev.organizations.some((o) => o.id === activeOrgId)
            ? prev.organizations
            : [userOrg, ...(prev.organizations.length > 0 ? prev.organizations : [defaultOrg])],
          properties: liveProps,
          units: liveUnits,
          leases: liveLeases,
          invoices: liveInvs,
          payments: livePays,
          integrationsStatus: liveIntegrations,
        }));
      }
    } catch (err) {
      console.warn('Real backend sync check:', err);
    }
  }, [defaultOrg, currentUserSession]);

  useEffect(() => {
    loadWorkspaceSnapshot();
  }, [loadWorkspaceSnapshot]);

  const orgProperties = useMemo(
    () => state.properties.filter((p) => p.organization_id === currentOrg.id),
    [state.properties, currentOrg.id]
  );
  const orgBuildings = useMemo(
    () => state.buildings.filter((b) => b.organization_id === currentOrg.id),
    [state.buildings, currentOrg.id]
  );
  const orgFloors = useMemo(
    () => state.floors.filter((f) => f.organization_id === currentOrg.id),
    [state.floors, currentOrg.id]
  );
  const orgUnits = useMemo(
    () => state.units.filter((u) => u.organization_id === currentOrg.id),
    [state.units, currentOrg.id]
  );
  const orgTenants = useMemo(
    () => state.tenants.filter((t) => t.organization_id === currentOrg.id),
    [state.tenants, currentOrg.id]
  );
  const orgApplications = useMemo(
    () => state.applications.filter((a) => a.organization_id === currentOrg.id),
    [state.applications, currentOrg.id]
  );
  const orgLeases = useMemo(
    () => state.leases.filter((l) => l.organization_id === currentOrg.id),
    [state.leases, currentOrg.id]
  );
  const orgInvoices = useMemo(
    () => state.invoices.filter((i) => i.organization_id === currentOrg.id),
    [state.invoices, currentOrg.id]
  );
  const orgPayments = useMemo(
    () => state.payments.filter((p) => p.organization_id === currentOrg.id),
    [state.payments, currentOrg.id]
  );
  const orgDeposits = useMemo(
    () => state.deposits.filter((d) => d.organization_id === currentOrg.id),
    [state.deposits, currentOrg.id]
  );
  const orgJournals = useMemo(
    () => state.journals.filter((j) => j.organization_id === currentOrg.id),
    [state.journals, currentOrg.id]
  );
  const orgExpenses = useMemo(
    () => state.expenses.filter((e) => e.organization_id === currentOrg.id),
    [state.expenses, currentOrg.id]
  );
  const orgMaintenance = useMemo(
    () => state.maintenance.filter((m) => m.organization_id === currentOrg.id),
    [state.maintenance, currentOrg.id]
  );
  const orgDocuments = useMemo(
    () => state.documents.filter((d) => d.organization_id === currentOrg.id),
    [state.documents, currentOrg.id]
  );
  const orgOcrJobs = useMemo(
    () => state.ocrJobs.filter((j) => j.organization_id === currentOrg.id),
    [state.ocrJobs, currentOrg.id]
  );
  const orgConversations = useMemo(
    () => state.assistantConversations.filter((c) => !c.organization_id || c.organization_id === currentOrg.id),
    [state.assistantConversations, currentOrg.id]
  );
  const orgConfirmations = useMemo(
    () => state.assistantConfirmations.filter((c) => c.organization_id === currentOrg.id),
    [state.assistantConfirmations, currentOrg.id]
  );
  const orgVendors = useMemo(
    () => state.vendors.filter((v) => v.organization_id === currentOrg.id),
    [state.vendors, currentOrg.id]
  );
  const orgInspections = useMemo(
    () => state.inspections.filter((i) => i.organization_id === currentOrg.id),
    [state.inspections, currentOrg.id]
  );
  const currentSubscription = useMemo(
    () =>
      state.subscriptions.find((s) => s.organization_id === currentOrg.id) ??
      state.subscriptions[0],
    [state.subscriptions, currentOrg.id]
  );
  const selectedOcrJob = useMemo(
    () => (selectedOcrJobId ? (orgOcrJobs.find((j) => j.id === selectedOcrJobId) ?? null) : null),
    [orgOcrJobs, selectedOcrJobId]
  );
  const activeConversation = useMemo(
    () => orgConversations[0],
    [orgConversations]
  );

  // Portfolio Metrics
  const kpis = useMemo(() => {
    const totalUnits = orgUnits.length;
    const occupiedUnits = orgUnits.filter((u) => u.status === 'OCCUPIED').length;
    const vacantUnits = orgUnits.filter((u) => u.status === 'VACANT' || u.status === 'VACANT_AVAILABLE').length;
    const billedKes = orgInvoices.reduce((acc, i) => acc + (i.total_amount_kes || 0), 0);
    const collectedKes = orgPayments
      .filter((p) => p.status === 'COMPLETED' || p.status === 'CONFIRMED' || !p.status)
      .reduce((acc, p) => acc + (p.allocated_amount_kes || p.amount_kes || 0), 0);
    const arrearsKes = orgInvoices.reduce((acc, i) => acc + (i.balance_kes || 0), 0);
    const depositsLiabilityKes = orgDeposits.reduce(
      (acc, d) => acc + (d.current_liability_balance_kes || 0),
      0
    );
    const openMaintenance = orgMaintenance.filter(
      (m) => m.status !== 'CLOSED' && m.status !== 'REJECTED'
    ).length;

    return {
      totalUnits,
      occupiedUnits,
      vacantUnits,
      billedKes,
      collectedKes,
      arrearsKes,
      depositsLiabilityKes,
      openMaintenance,
    };
  }, [orgUnits, orgInvoices, orgPayments, orgDeposits, orgMaintenance]);

  const monthlyChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, idx) => {
      const monthPrefix = `2026-${String(idx + 1).padStart(2, '0')}`;
      const invoices = orgInvoices.filter(
        (i) => i.billing_period?.startsWith(monthPrefix) || i.due_date?.startsWith(monthPrefix)
      );
      const payments = orgPayments.filter((p) => p.payment_date?.startsWith(monthPrefix));
      const revenue = payments.reduce((acc, p) => acc + (p.allocated_amount_kes || p.amount_kes || 0), 0);
      return {
        month: m,
        count: invoices.length,
        revenueKes: revenue,
      };
    });
  }, [orgInvoices, orgPayments]);

  const maxChartCount = useMemo(() => {
    const maxVal = Math.max(...monthlyChartData.map((d) => d.count), 1);
    return maxVal;
  }, [monthlyChartData]);

  const unitTypePerformance = useMemo(() => {
    if (orgUnits.length === 0) return [];
    const map = new Map<string, { count: number; totalRent: number }>();
    orgUnits.forEach((u) => {
      const label = formatUnitTypeLabel(u.unit_type, u.bedrooms);
      const cur = map.get(label) || { count: 0, totalRent: 0 };
      map.set(label, {
        count: cur.count + 1,
        totalRent: cur.totalRent + (u.monthly_rent_kes || 0),
      });
    });
    const totalRent = Array.from(map.values()).reduce((acc, v) => acc + v.totalRent, 0);
    const colors = ['#2563eb', '#0d9488', '#10b981', '#38bdf8', '#f59e0b', '#8b5cf6'];
    return Array.from(map.entries()).map(([label, val], idx) => ({
      label,
      totalRent: val.totalRent,
      count: val.count,
      color: colors[idx % colors.length],
      percentage: totalRent > 0 ? Math.round((val.totalRent / totalRent) * 100) : 0,
    }));
  }, [orgUnits]);

  // Forms State
  const [onboardForm, setOnboardForm] = useState({
    propertyName: '',
    propertyCode: '',
    county: 'Nairobi',
    estate: '',
    address: '',
    buildingName: '',
    buildingCode: '',
    floorNumber: 1,
    floorLabel: 'Ground Floor',
    unitNumber: '',
    unitType: 'TWO_BEDROOM',
    bedrooms: 2,
    monthlyRentKes: 25000,
    depositKes: 25000,
    tenantFullName: '',
    tenantPhone: '',
    tenantEmail: '',
    tenantNationalId: '',
    leaseStartDate: new Date().toISOString().slice(0, 10),
    leaseEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    billingDay: 5,
  });

  const [mpesaForm, setMpesaForm] = useState({
    tenantId: '',
    payerPhone: '',
    amountKes: 10000,
    mpesaReceiptNumber: '',
    checkoutRequestId: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    leaseId: '',
    billingPeriod: new Date().toISOString().slice(0, 7),
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    propertyId: '',
    buildingId: '',
    floorId: '',
    unitId: '',
    category: 'PLUMBING',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY',
    title: '',
    description: '',
    estimatedCostKes: 0,
    preferredInspectionAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });

  const [ocrUploadForm, setOcrUploadForm] = useState({
    fileName: '',
    mimeType: 'application/pdf',
    fileSizeKb: 0,
    pageCount: 1,
    documentCategory: 'LEASE_AGREEMENT' as OcrDocumentCategory,
    linkedEntityLabel: '',
    rawSampleText: '',
  });

  const dependentHierarchy = useMemo(
    () =>
      resolveDependentUnitHierarchy(state, {
        propertyId: maintenanceForm.propertyId,
        buildingId: maintenanceForm.buildingId,
        floorId: maintenanceForm.floorId,
        unitId: maintenanceForm.unitId,
      }),
    [
      state,
      maintenanceForm.propertyId,
      maintenanceForm.buildingId,
      maintenanceForm.floorId,
      maintenanceForm.unitId,
    ]
  );

  // Handlers
  const handleExportCsv = async () => {
    await yieldToMain();
    const csv = [
      'metric,value,currency',
      `organization,"${currentOrg.name}",TEXT`,
      `total_properties,${orgProperties.length},COUNT`,
      `total_units,${kpis.totalUnits},COUNT`,
      `occupied_units,${kpis.occupiedUnits},COUNT`,
      `available_units,${kpis.vacantUnits},COUNT`,
      `total_billed_revenue,${kpis.billedKes},KES`,
      `total_collected_revenue,${kpis.collectedKes},KES`,
      `outstanding_arrears,${kpis.arrearsKes},KES`,
      `security_deposits_held_liability,${kpis.depositsLiabilityKes},KES`,
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guri24_rms_${currentOrg.slug}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    announce(`Exported CSV financial summary for ${currentOrg.name}`);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const next = executeEndToEndOnboardingChain(state, onboardForm);
      setState(next);
      apiClient.saveWorkspaceSnapshot(next).catch(console.error);
      setIsOnboardModalOpen(false);
      announce(
        `Created ${onboardForm.propertyName} • Unit ${onboardForm.unitNumber} and activated lease for ${onboardForm.tenantFullName}`
      );
    } catch (err) {
      announce((err as Error).message);
    }
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = generateIdempotentInvoice(state, invoiceForm.leaseId, invoiceForm.billingPeriod);
      setState(res.nextState);
      apiClient.saveWorkspaceSnapshot(res.nextState).catch(console.error);
      setIsInvoiceModalOpen(false);
      if (res.created) {
        announce(
          `Generated recurring invoice ${res.invoice.invoice_number} (${formatKes(res.invoice.total_amount_kes)})`
        );
      } else {
        announce(
          `Idempotency Guard: Invoice ${res.invoice.invoice_number} already exists for period ${invoiceForm.billingPeriod} (no duplicate created)`
        );
      }
    } catch (err) {
      announce((err as Error).message);
    }
  };

  const handleMpesaCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = processVerifiedMpesaPayment(state, mpesaForm);
      setState(res.nextState);
      apiClient.saveWorkspaceSnapshot(res.nextState).catch(console.error);
      setIsMpesaModalOpen(false);
      if (res.duplicateIgnored) {
        announce(
          `Idempotency Guard: Duplicate M-Pesa receipt ${mpesaForm.mpesaReceiptNumber} ignored safely`
        );
      } else {
        announce(
          `M-Pesa payment ${res.payment.mpesa_receipt_number} (${formatKes(res.payment.amount_kes)}) allocated across ${res.payment.allocations.length} invoice(s)`
        );
      }
    } catch (err) {
      announce((err as Error).message);
    }
  };

  const handleConnectDaraja = (e: React.FormEvent) => {
    e.preventDefault();
    if (!darajaForm.shortcode.trim()) {
      announce('Please enter your M-Pesa Shortcode (Paybill or Till Number)');
      return;
    }
    setDarajaForm((prev) => ({ ...prev, status: 'CONNECTED' }));
    const nextOrgs = state.organizations.map((org) =>
      org.id === currentOrg.id
        ? {
            ...org,
            mpesa_paybill_shortcode: darajaForm.shortcode.trim(),
            mpesa_consumer_key: darajaForm.consumerKey.trim(),
            mpesa_consumer_secret: darajaForm.consumerSecret.trim(),
            mpesa_passkey: darajaForm.passkey.trim(),
            mpesa_callback_url: darajaForm.callbackUrl.trim(),
          }
        : org
    );
    const nextIntegrations = state.integrationsStatus.map((item) =>
      item.provider_key === 'MPESA_DARAJA'
        ? {
            ...item,
            live_credentials_configured: true,
            status_label: `Daraja Live Connected (Paybill ${darajaForm.shortcode.trim()})`,
            honest_disclosure: `Safaricom Daraja credentials active for organization ${currentOrg.name}. Shortcode ${darajaForm.shortcode.trim()} configured for STK push and C2B payment callbacks.`,
          }
        : item
    );
    const nextState = {
      ...state,
      organizations: nextOrgs,
      integrationsStatus: nextIntegrations,
    };
    setState(nextState);
    apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
    announce(`M-Pesa Daraja shortcode ${darajaForm.shortcode.trim()} connected successfully for ${currentOrg.name}!`);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unit = orgUnits.find((u) => u.id === maintenanceForm.unitId) ?? orgUnits[0];
    if (!unit) {
      announce('Please register or onboard a unit before creating maintenance tickets.');
      return;
    }
    const seq = orgMaintenance.length + 1;
    const newReq = {
      id: `mnt-${Date.now()}`,
      organization_id: currentOrg.id,
      property_id: unit.property_id,
      building_id: unit.building_id,
      unit_id: unit.id,
      tenant_id: unit.current_tenant_id,
      request_number: `MNT-${String(seq).padStart(4, '0')}`,
      category: maintenanceForm.category,
      priority: maintenanceForm.priority,
      title: maintenanceForm.title,
      description: maintenanceForm.description,
      status: 'SUBMITTED' as MaintenanceStatus,
      estimated_cost_kes: maintenanceForm.estimatedCostKes,
      actual_cost_kes: 0,
      created_at: new Date().toISOString(),
    };
    const nextState = {
      ...state,
      maintenance: [newReq, ...state.maintenance],
    };
    setState(nextState);
    apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
    setIsMaintenanceModalOpen(false);
    announce(`Submitted maintenance request ${newReq.request_number} for Unit ${unit.unit_number}`);
  };

  const handleAdvanceMaintenance = (reqId: string, nextStatus: MaintenanceStatus) => {
    const nextState = {
      ...state,
      maintenance: state.maintenance.map((m) =>
        m.id === reqId
          ? {
              ...m,
              status: nextStatus,
              work_order_number:
                nextStatus === 'ASSIGNED' && !m.work_order_number
                  ? `WO-${m.request_number.slice(4)}`
                  : m.work_order_number,
              assigned_vendor:
                nextStatus === 'ASSIGNED' && !m.assigned_vendor
                  ? 'Nairobi Rapid Plumbers Ltd'
                  : m.assigned_vendor,
            }
          : m
      ),
    };
    setState(nextState);
    apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
    announce(`Maintenance ticket transitioned to ${nextStatus}`);
  };

  const handleExportModuleCsv = (moduleKey: ImportModuleKey) => {
    const tpl = MODULE_TEMPLATES[moduleKey];
    if (!tpl) {
      announce(`No export template available for ${moduleKey}`);
      return;
    }
    let dataRows: any[] = [];
    if (moduleKey === 'units') dataRows = orgUnits;
    else if (moduleKey === 'properties') dataRows = orgProperties;
    else if (moduleKey === 'buildings') dataRows = orgBuildings;
    else if (moduleKey === 'floors') dataRows = orgFloors;
    else if (moduleKey === 'tenants') dataRows = orgTenants;
    else if (moduleKey === 'leases') dataRows = orgLeases;
    else if (moduleKey === 'invoices') dataRows = orgInvoices;
    else if (moduleKey === 'payments') dataRows = orgPayments;
    else if (moduleKey === 'maintenance') dataRows = orgMaintenance;
    else if (moduleKey === 'vendors') dataRows = orgVendors;
    else if (moduleKey === 'expenses') dataRows = orgExpenses;
    else if (moduleKey === 'inspections') dataRows = orgInspections;
    else if (moduleKey === 'documents') dataRows = orgDocuments;

    if (dataRows.length === 0) {
      announce(`No existing records for ${tpl.title}. Exporting sample starter template.`);
      dataRows = tpl.sampleRows;
    }

    const csvContent = exportRowsToCsv(tpl.fields, dataRows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guri24_${moduleKey}_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    announce(`Exported ${dataRows.length} ${tpl.title} records to CSV`);
  };

  const handleBulkCommit = async (moduleKey: ImportModuleKey, rawRows: Record<string, any>[]) => {
    if (!rawRows || rawRows.length === 0) {
      announce('No records provided for bulk commit');
      return;
    }

    const orgId = currentOrg.id;
    const nowIso = new Date().toISOString();
    const todayYmd = nowIso.slice(0, 10);
    const timeSeq = Date.now();

    let nextState = { ...state };

    try {
      if (moduleKey === 'units') {
        const newUnits = rawRows.map((r, i) => {
          const propId = r.property_id || orgProperties[0]?.id || `prop-${timeSeq}`;
          const bldId = r.building_id || orgBuildings.find((b) => b.property_id === propId)?.id || orgBuildings[0]?.id || `bld-${timeSeq}`;
          const flrId = r.floor_id || orgFloors.find((f) => f.building_id === bldId)?.id || orgFloors[0]?.id || `flr-${timeSeq}`;
          const rent = Number(r.monthly_rent_kes) || 25000;
          return {
            id: `unit-${timeSeq}-${i}`,
            organization_id: orgId,
            property_id: propId,
            building_id: bldId,
            floor_id: flrId,
            unit_number: String(r.unit_number || `U-${i + 1}`).trim(),
            unit_type: String(r.unit_type || 'TWO_BEDROOM').toUpperCase(),
            bedrooms: Number(r.bedrooms) || 2,
            bathrooms: Number(r.bathrooms) || 1,
            monthly_rent_kes: rent,
            deposit_amount_kes: Number(r.deposit_amount_kes) || rent,
            status: (['VACANT', 'OCCUPIED', 'RESERVED', 'UNDER_MAINTENANCE', 'UNAVAILABLE'].includes(r.status) ? r.status : 'VACANT') as any,
            water_meter_number: String(r.water_meter_number || ''),
            kplc_meter_number: String(r.kplc_meter_number || ''),
          };
        });
        nextState = { ...nextState, units: [...nextState.units, ...newUnits] };
      } else if (moduleKey === 'properties') {
        const newProps = rawRows.map((r, i) => ({
          id: `prop-${timeSeq}-${i}`,
          organization_id: orgId,
          code: String(r.code || `PRP-${String(orgProperties.length + i + 1).padStart(3, '0')}`).toUpperCase(),
          name: String(r.name || `Property ${i + 1}`),
          county: String(r.county || 'Nairobi'),
          estate_or_area: String(r.estate_or_area || 'Kilimani'),
          physical_address: String(r.physical_address || r.name || 'Nairobi, Kenya'),
          lr_number: String(r.lr_number || `LR/209/${timeSeq.toString().slice(-4)}${i}`),
          management_commission_pct: Number(r.management_commission_pct) || 10,
          amenities: typeof r.amenities === 'string' ? r.amenities.split(',').map((s: string) => s.trim()) : ['Water', 'Security', 'Parking'],
        }));
        nextState = { ...nextState, properties: [...nextState.properties, ...newProps] };
      } else if (moduleKey === 'buildings') {
        const newBlds = rawRows.map((r, i) => ({
          id: `bld-${timeSeq}-${i}`,
          organization_id: orgId,
          property_id: r.property_id || orgProperties[0]?.id || `prop-${timeSeq}`,
          code: String(r.code || `BLD-${i + 1}`).toUpperCase(),
          name: String(r.name || `Building ${i + 1}`),
          total_floors: Number(r.total_floors) || 5,
        }));
        nextState = { ...nextState, buildings: [...nextState.buildings, ...newBlds] };
      } else if (moduleKey === 'floors') {
        const newFlrs = rawRows.map((r, i) => ({
          id: `flr-${timeSeq}-${i}`,
          organization_id: orgId,
          property_id: r.property_id || orgProperties[0]?.id || `prop-${timeSeq}`,
          building_id: r.building_id || orgBuildings[0]?.id || `bld-${timeSeq}`,
          floor_number: Number(r.floor_number) || (i + 1),
          label: String(r.label || `Floor ${r.floor_number || i + 1}`),
        }));
        nextState = { ...nextState, floors: [...nextState.floors, ...newFlrs] };
      } else if (moduleKey === 'tenants') {
        const newTenants = rawRows.map((r, i) => {
          const natId = String(r.national_id || '12345678');
          const maskedId = natId.length > 4 ? `****${natId.slice(-4)}` : '****5678';
          const phone = String(r.phone || '254712345678');
          return {
            id: `ten-${timeSeq}-${i}`,
            organization_id: orgId,
            tenant_code: String(r.tenant_code || `TNT-${String(orgTenants.length + i + 1).padStart(4, '0')}`),
            full_name: String(r.full_name || 'Tenant Name'),
            phone,
            email: String(r.email || `${phone.replace(/\+/g, '')}@tenant.guri24rms.co.ke`),
            national_id_masked: maskedId,
            emergency_contact_name: String(r.emergency_contact_name || 'Next of Kin'),
            emergency_contact_phone: String(r.emergency_contact_phone || phone),
            status: (['PROSPECT', 'ACTIVE', 'FORMER'].includes(r.status) ? r.status : 'ACTIVE') as any,
          };
        });
        nextState = { ...nextState, tenants: [...nextState.tenants, ...newTenants] };
      } else if (moduleKey === 'leases') {
        const newLeases = rawRows.map((r, i) => {
          const rent = Number(r.monthly_rent_kes) || 30000;
          return {
            id: `lease-${timeSeq}-${i}`,
            organization_id: orgId,
            property_id: r.property_id || orgProperties[0]?.id || '',
            building_id: r.building_id || orgBuildings[0]?.id || '',
            unit_id: r.unit_id || orgUnits[0]?.id || '',
            primary_tenant_id: r.tenant_id || orgTenants[0]?.id || '',
            lease_number: String(r.lease_number || `LS-${todayYmd.replace(/-/g, '')}-${i + 1}`),
            start_date: String(r.start_date || todayYmd),
            end_date: String(r.end_date || new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10)),
            billing_day: Number(r.billing_day) || 5,
            monthly_rent_kes: rent,
            security_deposit_kes: Number(r.security_deposit_kes) || rent,
            service_charge_kes: 0,
            garbage_fee_kes: 0,
            status: (['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'EXPIRING', 'RENEWED', 'TERMINATED'].includes(r.status) ? r.status : 'ACTIVE') as any,
            payment_account_reference: `PAY-LS-${i + 1}`,
          };
        });
        nextState = { ...nextState, leases: [...nextState.leases, ...newLeases] };
      } else if (moduleKey === 'invoices') {
        const newInvs = rawRows.map((r, i) => {
          const total = Number(r.total_amount_kes) || 25000;
          return {
            id: `inv-${timeSeq}-${i}`,
            organization_id: orgId,
            property_id: r.property_id || orgProperties[0]?.id || '',
            unit_id: r.unit_id || orgUnits[0]?.id || '',
            lease_id: r.lease_id || orgLeases[0]?.id || '',
            tenant_id: r.tenant_id || orgTenants[0]?.id || '',
            invoice_number: String(r.invoice_number || `INV-${todayYmd.replace(/-/g, '')}-${i + 1}`),
            billing_period: String(r.billing_period || todayYmd.slice(0, 7)),
            issue_date: String(r.issue_date || todayYmd),
            due_date: String(r.due_date || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)),
            rent_amount_kes: total,
            charges_amount_kes: 0,
            penalty_kes: 0,
            total_amount_kes: total,
            amount_paid_kes: 0,
            balance_kes: total,
            status: (['DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'].includes(r.status) ? r.status : 'ISSUED') as any,
            idempotency_key: `inv-key-${timeSeq}-${i}`,
          };
        });
        nextState = { ...nextState, invoices: [...nextState.invoices, ...newInvs] };
      } else if (moduleKey === 'payments') {
        const newPmts = rawRows.map((r, i) => {
          const amt = Number(r.amount_kes) || 10000;
          const rcpt = String(r.mpesa_receipt_number || `RC${timeSeq.toString().slice(-6)}${i}`).toUpperCase();
          return {
            id: `pmt-${timeSeq}-${i}`,
            organization_id: orgId,
            tenant_id: r.tenant_id || orgTenants[0]?.id || '',
            lease_id: r.lease_id || orgLeases[0]?.id,
            payment_reference: `REF-${rcpt}`,
            idempotency_key: `pmt-key-${rcpt}`,
            checkout_request_id: `ws_CO_${timeSeq}_${i}`,
            mpesa_receipt_number: rcpt,
            payer_phone: String(r.payer_phone || '254712345678'),
            amount_kes: amt,
            allocated_amount_kes: amt,
            unallocated_amount_kes: 0,
            status: 'COMPLETED' as const,
            allocations: [],
            receipt_number: `RCT-${rcpt}`,
            paid_at: nowIso,
          };
        });
        nextState = { ...nextState, payments: [...nextState.payments, ...newPmts] };
      } else if (moduleKey === 'maintenance') {
        const newMnts = rawRows.map((r, i) => ({
          id: `mnt-${timeSeq}-${i}`,
          organization_id: orgId,
          property_id: r.property_id || orgProperties[0]?.id || '',
          building_id: r.building_id || orgBuildings[0]?.id || '',
          unit_id: r.unit_id || orgUnits[0]?.id || '',
          tenant_id: r.tenant_id || orgUnits[0]?.current_tenant_id,
          request_number: String(r.request_number || `MNT-${String(orgMaintenance.length + i + 1).padStart(4, '0')}`),
          category: String(r.category || 'PLUMBING').toUpperCase(),
          priority: (['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'].includes(r.priority) ? r.priority : 'MEDIUM') as any,
          title: String(r.title || r.description?.slice(0, 40) || `Maintenance Issue ${i + 1}`),
          description: String(r.description || 'Imported maintenance request'),
          status: (['SUBMITTED', 'REVIEWED', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'CLOSED'].includes(r.status) ? r.status : 'SUBMITTED') as any,
          estimated_cost_kes: Number(r.estimated_cost_kes) || 5000,
          actual_cost_kes: 0,
          created_at: nowIso,
        }));
        nextState = { ...nextState, maintenance: [...nextState.maintenance, ...newMnts] };
      } else if (moduleKey === 'vendors') {
        const newVnds = rawRows.map((r, i) => ({
          id: `vnd-${timeSeq}-${i}`,
          organization_id: orgId,
          vendor_code: String(r.vendor_code || `VND-${String(orgVendors.length + i + 1).padStart(3, '0')}`).toUpperCase(),
          company_name: String(r.company_name || 'Vendor Enterprise'),
          contact_person: String(r.contact_person || r.company_name || 'Contact Person'),
          phone: String(r.phone || '254712345678'),
          email: String(r.email || 'vendor@example.co.ke'),
          specialty: String(r.specialty || 'General Maintenance'),
          kra_pin: String(r.kra_pin || 'P051234567Z').toUpperCase(),
          rating: Number(r.rating) || 4.8,
          status: (['ACTIVE', 'ON_HOLD'].includes(r.status) ? r.status : 'ACTIVE') as any,
        }));
        nextState = { ...nextState, vendors: [...nextState.vendors, ...newVnds] };
      } else if (moduleKey === 'expenses') {
        const newExps = rawRows.map((r, i) => ({
          id: `exp-${timeSeq}-${i}`,
          organization_id: orgId,
          property_id: r.property_id || orgProperties[0]?.id || '',
          expense_number: String(r.expense_number || `EXP-${String(orgExpenses.length + i + 1).padStart(4, '0')}`).toUpperCase(),
          category: String(r.category || 'REPAIRS').toUpperCase(),
          vendor_name: String(r.vendor_name || 'Kenyan Contractor Ltd'),
          description: String(r.description || 'Property operating expense'),
          amount_kes: Number(r.amount_kes) || 12000,
          expense_date: String(r.expense_date || todayYmd),
          journal_entry_id: `jrn-exp-${timeSeq}-${i}`,
        }));
        nextState = { ...nextState, expenses: [...nextState.expenses, ...newExps] };
      } else if (moduleKey === 'inspections') {
        const newInsps = rawRows.map((r, i) => ({
          id: `insp-${timeSeq}-${i}`,
          organization_id: orgId,
          property_id: r.property_id || orgProperties[0]?.id || '',
          building_id: r.building_id || orgBuildings[0]?.id || '',
          unit_id: r.unit_id || orgUnits[0]?.id || '',
          inspection_number: String(r.inspection_number || `INSP-${String(orgInspections.length + i + 1).padStart(4, '0')}`).toUpperCase(),
          inspection_type: (['MOVE_IN', 'MOVE_OUT', 'ROUTINE'].includes(r.inspection_type) ? r.inspection_type : 'ROUTINE') as any,
          scheduled_at: String(r.scheduled_at || nowIso),
          inspector_name: String(r.inspector_name || 'Inspector John'),
          overall_condition: (['EXCELLENT', 'GOOD', 'FAIR', 'DAMAGED'].includes(r.overall_condition) ? r.overall_condition : 'GOOD') as any,
          recommended_deposit_deduction_kes: Number(r.recommended_deposit_deduction_kes) || 0,
          notes: String(r.notes || 'Inspection completed'),
          status: (['SCHEDULED', 'COMPLETED', 'SIGNED_OFF'].includes(r.status) ? r.status : 'COMPLETED') as any,
        }));
        nextState = { ...nextState, inspections: [...nextState.inspections, ...newInsps] };
      } else if (moduleKey === 'documents') {
        const newDocs = rawRows.map((r, i) => ({
          id: `doc-${timeSeq}-${i}`,
          organization_id: orgId,
          category: (['LEASE_AGREEMENT', 'TENANT_ID', 'RECEIPT', 'INVOICE', 'PROPERTY_DEED', 'MAINTENANCE_REPORT', 'INSPECTION_REPORT'].includes(r.category) ? r.category : 'LEASE_AGREEMENT') as any,
          entity_label: String(r.entity_label || 'Direct Bulk Upload'),
          file_name: String(r.file_name || `document_${i + 1}.pdf`),
          mime_type: String(r.mime_type || 'application/pdf'),
          file_size_kb: Number(r.file_size_kb) || 250,
          s3_object_key: `s3://guri24-vault/uploads/${timeSeq}_${i}.pdf`,
          created_at: nowIso,
        }));
        nextState = { ...nextState, documents: [...nextState.documents, ...newDocs] };
      }

      setState(nextState);
      await apiClient.saveWorkspaceSnapshot(nextState);
      announce(`Successfully committed ${rawRows.length} ${MODULE_TEMPLATES[moduleKey]?.title || moduleKey} record(s) to database!`);
      setImportWizardModule(null);
      setBulkGridModule(null);
    } catch (err) {
      announce(`Error saving import records: ${(err as Error).message}`);
    }
  };

  const handleReverseJournal = (entry: JournalEntry) => {
    if (entry.status === 'REVERSED') {
      announce(`Journal ${entry.entry_number} is already reversed`);
      return;
    }
    const seq = orgJournals.length + 1;
    const reversal: JournalEntry = {
      id: `jrn-rev-${Date.now()}`,
      organization_id: currentOrg.id,
      entry_number: `JRN-${String(seq).padStart(5, '0')}`,
      entry_date: new Date().toISOString().slice(0, 10),
      source_event_type: 'REVERSAL',
      description: `Reversal of ${entry.entry_number}: Audit adjustment`,
      status: 'POSTED',
      reversal_of_entry_id: entry.id,
      total_debit_kes: entry.total_debit_kes,
      total_credit_kes: entry.total_credit_kes,
      lines: entry.lines.map((l) => ({
        ...l,
        debit_kes: l.credit_kes,
        credit_kes: l.debit_kes,
        memo: `Contra-entry reversal of ${entry.entry_number}`,
      })),
    };
    const nextState = {
      ...state,
      journals: [
        reversal,
        ...state.journals.map((j) => (j.id === entry.id ? { ...j, status: 'REVERSED' as const } : j)),
      ],
    };
    setState(nextState);
    apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
    announce(`Posted contra-entry ${reversal.entry_number} reversing ${entry.entry_number}`);
  };

  const handleOcrUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = submitOcrDocumentJob(state, ocrUploadForm);
      setState(res.nextState);
      apiClient.saveWorkspaceSnapshot(res.nextState).catch(console.error);
      setSelectedOcrJobId(res.job.id);
      setOcrCorrections({});
      setIsOcrUploadModalOpen(false);
      announce(
        `OCR job ${res.job.id} completed extraction (${Math.round(
          res.job.overall_confidence * 100
        )}% confidence) and is now in NEEDS_REVIEW awaiting human verification`
      );
    } catch (err) {
      announce((err as Error).message);
    }
  };

  const handleOcrReviewDecision = (approve: boolean) => {
    if (!selectedOcrJob) return;
    try {
      const res = reviewOcrDocumentJob(state, selectedOcrJob.id, {
        approve,
        corrections: ocrCorrections,
        notes: ocrReviewNotes,
      });
      setState(res.nextState);
      apiClient.saveWorkspaceSnapshot(res.nextState).catch(console.error);
      announce(
        approve
          ? `Human Verification Approved: OCR job ${res.job.id} marked VERIFIED and linked to authoritative RMS records`
          : `OCR job ${res.job.id} rejected during human review`
      );
    } catch (err) {
      announce((err as Error).message);
    }
  };

  const handleAssistantSend = async (
    promptText?: string,
    customAttachment?: AssistantAttachment
  ) => {
    const query = (promptText ?? assistantPromptInput).trim();
    const attachment: AssistantAttachment | undefined =
      customAttachment ??
      (assistantAttachedFile
        ? {
            name: assistantAttachedFile.name,
            size: assistantAttachedFile.sizeKb * 1024,
            type: assistantAttachedFile.mimeType,
            kind: assistantAttachedFile.kind,
          }
        : undefined);

    if (!query && !attachment) return;
    setAssistantPromptInput('');
    setAssistantAttachedFile(null);

    // If an uploaded document is attached, automatically stage it into the OCR pipeline!
    if (attachment && (attachment.kind === 'document' || !attachment.kind)) {
      try {
        const ocrRes = submitOcrDocumentJob(state, {
          fileName: attachment.name,
          mimeType: attachment.type || 'application/pdf',
          fileSizeKb: Math.max(1, Math.round((attachment.size || 1024) / 1024)),
          pageCount: 2,
          documentCategory: 'LEASE_AGREEMENT',
          linkedEntityLabel: `Assistant Upload: ${attachment.name}`,
          rawSampleText: `KENYA RESIDENTIAL LEASE AGREEMENT — Uploaded via Guri24 AI Assistant | File: ${attachment.name} | Staged for review`,
        });
        setState(ocrRes.nextState);
        setSelectedOcrJobId(ocrRes.job.id);
      } catch {
        // Continue
      }
    }

    // Attempt real backend AI Assistant (Groq openai/gpt-oss-120b)
    try {
      const apiRes = await apiClient.askAssistant(
        query || `Analyze uploaded document: ${attachment?.name}`,
        activeConversation?.id
      );
      const replyContent = apiRes?.content || apiRes?.reply;
      if (replyContent) {
        const userMsg: AssistantMessage = {
          id: `msg-${Date.now()}-user`,
          role: 'USER',
          content:
            query ||
            (attachment?.kind === 'audio'
              ? 'Voice memo inquiry'
              : `Uploaded document for analysis: ${attachment?.name}`),
          attachment,
          citations: [],
          tool_calls: [],
          created_at: new Date().toISOString(),
        };
        const assistantMsg: AssistantMessage = {
          id: `msg-${Date.now()}-ast`,
          role: 'ASSISTANT',
          content: replyContent,
          citations: apiRes.citations || [],
          tool_calls: (apiRes as any).tool_calls || [],
          created_at: new Date().toISOString(),
        };
        setState((prev) => {
          const targetConvId = activeConversation?.id ?? 'conv-0001';
          const convExists = prev.assistantConversations.some((c) => c.id === targetConvId);
          const conversations = convExists
            ? prev.assistantConversations.map((c) =>
                c.id === targetConvId
                  ? { ...c, messages: [...c.messages, userMsg, assistantMsg] }
                  : c
              )
            : [
                ...prev.assistantConversations,
                {
                  id: targetConvId,
                  organization_id: currentOrg.id,
                  title: query.slice(0, 32) || 'Document Analysis',
                  updated_at: new Date().toISOString(),
                  messages: [userMsg, assistantMsg],
                },
              ];
          const nextState = { ...prev, assistantConversations: conversations };
          apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
          return nextState;
        });
        announce(`AI Assistant responded via Groq (${apiRes.citations?.length ?? 0} citations)`);
        return;
      }
    } catch {
      // Fallback to grounded local assistant tool executor
    }

    try {
      const res = sendAssistantPrompt(
        state,
        query,
        activeConversation?.id ?? 'conv-0001',
        attachment
      );
      setState(res.nextState);
      apiClient.saveWorkspaceSnapshot(res.nextState).catch(console.error);
      if (res.reply.blocked_reason) {
        announce('AI Security Guard blocked prompt-injection or unauthorized cross-tenant query');
      } else if (res.pendingConfirmation) {
        announce(
          `AI Assistant prepared action confirmation (${res.pendingConfirmation.title}) — awaiting your approval`
        );
      } else {
        announce(`AI Assistant responded with ${res.reply.citations.length} live RMS citation(s)`);
      }
    } catch (err) {
      announce((err as Error).message);
    }
  };

  const handleResolveConfirmation = (confirmationId: string, approve: boolean) => {
    try {
      const res = resolveAssistantConfirmation(state, confirmationId, approve);
      setState(res.nextState);
      announce(
        approve
          ? `Confirmed & executed AI Assistant action: ${res.confirmation.title}`
          : `Cancelled AI Assistant action: ${res.confirmation.title}`
      );
    } catch (err) {
      announce((err as Error).message);
    }
  };

  const pageTitle = useMemo(() => {
    const found = MAIN_MENU_ITEMS.find((i) => i.id === activeNav);
    return found ? found.label : 'Dashboard';
  }, [activeNav]);

  const featuredProperty = orgProperties[0];

  // Shared 4-card KPI strip matching the DriveLux reference screenshot
  const renderTopKpiRow = () => (
    <section className="kpi-grid" aria-label="Key Portfolio Metrics">
      {/* Card 1: Total Revenue */}
      <article className="kpi-card">
        <div className="kpi-header">
          <CircleDollarSign size={15} color="#4b5563" aria-hidden="true" />
          <span>Total Revenue</span>
        </div>
        <div className="kpi-value">{formatKes(kpis.collectedKes)}</div>
        <div className="kpi-trend-row">
          <span className="trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>12.4%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={1} activeColor="#3b82f6" />
      </article>

      {/* Card 2: Active Leases (mirrors Active Rentals) */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Calendar size={15} color="#4b5563" aria-hidden="true" />
          <span>Active Leases</span>
        </div>
        <div className="kpi-value">{orgLeases.length}</div>
        <div className="kpi-trend-row">
          <span className="trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>8.7%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={3} activeColor="#3b82f6" />
      </article>

      {/* Card 3: Available Units (mirrors Available Cars) */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Home size={15} color="#4b5563" aria-hidden="true" />
          <span>Available Units</span>
        </div>
        <div className="kpi-value">{kpis.vacantUnits}</div>
        <div className="kpi-trend-row">
          <span className="trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>5.3%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={5} activeColor="#3b82f6" />
      </article>

      {/* Card 4: Units in Maintenance (mirrors Cars in Maintenance) */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Wrench size={15} color="#4b5563" aria-hidden="true" />
          <span>Units in Maintenance</span>
        </div>
        <div className="kpi-value">{kpis.openMaintenance}</div>
        <div className="kpi-trend-row">
          <span className="trend-down" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>2.1%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={7} activeColor="#3b82f6" />
      </article>
    </section>
  );

  if (!currentUserSession) {
    return (
      <AuthExperience
        onSuccess={(session) => {
          setCurrentUserSession(session);
          announce(`Welcome, ${session.fullName}! Logged in to ${session.organizationName}`);
        }}
      />
    );
  }

  return (
    <>
      <a
        href="#main-heading"
        className="skip-link visually-hidden"
        onClick={() => mainHeadingRef.current?.focus()}
      >
        Skip to main content
      </a>

      <div role="status" aria-live="polite" className="visually-hidden">
        {liveAnnouncement}
      </div>

      <div className="app-shell">
        {/* LEFT SIDEBAR — 1:1 with DriveLux Rentals reference */}
        <aside className="sidebar" aria-label="Sidebar">
          <div className="brand-header" style={{ padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
            <img
              src="/Guri24 RMS Property Logo.png"
              alt="Guri24 RMS Residential Rental Management"
              style={{
                maxHeight: '44px',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/guri24_logo_email.png';
              }}
            />
          </div>

          {/* Search Landmark */}
          <search aria-label="Search rentals, tenants and units">
            <form
              className="sidebar-search"
              onSubmit={(e) => {
                e.preventDefault();
                announce(`Filtered view by "${searchQuery}"`);
              }}
            >
              <Search size={14} color="#8e95a2" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search properties, units, or tenants"
              />
              <span className="kbd-badge" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <Command size={11} aria-hidden="true" />K
              </span>
            </form>
          </search>

          <div className="menu-section-label">
            <span>MAIN MENU</span>
            <ChevronUp size={13} aria-hidden="true" />
          </div>

          <nav aria-label="Primary">
            <ul className="nav-list">
              {MAIN_MENU_ITEMS.map((item) => {
                const isCurrent = activeNav === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="nav-btn"
                      aria-current={isCurrent ? 'page' : undefined}
                      onClick={() => setActiveNav(item.id)}
                    >
                      <span className="nav-btn-left">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>
                      {item.hasChevron && (
                        <ChevronRight size={14} color="#8e95a2" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Upgrade to Enterprise Card */}
          <div className="promo-card">
            <div className="promo-icon" aria-hidden="true">
              <Crown size={14} />
            </div>
            <div className="promo-title">Upgrade to Enterprise</div>
            <p className="promo-desc">
              Unlock automated KRA eTIMS exports, unlimited estates and priority M-Pesa Daraja settlement.
            </p>
            <button
              type="button"
              className="promo-btn"
              onClick={() => setIsOnboardModalOpen(true)}
            >
              <span>Onboard Property</span>
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>

          {/* User Profile & Multi-Tenant Switcher Footer */}
          <div className="profile-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minInlineSize: 0 }}>
              <div className="profile-avatar" aria-hidden="true">
                {currentOrg.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minInlineSize: 0 }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentOrg.name.split(' ')[0]} {currentOrg.name.split(' ')[1] ?? 'Admin'}
                </div>
                <div
                  style={{
                    fontSize: '0.71rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {state.currentRole === 'ORGANIZATION_ADMINISTRATOR'
                    ? 'Administrator'
                    : state.currentRole
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-icon-only"
              onClick={() => setIsSwitcherModalOpen(true)}
              aria-label="Switch organization or RBAC role"
              title="Switch Organization / Role"
            >
              <ChevronDown size={15} aria-hidden="true" />
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="workspace">
          {/* Top Page Header Bar */}
          <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 id="main-heading" ref={mainHeadingRef} tabIndex={-1}>
                {pageTitle}
              </h1>
              <span className="badge-pill badge-neutral">
                {currentOrg.county} • {currentOrg.currency}
              </span>
            </div>

            <div className="topbar-actions">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setImportWizardModule('units')}
                title="Unified Data Entry & Bulk Import Wizard (CSV/Excel across all modules)"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={14} aria-hidden="true" />
                <span>Bulk Import</span>
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setBulkGridModule('units')}
                title="Spreadsheet Bulk Entry & Paste from Excel"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Layers size={14} aria-hidden="true" />
                <span>Excel Entry</span>
              </button>
              <button type="button" className="btn-dark" onClick={handleExportCsv}>
                <Download size={14} aria-hidden="true" />
                <span>Export</span>
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsMpesaModalOpen(true)}
              >
                <Share2 size={14} aria-hidden="true" />
                <span>M-Pesa Pay</span>
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsOnboardModalOpen(true)}
              >
                <MoreVertical size={14} aria-hidden="true" />
                <span>More</span>
              </button>

              {/* User Session Profile & Sign Out Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingLeft: '10px',
                  borderLeft: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    fontSize: '0.74rem',
                    lineHeight: 1.25,
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {currentUserSession.fullName}
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{state.currentRole}</span>
                </div>
                <button
                  type="button"
                  className="btn-outline"
                  style={{
                    minBlockSize: '32px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#ef4444',
                    borderColor: 'rgba(239, 68, 68, 0.25)',
                  }}
                  title="Sign Out of Session"
                  onClick={handleLogout}
                >
                  <LogOut size={13} color="#ef4444" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </header>

          {toastMessage && (
            <div
              style={{
                background: '#14171f',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <span>{toastMessage}</span>
              <button
                type="button"
                style={{ color: '#9ca3af', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
                onClick={() => setToastMessage(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Top 4 KPI Cards on Every Page */}
          {renderTopKpiRow()}

          {/* =================================================================
              PAGE 1: DASHBOARD (1:1 Layout with DriveLux Reference)
             ================================================================= */}
          {activeNav === 'dashboard' && (
            <div className="dashboard-main-grid">
              {/* LEFT COLUMN */}
              <div className="stack-column">
                {/* Rental Overview Card */}
                <section className="surface-card" aria-labelledby="rental-overview-heading">
                  <div className="card-header">
                    <div className="card-title-group">
                      <BarChart3 size={17} color="#4b5563" aria-hidden="true" />
                      <h2 id="rental-overview-heading">Rental Overview</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ minBlockSize: '32px', padding: '4px 11px', fontSize: '0.76rem' }}
                        onClick={() => setIsInvoiceModalOpen(true)}
                      >
                        <Calendar size={13} aria-hidden="true" />
                        <span>Monthly</span>
                        <ChevronDown size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-only"
                        onClick={() => setActiveNav('analytics')}
                        aria-label="Open full rental analytics"
                      >
                        <MoreVertical size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '1.65rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        lineHeight: 1.15,
                      }}
                    >
                      {orgLeases.length}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBlockStart: '2px' }}>
                      Active Leases in Portfolio
                    </div>
                  </div>

                  <div className="bar-chart-stage" role="img" aria-label="Monthly lease bookings chart">
                    <div className="bar-y-axis" aria-hidden="true">
                      <span>{maxChartCount}</span>
                      <span>{Math.round(maxChartCount * 0.75)}</span>
                      <span>{Math.round(maxChartCount * 0.5)}</span>
                      <span>{Math.round(maxChartCount * 0.25)}</span>
                      <span>0</span>
                    </div>
                    <div className="bar-columns">
                      {monthlyChartData.map((item) => {
                        const isSelected = item.month === selectedMonth;
                        const hasActivity = monthlyChartData.some((d) => d.count > 0);
                        const heightPct = hasActivity
                          ? Math.max(8, Math.round((item.count / maxChartCount) * 100))
                          : 8;
                        return (
                          <div
                            key={item.month}
                            className="bar-col-wrap"
                            onClick={() => setSelectedMonth(item.month)}
                            role="button"
                            tabIndex={0}
                            aria-label={`${item.month}: ${item.count} invoices, ${formatKes(item.revenueKes)}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedMonth(item.month);
                              }
                            }}
                          >
                            {isSelected && (
                              <div className="bar-tooltip">
                                {item.count} inv • {formatKes(item.revenueKes)}
                              </div>
                            )}
                            <div
                              className={`bar-pill ${isSelected ? 'bar-pill-active' : ''}`}
                              style={{ height: `${heightPct}%` }}
                            />
                            <span
                              className={`bar-month-label ${
                                isSelected ? 'bar-month-label-active' : ''
                              }`}
                            >
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Recent Leases & Invoices Table Card (mirrors Recent Reservations) */}
                <section className="surface-card" aria-labelledby="recent-leases-heading">
                  <div className="card-header">
                    <div className="card-title-group">
                      <FileText size={17} color="#4b5563" aria-hidden="true" />
                      <h2 id="recent-leases-heading">Recent Lease Bookings & Billing</h2>
                    </div>
                    <button
                      type="button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => setActiveNav('leases')}
                    >
                      <span>View all</span>
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  </div>

                  <ResponsiveTable
                    caption="Recent residential leases and monthly rent billing"
                    headers={['Tenant', 'Residence & Unit', 'Due Date', 'Status', 'Amount']}
                  >
                    {orgInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                          No recent billing invoices or rent transactions found for this organization.
                        </td>
                      </tr>
                    ) : (
                      orgInvoices.map((inv) => {
                        const tenant = orgTenants.find((t) => t.id === inv.tenant_id);
                        const unit = orgUnits.find((u) => u.id === inv.unit_id);
                        const prop = orgProperties.find((p) => p.id === inv.property_id);
                        const tone =
                          inv.status === 'PAID'
                            ? 'success'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'warning'
                            : inv.status === 'OVERDUE'
                            ? 'danger'
                            : 'info';
                        const label =
                          inv.status === 'PAID'
                            ? 'Confirmed'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'Partial'
                            : inv.status === 'OVERDUE'
                            ? 'Pending'
                            : 'Issued';

                        return (
                          <tr key={inv.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minInlineSize: '165px' }}>
                                <div
                                  className="profile-avatar"
                                  style={{
                                    inlineSize: '32px',
                                    blockSize: '32px',
                                    fontSize: '0.74rem',
                                    background: '#e0e7ff',
                                    color: '#1d4ed8',
                                  }}
                                  aria-hidden="true"
                                >
                                  {(tenant?.full_name ?? 'TN')
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)}
                                </div>
                                <div style={{ minInlineSize: 0 }}>
                                  <div className="cell-nowrap" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                                    {tenant?.full_name ?? 'Registered Tenant'}
                                  </div>
                                  <div className="cell-nowrap" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    {tenant?.email ?? tenant?.phone ?? '—'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="cell-nowrap" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                                {prop ? `${prop.name} • ` : ''}Unit {unit?.unit_number ?? '—'}
                              </div>
                              <div className="cell-nowrap" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {unit ? formatUnitTypeLabel(unit.unit_type, unit.bedrooms) : 'Residential Unit'}
                              </div>
                            </td>
                            <td className="cell-nowrap">
                              <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                {formatNairobiDate(inv.due_date)}
                              </div>
                              <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                                09:30 AM EAT
                              </div>
                            </td>
                            <td className="cell-nowrap">
                              <StatusBadge status={label} tone={tone} />
                            </td>
                            <td className="cell-currency">
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '8px',
                                }}
                              >
                                <span>{formatKes(inv.total_amount_kes)}</span>
                                <ChevronRight size={14} color="#8e95a2" aria-hidden="true" />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </ResponsiveTable>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="stack-column">
                {/* Featured Property Card (mirrors Featured Vehicle) */}
                <section className="surface-card" aria-labelledby="featured-property-heading">
                  <div className="card-header">
                    <div className="card-title-group">
                      <Star size={17} color="#4b5563" aria-hidden="true" />
                      <h2 id="featured-property-heading">Featured Property</h2>
                    </div>
                    <button
                      type="button"
                      className="btn-icon-only"
                      onClick={() => setActiveNav('properties')}
                      aria-label="Property options"
                    >
                      <MoreVertical size={15} aria-hidden="true" />
                    </button>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.25 }}>
                      {featuredProperty ? featuredProperty.name : 'No Properties Registered'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBlockStart: '2px' }}>
                      {featuredProperty
                        ? `${featuredProperty.estate_or_area}, ${featuredProperty.county} • ${featuredProperty.code}`
                        : 'Onboard your first property or estate to start managing units'}
                    </div>
                  </div>

                  <FeaturedPropertyIllustration
                    isRepresentative={!featuredProperty}
                    propertyName={featuredProperty?.name}
                  />

                  <div className="spec-pills-row">
                    <span className="spec-pill" title={featuredProperty ? 'Bedrooms' : 'Illustrative specification'}>
                      <BedDouble size={13} color="#4b5563" aria-hidden="true" />
                      <span>{featuredProperty ? '2–3 Beds' : 'e.g. 2–3 Beds'}</span>
                    </span>
                    <span className="spec-pill" title={featuredProperty ? 'Power Backup' : 'Illustrative specification'}>
                      <Zap size={13} color="#4b5563" aria-hidden="true" />
                      <span>{featuredProperty ? 'Backup Gen' : 'e.g. Backup Gen'}</span>
                    </span>
                    <span className="spec-pill" title={featuredProperty ? 'Water Source' : 'Illustrative specification'}>
                      <Droplets size={13} color="#4b5563" aria-hidden="true" />
                      <span>{featuredProperty ? 'Borehole' : 'e.g. Borehole'}</span>
                    </span>
                    <span className="spec-pill" title={featuredProperty ? 'Security' : 'Illustrative specification'}>
                      <ShieldCheck size={13} color="#4b5563" aria-hidden="true" />
                      <span>{featuredProperty ? '24/7 CCTV' : 'e.g. 24/7 CCTV'}</span>
                    </span>
                  </div>

                  <div className="stat-kv-list">
                    <div className="stat-kv-row">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                        <Building2 size={14} color="#6b7280" aria-hidden="true" />
                        <span>Total Units</span>
                      </span>
                      <span className="stat-kv-val">{kpis.totalUnits}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                        <KeyRound size={14} color="#6b7280" aria-hidden="true" />
                        <span>Available</span>
                      </span>
                      <span className="stat-kv-val">{kpis.vacantUnits}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                        <ClipboardCheck size={14} color="#6b7280" aria-hidden="true" />
                        <span>Occupied / Leased</span>
                      </span>
                      <span className="stat-kv-val">{kpis.occupiedUnits}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                        <Wrench size={14} color="#6b7280" aria-hidden="true" />
                        <span>In Maintenance</span>
                      </span>
                      <span className="stat-kv-val" style={{ color: 'var(--accent-red)' }}>
                        {kpis.openMaintenance}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-dark"
                    style={{ inlineSize: '100%', minBlockSize: '40px' }}
                    onClick={() => setActiveNav('properties')}
                  >
                    <Building2 size={15} aria-hidden="true" />
                    <span>View Properties & Units</span>
                  </button>
                </section>

                {/* Portfolio Performance Card (mirrors Fleet Performance) */}
                <section className="surface-card" aria-labelledby="portfolio-perf-heading">
                  <div className="card-header">
                    <div className="card-title-group">
                      <Layers size={17} color="#4b5563" aria-hidden="true" />
                      <h2 id="portfolio-perf-heading">Portfolio Performance</h2>
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.76rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>This Month</span>
                      <ChevronDown size={13} aria-hidden="true" />
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {formatKes(kpis.billedKes)}
                    </span>
                    <span
                      className="trend-up"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <ArrowUpRight size={13} aria-hidden="true" />
                      <span>12.4%</span>
                      <span className="trend-muted">vs last month</span>
                    </span>
                  </div>

                  <SegmentedTickBar
                    segments={
                      unitTypePerformance.length > 0
                        ? unitTypePerformance.map((p) => ({
                            percentage: p.percentage,
                            color: p.color,
                          }))
                        : [{ percentage: 100, color: 'var(--border-subtle)' }]
                    }
                  />

                  <div className="legend-list">
                    {unitTypePerformance.length === 0 ? (
                      <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        No unit inventory to display breakdown
                      </div>
                    ) : (
                      unitTypePerformance.map((item) => (
                        <div key={item.label} className="legend-row">
                          <span className="legend-label">
                            <span className="legend-dot" style={{ background: item.color }} />
                            <span>{item.label}</span>
                          </span>
                          <strong className="cell-nowrap" style={{ fontWeight: 600 }}>
                            {formatKes(item.totalRent)}
                          </strong>
                          <span className="cell-nowrap" style={{ color: 'var(--text-muted)', textAlign: 'end' }}>
                            {item.percentage}%
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div
                    style={{
                      marginBlockStart: '14px',
                      paddingBlockStart: '12px',
                      borderBlockStart: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                      onClick={() => setActiveNav('analytics')}
                    >
                      <span>View full report</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* =================================================================
              PAGE 2: LEASES & BOOKINGS (Full-width Table + Secondary Cards)
             ================================================================= */}
          {activeNav === 'leases' && (
            <div className="stack-column">
              <section className="surface-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <KeyRound size={17} color="#4b5563" aria-hidden="true" />
                    <h2>Active Residential Leases</h2>
                  </div>
                  <ModuleActionToolbar
                    moduleKey="leases"
                    addNewLabel="New Lease"
                    onAddNew={() => setIsOnboardModalOpen(true)}
                    onOpenImport={setImportWizardModule}
                    onOpenBulkGrid={setBulkGridModule}
                    onOpenScanner={setScannerModule}
                    scannerLabel="Scan Signed Lease"
                    onExportCsv={handleExportModuleCsv}
                    onOpenHistory={() => setIsImportHistoryOpen(true)}
                  />
                </div>

                <ResponsiveTable
                  caption="Active residential lease agreements"
                  headers={['Lease #', 'Tenant', 'Unit', 'Period', 'Monthly Rent', 'Status', 'Action']}
                >
                  {orgLeases.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                        No active residential leases found. Onboard a property and activate a lease to populate records.
                      </td>
                    </tr>
                  ) : (
                    orgLeases.map((lease) => {
                      const tenant = orgTenants.find((t) => t.id === lease.primary_tenant_id);
                      const unit = orgUnits.find((u) => u.id === lease.unit_id);
                      return (
                        <tr key={lease.id}>
                          <td className="cell-code" style={{ fontWeight: 700 }}>{lease.lease_number}</td>
                          <td>
                            <div className="cell-nowrap" style={{ fontWeight: 700 }}>{tenant?.full_name ?? '—'}</div>
                            <div className="cell-mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {tenant?.phone ?? '—'}
                            </div>
                          </td>
                          <td className="cell-nowrap">
                            <span className="badge-pill badge-neutral">
                              Unit {unit?.unit_number ?? '—'}
                            </span>
                          </td>
                          <td className="cell-nowrap">
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{ fontWeight: 500 }}>{lease.start_date}</span>
                              <ArrowRight size={12} color="#8e95a2" aria-hidden="true" />
                              <span style={{ fontWeight: 500 }}>{lease.end_date}</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBlockStart: '2px' }}>
                              Due Day {lease.billing_day}
                            </div>
                          </td>
                          <td className="cell-currency" style={{ fontWeight: 700 }}>{formatKes(lease.monthly_rent_kes)}</td>
                          <td className="cell-nowrap">
                            <StatusBadge
                              status={lease.status}
                              tone={lease.status === 'ACTIVE' ? 'success' : 'warning'}
                            />
                          </td>
                          <td className="cell-nowrap">
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ minBlockSize: '30px', padding: '4px 14px', fontSize: '0.78rem', borderRadius: '8px' }}
                              onClick={() => {
                                setInvoiceForm({ leaseId: lease.id, billingPeriod: new Date().toISOString().slice(0, 7) });
                                setIsInvoiceModalOpen(true);
                              }}
                            >
                              Bill Month
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </ResponsiveTable>
              </section>

              <section className="surface-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <Calendar size={17} color="#4b5563" aria-hidden="true" />
                    <h2>Tenant Applications & Screening</h2>
                  </div>
                  <StatusBadge status={`${orgApplications.length} Recorded`} tone="info" />
                </div>
                {orgApplications.length === 0 ? (
                  <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                    No tenant screening applications pending review in this organization.
                  </div>
                ) : (
                  <div className="secondary-cards-grid">
                    {orgApplications.map((app) => {
                      const t = orgTenants.find((x) => x.id === app.tenant_id);
                      const u = orgUnits.find((x) => x.id === app.unit_id);
                      return (
                        <div
                          key={app.id}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-sidebar)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                              {t?.full_name ?? 'Applicant'} — Unit {u?.unit_number}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBlockStart: '3px' }}>
                              Move-in: {app.proposed_move_in_date} • Verified Income:{' '}
                              {formatKes(app.monthly_income_kes ?? 0)}
                            </div>
                          </div>
                          <StatusBadge status={app.status} tone="success" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* =================================================================
              PAGE 3: PROPERTIES, BUILDINGS, FLOORS & UNITS
             ================================================================= */}
          {activeNav === 'properties' && (
            <div className="stack-column">
              <section className="surface-card">
                <div className="card-header">
                  <div className="pill-tabs" role="tablist" aria-label="Property Hierarchy">
                    {(['units', 'properties', 'buildings', 'floors'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        className="pill-tab"
                        aria-selected={propertySubTab === tab}
                        onClick={() => setPropertySubTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  <ModuleActionToolbar
                    moduleKey={propertySubTab}
                    addNewLabel={
                      propertySubTab === 'units'
                        ? 'Add Unit'
                        : propertySubTab === 'properties'
                        ? 'Register Property'
                        : propertySubTab === 'buildings'
                        ? 'Add Building'
                        : 'Add Floor'
                    }
                    onAddNew={() => setIsOnboardModalOpen(true)}
                    onOpenImport={setImportWizardModule}
                    onOpenBulkGrid={setBulkGridModule}
                    onOpenScanner={propertySubTab === 'units' ? setScannerModule : undefined}
                    scannerLabel="Scan Meter / QR"
                    onExportCsv={handleExportModuleCsv}
                    onOpenHistory={() => setIsImportHistoryOpen(true)}
                  />
                </div>

                {propertySubTab === 'units' && (
                  <ResponsiveTable
                    caption="Residential rental units inventory"
                    headers={['Unit #', 'Property', 'Type', 'Meters (Water / KPLC)', 'Monthly Rent', 'Status']}
                  >
                    {orgUnits.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                          No rental units registered yet. Click &quot;Add Property / Unit&quot; to add your first unit.
                        </td>
                      </tr>
                    ) : (
                      orgUnits.map((u) => {
                        const prop = orgProperties.find((p) => p.id === u.property_id);
                        return (
                          <tr key={u.id}>
                            <td className="cell-code" style={{ fontWeight: 700 }}>{u.unit_number}</td>
                            <td className="cell-nowrap" style={{ fontWeight: 600 }}>{prop?.name ?? '—'}</td>
                            <td className="cell-nowrap" style={{ textTransform: 'uppercase', fontSize: '0.82rem' }}>
                              {formatUnitTypeLabel(u.unit_type, u.bedrooms)}
                            </td>
                            <td className="cell-nowrap" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {u.water_meter_number ? `NCWSC-${u.water_meter_number}` : '—'} ·{' '}
                              {u.kplc_meter_number ? `KPLC-${u.kplc_meter_number}` : '—'}
                            </td>
                            <td className="cell-currency" style={{ fontWeight: 700 }}>{formatKes(u.monthly_rent_kes)}</td>
                            <td className="cell-nowrap">
                              <StatusBadge
                                status={u.status === 'OCCUPIED' ? 'Occupied' : 'Vacant'}
                                tone={u.status === 'OCCUPIED' ? 'success' : 'info'}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </ResponsiveTable>
                )}

                {propertySubTab === 'properties' && (
                  <ResponsiveTable
                    caption="Properties in organization"
                    headers={['Code', 'Property Name', 'Estate & County', 'LR Number', 'Commission']}
                  >
                    {orgProperties.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                          No properties registered in this organization. Click &quot;Add Property / Unit&quot; to register your first estate.
                        </td>
                      </tr>
                    ) : (
                      orgProperties.map((p) => (
                        <tr key={p.id}>
                          <td className="cell-code">{p.code}</td>
                          <td className="cell-nowrap" style={{ fontWeight: 600 }}>{p.name}</td>
                          <td className="cell-nowrap">
                            {p.estate_or_area}, {p.county}
                          </td>
                          <td className="cell-mono">{p.lr_number}</td>
                          <td className="cell-nowrap" style={{ fontWeight: 600 }}>{p.management_commission_pct}%</td>
                        </tr>
                      ))
                    )}
                  </ResponsiveTable>
                )}

                {propertySubTab === 'buildings' && (
                  <ResponsiveTable
                    caption="Buildings in portfolio"
                    headers={['Code', 'Building Name', 'Property', 'Total Floors']}
                  >
                    {orgBuildings.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                          No buildings recorded in this organization.
                        </td>
                      </tr>
                    ) : (
                      orgBuildings.map((b) => {
                        const prop = orgProperties.find((p) => p.id === b.property_id);
                        return (
                          <tr key={b.id}>
                            <td className="cell-code">{b.code}</td>
                            <td className="cell-nowrap" style={{ fontWeight: 600 }}>{b.name}</td>
                            <td className="cell-nowrap">{prop?.name ?? '—'}</td>
                            <td className="cell-nowrap">{b.total_floors} Floors</td>
                          </tr>
                        );
                      })
                    )}
                  </ResponsiveTable>
                )}

                {propertySubTab === 'floors' && (
                  <ResponsiveTable
                    caption="Floors across buildings"
                    headers={['Floor #', 'Label', 'Building']}
                  >
                    {orgFloors.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                          No floors recorded in this organization.
                        </td>
                      </tr>
                    ) : (
                      orgFloors.map((f) => {
                        const bld = orgBuildings.find((b) => b.id === f.building_id);
                        return (
                          <tr key={f.id}>
                            <td className="cell-code">Floor {f.floor_number}</td>
                            <td className="cell-nowrap">{f.label}</td>
                            <td className="cell-nowrap">{bld?.name ?? '—'}</td>
                          </tr>
                        );
                      })
                    )}
                  </ResponsiveTable>
                )}
              </section>
            </div>
          )}

          {/* =================================================================
              PAGE 4: TENANTS (Customers Equivalent)
             ================================================================= */}
          {activeNav === 'tenants' && (
            <div className="stack-column">
              <section className="surface-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <Users size={17} color="#4b5563" aria-hidden="true" />
                    <h2>Registered Kenyan Tenants</h2>
                    <span className="badge-pill badge-neutral">DPA 2019 Masked ID</span>
                  </div>
                  <ModuleActionToolbar
                    moduleKey="tenants"
                    addNewLabel="Register Tenant"
                    onAddNew={() => setIsOnboardModalOpen(true)}
                    onOpenImport={setImportWizardModule}
                    onOpenBulkGrid={setBulkGridModule}
                    onOpenScanner={setScannerModule}
                    scannerLabel="Scan Tenant ID"
                    onExportCsv={handleExportModuleCsv}
                    onOpenHistory={() => setIsImportHistoryOpen(true)}
                  />
                </div>

                <ResponsiveTable
                  caption="Registered tenants directory"
                  headers={['Code', 'Tenant', 'Phone (M-Pesa MSISDN)', 'National ID (Masked)', 'Status']}
                >
                  {orgTenants.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                        No tenants registered yet. Register your first tenant or onboard a property.
                      </td>
                    </tr>
                  ) : (
                    orgTenants.map((t) => (
                      <tr key={t.id}>
                        <td className="cell-code">{t.tenant_code}</td>
                        <td>
                          <div className="cell-nowrap" style={{ fontWeight: 600 }}>{t.full_name}</div>
                          <div className="cell-nowrap" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {t.email}
                          </div>
                        </td>
                        <td className="cell-mono" style={{ fontWeight: 600 }}>{t.phone}</td>
                        <td className="cell-mono">{t.national_id_masked}</td>
                        <td className="cell-nowrap">
                          <StatusBadge
                            status={t.status}
                            tone={t.status === 'ACTIVE' ? 'success' : 'info'}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </ResponsiveTable>
              </section>

              <section className="surface-card">
                <div className="card-header" style={{ marginBlockEnd: '8px' }}>
                  <div className="card-title-group">
                    <ShieldCheck size={17} color="#4b5563" aria-hidden="true" />
                    <h2>Data Protection Act (2019) Compliance</h2>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Kenyan National ID numbers are salted and hashed with SHA-256 per organization
                  and displayed as <code>****5678</code> in compliance with the Kenya Data
                  Protection Act (2019).
                </p>
              </section>
            </div>
          )}

          {/* =================================================================
              PAGE 5: PAYMENTS & M-PESA DARAJA RECONCILIATION
             ================================================================= */}
          {activeNav === 'payments' && (
            <FinancialOperationsWorkspace
              currentOrg={currentOrg}
              userRole={currentUserRole}
              properties={orgProperties}
              tenants={orgTenants}
              leases={orgLeases}
              invoices={orgInvoices}
              payments={orgPayments}
              deposits={orgDeposits}
              journals={orgJournals}
              onInitiatePayment={async (cmd) => {
                const res = await apiClient.initiateMpesaPayment(cmd);
                loadWorkspaceSnapshot();
                return res;
              }}
              onAllocatePayment={async (paymentId, allocations) => {
                setState((prev) => {
                  let totalAllocated = 0;
                  const nextInvoices = prev.invoices.map((inv) => {
                    const match = allocations.find((a) => a.invoice_id === inv.id);
                    if (match) {
                      const newPaid = Math.min(inv.total_amount_kes, inv.amount_paid_kes + match.amount_kes);
                      const newBal = Math.max(0, inv.total_amount_kes - newPaid);
                      totalAllocated += match.amount_kes;
                      return {
                        ...inv,
                        amount_paid_kes: newPaid,
                        balance_kes: newBal,
                        status: newBal === 0 ? 'PAID' : 'PARTIALLY_PAID',
                      };
                    }
                    return inv;
                  });
                  const nextPayments = prev.payments.map((p) => {
                    if (p.id === paymentId) {
                      const newAlloc = p.allocated_amount_kes + totalAllocated;
                      const newUnalloc = Math.max(0, p.amount_kes - newAlloc);
                      return {
                        ...p,
                        allocated_amount_kes: newAlloc,
                        unallocated_amount_kes: newUnalloc,
                      };
                    }
                    return p;
                  });
                  const nextState = { ...prev, invoices: nextInvoices, payments: nextPayments };
                  apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
                  return nextState;
                });
              }}
              onRefundDeposit={async (leaseId, amount, reason) => {
                setState((prev) => {
                  const nextDeposits = prev.deposits.map((d) => {
                    if (d.lease_id === leaseId) {
                      const newRefunded = d.refunded_amount_kes + amount;
                      const newLiability = Math.max(0, d.current_liability_balance_kes - amount);
                      return {
                        ...d,
                        refunded_amount_kes: newRefunded,
                        current_liability_balance_kes: newLiability,
                        status: newLiability === 0 ? 'REFUNDED' : 'PARTIALLY_DEDUCTED',
                      };
                    }
                    return d;
                  });
                  const nextState = { ...prev, deposits: nextDeposits };
                  apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
                  return nextState;
                });
              }}
              onRefresh={loadWorkspaceSnapshot}
            />
          )}

          {/* =================================================================
              PAGE 6: LOCATIONS, ESTATES & SECURITY DEPOSITS
             ================================================================= */}
          {activeNav === 'locations' && (
            <div className="stack-column">
              <section className="surface-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <MapPin size={17} color="#4b5563" aria-hidden="true" />
                    <h2>Security Deposits Held</h2>
                    <span className="badge-pill badge-blue">Account 2100 Liability</span>
                  </div>
                  <ModuleActionToolbar
                    moduleKey="payments"
                    addNewLabel="Add Deposit"
                    onAddNew={() => setIsOnboardModalOpen(true)}
                    onOpenImport={() => setImportWizardModule('payments')}
                    onOpenBulkGrid={() => setBulkGridModule('payments')}
                    onExportCsv={handleExportModuleCsv}
                    onOpenHistory={() => setIsImportHistoryOpen(true)}
                  />
                </div>

                <ResponsiveTable
                  caption="Tenant security deposits liability ledger"
                  headers={['Unit', 'Tenant', 'Required Deposit', 'Received', 'Refunded / Deducted', 'Held Liability', 'Status']}
                >
                  {orgDeposits.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                        No security deposits recorded. Security deposits collected during onboarding are tracked here as Account 2100 liabilities.
                      </td>
                    </tr>
                  ) : (
                    orgDeposits.map((d) => {
                      const u = orgUnits.find((x) => x.id === d.unit_id);
                      const t = orgTenants.find((x) => x.id === d.tenant_id);
                      return (
                        <tr key={d.id}>
                          <td className="cell-code">Unit {u?.unit_number ?? '—'}</td>
                          <td className="cell-nowrap" style={{ fontWeight: 600 }}>{t?.full_name ?? '—'}</td>
                          <td className="cell-currency">{formatKes(d.required_amount_kes)}</td>
                          <td className="cell-currency">{formatKes(d.received_amount_kes)}</td>
                          <td className="cell-currency">{formatKes(d.deducted_amount_kes + d.refunded_amount_kes)}</td>
                          <td className="cell-currency">
                            {formatKes(d.current_liability_balance_kes)}
                          </td>
                          <td className="cell-nowrap">
                            <StatusBadge status={d.status} tone="info" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </ResponsiveTable>
              </section>

              <section className="surface-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <Building2 size={17} color="#4b5563" aria-hidden="true" />
                    <h2>Estates by County</h2>
                  </div>
                </div>
                {orgProperties.length === 0 ? (
                  <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                    No estates or properties registered in this organization yet.
                  </div>
                ) : (
                  <div className="secondary-cards-grid">
                    {orgProperties.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-sidebar)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                          {p.name} ({p.estate_or_area})
                        </span>
                        <span className="badge-pill badge-neutral">{p.county}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* =================================================================
              PAGE 7: MAINTENANCE, WORK ORDERS, VENDORS & INSPECTIONS
             ================================================================= */}
          {activeNav === 'maintenance' && (
            <section className="surface-card">
              <div className="card-header">
                <div className="pill-tabs" role="tablist" aria-label="Maintenance Operations">
                  {(['work_orders', 'vendors', 'inspections'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      className="pill-tab"
                      aria-selected={maintenanceSubTab === tab}
                      onClick={() => setMaintenanceSubTab(tab)}
                    >
                      {tab === 'work_orders'
                        ? 'Work Orders (8-Stage)'
                        : tab === 'vendors'
                        ? 'Approved Vendors'
                        : 'Move-In / Move-Out Inspections'}
                    </button>
                  ))}
                </div>
                <ModuleActionToolbar
                  moduleKey={
                    maintenanceSubTab === 'work_orders'
                      ? 'maintenance'
                      : maintenanceSubTab === 'vendors'
                      ? 'vendors'
                      : 'inspections'
                  }
                  addNewLabel={
                    maintenanceSubTab === 'work_orders'
                      ? 'New Ticket'
                      : maintenanceSubTab === 'vendors'
                      ? 'Add Vendor'
                      : 'Schedule Inspection'
                  }
                  onAddNew={
                    maintenanceSubTab === 'work_orders'
                      ? () => setIsMaintenanceModalOpen(true)
                      : () => setBulkGridModule(maintenanceSubTab === 'vendors' ? 'vendors' : 'inspections')
                  }
                  onOpenImport={setImportWizardModule}
                  onOpenBulkGrid={setBulkGridModule}
                  onOpenScanner={setScannerModule}
                  scannerLabel={maintenanceSubTab === 'work_orders' ? 'Capture Photo / Tag' : 'Scan Sheet'}
                  onExportCsv={handleExportModuleCsv}
                  onOpenHistory={() => setIsImportHistoryOpen(true)}
                />
              </div>

              {maintenanceSubTab === 'work_orders' && (
                <>
                  <div className="workflow-strip" aria-label="8-Stage Maintenance Lifecycle">
                    {[
                      'Submitted',
                      'Reviewed',
                      'Approved',
                      'Assigned',
                      'In Progress',
                      'Completed',
                      'Verified',
                      'Closed',
                    ].map((stage, idx, arr) => (
                      <span key={stage} className="workflow-step">
                        <span>{stage}</span>
                        {idx < arr.length - 1 && (
                          <ArrowRight size={12} color="#8e95a2" aria-hidden="true" />
                        )}
                      </span>
                    ))}
                  </div>

                  {orgMaintenance.length === 0 ? (
                    <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                      No maintenance requests submitted yet. Click &quot;Log Maintenance Issue&quot; to log a repair request.
                    </div>
                  ) : (
                    <div className="kanban-grid">
                      {orgMaintenance.map((req) => {
                        const unit = orgUnits.find((u) => u.id === req.unit_id);
                        const nextSteps = getNextMaintenanceStatuses(req.status);
                        return (
                          <article key={req.id} className="board-column">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                              <span className="cell-code" style={{ fontSize: '0.8rem' }}>
                                {req.request_number} • Unit {unit?.unit_number ?? '—'}
                              </span>
                              <StatusBadge
                                status={req.status}
                                tone={req.status === 'CLOSED' ? 'success' : 'warning'}
                              />
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{req.title}</div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              {req.description}
                            </p>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              Category: {req.category} • Est: {formatKes(req.estimated_cost_kes)}
                            </div>
                            {nextSteps.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBlockStart: '6px' }}>
                                {nextSteps.map((next) => (
                                  <button
                                    key={next}
                                    type="button"
                                    className="btn-dark"
                                    style={{ minBlockSize: '30px', padding: '4px 10px', fontSize: '0.74rem' }}
                                    onClick={() => handleAdvanceMaintenance(req.id, next)}
                                  >
                                    Advance to {next.replace(/_/g, ' ')}
                                  </button>
                                ))}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {maintenanceSubTab === 'vendors' && (
                <ResponsiveTable
                  caption="Approved Kenyan maintenance contractors and vendors"
                  headers={['Vendor Code', 'Company Name', 'Specialty', 'M-Pesa / Phone', 'KRA PIN', 'Rating', 'Status']}
                >
                  {orgVendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                        No approved maintenance contractors recorded for this organization.
                      </td>
                    </tr>
                  ) : (
                    orgVendors.map((v) => (
                      <tr key={v.id}>
                        <td className="cell-code">{v.vendor_code}</td>
                        <td className="cell-nowrap" style={{ fontWeight: 600 }}>{v.company_name}</td>
                        <td className="cell-nowrap">{v.specialty}</td>
                        <td className="cell-mono">{v.phone}</td>
                        <td className="cell-mono">{v.kra_pin}</td>
                        <td className="cell-nowrap" style={{ fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={13} color="#f59e0b" fill="#f59e0b" aria-hidden="true" />
                            <span>{v.rating}</span>
                          </span>
                        </td>
                        <td className="cell-nowrap">
                          <StatusBadge status={v.status} tone="success" />
                        </td>
                      </tr>
                    ))
                  )}
                </ResponsiveTable>
              )}

              {maintenanceSubTab === 'inspections' && (
                <ResponsiveTable
                  caption="Move-in, move-out and routine unit inspections"
                  headers={['Inspection #', 'Type', 'Unit', 'Scheduled Date/Time', 'Condition', 'Deposit Deduction', 'Status']}
                >
                  {orgInspections.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                        No unit inspections scheduled or recorded.
                      </td>
                    </tr>
                  ) : (
                    orgInspections.map((insp) => {
                      const u = orgUnits.find((x) => x.id === insp.unit_id);
                      return (
                        <tr key={insp.id}>
                          <td className="cell-code">{insp.inspection_number}</td>
                          <td className="cell-nowrap">
                            <span className="badge-pill badge-neutral">{insp.inspection_type}</span>
                          </td>
                          <td className="cell-code">Unit {u?.unit_number ?? '—'}</td>
                          <td className="cell-mono">{insp.scheduled_at.replace('T', ' ')} EAT</td>
                          <td className="cell-nowrap">{insp.overall_condition}</td>
                          <td className="cell-currency">{formatKes(insp.recommended_deposit_deduction_kes)}</td>
                          <td className="cell-nowrap">
                            <StatusBadge
                              status={insp.status}
                              tone={insp.status === 'SIGNED_OFF' ? 'success' : 'info'}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </ResponsiveTable>
              )}
            </section>
          )}

          {/* =================================================================
              PAGE 8: OCR & DOCUMENT INTELLIGENCE WORKBENCH (Module 19)
             ================================================================= */}
          {activeNav === 'ocr' && (
            <div className="stack-column">
              <section className="surface-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <FileSearch size={17} color="#4b5563" aria-hidden="true" />
                    <h2>OCR & Document Intelligence Pipeline</h2>
                    <span className="badge-pill badge-blue">Human-in-the-Loop Required</span>
                  </div>
                  <button
                    type="button"
                    className="btn-dark"
                    onClick={() => setIsOcrUploadModalOpen(true)}
                  >
                    <Upload size={15} aria-hidden="true" />
                    <span>Upload Document for OCR</span>
                  </button>
                </div>

                {/* Interactive Drag-and-Drop Document Uploader */}
                <div
                  className="ocr-interactive-dropzone"
                  style={{
                    borderColor: ocrDragActive ? '#22c55e' : 'var(--border-subtle)',
                    background: ocrDragActive ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-subtle)',
                    marginBlock: '12px 16px',
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOcrDragActive(true);
                  }}
                  onDragLeave={() => setOcrDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setOcrDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      try {
                        const isId = file.name.toLowerCase().includes('id');
                        const isInv =
                          file.name.toLowerCase().includes('inv') ||
                          file.name.toLowerCase().includes('receipt');
                        const cat = isId
                          ? 'TENANT_IDENTIFICATION'
                          : isInv
                          ? 'RECEIPT_OR_INVOICE'
                          : 'LEASE_AGREEMENT';
                        const res = submitOcrDocumentJob(state, {
                          fileName: file.name,
                          mimeType: file.type || 'application/pdf',
                          fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
                          pageCount: file.name.endsWith('.pdf') ? 3 : 1,
                          documentCategory: cat,
                          linkedEntityLabel: `Direct Upload: ${file.name}`,
                          rawSampleText: `KENYA RESIDENTIAL PROPERTY DOCUMENT — File: ${file.name} | Category: ${cat} | Processed via olmOCR`,
                        });
                        setState(res.nextState);
                        setSelectedOcrJobId(res.job.id);
                        setOcrCorrections({});
                        announce(
                          `OCR document ${file.name} uploaded and staged in NEEDS_REVIEW awaiting human verification`
                        );
                      } catch (err) {
                        announce((err as Error).message);
                      }
                    }
                  }}
                  onClick={() => ocrDirectFileInputRef.current?.click()}
                >
                  <input
                    ref={ocrDirectFileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        try {
                          const isId = file.name.toLowerCase().includes('id');
                          const isInv =
                            file.name.toLowerCase().includes('inv') ||
                            file.name.toLowerCase().includes('receipt');
                          const cat = isId
                            ? 'TENANT_IDENTIFICATION'
                            : isInv
                            ? 'RECEIPT_OR_INVOICE'
                            : 'LEASE_AGREEMENT';
                          const res = submitOcrDocumentJob(state, {
                            fileName: file.name,
                            mimeType: file.type || 'application/pdf',
                            fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
                            pageCount: file.name.endsWith('.pdf') ? 3 : 1,
                            documentCategory: cat,
                            linkedEntityLabel: `Direct Upload: ${file.name}`,
                            rawSampleText: `KENYA RESIDENTIAL PROPERTY DOCUMENT — File: ${file.name} | Category: ${cat} | Processed via olmOCR`,
                          });
                          setState(res.nextState);
                          setSelectedOcrJobId(res.job.id);
                          setOcrCorrections({});
                          announce(
                            `OCR document ${file.name} uploaded and staged in NEEDS_REVIEW awaiting human verification`
                          );
                        } catch (err) {
                          announce((err as Error).message);
                        }
                      }
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <UploadCloud size={34} color="#10b981" />
                    <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                      Drag & Drop Lease Agreement, Tenant ID, or Invoice here, or click to browse
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Supports PDF, PNG, JPEG, WEBP (up to 15 MB) • Automated olmOCR & Groq Vision extraction
                    </div>
                    <span
                      className="btn-outline"
                      style={{
                        minBlockSize: '30px',
                        padding: '4px 14px',
                        fontSize: '0.74rem',
                        marginBlockStart: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={13} aria-hidden="true" />
                      <span>Choose Document File</span>
                    </span>
                  </div>
                </div>

                <div className="workflow-strip" aria-label="OCR Pipeline Lifecycle">
                  {['UPLOADED', 'QUEUED', 'PROCESSING', 'NEEDS_REVIEW', 'VERIFIED / FAILED'].map(
                    (stage, idx, arr) => (
                      <span key={stage} className="workflow-step">
                        <span>{stage}</span>
                        {idx < arr.length - 1 && (
                          <ArrowRight size={12} color="#8e95a2" aria-hidden="true" />
                        )}
                      </span>
                    )
                  )}
                </div>

                <ResponsiveTable
                  caption="OCR document extraction jobs and verification status"
                  headers={[
                    'Job ID',
                    'Document File',
                    'Category',
                    'Pages',
                    'Confidence',
                    'Pipeline Status',
                    'Authoritative Record',
                    'Action',
                  ]}
                >
                  {orgOcrJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                        No OCR jobs processed yet. Drag &amp; drop or upload a document to begin optical extraction.
                      </td>
                    </tr>
                  ) : (
                    orgOcrJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="cell-code">{job.id}</td>
                        <td className="cell-mono">{job.file_name}</td>
                        <td className="cell-nowrap">
                          <span className="badge-pill badge-neutral">{job.document_category}</span>
                        </td>
                        <td className="cell-nowrap">{job.page_count} pg</td>
                        <td className="cell-nowrap" style={{ fontWeight: 700 }}>
                          {Math.round(job.overall_confidence * 100)}%
                        </td>
                        <td className="cell-nowrap">
                          <StatusBadge
                            status={job.status}
                            tone={
                              job.status === 'VERIFIED'
                                ? 'success'
                                : job.status === 'NEEDS_REVIEW'
                                ? 'warning'
                                : 'danger'
                            }
                          />
                        </td>
                        <td className="cell-nowrap">
                          {job.authoritative_record_applied ? (
                            <span className="badge-pill badge-green">Verified & Applied</span>
                          ) : (
                            <span className="badge-pill badge-amber">Staged (Unverified)</span>
                          )}
                        </td>
                        <td className="cell-nowrap">
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ minBlockSize: '30px', padding: '4px 10px', fontSize: '0.74rem' }}
                            onClick={() => {
                              setSelectedOcrJobId(job.id);
                              setOcrCorrections({});
                            }}
                          >
                            Inspect & Verify
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </ResponsiveTable>
              </section>

              {selectedOcrJob && (
                <section className="surface-card" aria-labelledby="ocr-review-heading">
                  <div className="card-header">
                    <div className="card-title-group">
                      <ShieldCheck size={17} color="#2563eb" aria-hidden="true" />
                      <h2 id="ocr-review-heading">
                        Human Verification Workbench — {selectedOcrJob.file_name}
                      </h2>
                    </div>
                    <StatusBadge
                      status={selectedOcrJob.status}
                      tone={selectedOcrJob.status === 'VERIFIED' ? 'success' : 'warning'}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBlockEnd: '12px',
                    }}
                  >
                    <strong>Provider Adapter:</strong> {selectedOcrJob.provider_name} •{' '}
                    <strong>Safety Policy:</strong> Extracted OCR fields never overwrite
                    authoritative RMS records until an authorized reviewer approves them below.
                  </p>

                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'var(--bg-sidebar)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: '0.76rem',
                      color: 'var(--text-secondary)',
                      marginBlockEnd: '14px',
                    }}
                  >
                    <strong>Raw Extracted Text:</strong> {selectedOcrJob.raw_extracted_text}
                  </div>

                  <div className="form-grid" style={{ marginBlockEnd: '14px' }}>
                    {selectedOcrJob.fields.map((fld) => {
                      const val = ocrCorrections[fld.field_name] ?? fld.normalized_value;
                      return (
                        <div key={fld.id} className="field-group">
                          <label htmlFor={`ocr-fld-${fld.id}`}>
                            {fld.field_label} ({Math.round(fld.confidence * 100)}% conf • Pg{' '}
                            {fld.page_number})
                          </label>
                          <input
                            id={`ocr-fld-${fld.id}`}
                            type="text"
                            className="form-control"
                            value={val}
                            disabled={selectedOcrJob.status === 'VERIFIED'}
                            onChange={(e) =>
                              setOcrCorrections({
                                ...ocrCorrections,
                                [fld.field_name]: e.target.value,
                              })
                            }
                          />
                        </div>
                      );
                    })}
                    <div className="field-group">
                      <label htmlFor="ocr-review-notes">Reviewer Audit Notes</label>
                      <input
                        id="ocr-review-notes"
                        type="text"
                        className="form-control"
                        value={ocrReviewNotes}
                        onChange={(e) => setOcrReviewNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-dark"
                      disabled={
                        selectedOcrJob.status === 'VERIFIED' ||
                        !hasPermission(state.currentRole, 'ocr.review')
                      }
                      onClick={() => handleOcrReviewDecision(true)}
                    >
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>Approve & Mark Authoritative (VERIFIED)</span>
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      disabled={
                        selectedOcrJob.status === 'VERIFIED' ||
                        !hasPermission(state.currentRole, 'ocr.review')
                      }
                      onClick={() => handleOcrReviewDecision(false)}
                    >
                      <span>Reject Extraction</span>
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* =================================================================
              PAGE 7: FULL-PAGE AI ASSISTANT INTELLIGENCE WORKSPACE
             ================================================================= */}
          {activeNav === 'assistant' && (
            <FullPageAssistant
              currentOrg={currentOrg}
              userRole={currentUserRole}
              properties={orgProperties}
              tenants={orgTenants}
              invoices={orgInvoices}
              payments={orgPayments}
              deposits={orgDeposits}
              conversations={orgConversations}
              confirmations={orgConfirmations}
              onUpdateConversations={(conversations) => {
                setState((prev) => {
                  const nextState = { ...prev, assistantConversations: conversations };
                  apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
                  return nextState;
                });
              }}
              onUpdateConfirmations={(confirmations) => {
                setState((prev) => {
                  const nextState = { ...prev, assistantConfirmations: confirmations };
                  apiClient.saveWorkspaceSnapshot(nextState).catch(console.error);
                  return nextState;
                });
              }}
              onResolveConfirmation={handleResolveConfirmation}
              onNavigateTab={(tab) => setActiveNav(tab as any)}
            />
          )}

          {/* =================================================================
              PAGE 8: COMPREHENSIVE ANALYTICS & FINANCIAL LEDGER WORKSPACE
             ================================================================= */}
          {activeNav === 'analytics' && (
            <AnalyticsLedgerWorkspace
              currentOrg={{
                id: state.currentOrganizationId || 'org-guri24-001',
                name:
                  state.organizations.find((o) => o.id === state.currentOrganizationId)?.name ||
                  'Guri24 Rental Management Ltd',
              }}
              userRole={currentUserRole}
              properties={state.properties}
              tenants={state.tenants}
              leases={state.leases}
              units={state.units}
              invoices={state.invoices}
              payments={state.payments}
              expenses={orgExpenses}
              journals={orgJournals}
              deposits={state.deposits}
              maintenance={state.maintenance}
              onRecordExpense={() => setBulkGridModule('expenses')}
              onReverseJournal={handleReverseJournal}
              onExportCsv={handleExportModuleCsv}
            />
          )}

          {/* =================================================================
              PAGE 11: CENTRALIZED AUTOMATED EMAIL NOTIFICATION SYSTEM
             ================================================================= */}
          {activeNav === 'notifications' && (
            <NotificationSettingsWorkspace
              currentOrg={{
                id: state.currentOrganizationId || 'org-guri24-001',
                name: state.organizations.find((o) => o.id === state.currentOrganizationId)?.name || 'Guri24 Rental Management Ltd',
              }}
              userRole={currentUserRole}
            />
          )}

          {/* =================================================================
              PAGE 12: SETTINGS, RBAC, INTEGRATIONS, SUBSCRIPTION & PORTAL
             ================================================================= */}
          {activeNav === 'settings' && (
            <section className="surface-card">
              <div className="card-header">
                <div className="pill-tabs" role="tablist" aria-label="Settings and Portal">
                  {(
                    [
                      'org',
                      'mpesa',
                      'notifications',
                      'rbac',
                      'integrations',
                      'subscription',
                      'portal',
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      className="pill-tab"
                      aria-selected={settingsSubTab === tab}
                      onClick={() => setSettingsSubTab(tab)}
                    >
                      {tab === 'org'
                        ? 'Organization Settings'
                        : tab === 'mpesa'
                        ? 'Safaricom M-Pesa Daraja'
                        : tab === 'notifications'
                        ? 'Email Notifications'
                        : tab === 'rbac'
                        ? 'Role Permissions (9 Roles)'
                        : tab === 'integrations'
                        ? 'Provider Integrations Status'
                        : tab === 'subscription'
                        ? 'SaaS Plan & Quotas'
                        : 'Mobile Tenant Self-Service Portal'}
                    </button>
                  ))}
                </div>
              </div>

              {settingsSubTab === 'org' && (
                <div className="stat-kv-list" style={{ maxInlineSize: '620px' }}>
                  <div className="stat-kv-row">
                    <span>Organization Name</span>
                    <span className="stat-kv-val">{currentOrg.name}</span>
                  </div>
                  <div className="stat-kv-row">
                    <span>KRA PIN</span>
                    <span className="stat-kv-val">{currentOrg.kra_pin}</span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Default Currency & Timezone</span>
                    <span className="stat-kv-val">
                      {currentOrg.currency} ({currentOrg.timezone})
                    </span>
                  </div>
                  <div className="stat-kv-row">
                    <span>M-Pesa Paybill Shortcode</span>
                    <span className="stat-kv-val">{currentOrg.mpesa_paybill_shortcode}</span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Payment Allocation Strategy</span>
                    <span className="stat-kv-val">{currentOrg.payment_allocation_strategy}</span>
                  </div>
                </div>
              )}

              {settingsSubTab === 'mpesa' && (
                <div style={{ maxInlineSize: '640px' }}>
                  <div style={{ marginBlockEnd: '18px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBlockEnd: '6px' }}>
                      Safaricom Daraja API Credentials Configuration
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Enter your organization's Safaricom Daraja API credentials to enable live automated STK Push and C2B payment callbacks for <strong>{currentOrg.name}</strong>.
                    </p>
                  </div>

                  <form onSubmit={handleConnectDaraja} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-grid">
                      <div className="field-group">
                        <label htmlFor="daraja-shortcode">Paybill / Till Shortcode</label>
                        <input
                          id="daraja-shortcode"
                          type="text"
                          required
                          className="form-control"
                          placeholder="e.g. 174379 or 4098123"
                          value={darajaForm.shortcode}
                          onChange={(e) => setDarajaForm({ ...darajaForm, shortcode: e.target.value })}
                        />
                      </div>
                      <div className="field-group">
                        <label htmlFor="daraja-env">Daraja Environment</label>
                        <select
                          id="daraja-env"
                          className="form-control"
                          value={darajaForm.environment}
                          onChange={(e) => setDarajaForm({ ...darajaForm, environment: e.target.value })}
                        >
                          <option value="sandbox">Sandbox (https://sandbox.safaricom.co.ke)</option>
                          <option value="production">Production (https://api.safaricom.co.ke)</option>
                        </select>
                      </div>
                      <div className="field-group">
                        <label htmlFor="daraja-key">Consumer Key</label>
                        <input
                          id="daraja-key"
                          type="text"
                          required
                          className="form-control"
                          placeholder="Enter Safaricom Consumer Key"
                          value={darajaForm.consumerKey}
                          onChange={(e) => setDarajaForm({ ...darajaForm, consumerKey: e.target.value })}
                        />
                      </div>
                      <div className="field-group">
                        <label htmlFor="daraja-secret">Consumer Secret</label>
                        <input
                          id="daraja-secret"
                          type="password"
                          required
                          className="form-control"
                          placeholder="Enter Safaricom Consumer Secret"
                          value={darajaForm.consumerSecret}
                          onChange={(e) => setDarajaForm({ ...darajaForm, consumerSecret: e.target.value })}
                        />
                      </div>
                      <div className="field-group" style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="daraja-passkey">Online Passkey (Lipa na M-Pesa Online)</label>
                        <input
                          id="daraja-passkey"
                          type="password"
                          className="form-control"
                          placeholder="Enter Daraja Passkey for STK push"
                          value={darajaForm.passkey}
                          onChange={(e) => setDarajaForm({ ...darajaForm, passkey: e.target.value })}
                        />
                      </div>
                      <div className="field-group" style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="daraja-callback">Callback URL (Webhook Destination)</label>
                        <input
                          id="daraja-callback"
                          type="url"
                          required
                          className="form-control"
                          value={darajaForm.callbackUrl}
                          onChange={(e) => setDarajaForm({ ...darajaForm, callbackUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockStart: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge-pill badge-neutral">Status</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: darajaForm.status === 'CONNECTED' ? '#16a34a' : 'var(--text-secondary)' }}>
                          {darajaForm.status === 'CONNECTED' ? 'Active & Connected' : 'Unconnected / Ready to Pair'}
                        </span>
                      </div>
                      <button type="submit" className="btn-dark" style={{ minBlockSize: '38px', padding: '0 20px' }}>
                        Connect & Save Daraja Credentials
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {settingsSubTab === 'notifications' && (
                <NotificationSettingsWorkspace
                  currentOrg={{
                    id: state.currentOrganizationId || 'org-guri24-001',
                    name: state.organizations.find((o) => o.id === state.currentOrganizationId)?.name || 'Guri24 Rental Management Ltd',
                  }}
                  userRole={currentUserRole}
                />
              )}

              {settingsSubTab === 'rbac' && (
                <div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBlockEnd: '12px' }}>
                    Active Role: <strong>{state.currentRole}</strong> (
                    {ROLE_PERMISSIONS[state.currentRole].length} granted permissions)
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {ROLE_PERMISSIONS[state.currentRole].map((perm) => (
                      <span key={perm} className="badge-pill badge-green">
                        <CheckCircle2 size={13} style={{ marginInlineEnd: '4px' }} />
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {settingsSubTab === 'integrations' && (
                <ResponsiveTable
                  caption="Honest external provider integration and credential status disclosure"
                  headers={[
                    'Provider',
                    'Category',
                    'Active Adapter Mode',
                    'Live Credentials',
                    'Operational Disclosure',
                  ]}
                >
                  {state.integrationsStatus.map((item) => (
                    <tr key={item.provider_key}>
                      <td className="cell-nowrap" style={{ fontWeight: 700 }}>
                        {item.display_name}
                      </td>
                      <td className="cell-nowrap">
                        <span className="badge-pill badge-neutral">{item.category}</span>
                      </td>
                      <td className="cell-code">{item.configured_mode}</td>
                      <td className="cell-nowrap">
                        <StatusBadge
                          status={item.status_label}
                          tone={item.live_credentials_configured ? 'success' : 'warning'}
                        />
                      </td>
                      <td style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', minInlineSize: '260px' }}>
                        {item.honest_disclosure}
                      </td>
                    </tr>
                  ))}
                </ResponsiveTable>
              )}

              {settingsSubTab === 'subscription' && currentSubscription && (
                <div className="stat-kv-list" style={{ maxInlineSize: '640px' }}>
                  <div className="stat-kv-row">
                    <span>Active SaaS Plan</span>
                    <span className="stat-kv-val">
                      {currentSubscription.plan_name} ({currentSubscription.plan_code})
                    </span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Monthly Subscription Fee</span>
                    <span className="stat-kv-val">
                      {formatKes(currentSubscription.monthly_price_kes)} / month
                    </span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Managed Units Usage</span>
                    <span className="stat-kv-val">
                      {orgUnits.length} / {currentSubscription.unit_limit} Units
                    </span>
                  </div>
                  <div className="stat-kv-row">
                    <span>OCR Document Pages Processed</span>
                    <span className="stat-kv-val">
                      {currentSubscription.ocr_pages_used} / {currentSubscription.ocr_pages_quota}{' '}
                      Pages
                    </span>
                  </div>
                  <div className="stat-kv-row">
                    <span>AI Assistant Grounded Queries</span>
                    <span className="stat-kv-val">
                      {currentSubscription.ai_assistant_queries_used} /{' '}
                      {currentSubscription.ai_assistant_queries_quota} Queries
                    </span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Next Billing Renewal Date</span>
                    <span className="stat-kv-val">{currentSubscription.renewal_date}</span>
                  </div>
                </div>
              )}

              {settingsSubTab === 'portal' && (
                <div
                  style={{
                    maxInlineSize: '440px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '20px',
                    background: 'var(--bg-sidebar)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBlockEnd: '14px' }}>
                    <Smartphone size={20} color="#2563eb" />
                    <div>
                      <div style={{ fontWeight: 700 }}>Kenyan Tenant Mobile Portal</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {orgUnits.length > 0 ? `Unit ${orgUnits[0].unit_number}` : 'No active unit'} • {orgTenants.length > 0 ? `${orgTenants[0].full_name} (${orgTenants[0].phone})` : 'No tenant assigned'}
                      </div>
                    </div>
                  </div>
                  <div className="stat-kv-list">
                    <div className="stat-kv-row">
                      <span>Current Rent Balance</span>
                      <span className="stat-kv-val">{formatKes(kpis.arrearsKes)}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>Paybill / Account Ref</span>
                      <span className="stat-kv-val">
                        {currentOrg.mpesa_paybill_shortcode} / RENT-{orgUnits[0]?.unit_number ?? '001'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-dark"
                    style={{ inlineSize: '100%' }}
                    onClick={() => setIsMpesaModalOpen(true)}
                  >
                    Pay Rent via M-Pesa STK Push
                  </button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* =================================================================
          MODALS (Native <dialog> via ModalDialog)
         ================================================================= */}

      {/* 1. Organization & Role Switcher Modal */}
      <ModalDialog
        open={isSwitcherModalOpen}
        onClose={() => setIsSwitcherModalOpen(false)}
        title="Switch Organization & RBAC Role"
      >
        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="org-select">Active SaaS Organization</label>
            <select
              id="org-select"
              className="form-control"
              value={state.currentOrganizationId}
              onChange={(e) => {
                const nextOrgId = e.target.value;
                setState((prev) => ({ ...prev, currentOrganizationId: nextOrgId }));
                announce('Switched active SaaS organization context');
              }}
            >
              {state.organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.county})
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="role-select">Active RBAC Role</label>
            <select
              id="role-select"
              className="form-control"
              value={state.currentRole}
              onChange={(e) => {
                const nextRole = e.target.value as SystemRole;
                setState((prev) => ({ ...prev, currentRole: nextRole }));
                announce(`Switched active role to ${nextRole}`);
              }}
            >
              {ROLES_LIST.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalDialog>

      {/* 2. End-to-End Property -> Building -> Floor -> Unit -> Tenant -> Lease Modal */}
      <ModalDialog
        open={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        title="Onboard Property, Unit, Tenant & Activate Lease"
      >
        <form onSubmit={handleOnboardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="prop-name">Property Name</label>
              <input
                id="prop-name"
                type="text"
                required
                className="form-control"
                value={onboardForm.propertyName}
                onChange={(e) => setOnboardForm({ ...onboardForm, propertyName: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor="unit-no">Unit Number</label>
              <input
                id="unit-no"
                type="text"
                required
                className="form-control"
                value={onboardForm.unitNumber}
                onChange={(e) => setOnboardForm({ ...onboardForm, unitNumber: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor="rent-kes">Monthly Rent (KES)</label>
              <input
                id="rent-kes"
                type="text"
                inputMode="numeric"
                required
                className="form-control"
                value={onboardForm.monthlyRentKes}
                onChange={(e) =>
                  setOnboardForm({ ...onboardForm, monthlyRentKes: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="tnt-name">Tenant Full Name</label>
              <input
                id="tnt-name"
                type="text"
                required
                className="form-control"
                value={onboardForm.tenantFullName}
                onChange={(e) => setOnboardForm({ ...onboardForm, tenantFullName: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor="tnt-phone">Kenyan M-Pesa Phone</label>
              <input
                id="tnt-phone"
                type="tel"
                inputMode="numeric"
                required
                className="form-control"
                value={onboardForm.tenantPhone}
                onChange={(e) => setOnboardForm({ ...onboardForm, tenantPhone: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor="tnt-id">National ID Number</label>
              <input
                id="tnt-id"
                type="text"
                inputMode="numeric"
                required
                className="form-control"
                value={onboardForm.tenantNationalId}
                onChange={(e) =>
                  setOnboardForm({ ...onboardForm, tenantNationalId: e.target.value })
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="lease-start">Lease Start Date</label>
              <input
                id="lease-start"
                type="date"
                required
                className="form-control"
                value={onboardForm.leaseStartDate}
                onChange={(e) =>
                  setOnboardForm({ ...onboardForm, leaseStartDate: e.target.value })
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="lease-end">Lease End Date</label>
              <input
                id="lease-end"
                type="date"
                required
                min={onboardForm.leaseStartDate}
                className="form-control"
                value={onboardForm.leaseEndDate}
                onChange={(e) =>
                  setOnboardForm({ ...onboardForm, leaseEndDate: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-dark"
            style={{ inlineSize: '100%', minBlockSize: '42px' }}
            disabled={!hasPermission(state.currentRole, 'properties.create')}
          >
            Create Property, Unit & Activate Lease
          </button>
        </form>
      </ModalDialog>

      {/* 3. M-Pesa Daraja Callback & FIFO Allocation Modal */}
      <ModalDialog
        open={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        title="Process M-Pesa Daraja Payment (FIFO Allocation)"
      >
        <form onSubmit={handleMpesaCallbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="mpesa-tenant">Tenant</label>
              <select
                id="mpesa-tenant"
                className="form-control"
                value={mpesaForm.tenantId}
                onChange={(e) => {
                  const selectedTenant = orgTenants.find((t) => t.id === e.target.value);
                  setMpesaForm({
                    ...mpesaForm,
                    tenantId: e.target.value,
                    payerPhone: selectedTenant?.phone ?? mpesaForm.payerPhone,
                  });
                }}
              >
                {orgTenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name} ({t.phone})
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="mpesa-phone">M-Pesa Phone Number</label>
              <input
                id="mpesa-phone"
                type="tel"
                inputMode="numeric"
                required
                className="form-control"
                value={mpesaForm.payerPhone}
                onChange={(e) => setMpesaForm({ ...mpesaForm, payerPhone: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor="mpesa-amount">Amount Paid (KES)</label>
              <input
                id="mpesa-amount"
                type="text"
                inputMode="numeric"
                required
                className="form-control"
                value={mpesaForm.amountKes}
                onChange={(e) =>
                  setMpesaForm({ ...mpesaForm, amountKes: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="mpesa-receipt">M-Pesa Receipt Number (Idempotency Key)</label>
              <input
                id="mpesa-receipt"
                type="text"
                required
                className="form-control"
                value={mpesaForm.mpesaReceiptNumber}
                onChange={(e) =>
                  setMpesaForm({ ...mpesaForm, mpesaReceiptNumber: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-dark"
            style={{ inlineSize: '100%', minBlockSize: '42px' }}
          >
            Verify Callback & Allocate Payment
          </button>
        </form>
      </ModalDialog>

      {/* 4. Idempotent Recurring Invoice Modal */}
      <ModalDialog
        open={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Monthly Rent Invoice (Idempotent)"
      >
        <form onSubmit={handleGenerateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="inv-lease">Select Active Lease</label>
              <select
                id="inv-lease"
                className="form-control"
                value={invoiceForm.leaseId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, leaseId: e.target.value })}
              >
                {orgLeases.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lease_number} • {formatKes(l.monthly_rent_kes)}/mo
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="inv-period">Billing Period (YYYY-MM)</label>
              <input
                id="inv-period"
                type="month"
                required
                className="form-control"
                value={invoiceForm.billingPeriod}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, billingPeriod: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-dark"
            style={{ inlineSize: '100%', minBlockSize: '42px' }}
          >
            Generate Invoice & Post Journal
          </button>
        </form>
      </ModalDialog>

      {/* 5. Submit Maintenance Ticket Modal (with Dependent Property -> Building -> Floor -> Unit selectors) */}
      <ModalDialog
        open={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        title="Submit Maintenance Request (Dependent Unit Hierarchy)"
      >
        <form onSubmit={handleMaintenanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="mnt-prop">1. Property</label>
              <select
                id="mnt-prop"
                className="form-control"
                value={dependentHierarchy.propertyId}
                onChange={(e) => {
                  const nextResolved = resolveDependentUnitHierarchy(state, {
                    propertyId: e.target.value,
                  });
                  setMaintenanceForm({
                    ...maintenanceForm,
                    propertyId: nextResolved.propertyId,
                    buildingId: nextResolved.buildingId,
                    floorId: nextResolved.floorId,
                    unitId: nextResolved.unitId,
                  });
                }}
              >
                {dependentHierarchy.availableProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="mnt-bld">2. Building (Scoped to Property)</label>
              <select
                id="mnt-bld"
                className="form-control"
                value={dependentHierarchy.buildingId}
                onChange={(e) => {
                  const nextResolved = resolveDependentUnitHierarchy(state, {
                    propertyId: dependentHierarchy.propertyId,
                    buildingId: e.target.value,
                  });
                  setMaintenanceForm({
                    ...maintenanceForm,
                    buildingId: nextResolved.buildingId,
                    floorId: nextResolved.floorId,
                    unitId: nextResolved.unitId,
                  });
                }}
              >
                {dependentHierarchy.availableBuildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="mnt-flr">3. Floor (Scoped to Building)</label>
              <select
                id="mnt-flr"
                className="form-control"
                value={dependentHierarchy.floorId}
                onChange={(e) => {
                  const nextResolved = resolveDependentUnitHierarchy(state, {
                    propertyId: dependentHierarchy.propertyId,
                    buildingId: dependentHierarchy.buildingId,
                    floorId: e.target.value,
                  });
                  setMaintenanceForm({
                    ...maintenanceForm,
                    floorId: nextResolved.floorId,
                    unitId: nextResolved.unitId,
                  });
                }}
              >
                {dependentHierarchy.availableFloors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="mnt-unit">4. Unit (Scoped to Floor)</label>
              <select
                id="mnt-unit"
                className="form-control"
                value={dependentHierarchy.unitId}
                onChange={(e) =>
                  setMaintenanceForm({ ...maintenanceForm, unitId: e.target.value })
                }
              >
                {dependentHierarchy.availableUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unit_number} ({u.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label htmlFor="mnt-title" style={{ margin: 0 }}>Issue Title</label>
                <VoiceInput
                  buttonLabel="Voice Dictate"
                  onTranscript={(text) =>
                    setMaintenanceForm((prev) => ({
                      ...prev,
                      title: prev.title ? `${prev.title} ${text}` : text,
                      description: prev.description ? `${prev.description} ${text}` : text,
                    }))
                  }
                />
              </div>
              <input
                id="mnt-title"
                type="text"
                required
                className="form-control"
                value={maintenanceForm.title}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, title: e.target.value })}
                placeholder="e.g. Master Bedroom Ceiling Leak"
              />
            </div>
            <div className="field-group">
              <label htmlFor="mnt-desc">Issue Description & Technical Notes</label>
              <textarea
                id="mnt-desc"
                rows={3}
                className="form-control"
                value={maintenanceForm.description}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                placeholder="Detailed description of repair requirement..."
              />
            </div>
            <div className="field-group">
              <label htmlFor="mnt-cost">Estimated Cost (KES)</label>
              <input
                id="mnt-cost"
                type="text"
                inputMode="numeric"
                required
                className="form-control"
                value={maintenanceForm.estimatedCostKes}
                onChange={(e) =>
                  setMaintenanceForm({
                    ...maintenanceForm,
                    estimatedCostKes: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="mnt-dt">Preferred Inspection Date & Time</label>
              <input
                id="mnt-dt"
                type="datetime-local"
                required
                className="form-control"
                value={maintenanceForm.preferredInspectionAt}
                onChange={(e) =>
                  setMaintenanceForm({
                    ...maintenanceForm,
                    preferredInspectionAt: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-dark"
            style={{ inlineSize: '100%', minBlockSize: '42px' }}
          >
            Submit Maintenance Request
          </button>
        </form>
      </ModalDialog>

      {/* 6. Upload Document for OCR Processing Modal */}
      <ModalDialog
        open={isOcrUploadModalOpen}
        onClose={() => setIsOcrUploadModalOpen(false)}
        title="Upload Document for OCR Extraction & Human Review"
      >
        <form onSubmit={handleOcrUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Real file dropzone in modal */}
          <div
            style={{
              border: '2px dashed var(--accent-blue)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center',
              background: 'var(--bg-subtle)',
              cursor: 'pointer',
            }}
            onClick={() => {
              const el = document.getElementById('ocr-file-picker-input');
              if (el) el.click();
            }}
          >
            <input
              id="ocr-file-picker-input"
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  const isId = f.name.toLowerCase().includes('id');
                  const isInv =
                    f.name.toLowerCase().includes('inv') ||
                    f.name.toLowerCase().includes('receipt');
                  const cat = isId
                    ? 'TENANT_IDENTIFICATION'
                    : isInv
                    ? 'RECEIPT_OR_INVOICE'
                    : 'LEASE_AGREEMENT';
                  setOcrUploadForm({
                    ...ocrUploadForm,
                    fileName: f.name,
                    mimeType: f.type || 'application/pdf',
                    fileSizeKb: Math.max(1, Math.round(f.size / 1024)),
                    documentCategory: cat as OcrDocumentCategory,
                    linkedEntityLabel: `Upload: ${f.name}`,
                  });
                }
              }}
            />
            <UploadCloud size={30} color="#2563eb" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>
              {ocrUploadForm.fileName
                ? `Selected: ${ocrUploadForm.fileName} (${ocrUploadForm.fileSizeKb} KB)`
                : 'Click to choose document file (PDF, PNG, JPEG, WEBP)'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBlockStart: '2px' }}>
              Automatically parsed via Allen AI olmOCR & Groq Vision
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="ocr-cat">Document Category</label>
              <select
                id="ocr-cat"
                className="form-control"
                value={ocrUploadForm.documentCategory}
                onChange={(e) =>
                  setOcrUploadForm({
                    ...ocrUploadForm,
                    documentCategory: e.target.value as OcrDocumentCategory,
                  })
                }
              >
                <option value="LEASE_AGREEMENT">Lease Agreement</option>
                <option value="TENANT_IDENTIFICATION">Kenyan National ID / Passport</option>
                <option value="RECEIPT_OR_INVOICE">Vendor Receipt / Tax Invoice</option>
                <option value="PROPERTY_DOCUMENT">Property Title / LR Deed</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="ocr-file">File Name</label>
              <input
                id="ocr-file"
                type="text"
                required
                className="form-control"
                value={ocrUploadForm.fileName}
                onChange={(e) =>
                  setOcrUploadForm({ ...ocrUploadForm, fileName: e.target.value })
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="ocr-mime">MIME Type</label>
              <select
                id="ocr-mime"
                className="form-control"
                value={ocrUploadForm.mimeType}
                onChange={(e) =>
                  setOcrUploadForm({ ...ocrUploadForm, mimeType: e.target.value })
                }
              >
                <option value="application/pdf">application/pdf</option>
                <option value="image/png">image/png</option>
                <option value="image/jpeg">image/jpeg</option>
                <option value="image/webp">image/webp</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="ocr-entity">Target RMS Entity Label</label>
              <input
                id="ocr-entity"
                type="text"
                required
                className="form-control"
                value={ocrUploadForm.linkedEntityLabel}
                onChange={(e) =>
                  setOcrUploadForm({ ...ocrUploadForm, linkedEntityLabel: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-dark"
            style={{ inlineSize: '100%', minBlockSize: '42px' }}
          >
            Run OCR Pipeline & Queue for Human Review
          </button>
        </form>
      </ModalDialog>

      {/* 7. Unified Bulk Import Wizard Modal */}
      {importWizardModule && (
        <ImportWizard
          module={importWizardModule}
          onClose={() => setImportWizardModule(null)}
          onImportComplete={async (result) => {
            await handleBulkCommit(importWizardModule, result.rows);
          }}
        />
      )}

      {/* 8. Spreadsheet-Style Bulk Editable Grid Modal */}
      {bulkGridModule && (
        <ModalDialog
          open={!!bulkGridModule}
          onClose={() => setBulkGridModule(null)}
          title={`Spreadsheet Bulk Entry & Excel Paste — ${MODULE_TEMPLATES[bulkGridModule]?.title || bulkGridModule}`}
        >
          <BulkEditableGrid
            moduleTitle={MODULE_TEMPLATES[bulkGridModule]?.title || bulkGridModule}
            fields={MODULE_TEMPLATES[bulkGridModule]?.fields || []}
            onCommit={(rows) => handleBulkCommit(bulkGridModule, rows)}
            onCancel={() => setBulkGridModule(null)}
          />
        </ModalDialog>
      )}

      {/* 9. Mobile Camera & Document Scanner Modal */}
      {scannerModule && (
        <ModalDialog
          open={!!scannerModule}
          onClose={() => setScannerModule(null)}
          title={`Mobile Camera & Document Acquisition — ${scannerModule.toUpperCase()}`}
        >
          <DocumentScanner
            targetModule={scannerModule}
            onScanComplete={(res) => {
              announce(`Acquired ${res.type} data (${res.fileName || 'scan'})`);
              if (res.detectedFields && Object.keys(res.detectedFields).length > 0) {
                handleBulkCommit(scannerModule, [res.detectedFields]);
              }
              setScannerModule(null);
            }}
          />
        </ModalDialog>
      )}

      {/* 10. Import History & Audit Log Modal */}
      {isImportHistoryOpen && (
        <ModalDialog
          open={isImportHistoryOpen}
          onClose={() => setIsImportHistoryOpen(false)}
          title="Import Audit History & Integrity Log"
        >
          <ImportHistory onClose={() => setIsImportHistoryOpen(false)} />
        </ModalDialog>
      )}

      {/* 11. Human Verification Workbench Modal (olmOCR & Groq Review) */}
      {ocrReviewModalJob && (
        <ModalDialog
          open={!!ocrReviewModalJob}
          onClose={() => setOcrReviewModalJob(null)}
          title="Human Verification Workbench (Safety Guard)"
        >
          <OCRReviewForm
            job={ocrReviewModalJob}
            onApprove={async (jobId, corrections, notes) => {
              try {
                const next = reviewOcrDocumentJob(state, jobId, 'APPROVED', notes, corrections);
                setState(next);
                await apiClient.saveWorkspaceSnapshot(next);
                setOcrReviewModalJob(null);
                announce(`Job ${jobId} verified and promoted to authoritative RMS records.`);
              } catch (e) {
                announce((e as Error).message);
              }
            }}
            onReject={async (jobId, notes) => {
              try {
                const next = reviewOcrDocumentJob(state, jobId, 'REJECTED', notes, {});
                setState(next);
                await apiClient.saveWorkspaceSnapshot(next);
                setOcrReviewModalJob(null);
                announce(`Job ${jobId} rejected.`);
              } catch (e) {
                announce((e as Error).message);
              }
            }}
            onCancel={() => setOcrReviewModalJob(null)}
          />
        </ModalDialog>
      )}
    </>
  );
}
