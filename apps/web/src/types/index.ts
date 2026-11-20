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

export type OcrDocumentCategory =
  | 'TENANT_IDENTIFICATION'
  | 'LEASE_AGREEMENT'
  | 'RECEIPT_OR_INVOICE'
  | 'PROPERTY_DOCUMENT';

export type OcrJobStatus =
  | 'UPLOADED'
  | 'QUEUED'
  | 'PROCESSING'
  | 'NEEDS_REVIEW'
  | 'VERIFIED'
  | 'FAILED';

export interface OcrExtractedField {
  id: string;
  field_name: string;
  field_label: string;
  extracted_value: string;
  normalized_value: string;
  confidence: number;
  page_number: number;
  bounding_box: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  validation_errors: string[];
  human_verified: boolean;
  corrected_value?: string;
}

export interface OcrReviewAudit {
  id: string;
  job_id: string;
  reviewer_role: SystemRole;
  decision: 'APPROVED' | 'REJECTED';
  notes: string;
  reviewed_at: string;
}

export interface OcrJobRecord {
  id: string;
  organization_id: string;
  document_id: string;
  file_name: string;
  mime_type: string;
  file_size_kb: number;
  page_count: number;
  document_category: OcrDocumentCategory;
  provider_name: string;
  status: OcrJobStatus;
  raw_extracted_text: string;
  overall_confidence: number;
  fields: OcrExtractedField[];
  authoritative_record_applied: boolean;
  linked_entity_label?: string;
  review_audit?: OcrReviewAudit;
  created_at: string;
  completed_at?: string;
}

export interface AssistantCitation {
  record_type: 'INVOICE' | 'LEASE' | 'PAYMENT' | 'UNIT' | 'MAINTENANCE' | 'OCR_DOCUMENT' | 'PROPERTY';
  record_id: string;
  reference_code: string;
  summary: string;
}

export interface AssistantToolCall {
  id: string;
  tool_name: string;
  permission_checked: string;
  arguments_summary: string;
  result_summary: string;
  executed_at: string;
}

export interface AssistantActionConfirmation {
  id: string;
  organization_id: string;
  conversation_id: string;
  action_type: 'CREATE_MAINTENANCE_REQUEST' | 'DRAFT_TENANT_ARREARS_REMINDER' | 'APPLY_VERIFIED_OCR_TO_LEASE';
  title: string;
  summary: string;
  target_reference: string;
  payload: Record<string, string | number>;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  created_at: string;
  resolved_at?: string;
}

export interface AssistantAttachment {
  name: string;
  size?: number;
  type?: string;
  kind?: 'document' | 'audio' | 'image';
  previewUrl?: string;
  duration?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  attachment?: AssistantAttachment;
  citations: AssistantCitation[];
  tool_calls: AssistantToolCall[];
  pending_confirmation_id?: string;
  blocked_reason?: string;
  created_at: string;
}

export interface AssistantConversation {
  id: string;
  organization_id: string;
  title: string;
  messages: AssistantMessage[];
  updated_at: string;
}

export interface Vendor {
  id: string;
  organization_id: string;
  vendor_code: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  specialty: string;
  kra_pin: string;
  rating: number;
  status: 'ACTIVE' | 'ON_HOLD';
}

export interface InspectionRecord {
  id: string;
  organization_id: string;
  property_id: string;
  building_id: string;
  unit_id: string;
  lease_id?: string;
  inspection_number: string;
  inspection_type: 'MOVE_IN' | 'MOVE_OUT' | 'ROUTINE';
  scheduled_at: string;
  inspector_name: string;
  overall_condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DAMAGED';
  recommended_deposit_deduction_kes: number;
  notes: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'SIGNED_OFF';
}

export interface SubscriptionSummary {
  id: string;
  organization_id: string;
  plan_code: 'STARTER' | 'GROWTH_PRO' | 'ENTERPRISE_KE';
  plan_name: string;
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE';
  monthly_price_kes: number;
  unit_limit: number;
  units_used: number;
  ocr_pages_quota: number;
  ocr_pages_used: number;
  ai_assistant_queries_quota: number;
  ai_assistant_queries_used: number;
  renewal_date: string;
}

export interface IntegrationStatusItem {
  provider_key: string;
  display_name: string;
  category: 'PAYMENTS' | 'OCR' | 'AI_ASSISTANT' | 'MESSAGING' | 'STORAGE';
  configured_mode: string;
  live_credentials_configured: boolean;
  status_label: string;
  honest_disclosure: string;
}

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

export type InvitationType = 'ORGANIZATION_ADMIN' | 'STAFF' | 'TENANT' | 'VENDOR';
export type InvitationStatus = 'DRAFT' | 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | 'FAILED';

export interface Invitation {
  id: string;
  organization_id: string;
  invitation_type: InvitationType;
  email: string;
  phone?: string;
  full_name: string;
  role: SystemRole;
  token_hash?: string;
  token?: string;
  status: InvitationStatus;
  property_ids: string[];
  tenant_id?: string;
  lease_id?: string;
  additional_permissions?: string[];
  invitation_message?: string;
  delivery_status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  delivery_error?: string;
  invited_by?: string;
  invited_by_name?: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPropertyAccess {
  id: string;
  organization_id: string;
  user_id: string;
  property_id: string;
  access_level: 'FULL' | 'VIEW_ONLY' | 'MAINTENANCE_ONLY';
  assigned_by?: string;
  created_at: string;
}

export interface AccessAuditLog {
  id: string;
  organization_id: string;
  actor_user_id?: string;
  actor_role?: string;
  target_user_id?: string;
  event_type: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ManagedStaffMember {
  id: string;
  organization_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: SystemRole;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'REVOKED';
  assigned_property_ids: string[];
  additional_permissions?: string[];
  last_login_at?: string;
  joined_at: string;
  created_at: string;
}

export interface PlatformOrganization {
  id: string;
  name: string;
  slug: string;
  organization_type: string;
  kra_pin?: string;
  contact_email: string;
  contact_phone: string;
  county: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CLOSED';
  subscription_plan: string;
  units_count: number;
  active_users_count: number;
  created_at: string;
  updated_at: string;
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
  tenant_code?: string;
  full_name: string;
  phone: string;
  email?: string;
  id_number?: string;
  national_id_masked?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status: 'PROSPECT' | 'ACTIVE' | 'FORMER';
  created_at?: string;
  updated_at?: string;
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
  building_id?: string;
  unit_id: string;
  primary_tenant_id?: string;
  tenant_id?: string;
  lease_number?: string;
  start_date: string;
  end_date: string;
  billing_day?: number;
  monthly_rent_kes: number;
  security_deposit_kes: number;
  service_charge_kes?: number;
  garbage_fee_kes?: number;
  status: LeaseStatus;
  payment_account_reference?: string;
  renewed_from_lease_id?: string;
  created_at?: string;
  updated_at?: string;
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
  paid_amount_kes?: number;
  balance_kes: number;
  status: InvoiceStatus;
  idempotency_key: string;
  items?: any[];
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
  invoice_id?: string;
  payment_reference: string;
  reference?: string;
  transaction_reference?: string;
  idempotency_key: string;
  checkout_request_id: string;
  mpesa_receipt_number?: string;
  provider_receipt_number?: string;
  payer_phone: string;
  payment_method?: string;
  amount_kes: number;
  allocated_amount_kes: number;
  unallocated_amount_kes: number;
  status: PaymentStatus;
  allocations: PaymentAllocation[];
  receipt_number?: string;
  paid_at?: string;
  created_at?: string;
}

export interface SecurityDepositRecord {
  id: string;
  organization_id: string;
  lease_id: string;
  tenant_id: string;
  unit_id: string;
  required_amount_kes: number;
  received_amount_kes: number;
  initial_deposit_kes?: number;
  deducted_amount_kes: number;
  total_deductions_kes?: number;
  refunded_amount_kes: number;
  total_refunded_kes?: number;
  current_liability_balance_kes: number;
  status: 'PENDING' | 'HELD' | 'PARTIALLY_DEDUCTED' | 'REFUNDED';
  updated_at?: string;
  created_at?: string;
}

export type SecurityDepositLedger = SecurityDepositRecord;

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
  reversal_of_entry_id?: string;
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
  property_id?: string;
  building_id?: string;
  unit_id: string;
  tenant_id?: string;
  request_number?: string;
  ticket_number?: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  title?: string;
  description: string;
  status: MaintenanceStatus;
  assigned_vendor?: string;
  work_order_number?: string;
  estimated_cost_kes?: number;
  actual_cost_kes?: number;
  created_at: string;
  updated_at?: string;
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

export type DeliveryStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'SENT'
  | 'DELIVERED'
  | 'BOUNCED'
  | 'COMPLAINED'
  | 'FAILED'
  | 'SUPPRESSED'
  | 'CANCELLED';

export interface NotificationDelivery {
  id: string;
  organization_id: string;
  recipient_email: string;
  recipient_name: string;
  recipient_role: string;
  template_key: string;
  subject: string;
  body_html: string;
  body_text: string;
  status: DeliveryStatus;
  provider: string;
  provider_message_id?: string | null;
  error_message?: string | null;
  retry_count: number;
  max_retries: number;
  idempotency_key: string;
  related_entity_type?: string | null;
  related_entity_id?: string | null;
  sent_at?: string | null;
  delivered_at?: string | null;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  organization_id: string;
  rent_reminder_days_before: number;
  rent_due_date_reminder: boolean;
  overdue_reminder_days: number[];
  lease_expiry_days: number[];
  daily_collection_summary: boolean;
  weekly_operational_report: boolean;
  monthly_financial_report: boolean;
  deposit_liability_summary: boolean;
  staff_escalation_emails: string[];
  timezone: string;
  email_from: string;
  brand_logo_url?: string | null;
  brand_primary_color: string;
  updated_at: string;
}

export interface NotificationTemplateSummary {
  key: string;
  title: string;
  category: string;
  is_mandatory: boolean;
  sample_subject: string;
}

// =============================================================================
// Comprehensive Financial Intelligence, Accounting & Ledger Types
// =============================================================================

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Account {
  id: string;
  organization_id: string;
  account_code: string;
  name: string;
  account_type: AccountType;
  normal_balance: 'DEBIT' | 'CREDIT';
}

export interface TrialBalanceRow {
  account_code: string;
  account_name: string;
  account_type: AccountType;
  debit_kes: number;
  credit_kes: number;
  net_balance_kes: number;
}

export interface TrialBalanceReport {
  as_of_date: string;
  accounts: TrialBalanceRow[];
  total_debits_kes: number;
  total_credits_kes: number;
  is_balanced: boolean;
}

export interface AccountLineSummary {
  account_code: string;
  account_name: string;
  amount_kes: number;
}

export interface ProfitAndLossReport {
  period_start: string;
  period_end: string;
  operating_revenue: AccountLineSummary[];
  total_revenue_kes: number;
  operating_expenses: AccountLineSummary[];
  total_expenses_kes: number;
  net_operating_income_kes: number;
  net_profit_loss_kes: number;
}

export interface BalanceSheetReport {
  as_of_date: string;
  current_assets: AccountLineSummary[];
  total_assets_kes: number;
  liabilities: AccountLineSummary[];
  total_liabilities_kes: number;
  equity: AccountLineSummary[];
  total_equity_kes: number;
  total_liabilities_and_equity_kes: number;
  is_balanced: boolean;
}

export interface CashFlowStatement {
  period_start: string;
  period_end: string;
  operating_inflows_kes: number;
  operating_outflows_kes: number;
  net_operating_cash_kes: number;
  financing_cash_flow_kes: number;
  opening_cash_balance_kes: number;
  closing_cash_balance_kes: number;
}

export interface MonthlyTrend {
  month_label: string;
  billed_kes: number;
  collected_kes: number;
  expenses_kes: number;
  noi_kes: number;
}

export interface PropertyPerformanceSummary {
  property_id: string;
  property_name: string;
  total_units: number;
  occupied_units: number;
  occupancy_rate_pct: number;
  billed_kes: number;
  collected_kes: number;
  arrears_kes: number;
  expenses_kes: number;
  noi_kes: number;
  average_rent_kes: number;
}

export interface ExecutiveFinancialOverview {
  currency: string;
  total_billed_kes: number;
  total_collected_kes: number;
  collection_rate_pct: number;
  outstanding_arrears_kes: number;
  operating_expenses_kes: number;
  net_operating_income_kes: number;
  security_deposits_liability_kes: number;
  unallocated_receipts_kes: number;
  total_units: number;
  occupied_units: number;
  occupancy_rate_pct: number;
  monthly_trends: MonthlyTrend[];
  property_summaries: PropertyPerformanceSummary[];
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  total_kes: number;
  percentage: number;
}

export interface IncomeCollectionsSummary {
  total_invoiced_kes: number;
  rental_revenue_kes: number;
  utility_revenue_kes: number;
  penalties_revenue_kes: number;
  actual_collected_kes: number;
  unallocated_held_kes: number;
  collection_rate_pct: number;
  payment_methods: PaymentMethodBreakdown[];
}

export interface TenantAgingRow {
  tenant_id: string;
  tenant_name: string;
  property_name: string;
  unit_number: string;
  phone: string;
  current_kes: number;
  bucket_1_30_kes: number;
  bucket_31_60_kes: number;
  bucket_61_90_kes: number;
  bucket_over_90_kes: number;
  total_arrears_kes: number;
  oldest_due_date?: string | null;
}

export interface ArrearsAgingReport {
  as_of_date: string;
  total_receivables_kes: number;
  current_kes: number;
  bucket_1_30_kes: number;
  bucket_31_60_kes: number;
  bucket_61_90_kes: number;
  bucket_over_90_kes: number;
  rows: TenantAgingRow[];
}

export interface DepositLiabilityItem {
  deposit_id: string;
  tenant_id: string;
  tenant_name: string;
  property_name: string;
  unit_number: string;
  initial_amount_kes: number;
  deductions_kes: number;
  refunded_kes: number;
  current_liability_kes: number;
  status: string;
}

export interface DepositLiabilitiesReport {
  as_of_date: string;
  total_deposits_held_kes: number;
  total_refunded_kes: number;
  total_deducted_kes: number;
  items: DepositLiabilityItem[];
}

export interface TenantAnalyticsRow {
  tenant_id: string;
  tenant_name: string;
  property_name: string;
  unit_number: string;
  total_billed_kes: number;
  total_paid_kes: number;
  balance_kes: number;
  payment_count: number;
  on_time_rate_pct: number;
  avg_delay_days: number;
}

export interface TenantAnalyticsReport {
  total_tenants: number;
  active_leases: number;
  overall_on_time_pct: number;
  avg_payment_delay_days: number;
  retention_rate_pct: number;
  tenants: TenantAnalyticsRow[];
}

export interface MaintenanceCostAnalysis {
  total_requests: number;
  open_requests: number;
  closed_requests: number;
  total_maintenance_spent_kes: number;
  avg_resolution_days: number;
}

export interface ReconciliationBatch {
  id: string;
  organization_id: string;
  statement_source: string;
  file_name: string;
  total_records: number;
  matched_records: number;
  exception_records: number;
  imported_at: string;
}

export interface ReconciliationExternalTx {
  id: string;
  batch_id: string;
  transaction_ref: string;
  trans_time: string;
  amount_kes: number;
  narrative: string;
  sender_name?: string | null;
  sender_phone?: string | null;
  match_status: 'UNMATCHED' | 'MATCHED' | 'EXCEPTION';
  matched_entity_id?: string | null;
}

export interface ReconciliationException {
  id: string;
  batch_id: string;
  external_transaction_id: string;
  exception_type: string;
  details: string;
  status: 'OPEN' | 'RESOLVED' | 'DISPUTED';
}

export interface FinancialReportRun {
  id: string;
  organization_id: string;
  report_type: string;
  title: string;
  period_start: string;
  period_end: string;
  property_id?: string | null;
  currency: string;
  parameters: Record<string, any>;
  summary_data: Record<string, any>;
  generated_by?: string | null;
  created_at: string;
}

export interface FinancialAuditEvent {
  id: string;
  organization_id: string;
  actor_id?: string | null;
  actor_role: string;
  event_type: string;
  source_entity_type: string;
  source_entity_id: string;
  description: string;
  created_at: string;
}

// -----------------------------------------------------------------------------
// Multi-Bank, Financial Channels & Organization Configuration
// -----------------------------------------------------------------------------
export interface OrganizationFinancialSettings {
  id: string;
  organization_id: string;
  legal_name: string;
  reporting_currency: string;
  timezone: string;
  fiscal_year_start: string;
  fiscal_year_end: string;
  accounting_basis: 'ACCRUAL' | 'CASH';
  default_reporting_preferences: Record<string, any>;
  is_configured: boolean;
  configured_at?: string | null;
}

export type FinancialChannelType =
  | 'BANK'
  | 'MPESA_PAYBILL'
  | 'MPESA_TILL'
  | 'CASH'
  | 'PETTY_CASH'
  | 'OTHER';

export type IntegrationStatus =
  | 'NOT_CONFIGURED'
  | 'CONFIGURED'
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'UNAVAILABLE';

export interface FinancialChannel {
  id: string;
  organization_id: string;
  channel_type: FinancialChannelType;
  channel_name: string;
  identifier: string; // Shortcode, Till, Account number, or Cash Box
  gl_account_id?: string | null;
  gl_account_code: string;
  is_active: boolean;
  integration_status: IntegrationStatus;
  config_details: Record<string, any>;
}

export type BankAccountType =
  | 'OPERATING'
  | 'RENT_COLLECTION'
  | 'ESCROW_DEPOSITS'
  | 'PETTY_CASH'
  | 'SAVINGS';

export interface BankAccount {
  id: string;
  organization_id: string;
  bank_name: string; // e.g. Equity Bank, NCBA Bank, Co-operative Bank, KCB, Stanbic
  account_name: string;
  account_number: string;
  account_currency: string;
  account_type: BankAccountType;
  branch_name?: string | null;
  branch_code?: string | null;
  swift_bic?: string | null;
  gl_account_id?: string | null;
  gl_account_code: string;
  opening_balance_kes: number;
  opening_balance_date?: string | null;
  assigned_property_ids: string[];
  reconciliation_preferences: Record<string, any>;
  is_active: boolean;
}

export interface OpeningBalanceRecord {
  id: string;
  organization_id: string;
  account_id: string;
  account_code: string;
  account_name: string;
  balance_kes: number;
  normal_balance: 'DEBIT' | 'CREDIT';
  effective_date: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'POSTED' | 'REJECTED';
  journal_entry_id?: string | null;
  supporting_document_url?: string | null;
  entered_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
}

export interface PropertyAccountMapping {
  id: string;
  organization_id: string;
  property_id: string;
  default_collection_account_id?: string | null;
  default_deposit_account_id?: string | null;
  default_expense_account_id?: string | null;
}

export interface BankStatementImport {
  id: string;
  organization_id: string;
  bank_account_id?: string | null;
  filename: string;
  file_format: 'CSV' | 'XLSX' | 'PDF';
  period_start: string;
  period_end: string;
  total_transactions: number;
  total_debit_amount_kes: number;
  total_credit_amount_kes: number;
  matched_count: number;
  unmatched_count: number;
  status: 'PENDING_REVIEW' | 'RECONCILED' | 'DISCREPANCIES_FLAGGED' | 'FINALIZED';
  imported_by?: string | null;
  created_at: string;
}

export interface BankStatementTransaction {
  id: string;
  organization_id: string;
  import_id: string;
  transaction_date: string;
  value_date?: string | null;
  reference: string;
  check_number?: string | null;
  description: string;
  debit_kes: number;
  credit_kes: number;
  balance_kes?: number | null;
  match_status:
    | 'UNMATCHED'
    | 'MATCHED'
    | 'PARTIALLY_MATCHED'
    | 'DUPLICATE'
    | 'AMOUNT_MISMATCH'
    | 'RESOLVED_MANUAL';
  matched_payment_id?: string | null;
  matched_expense_id?: string | null;
  matched_at?: string | null;
  matched_by?: string | null;
}

export interface ReconciliationRule {
  id: string;
  organization_id: string;
  rule_name: string;
  priority: number;
  match_strategy:
    | 'EXACT_REFERENCE'
    | 'AMOUNT_DATE_WINDOW'
    | 'TENANT_NAME_AMOUNT'
    | 'MANUAL_ONLY';
  date_tolerance_days: number;
  auto_reconcile: boolean;
  column_mapping: Record<string, string>;
  is_active: boolean;
}

