import {
  AssistantActionConfirmation,
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
    ocrJobs: [
      {
        id: 'ocr-job-0001',
        organization_id: org1Id,
        document_id: 'doc-0001',
        file_name: 'executed_lease_LSE_0001_A101.pdf',
        mime_type: 'application/pdf',
        file_size_kb: 412,
        page_count: 3,
        document_category: 'LEASE_AGREEMENT',
        provider_name: 'ConfigurableOcrProviderAdapter (Local Structured Parser)',
        status: 'NEEDS_REVIEW',
        raw_extracted_text:
          'RESIDENTIAL LEASE AGREEMENT — Property: Jacaranda Heights Apartments | Unit: A-101 | Tenant: Wanjiku Mwangi | Phone: 0722111222 | Monthly Rent: KES 15,000.00 | Security Deposit: KES 15,000.00 | Lease Start: 2026-01-01 | Lease End: 2026-12-31 | Due Day: 5',
        overall_confidence: 0.94,
        fields: [
          {
            id: 'fld-lse-1',
            field_name: 'tenant_name',
            field_label: 'Tenant Name',
            extracted_value: 'Wanjiku Mwangi',
            normalized_value: 'Wanjiku Mwangi',
            confidence: 0.97,
            page_number: 1,
            bounding_box: { page: 1, x: 0.12, y: 0.18, width: 0.34, height: 0.04 },
            validation_errors: [],
            human_verified: false,
          },
          {
            id: 'fld-lse-2',
            field_name: 'unit_number',
            field_label: 'Unit Number',
            extracted_value: 'A-101',
            normalized_value: 'A-101',
            confidence: 0.96,
            page_number: 1,
            bounding_box: { page: 1, x: 0.52, y: 0.18, width: 0.14, height: 0.04 },
            validation_errors: [],
            human_verified: false,
          },
          {
            id: 'fld-lse-3',
            field_name: 'monthly_rent_kes',
            field_label: 'Monthly Rent (KES)',
            extracted_value: 'KES 15,000.00',
            normalized_value: '15000.00',
            confidence: 0.95,
            page_number: 1,
            bounding_box: { page: 1, x: 0.12, y: 0.28, width: 0.25, height: 0.04 },
            validation_errors: [],
            human_verified: false,
          },
          {
            id: 'fld-lse-4',
            field_name: 'deposit_amount_kes',
            field_label: 'Security Deposit (KES)',
            extracted_value: 'KES 15,000.00',
            normalized_value: '15000.00',
            confidence: 0.92,
            page_number: 1,
            bounding_box: { page: 1, x: 0.45, y: 0.28, width: 0.25, height: 0.04 },
            validation_errors: [],
            human_verified: false,
          },
          {
            id: 'fld-lse-5',
            field_name: 'lease_period',
            field_label: 'Lease Start → End Date',
            extracted_value: '2026-01-01 to 2026-12-31',
            normalized_value: '2026-01-01/2026-12-31',
            confidence: 0.91,
            page_number: 2,
            bounding_box: { page: 2, x: 0.12, y: 0.42, width: 0.45, height: 0.04 },
            validation_errors: [],
            human_verified: false,
          },
        ],
        authoritative_record_applied: false,
        linked_entity_label: 'Lease LSE-0001 (Unit A-101)',
        created_at: '2026-11-10T11:20:00Z',
        completed_at: '2026-11-10T11:20:04Z',
      },
      {
        id: 'ocr-job-0002',
        organization_id: org1Id,
        document_id: 'doc-0002',
        file_name: 'national_id_brian_otieno.jpg',
        mime_type: 'image/jpeg',
        file_size_kb: 285,
        page_count: 1,
        document_category: 'TENANT_IDENTIFICATION',
        provider_name: 'ConfigurableOcrProviderAdapter (Local Structured Parser)',
        status: 'VERIFIED',
        raw_extracted_text:
          'REPUBLIC OF KENYA — NATIONAL IDENTITY CARD | Full Names: BRIAN OTIENO ODHIAMBO | ID Number: 29489012 | Date of Birth: 1993-08-14',
        overall_confidence: 0.96,
        fields: [
          {
            id: 'fld-id-1',
            field_name: 'full_name',
            field_label: 'Full Name',
            extracted_value: 'BRIAN OTIENO ODHIAMBO',
            normalized_value: 'Brian Otieno Odhiambo',
            confidence: 0.98,
            page_number: 1,
            bounding_box: { page: 1, x: 0.2, y: 0.3, width: 0.5, height: 0.05 },
            validation_errors: [],
            human_verified: true,
          },
          {
            id: 'fld-id-2',
            field_name: 'id_number',
            field_label: 'Kenyan National ID (Masked)',
            extracted_value: '29489012',
            normalized_value: '****9012',
            confidence: 0.95,
            page_number: 1,
            bounding_box: { page: 1, x: 0.2, y: 0.18, width: 0.3, height: 0.05 },
            validation_errors: [],
            human_verified: true,
          },
        ],
        authoritative_record_applied: true,
        linked_entity_label: 'Tenant TNT-0002 (Brian Otieno Odhiambo)',
        review_audit: {
          id: 'rev-0001',
          job_id: 'ocr-job-0002',
          reviewer_role: 'ORGANIZATION_ADMINISTRATOR',
          decision: 'APPROVED',
          notes: 'Verified against original Kenyan National ID card during move-in.',
          reviewed_at: '2026-11-11T09:05:00Z',
        },
        created_at: '2026-11-11T09:00:00Z',
        completed_at: '2026-11-11T09:00:03Z',
      },
    ],
    assistantConversations: [
      {
        id: 'conv-0001',
        organization_id: org1Id,
        title: 'November Collections, Arrears & Portfolio Operations',
        updated_at: '2026-11-14T10:00:00Z',
        messages: [
          {
            id: 'msg-0001',
            role: 'ASSISTANT',
            content:
              'Jambo! I am your grounded Guri24 RMS AI Assistant for Kilimani Crest Property Management Ltd. Every figure I report is verified against your live tenant-scoped ledger, invoices, leases, units, and OCR documents. Ask me about rent collections, overdue arrears, vacant units, maintenance tickets, or ask me to draft an action with confirmation.',
            citations: [
              {
                record_type: 'INVOICE',
                record_id: inv1Id,
                reference_code: 'INV-202611-0001',
                summary: 'Unit A-101 (Wanjiku Mwangi) — Total KES 15,000, Paid KES 10,000, Balance KES 5,000',
              },
              {
                record_type: 'INVOICE',
                record_id: inv2Id,
                reference_code: 'INV-202610-0002',
                summary: 'Unit A-102 (Brian Otieno) — Overdue Balance KES 20,000',
              },
            ],
            tool_calls: [
              {
                id: 'tc-init-1',
                tool_name: 'get_collection_summary',
                permission_checked: 'invoices.view',
                arguments_summary: '{"organization_id":"org-kilimani-crest-001","period":"2026-11"}',
                result_summary: 'Total Billed: KES 55,000 | Collected: KES 10,000 | Outstanding Arrears: KES 45,000',
                executed_at: '2026-11-14T10:00:00Z',
              },
            ],
            created_at: '2026-11-14T10:00:00Z',
          },
        ],
      },
    ],
    assistantConfirmations: [],
    vendors: [
      {
        id: 'vnd-0001',
        organization_id: org1Id,
        vendor_code: 'VND-0001',
        company_name: 'Nairobi Rapid Plumbers Ltd',
        contact_person: 'Peter Ndegwa',
        phone: '254722778899',
        email: 'service@nairobirapidplumbers.co.ke',
        specialty: 'PLUMBING & SOLAR HEATING',
        kra_pin: 'P051662211R',
        rating: 4.9,
        status: 'ACTIVE',
      },
      {
        id: 'vnd-0002',
        organization_id: org1Id,
        vendor_code: 'VND-0002',
        company_name: 'MetroVolt Electrical Contractors KE',
        contact_person: 'oscah@metrovolt.co.ke',
        phone: '254711223344',
        email: 'dispatch@metrovolt.co.ke',
        specialty: 'ELECTRICAL & BACKUP GENERATORS',
        kra_pin: 'P051990011E',
        rating: 4.8,
        status: 'ACTIVE',
      },
    ],
    inspections: [
      {
        id: 'insp-0001',
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        unit_id: unitA101Id,
        lease_id: lease1Id,
        inspection_number: 'INSP-0001',
        inspection_type: 'MOVE_IN',
        scheduled_at: '2026-01-01T09:00',
        inspector_name: 'Grace Mutua (Property Manager)',
        overall_condition: 'EXCELLENT',
        recommended_deposit_deduction_kes: 0,
        notes: 'All walls freshly painted, NCWSC-88101 water meter reading 114.0 m³.',
        status: 'SIGNED_OFF',
      },
      {
        id: 'insp-0002',
        organization_id: org1Id,
        property_id: prop1Id,
        building_id: bld1Id,
        unit_id: unitA102Id,
        lease_id: lease2Id,
        inspection_number: 'INSP-0002',
        inspection_type: 'ROUTINE',
        scheduled_at: '2026-11-18T14:00',
        inspector_name: 'Grace Mutua (Property Manager)',
        overall_condition: 'GOOD',
        recommended_deposit_deduction_kes: 0,
        notes: 'Mid-lease check for balcony photocell light and kitchen plumbing.',
        status: 'SCHEDULED',
      },
    ],
    subscriptions: [
      {
        id: 'sub-0001',
        organization_id: org1Id,
        plan_code: 'GROWTH_PRO',
        plan_name: 'Guri24 Growth Pro (Kenya)',
        status: 'ACTIVE',
        monthly_price_kes: 14500,
        unit_limit: 250,
        units_used: 4,
        ocr_pages_quota: 500,
        ocr_pages_used: 4,
        ai_assistant_queries_quota: 1000,
        ai_assistant_queries_used: 12,
        renewal_date: '2026-12-01',
      },
      {
        id: 'sub-0002',
        organization_id: org2Id,
        plan_code: 'ENTERPRISE_KE',
        plan_name: 'Guri24 Enterprise Estates',
        status: 'ACTIVE',
        monthly_price_kes: 35000,
        unit_limit: 1000,
        units_used: 1,
        ocr_pages_quota: 2500,
        ocr_pages_used: 0,
        ai_assistant_queries_quota: 5000,
        ai_assistant_queries_used: 0,
        renewal_date: '2026-12-01',
      },
    ],
    integrationsStatus: [
      {
        provider_key: 'MPESA_DARAJA',
        display_name: 'Safaricom M-Pesa Daraja (STK Push & C2B)',
        category: 'PAYMENTS',
        configured_mode: 'SANDBOX_SIMULATOR',
        live_credentials_configured: false,
        status_label: 'Sandbox Simulator Active (Credentials Unconfigured)',
        honest_disclosure:
          'MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, and MPESA_PASSKEY are not set to production keys in .env. Webhook HMAC verification, idempotency, and FIFO allocation run via the deterministic Daraja Sandbox Adapter.',
      },
      {
        provider_key: 'OCR_PROVIDER',
        display_name: 'OCR & Document Intelligence Engine',
        category: 'OCR',
        configured_mode: 'LOCAL_DETERMINISTIC_ADAPTER',
        live_credentials_configured: false,
        status_label: 'Local Structured Adapter Active (Cloud API Key Unconfigured)',
        honest_disclosure:
          'OCR_PROVIDER_API_KEY is not configured. Using local deterministic OcrProvider adapter with confidence scoring and mandatory human verification.',
      },
      {
        provider_key: 'LLM_ASSISTANT',
        display_name: 'Grounded RMS AI Assistant',
        category: 'AI_ASSISTANT',
        configured_mode: 'GROUNDED_TOOL_ENGINE',
        live_credentials_configured: false,
        status_label: 'Grounded RMS Tool Engine Active (External LLM Key Unconfigured)',
        honest_disclosure:
          'LLM_API_KEY is not configured. Assistant executes live permission-checked RMS tools, cites real database records, enforces prompt-injection guards, and gates mutating actions on user confirmation.',
      },
      {
        provider_key: 'AFRICAS_TALKING_SMS',
        display_name: "Africa's Talking SMS & Transactional Outbox",
        category: 'MESSAGING',
        configured_mode: 'OUTBOX_SANDBOX',
        live_credentials_configured: false,
        status_label: 'Transactional Outbox Active (Live SMS Key Unconfigured)',
        honest_disclosure:
          'AFRICAS_TALKING_API_KEY is not set. Notifications are queued in the transactional outbox so delivery failures never roll back financial transactions.',
      },
      {
        provider_key: 'S3_STORAGE',
        display_name: 'Private S3 / MinIO Document Vault',
        category: 'STORAGE',
        configured_mode: 'SIGNED_URL_VAULT',
        live_credentials_configured: true,
        status_label: 'Private Bucket + 300s Pre-Signed URLs Active',
        honest_disclosure:
          'Documents are scoped under private/org/{organization_id}/* keys and served via short-lived HMAC-SHA256 pre-signed URLs.',
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
  conversationId = 'conv-0001'
): {
  nextState: RmsPlatformState;
  reply: AssistantMessage;
  pendingConfirmation?: AssistantActionConfirmation;
} {
  assertPermission(state.currentRole, 'assistant.use');
  const prompt = rawPrompt.trim();
  if (!prompt) {
    throw new Error('Assistant prompt cannot be empty.');
  }

  const orgId = state.currentOrganizationId;
  const nowIso = new Date().toISOString();

  const userMessage: AssistantMessage = {
    id: `msg-user-${Date.now()}`,
    role: 'USER',
    content: prompt,
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

  // 2. Check if prompt requests a mutating action (Create maintenance request / send reminder)
  if (
    lower.includes('create maintenance') ||
    lower.includes('log maintenance') ||
    lower.includes('open ticket') ||
    lower.includes('draft reminder') ||
    lower.includes('send arrears')
  ) {
    // Check permission for maintenance or invoice reminder
    if (lower.includes('maintenance') || lower.includes('ticket')) {
      assertPermission(state.currentRole, 'maintenance.view');
      const targetUnit =
        orgUnits.find((u) => lower.includes(u.unit_number.toLowerCase())) ?? orgUnits[0];
      const confId = `conf-${Date.now()}`;
      pendingConfirmation = {
        id: confId,
        organization_id: orgId,
        conversation_id: conversationId,
        action_type: 'CREATE_MAINTENANCE_REQUEST',
        title: `Create Maintenance Ticket for Unit ${targetUnit.unit_number}`,
        summary: `Log PLUMBING / GENERAL inspection ticket for Unit ${targetUnit.unit_number} (Estimated KES 2,500). Requires your explicit confirmation before writing to RMS records.`,
        target_reference: `Unit ${targetUnit.unit_number}`,
        payload: {
          unit_id: targetUnit.id,
          unit_number: targetUnit.unit_number,
          category: 'PLUMBING',
          title: `Assistant-logged inspection for Unit ${targetUnit.unit_number}`,
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
      replyText = `I have prepared a maintenance ticket draft for Unit ${targetUnit.unit_number}. Per Guri24 safety policy, no database mutation has been executed yet—please click **Confirm & Execute** on the confirmation card below to create the ticket.`;
    } else {
      assertPermission(state.currentRole, 'invoices.view');
      const overdueInv =
        orgInvoices.find((i) => i.balance_kes > 0 && i.status === 'OVERDUE') ??
        orgInvoices.find((i) => i.balance_kes > 0) ??
        orgInvoices[0];
      const tenant = orgTenants.find((t) => t.id === overdueInv?.tenant_id);
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
      replyText = `I drafted an arrears reminder for ${tenant?.full_name ?? 'Tenant'} referencing ${overdueInv.invoice_number} (Balance: KES ${overdueInv.balance_kes.toLocaleString()}). Please confirm below before queuing to the transactional outbox.`;
    }
  } else if (lower.includes('vacant') || lower.includes('available unit')) {
    assertPermission(state.currentRole, 'properties.view');
    const vacant = orgUnits.filter((u) => u.status === 'VACANT');
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
    replyText = `There are currently **${vacant.length} vacant units** available in your organization: ${vacant
      .map((u) => `Unit ${u.unit_number} (KES ${u.monthly_rent_kes.toLocaleString()}/mo)`)
      .join(', ')}.`;
  } else if (lower.includes('ocr') || lower.includes('document')) {
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
    replyText = `Your OCR pipeline has **${orgOcrJobs.length} document jobs**: **${verified} Verified** and **${needsReview} Needs Human Review**. Unverified OCR extractions remain staged and have not overwritten authoritative RMS records.`;
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
    const totalBilled = orgInvoices.reduce((acc, i) => acc + i.total_amount_kes, 0);
    const totalPaid = orgInvoices.reduce((acc, i) => acc + i.amount_paid_kes, 0);
    const totalArrears = orgInvoices.reduce((acc, i) => acc + i.balance_kes, 0);
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

    replyText = `Grounded Ledger Summary: Total billed across **${orgInvoices.length} invoices** is **KES ${totalBilled.toLocaleString()}**, collected is **KES ${totalPaid.toLocaleString()}**, and outstanding arrears total **KES ${totalArrears.toLocaleString()}** across ${openInvoices.map((i) => `${i.invoice_number} (KES ${i.balance_kes.toLocaleString()})`).join(', ')}.`;
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

