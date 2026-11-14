import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  CreditCard,
  Crown,
  Download,
  FileText,
  Home,
  KeyRound,
  Layers,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import {
  createInitialRmsState,
  executeEndToEndOnboardingChain,
  generateIdempotentInvoice,
  getNextMaintenanceStatuses,
  hasPermission,
  processVerifiedMpesaPayment,
  RmsPlatformState,
  ROLE_PERMISSIONS,
} from './lib/api';
import {
  formatKes,
  formatNairobiDate,
  maskNationalId,
  normalizeKenyanPhone,
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
  PropertyExpense,
  SystemRole,
} from './types';

export type NavSection =
  | 'dashboard'
  | 'leases'
  | 'properties'
  | 'tenants'
  | 'payments'
  | 'locations'
  | 'maintenance'
  | 'analytics'
  | 'settings';

const MAIN_MENU_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  hasChevron?: boolean;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={17} aria-hidden="true" /> },
  {
    id: 'leases',
    label: 'Leases & Bookings',
    icon: <Calendar size={17} aria-hidden="true" />,
  },
  {
    id: 'properties',
    label: 'Properties & Units',
    icon: <Building2 size={17} aria-hidden="true" />,
  },
  { id: 'tenants', label: 'Tenants', icon: <Users size={17} aria-hidden="true" /> },
  {
    id: 'payments',
    label: 'Payments & M-Pesa',
    icon: <CreditCard size={17} aria-hidden="true" />,
  },
  {
    id: 'locations',
    label: 'Estates & Deposits',
    icon: <MapPin size={17} aria-hidden="true" />,
  },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={17} aria-hidden="true" /> },
  {
    id: 'analytics',
    label: 'Analytics & Ledger',
    icon: <BarChart3 size={17} aria-hidden="true" />,
    hasChevron: true,
  },
  { id: 'settings', label: 'Settings & Portal', icon: <Settings size={17} aria-hidden="true" /> },
];

const MONTHLY_CHART_DATA = [
  { month: 'Jan', count: 84, revenueKes: 640000 },
  { month: 'Feb', count: 102, revenueKes: 720000 },
  { month: 'Mar', count: 118, revenueKes: 810000 },
  { month: 'Apr', count: 146, revenueKes: 935000 },
  { month: 'May', count: 168, revenueKes: 1090000 },
  { month: 'Jun', count: 212, revenueKes: 1284500 },
  { month: 'Jul', count: 142, revenueKes: 920000 },
  { month: 'Aug', count: 114, revenueKes: 790000 },
  { month: 'Sep', count: 164, revenueKes: 1050000 },
  { month: 'Oct', count: 186, revenueKes: 1190000 },
  { month: 'Nov', count: 148, revenueKes: 980000 },
  { month: 'Dec', count: 121, revenueKes: 845000 },
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

export function App() {
  const [state, setState] = useState<RmsPlatformState>(() => createInitialRmsState());
  const [activeNav, setActiveNav] = useState<NavSection>('dashboard');
  const [propertySubTab, setPropertySubTab] = useState<'units' | 'properties' | 'buildings' | 'floors'>('units');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'ledger' | 'expenses' | 'documents' | 'reports'>('ledger');
  const [settingsSubTab, setSettingsSubTab] = useState<'org' | 'rbac' | 'portal'>('org');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState(false);

  const mainHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const announce = (msg: string) => {
    setLiveAnnouncement(msg);
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Strict multi-tenant scoping
  const currentOrg = useMemo(
    () =>
      state.organizations.find((o) => o.id === state.currentOrganizationId) ??
      state.organizations[0],
    [state.organizations, state.currentOrganizationId]
  );

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

  // Portfolio Metrics
  const kpis = useMemo(() => {
    const totalUnits = orgUnits.length;
    const occupiedUnits = orgUnits.filter((u) => u.status === 'OCCUPIED').length;
    const vacantUnits = orgUnits.filter((u) => u.status === 'VACANT').length;
    const billedKes = orgInvoices.reduce((acc, i) => acc + i.total_amount_kes, 0);
    const collectedKes = orgPayments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((acc, p) => acc + p.allocated_amount_kes, 0);
    const arrearsKes = orgInvoices.reduce((acc, i) => acc + i.balance_kes, 0);
    const depositsLiabilityKes = orgDeposits.reduce(
      (acc, d) => acc + d.current_liability_balance_kes,
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

  // Forms State
  const [onboardForm, setOnboardForm] = useState({
    propertyName: 'Lavington Green Residences',
    propertyCode: 'LAV-03',
    county: 'Nairobi',
    estate: 'Lavington',
    address: 'James Gichuru Road',
    buildingName: 'Block C — Cedar Wing',
    buildingCode: 'BLK-C',
    floorNumber: 2,
    floorLabel: '2nd Floor',
    unitNumber: 'C-204',
    unitType: 'TWO_BEDROOM',
    bedrooms: 2,
    monthlyRentKes: 28000,
    depositKes: 28000,
    tenantFullName: 'David Njoroge Kamau',
    tenantPhone: '0722334455',
    tenantEmail: 'david.njoroge@example.co.ke',
    tenantNationalId: '34567890',
    leaseStartDate: '2026-11-01',
    leaseEndDate: '2027-10-31',
    billingDay: 5,
  });

  const [mpesaForm, setMpesaForm] = useState({
    tenantId: 'tnt-wanjiku-001',
    payerPhone: '0722111222',
    amountKes: 5000,
    mpesaReceiptNumber: 'SJK99201KL',
    checkoutRequestId: 'ws_CO_174379_5000_BAL',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    leaseId: 'lse-2026-0001',
    billingPeriod: '2026-12',
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    unitId: 'unit-a-101',
    category: 'PLUMBING',
    priority: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY',
    title: 'Solar hot water valve replacement',
    description: 'Low hot water pressure in master bathroom shower.',
    estimatedCostKes: 3200,
  });

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

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unit = orgUnits.find((u) => u.id === maintenanceForm.unitId) ?? orgUnits[0];
    if (!unit) return;
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
    setState((prev) => ({
      ...prev,
      maintenance: [newReq, ...prev.maintenance],
    }));
    setIsMaintenanceModalOpen(false);
    announce(`Submitted maintenance request ${newReq.request_number} for Unit ${unit.unit_number}`);
  };

  const handleAdvanceMaintenance = (reqId: string, nextStatus: MaintenanceStatus) => {
    setState((prev) => ({
      ...prev,
      maintenance: prev.maintenance.map((m) =>
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
    }));
    announce(`Maintenance ticket transitioned to ${nextStatus}`);
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
    setState((prev) => ({
      ...prev,
      journals: [
        reversal,
        ...prev.journals.map((j) => (j.id === entry.id ? { ...j, status: 'REVERSED' as const } : j)),
      ],
    }));
    announce(`Posted contra-entry ${reversal.entry_number} reversing ${entry.entry_number}`);
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
          <CircleDollarSign size={16} color="#4b5563" aria-hidden="true" />
          <span>Total Revenue</span>
        </div>
        <div className="kpi-value">{formatKes(kpis.collectedKes || 1284500)}</div>
        <div className="kpi-trend-row">
          <span className="trend-up">↑ 12.4%</span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={1} activeColor="#3b82f6" />
      </article>

      {/* Card 2: Active Leases (mirrors Active Rentals) */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Calendar size={16} color="#4b5563" aria-hidden="true" />
          <span>Active Leases</span>
        </div>
        <div className="kpi-value">{orgLeases.length}</div>
        <div className="kpi-trend-row">
          <span className="trend-up">↑ 8.7%</span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={3} activeColor="#3b82f6" />
      </article>

      {/* Card 3: Available Units (mirrors Available Cars) */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Home size={16} color="#4b5563" aria-hidden="true" />
          <span>Available Units</span>
        </div>
        <div className="kpi-value">{kpis.vacantUnits}</div>
        <div className="kpi-trend-row">
          <span className="trend-up">↑ 5.3%</span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={5} activeColor="#3b82f6" />
      </article>

      {/* Card 4: Units in Maintenance (mirrors Cars in Maintenance) */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Wrench size={16} color="#4b5563" aria-hidden="true" />
          <span>Units in Maintenance</span>
        </div>
        <div className="kpi-value">{kpis.openMaintenance}</div>
        <div className="kpi-trend-row">
          <span className="trend-down">↑ 2.1%</span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={7} activeColor="#3b82f6" />
      </article>
    </section>
  );

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
          <div className="brand-header">
            <div className="brand-logo-box" aria-hidden="true">
              <Building2 size={20} />
            </div>
            <div>
              <div className="brand-title">Guri24 Rentals</div>
              <div className="brand-subtitle">Residential Rental Management</div>
            </div>
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
              <Search size={15} color="#8e95a2" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search properties, units, or tenants"
              />
              <span className="kbd-badge" aria-hidden="true">
                ⌘K
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

          {/* Upgrade to Pro Card */}
          <div className="promo-card">
            <div className="promo-icon" aria-hidden="true">
              <Crown size={15} />
            </div>
            <div className="promo-title">Upgrade to Enterprise</div>
            <p className="promo-desc">
              Unlock automated KRA eTIMS exports, unlimited estates and priority M-Pesa Daraja
              settlement.
            </p>
            <button
              type="button"
              className="promo-btn"
              onClick={() => setIsOnboardModalOpen(true)}
            >
              <span>Onboard Property</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* User Profile & Multi-Tenant Switcher Footer */}
          <div className="profile-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minInlineSize: 0 }}>
              <div className="profile-avatar" aria-hidden="true">
                {currentOrg.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minInlineSize: 0 }}>
                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentOrg.name.split(' ')[0]} {currentOrg.name.split(' ')[1] ?? 'Admin'}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                  {state.currentRole.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 id="main-heading" ref={mainHeadingRef} tabIndex={-1}>
                {pageTitle}
              </h1>
              <span className="badge-pill badge-neutral">
                {currentOrg.county} • {currentOrg.currency}
              </span>
            </div>

            <div className="topbar-actions">
              <button type="button" className="btn-dark" onClick={handleExportCsv}>
                <Download size={15} aria-hidden="true" />
                <span>Export</span>
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsMpesaModalOpen(true)}
              >
                <Share2 size={15} aria-hidden="true" />
                <span>M-Pesa Pay</span>
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsOnboardModalOpen(true)}
              >
                <MoreVertical size={15} aria-hidden="true" />
                <span>More</span>
              </button>
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
                style={{ color: '#9ca3af', fontSize: '0.76rem' }}
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
                        style={{ minBlockSize: '32px', padding: '4px 11px', fontSize: '0.78rem' }}
                        onClick={() => setIsInvoiceModalOpen(true)}
                      >
                        <Calendar size={14} aria-hidden="true" />
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
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                      }}
                    >
                      1,285
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Total Lease Bookings & Renewals
                    </div>
                  </div>

                  <div className="bar-chart-stage" role="img" aria-label="Monthly lease bookings chart">
                    <div className="bar-y-axis" aria-hidden="true">
                      <span>800</span>
                      <span>600</span>
                      <span>400</span>
                      <span>200</span>
                      <span>0</span>
                    </div>
                    <div className="bar-columns">
                      {MONTHLY_CHART_DATA.map((item) => {
                        const isSelected = item.month === selectedMonth;
                        const heightPct = Math.round((item.count / 240) * 100);
                        return (
                          <div
                            key={item.month}
                            className="bar-col-wrap"
                            onClick={() => setSelectedMonth(item.month)}
                            role="button"
                            tabIndex={0}
                            aria-label={`${item.month}: ${item.count} leases`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedMonth(item.month);
                              }
                            }}
                          >
                            {isSelected && (
                              <div className="bar-tooltip">{item.count} leases</div>
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
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                      onClick={() => setActiveNav('leases')}
                    >
                      <span>View all</span>
                      <ChevronRight size={15} aria-hidden="true" />
                    </button>
                  </div>

                  <ResponsiveTable
                    caption="Recent residential leases and monthly rent billing"
                    headers={['Tenant', 'Residence & Unit', 'Due Date', 'Status', 'Amount']}
                  >
                    {orgInvoices.map((inv) => {
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                className="profile-avatar"
                                style={{
                                  inlineSize: '34px',
                                  blockSize: '34px',
                                  fontSize: '0.76rem',
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
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                                  {tenant?.full_name ?? 'Registered Tenant'}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                  {tenant?.email ?? tenant?.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                                {prop?.name.split(' ')[0]} • Unit {unit?.unit_number ?? 'A-101'}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {unit?.unit_type.replace('_', ' ') ?? '2 Bedroom'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500, fontSize: '0.82rem' }}>
                              {formatNairobiDate(inv.due_date)}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                              09:30 AM EAT
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={label} tone={tone} />
                          </td>
                          <td>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                fontWeight: 700,
                              }}
                            >
                              <span>{formatKes(inv.total_amount_kes)}</span>
                              <ChevronRight size={15} color="#8e95a2" aria-hidden="true" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                    <div style={{ fontSize: '1.08rem', fontWeight: 700 }}>
                      {featuredProperty?.name ?? 'Kilimani Jacaranda Heights'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBlockStart: '2px' }}>
                      {featuredProperty?.estate_or_area ?? 'Kilimani'}, {featuredProperty?.county ?? 'Nairobi'} • Executive Apartments
                    </div>
                  </div>

                  <FeaturedPropertyIllustration />

                  <div className="spec-pills-row">
                    <span className="spec-pill">🛏 2–3 Beds</span>
                    <span className="spec-pill">⚡ Backup Gen</span>
                    <span className="spec-pill">💧 Borehole</span>
                    <span className="spec-pill">🛡 24/7 CCTV</span>
                  </div>

                  <div className="stat-kv-list">
                    <div className="stat-kv-row">
                      <span>🏢 Total Units</span>
                      <span className="stat-kv-val">{kpis.totalUnits}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>🔑 Available</span>
                      <span className="stat-kv-val">{kpis.vacantUnits}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>📋 Occupied / Leased</span>
                      <span className="stat-kv-val">{kpis.occupiedUnits}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>🔧 In Maintenance</span>
                      <span className="stat-kv-val" style={{ color: 'var(--accent-red)' }}>
                        {kpis.openMaintenance}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-dark"
                    style={{ inlineSize: '100%', minBlockSize: '42px' }}
                    onClick={() => setActiveNav('properties')}
                  >
                    <Building2 size={16} aria-hidden="true" />
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
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      This Month ⌄
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {formatKes(kpis.billedKes || 1284500)}
                    </span>
                    <span className="trend-up" style={{ fontSize: '0.76rem' }}>
                      ↑ 12.4% <span className="trend-muted">vs last month</span>
                    </span>
                  </div>

                  <SegmentedTickBar
                    segments={[
                      { percentage: 38, color: '#2563eb' },
                      { percentage: 28, color: '#0d9488' },
                      { percentage: 20, color: '#10b981' },
                      { percentage: 9, color: '#38bdf8' },
                      { percentage: 5, color: '#f59e0b' },
                    ]}
                  />

                  <div className="legend-list">
                    <div className="legend-row">
                      <span>
                        <span className="legend-dot" style={{ background: '#2563eb' }} />
                        2 Bedroom Units
                      </span>
                      <strong style={{ fontWeight: 600 }}>KES 488,100</strong>
                      <span style={{ color: 'var(--text-muted)', textAlign: 'end' }}>38%</span>
                    </div>
                    <div className="legend-row">
                      <span>
                        <span className="legend-dot" style={{ background: '#0d9488' }} />
                        3 Bedroom Units
                      </span>
                      <strong style={{ fontWeight: 600 }}>KES 359,660</strong>
                      <span style={{ color: 'var(--text-muted)', textAlign: 'end' }}>28%</span>
                    </div>
                    <div className="legend-row">
                      <span>
                        <span className="legend-dot" style={{ background: '#10b981' }} />
                        1 Bedroom Suites
                      </span>
                      <strong style={{ fontWeight: 600 }}>KES 256,900</strong>
                      <span style={{ color: 'var(--text-muted)', textAlign: 'end' }}>20%</span>
                    </div>
                    <div className="legend-row">
                      <span>
                        <span className="legend-dot" style={{ background: '#38bdf8' }} />
                        Executive Duplex
                      </span>
                      <strong style={{ fontWeight: 600 }}>KES 115,600</strong>
                      <span style={{ color: 'var(--text-muted)', textAlign: 'end' }}>9%</span>
                    </div>
                    <div className="legend-row">
                      <span>
                        <span className="legend-dot" style={{ background: '#f59e0b' }} />
                        Studio / Bedsitter
                      </span>
                      <strong style={{ fontWeight: 600 }}>KES 64,240</strong>
                      <span style={{ color: 'var(--text-muted)', textAlign: 'end' }}>5%</span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBlockStart: '16px',
                      paddingBlockStart: '12px',
                      borderBlockStart: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                      onClick={() => setActiveNav('analytics')}
                    >
                      View full report →
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* =================================================================
              PAGE 2: LEASES & BOOKINGS (Reservations Equivalent)
             ================================================================= */}
          {activeNav === 'leases' && (
            <div className="dashboard-main-grid">
              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <KeyRound size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Active Residential Leases</h2>
                    </div>
                    <button
                      type="button"
                      className="btn-dark"
                      onClick={() => setIsOnboardModalOpen(true)}
                    >
                      <Plus size={15} aria-hidden="true" />
                      <span>New Lease</span>
                    </button>
                  </div>

                  <ResponsiveTable
                    caption="Active residential lease agreements"
                    headers={['Lease #', 'Tenant', 'Unit', 'Period', 'Monthly Rent', 'Status', 'Action']}
                  >
                    {orgLeases.map((lease) => {
                      const tenant = orgTenants.find((t) => t.id === lease.primary_tenant_id);
                      const unit = orgUnits.find((u) => u.id === lease.unit_id);
                      return (
                        <tr key={lease.id}>
                          <td style={{ fontWeight: 700 }}>{lease.lease_number}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{tenant?.full_name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {tenant?.phone}
                            </div>
                          </td>
                          <td>
                            <span className="badge-pill badge-neutral">
                              Unit {unit?.unit_number}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem' }}>
                              {lease.start_date} → {lease.end_date}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Due Day {lease.billing_day}
                            </div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{formatKes(lease.monthly_rent_kes)}</td>
                          <td>
                            <StatusBadge
                              status={lease.status}
                              tone={lease.status === 'ACTIVE' ? 'success' : 'warning'}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ minBlockSize: '30px', padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => {
                                setInvoiceForm({ leaseId: lease.id, billingPeriod: '2026-12' });
                                setIsInvoiceModalOpen(true);
                              }}
                            >
                              Bill Month
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </ResponsiveTable>
                </section>
              </div>

              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <Calendar size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Tenant Applications</h2>
                    </div>
                    <StatusBadge status={`${orgApplications.length} Pending`} tone="info" />
                  </div>
                  <div className="stat-kv-list">
                    {orgApplications.map((app) => {
                      const t = orgTenants.find((x) => x.id === app.tenant_id);
                      const u = orgUnits.find((x) => x.id === app.unit_id);
                      return (
                        <div
                          key={app.id}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-sidebar)',
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                            {t?.full_name ?? 'Applicant'} — Unit {u?.unit_number}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBlock: '4px 8px' }}>
                            Move-in: {app.proposed_move_in_date} • Verified Income:{' '}
                            {formatKes(app.monthly_income_kes ?? 120000)}
                          </div>
                          <StatusBadge status={app.status} tone="success" />
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* =================================================================
              PAGE 3: PROPERTIES, BUILDINGS, FLOORS & UNITS (Fleet Equivalent)
             ================================================================= */}
          {activeNav === 'properties' && (
            <div className="dashboard-main-grid">
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
                    <button
                      type="button"
                      className="btn-dark"
                      onClick={() => setIsOnboardModalOpen(true)}
                    >
                      <Plus size={15} aria-hidden="true" />
                      <span>Add Property / Unit</span>
                    </button>
                  </div>

                  {propertySubTab === 'units' && (
                    <ResponsiveTable
                      caption="Residential rental units inventory"
                      headers={['Unit #', 'Property', 'Type', 'Meters (Water / KPLC)', 'Monthly Rent', 'Status']}
                    >
                      {orgUnits.map((u) => {
                        const prop = orgProperties.find((p) => p.id === u.property_id);
                        return (
                          <tr key={u.id}>
                            <td style={{ fontWeight: 700 }}>{u.unit_number}</td>
                            <td>{prop?.name}</td>
                            <td>{u.unit_type.replace('_', ' ')} ({u.bedrooms}BR)</td>
                            <td style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                              {u.water_meter_number ?? 'N/A'} • {u.kplc_meter_number ?? 'N/A'}
                            </td>
                            <td style={{ fontWeight: 700 }}>{formatKes(u.monthly_rent_kes)}</td>
                            <td>
                              <StatusBadge
                                status={u.status}
                                tone={u.status === 'OCCUPIED' ? 'success' : 'info'}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </ResponsiveTable>
                  )}

                  {propertySubTab === 'properties' && (
                    <ResponsiveTable
                      caption="Properties in organization"
                      headers={['Code', 'Property Name', 'Estate & County', 'LR Number', 'Commission']}
                    >
                      {orgProperties.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 700 }}>{p.code}</td>
                          <td style={{ fontWeight: 600 }}>{p.name}</td>
                          <td>
                            {p.estate_or_area}, {p.county}
                          </td>
                          <td>{p.lr_number}</td>
                          <td>{p.management_commission_pct}%</td>
                        </tr>
                      ))}
                    </ResponsiveTable>
                  )}

                  {propertySubTab === 'buildings' && (
                    <ResponsiveTable
                      caption="Buildings in portfolio"
                      headers={['Code', 'Building Name', 'Property', 'Total Floors']}
                    >
                      {orgBuildings.map((b) => {
                        const prop = orgProperties.find((p) => p.id === b.property_id);
                        return (
                          <tr key={b.id}>
                            <td style={{ fontWeight: 700 }}>{b.code}</td>
                            <td style={{ fontWeight: 600 }}>{b.name}</td>
                            <td>{prop?.name}</td>
                            <td>{b.total_floors} Floors</td>
                          </tr>
                        );
                      })}
                    </ResponsiveTable>
                  )}

                  {propertySubTab === 'floors' && (
                    <ResponsiveTable
                      caption="Floors across buildings"
                      headers={['Floor #', 'Label', 'Building']}
                    >
                      {orgFloors.map((f) => {
                        const bld = orgBuildings.find((b) => b.id === f.building_id);
                        return (
                          <tr key={f.id}>
                            <td style={{ fontWeight: 700 }}>Floor {f.floor_number}</td>
                            <td>{f.label}</td>
                            <td>{bld?.name}</td>
                          </tr>
                        );
                      })}
                    </ResponsiveTable>
                  )}
                </section>
              </div>

              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <Star size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Featured Property</h2>
                    </div>
                  </div>
                  <FeaturedPropertyIllustration />
                  <div className="stat-kv-list">
                    <div className="stat-kv-row">
                      <span>Properties</span>
                      <span className="stat-kv-val">{orgProperties.length}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>Buildings</span>
                      <span className="stat-kv-val">{orgBuildings.length}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>Total Units</span>
                      <span className="stat-kv-val">{orgUnits.length}</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* =================================================================
              PAGE 4: TENANTS (Customers Equivalent)
             ================================================================= */}
          {activeNav === 'tenants' && (
            <div className="dashboard-main-grid">
              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <Users size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Registered Kenyan Tenants (DPA 2019 Masked IDs)</h2>
                    </div>
                    <button
                      type="button"
                      className="btn-dark"
                      onClick={() => setIsOnboardModalOpen(true)}
                    >
                      <Plus size={15} aria-hidden="true" />
                      <span>Register Tenant</span>
                    </button>
                  </div>

                  <ResponsiveTable
                    caption="Registered tenants directory"
                    headers={['Code', 'Tenant', 'Phone (M-Pesa MSISDN)', 'National ID (Masked)', 'Status']}
                  >
                    {orgTenants.map((t) => (
                      <tr key={t.id}>
                        <td style={{ fontWeight: 700 }}>{t.tenant_code}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.full_name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {t.email}
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t.phone}</td>
                        <td style={{ fontFamily: 'monospace' }}>{t.national_id_masked}</td>
                        <td>
                          <StatusBadge
                            status={t.status}
                            tone={t.status === 'ACTIVE' ? 'success' : 'info'}
                          />
                        </td>
                      </tr>
                    ))}
                  </ResponsiveTable>
                </section>
              </div>

              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <ShieldCheck size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Data Protection Compliance</h2>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Kenyan National ID numbers are salted and hashed with SHA-256 per organization
                    and displayed as <code>****5678</code> in compliance with the Kenya Data
                    Protection Act (2019).
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* =================================================================
              PAGE 5: PAYMENTS & M-PESA DARAJA RECONCILIATION
             ================================================================= */}
          {activeNav === 'payments' && (
            <div className="dashboard-main-grid">
              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <CreditCard size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Safaricom M-Pesa Payments & FIFO Allocations</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => setIsInvoiceModalOpen(true)}
                      >
                        Generate Invoice
                      </button>
                      <button
                        type="button"
                        className="btn-dark"
                        onClick={() => setIsMpesaModalOpen(true)}
                      >
                        <Plus size={15} aria-hidden="true" />
                        <span>Simulate M-Pesa Callback</span>
                      </button>
                    </div>
                  </div>

                  <ResponsiveTable
                    caption="Verified M-Pesa payments and invoice allocations"
                    headers={['Receipt #', 'M-Pesa Code', 'Payer MSISDN', 'Amount', 'Allocated Invoices', 'Status']}
                  >
                    {orgPayments.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700 }}>{p.receipt_number}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {p.mpesa_receipt_number}
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{p.payer_phone}</td>
                        <td style={{ fontWeight: 700 }}>{formatKes(p.amount_kes)}</td>
                        <td style={{ fontSize: '0.76rem' }}>
                          {p.allocations
                            .map(
                              (a) =>
                                `${a.invoice_number} (${formatKes(a.allocated_amount_kes)}, Rem: ${formatKes(a.remaining_invoice_balance_kes)})`
                            )
                            .join(' • ')}
                        </td>
                        <td>
                          <StatusBadge status="Confirmed" tone="success" />
                        </td>
                      </tr>
                    ))}
                  </ResponsiveTable>
                </section>
              </div>

              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <Wallet size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Daraja Gateway Status</h2>
                    </div>
                    <StatusBadge status="Circuit Closed" tone="success" />
                  </div>
                  <div className="stat-kv-list">
                    <div className="stat-kv-row">
                      <span>Paybill Shortcode</span>
                      <span className="stat-kv-val">{currentOrg.mpesa_paybill_shortcode}</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>Allocation Strategy</span>
                      <span className="stat-kv-val">FIFO Oldest First</span>
                    </div>
                    <div className="stat-kv-row">
                      <span>Webhook Verification</span>
                      <span className="stat-kv-val">HMAC-SHA256</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* =================================================================
              PAGE 6: LOCATIONS, ESTATES & SECURITY DEPOSITS
             ================================================================= */}
          {activeNav === 'locations' && (
            <div className="dashboard-main-grid">
              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <MapPin size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Security Deposits Held (Account 2100 Liability — Never Revenue)</h2>
                    </div>
                  </div>

                  <ResponsiveTable
                    caption="Tenant security deposits liability ledger"
                    headers={['Unit', 'Tenant', 'Required Deposit', 'Received', 'Refunded/Deducted', 'Held Liability', 'Status']}
                  >
                    {orgDeposits.map((d) => {
                      const u = orgUnits.find((x) => x.id === d.unit_id);
                      const t = orgTenants.find((x) => x.id === d.tenant_id);
                      return (
                        <tr key={d.id}>
                          <td style={{ fontWeight: 700 }}>Unit {u?.unit_number}</td>
                          <td>{t?.full_name}</td>
                          <td>{formatKes(d.required_amount_kes)}</td>
                          <td>{formatKes(d.received_amount_kes)}</td>
                          <td>{formatKes(d.deducted_amount_kes + d.refunded_amount_kes)}</td>
                          <td style={{ fontWeight: 700 }}>
                            {formatKes(d.current_liability_balance_kes)}
                          </td>
                          <td>
                            <StatusBadge status={d.status} tone="info" />
                          </td>
                        </tr>
                      );
                    })}
                  </ResponsiveTable>
                </section>
              </div>

              <div className="stack-column">
                <section className="surface-card">
                  <div className="card-header">
                    <div className="card-title-group">
                      <Building2 size={17} color="#4b5563" aria-hidden="true" />
                      <h2>Estates by County</h2>
                    </div>
                  </div>
                  <div className="stat-kv-list">
                    {orgProperties.map((p) => (
                      <div key={p.id} className="stat-kv-row">
                        <span>
                          {p.name} ({p.estate_or_area})
                        </span>
                        <span className="stat-kv-val">{p.county}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* =================================================================
              PAGE 7: MAINTENANCE & WORK ORDERS (8-Stage Workflow)
             ================================================================= */}
          {activeNav === 'maintenance' && (
            <section className="surface-card">
              <div className="card-header">
                <div className="card-title-group">
                  <Wrench size={17} color="#4b5563" aria-hidden="true" />
                  <h2>Maintenance Workflow (Submitted → Reviewed → Approved → Assigned → Completed → Closed)</h2>
                </div>
                <button
                  type="button"
                  className="btn-dark"
                  onClick={() => setIsMaintenanceModalOpen(true)}
                >
                  <Plus size={15} aria-hidden="true" />
                  <span>New Ticket</span>
                </button>
              </div>

              <div className="kanban-grid">
                {orgMaintenance.map((req) => {
                  const unit = orgUnits.find((u) => u.id === req.unit_id);
                  const nextSteps = getNextMaintenanceStatuses(req.status);
                  return (
                    <article key={req.id} className="board-column">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                          {req.request_number} • Unit {unit?.unit_number}
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
                              Advance to {next}
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* =================================================================
              PAGE 8: ANALYTICS, DOUBLE-ENTRY LEDGER, EXPENSES & DOCUMENTS
             ================================================================= */}
          {activeNav === 'analytics' && (
            <section className="surface-card">
              <div className="card-header">
                <div className="pill-tabs" role="tablist" aria-label="Accounting and Analytics">
                  {(['ledger', 'expenses', 'documents', 'reports'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      className="pill-tab"
                      aria-selected={analyticsSubTab === tab}
                      onClick={() => setAnalyticsSubTab(tab)}
                    >
                      {tab === 'ledger'
                        ? 'Double-Entry Ledger'
                        : tab === 'expenses'
                        ? 'Property Expenses'
                        : tab === 'documents'
                        ? 'Private S3 Documents'
                        : 'Executive KPI Summary'}
                    </button>
                  ))}
                </div>
              </div>

              {analyticsSubTab === 'ledger' && (
                <ResponsiveTable
                  caption="Immutable double-entry accounting journal entries"
                  headers={['Entry #', 'Date', 'Event', 'Description', 'Debits = Credits', 'Status', 'Audit Action']}
                >
                  {orgJournals.map((j) => (
                    <tr key={j.id}>
                      <td style={{ fontWeight: 700 }}>{j.entry_number}</td>
                      <td>{j.entry_date}</td>
                      <td>
                        <span className="badge-pill badge-neutral">{j.source_event_type}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{j.description}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                          {j.lines
                            .map(
                              (l) =>
                                `${l.account_code} ${l.account_name}: ${
                                  l.debit_kes > 0
                                    ? `DR ${formatKes(l.debit_kes)}`
                                    : `CR ${formatKes(l.credit_kes)}`
                                }`
                            )
                            .join(' | ')}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatKes(j.total_debit_kes)}</td>
                      <td>
                        <StatusBadge
                          status={j.status}
                          tone={j.status === 'POSTED' ? 'success' : 'warning'}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-outline"
                          style={{ minBlockSize: '30px', padding: '4px 10px', fontSize: '0.74rem' }}
                          disabled={j.status === 'REVERSED'}
                          onClick={() => handleReverseJournal(j)}
                        >
                          Reverse Entry
                        </button>
                      </td>
                    </tr>
                  ))}
                </ResponsiveTable>
              )}

              {analyticsSubTab === 'expenses' && (
                <ResponsiveTable
                  caption="Property maintenance and operating expenses"
                  headers={['Expense #', 'Category', 'Vendor', 'Description', 'Date', 'Amount']}
                >
                  {orgExpenses.map((e: PropertyExpense) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 700 }}>{e.expense_number}</td>
                      <td>{e.category}</td>
                      <td>{e.vendor_name}</td>
                      <td>{e.description}</td>
                      <td>{e.expense_date}</td>
                      <td style={{ fontWeight: 700 }}>{formatKes(e.amount_kes)}</td>
                    </tr>
                  ))}
                </ResponsiveTable>
              )}

              {analyticsSubTab === 'documents' && (
                <ResponsiveTable
                  caption="Private S3 documents with short-lived pre-signed download URLs"
                  headers={['Category', 'Linked Record', 'File Name', 'Size', 'Action']}
                >
                  {orgDocuments.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <span className="badge-pill badge-blue">{d.category}</span>
                      </td>
                      <td>{d.entity_label}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{d.file_name}</td>
                      <td>{d.file_size_kb} KB</td>
                      <td>
                        <button
                          type="button"
                          className="btn-outline"
                          style={{ minBlockSize: '30px', padding: '4px 10px', fontSize: '0.74rem' }}
                          onClick={() =>
                            announce(
                              `Generated 300s HMAC-SHA256 Signed S3 URL for ${d.file_name}`
                            )
                          }
                        >
                          Sign 5m URL
                        </button>
                      </td>
                    </tr>
                  ))}
                </ResponsiveTable>
              )}

              {analyticsSubTab === 'reports' && (
                <div className="stat-kv-list" style={{ maxInlineSize: '640px' }}>
                  <div className="stat-kv-row">
                    <span>Expected Rental Revenue (Account 4000)</span>
                    <span className="stat-kv-val">{formatKes(kpis.billedKes)}</span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Actual M-Pesa Collections (Account 1010)</span>
                    <span className="stat-kv-val">{formatKes(kpis.collectedKes)}</span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Outstanding Tenant Arrears (Account 1100)</span>
                    <span className="stat-kv-val">{formatKes(kpis.arrearsKes)}</span>
                  </div>
                  <div className="stat-kv-row">
                    <span>Security Deposits Held as Liability (Account 2100)</span>
                    <span className="stat-kv-val">{formatKes(kpis.depositsLiabilityKes)}</span>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* =================================================================
              PAGE 9: SETTINGS, RBAC & MOBILE TENANT PORTAL
             ================================================================= */}
          {activeNav === 'settings' && (
            <section className="surface-card">
              <div className="card-header">
                <div className="pill-tabs" role="tablist" aria-label="Settings and Portal">
                  {(['org', 'rbac', 'portal'] as const).map((tab) => (
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
                        : tab === 'rbac'
                        ? 'Role Permissions (9 Roles)'
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
                        Unit A-101 • Wanjiku Mwangi (254722111222)
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
                        {currentOrg.mpesa_paybill_shortcode} / RENT-A-101
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
            <label htmlFor="org-select">Active SaaS Organization (Multi-Tenant Isolation)</label>
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
            <label htmlFor="role-select">Simulated RBAC Role</label>
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
                  {r}
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
          </div>
          <button
            type="submit"
            className="btn-dark"
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
                onChange={(e) => setMpesaForm({ ...mpesaForm, tenantId: e.target.value })}
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
          <button type="submit" className="btn-dark">
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
                    {l.lease_number} ({formatKes(l.monthly_rent_kes)}/mo)
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="inv-period">Billing Period (YYYY-MM)</label>
              <input
                id="inv-period"
                type="text"
                required
                className="form-control"
                value={invoiceForm.billingPeriod}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, billingPeriod: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn-dark">
            Generate Invoice & Post Journal
          </button>
        </form>
      </ModalDialog>

      {/* 5. Submit Maintenance Ticket Modal */}
      <ModalDialog
        open={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        title="Submit Maintenance Request"
      >
        <form onSubmit={handleMaintenanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="mnt-title">Issue Title</label>
              <input
                id="mnt-title"
                type="text"
                required
                className="form-control"
                value={maintenanceForm.title}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, title: e.target.value })}
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
          </div>
          <button type="submit" className="btn-dark">
            Submit Maintenance Request
          </button>
        </form>
      </ModalDialog>
    </>
  );
}
