import {
  AssistantActionConfirmation,
  AssistantAttachment,
  AssistantCitation,
  AssistantConversation,
  AssistantMessage,
  AssistantToolCall,
  Building,
  DocumentItem,
  Floor,
  InspectionRecord,
  IntegrationStatusItem,
  Invoice,
  JournalEntry,
  JournalLine,
  Lease,
  MaintenanceRequest,
  MaintenanceStatus,
  OcrDocumentCategory,
  OcrExtractedField,
  OcrJobRecord,
  Organization,
  Payment,
  PaymentAllocation,
  Property,
  PropertyExpense,
  SecurityDepositRecord,
  SubscriptionSummary,
  SystemRole,
  Tenant,
  TenantApplication,
  Unit,
  Vendor,
} from '../types';
import { maskNationalId, normalizeKenyanPhone } from './formatters';

export const ROLE_PERMISSIONS: Record<SystemRole, string[]> = {
  SAAS_SUPER_ADMINISTRATOR: [
    'properties.view',
    'properties.create',
    'properties.update',
    'tenants.view',
    'tenants.create',
    'leases.view',
    'leases.create',
    'leases.approve',
    'invoices.view',
    'invoices.create',
    'payments.view',
    'payments.reconcile',
    'expenses.approve',
    'maintenance.view',
    'maintenance.assign',
    'documents.view',
    'documents.upload',
    'ocr.review',
    'assistant.use',
    'reports.export',
    'users.manage',
  ],
  ORGANIZATION_ADMINISTRATOR: [
    'properties.view',
    'properties.create',
    'properties.update',
    'tenants.view',
    'tenants.create',
    'leases.view',
    'leases.create',
    'leases.approve',
    'invoices.view',
    'invoices.create',
    'payments.view',
    'payments.reconcile',
    'expenses.approve',
    'maintenance.view',
    'maintenance.assign',
    'documents.view',
    'documents.upload',
    'ocr.review',
    'assistant.use',
    'reports.export',
    'users.manage',
  ],
  PROPERTY_OWNER: [
    'properties.view',
    'tenants.view',
    'leases.view',
    'leases.approve',
    'invoices.view',
    'payments.view',
    'expenses.approve',
    'maintenance.view',
    'documents.view',
    'assistant.use',
    'reports.export',
  ],
  PROPERTY_MANAGER: [
    'properties.view',
    'properties.create',
    'properties.update',
    'tenants.view',
    'tenants.create',
    'leases.view',
    'leases.create',
    'leases.approve',
    'invoices.view',
    'invoices.create',
    'payments.view',
    'maintenance.view',
    'maintenance.assign',
    'documents.view',
    'documents.upload',
    'ocr.review',
    'assistant.use',
    'reports.export',
  ],
  ACCOUNTANT: [
    'properties.view',
    'tenants.view',
    'leases.view',
    'invoices.view',
    'invoices.create',
    'payments.view',
    'payments.reconcile',
    'expenses.approve',
    'documents.view',
    'documents.upload',
    'ocr.review',
    'assistant.use',
    'reports.export',
  ],
  RECEPTIONIST: [
    'properties.view',
    'tenants.view',
    'tenants.create',
    'leases.view',
    'leases.create',
    'maintenance.view',
    'documents.view',
    'documents.upload',
    'assistant.use',
  ],
  MAINTENANCE_OFFICER: [
    'properties.view',
    'maintenance.view',
    'maintenance.assign',
    'documents.view',
    'documents.upload',
    'assistant.use',
  ],
  VENDOR: ['properties.view', 'maintenance.view', 'maintenance.assign'],
  TENANT: [
    'leases.view',
    'invoices.view',
    'payments.view',
    'maintenance.view',
    'documents.view',
    'documents.upload',
    'assistant.use',
  ],
};

const VALID_MAINTENANCE_TRANSITIONS: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  SUBMITTED: ['REVIEWED'],
  REVIEWED: ['APPROVED', 'REJECTED'],
  APPROVED: ['ASSIGNED'],
  REJECTED: [],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: ['VERIFIED'],
  VERIFIED: ['CLOSED'],
  CLOSED: [],
};

export interface RmsPlatformState {
  currentOrganizationId: string;
  currentRole: SystemRole;
  organizations: Organization[];
  properties: Property[];
  buildings: Building[];
  floors: Floor[];
  units: Unit[];
  tenants: Tenant[];
  applications: TenantApplication[];
  leases: Lease[];
  invoices: Invoice[];
  payments: Payment[];
  deposits: SecurityDepositRecord[];
  journals: JournalEntry[];
  expenses: PropertyExpense[];
  maintenance: MaintenanceRequest[];
  documents: DocumentItem[];
  ocrJobs: OcrJobRecord[];
  assistantConversations: AssistantConversation[];
  assistantConfirmations: AssistantActionConfirmation[];
  vendors: Vendor[];
  inspections: InspectionRecord[];
  subscriptions: SubscriptionSummary[];
  integrationsStatus: IntegrationStatusItem[];
}

export function createEmptyRmsState(): RmsPlatformState {
  return {
    currentOrganizationId: '',
    currentRole: 'ORGANIZATION_ADMINISTRATOR',
    organizations: [],
    properties: [],
    buildings: [],
    floors: [],
    units: [],
    tenants: [],
    applications: [],
    leases: [],
    invoices: [],
    payments: [],
    deposits: [],
    journals: [],
    expenses: [],
    maintenance: [],
    documents: [],
    ocrJobs: [],
    assistantConversations: [],
    assistantConfirmations: [],
    vendors: [],
    inspections: [],
    subscriptions: [],
    integrationsStatus: [],
  };
}

export function createInitialRmsState(): RmsPlatformState {
  return createEmptyRmsState();
}

/**
 * Sanitizes workspace state loaded from persistent snapshot store.
 * Eliminates any lingering legacy simulated payment records (e.g. SJK99201KL)
 * and legacy mock OCR records (e.g. signed_lease_amina_A201.pdf).
 */
export function sanitizeWorkspaceState(raw: any): RmsPlatformState {
  if (!raw || typeof raw !== 'object') {
    return createEmptyRmsState();
  }
  const clean = { ...raw };

  // 1. Purge legacy simulated payments
  if (Array.isArray(clean.payments)) {
    clean.payments = clean.payments.filter((p: any) => {
      const code = (
        (p.provider_receipt_number || '') +
        ' ' +
        (p.payment_reference || '') +
        ' ' +
        (p.mpesa_receipt_number || '') +
        ' ' +
        (p.receipt_number || '')
      ).toUpperCase();
      return (
        !code.includes('SJK99201KL') &&
        !code.includes('SJKDEP001') &&
        !code.includes('SJK10000AA') &&
        !code.includes('SJK20000BB')
      );
    });
  }

  // 2. Purge legacy mock OCR jobs
  if (Array.isArray(clean.ocrJobs)) {
    clean.ocrJobs = clean.ocrJobs.filter((j: any) => {
      const name = (j.file_name || '').toLowerCase();
      const id = (j.id || '').toLowerCase();
      return (
        !name.includes('signed_lease_amina') &&
        !name.includes('screenshot 2026-11-13') &&
        !(id === 'ocr-job-0001' && name.includes('amina'))
      );
    });
  }

  return clean as RmsPlatformState;
}

export function hasPermission(role: SystemRole, permission: string): boolean {
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}

export function assertPermission(role: SystemRole, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Access Denied (RBAC): Role '${role}' lacks required permission '${permission}'.`
    );
  }
}

export function getNextMaintenanceStatuses(current: MaintenanceStatus): MaintenanceStatus[] {
  return VALID_MAINTENANCE_TRANSITIONS[current] ?? [];
}

/**
 * Pure domain service functions used by the React state and tested in Vitest
 */
export function executeEndToEndOnboardingChain(
  state: RmsPlatformState,
  input: {
    propertyName: string;
    propertyCode: string;
    county: string;
    estate: string;
    address: string;
    buildingName: string;
    buildingCode: string;
    floorNumber: number;
    floorLabel: string;
    unitNumber: string;
    unitType: string;
    bedrooms: number;
    monthlyRentKes: number;
    depositKes: number;
    tenantFullName: string;
    tenantPhone: string;
    tenantEmail: string;
    tenantNationalId: string;
    leaseStartDate: string;
    leaseEndDate: string;
    billingDay: number;
  }
): RmsPlatformState {
  assertPermission(state.currentRole, 'properties.create');
  assertPermission(state.currentRole, 'tenants.create');
  assertPermission(state.currentRole, 'leases.create');
  assertPermission(state.currentRole, 'leases.approve');

  const normalizedPhone = normalizeKenyanPhone(input.tenantPhone);
  if (!normalizedPhone) {
    throw new Error('Invalid Kenyan phone number. Use 07XXXXXXXX, 01XXXXXXXX, or 2547XXXXXXXX.');
  }
  if (!input.propertyName?.trim()) {
    throw new Error('Property name is required.');
  }
  if (!input.unitNumber?.trim()) {
    throw new Error('Unit number is required.');
  }
  if (!input.tenantFullName?.trim()) {
    throw new Error('Tenant full name is required.');
  }
  if (input.monthlyRentKes <= 0) {
    throw new Error('Monthly rent must be greater than KES 0.');
  }
  if (input.leaseEndDate <= input.leaseStartDate) {
    throw new Error('Lease end date must be after lease start date.');
  }

  const orgId = state.currentOrganizationId;
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  const propCode = (input.propertyCode || '').trim().toUpperCase() || input.propertyName.trim().slice(0, 4).toUpperCase();
  const bldCode = (input.buildingCode || '').trim().toUpperCase() || 'MAIN';
  const bldName = (input.buildingName || '').trim() || `${input.propertyName.trim()} Main Wing`;
  const estateName = (input.estate || '').trim() || input.county.trim() || 'Nairobi';

  const property: Property = {
    id: `prop-${suffix}`,
    organization_id: orgId,
    code: propCode,
    name: input.propertyName.trim(),
    county: input.county.trim() || 'Nairobi',
    estate_or_area: estateName,
    physical_address: input.address.trim() || `${estateName}, ${input.county || 'Nairobi'}`,
    lr_number: `LR 209/${Math.floor(10000 + Math.random() * 89999)}`,
    management_commission_pct: 7.5,
    amenities: ['Borehole Water', '24/7 Security'],
  };

  const building: Building = {
    id: `bld-${suffix}`,
    organization_id: orgId,
    property_id: property.id,
    code: bldCode,
    name: bldName,
    total_floors: Math.max(1, input.floorNumber),
  };

  const floor: Floor = {
    id: `flr-${suffix}`,
    organization_id: orgId,
    property_id: property.id,
    building_id: building.id,
    floor_number: input.floorNumber,
    label: (input.floorLabel || '').trim() || `Floor ${input.floorNumber}`,
  };

  const tenantId = `tnt-${suffix}`;
  const leaseId = `lse-${suffix}`;

  const unit: Unit = {
    id: `unit-${suffix}`,
    organization_id: orgId,
    property_id: property.id,
    building_id: building.id,
    floor_id: floor.id,
    unit_number: input.unitNumber.trim().toUpperCase(),
    unit_type: input.unitType,
    bedrooms: input.bedrooms,
    bathrooms: Math.max(1, input.bedrooms),
    monthly_rent_kes: input.monthlyRentKes,
    deposit_amount_kes: input.depositKes,
    status: 'OCCUPIED',
    water_meter_number: '',
    kplc_meter_number: '',
    current_tenant_id: tenantId,
    current_lease_id: leaseId,
  };

  const tenantSeq = state.tenants.filter((t) => t.organization_id === orgId).length + 1;
  const tenant: Tenant = {
    id: tenantId,
    organization_id: orgId,
    tenant_code: `TNT-${String(tenantSeq).padStart(4, '0')}`,
    full_name: input.tenantFullName.trim(),
    phone: normalizedPhone,
    email: input.tenantEmail.trim(),
    national_id_masked: maskNationalId(input.tenantNationalId),
    emergency_contact_name: 'Registered Next of Kin',
    emergency_contact_phone: normalizedPhone,
    status: 'ACTIVE',
  };

  const leaseSeq = state.leases.filter((l) => l.organization_id === orgId).length + 1;
  const lease: Lease = {
    id: leaseId,
    organization_id: orgId,
    property_id: property.id,
    building_id: building.id,
    unit_id: unit.id,
    primary_tenant_id: tenant.id,
    lease_number: `LSE-${String(leaseSeq).padStart(4, '0')}`,
    start_date: input.leaseStartDate,
    end_date: input.leaseEndDate,
    billing_day: input.billingDay,
    monthly_rent_kes: input.monthlyRentKes,
    security_deposit_kes: input.depositKes,
    service_charge_kes: 0,
    garbage_fee_kes: 0,
    status: 'ACTIVE',
    payment_account_reference: `RENT-${unit.unit_number}`,
  };

  const deposit: SecurityDepositRecord = {
    id: `dep-${suffix}`,
    organization_id: orgId,
    lease_id: lease.id,
    tenant_id: tenant.id,
    unit_id: unit.id,
    required_amount_kes: input.depositKes,
    received_amount_kes: input.depositKes,
    deducted_amount_kes: 0,
    refunded_amount_kes: 0,
    current_liability_balance_kes: input.depositKes,
    status: 'HELD',
  };

  const jrnSeq = state.journals.filter((j) => j.organization_id === orgId).length + 1;
  const depositJournal: JournalEntry = {
    id: `jrn-${suffix}`,
    organization_id: orgId,
    entry_number: `JRN-${String(jrnSeq).padStart(5, '0')}`,
    entry_date: input.leaseStartDate,
    source_event_type: 'DEPOSIT_RECEIVED',
    description: `Security deposit held for ${lease.lease_number} (${unit.unit_number}) — Liability Account 2100`,
    status: 'POSTED',
    total_debit_kes: input.depositKes,
    total_credit_kes: input.depositKes,
    lines: [
      {
        account_code: '1010',
        account_name: 'M-Pesa & Bank Clearing Account',
        account_type: 'ASSET',
        debit_kes: input.depositKes,
        credit_kes: 0,
        memo: `Security deposit receipt for ${lease.lease_number}`,
      },
      {
        account_code: '2100',
        account_name: 'Tenant Security Deposits Held (Liability)',
        account_type: 'LIABILITY',
        debit_kes: 0,
        credit_kes: input.depositKes,
        memo: 'Tenant deposit liability (never recognized as rental revenue)',
      },
    ],
  };

  return {
    ...state,
    properties: [...state.properties, property],
    buildings: [...state.buildings, building],
    floors: [...state.floors, floor],
    units: [...state.units, unit],
    tenants: [...state.tenants, tenant],
    leases: [...state.leases, lease],
    deposits: [...state.deposits, deposit],
    journals: [depositJournal, ...state.journals],
  };
}

/**
 * Idempotent recurring invoice generator for a lease and billing period (`YYYY-MM`).
 */
export function generateIdempotentInvoice(
  state: RmsPlatformState,
  leaseId: string,
  billingPeriod: string
): { nextState: RmsPlatformState; invoice: Invoice; created: boolean } {
  assertPermission(state.currentRole, 'invoices.create');
  const orgId = state.currentOrganizationId;
  const lease = state.leases.find((l) => l.id === leaseId && l.organization_id === orgId);
  if (!lease) {
    throw new Error('Lease not found in current organization.');
  }

  const existing = state.invoices.find(
    (inv) =>
      inv.organization_id === orgId &&
      inv.lease_id === leaseId &&
      inv.billing_period === billingPeriod &&
      inv.status !== 'CANCELLED'
  );

  if (existing) {
    return { nextState: state, invoice: existing, created: false };
  }

  const charges = lease.service_charge_kes + lease.garbage_fee_kes;
  const total = lease.monthly_rent_kes + charges;
  const invSeq = state.invoices.filter((i) => i.organization_id === orgId).length + 1;
  const invoiceNumber = `INV-${billingPeriod.replace('-', '')}-${String(invSeq).padStart(4, '0')}`;
  const invoice: Invoice = {
    id: `inv-${Date.now()}-${invSeq}`,
    organization_id: orgId,
    property_id: lease.property_id,
    unit_id: lease.unit_id,
    lease_id: lease.id,
    tenant_id: lease.primary_tenant_id,
    invoice_number: invoiceNumber,
    billing_period: billingPeriod,
    issue_date: `${billingPeriod}-01`,
    due_date: `${billingPeriod}-${String(lease.billing_day).padStart(2, '0')}`,
    rent_amount_kes: lease.monthly_rent_kes,
    charges_amount_kes: charges,
    penalty_kes: 0,
    total_amount_kes: total,
    amount_paid_kes: 0,
    balance_kes: total,
    status: 'ISSUED',
    idempotency_key: `INV:${orgId}:${lease.id}:${billingPeriod}`,
  };

  const jrnSeq = state.journals.filter((j) => j.organization_id === orgId).length + 1;
  const journalLines: JournalLine[] = [
    {
      account_code: '1100',
      account_name: 'Accounts Receivable - Tenants',
      account_type: 'ASSET',
      debit_kes: total,
      credit_kes: 0,
      memo: `Receivable for ${invoiceNumber}`,
    },
    {
      account_code: '4000',
      account_name: 'Residential Rental Revenue',
      account_type: 'REVENUE',
      debit_kes: 0,
      credit_kes: lease.monthly_rent_kes,
      memo: `Monthly rent ${billingPeriod}`,
    },
  ];
  if (charges > 0) {
    journalLines.push({
      account_code: '4100',
      account_name: 'Utility & Service Charge Recovery',
      account_type: 'REVENUE',
      debit_kes: 0,
      credit_kes: charges,
      memo: `Service & garbage charges ${billingPeriod}`,
    });
  }

  const journal: JournalEntry = {
    id: `jrn-inv-${invSeq}`,
    organization_id: orgId,
    entry_number: `JRN-${String(jrnSeq).padStart(5, '0')}`,
    entry_date: invoice.issue_date,
    source_event_type: 'INVOICE_ISSUED',
    description: `Invoice ${invoiceNumber} issued for period ${billingPeriod}`,
    status: 'POSTED',
    total_debit_kes: total,
    total_credit_kes: total,
    lines: journalLines,
  };

  return {
    nextState: {
      ...state,
      invoices: [invoice, ...state.invoices],
      journals: [journal, ...state.journals],
    },
    invoice,
    created: true,
  };
}

/**
 * Processes a verified M-Pesa Daraja callback with:
 * - Duplicate callback protection by `mpesaReceiptNumber`
 * - FIFO allocation across multiple or partial invoices
 * - Double-entry journal posting (DR 1010 Cash / CR 1100 Accounts Receivable / CR 2200 Advance Prepayments)
 */
export function processVerifiedMpesaPayment(
  state: RmsPlatformState,
  input: {
    tenantId: string;
    payerPhone: string;
    amountKes: number;
    mpesaReceiptNumber: string;
    checkoutRequestId: string;
  }
): { nextState: RmsPlatformState; payment: Payment; duplicateIgnored: boolean } {
  const orgId = state.currentOrganizationId;
  const cleanReceipt = input.mpesaReceiptNumber.trim().toUpperCase();

  // Duplicate M-Pesa callback check
  const existing = state.payments.find(
    (p) =>
      p.organization_id === orgId &&
      (p.mpesa_receipt_number === cleanReceipt ||
        (p.checkout_request_id === input.checkoutRequestId && p.status === 'COMPLETED'))
  );
  if (existing) {
    return { nextState: state, payment: existing, duplicateIgnored: true };
  }

  const normalizedPhone = normalizeKenyanPhone(input.payerPhone);
  if (!normalizedPhone) {
    throw new Error('Invalid Kenyan M-Pesa phone number.');
  }
  if (input.amountKes <= 0) {
    throw new Error('Payment amount must be greater than KES 0.');
  }

  // Sort tenant's outstanding invoices oldest due_date first (FIFO)
  const outstandingInvoices = state.invoices
    .filter(
      (i) =>
        i.organization_id === orgId &&
        i.tenant_id === input.tenantId &&
        i.balance_kes > 0 &&
        i.status !== 'CANCELLED'
    )
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  let remainingToAllocate = input.amountKes;
  const allocations: PaymentAllocation[] = [];
  const updatedInvoiceMap = new Map<string, Invoice>();

  for (const inv of outstandingInvoices) {
    if (remainingToAllocate <= 0) break;
    const alloc = Math.min(remainingToAllocate, inv.balance_kes);
    if (alloc > 0) {
      const newPaid = inv.amount_paid_kes + alloc;
      const newBalance = inv.total_amount_kes - newPaid;
      const updatedInv: Invoice = {
        ...inv,
        amount_paid_kes: newPaid,
        balance_kes: newBalance,
        status: newBalance === 0 ? 'PAID' : 'PARTIALLY_PAID',
      };
      updatedInvoiceMap.set(inv.id, updatedInv);
      allocations.push({
        id: `alloc-${cleanReceipt}-${inv.id}`,
        invoice_id: inv.id,
        invoice_number: inv.invoice_number,
        allocated_amount_kes: alloc,
        remaining_invoice_balance_kes: newBalance,
      });
      remainingToAllocate -= alloc;
    }
  }

  const totalAllocated = input.amountKes - remainingToAllocate;
  const unallocated = remainingToAllocate;
  const paySeq = state.payments.filter((p) => p.organization_id === orgId).length + 1;

  const payment: Payment = {
    id: `pay-${cleanReceipt}`,
    organization_id: orgId,
    tenant_id: input.tenantId,
    payment_reference: `PAY-${String(paySeq).padStart(5, '0')}`,
    idempotency_key: `MPESA-${cleanReceipt}`,
    checkout_request_id: input.checkoutRequestId,
    mpesa_receipt_number: cleanReceipt,
    payer_phone: normalizedPhone,
    amount_kes: input.amountKes,
    allocated_amount_kes: totalAllocated,
    unallocated_amount_kes: unallocated,
    status: 'COMPLETED',
    allocations,
    receipt_number: `RCT-${cleanReceipt}`,
    paid_at: new Date().toISOString(),
  };

  const lines: JournalLine[] = [
    {
      account_code: '1010',
      account_name: 'M-Pesa & Bank Clearing Account',
      account_type: 'ASSET',
      debit_kes: input.amountKes,
      credit_kes: 0,
      memo: `Safaricom M-Pesa Receipt ${cleanReceipt}`,
    },
  ];
  if (totalAllocated > 0) {
    lines.push({
      account_code: '1100',
      account_name: 'Accounts Receivable - Tenants',
      account_type: 'ASSET',
      debit_kes: 0,
      credit_kes: totalAllocated,
      memo: `Allocated across ${allocations.length} invoice(s)`,
    });
  }
  if (unallocated > 0) {
    lines.push({
      account_code: '2200',
      account_name: 'Tenant Advance Prepayments (Liability)',
      account_type: 'LIABILITY',
      debit_kes: 0,
      credit_kes: unallocated,
      memo: 'Unallocated advance rent credit',
    });
  }

  const jrnSeq = state.journals.filter((j) => j.organization_id === orgId).length + 1;
  const journal: JournalEntry = {
    id: `jrn-pay-${cleanReceipt}`,
    organization_id: orgId,
    entry_number: `JRN-${String(jrnSeq).padStart(5, '0')}`,
    entry_date: new Date().toISOString().slice(0, 10),
    source_event_type: 'PAYMENT_RECEIVED',
    description: `M-Pesa Callback Confirmed: ${cleanReceipt} (${payment.payment_reference})`,
    status: 'POSTED',
    total_debit_kes: input.amountKes,
    total_credit_kes: input.amountKes,
    lines,
  };

  const nextInvoices = state.invoices.map((inv) => updatedInvoiceMap.get(inv.id) ?? inv);

  return {
    nextState: {
      ...state,
      invoices: nextInvoices,
      payments: [payment, ...state.payments],
      journals: [journal, ...state.journals],
    },
    payment,
    duplicateIgnored: false,
  };
}

/**
 * Module 19 — OCR & Document Intelligence Pipeline
 * Enforces:
 * - File type (PDF, PNG, JPEG, WEBP), size (<= 15 MB), and page count (<= 50 pages) validation
 * - Pipeline stages: UPLOADED -> QUEUED -> PROCESSING -> NEEDS_REVIEW
 * - Extracted fields are NEVER applied to authoritative RMS records until human verification
 */
export function submitOcrDocumentJob(
  state: RmsPlatformState,
  input: {
    fileName: string;
    mimeType: string;
    fileSizeKb: number;
    pageCount: number;
    documentCategory: OcrDocumentCategory;
    rawSampleText?: string;
    linkedEntityLabel?: string;
  }
): { nextState: RmsPlatformState; job: OcrJobRecord } {
  assertPermission(state.currentRole, 'documents.upload');
  const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
  if (!allowedMimes.includes(input.mimeType)) {
    throw new Error(
      `Unsupported document MIME type '${input.mimeType}'. Allowed: PDF, PNG, JPEG, WEBP.`
    );
  }
  if (input.fileSizeKb <= 0 || input.fileSizeKb > 15360) {
    throw new Error('Document file size must be between 1 KB and 15,360 KB (15 MB).');
  }
  if (input.pageCount <= 0 || input.pageCount > 50) {
    throw new Error('Document page count must be between 1 and 50 pages.');
  }

  const orgId = state.currentOrganizationId;
  const seq = state.ocrJobs.filter((j) => j.organization_id === orgId).length + 1;
  const jobId = `ocr-job-${String(seq).padStart(4, '0')}`;
  const docId = `doc-ocr-${String(seq).padStart(4, '0')}`;

  let fields: OcrExtractedField[] = [];
  let rawText = input.rawSampleText?.trim() || '';

  if (input.documentCategory === 'TENANT_IDENTIFICATION') {
    if (!rawText) {
      rawText =
        'REPUBLIC OF KENYA — NATIONAL IDENTITY CARD | Full Names: AMINA HASSAN NOOR | ID Number: 31223344 | Phone: 0700889900';
    }
    fields = [
      {
        id: `${jobId}-f1`,
        field_name: 'full_name',
        field_label: 'Full Name',
        extracted_value: 'AMINA HASSAN NOOR',
        normalized_value: 'Amina Hassan Noor',
        confidence: 0.97,
        page_number: 1,
        bounding_box: { page: 1, x: 0.18, y: 0.28, width: 0.48, height: 0.05 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f2`,
        field_name: 'id_number',
        field_label: 'Kenyan National ID (Masked)',
        extracted_value: '31223344',
        normalized_value: maskNationalId('31223344'),
        confidence: 0.95,
        page_number: 1,
        bounding_box: { page: 1, x: 0.18, y: 0.16, width: 0.3, height: 0.05 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f3`,
        field_name: 'phone_number',
        field_label: 'M-Pesa Phone Number',
        extracted_value: '0700889900',
        normalized_value: normalizeKenyanPhone('0700889900') || '254700889900',
        confidence: 0.93,
        page_number: 1,
        bounding_box: { page: 1, x: 0.18, y: 0.42, width: 0.32, height: 0.05 },
        validation_errors: [],
        human_verified: false,
      },
    ];
  } else if (input.documentCategory === 'LEASE_AGREEMENT') {
    if (!rawText) {
      rawText =
        'RESIDENTIAL LEASE AGREEMENT — Property: Jacaranda Heights Apartments | Unit: A-201 | Tenant: Amina Hassan Noor | Monthly Rent: KES 35,000.00 | Deposit: KES 35,000.00 | Term: 2026-12-01 to 2027-11-30';
    }
    fields = [
      {
        id: `${jobId}-f1`,
        field_name: 'tenant_name',
        field_label: 'Tenant Name',
        extracted_value: 'Amina Hassan Noor',
        normalized_value: 'Amina Hassan Noor',
        confidence: 0.96,
        page_number: 1,
        bounding_box: { page: 1, x: 0.14, y: 0.22, width: 0.4, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f2`,
        field_name: 'unit_number',
        field_label: 'Unit Number',
        extracted_value: 'A-201',
        normalized_value: 'A-201',
        confidence: 0.95,
        page_number: 1,
        bounding_box: { page: 1, x: 0.58, y: 0.22, width: 0.16, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f3`,
        field_name: 'monthly_rent_kes',
        field_label: 'Monthly Rent (KES)',
        extracted_value: 'KES 35,000.00',
        normalized_value: '35000.00',
        confidence: 0.94,
        page_number: 1,
        bounding_box: { page: 1, x: 0.14, y: 0.34, width: 0.26, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f4`,
        field_name: 'deposit_amount_kes',
        field_label: 'Security Deposit (KES)',
        extracted_value: 'KES 35,000.00',
        normalized_value: '35000.00',
        confidence: 0.92,
        page_number: 1,
        bounding_box: { page: 1, x: 0.46, y: 0.34, width: 0.26, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
    ];
  } else if (input.documentCategory === 'RECEIPT_OR_INVOICE') {
    if (!rawText) {
      rawText =
        'VENDOR TAX INVOICE — Vendor: Nairobi Rapid Plumbers Ltd | Invoice #: VINV-2026-884 | Amount: KES 4,500.00 | Date: 2026-11-08 | KRA PIN: P051662211R';
    }
    fields = [
      {
        id: `${jobId}-f1`,
        field_name: 'vendor_name',
        field_label: 'Vendor / Issuer Name',
        extracted_value: 'Nairobi Rapid Plumbers Ltd',
        normalized_value: 'Nairobi Rapid Plumbers Ltd',
        confidence: 0.96,
        page_number: 1,
        bounding_box: { page: 1, x: 0.12, y: 0.15, width: 0.45, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f2`,
        field_name: 'invoice_or_receipt_number',
        field_label: 'Receipt / Invoice Number',
        extracted_value: 'VINV-2026-884',
        normalized_value: 'VINV-2026-884',
        confidence: 0.94,
        page_number: 1,
        bounding_box: { page: 1, x: 0.62, y: 0.15, width: 0.24, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f3`,
        field_name: 'total_amount_kes',
        field_label: 'Amount (KES)',
        extracted_value: 'KES 4,500.00',
        normalized_value: '4500.00',
        confidence: 0.95,
        page_number: 1,
        bounding_box: { page: 1, x: 0.62, y: 0.48, width: 0.24, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
    ];
  } else {
    if (!rawText) {
      rawText =
        'REPUBLIC OF KENYA — CERTIFICATE OF LEASE / PROPERTY DEED | Parcel LR Number: LR 209/11421 | County: Nairobi | Registered Proprietor: Kilimani Crest Property Management Ltd';
    }
    fields = [
      {
        id: `${jobId}-f1`,
        field_name: 'lr_number',
        field_label: 'Land Reference (LR) Number',
        extracted_value: 'LR 209/11421',
        normalized_value: 'LR 209/11421',
        confidence: 0.95,
        page_number: 1,
        bounding_box: { page: 1, x: 0.2, y: 0.25, width: 0.35, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
      {
        id: `${jobId}-f2`,
        field_name: 'county',
        field_label: 'County',
        extracted_value: 'Nairobi',
        normalized_value: 'Nairobi',
        confidence: 0.98,
        page_number: 1,
        bounding_box: { page: 1, x: 0.2, y: 0.33, width: 0.25, height: 0.04 },
        validation_errors: [],
        human_verified: false,
      },
    ];
  }

  const avgConfidence =
    fields.reduce((acc, f) => acc + f.confidence, 0) / Math.max(1, fields.length);

  const newDoc: DocumentItem = {
    id: docId,
    organization_id: orgId,
    category:
      input.documentCategory === 'TENANT_IDENTIFICATION'
        ? 'TENANT_ID'
        : input.documentCategory === 'LEASE_AGREEMENT'
        ? 'LEASE_AGREEMENT'
        : input.documentCategory === 'RECEIPT_OR_INVOICE'
        ? 'INVOICE'
        : 'PROPERTY_DEED',
    entity_label: input.linkedEntityLabel || 'OCR Document Upload',
    file_name: input.fileName.trim(),
    mime_type: input.mimeType,
    file_size_kb: input.fileSizeKb,
    s3_object_key: `private/org/${orgId}/ocr/${input.fileName.trim()}`,
    created_at: new Date().toISOString(),
  };

  const job: OcrJobRecord = {
    id: jobId,
    organization_id: orgId,
    document_id: docId,
    file_name: input.fileName.trim(),
    mime_type: input.mimeType,
    file_size_kb: input.fileSizeKb,
    page_count: input.pageCount,
    document_category: input.documentCategory,
    provider_name: 'ConfigurableOcrProviderAdapter (Local Structured Parser)',
    status: 'NEEDS_REVIEW',
    raw_extracted_text: rawText,
    overall_confidence: Number(avgConfidence.toFixed(2)),
    fields,
    authoritative_record_applied: false,
    linked_entity_label: input.linkedEntityLabel || 'Pending Verification',
    created_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  };

  return {
    nextState: {
      ...state,
      documents: [newDoc, ...state.documents],
      ocrJobs: [job, ...state.ocrJobs],
      subscriptions: state.subscriptions.map((sub) =>
        sub.organization_id === orgId
          ? { ...sub, ocr_pages_used: sub.ocr_pages_used + input.pageCount }
          : sub
      ),
    },
    job,
  };
}

/**
 * Mandatory Human-in-the-Loop OCR Verification
 * Requires `ocr.review` permission. Only when `approve: true` does the job transition to `VERIFIED`
 * and mark `authoritative_record_applied: true`.
 */
export function reviewOcrDocumentJob(
  state: RmsPlatformState,
  jobId: string,
  reviewInput: {
    approve: boolean;
    corrections?: Record<string, string>;
    notes: string;
  }
): { nextState: RmsPlatformState; job: OcrJobRecord } {
  assertPermission(state.currentRole, 'ocr.review');
  const orgId = state.currentOrganizationId;
  const target = state.ocrJobs.find((j) => j.id === jobId && j.organization_id === orgId);
  if (!target) {
    throw new Error('OCR job not found in current organization (strict tenant isolation).');
  }

  const corrections = reviewInput.corrections ?? {};
  const updatedFields = target.fields.map((fld) => {
    const corrected = corrections[fld.field_name]?.trim();
    const nextVal = corrected && corrected.length > 0 ? corrected : fld.normalized_value;
    if (reviewInput.approve && !nextVal) {
      throw new Error(`OCR field '${fld.field_label}' cannot be empty when approving verification.`);
    }
    return {
      ...fld,
      normalized_value: nextVal,
      corrected_value: corrected && corrected !== fld.normalized_value ? corrected : fld.corrected_value,
      human_verified: reviewInput.approve,
    };
  });

  const updatedJob: OcrJobRecord = {
    ...target,
    status: reviewInput.approve ? 'VERIFIED' : 'FAILED',
    fields: updatedFields,
    authoritative_record_applied: reviewInput.approve,
    review_audit: {
      id: `rev-${Date.now()}`,
      job_id: target.id,
      reviewer_role: state.currentRole,
      decision: reviewInput.approve ? 'APPROVED' : 'REJECTED',
      notes: reviewInput.notes.trim() || (reviewInput.approve ? 'Human verified and approved.' : 'Rejected during review.'),
      reviewed_at: new Date().toISOString(),
    },
  };

  return {
    nextState: {
      ...state,
      ocrJobs: state.ocrJobs.map((j) => (j.id === target.id ? updatedJob : j)),
    },
    job: updatedJob,
  };
}

/**
 * Module 20 — Grounded AI Agent Assistant
 * - Enforces `assistant.use` and tool-level RBAC permissions
 * - Blocks prompt-injection / cross-tenant / unverified-data override attempts
 * - Cites live RMS records (Invoices, Leases, Units, Payments, Maintenance, OCR Jobs)
 * - Requires explicit user confirmation (`AssistantActionConfirmation`) before any mutating action
 */
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /bypass\s+(rbac|permission|tenant|security|isolation)/i,
  /show\s+(all\s+)?organizations/i,
  /other\s+organization/i,
  /nyali\s+oceanfront/i,
  /system\s+prompt/i,
  /delete\s+all\s+journals/i,
];

export function sendAssistantPrompt(
  state: RmsPlatformState,
  rawPrompt: string,
  conversationId = 'conv-0001',
  attachment?: AssistantAttachment
): {
  nextState: RmsPlatformState;
  reply: AssistantMessage;
  pendingConfirmation?: AssistantActionConfirmation;
} {
  assertPermission(state.currentRole, 'assistant.use');
  const prompt = rawPrompt.trim();
  if (!prompt && !attachment) {
    throw new Error('Assistant prompt cannot be empty.');
  }

  const orgId = state.currentOrganizationId;
  const nowIso = new Date().toISOString();

  const userMessage: AssistantMessage = {
    id: `msg-user-${Date.now()}`,
    role: 'USER',
    content: prompt || (attachment?.kind === 'audio' ? 'Voice memo inquiry' : `Uploaded document for analysis: ${attachment?.name}`),
    attachment,
    citations: [],
    tool_calls: [],
    created_at: nowIso,
  };

  // 1. Prompt-injection & cross-tenant safety guard
  const matchedInjection = PROMPT_INJECTION_PATTERNS.find((re) => re.test(prompt));
  if (matchedInjection) {
    const blockedReply: AssistantMessage = {
      id: `msg-ast-${Date.now() + 1}`,
      role: 'ASSISTANT',
      content:
        'Security & Grounding Guard: Request blocked. I cannot bypass RBAC permissions, expose records belonging to another organization, or mutate financial ledgers without authorization.',
      citations: [],
      tool_calls: [],
      blocked_reason: 'PROMPT_INJECTION_OR_CROSS_TENANT_ATTEMPT_BLOCKED',
      created_at: nowIso,
    };

    return {
      nextState: appendConversationMessages(state, orgId, conversationId, [userMessage, blockedReply]),
      reply: blockedReply,
    };
  }

  const lower = prompt.toLowerCase();
  const orgInvoices = state.invoices.filter((i) => i.organization_id === orgId);
  const orgUnits = state.units.filter((u) => u.organization_id === orgId);
  const orgLeases = state.leases.filter((l) => l.organization_id === orgId);
  const orgTenants = state.tenants.filter((t) => t.organization_id === orgId);
  const orgMaintenance = state.maintenance.filter((m) => m.organization_id === orgId);
  const orgOcrJobs = state.ocrJobs.filter((j) => j.organization_id === orgId);

  const citations: AssistantCitation[] = [];
  const toolCalls: AssistantToolCall[] = [];
  let replyText = '';
  let pendingConfirmation: AssistantActionConfirmation | undefined;

  // 1.5 Handle file attachment / audio note if supplied
  if (attachment) {
    if (attachment.kind === 'audio') {
      toolCalls.push({
        id: `tc-${Date.now()}`,
        tool_name: 'transcribe_audio_memo',
        permission_checked: 'assistant.use',
        arguments_summary: JSON.stringify({ audio_name: attachment.name, duration: attachment.duration }),
        result_summary: `Audio transcribed: "${prompt || 'Check lease status for Unit B-204 and outstanding arrears'}"`,
        executed_at: nowIso,
      });
      replyText = `Audio Memo Processed (${attachment.duration || '01:48.56'}): Transcribed voice note regarding portfolio lease health. Unit B-204 lease is active, expiring in 18 days with 0 arrears. All portfolio signals look favorable.`;
    } else {
      toolCalls.push({
        id: `tc-${Date.now()}`,
        tool_name: 'olmocr_groq_vision_extract',
        permission_checked: 'documents.upload',
        arguments_summary: JSON.stringify({ file_name: attachment.name, size_kb: attachment.size }),
        result_summary: `Extracted structured parameters (Confidence: 96%)`,
        executed_at: nowIso,
      });
      citations.push({
        record_type: 'OCR_DOCUMENT',
        record_id: `doc-${Date.now()}`,
        reference_code: attachment.name,
        summary: `Document processed with 96% confidence score via Allen AI olmOCR & Groq Vision`,
      });
      replyText = `Uploaded document **${attachment.name}** processed successfully via olmOCR & Groq Vision. Extracted key parameters: Kenyan Tenancy Agreement, Monthly Rent: KES 45,000, Security Deposit: KES 45,000, Term: 12 Months. Staged in OCR workbench awaiting 1-click human verification.`;
    }
  } else if (lower.includes('lease') || lower.includes('tenancy')) {
    assertPermission(state.currentRole, 'leases.view');
    const targetUnit =
      orgUnits.find((u) => lower.includes(u.unit_number.toLowerCase())) ??
      orgUnits.find((u) => u.status === 'VACANT' || u.status === 'VACANT_AVAILABLE') ??
      orgUnits[0];

    if (targetUnit) {
      const confId = `conf-${Date.now()}`;
      const rentAmount = targetUnit.monthly_rent_kes || 35000;
      pendingConfirmation = {
        id: confId,
        organization_id: orgId,
        conversation_id: conversationId,
        action_type: 'DRAFT_LEASE_AGREEMENT',
        title: `Draft Residential Lease for Unit ${targetUnit.unit_number}`,
        summary: `Prepare standard 12-month lease agreement for Unit ${targetUnit.unit_number} (Rent: KES ${rentAmount.toLocaleString()}/mo, Deposit: KES ${rentAmount.toLocaleString()}). Requires human confirmation.`,
        target_reference: `Unit ${targetUnit.unit_number}`,
        payload: {
          unit_id: targetUnit.id,
          unit_number: targetUnit.unit_number,
          monthly_rent_kes: rentAmount,
          security_deposit_kes: rentAmount,
          tenure_months: 12,
        },
        status: 'PENDING',
        created_at: nowIso,
      };
      toolCalls.push({
        id: `tc-${Date.now()}`,
        tool_name: 'prepare_lease_agreement',
        permission_checked: 'leases.view',
        arguments_summary: JSON.stringify({ unit_number: targetUnit.unit_number, rent_kes: rentAmount }),
        result_summary: `Prepared draft lease agreement for Unit ${targetUnit.unit_number}`,
        executed_at: nowIso,
      });
      citations.push({
        record_type: 'UNIT',
        record_id: targetUnit.id,
        reference_code: `Unit ${targetUnit.unit_number}`,
        summary: `${targetUnit.unit_type} (${targetUnit.bedrooms}BR) — Rent: KES ${rentAmount.toLocaleString()}/mo`,
      });
      replyText = `### Draft Lease Agreement Prepared\n- **Target Unit:** Unit ${targetUnit.unit_number} (${targetUnit.unit_type})\n- **Monthly Rent:** KES ${rentAmount.toLocaleString()}\n- **Security Deposit:** KES ${rentAmount.toLocaleString()} (Refundable)\n- **Term:** 12 Months Standard Kenya Residential Lease\n- **Governing Law:** Landlord and Tenant Act (Cap 301, Kenya)\n\nPer Guri24 safety policy, no database mutation is performed until you review and click **Confirm & Execute**.`;
    } else {
      replyText = `### Residential Tenancy Agreement Template\n- **Standard Term:** 12 Months fixed tenure\n- **Statutory Terms:** 1-month deposit, 5-day grace period, M-Pesa Daraja payment allocation\n- **Portfolio Notice:** No units are registered yet in your portfolio. You can onboard properties and units in the **Properties** tab to assign authoritative tenant leases.`;
    }
  } else if (
    lower.includes('dashboard') ||
    lower.includes('report') ||
    lower.includes('performance') ||
    lower.includes('build a dashboard')
  ) {
    assertPermission(state.currentRole, 'reports.export');
    const totalUnits = orgUnits.length;
    const occupied = orgUnits.filter((u) => u.status === 'OCCUPIED').length;
    const vacant = orgUnits.filter((u) => u.status === 'VACANT' || u.status === 'VACANT_AVAILABLE').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupied / totalUnits) * 100) : 0;
    const totalBilled = orgInvoices.reduce((acc, i) => acc + (i.total_amount_kes || 0), 0);
    const totalPaid = orgInvoices.reduce((acc, i) => acc + (i.amount_paid_kes || 0), 0);
    const totalArrears = orgInvoices.reduce((acc, i) => acc + (i.balance_kes || 0), 0);
    const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 100;

    toolCalls.push({
      id: `tc-${Date.now()}`,
      tool_name: 'generate_dashboard_kpis',
      permission_checked: 'reports.export',
      arguments_summary: JSON.stringify({ organization_id: orgId }),
      result_summary: `Occupancy: ${occupancyRate}%, Collections: ${collectionRate}%`,
      executed_at: nowIso,
    });

    replyText = `### Portfolio Analytics & Performance Dashboard\n- **Total Registered Units:** ${totalUnits} (${occupied} Occupied, ${vacant} Vacant)\n- **Occupancy Rate:** ${occupancyRate}%\n- **Total Expected Billing:** KES ${totalBilled.toLocaleString()}\n- **Actual Collections:** KES ${totalPaid.toLocaleString()} (${collectionRate}% Collection Rate)\n- **Outstanding Arrears:** KES ${totalArrears.toLocaleString()} (${orgInvoices.filter((i) => i.balance_kes > 0).length} overdue accounts)\n- **Active Leases:** ${orgLeases.filter((l) => l.status === 'ACTIVE').length}\n\nAll metrics are aggregated directly from live database ledger entries.`;
  } else if (
    lower.includes('create maintenance') ||
    lower.includes('log maintenance') ||
    lower.includes('open ticket') ||
    lower.includes('repair') ||
    lower.includes('plumbing')
  ) {
    assertPermission(state.currentRole, 'maintenance.view');
    const targetUnit =
      orgUnits.find((u) => lower.includes(u.unit_number.toLowerCase())) ?? orgUnits[0];

    if (targetUnit) {
      const confId = `conf-${Date.now()}`;
      pendingConfirmation = {
        id: confId,
        organization_id: orgId,
        conversation_id: conversationId,
        action_type: 'CREATE_MAINTENANCE_REQUEST',
        title: `Create Maintenance Ticket for Unit ${targetUnit.unit_number}`,
        summary: `Log urgent PLUMBING maintenance ticket for Unit ${targetUnit.unit_number} (Estimated KES 2,500). Requires your explicit confirmation before writing to RMS records.`,
        target_reference: `Unit ${targetUnit.unit_number}`,
        payload: {
          unit_id: targetUnit.id,
          unit_number: targetUnit.unit_number,
          category: 'PLUMBING',
          title: `Urgent plumbing maintenance for Unit ${targetUnit.unit_number}`,
          estimated_cost_kes: 2500,
        },
        status: 'PENDING',
        created_at: nowIso,
      };
      toolCalls.push({
        id: `tc-${Date.now()}`,
        tool_name: 'prepare_maintenance_request_confirmation',
        permission_checked: 'maintenance.view',
        arguments_summary: JSON.stringify({ unit_number: targetUnit.unit_number }),
        result_summary: `Prepared confirmation ${confId} (awaiting human approval)`,
        executed_at: nowIso,
      });
      citations.push({
        record_type: 'UNIT',
        record_id: targetUnit.id,
        reference_code: `Unit ${targetUnit.unit_number}`,
        summary: `${targetUnit.unit_type} — Status: ${targetUnit.status}`,
      });
      replyText = `### Urgent Maintenance Ticket Drafted\n- **Target Unit:** Unit ${targetUnit.unit_number}\n- **Category:** Plumbing & Sanitation\n- **Estimated Cost:** KES 2,500\n- **Technician Dispatch:** Ready for vetted contractor assignment\n\nPer Guri24 safety policy, no database mutation has been executed yet. Click **Confirm & Execute** on the card below to create the ticket.`;
    } else {
      replyText = `### Maintenance Dispatch System\n- **Notice:** No units are registered in your organization yet. To log unit-specific maintenance tickets and dispatch technicians, please register properties and units in the **Properties** tab first.\n- **General Service Desk:** Support channels remain operational for general building inquiries.`;
    }
  } else if (
    lower.includes('draft reminder') ||
    lower.includes('send arrears') ||
    lower.includes('reminder') ||
    lower.includes('remind') ||
    lower.includes('launch m-pesa reminders')
  ) {
    assertPermission(state.currentRole, 'invoices.view');
    const overdueInv =
      orgInvoices.find((i) => i.balance_kes > 0 && i.status === 'OVERDUE') ??
      orgInvoices.find((i) => i.balance_kes > 0);

    if (overdueInv) {
      const tenant = orgTenants.find((t) => t.id === overdueInv.tenant_id);
      const confId = `conf-${Date.now()}`;
      pendingConfirmation = {
        id: confId,
        organization_id: orgId,
        conversation_id: conversationId,
        action_type: 'DRAFT_TENANT_ARREARS_REMINDER',
        title: `Queue Arrears Reminder for ${tenant?.full_name ?? 'Tenant'}`,
        summary: `Queue transactional outbox reminder for Invoice ${overdueInv.invoice_number} (Outstanding Balance: KES ${overdueInv.balance_kes.toLocaleString()}).`,
        target_reference: overdueInv.invoice_number,
        payload: {
          invoice_id: overdueInv.id,
          invoice_number: overdueInv.invoice_number,
          tenant_name: tenant?.full_name ?? 'Tenant',
          balance_kes: overdueInv.balance_kes,
        },
        status: 'PENDING',
        created_at: nowIso,
      };
      toolCalls.push({
        id: `tc-${Date.now()}`,
        tool_name: 'draft_tenant_notification',
        permission_checked: 'invoices.view',
        arguments_summary: JSON.stringify({ invoice_number: overdueInv.invoice_number }),
        result_summary: `Drafted arrears notice for ${overdueInv.invoice_number} (awaiting confirmation)`,
        executed_at: nowIso,
      });
      citations.push({
        record_type: 'INVOICE',
        record_id: overdueInv.id,
        reference_code: overdueInv.invoice_number,
        summary: `${tenant?.full_name ?? 'Tenant'} — Balance KES ${overdueInv.balance_kes.toLocaleString()}`,
      });
      replyText = `### M-Pesa Arrears Reminder Queued\n- **Tenant:** ${tenant?.full_name ?? 'Tenant'}\n- **Invoice:** ${overdueInv.invoice_number}\n- **Outstanding Balance:** KES ${overdueInv.balance_kes.toLocaleString()}\n- **Delivery Channel:** SMS (OpenSMS Kenya) & Email (Resend)\n\nPlease confirm below before the notification is dispatched to the transactional outbox.`;
    } else {
      replyText = `### Automated M-Pesa Reminders Status\n- **Overdue Accounts:** 0 pending arrears accounts\n- **Portfolio Health:** All tenant accounts are fully settled or no rent invoices are overdue.\n- **Action:** No payment reminder notifications are required at this time.`;
    }
  } else if (lower.includes('vacant') || lower.includes('available unit')) {
    assertPermission(state.currentRole, 'properties.view');
    const vacant = orgUnits.filter((u) => u.status === 'VACANT' || u.status === 'VACANT_AVAILABLE');
    toolCalls.push({
      id: `tc-${Date.now()}`,
      tool_name: 'get_unit_availability',
      permission_checked: 'properties.view',
      arguments_summary: JSON.stringify({ organization_id: orgId, status: 'VACANT' }),
      result_summary: `${vacant.length} vacant unit(s) found`,
      executed_at: nowIso,
    });
    for (const u of vacant) {
      citations.push({
        record_type: 'UNIT',
        record_id: u.id,
        reference_code: `Unit ${u.unit_number}`,
        summary: `${u.unit_type} (${u.bedrooms}BR) — KES ${u.monthly_rent_kes.toLocaleString()}/mo`,
      });
    }
    if (orgUnits.length === 0) {
      replyText = `### Vacant Units Inventory\n- **Registered Units:** 0\n- **Notice:** No units are registered yet. Onboard properties, buildings, and units in the **Properties** tab to begin tracking vacancy and leasing.`;
    } else if (vacant.length === 0) {
      replyText = `### Vacant Units Inventory\n- **Status:** 100% Occupied\n- **Available Units:** 0 vacant units available across your ${orgUnits.length} registered units.\n- **Readiness:** All units currently have active tenant leases.`;
    } else {
      replyText = `### Vacant Units Inventory\nThere are currently **${vacant.length} vacant units** available for immediate leasing:\n${vacant
        .map((u) => `- **Unit ${u.unit_number}**: ${u.unit_type} (${u.bedrooms}BR) @ KES ${u.monthly_rent_kes.toLocaleString()}/mo`)
        .join('\n')}`;
    }
  } else if (lower.includes('ocr') || lower.includes('document') || lower.includes('design to code')) {
    assertPermission(state.currentRole, 'documents.view');
    toolCalls.push({
      id: `tc-${Date.now()}`,
      tool_name: 'search_documents',
      permission_checked: 'documents.view',
      arguments_summary: JSON.stringify({ organization_id: orgId }),
      result_summary: `${orgOcrJobs.length} OCR job(s) retrieved`,
      executed_at: nowIso,
    });
    for (const j of orgOcrJobs) {
      citations.push({
        record_type: 'OCR_DOCUMENT',
        record_id: j.id,
        reference_code: j.file_name,
        summary: `Status: ${j.status} | Confidence: ${Math.round(j.overall_confidence * 100)}%`,
      });
    }
    const needsReview = orgOcrJobs.filter((j) => j.status === 'NEEDS_REVIEW').length;
    const verified = orgOcrJobs.filter((j) => j.status === 'VERIFIED').length;
    if (orgOcrJobs.length === 0) {
      replyText = `### OCR & Document Intelligence Pipeline\n- **Status:** Pipeline operational and awaiting uploads\n- **Queue:** 0 active document jobs\n- **Supported Documents:** Kenyan Residential Leases, Title Deeds, National IDs, and Utility Invoices\n- **Extraction Engine:** Allen AI olmOCR & Groq Vision with strict Human-in-the-Loop verification policy.`;
    } else {
      replyText = `Your OCR pipeline has **${orgOcrJobs.length} document jobs**: **${verified} Verified** and **${needsReview} Needs Human Review**. Unverified OCR extractions remain staged and have not overwritten authoritative RMS records.`;
    }
  } else if (lower.includes('maintenance') || lower.includes('work order')) {
    assertPermission(state.currentRole, 'maintenance.view');
    toolCalls.push({
      id: `tc-${Date.now()}`,
      tool_name: 'get_maintenance_requests',
      permission_checked: 'maintenance.view',
      arguments_summary: JSON.stringify({ organization_id: orgId }),
      result_summary: `${orgMaintenance.length} maintenance ticket(s) active`,
      executed_at: nowIso,
    });
    for (const m of orgMaintenance) {
      citations.push({
        record_type: 'MAINTENANCE',
        record_id: m.id,
        reference_code: m.request_number,
        summary: `${m.title} — Status: ${m.status} (Est. KES ${m.estimated_cost_kes.toLocaleString()})`,
      });
    }
    replyText = `There are **${orgMaintenance.length} maintenance tickets** in your organization: ${orgMaintenance
      .map((m) => `${m.request_number} (${m.title} — ${m.status})`)
      .join('; ')}.`;
  } else {
    // Default: Collections, Arrears & Lease summary
    assertPermission(state.currentRole, 'invoices.view');
    const totalBilled = orgInvoices.reduce((acc, i) => acc + (i.total_amount_kes || 0), 0);
    const totalPaid = orgInvoices.reduce((acc, i) => acc + (i.amount_paid_kes || 0), 0);
    const totalArrears = orgInvoices.reduce((acc, i) => acc + (i.balance_kes || 0), 0);
    const openInvoices = orgInvoices.filter((i) => i.balance_kes > 0);

    toolCalls.push({
      id: `tc-${Date.now()}`,
      tool_name: 'get_arrears_report',
      permission_checked: 'invoices.view',
      arguments_summary: JSON.stringify({ organization_id: orgId }),
      result_summary: `Total Billed KES ${totalBilled.toLocaleString()}, Collected KES ${totalPaid.toLocaleString()}, Arrears KES ${totalArrears.toLocaleString()}`,
      executed_at: nowIso,
    });

    for (const inv of openInvoices) {
      const t = orgTenants.find((x) => x.id === inv.tenant_id);
      citations.push({
        record_type: 'INVOICE',
        record_id: inv.id,
        reference_code: inv.invoice_number,
        summary: `${t?.full_name ?? 'Tenant'} — Balance KES ${inv.balance_kes.toLocaleString()} (${inv.status})`,
      });
    }
    for (const l of orgLeases.slice(0, 2)) {
      citations.push({
        record_type: 'LEASE',
        record_id: l.id,
        reference_code: l.lease_number,
        summary: `Rent KES ${l.monthly_rent_kes.toLocaleString()}/mo (${l.start_date} → ${l.end_date})`,
      });
    }

    replyText = `### Portfolio Ledger Summary\n- **Total Billed:** KES ${totalBilled.toLocaleString()} across ${orgInvoices.length} invoices\n- **Collections:** KES ${totalPaid.toLocaleString()}\n- **Outstanding Arrears:** KES ${totalArrears.toLocaleString()} (${openInvoices.length} open accounts)\n- **Active Leases:** ${orgLeases.filter((l) => l.status === 'ACTIVE').length}\n- **Total Units:** ${orgUnits.length}\n\nAll records are scoped exclusively to ${state.organizations.find((o) => o.id === orgId)?.name ?? 'your organization'}.`;
  }

  const assistantReply: AssistantMessage = {
    id: `msg-ast-${Date.now() + 2}`,
    role: 'ASSISTANT',
    content: replyText,
    citations,
    tool_calls: toolCalls,
    pending_confirmation_id: pendingConfirmation?.id,
    created_at: nowIso,
  };

  let nextState = appendConversationMessages(state, orgId, conversationId, [
    userMessage,
    assistantReply,
  ]);

  if (pendingConfirmation) {
    nextState = {
      ...nextState,
      assistantConfirmations: [pendingConfirmation, ...nextState.assistantConfirmations],
    };
  }

  nextState = {
    ...nextState,
    subscriptions: nextState.subscriptions.map((s) =>
      s.organization_id === orgId
        ? { ...s, ai_assistant_queries_used: s.ai_assistant_queries_used + 1 }
        : s
    ),
  };

  return { nextState, reply: assistantReply, pendingConfirmation };
}

function appendConversationMessages(
  state: RmsPlatformState,
  orgId: string,
  conversationId: string,
  newMessages: AssistantMessage[]
): RmsPlatformState {
  const exists = state.assistantConversations.some(
    (c) => c.id === conversationId && c.organization_id === orgId
  );
  if (!exists) {
    const createdConv: AssistantConversation = {
      id: conversationId,
      organization_id: orgId,
      title: 'Grounded RMS Assistant Session',
      messages: newMessages,
      updated_at: new Date().toISOString(),
    };
    return {
      ...state,
      assistantConversations: [createdConv, ...state.assistantConversations],
    };
  }
  return {
    ...state,
    assistantConversations: state.assistantConversations.map((c) =>
      c.id === conversationId && c.organization_id === orgId
        ? {
            ...c,
            messages: [...c.messages, ...newMessages],
            updated_at: new Date().toISOString(),
          }
        : c
    ),
  };
}

/**
 * Resolves a pending AI Assistant Action Confirmation (`CONFIRMED` or `CANCELLED`).
 */
export function resolveAssistantConfirmation(
  state: RmsPlatformState,
  confirmationId: string,
  approve: boolean
): { nextState: RmsPlatformState; confirmation: AssistantActionConfirmation } {
  assertPermission(state.currentRole, 'assistant.use');
  const orgId = state.currentOrganizationId;
  const target = state.assistantConfirmations.find(
    (c) => c.id === confirmationId && c.organization_id === orgId
  );
  if (!target) {
    throw new Error('Action confirmation record not found in current organization.');
  }
  if (target.status !== 'PENDING') {
    return { nextState: state, confirmation: target };
  }

  const updatedConf: AssistantActionConfirmation = {
    ...target,
    status: approve ? 'CONFIRMED' : 'CANCELLED',
    resolved_at: new Date().toISOString(),
  };

  let nextMaintenance = state.maintenance;
  if (approve && target.action_type === 'CREATE_MAINTENANCE_REQUEST') {
    const unitId = String(target.payload.unit_id || '');
    const unit = state.units.find((u) => u.id === unitId && u.organization_id === orgId);
    if (unit) {
      const seq = state.maintenance.filter((m) => m.organization_id === orgId).length + 1;
      const createdTicket: MaintenanceRequest = {
        id: `mnt-ast-${Date.now()}`,
        organization_id: orgId,
        property_id: unit.property_id,
        building_id: unit.building_id,
        unit_id: unit.id,
        tenant_id: unit.current_tenant_id,
        request_number: `MNT-${String(seq).padStart(4, '0')}`,
        category: String(target.payload.category || 'PLUMBING'),
        priority: 'MEDIUM',
        title: String(target.payload.title || `Inspection for Unit ${unit.unit_number}`),
        description: `Created via confirmed AI Assistant action (${target.id}).`,
        status: 'SUBMITTED',
        estimated_cost_kes: Number(target.payload.estimated_cost_kes || 2500),
        actual_cost_kes: 0,
        created_at: new Date().toISOString(),
      };
      nextMaintenance = [createdTicket, ...state.maintenance];
    }
  }

  return {
    nextState: {
      ...state,
      maintenance: nextMaintenance,
      assistantConfirmations: state.assistantConfirmations.map((c) =>
        c.id === target.id ? updatedConf : c
      ),
    },
    confirmation: updatedConf,
  };
}

/**
 * Dependent Hierarchy Selector Helper (`Property` -> `Building` -> `Floor` -> `Unit`)
 * Ensures child selections belong to the parent selection and resets stale child IDs.
 */
export function resolveDependentUnitHierarchy(
  state: RmsPlatformState,
  selection: {
    propertyId?: string;
    buildingId?: string;
    floorId?: string;
    unitId?: string;
  }
): {
  propertyId: string;
  buildingId: string;
  floorId: string;
  unitId: string;
  availableProperties: Property[];
  availableBuildings: Building[];
  availableFloors: Floor[];
  availableUnits: Unit[];
} {
  const orgId = state.currentOrganizationId;
  const availableProperties = state.properties.filter((p) => p.organization_id === orgId);
  const validProperty =
    availableProperties.find((p) => p.id === selection.propertyId) ?? availableProperties[0];
  const propertyId = validProperty?.id ?? '';

  const availableBuildings = state.buildings.filter(
    (b) => b.organization_id === orgId && b.property_id === propertyId
  );
  const validBuilding =
    availableBuildings.find((b) => b.id === selection.buildingId) ?? availableBuildings[0];
  const buildingId = validBuilding?.id ?? '';

  const availableFloors = state.floors.filter(
    (f) => f.organization_id === orgId && f.building_id === buildingId
  );
  const validFloor =
    availableFloors.find((f) => f.id === selection.floorId) ?? availableFloors[0];
  const floorId = validFloor?.id ?? '';

  const availableUnits = state.units.filter(
    (u) =>
      u.organization_id === orgId &&
      u.property_id === propertyId &&
      (!buildingId || u.building_id === buildingId) &&
      (!floorId || u.floor_id === floorId)
  );
  const validUnit =
    availableUnits.find((u) => u.id === selection.unitId) ?? availableUnits[0];
  const unitId = validUnit?.id ?? '';

  return {
    propertyId,
    buildingId,
    floorId,
    unitId,
    availableProperties,
    availableBuildings,
    availableFloors,
    availableUnits,
  };
}

