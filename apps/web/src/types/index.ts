export type SystemRole =
  | 'SAAS_SUPER_ADMINISTRATOR'
  | 'ORGANIZATION_ADMINISTRATOR'
  | 'PROPERTY_OWNER'
  | 'PROPERTY_MANAGER'
  | 'ACCOUNTANT'
  | 'RECEPTIONIST'
  | 'MAINTENANCE_OFFICER'
  | 'TENANT'
  | 'VENDOR';

export type UnitStatus =
  | 'VACANT'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'UNDER_MAINTENANCE'
  | 'UNAVAILABLE';

export type LeaseStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'EXPIRING'
  | 'RENEWED'
  | 'TERMINATED';

export type InvoiceStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export type MaintenanceStatus =
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'APPROVED'
  | 'REJECTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  organization_type: 'INDEPENDENT_LANDLORD' | 'PROPERTY_MANAGEMENT_COMPANY' | 'REAL_ESTATE_OWNER';
  kra_pin: string;
  contact_email: string;
  contact_phone: string;
  county: string;
  currency: 'KES';
  timezone: 'Africa/Nairobi';
  mpesa_paybill_shortcode: string;
  late_fee_percentage: number;
  late_fee_grace_days: number;
  rent_calculation_strategy: 'FIXED_MONTHLY' | 'PRORATED_DAILY';
  payment_allocation_strategy: 'FIFO_OLDEST_FIRST' | 'RENT_PRIORITY_FIRST';
}

export interface Property {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  county: string;
  estate_or_area: string;
  physical_address: string;
  lr_number: string;
  management_commission_pct: number;
  amenities: string[];
}

export interface Building {
  id: string;
  organization_id: string;
  property_id: string;
  code: string;
  name: string;
  total_floors: number;
}

export interface Floor {
  id: string;
  organization_id: string;
  property_id: string;
  building_id: string;
  floor_number: number;
  label: string;
}

export interface Unit {
  id: string;
  organization_id: string;
  property_id: string;
  building_id: string;
  floor_id: string;
  unit_number: string;
  unit_type: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent_kes: number;
  deposit_amount_kes: number;
  status: UnitStatus;
  water_meter_number: string;
  kplc_meter_number: string;
  current_tenant_id?: string;
  current_lease_id?: string;
}

export interface Tenant {
  id: string;
  organization_id: string;
  tenant_code: string;
  full_name: string;
  phone: string;
  email: string;
  national_id_masked: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: 'PROSPECT' | 'ACTIVE' | 'FORMER';
}

export interface TenantApplication {
  id: string;
  organization_id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  proposed_move_in_date: string;
  monthly_income_kes: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

export interface Lease {
  id: string;
  organization_id: string;
  property_id: string;
  building_id: string;
  unit_id: string;
  primary_tenant_id: string;
  lease_number: string;
  start_date: string;
  end_date: string;
  billing_day: number;
  monthly_rent_kes: number;
  security_deposit_kes: number;
  service_charge_kes: number;
  garbage_fee_kes: number;
  status: LeaseStatus;
  payment_account_reference: string;
  renewed_from_lease_id?: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  property_id: string;
  unit_id: string;
  lease_id: string;
  tenant_id: string;
  invoice_number: string;
  billing_period: string; // YYYY-MM
  issue_date: string;
  due_date: string;
  rent_amount_kes: number;
  charges_amount_kes: number;
  penalty_kes: number;
  total_amount_kes: number;
  amount_paid_kes: number;
  balance_kes: number;
  status: InvoiceStatus;
  idempotency_key: string;
}

export interface PaymentAllocation {
  id: string;
  invoice_id: string;
  invoice_number: string;
  allocated_amount_kes: number;
  remaining_invoice_balance_kes: number;
}

export interface Payment {
  id: string;
  organization_id: string;
  tenant_id: string;
  lease_id?: string;
  payment_reference: string;
  idempotency_key: string;
  checkout_request_id: string;
  mpesa_receipt_number?: string;
  payer_phone: string;
  amount_kes: number;
  allocated_amount_kes: number;
  unallocated_amount_kes: number;
  status: PaymentStatus;
  allocations: PaymentAllocation[];
  receipt_number?: string;
  paid_at?: string;
}

export interface SecurityDepositRecord {
  id: string;
  organization_id: string;
  lease_id: string;
  tenant_id: string;
  unit_id: string;
  required_amount_kes: number;
  received_amount_kes: number;
  deducted_amount_kes: number;
  refunded_amount_kes: number;
  current_liability_balance_kes: number;
  status: 'PENDING' | 'HELD' | 'PARTIALLY_DEDUCTED' | 'REFUNDED';
}

export interface JournalLine {
  account_code: string;
  account_name: string;
  account_type: 'ASSET' | 'LIABILITY' | 'REVENUE' | 'EXPENSE';
  debit_kes: number;
  credit_kes: number;
  memo: string;
}

export interface JournalEntry {
  id: string;
  organization_id: string;
  entry_number: string;
  entry_date: string;
  source_event_type: string;
  description: string;
  status: 'POSTED' | 'REVERSED';
  total_debit_kes: number;
  total_credit_kes: number;
  lines: JournalLine[];
}

export interface PropertyExpense {
  id: string;
  organization_id: string;
  property_id: string;
  expense_number: string;
  category: string;
  vendor_name: string;
  description: string;
  amount_kes: number;
  expense_date: string;
  journal_entry_id: string;
}

export interface MaintenanceRequest {
  id: string;
  organization_id: string;
  property_id: string;
  building_id: string;
  unit_id: string;
  tenant_id?: string;
  request_number: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  title: string;
  description: string;
  status: MaintenanceStatus;
  assigned_vendor?: string;
  work_order_number?: string;
  estimated_cost_kes: number;
  actual_cost_kes: number;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  organization_id: string;
  category:
    | 'LEASE_AGREEMENT'
    | 'TENANT_ID'
    | 'RECEIPT'
    | 'INVOICE'
    | 'PROPERTY_DEED'
    | 'MAINTENANCE_REPORT'
    | 'INSPECTION_REPORT';
  entity_label: string;
  file_name: string;
  mime_type: string;
  file_size_kb: number;
  s3_object_key: string;
  created_at: string;
}
