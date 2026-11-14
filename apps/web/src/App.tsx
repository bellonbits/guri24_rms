import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  FolderLock,
  Home,
  KeyRound,
  Layers,
  LayoutDashboard,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
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
import { ModalDialog, ResponsiveTable, StatusBadge } from './components/ui/Primitives';
import {
  DocumentItem,
  JournalEntry,
  Lease,
  MaintenanceStatus,
  PropertyExpense,
  SystemRole,
} from './types';

export type NavSection =
  | 'overview'
  | 'properties'
  | 'buildings'
  | 'units'
  | 'tenants'
  | 'applications'
  | 'leases'
  | 'billing'
  | 'payments'
  | 'accounting'
  | 'maintenance'
  | 'documents'
  | 'reports'
  | 'team'
  | 'settings'
  | 'tenant-portal';

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: '1. Overview', icon: <LayoutDashboard size={18} aria-hidden="true" /> },
  { id: 'properties', label: '2. Properties', icon: <Building2 size={18} aria-hidden="true" /> },
  { id: 'buildings', label: '3. Buildings', icon: <Layers size={18} aria-hidden="true" /> },
  { id: 'units', label: '4. Units', icon: <Home size={18} aria-hidden="true" /> },
  { id: 'tenants', label: '5. Tenants', icon: <Users size={18} aria-hidden="true" /> },
  {
    id: 'applications',
    label: '6. Applications',
    icon: <ClipboardCheck size={18} aria-hidden="true" />,
  },
  { id: 'leases', label: '7. Leases', icon: <KeyRound size={18} aria-hidden="true" /> },
  { id: 'billing', label: '8. Billing', icon: <FileText size={18} aria-hidden="true" /> },
  {
    id: 'payments',
    label: '9. Payments (M-Pesa)',
    icon: <CreditCard size={18} aria-hidden="true" />,
  },
  { id: 'accounting', label: '10. Accounting', icon: <Wallet size={18} aria-hidden="true" /> },
  { id: 'maintenance', label: '11. Maintenance', icon: <Wrench size={18} aria-hidden="true" /> },
  { id: 'documents', label: '12. Documents', icon: <FolderLock size={18} aria-hidden="true" /> },
  {
    id: 'reports',
    label: '13. Reports',
    icon: <FileSpreadsheet size={18} aria-hidden="true" />,
  },
  {
    id: 'team',
    label: '14. Team & Permissions',
    icon: <ShieldCheck size={18} aria-hidden="true" />,
  },
  { id: 'settings', label: '15. Settings', icon: <Settings size={18} aria-hidden="true" /> },
  {
    id: 'tenant-portal',
    label: 'Tenant Portal (Mobile)',
    icon: <Smartphone size={18} aria-hidden="true" />,
  },
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
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [politeAnnouncement, setPoliteAnnouncement] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Modal states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [signedUrlPreview, setSignedUrlPreview] = useState<{
    fileName: string;
    url: string;
    expiresAt: string;
  } | null>(null);

  // Wizard Form State (Organization -> Property -> Building -> Floor -> Unit -> Tenant -> Lease)
  const [wizardForm, setWizardForm] = useState({
    propertyName: 'Lavington Olive Gardens',
    propertyCode: 'LAV-03',
    county: 'Nairobi',
    estate: 'Lavington',
    address: 'Hatheru Road, Plot 18',
    buildingName: 'Block C — Olive Wing',
    buildingCode: 'BLK-C',
    floorNumber: 2,
    floorLabel: '2nd Floor',
    unitNumber: 'C-204',
    unitType: 'TWO_BEDROOM',
    bedrooms: 2,
    monthlyRentKes: 28000,
    depositKes: 28000,
    tenantFullName: 'David Kiprop Mutai',
    tenantPhone: '0724556677',
    tenantEmail: 'david.mutai@example.co.ke',
    tenantNationalId: '34567890',
    leaseStartDate: '2026-11-01',
    leaseEndDate: '2027-10-31',
    billingDay: 5,
  });
  const [wizardErrors, setWizardErrors] = useState<Record<string, string>>({});

  // Billing Form State
  const [selectedLeaseForBilling, setSelectedLeaseForBilling] = useState('lse-2026-0001');
  const [billingPeriodInput, setBillingPeriodInput] = useState('2026-12');

  // M-Pesa Payment Form State
  const [mpesaForm, setMpesaForm] = useState({
    tenantId: 'tnt-wanjiku-001',
    payerPhone: '0722111222',
    amountKes: 5000,
    mpesaReceiptNumber: 'SJK5000KEN',
    checkoutRequestId: 'ws_CO_174379_5000_01',
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    propertyId: 'prop-kil-jacaranda',
    category: 'MAINTENANCE',
    vendorName: 'Kenya Power & Lighting Contractors',
    description: 'Security floodlight & meter surge protector installation',
    amountKes: 3500,
    expenseDate: '2026-11-14',
  });

  // Maintenance Form State
  const [maintenanceForm, setMaintenanceForm] = useState({
    unitId: 'unit-a-101',
    category: 'PLUMBING',
    priority: 'HIGH' as const,
    title: 'Solar hot water valve replacement',
    description: 'Pressure relief valve dripping in Unit A-101 utility area.',
    estimatedCostKes: 2200,
  });

  // Update document title on section change (Modern Web Guidance `accessibility` SPA title rule)
  useEffect(() => {
    const activeItem = NAV_ITEMS.find((i) => i.id === activeSection);
    document.title = `${activeItem ? activeItem.label.replace(/^\d+\.\s*/, '') : 'Overview'} | Guri24 Residential RMS Kenya`;
  }, [activeSection]);

  const currentOrg = useMemo(
    () =>
      state.organizations.find((o) => o.id === state.currentOrganizationId) ??
      state.organizations[0],
    [state.organizations, state.currentOrganizationId]
  );

  // Strict Multi-Tenant Scoped Slices (Organization A never sees Organization B's records)
  const orgProperties = useMemo(
    () => state.properties.filter((p) => p.organization_id === state.currentOrganizationId),
    [state.properties, state.currentOrganizationId]
  );
  const orgBuildings = useMemo(
    () => state.buildings.filter((b) => b.organization_id === state.currentOrganizationId),
    [state.buildings, state.currentOrganizationId]
  );
  const orgFloors = useMemo(
    () => state.floors.filter((f) => f.organization_id === state.currentOrganizationId),
    [state.floors, state.currentOrganizationId]
  );
  const orgUnits = useMemo(
    () => state.units.filter((u) => u.organization_id === state.currentOrganizationId),
    [state.units, state.currentOrganizationId]
  );
  const orgTenants = useMemo(
    () => state.tenants.filter((t) => t.organization_id === state.currentOrganizationId),
    [state.tenants, state.currentOrganizationId]
  );
  const orgApplications = useMemo(
    () => state.applications.filter((a) => a.organization_id === state.currentOrganizationId),
    [state.applications, state.currentOrganizationId]
  );
  const orgLeases = useMemo(
    () => state.leases.filter((l) => l.organization_id === state.currentOrganizationId),
    [state.leases, state.currentOrganizationId]
  );
  const orgInvoices = useMemo(
    () => state.invoices.filter((i) => i.organization_id === state.currentOrganizationId),
    [state.invoices, state.currentOrganizationId]
  );
  const orgPayments = useMemo(
    () => state.payments.filter((p) => p.organization_id === state.currentOrganizationId),
    [state.payments, state.currentOrganizationId]
  );
  const orgDeposits = useMemo(
    () => state.deposits.filter((d) => d.organization_id === state.currentOrganizationId),
    [state.deposits, state.currentOrganizationId]
  );
  const orgJournals = useMemo(
    () => state.journals.filter((j) => j.organization_id === state.currentOrganizationId),
    [state.journals, state.currentOrganizationId]
  );
  const orgExpenses = useMemo(
    () => state.expenses.filter((e) => e.organization_id === state.currentOrganizationId),
    [state.expenses, state.currentOrganizationId]
  );
  const orgMaintenance = useMemo(
    () => state.maintenance.filter((m) => m.organization_id === state.currentOrganizationId),
    [state.maintenance, state.currentOrganizationId]
  );
  const orgDocuments = useMemo(
    () => state.documents.filter((d) => d.organization_id === state.currentOrganizationId),
    [state.documents, state.currentOrganizationId]
  );

  // Reconciled Portfolio KPIs
  const kpis = useMemo(() => {
    const totalUnits = orgUnits.length;
    const occupiedUnits = orgUnits.filter((u) => u.status === 'OCCUPIED').length;
    const vacantUnits = orgUnits.filter((u) => u.status === 'VACANT').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 1000) / 10 : 0;

    const activeInvoices = orgInvoices.filter((i) => i.status !== 'CANCELLED');
    const expectedRevenue = activeInvoices.reduce((acc, i) => acc + i.total_amount_kes, 0);
    const actualCollections = orgPayments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((acc, p) => acc + p.allocated_amount_kes, 0);
    const collectionRate =
      expectedRevenue > 0 ? Math.round((actualCollections / expectedRevenue) * 1000) / 10 : 0;
    const totalArrears = activeInvoices.reduce((acc, i) => acc + i.balance_kes, 0);
    const totalExpenses = orgExpenses.reduce((acc, e) => acc + e.amount_kes, 0);
    const depositsLiability = orgDeposits.reduce(
      (acc, d) => acc + d.current_liability_balance_kes,
      0
    );
    const netOperatingIncome = actualCollections - totalExpenses;

    return {
      totalProperties: orgProperties.length,
      totalBuildings: orgBuildings.length,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate,
      expectedRevenue,
      actualCollections,
      collectionRate,
      totalArrears,
      totalExpenses,
      depositsLiability,
      netOperatingIncome,
    };
  }, [
    orgProperties,
    orgBuildings,
    orgUnits,
    orgInvoices,
    orgPayments,
    orgExpenses,
    orgDeposits,
  ]);

  const notify = (msg: string) => {
    setErrorBanner(null);
    setPoliteAnnouncement(msg);
  };

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    setSearchQuery('');
    setStatusFilter('ALL');
    setErrorBanner(null);
    requestAnimationFrame(() => {
      mainHeadingRef.current?.focus();
    });
  };

  // Validate on blur & submit, clear on input (Modern Web Guidance `forms` timing matrix)
  const validateWizardField = (name: string, value: string | number) => {
    if (name === 'tenantPhone') {
      const norm = normalizeKenyanPhone(String(value));
      setWizardErrors((prev) => ({
        ...prev,
        tenantPhone: norm
          ? ''
          : 'Enter a valid Kenyan phone number (e.g., 0722111222 or 254722111222).',
      }));
    }
    if (name === 'monthlyRentKes') {
      setWizardErrors((prev) => ({
        ...prev,
        monthlyRentKes:
          Number(value) > 0 ? '' : 'Monthly rent must be greater than KES 0.',
      }));
    }
  };

  const handleRunOnboardingChain = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const next = executeEndToEndOnboardingChain(state, wizardForm);
      setState(next);
      setWizardOpen(false);
      notify(
        `Created Property ${wizardForm.propertyName}, Building ${wizardForm.buildingCode}, Floor ${wizardForm.floorLabel}, Unit ${wizardForm.unitNumber}, Tenant ${wizardForm.tenantFullName}, and Active Lease!`
      );
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const handleGenerateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { nextState, invoice, created } = generateIdempotentInvoice(
        state,
        selectedLeaseForBilling,
        billingPeriodInput
      );
      setState(nextState);
      if (created) {
        notify(
          `Generated Invoice ${invoice.invoice_number} for period ${invoice.billing_period} (${formatKes(invoice.total_amount_kes)}) and posted double-entry receivable/revenue journal.`
        );
      } else {
        notify(
          `Idempotency Guard Triggered: Invoice ${invoice.invoice_number} already exists for period ${invoice.billing_period}. No duplicate invoice was created.`
        );
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const handleProcessMpesaCallback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!hasPermission(state.currentRole, 'payments.view')) {
        throw new Error('Current role is not authorized to process payments.');
      }
      const { nextState, payment, duplicateIgnored } = processVerifiedMpesaPayment(
        state,
        mpesaForm
      );
      setState(nextState);
      setMpesaModalOpen(false);
      if (duplicateIgnored) {
        notify(
          `Duplicate Callback Protection: M-Pesa receipt ${payment.mpesa_receipt_number} was already processed under ${payment.payment_reference}. Ignored safely.`
        );
      } else {
        notify(
          `Verified M-Pesa Daraja payment ${payment.mpesa_receipt_number} (${formatKes(payment.amount_kes)}). Allocated ${formatKes(payment.allocated_amount_kes)} across ${payment.allocations.length} invoice(s).`
        );
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const handleReverseJournal = (entry: JournalEntry) => {
    try {
      if (!hasPermission(state.currentRole, 'payments.reconcile')) {
        throw new Error(
          `Role '${state.currentRole}' lacks 'payments.reconcile' permission to reverse posted journal entries.`
        );
      }
      if (entry.status === 'REVERSED') {
        throw new Error('This journal entry has already been reversed.');
      }
      const jrnSeq = orgJournals.length + 1;
      const reversal: JournalEntry = {
        id: `jrn-rev-${Date.now()}`,
        organization_id: state.currentOrganizationId,
        entry_number: `JRN-${String(jrnSeq).padStart(5, '0')}`,
        entry_date: new Date().toISOString().slice(0, 10),
        source_event_type: 'REVERSAL',
        description: `Reversing entry for ${entry.entry_number}: Audit adjustment`,
        status: 'POSTED',
        total_debit_kes: entry.total_debit_kes,
        total_credit_kes: entry.total_credit_kes,
        lines: entry.lines.map((l) => ({
          ...l,
          debit_kes: l.credit_kes,
          credit_kes: l.debit_kes,
          memo: `Reversal of ${entry.entry_number}`,
        })),
      };
      setState((prev) => ({
        ...prev,
        journals: [
          reversal,
          ...prev.journals.map((j) =>
            j.id === entry.id ? { ...j, status: 'REVERSED' as const } : j
          ),
        ],
      }));
      notify(
        `Immutable Ledger Rule: Original entry ${entry.entry_number} marked REVERSED and offsetting entry ${reversal.entry_number} posted.`
      );
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRecordExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!hasPermission(state.currentRole, 'expenses.approve')) {
        throw new Error(
          `Role '${state.currentRole}' lacks 'expenses.approve' permission.`
        );
      }
      const orgId = state.currentOrganizationId;
      const expSeq = orgExpenses.length + 1;
      const jrnSeq = orgJournals.length + 1;
      const jrnId = `jrn-exp-${Date.now()}`;

      const journal: JournalEntry = {
        id: jrnId,
        organization_id: orgId,
        entry_number: `JRN-${String(jrnSeq).padStart(5, '0')}`,
        entry_date: expenseForm.expenseDate,
        source_event_type: 'EXPENSE_APPROVED',
        description: `Operating Expense (${expenseForm.category}): ${expenseForm.description}`,
        status: 'POSTED',
        total_debit_kes: expenseForm.amountKes,
        total_credit_kes: expenseForm.amountKes,
        lines: [
          {
            account_code: '5000',
            account_name: 'Property Maintenance & Repairs Expense',
            account_type: 'EXPENSE',
            debit_kes: expenseForm.amountKes,
            credit_kes: 0,
            memo: expenseForm.description,
          },
          {
            account_code: '1010',
            account_name: 'M-Pesa & Bank Clearing Account',
            account_type: 'ASSET',
            debit_kes: 0,
            credit_kes: expenseForm.amountKes,
            memo: `Paid to ${expenseForm.vendorName}`,
          },
        ],
      };

      const expense: PropertyExpense = {
        id: `exp-${Date.now()}`,
        organization_id: orgId,
        property_id: expenseForm.propertyId,
        expense_number: `EXP-${String(expSeq).padStart(4, '0')}`,
        category: expenseForm.category,
        vendor_name: expenseForm.vendorName,
        description: expenseForm.description,
        amount_kes: expenseForm.amountKes,
        expense_date: expenseForm.expenseDate,
        journal_entry_id: jrnId,
      };

      setState((prev) => ({
        ...prev,
        expenses: [expense, ...prev.expenses],
        journals: [journal, ...prev.journals],
      }));
      notify(
        `Recorded Expense ${expense.expense_number} (${formatKes(expense.amount_kes)}) with balanced double-entry journal ${journal.entry_number}.`
      );
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTransitionMaintenance = (
    requestId: string,
    nextStatus: MaintenanceStatus
  ) => {
    try {
      if (!hasPermission(state.currentRole, 'maintenance.assign')) {
        throw new Error(
          `Role '${state.currentRole}' lacks 'maintenance.assign' permission.`
        );
      }
      setState((prev) => ({
        ...prev,
        maintenance: prev.maintenance.map((m) =>
          m.id === requestId
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
                actual_cost_kes:
                  nextStatus === 'COMPLETED' && m.actual_cost_kes === 0
                    ? m.estimated_cost_kes
                    : m.actual_cost_kes,
              }
            : m
        ),
      }));
      notify(`Maintenance request transitioned to ${nextStatus}.`);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const handleSubmitMaintenance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const unit = orgUnits.find((u) => u.id === maintenanceForm.unitId) ?? orgUnits[0];
    if (!unit) return;
    const seq = orgMaintenance.length + 1;
    const newReq = {
      id: `mnt-${Date.now()}`,
      organization_id: state.currentOrganizationId,
      property_id: unit.property_id,
      building_id: unit.building_id,
      unit_id: unit.id,
      tenant_id: unit.current_tenant_id,
      request_number: `MNT-${String(seq).padStart(4, '0')}`,
      category: maintenanceForm.category,
      priority: maintenanceForm.priority,
      title: maintenanceForm.title,
      description: maintenanceForm.description,
      status: 'SUBMITTED' as const,
      estimated_cost_kes: maintenanceForm.estimatedCostKes,
      actual_cost_kes: 0,
      created_at: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      maintenance: [newReq, ...prev.maintenance],
    }));
    notify(`Submitted Maintenance Request ${newReq.request_number} in SUBMITTED state.`);
  };

  const handleLeaseLifecycle = (
    lease: Lease,
    action: 'ACTIVATE' | 'EXPIRE' | 'RENEW' | 'TERMINATE'
  ) => {
    try {
      if (!hasPermission(state.currentRole, 'leases.approve')) {
        throw new Error(
          `Role '${state.currentRole}' lacks 'leases.approve' permission.`
        );
      }
      if (action === 'ACTIVATE') {
        setState((prev) => ({
          ...prev,
          leases: prev.leases.map((l) =>
            l.id === lease.id ? { ...l, status: 'ACTIVE' } : l
          ),
          units: prev.units.map((u) =>
            u.id === lease.unit_id
              ? {
                  ...u,
                  status: 'OCCUPIED',
                  current_lease_id: lease.id,
                  current_tenant_id: lease.primary_tenant_id,
                }
              : u
          ),
        }));
        notify(`Lease ${lease.lease_number} activated and unit marked OCCUPIED.`);
      } else if (action === 'EXPIRE') {
        setState((prev) => ({
          ...prev,
          leases: prev.leases.map((l) =>
            l.id === lease.id ? { ...l, status: 'EXPIRING' } : l
          ),
        }));
        notify(`Lease ${lease.lease_number} marked as EXPIRING.`);
      } else if (action === 'RENEW') {
        const nextSeq = orgLeases.length + 1;
        const renewedLease: Lease = {
          ...lease,
          id: `lse-renew-${Date.now()}`,
          lease_number: `LSE-${String(nextSeq).padStart(4, '0')}`,
          start_date: '2027-01-01',
          end_date: '2027-12-31',
          monthly_rent_kes: Math.round(lease.monthly_rent_kes * 1.05),
          status: 'ACTIVE',
          renewed_from_lease_id: lease.id,
        };
        setState((prev) => ({
          ...prev,
          leases: [
            renewedLease,
            ...prev.leases.map((l) =>
              l.id === lease.id ? { ...l, status: 'RENEWED' as const } : l
            ),
          ],
        }));
        notify(
          `Lease ${lease.lease_number} marked RENEWED and successor lease ${renewedLease.lease_number} activated.`
        );
      } else if (action === 'TERMINATE') {
        setState((prev) => ({
          ...prev,
          leases: prev.leases.map((l) =>
            l.id === lease.id ? { ...l, status: 'TERMINATED' } : l
          ),
          units: prev.units.map((u) =>
            u.id === lease.unit_id
              ? {
                  ...u,
                  status: 'VACANT',
                  current_lease_id: undefined,
                  current_tenant_id: undefined,
                }
              : u
          ),
        }));
        notify(`Lease ${lease.lease_number} terminated and unit returned to VACANT status.`);
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const handleGenerateSignedUrl = (doc: DocumentItem) => {
    const expires = new Date(Date.now() + 300 * 1000).toISOString();
    const token = btoa(`${doc.s3_object_key}:${expires}`).slice(0, 32);
    setSignedUrlPreview({
      fileName: doc.file_name,
      url: `https://s3.af-south-1.amazonaws.com/guri24-rms-private-docs/${doc.s3_object_key}?X-Amz-Expires=300&X-Amz-Signature=${token}`,
      expiresAt: expires,
    });
    notify(`Generated 5-minute private S3 pre-signed URL for ${doc.file_name}.`);
  };

  const handleExportCsv = async () => {
    try {
      if (!hasPermission(state.currentRole, 'reports.export')) {
        throw new Error(
          `Role '${state.currentRole}' lacks 'reports.export' permission.`
        );
      }
      await yieldToMain();
      const csvRows = [
        ['metric', 'value', 'currency_or_unit'],
        ['organization', currentOrg.name, 'TEXT'],
        ['total_properties', String(kpis.totalProperties), 'COUNT'],
        ['total_buildings', String(kpis.totalBuildings), 'COUNT'],
        ['total_units', String(kpis.totalUnits), 'COUNT'],
        ['occupied_units', String(kpis.occupiedUnits), 'COUNT'],
        ['vacant_units', String(kpis.vacantUnits), 'COUNT'],
        ['occupancy_rate_pct', String(kpis.occupancyRate), 'PERCENT'],
        ['expected_rental_revenue', String(kpis.expectedRevenue), 'KES'],
        ['actual_rental_collections', String(kpis.actualCollections), 'KES'],
        ['collection_rate_pct', String(kpis.collectionRate), 'PERCENT'],
        ['outstanding_arrears', String(kpis.totalArrears), 'KES'],
        ['security_deposits_liability', String(kpis.depositsLiability), 'KES'],
        ['net_operating_income', String(kpis.netOperatingIncome), 'KES'],
      ];
      const csvContent = csvRows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guri24_rms_${currentOrg.slug}_report.csv`;
      a.click();
      URL.revokeObjectURL(url);
      notify(`Exported reconciled portfolio report CSV for ${currentOrg.name}.`);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : String(err));
    }
  };

  const activeNavLabel =
    NAV_ITEMS.find((i) => i.id === activeSection)?.label.replace(/^\d+\.\s*/, '') ??
    'Overview';

  return (
    <>
      {/* Skip Link per Modern Web Guidance `accessibility` */}
      <a href="#main-heading" className="skip-link visually-hidden">
        Skip to main content
      </a>

      {/* Centralized Polite Live Region per Modern Web Guidance `accessibility` */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {politeAnnouncement}
      </div>

      <div className="app-shell">
        <aside className="app-sidebar" aria-label="Workspace sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                inlineSize: '40px',
                blockSize: '40px',
                borderRadius: '0.5rem',
                background: 'var(--color-emerald-600)',
                display: 'grid',
                placeContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
              aria-hidden="true"
            >
              G24
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                Guri24 RMS
              </div>
              <div style={{ fontSize: '0.76rem', color: '#a7f3d0' }}>
                Kenya Multi-Tenant SaaS • KES
              </div>
            </div>
          </div>

          <nav aria-label="Primary">
            <ul className="nav-list" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="nav-item-btn"
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    onClick={() => handleNavigate(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="app-main-wrapper">
          <header className="app-topbar">
            <nav aria-label="Breadcrumb">
              <ol
                style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <li>{currentOrg.name}</li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {activeNavLabel}
                </li>
              </ol>
            </nav>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <label
                  htmlFor="org-switcher"
                  style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-slate-700)' }}
                >
                  Organization (Tenant Isolation):
                </label>
                <select
                  id="org-switcher"
                  value={state.currentOrganizationId}
                  onChange={(e) => {
                    setState((prev) => ({
                      ...prev,
                      currentOrganizationId: e.target.value,
                    }));
                    notify('Switched active organization context.');
                  }}
                  style={{
                    font: 'inherit',
                    fontSize: '0.85rem',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-strong)',
                  }}
                >
                  {state.organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.county})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <label
                  htmlFor="role-switcher"
                  style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-slate-700)' }}
                >
                  Active RBAC Role:
                </label>
                <select
                  id="role-switcher"
                  value={state.currentRole}
                  onChange={(e) => {
                    const role = e.target.value as SystemRole;
                    setState((prev) => ({ ...prev, currentRole: role }));
                    notify(`Switched active RBAC role to ${role}.`);
                  }}
                  style={{
                    font: 'inherit',
                    fontSize: '0.85rem',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-strong)',
                  }}
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setWizardOpen(true)}
              >
                <Sparkles size={16} aria-hidden="true" />
                <span>Full Onboarding Chain</span>
              </button>

              <button
                type="button"
                className="btn btn-mpesa"
                onClick={() => setMpesaModalOpen(true)}
              >
                <CreditCard size={16} aria-hidden="true" />
                <span>M-Pesa Daraja Payment</span>
              </button>
            </div>
          </header>

          <main className="app-main" id="main-content">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <h1 id="main-heading" ref={mainHeadingRef} tabIndex={-1}>
                  {activeNavLabel}
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
                  {currentOrg.name} • Paybill{' '}
                  <code className="mono">{currentOrg.mpesa_paybill_shortcode}</code> • KRA PIN{' '}
                  <code className="mono">{currentOrg.kra_pin}</code> • Timezone{' '}
                  <code className="mono">{currentOrg.timezone}</code>
                </p>
              </div>

              {/* Semantic <search> landmark per Modern Web Guidance `html` & `forms` */}
              <search>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
                >
                  <label htmlFor="global-search" className="visually-hidden">
                    Search records in current view
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="global-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter units, tenants, invoices..."
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      style={{
                        font: 'inherit',
                        fontSize: '0.9rem',
                        padding: '0.5rem 0.75rem',
                        minBlockSize: '42px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-strong)',
                        minInlineSize: '240px',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    aria-label="Apply search filter"
                  >
                    <Search size={16} aria-hidden="true" />
                    <span>Filter</span>
                  </button>
                </form>
              </search>
            </div>

            {politeAnnouncement && (
              <div
                style={{
                  background: 'var(--color-emerald-50)',
                  border: '1px solid var(--color-emerald-600)',
                  color: 'var(--color-emerald-950)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{politeAnnouncement}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPoliteAnnouncement('')}
                >
                  Dismiss
                </button>
              </div>
            )}

            {errorBanner && (
              <div
                role="alert"
                style={{
                  background: 'var(--color-rose-50)',
                  border: '1px solid var(--color-rose-600)',
                  color: 'var(--color-rose-700)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                }}
              >
                {errorBanner}
              </div>
            )}

            {/* SECTION 1: OVERVIEW DASHBOARD */}
            {activeSection === 'overview' && (
              <>
                <section aria-labelledby="kpi-section-heading">
                  <h2 id="kpi-section-heading" className="visually-hidden">
                    Key Operational and Financial Performance Indicators
                  </h2>
                  <div className="kpi-grid">
                    <article className="surface-card">
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        Occupancy Rate ({kpis.occupiedUnits} / {kpis.totalUnits} Units)
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBlock: '0.25rem' }}>
                        {kpis.occupancyRate}%
                      </div>
                      <StatusBadge
                        status={`${kpis.vacantUnits} Vacant Available`}
                        tone={kpis.vacantUnits > 0 ? 'warning' : 'success'}
                      />
                    </article>

                    <article className="surface-card">
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        Actual Rent Collections (M-Pesa & Bank)
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBlock: '0.25rem', color: 'var(--color-emerald-800)' }}>
                        {formatKes(kpis.actualCollections)}
                      </div>
                      <StatusBadge
                        status={`${kpis.collectionRate}% of ${formatKes(kpis.expectedRevenue)} Billed`}
                        tone="success"
                      />
                    </article>

                    <article className="surface-card">
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        Outstanding Arrears (Receivables 1100)
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBlock: '0.25rem', color: 'var(--color-rose-700)' }}>
                        {formatKes(kpis.totalArrears)}
                      </div>
                      <StatusBadge
                        status={`${orgInvoices.filter((i) => i.balance_kes > 0).length} Open Invoices`}
                        tone={kpis.totalArrears > 0 ? 'danger' : 'success'}
                      />
                    </article>

                    <article className="surface-card">
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        Security Deposits Held (Liability 2100)
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBlock: '0.25rem' }}>
                        {formatKes(kpis.depositsLiability)}
                      </div>
                      <StatusBadge status="Excluded from Rental Revenue" tone="neutral" />
                    </article>

                    <article className="surface-card">
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        Net Operating Income (NOI)
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBlock: '0.25rem' }}>
                        {formatKes(kpis.netOperatingIncome)}
                      </div>
                      <StatusBadge
                        status={`After ${formatKes(kpis.totalExpenses)} Expenses`}
                        tone="success"
                      />
                    </article>
                  </div>
                </section>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  <section className="surface-card" aria-labelledby="recent-invoices-heading">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBlockEnd: '1rem',
                      }}
                    >
                      <h2 id="recent-invoices-heading">Active Invoices & Balances</h2>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleNavigate('billing')}
                      >
                        Manage Billing
                      </button>
                    </div>
                    <ResponsiveTable
                      caption="Current billing period invoices and partial payment balances"
                      headers={['Invoice #', 'Period', 'Total (KES)', 'Paid (KES)', 'Balance (KES)', 'Status']}
                    >
                      {orgInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <th scope="row" className="mono">
                            {inv.invoice_number}
                          </th>
                          <td>{inv.billing_period}</td>
                          <td className="mono">{formatKes(inv.total_amount_kes)}</td>
                          <td className="mono">{formatKes(inv.amount_paid_kes)}</td>
                          <td className="mono" style={{ fontWeight: 700 }}>
                            {formatKes(inv.balance_kes)}
                          </td>
                          <td>
                            <StatusBadge
                              status={inv.status}
                              tone={
                                inv.status === 'PAID'
                                  ? 'success'
                                  : inv.status === 'PARTIALLY_PAID'
                                  ? 'warning'
                                  : 'danger'
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </ResponsiveTable>
                  </section>

                  <section className="surface-card" aria-labelledby="recent-payments-heading">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBlockEnd: '1rem',
                      }}
                    >
                      <h2 id="recent-payments-heading">Verified M-Pesa Daraja Collections</h2>
                      <button
                        type="button"
                        className="btn btn-mpesa"
                        onClick={() => setMpesaModalOpen(true)}
                      >
                        Record M-Pesa Callback
                      </button>
                    </div>
                    <ResponsiveTable
                      caption="Settled Safaricom M-Pesa STK Push and Paybill C2B transactions"
                      headers={['M-Pesa Receipt', 'Phone', 'Amount', 'Allocated', 'Receipt #', 'Status']}
                    >
                      {orgPayments.map((p) => (
                        <tr key={p.id}>
                          <th scope="row" className="mono">
                            {p.mpesa_receipt_number ?? 'PENDING'}
                          </th>
                          <td className="mono">{p.payer_phone}</td>
                          <td className="mono">{formatKes(p.amount_kes)}</td>
                          <td className="mono">{formatKes(p.allocated_amount_kes)}</td>
                          <td className="mono">{p.receipt_number ?? '-'}</td>
                          <td>
                            <StatusBadge status={p.status} tone="success" />
                          </td>
                        </tr>
                      ))}
                    </ResponsiveTable>
                  </section>
                </div>
              </>
            )}

            {/* SECTION 2: PROPERTIES */}
            {activeSection === 'properties' && (
              <section className="surface-card" aria-labelledby="properties-heading">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <h2 id="properties-heading">
                    Residential Properties ({orgProperties.length})
                  </h2>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setWizardOpen(true)}
                  >
                    <Plus size={16} aria-hidden="true" />
                    <span>Add Property & Hierarchy</span>
                  </button>
                </div>
                <ResponsiveTable
                  caption="Organization-scoped residential properties in Kenya"
                  headers={['Code', 'Property Name', 'County & Area', 'LR Number', 'Commission %', 'Amenities']}
                >
                  {orgProperties
                    .filter(
                      (p) =>
                        !searchQuery ||
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.county.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((prop) => (
                      <tr key={prop.id}>
                        <th scope="row" className="mono">
                          {prop.code}
                        </th>
                        <td style={{ fontWeight: 600 }}>{prop.name}</td>
                        <td>
                          {prop.estate_or_area}, {prop.county}
                        </td>
                        <td className="mono">{prop.lr_number}</td>
                        <td>{prop.management_commission_pct}%</td>
                        <td>{prop.amenities.join(', ')}</td>
                      </tr>
                    ))}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 3: BUILDINGS */}
            {activeSection === 'buildings' && (
              <section className="surface-card" aria-labelledby="buildings-heading">
                <h2 id="buildings-heading" style={{ marginBlockEnd: '1rem' }}>
                  Buildings & Blocks ({orgBuildings.length}) & Floors ({orgFloors.length})
                </h2>
                <ResponsiveTable
                  caption="Buildings and floor structures linked to residential properties"
                  headers={['Building Code', 'Building Name', 'Property', 'Total Floors', 'Registered Floors']}
                >
                  {orgBuildings.map((b) => {
                    const prop = orgProperties.find((p) => p.id === b.property_id);
                    const bFloors = orgFloors.filter((f) => f.building_id === b.id);
                    return (
                      <tr key={b.id}>
                        <th scope="row" className="mono">
                          {b.code}
                        </th>
                        <td style={{ fontWeight: 600 }}>{b.name}</td>
                        <td>{prop?.name ?? b.property_id}</td>
                        <td>{b.total_floors}</td>
                        <td>{bFloors.map((f) => f.label).join(', ') || 'Ground Floor'}</td>
                      </tr>
                    );
                  })}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 4: UNITS */}
            {activeSection === 'units' && (
              <section className="surface-card" aria-labelledby="units-heading">
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <h2 id="units-heading">Rental Units Inventory ({orgUnits.length})</h2>
                  <div className="pill-group">
                    {['ALL', 'VACANT', 'OCCUPIED', 'RESERVED'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setStatusFilter(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveTable
                  caption="Residential units with monthly KES rent, deposit requirements, and utility meters"
                  headers={['Unit #', 'Type', 'Monthly Rent', 'Security Deposit', 'Meters (Water / KPLC)', 'Status']}
                >
                  {orgUnits
                    .filter((u) => statusFilter === 'ALL' || u.status === statusFilter)
                    .filter(
                      (u) =>
                        !searchQuery ||
                        u.unit_number.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id}>
                        <th scope="row" className="mono">
                          {u.unit_number}
                        </th>
                        <td>
                          {u.unit_type.replace('_', ' ')} ({u.bedrooms}BR)
                        </td>
                        <td className="mono" style={{ fontWeight: 600 }}>
                          {formatKes(u.monthly_rent_kes)}
                        </td>
                        <td className="mono">{formatKes(u.deposit_amount_kes)}</td>
                        <td className="mono">
                          {u.water_meter_number} / {u.kplc_meter_number}
                        </td>
                        <td>
                          <StatusBadge
                            status={u.status}
                            tone={
                              u.status === 'OCCUPIED'
                                ? 'success'
                                : u.status === 'VACANT'
                                ? 'warning'
                                : 'neutral'
                            }
                          />
                        </td>
                      </tr>
                    ))}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 5: TENANTS */}
            {activeSection === 'tenants' && (
              <section className="surface-card" aria-labelledby="tenants-heading">
                <h2 id="tenants-heading" style={{ marginBlockEnd: '1rem' }}>
                  Registered Tenants ({orgTenants.length}) — Kenya DPA 2019 Masked IDs
                </h2>
                <ResponsiveTable
                  caption="Tenants with Kenyan phone-first onboarding and masked National ID numbers"
                  headers={['Code', 'Full Name', 'M-Pesa Phone', 'Email', 'Masked National ID', 'Status']}
                >
                  {orgTenants
                    .filter(
                      (t) =>
                        !searchQuery ||
                        t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.phone.includes(searchQuery)
                    )
                    .map((t) => (
                      <tr key={t.id}>
                        <th scope="row" className="mono">
                          {t.tenant_code}
                        </th>
                        <td style={{ fontWeight: 600 }}>{t.full_name}</td>
                        <td className="mono">{t.phone}</td>
                        <td>{t.email}</td>
                        <td className="mono">{t.national_id_masked}</td>
                        <td>
                          <StatusBadge
                            status={t.status}
                            tone={t.status === 'ACTIVE' ? 'success' : 'warning'}
                          />
                        </td>
                      </tr>
                    ))}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 6: APPLICATIONS */}
            {activeSection === 'applications' && (
              <section className="surface-card" aria-labelledby="apps-heading">
                <h2 id="apps-heading" style={{ marginBlockEnd: '1rem' }}>
                  Tenant Applications ({orgApplications.length})
                </h2>
                <ResponsiveTable
                  caption="Prospective tenant applications and affordability screening"
                  headers={['Application ID', 'Applicant', 'Target Unit', 'Proposed Move-In', 'Verified Income', 'Status']}
                >
                  {orgApplications.map((app) => {
                    const t = orgTenants.find((ten) => ten.id === app.tenant_id);
                    const u = orgUnits.find((uni) => uni.id === app.unit_id);
                    return (
                      <tr key={app.id}>
                        <th scope="row" className="mono">
                          {app.id}
                        </th>
                        <td>{t?.full_name ?? app.tenant_id}</td>
                        <td className="mono">{u?.unit_number ?? app.unit_id}</td>
                        <td>{app.proposed_move_in_date}</td>
                        <td className="mono">{formatKes(app.monthly_income_kes)}</td>
                        <td>
                          <StatusBadge status={app.status} tone="success" />
                        </td>
                      </tr>
                    );
                  })}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 7: LEASES */}
            {activeSection === 'leases' && (
              <section className="surface-card" aria-labelledby="leases-heading">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <h2 id="leases-heading">Lease Agreements & Lifecycle ({orgLeases.length})</h2>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setWizardOpen(true)}
                  >
                    <Plus size={16} aria-hidden="true" />
                    <span>New Lease</span>
                  </button>
                </div>
                <ResponsiveTable
                  caption="Active, Expiring, Renewed, and Terminated residential leases"
                  headers={['Lease #', 'Tenant & Unit', 'Period', 'Monthly Rent', 'M-Pesa Account Ref', 'Status & Actions']}
                >
                  {orgLeases.map((l) => {
                    const tenant = orgTenants.find((t) => t.id === l.primary_tenant_id);
                    const unit = orgUnits.find((u) => u.id === l.unit_id);
                    return (
                      <tr key={l.id}>
                        <th scope="row" className="mono">
                          {l.lease_number}
                        </th>
                        <td>
                          <strong>{tenant?.full_name ?? l.primary_tenant_id}</strong> — Unit{' '}
                          <code className="mono">{unit?.unit_number ?? l.unit_id}</code>
                        </td>
                        <td>
                          {l.start_date} → {l.end_date}
                        </td>
                        <td className="mono">{formatKes(l.monthly_rent_kes)}</td>
                        <td className="mono">{l.payment_account_reference}</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                            <StatusBadge
                              status={l.status}
                              tone={
                                l.status === 'ACTIVE'
                                  ? 'success'
                                  : l.status === 'EXPIRING'
                                  ? 'warning'
                                  : 'neutral'
                              }
                            />
                            {l.status === 'ACTIVE' && (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleLeaseLifecycle(l, 'EXPIRE')}
                              >
                                Mark Expiring
                              </button>
                            )}
                            {(l.status === 'ACTIVE' || l.status === 'EXPIRING') && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => handleLeaseLifecycle(l, 'RENEW')}
                                >
                                  Renew
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => handleLeaseLifecycle(l, 'TERMINATE')}
                                >
                                  Terminate
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 8: BILLING */}
            {activeSection === 'billing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section className="surface-card" aria-labelledby="generate-invoice-heading">
                  <h2 id="generate-invoice-heading" style={{ marginBlockEnd: '0.5rem' }}>
                    Idempotent Recurring Monthly Invoice Generator
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', marginBlockEnd: '1rem', fontSize: '0.9rem' }}>
                    Enforces idempotency per <code className="mono">(organization_id, lease_id, billing_period)</code>. Running billing twice for the same month never creates duplicate invoices or duplicate journal entries.
                  </p>
                  <form onSubmit={handleGenerateInvoice} className="form-grid">
                    <div className="form-field">
                      <label htmlFor="billing-lease">Select Active Lease</label>
                      <select
                        id="billing-lease"
                        name="leaseId"
                        value={selectedLeaseForBilling}
                        onChange={(e) => setSelectedLeaseForBilling(e.target.value)}
                      >
                        {orgLeases
                          .filter((l) => l.status === 'ACTIVE' || l.status === 'EXPIRING')
                          .map((l) => {
                            const t = orgTenants.find((ten) => ten.id === l.primary_tenant_id);
                            return (
                              <option key={l.id} value={l.id}>
                                {l.lease_number} — {t?.full_name} ({formatKes(l.monthly_rent_kes)}/mo)
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor="billing-period">Billing Period (YYYY-MM)</label>
                      <input
                        id="billing-period"
                        name="billingPeriod"
                        type="text"
                        value={billingPeriodInput}
                        onChange={(e) => setBillingPeriodInput(e.target.value)}
                        pattern="\d{4}-\d{2}"
                        required
                      />
                    </div>
                    <div className="form-field" style={{ justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-primary">
                        <RefreshCw size={16} aria-hidden="true" />
                        <span>Generate Recurring Invoice</span>
                      </button>
                    </div>
                  </form>
                </section>

                <section className="surface-card" aria-labelledby="all-invoices-heading">
                  <h2 id="all-invoices-heading" style={{ marginBlockEnd: '1rem' }}>
                    Invoices Ledger ({orgInvoices.length})
                  </h2>
                  <ResponsiveTable
                    caption="Monthly rent and utility invoices with real-time payment allocation balances"
                    headers={['Invoice #', 'Period', 'Due Date', 'Total (KES)', 'Paid (KES)', 'Balance (KES)', 'Status']}
                  >
                    {orgInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <th scope="row" className="mono">
                          {inv.invoice_number}
                        </th>
                        <td>{inv.billing_period}</td>
                        <td>{inv.due_date}</td>
                        <td className="mono">{formatKes(inv.total_amount_kes)}</td>
                        <td className="mono">{formatKes(inv.amount_paid_kes)}</td>
                        <td className="mono" style={{ fontWeight: 700 }}>
                          {formatKes(inv.balance_kes)}
                        </td>
                        <td>
                          <StatusBadge
                            status={inv.status}
                            tone={
                              inv.status === 'PAID'
                                ? 'success'
                                : inv.status === 'PARTIALLY_PAID'
                                ? 'warning'
                                : 'danger'
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </ResponsiveTable>
                </section>
              </div>
            )}

            {/* SECTION 9: PAYMENTS & M-PESA DARAJA */}
            {activeSection === 'payments' && (
              <section className="surface-card" aria-labelledby="payments-heading">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <div>
                    <h2 id="payments-heading">
                      M-Pesa Daraja Payments & FIFO Invoice Allocations ({orgPayments.length})
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                      Supports partial payments (e.g. KES 15,000 invoice → KES 10,000 paid → KES 5,000 balance), multi-invoice FIFO allocation, and duplicate M-Pesa callback protection.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-mpesa"
                    onClick={() => setMpesaModalOpen(true)}
                  >
                    <CreditCard size={16} aria-hidden="true" />
                    <span>Simulate Verified M-Pesa Callback</span>
                  </button>
                </div>
                <ResponsiveTable
                  caption="Payments and their invoice-level payment_allocations audit trail"
                  headers={['Reference', 'M-Pesa Receipt', 'Phone', 'Amount Paid', 'Allocated / Unallocated', 'Invoice Allocations']}
                >
                  {orgPayments.map((p) => (
                    <tr key={p.id}>
                      <th scope="row" className="mono">
                        {p.payment_reference}
                      </th>
                      <td className="mono" style={{ fontWeight: 700 }}>
                        {p.mpesa_receipt_number}
                      </td>
                      <td className="mono">{p.payer_phone}</td>
                      <td className="mono">{formatKes(p.amount_kes)}</td>
                      <td className="mono">
                        {formatKes(p.allocated_amount_kes)} / {formatKes(p.unallocated_amount_kes)}
                      </td>
                      <td>
                        {p.allocations.map((a) => (
                          <div key={a.id} style={{ fontSize: '0.82rem' }}>
                            <code className="mono">{a.invoice_number}</code>: {formatKes(a.allocated_amount_kes)} (Rem:{' '}
                            {formatKes(a.remaining_invoice_balance_kes)})
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 10: ACCOUNTING & SECURITY DEPOSITS */}
            {activeSection === 'accounting' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section className="surface-card" aria-labelledby="deposits-liability-heading">
                  <h2 id="deposits-liability-heading" style={{ marginBlockEnd: '0.5rem' }}>
                    Security Deposits Liability Ledger (Account 2100 — Never Rental Revenue)
                  </h2>
                  <ResponsiveTable
                    caption="Tenant security deposits held as refundable liabilities"
                    headers={['Deposit ID', 'Lease', 'Required', 'Received', 'Deducted / Refunded', 'Current Liability Balance']}
                  >
                    {orgDeposits.map((d) => {
                      const lease = orgLeases.find((l) => l.id === d.lease_id);
                      return (
                        <tr key={d.id}>
                          <th scope="row" className="mono">
                            {d.id}
                          </th>
                          <td className="mono">{lease?.lease_number ?? d.lease_id}</td>
                          <td className="mono">{formatKes(d.required_amount_kes)}</td>
                          <td className="mono">{formatKes(d.received_amount_kes)}</td>
                          <td className="mono">
                            {formatKes(d.deducted_amount_kes)} / {formatKes(d.refunded_amount_kes)}
                          </td>
                          <td className="mono" style={{ fontWeight: 700 }}>
                            {formatKes(d.current_liability_balance_kes)}
                          </td>
                        </tr>
                      );
                    })}
                  </ResponsiveTable>
                </section>

                <section className="surface-card" aria-labelledby="record-expense-heading">
                  <h2 id="record-expense-heading" style={{ marginBlockEnd: '1rem' }}>
                    Record Property Operating Expense (Posts DR 5000 Expense / CR 1010 Cash)
                  </h2>
                  <form onSubmit={handleRecordExpense} className="form-grid">
                    <div className="form-field">
                      <label htmlFor="exp-vendor">Vendor Name</label>
                      <input
                        id="exp-vendor"
                        type="text"
                        value={expenseForm.vendorName}
                        onChange={(e) =>
                          setExpenseForm((p) => ({ ...p, vendorName: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="exp-desc">Expense Description</label>
                      <input
                        id="exp-desc"
                        type="text"
                        value={expenseForm.description}
                        onChange={(e) =>
                          setExpenseForm((p) => ({ ...p, description: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="exp-amount">Amount (KES)</label>
                      <input
                        id="exp-amount"
                        type="text"
                        inputMode="numeric"
                        value={expenseForm.amountKes}
                        onChange={(e) =>
                          setExpenseForm((p) => ({
                            ...p,
                            amountKes: Number(e.target.value.replace(/\D/g, '')) || 0,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="form-field" style={{ justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-primary">
                        Approve & Post Expense Journal
                      </button>
                    </div>
                  </form>
                </section>

                <section className="surface-card" aria-labelledby="journals-heading">
                  <h2 id="journals-heading" style={{ marginBlockEnd: '0.5rem' }}>
                    Immutable Double-Entry General Journal ({orgJournals.length})
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBlockEnd: '1rem' }}>
                    Every journal entry enforces <code className="mono">Total Debits == Total Credits</code>. Posted entries cannot be deleted; use Reversal to post an offsetting entry.
                  </p>
                  <ResponsiveTable
                    caption="Double-entry accounting journal entries and balanced debit/credit lines"
                    headers={['Entry #', 'Date', 'Source Event', 'Description & Lines', 'Total DR / CR', 'Action']}
                  >
                    {orgJournals.map((j) => (
                      <tr key={j.id}>
                        <th scope="row" className="mono">
                          {j.entry_number}
                        </th>
                        <td>{j.entry_date}</td>
                        <td>
                          <StatusBadge
                            status={`${j.source_event_type} (${j.status})`}
                            tone={j.status === 'POSTED' ? 'success' : 'warning'}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, marginBlockEnd: '0.25rem' }}>
                            {j.description}
                          </div>
                          {j.lines.map((l, idx) => (
                            <div key={idx} className="mono" style={{ fontSize: '0.78rem', color: 'var(--color-slate-600)' }}>
                              [{l.account_code} {l.account_name}] DR: {formatKes(l.debit_kes)} | CR:{' '}
                              {formatKes(l.credit_kes)}
                            </div>
                          ))}
                        </td>
                        <td className="mono" style={{ fontWeight: 700 }}>
                          {formatKes(j.total_debit_kes)}
                        </td>
                        <td>
                          {j.status === 'POSTED' && j.source_event_type !== 'REVERSAL' && (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleReverseJournal(j)}
                            >
                              Post Reversal
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </ResponsiveTable>
                </section>
              </div>
            )}

            {/* SECTION 11: MAINTENANCE WORKFLOW */}
            {activeSection === 'maintenance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section className="surface-card" aria-labelledby="submit-mnt-heading">
                  <h2 id="submit-mnt-heading" style={{ marginBlockEnd: '1rem' }}>
                    Submit Maintenance Request (8-Stage Workflow State Machine)
                  </h2>
                  <form onSubmit={handleSubmitMaintenance} className="form-grid">
                    <div className="form-field">
                      <label htmlFor="mnt-title">Issue Summary</label>
                      <input
                        id="mnt-title"
                        type="text"
                        value={maintenanceForm.title}
                        onChange={(e) =>
                          setMaintenanceForm((p) => ({ ...p, title: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="mnt-cat">Category</label>
                      <select
                        id="mnt-cat"
                        value={maintenanceForm.category}
                        onChange={(e) =>
                          setMaintenanceForm((p) => ({ ...p, category: e.target.value }))
                        }
                      >
                        <option value="PLUMBING">PLUMBING</option>
                        <option value="ELECTRICAL">ELECTRICAL</option>
                        <option value="CARPENTRY">CARPENTRY</option>
                        <option value="APPLIANCES">APPLIANCES</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor="mnt-cost">Estimated Cost (KES)</label>
                      <input
                        id="mnt-cost"
                        type="text"
                        inputMode="numeric"
                        value={maintenanceForm.estimatedCostKes}
                        onChange={(e) =>
                          setMaintenanceForm((p) => ({
                            ...p,
                            estimatedCostKes: Number(e.target.value.replace(/\D/g, '')) || 0,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="form-field" style={{ justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-primary">
                        Submit Request
                      </button>
                    </div>
                  </form>
                </section>

                <section aria-labelledby="mnt-board-heading">
                  <h2 id="mnt-board-heading" style={{ marginBlockEnd: '0.75rem' }}>
                    Maintenance & Work Orders Board (Submitted → Reviewed → Approved → Assigned → In Progress → Completed → Verified → Closed)
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    {orgMaintenance.map((req) => {
                      const nextStatuses = getNextMaintenanceStatuses(req.status);
                      const unit = orgUnits.find((u) => u.id === req.unit_id);
                      return (
                        <article key={req.id} className="board-column">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong className="mono">{req.request_number}</strong>
                            <StatusBadge
                              status={req.status}
                              tone={
                                req.status === 'CLOSED' || req.status === 'VERIFIED'
                                  ? 'success'
                                  : 'warning'
                              }
                            />
                          </div>
                          <h3 style={{ fontSize: '1rem' }}>{req.title}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            {req.description}
                          </p>
                          <div style={{ fontSize: '0.82rem' }}>
                            <div>
                              <strong>Unit:</strong> {unit?.unit_number ?? req.unit_id} ({req.category})
                            </div>
                            <div>
                              <strong>Estimated Budget:</strong> {formatKes(req.estimated_cost_kes)}
                            </div>
                            {req.work_order_number && (
                              <div>
                                <strong>Work Order:</strong> <code className="mono">{req.work_order_number}</code> ({req.assigned_vendor})
                              </div>
                            )}
                          </div>
                          {nextStatuses.length > 0 && (
                            <div className="pill-group" style={{ marginBlockStart: '0.5rem' }}>
                              {nextStatuses.map((nextSt) => (
                                <button
                                  key={nextSt}
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => handleTransitionMaintenance(req.id, nextSt)}
                                >
                                  Advance → {nextSt}
                                </button>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* SECTION 12: PRIVATE DOCUMENTS VAULT */}
            {activeSection === 'documents' && (
              <section className="surface-card" aria-labelledby="docs-heading">
                <h2 id="docs-heading" style={{ marginBlockEnd: '0.5rem' }}>
                  Private S3 Document Vault ({orgDocuments.length})
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBlockEnd: '1rem' }}>
                  Documents are stored in private S3 object keys scoped by <code className="mono">organization_id</code> and accessed exclusively via short-lived HMAC-SHA256 signed URLs.
                </p>

                {signedUrlPreview && (
                  <div
                    style={{
                      background: 'var(--color-slate-100)',
                      border: '1px solid var(--color-slate-300)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBlockEnd: '1rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBlockEnd: '0.25rem' }}>
                      Generated Signed URL for {signedUrlPreview.fileName} (Expires {formatNairobiDate(signedUrlPreview.expiresAt)}):
                    </div>
                    <code
                      className="mono"
                      style={{
                        display: 'block',
                        wordBreak: 'break-all',
                        fontSize: '0.82rem',
                        color: 'var(--color-emerald-900)',
                      }}
                    >
                      {signedUrlPreview.url}
                    </code>
                  </div>
                )}

                <ResponsiveTable
                  caption="Private S3 documents with short-lived pre-signed URL generation"
                  headers={['Category', 'File Name', 'Linked Entity', 'Size', 'Created', 'Signed Access']}
                >
                  {orgDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <th scope="row">
                        <StatusBadge status={doc.category} tone="neutral" />
                      </th>
                      <td className="mono">{doc.file_name}</td>
                      <td>{doc.entity_label}</td>
                      <td>{doc.file_size_kb} KB</td>
                      <td>{formatNairobiDate(doc.created_at)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleGenerateSignedUrl(doc)}
                        >
                          <Download size={16} aria-hidden="true" />
                          <span>Generate 5m Signed URL</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 13: REPORTS & ANALYTICS */}
            {activeSection === 'reports' && (
              <section className="surface-card" aria-labelledby="reports-heading">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <div>
                    <h2 id="reports-heading">
                      Reconciled Financial & Occupancy Statement
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                      Every figure reconciles directly with underlying invoices, M-Pesa allocations, expenses, and security deposit liabilities.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleExportCsv}
                  >
                    <Download size={16} aria-hidden="true" />
                    <span>Export CSV Report</span>
                  </button>
                </div>

                <ResponsiveTable
                  caption="Executive financial and operational reconciliation summary"
                  headers={['Metric', 'Value', 'Accounting Treatment']}
                >
                  <tr>
                    <th scope="row">Occupancy Rate</th>
                    <td className="mono">
                      {kpis.occupancyRate}% ({kpis.occupiedUnits} of {kpis.totalUnits} units)
                    </td>
                    <td>Operational KPI</td>
                  </tr>
                  <tr>
                    <th scope="row">Expected Rental Revenue (Billed)</th>
                    <td className="mono">{formatKes(kpis.expectedRevenue)}</td>
                    <td>Credit Account 4000 (Rental Revenue) / Debit Account 1100 (AR)</td>
                  </tr>
                  <tr>
                    <th scope="row">Actual Rental Collections</th>
                    <td className="mono">{formatKes(kpis.actualCollections)}</td>
                    <td>Debit Account 1010 (M-Pesa Clearing) / Credit Account 1100 (AR)</td>
                  </tr>
                  <tr>
                    <th scope="row">Outstanding Arrears</th>
                    <td className="mono">{formatKes(kpis.totalArrears)}</td>
                    <td>Closing Debit Balance in Account 1100 (Accounts Receivable)</td>
                  </tr>
                  <tr>
                    <th scope="row">Operating & Maintenance Expenditure</th>
                    <td className="mono">{formatKes(kpis.totalExpenses)}</td>
                    <td>Debit Account 5000 (Maintenance Expense)</td>
                  </tr>
                  <tr>
                    <th scope="row">Net Operating Income (NOI)</th>
                    <td className="mono" style={{ fontWeight: 700 }}>
                      {formatKes(kpis.netOperatingIncome)}
                    </td>
                    <td>Actual Collections minus Operating Expenditure</td>
                  </tr>
                  <tr>
                    <th scope="row">Tenant Security Deposits Held</th>
                    <td className="mono">{formatKes(kpis.depositsLiability)}</td>
                    <td>Credit Account 2100 (Balance Sheet Liability — Excluded from Revenue)</td>
                  </tr>
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 14: TEAM & RBAC PERMISSIONS */}
            {activeSection === 'team' && (
              <section className="surface-card" aria-labelledby="rbac-heading">
                <h2 id="rbac-heading" style={{ marginBlockEnd: '0.5rem' }}>
                  Role-Based Access Control (RBAC) Matrix — Active Role: {state.currentRole}
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBlockEnd: '1rem' }}>
                  Switch the active role in the top navigation bar to test backend & domain authorization enforcement.
                </p>
                <ResponsiveTable
                  caption="System roles and their granted granular permissions"
                  headers={['Role', 'Granted Permissions Count', 'Permissions List']}
                >
                  {ROLES_LIST.map((role) => {
                    const perms = ROLE_PERMISSIONS[role];
                    return (
                      <tr key={role}>
                        <th scope="row" className="mono">
                          {role}
                        </th>
                        <td>{perms.length} permissions</td>
                        <td style={{ whiteSpace: 'normal' }}>{perms.join(', ')}</td>
                      </tr>
                    );
                  })}
                </ResponsiveTable>
              </section>
            )}

            {/* SECTION 15: SETTINGS & STRATEGY CONFIGURATION */}
            {activeSection === 'settings' && (
              <section className="surface-card" aria-labelledby="settings-heading">
                <h2 id="settings-heading" style={{ marginBlockEnd: '1rem' }}>
                  Organization Billing & Strategy Pattern Configuration ({currentOrg.name})
                </h2>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="set-rent-strategy">Rent Calculation Strategy</label>
                    <select
                      id="set-rent-strategy"
                      value={currentOrg.rent_calculation_strategy}
                      onChange={(e) => {
                        const val = e.target.value as Organization['rent_calculation_strategy'];
                        setState((prev) => ({
                          ...prev,
                          organizations: prev.organizations.map((o) =>
                            o.id === currentOrg.id ? { ...o, rent_calculation_strategy: val } : o
                          ),
                        }));
                        notify(`Updated RentCalculationStrategy to ${val}.`);
                      }}
                    >
                      <option value="FIXED_MONTHLY">FIXED_MONTHLY (Standard Kenyan Monthly Lease)</option>
                      <option value="PRORATED_DAILY">PRORATED_DAILY (Mid-Month Move-In Proration)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="set-alloc-strategy">Payment Allocation Strategy</label>
                    <select
                      id="set-alloc-strategy"
                      value={currentOrg.payment_allocation_strategy}
                      onChange={(e) => {
                        const val = e.target.value as Organization['payment_allocation_strategy'];
                        setState((prev) => ({
                          ...prev,
                          organizations: prev.organizations.map((o) =>
                            o.id === currentOrg.id ? { ...o, payment_allocation_strategy: val } : o
                          ),
                        }));
                        notify(`Updated PaymentAllocationStrategy to ${val}.`);
                      }}
                    >
                      <option value="FIFO_OLDEST_FIRST">FIFO_OLDEST_FIRST (Oldest Due Invoice First)</option>
                      <option value="RENT_PRIORITY_FIRST">RENT_PRIORITY_FIRST (Base Rent Before Utilities)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="set-paybill">Safaricom M-Pesa Paybill Shortcode</label>
                    <input
                      id="set-paybill"
                      type="text"
                      inputMode="numeric"
                      value={currentOrg.mpesa_paybill_shortcode}
                      onChange={(e) => {
                        const val = e.target.value;
                        setState((prev) => ({
                          ...prev,
                          organizations: prev.organizations.map((o) =>
                            o.id === currentOrg.id ? { ...o, mpesa_paybill_shortcode: val } : o
                          ),
                        }));
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 16: MOBILE-FIRST TENANT PORTAL */}
            {activeSection === 'tenant-portal' && (
              <section
                className="surface-card"
                aria-labelledby="tenant-portal-heading"
                style={{ maxInlineSize: '580px', marginInline: 'auto', inlineSize: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '1rem' }}>
                  <div>
                    <h2 id="tenant-portal-heading">Tenant Self-Service Portal</h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                      Wanjiku Mwangi • Unit A-101 • Jacaranda Heights
                    </p>
                  </div>
                  <StatusBadge status="ACTIVE LEASE" tone="success" />
                </div>

                <div
                  style={{
                    background: 'var(--color-emerald-950)',
                    color: '#fff',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    marginBlockEnd: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
                    Current Outstanding Balance (Account Ref: RENT-A-101)
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginBlock: '0.35rem' }}>
                    {formatKes(
                      orgInvoices
                        .filter((i) => i.tenant_id === 'tnt-wanjiku-001')
                        .reduce((acc, i) => acc + i.balance_kes, 0)
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-mpesa"
                    style={{ inlineSize: '100%', marginBlockStart: '0.5rem' }}
                    onClick={() => setMpesaModalOpen(true)}
                  >
                    <Receipt size={18} aria-hidden="true" />
                    <span>Pay Rent via M-Pesa STK Push (KES 5,000)</span>
                  </button>
                </div>

                <h3 style={{ marginBlockEnd: '0.5rem' }}>Recent Receipts & Statements</h3>
                <ResponsiveTable
                  caption="Your M-Pesa rent receipts"
                  headers={['Receipt #', 'M-Pesa Code', 'Amount Paid', 'Date']}
                >
                  {orgPayments
                    .filter((p) => p.tenant_id === 'tnt-wanjiku-001')
                    .map((p) => (
                      <tr key={p.id}>
                        <th scope="row" className="mono">
                          {p.receipt_number}
                        </th>
                        <td className="mono">{p.mpesa_receipt_number}</td>
                        <td className="mono">{formatKes(p.amount_kes)}</td>
                        <td>{p.paid_at ? formatNairobiDate(p.paid_at) : '-'}</td>
                      </tr>
                    ))}
                </ResponsiveTable>
              </section>
            )}
          </main>

          <footer
            style={{
              padding: '1rem 1.5rem',
              borderBlockStart: '1px solid var(--color-border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <span>
              Guri24 Residential Rental Management System (RMS) • Built with Rust, Axum, PostgreSQL, Vite & React
            </span>
            <span>Kenya Data Protection Act 2019 Compliant • Double-Entry Accounting</span>
          </footer>
        </div>
      </div>

      {/* NATIVE MODAL DIALOG 1: END-TO-END WORKFLOW WIZARD */}
      <ModalDialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Full Onboarding Workflow: Property → Building → Floor → Unit → Tenant → Lease"
      >
        <form onSubmit={handleRunOnboardingChain}>
          <fieldset
            style={{
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBlockEnd: '1rem',
            }}
          >
            <legend style={{ fontWeight: 700, paddingInline: '0.4rem' }}>
              1. Property, Building, Floor & Unit
            </legend>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="wiz-prop-name">Property Name *</label>
                <input
                  id="wiz-prop-name"
                  name="propertyName"
                  type="text"
                  value={wizardForm.propertyName}
                  onChange={(e) =>
                    setWizardForm((p) => ({ ...p, propertyName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="wiz-prop-code">Property Code *</label>
                <input
                  id="wiz-prop-code"
                  name="propertyCode"
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={wizardForm.propertyCode}
                  onChange={(e) =>
                    setWizardForm((p) => ({ ...p, propertyCode: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="wiz-bld-name">Building Name *</label>
                <input
                  id="wiz-bld-name"
                  name="buildingName"
                  type="text"
                  value={wizardForm.buildingName}
                  onChange={(e) =>
                    setWizardForm((p) => ({ ...p, buildingName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="wiz-unit-no">Unit Number *</label>
                <input
                  id="wiz-unit-no"
                  name="unitNumber"
                  type="text"
                  value={wizardForm.unitNumber}
                  onChange={(e) =>
                    setWizardForm((p) => ({ ...p, unitNumber: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="wiz-rent">Monthly Rent (KES) *</label>
                <input
                  id="wiz-rent"
                  name="monthlyRentKes"
                  type="text"
                  inputMode="numeric"
                  value={wizardForm.monthlyRentKes}
                  aria-invalid={wizardErrors.monthlyRentKes ? 'true' : undefined}
                  aria-describedby={wizardErrors.monthlyRentKes ? 'wiz-rent-err' : undefined}
                  onBlur={(e) => validateWizardField('monthlyRentKes', e.target.value)}
                  onChange={(e) => {
                    const val = Number(e.target.value.replace(/\D/g, '')) || 0;
                    setWizardForm((p) => ({
                      ...p,
                      monthlyRentKes: val,
                      depositKes: val,
                    }));
                    setWizardErrors((prev) => ({ ...prev, monthlyRentKes: '' }));
                  }}
                  required
                />
                {wizardErrors.monthlyRentKes && (
                  <span id="wiz-rent-err" className="field-error">
                    {wizardErrors.monthlyRentKes}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset
            style={{
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBlockEnd: '1rem',
            }}
          >
            <legend style={{ fontWeight: 700, paddingInline: '0.4rem' }}>
              2. Kenyan Tenant & Active Lease Assignment
            </legend>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="wiz-tenant-name">Tenant Full Name *</label>
                <input
                  id="wiz-tenant-name"
                  name="tenantFullName"
                  type="text"
                  autoComplete="name"
                  value={wizardForm.tenantFullName}
                  onChange={(e) =>
                    setWizardForm((p) => ({ ...p, tenantFullName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="wiz-tenant-phone">Kenyan M-Pesa Phone *</label>
                <input
                  id="wiz-tenant-phone"
                  name="tenantPhone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={wizardForm.tenantPhone}
                  aria-invalid={wizardErrors.tenantPhone ? 'true' : undefined}
                  aria-describedby="wiz-phone-hint"
                  onBlur={(e) => validateWizardField('tenantPhone', e.target.value)}
                  onChange={(e) => {
                    setWizardForm((p) => ({ ...p, tenantPhone: e.target.value }));
                    setWizardErrors((prev) => ({ ...prev, tenantPhone: '' }));
                  }}
                  required
                />
                <span id="wiz-phone-hint" className="field-hint">
                  Format: 07XXXXXXXX or 2547XXXXXXXX
                </span>
                {wizardErrors.tenantPhone && (
                  <span className="field-error">{wizardErrors.tenantPhone}</span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="wiz-tenant-id">National ID (Masked per DPA 2019)</label>
                <input
                  id="wiz-tenant-id"
                  name="tenantNationalId"
                  type="text"
                  inputMode="numeric"
                  value={wizardForm.tenantNationalId}
                  onChange={(e) =>
                    setWizardForm((p) => ({ ...p, tenantNationalId: e.target.value }))
                  }
                  required
                />
                <span className="field-hint">
                  Stored masked as {maskNationalId(wizardForm.tenantNationalId)}
                </span>
              </div>
            </div>
          </fieldset>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setWizardOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" autoFocus>
              Execute Full Onboarding Workflow
            </button>
          </div>
        </form>
      </ModalDialog>

      {/* NATIVE MODAL DIALOG 2: M-PESA DARAJA CALLBACK & RECONCILIATION */}
      <ModalDialog
        open={mpesaModalOpen}
        onClose={() => setMpesaModalOpen(false)}
        title="Safaricom M-Pesa Daraja STK Push & Callback Settlement"
      >
        <form onSubmit={handleProcessMpesaCallback}>
          <div className="form-field">
            <label htmlFor="mpesa-tenant">Select Tenant</label>
            <select
              id="mpesa-tenant"
              value={mpesaForm.tenantId}
              onChange={(e) =>
                setMpesaForm((p) => ({ ...p, tenantId: e.target.value }))
              }
            >
              {orgTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="mpesa-phone">M-Pesa Phone Number *</label>
              <input
                id="mpesa-phone"
                type="tel"
                inputMode="numeric"
                value={mpesaForm.payerPhone}
                onChange={(e) =>
                  setMpesaForm((p) => ({ ...p, payerPhone: e.target.value }))
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="mpesa-amount">Payment Amount (KES) *</label>
              <input
                id="mpesa-amount"
                type="text"
                inputMode="numeric"
                value={mpesaForm.amountKes}
                onChange={(e) =>
                  setMpesaForm((p) => ({
                    ...p,
                    amountKes: Number(e.target.value.replace(/\D/g, '')) || 0,
                  }))
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="mpesa-receipt">M-Pesa Receipt Number (Idempotency Key) *</label>
              <input
                id="mpesa-receipt"
                type="text"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={mpesaForm.mpesaReceiptNumber}
                onChange={(e) =>
                  setMpesaForm((p) => ({
                    ...p,
                    mpesaReceiptNumber: e.target.value.toUpperCase(),
                  }))
                }
                required
              />
              <span className="field-hint">
                Submitting the same receipt twice tests Duplicate M-Pesa Callback Protection.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setMpesaModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-mpesa" autoFocus>
              Verify Callback & Allocate Payment ({formatKes(mpesaForm.amountKes)})
            </button>
          </div>
        </form>
      </ModalDialog>
    </>
  );
}
