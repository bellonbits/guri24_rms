import {
  Building,
  DocumentItem,
  Floor,
  Invoice,
  JournalEntry,
  JournalLine,
  Lease,
  MaintenanceRequest,
  MaintenanceStatus,
  Organization,
  Payment,
  PaymentAllocation,
  Property,
  PropertyExpense,
  SecurityDepositRecord,
  SystemRole,
  Tenant,
  TenantApplication,
  Unit,
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
    'reports.export',
  ],
  RECEPTIONIST: [
    'properties.view',
    'tenants.view',
    'tenants.create',
    'leases.view',
    'leases.create',
    'maintenance.view',
  ],
  MAINTENANCE_OFFICER: ['properties.view', 'maintenance.view', 'maintenance.assign'],
  VENDOR: ['properties.view', 'maintenance.view', 'maintenance.assign'],
  TENANT: [
    'leases.view',
    'invoices.view',
    'payments.view',
    'maintenance.view',
    'documents.view',
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
}

export function createInitialRmsState(): RmsPlatformState {
  const org1Id = 'org-kilimani-crest-001';
  const org2Id = 'org-nyali-palms-002';

  const prop1Id = 'prop-kil-jacaranda';
  const prop2Id = 'prop-westlands-grove';
  const propOrg2Id = 'prop-nyali-breeze';

  const bld1Id = 'bld-acacia-a';
  const bld2Id = 'bld-baobab-b';

  const flr1Id = 'flr-a-1';
  const flr2Id = 'flr-a-2';
  const flrB1Id = 'flr-b-1';

  const unitA101Id = 'unit-a-101';
  const unitA102Id = 'unit-a-102';
  const unitA201Id = 'unit-a-201';
  const unitB101Id = 'unit-b-101';
  const unitOrg2Id = 'unit-nyali-g01';

  const tenant1Id = 'tnt-wanjiku-001';
  const tenant2Id = 'tnt-otieno-002';
  const tenant3Id = 'tnt-amina-003';

  const lease1Id = 'lse-2026-0001';
  const lease2Id = 'lse-2026-0002';

  const inv1Id = 'inv-202610-0001';
  const inv2Id = 'inv-202611-0002';
  const inv3Id = 'inv-202611-0003';

  const pay1Id = 'pay-mpesa-0001';

  return {
    currentOrganizationId: org1Id,
    currentRole: 'ORGANIZATION_ADMINISTRATOR',
    organizations: [
      {
        id: org1Id,
        name: 'Kilimani Crest Property Management Ltd',
        slug: 'kilimani-crest-ke',
        organization_type: 'PROPERTY_MANAGEMENT_COMPANY',
        kra_pin: 'P051892341K',
        contact_email: 'operations@kilimanicrest.co.ke',
        contact_phone: '254712345678',
        county: 'Nairobi',
        currency: 'KES',
        timezone: 'Africa/Nairobi',
        mpesa_paybill_shortcode: '4098123',
        late_fee_percentage: 5,
        late_fee_grace_days: 5,
        rent_calculation_strategy: 'FIXED_MONTHLY',
        payment_allocation_strategy: 'FIFO_OLDEST_FIRST',
      },
      {
        id: org2Id,
        name: 'Nyali Oceanfront Estates Ltd',
        slug: 'nyali-oceanfront-ke',
        organization_type: 'REAL_ESTATE_OWNER',
        kra_pin: 'P051441122M',
        contact_email: 'finance@nyalioceanfront.co.ke',
        contact_phone: '254722998877',
        county: 'Mombasa',
        currency: 'KES',
        timezone: 'Africa/Nairobi',
        mpesa_paybill_shortcode: '522522',
        late_fee_percentage: 5,
        late_fee_grace_days: 7,
        rent_calculation_strategy: 'FIXED_MONTHLY',
        payment_allocation_strategy: 'FIFO_OLDEST_FIRST',
      },
    ],
    properties: [
      {
        id: prop1Id,
        organization_id: org1Id,
        code: 'KIL-01',
        name: 'Jacaranda Heights Apartments',
        county: 'Nairobi',
        estate_or_area: 'Kilimani',
        physical_address: 'Argwings Kodhek Rd, Plot LR 209/11421',
        lr_number: 'LR 209/11421',
        management_commission_pct: 7.5,
        amenities: ['Borehole Water', 'Backup Generator', 'CCTV & Biometric Gate', 'Solar Water Heating'],
      },
      {
        id: prop2Id,
        organization_id: org1Id,
        code: 'WST-02',
        name: 'Westlands Brookside Court',
        county: 'Nairobi',
        estate_or_area: 'Westlands',
        physical_address: 'Brookside Drive, Off Lower Kabete Rd',
        lr_number: 'LR 1870/IV/98',
        management_commission_pct: 8.0,
        amenities: ['High-Speed Lift', 'Borehole Water', 'Basement Parking'],
      },
      {
        id: propOrg2Id,
        organization_id: org2Id,
        code: 'NYL-01',
        name: 'Nyali Breeze Residences',
        county: 'Mombasa',
        estate_or_area: 'Nyali',
        physical_address: 'Links Road, Nyali',
        lr_number: 'MN/I/4412',
        management_commission_pct: 10.0,
        amenities: ['Swimming Pool', 'Desalination Plant', '24/7 Guard Patrol'],
      },
    ],
    buildings: [
      {
        id: bld1Id,
        organization_id: org1Id,
        property_id: prop1Id,
        code: 'BLK-A',
        name: 'Block A — Acacia Wing',
        total_floors: 5,
      },
      {
        id: bld2Id,
        organization_id: org1Id,
        property_id: prop2Id,
        code: 'BLK-B',
        name: 'Block B — Brookside Tower',
        total_floors: 6,
      },
    ],
    floors: [
      {
        id: flr1Id,
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        floor_number: 1,
        label: '1st Floor',
      },
      {
        id: flr2Id,
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        floor_number: 2,
        label: '2nd Floor',
      },
      {
        id: flrB1Id,
        organization_id: org1Id,
        property_id: prop2Id,
        building_id: bld2Id,
        floor_number: 1,
        label: '1st Floor',
      },
    ],
    units: [
      {
        id: unitA101Id,
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        floor_id: flr1Id,
        unit_number: 'A-101',
        unit_type: 'TWO_BEDROOM',
        bedrooms: 2,
        bathrooms: 2,
        monthly_rent_kes: 15000,
        deposit_amount_kes: 15000,
        status: 'OCCUPIED',
        water_meter_number: 'NCWSC-88101',
        kplc_meter_number: 'KPLC-142091101',
        current_tenant_id: tenant1Id,
        current_lease_id: lease1Id,
      },
      {
        id: unitA102Id,
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        floor_id: flr1Id,
        unit_number: 'A-102',
        unit_type: 'TWO_BEDROOM',
        bedrooms: 2,
        bathrooms: 2,
        monthly_rent_kes: 18000,
        deposit_amount_kes: 18000,
        status: 'OCCUPIED',
        water_meter_number: 'NCWSC-88102',
        kplc_meter_number: 'KPLC-142091102',
        current_tenant_id: tenant2Id,
        current_lease_id: lease2Id,
      },
      {
        id: unitA201Id,
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        floor_id: flr2Id,
        unit_number: 'A-201',
        unit_type: 'THREE_BEDROOM',
        bedrooms: 3,
        bathrooms: 3,
        monthly_rent_kes: 35000,
        deposit_amount_kes: 35000,
        status: 'VACANT',
        water_meter_number: 'NCWSC-88201',
        kplc_meter_number: 'KPLC-142091201',
      },
      {
        id: unitB101Id,
        organization_id: org1Id,
        property_id: prop2Id,
        building_id: bld2Id,
        floor_id: flrB1Id,
        unit_number: 'B-101',
        unit_type: 'ONE_BEDROOM',
        bedrooms: 1,
        bathrooms: 1,
        monthly_rent_kes: 22000,
        deposit_amount_kes: 22000,
        status: 'VACANT',
        water_meter_number: 'NCWSC-99101',
        kplc_meter_number: 'KPLC-142099101',
      },
      {
        id: unitOrg2Id,
        organization_id: org2Id,
        property_id: propOrg2Id,
        building_id: 'bld-nyali-1',
        floor_id: 'flr-nyali-1',
        unit_number: 'NYL-G01',
        unit_type: 'THREE_BEDROOM',
        bedrooms: 3,
        bathrooms: 3,
        monthly_rent_kes: 55000,
        deposit_amount_kes: 55000,
        status: 'VACANT',
        water_meter_number: 'MOWASCO-101',
        kplc_meter_number: 'KPLC-8810101',
      },
    ],
    tenants: [
      {
        id: tenant1Id,
        organization_id: org1Id,
        tenant_code: 'TNT-0001',
        full_name: 'Wanjiku Mwangi',
        phone: '254722111222',
        email: 'wanjiku.mwangi@example.co.ke',
        national_id_masked: '****5678',
        emergency_contact_name: 'Kamau Mwangi',
        emergency_contact_phone: '254733111222',
        status: 'ACTIVE',
      },
      {
        id: tenant2Id,
        organization_id: org1Id,
        tenant_code: 'TNT-0002',
        full_name: 'Brian Otieno Odhiambo',
        phone: '254711445566',
        email: 'brian.otieno@example.co.ke',
        national_id_masked: '****9012',
        emergency_contact_name: 'Grace Akinyi',
        emergency_contact_phone: '254720445566',
        status: 'ACTIVE',
      },
      {
        id: tenant3Id,
        organization_id: org1Id,
        tenant_code: 'TNT-0003',
        full_name: 'Amina Hassan Noor',
        phone: '254700889900',
        email: 'amina.hassan@example.co.ke',
        national_id_masked: '****3344',
        emergency_contact_name: 'Farah Noor',
        emergency_contact_phone: '254721889900',
        status: 'PROSPECT',
      },
    ],
    applications: [
      {
        id: 'app-2026-01',
        organization_id: org1Id,
        property_id: prop1Id,
        unit_id: unitA201Id,
        tenant_id: tenant3Id,
        proposed_move_in_date: '2026-12-01',
        monthly_income_kes: 145000,
        status: 'APPROVED',
      },
    ],
    leases: [
      {
        id: lease1Id,
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        unit_id: unitA101Id,
        primary_tenant_id: tenant1Id,
        lease_number: 'LSE-0001',
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        billing_day: 5,
        monthly_rent_kes: 15000,
        security_deposit_kes: 15000,
        service_charge_kes: 0,
        garbage_fee_kes: 0,
        status: 'ACTIVE',
        payment_account_reference: 'RENT-A-101',
      },
      {
        id: lease2Id,
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        unit_id: unitA102Id,
        primary_tenant_id: tenant2Id,
        lease_number: 'LSE-0002',
        start_date: '2026-02-01',
        end_date: '2027-01-31',
        billing_day: 5,
        monthly_rent_kes: 18000,
        security_deposit_kes: 18000,
        service_charge_kes: 1500,
        garbage_fee_kes: 500,
        status: 'ACTIVE',
        payment_account_reference: 'RENT-A-102',
      },
    ],
    invoices: [
      {
        id: inv1Id,
        organization_id: org1Id,
        property_id: prop1Id,
        unit_id: unitA101Id,
        lease_id: lease1Id,
        tenant_id: tenant1Id,
        invoice_number: 'INV-202611-0001',
        billing_period: '2026-11',
        issue_date: '2026-11-01',
        due_date: '2026-11-05',
        rent_amount_kes: 15000,
        charges_amount_kes: 0,
        penalty_kes: 0,
        total_amount_kes: 15000,
        amount_paid_kes: 10000,
        balance_kes: 5000,
        status: 'PARTIALLY_PAID',
        idempotency_key: `INV:${org1Id}:${lease1Id}:2026-11`,
      },
      {
        id: inv2Id,
        organization_id: org1Id,
        property_id: prop1Id,
        unit_id: unitA102Id,
        lease_id: lease2Id,
        tenant_id: tenant2Id,
        invoice_number: 'INV-202610-0002',
        billing_period: '2026-10',
        issue_date: '2026-10-01',
        due_date: '2026-10-05',
        rent_amount_kes: 18000,
        charges_amount_kes: 2000,
        penalty_kes: 0,
        total_amount_kes: 20000,
        amount_paid_kes: 0,
        balance_kes: 20000,
        status: 'OVERDUE',
        idempotency_key: `INV:${org1Id}:${lease2Id}:2026-10`,
      },
      {
        id: inv3Id,
        organization_id: org1Id,
        property_id: prop1Id,
        unit_id: unitA102Id,
        lease_id: lease2Id,
        tenant_id: tenant2Id,
        invoice_number: 'INV-202611-0003',
        billing_period: '2026-11',
        issue_date: '2026-11-01',
        due_date: '2026-11-05',
        rent_amount_kes: 18000,
        charges_amount_kes: 2000,
        penalty_kes: 0,
        total_amount_kes: 20000,
        amount_paid_kes: 0,
        balance_kes: 20000,
        status: 'ISSUED',
        idempotency_key: `INV:${org1Id}:${lease2Id}:2026-11`,
      },
    ],
    payments: [
      {
        id: pay1Id,
        organization_id: org1Id,
        tenant_id: tenant1Id,
        lease_id: lease1Id,
        payment_reference: 'PAY-00001',
        idempotency_key: 'MPESA-INIT-0001',
        checkout_request_id: 'ws_CO_174379_A101_01',
        mpesa_receipt_number: 'SJK8912WQM',
        payer_phone: '254722111222',
        amount_kes: 10000,
        allocated_amount_kes: 10000,
        unallocated_amount_kes: 0,
        status: 'COMPLETED',
        allocations: [
          {
            id: 'alloc-0001',
            invoice_id: inv1Id,
            invoice_number: 'INV-202611-0001',
            allocated_amount_kes: 10000,
            remaining_invoice_balance_kes: 5000,
          },
        ],
        receipt_number: 'RCT-SJK8912WQM',
        paid_at: '2026-11-04T09:15:00Z',
      },
    ],
    deposits: [
      {
        id: 'dep-0001',
        organization_id: org1Id,
        lease_id: lease1Id,
        tenant_id: tenant1Id,
        unit_id: unitA101Id,
        required_amount_kes: 15000,
        received_amount_kes: 15000,
        deducted_amount_kes: 0,
        refunded_amount_kes: 0,
        current_liability_balance_kes: 15000,
        status: 'HELD',
      },
      {
        id: 'dep-0002',
        organization_id: org1Id,
        lease_id: lease2Id,
        tenant_id: tenant2Id,
        unit_id: unitA102Id,
        required_amount_kes: 18000,
        received_amount_kes: 18000,
        deducted_amount_kes: 0,
        refunded_amount_kes: 0,
        current_liability_balance_kes: 18000,
        status: 'HELD',
      },
    ],
    journals: [
      {
        id: 'jrn-0001',
        organization_id: org1Id,
        entry_number: 'JRN-00001',
        entry_date: '2026-11-01',
        source_event_type: 'INVOICE_ISSUED',
        description: 'Invoice INV-202611-0001 issued for Unit A-101 (Wanjiku Mwangi)',
        status: 'POSTED',
        total_debit_kes: 15000,
        total_credit_kes: 15000,
        lines: [
          {
            account_code: '1100',
            account_name: 'Accounts Receivable - Tenants',
            account_type: 'ASSET',
            debit_kes: 15000,
            credit_kes: 0,
            memo: 'Receivable for INV-202611-0001',
          },
          {
            account_code: '4000',
            account_name: 'Residential Rental Revenue',
            account_type: 'REVENUE',
            debit_kes: 0,
            credit_kes: 15000,
            memo: 'Monthly rent revenue 2026-11',
          },
        ],
      },
      {
        id: 'jrn-0002',
        organization_id: org1Id,
        entry_number: 'JRN-00002',
        entry_date: '2026-11-04',
        source_event_type: 'PAYMENT_RECEIVED',
        description: 'M-Pesa payment PAY-00001 (SJK8912WQM) partial collection against INV-202611-0001',
        status: 'POSTED',
        total_debit_kes: 10000,
        total_credit_kes: 10000,
        lines: [
          {
            account_code: '1010',
            account_name: 'M-Pesa & Bank Clearing Account',
            account_type: 'ASSET',
            debit_kes: 10000,
            credit_kes: 0,
            memo: 'M-Pesa Receipt SJK8912WQM',
          },
          {
            account_code: '1100',
            account_name: 'Accounts Receivable - Tenants',
            account_type: 'ASSET',
            debit_kes: 0,
            credit_kes: 10000,
            memo: 'Partial settlement of INV-202611-0001 (Remaining: KES 5,000)',
          },
        ],
      },
      {
        id: 'jrn-0003',
        organization_id: org1Id,
        entry_number: 'JRN-00003',
        entry_date: '2026-01-02',
        source_event_type: 'DEPOSIT_RECEIVED',
        description: 'Security deposit held for Lease LSE-0001 & LSE-0002 (Recorded as Liability, NOT Revenue)',
        status: 'POSTED',
        total_debit_kes: 33000,
        total_credit_kes: 33000,
        lines: [
          {
            account_code: '1010',
            account_name: 'M-Pesa & Bank Clearing Account',
            account_type: 'ASSET',
            debit_kes: 33000,
            credit_kes: 0,
            memo: 'Security deposits collected',
          },
          {
            account_code: '2100',
            account_name: 'Tenant Security Deposits Held (Liability)',
            account_type: 'LIABILITY',
            debit_kes: 0,
            credit_kes: 33000,
            memo: 'Refundable liability held on behalf of tenants',
          },
        ],
      },
    ],
    expenses: [
      {
        id: 'exp-0001',
        organization_id: org1Id,
        property_id: prop1Id,
        expense_number: 'EXP-0001',
        category: 'MAINTENANCE',
        vendor_name: 'Nairobi Rapid Plumbers Ltd',
        description: 'Borehole booster pump pressure valve replacement',
        amount_kes: 4500,
        expense_date: '2026-11-08',
        journal_entry_id: 'jrn-0004',
      },
    ],
    maintenance: [
      {
        id: 'mnt-0001',
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        unit_id: unitA101Id,
        tenant_id: tenant1Id,
        request_number: 'MNT-0001',
        category: 'PLUMBING',
        priority: 'HIGH',
        title: 'Kitchen mixer tap pressure drop',
        description: 'Hot water line from solar heater has low flow in Unit A-101 kitchen.',
        status: 'ASSIGNED',
        assigned_vendor: 'Nairobi Rapid Plumbers Ltd',
        work_order_number: 'WO-0001',
        estimated_cost_kes: 2500,
        actual_cost_kes: 0,
        created_at: '2026-11-10T08:30:00Z',
      },
      {
        id: 'mnt-0002',
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        unit_id: unitA102Id,
        tenant_id: tenant2Id,
        request_number: 'MNT-0002',
        category: 'ELECTRICAL',
        priority: 'MEDIUM',
        title: 'Balcony security light sensor replacement',
        description: 'Day/night photocell switch on Unit A-102 balcony needs replacement.',
        status: 'SUBMITTED',
        estimated_cost_kes: 1800,
        actual_cost_kes: 0,
        created_at: '2026-11-12T14:20:00Z',
      },
    ],
    documents: [
      {
        id: 'doc-0001',
        organization_id: org1Id,
        category: 'LEASE_AGREEMENT',
        entity_label: 'Lease LSE-0001 (Unit A-101 — Wanjiku Mwangi)',
        file_name: 'executed_lease_LSE_0001_A101.pdf',
        mime_type: 'application/pdf',
        file_size_kb: 412,
        s3_object_key: `private/org/${org1Id}/lease_agreement/executed_lease_LSE_0001_A101.pdf`,
        created_at: '2026-01-01T10:00:00Z',
      },
      {
        id: 'doc-0002',
        organization_id: org1Id,
        category: 'RECEIPT',
        entity_label: 'M-Pesa Receipt RCT-SJK8912WQM (KES 10,000)',
        file_name: 'receipt_RCT_SJK8912WQM.pdf',
        mime_type: 'application/pdf',
        file_size_kb: 128,
        s3_object_key: `private/org/${org1Id}/receipt/receipt_RCT_SJK8912WQM.pdf`,
        created_at: '2026-11-04T09:15:05Z',
      },
    ],
  };
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
  if (input.monthlyRentKes <= 0) {
    throw new Error('Monthly rent must be greater than KES 0.');
  }
  if (input.leaseEndDate <= input.leaseStartDate) {
    throw new Error('Lease end date must be after lease start date.');
  }

  const orgId = state.currentOrganizationId;
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();

  const property: Property = {
    id: `prop-${suffix}`,
    organization_id: orgId,
    code: input.propertyCode.trim().toUpperCase(),
    name: input.propertyName.trim(),
    county: input.county.trim(),
    estate_or_area: input.estate.trim(),
    physical_address: input.address.trim(),
    lr_number: `LR 209/${Math.floor(10000 + Math.random() * 89999)}`,
    management_commission_pct: 7.5,
    amenities: ['Borehole Water', '24/7 Security'],
  };

  const building: Building = {
    id: `bld-${suffix}`,
    organization_id: orgId,
    property_id: property.id,
    code: input.buildingCode.trim().toUpperCase(),
    name: input.buildingName.trim(),
    total_floors: Math.max(1, input.floorNumber),
  };

  const floor: Floor = {
    id: `flr-${suffix}`,
    organization_id: orgId,
    property_id: property.id,
    building_id: building.id,
    floor_number: input.floorNumber,
    label: input.floorLabel.trim(),
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
    water_meter_number: `NCWSC-${suffix}`,
    kplc_meter_number: `KPLC-${suffix}`,
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
