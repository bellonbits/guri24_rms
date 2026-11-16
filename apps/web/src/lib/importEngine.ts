/**
 * Guri24 RMS Unified Data Entry, Bulk Import & Data Acquisition Engine
 * Client-side domain engine supporting:
 * - CSV and Excel XLSX parsing & generation
 * - Spreadsheet-style clipboard paste from Excel / Google Sheets
 * - Intelligent column auto-mapping with alias resolution
 * - Deep validation (Kenyan MSISDNs, KES currencies, ISO dates, enums, required fields)
 * - Conflict resolution (SKIP_DUPLICATES, UPDATE_EXISTING, ABORT_ON_ERROR)
 */

export type ImportModuleKey =
  | 'properties'
  | 'buildings'
  | 'floors'
  | 'units'
  | 'tenants'
  | 'leases'
  | 'invoices'
  | 'payments'
  | 'maintenance'
  | 'vendors'
  | 'expenses'
  | 'inspections'
  | 'documents';

export interface FieldDefinition {
  key: string;
  label: string;
  dataType: 'string' | 'number' | 'currency' | 'date' | 'phone' | 'enum' | 'boolean';
  required: boolean;
  description: string;
  example: string;
  allowedValues?: string[];
  aliases?: string[];
}

export interface ModuleTemplate {
  module: ImportModuleKey;
  title: string;
  description: string;
  fields: FieldDefinition[];
  sampleRows: Record<string, any>[];
}

export interface RowError {
  rowIndex: number;
  field: string;
  value?: string;
  errorCode: string;
  errorMessage: string;
  suggestion?: string;
}

export interface PreviewRow {
  rowIndex: number;
  status: 'VALID' | 'INVALID' | 'DUPLICATE' | 'WARNING';
  fields: Record<string, any>;
  errors: string[];
}

export interface ValidationSummary {
  module: ImportModuleKey;
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  duplicateRowsCount: number;
  errors: RowError[];
  previewRows: PreviewRow[];
}

export type ConflictStrategy = 'SKIP_DUPLICATES' | 'UPDATE_EXISTING' | 'ABORT_ON_ERROR';

export interface ImportJobHistoryItem {
  id: string;
  organization_id: string;
  user_id: string;
  module: ImportModuleKey;
  file_name: string;
  file_size_kb: number;
  status: 'COMPLETED' | 'FAILED' | 'PARTIAL';
  total_rows: number;
  inserted_count: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  conflict_strategy: ConflictStrategy;
  error_summary?: string;
  errors: RowError[];
  created_at: string;
  completed_at?: string;
}

export const MODULE_TEMPLATES: Record<ImportModuleKey, ModuleTemplate> = {
  properties: {
    module: 'properties',
    title: 'Properties & Estates',
    description: 'Bulk register residential buildings, mixed-use developments, and gated estates.',
    fields: [
      {
        key: 'name',
        label: 'Property Name',
        dataType: 'string',
        required: true,
        description: 'Official legal name of the property.',
        example: 'Jacaranda Heights',
        aliases: ['property', 'property_name', 'estate_name', 'title'],
      },
      {
        key: 'property_code',
        label: 'Property Code',
        dataType: 'string',
        required: true,
        description: 'Unique alphanumeric identifier (e.g. JAC-001).',
        example: 'JAC-001',
        aliases: ['code', 'prop_code', 'reference', 'prop_id'],
      },
      {
        key: 'county',
        label: 'County',
        dataType: 'string',
        required: true,
        description: 'Kenyan county of location.',
        example: 'Nairobi',
        allowedValues: ['Nairobi', 'Mombasa', 'Kiambu', 'Machakos', 'Nakuru', 'Kisumu', 'Kajiado', 'Uasin Gishu'],
        aliases: ['region', 'location_county'],
      },
      {
        key: 'estate',
        label: 'Estate / Suburb',
        dataType: 'string',
        required: false,
        description: 'Locality or neighborhood name.',
        example: 'Kilimani',
        aliases: ['neighborhood', 'locality', 'area', 'suburb'],
      },
      {
        key: 'land_registration_number',
        label: 'LR Title Number',
        dataType: 'string',
        required: false,
        description: 'Ministry of Lands LR Number.',
        example: 'LR 209/14298',
        aliases: ['lr_number', 'title_number', 'deed_number'],
      },
    ],
    sampleRows: [
      { name: 'Jacaranda Heights', property_code: 'JAC-001', county: 'Nairobi', estate: 'Kilimani', land_registration_number: 'LR 209/14298' },
      { name: 'Westlands Brookside', property_code: 'WES-002', county: 'Nairobi', estate: 'Westlands', land_registration_number: 'LR 1870/IX/45' },
    ],
  },

  buildings: {
    module: 'buildings',
    title: 'Buildings & Blocks',
    description: 'Import blocks or towers belonging to your properties.',
    fields: [
      { key: 'property_code', label: 'Property Code', dataType: 'string', required: true, description: 'Code of parent property.', example: 'JAC-001', aliases: ['prop_code', 'property'] },
      { key: 'name', label: 'Building Name', dataType: 'string', required: true, description: 'Block or tower name.', example: 'Block A', aliases: ['block', 'tower', 'building'] },
      { key: 'building_code', label: 'Building Code', dataType: 'string', required: true, description: 'Unique building identifier.', example: 'BLK-A', aliases: ['code', 'bld_code'] },
      { key: 'total_floors', label: 'Total Floors', dataType: 'number', required: false, description: 'Number of floor levels.', example: '5', aliases: ['floors', 'levels'] },
    ],
    sampleRows: [
      { property_code: 'JAC-001', name: 'Block A (Rosewood Wing)', building_code: 'BLK-A', total_floors: '5' },
      { property_code: 'JAC-001', name: 'Block B (Mahogany Wing)', building_code: 'BLK-B', total_floors: '5' },
    ],
  },

  floors: {
    module: 'floors',
    title: 'Building Floors',
    description: 'Floor levels within buildings.',
    fields: [
      { key: 'building_code', label: 'Building Code', dataType: 'string', required: true, description: 'Code of parent building.', example: 'BLK-A', aliases: ['building', 'block'] },
      { key: 'floor_number', label: 'Floor Number', dataType: 'number', required: true, description: 'Numeric floor level (0=Ground, 1=1st Floor).', example: '1', aliases: ['level', 'floor'] },
      { key: 'floor_label', label: 'Floor Label', dataType: 'string', required: false, description: 'Descriptive name (e.g. Ground Floor, 1st Floor).', example: 'First Floor', aliases: ['label', 'name'] },
    ],
    sampleRows: [
      { building_code: 'BLK-A', floor_number: '0', floor_label: 'Ground Floor' },
      { building_code: 'BLK-A', floor_number: '1', floor_label: 'First Floor' },
    ],
  },

  units: {
    module: 'units',
    title: 'Units & Apartments',
    description: 'Bulk register units, bedrooms, rental pricing, and utility meter numbers.',
    fields: [
      { key: 'unit_number', label: 'Unit Number', dataType: 'string', required: true, description: 'Door / Unit number.', example: 'A-101', aliases: ['unit', 'door', 'apt_number', 'unit_no', 'apartment', 'apartment_no', 'apt', 'apartment_number'] },
      { key: 'property_code', label: 'Property Code', dataType: 'string', required: true, description: 'Code of property.', example: 'JAC-001', aliases: ['property', 'prop_code'] },
      {
        key: 'unit_type',
        label: 'Unit Type',
        dataType: 'enum',
        required: true,
        description: 'Room typology.',
        example: 'TWO_BEDROOM',
        allowedValues: ['ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 'STUDIO', 'BEDSITTER', 'PENTHOUSE', 'COMMERCIAL'],
        aliases: ['typology', 'type', 'apartment_type'],
      },
      { key: 'monthly_rent_kes', label: 'Monthly Rent (KES)', dataType: 'currency', required: true, description: 'Base contractual rent.', example: '35000', aliases: ['rent', 'monthly_rent', 'price', 'amount'] },
      { key: 'security_deposit_kes', label: 'Deposit (KES)', dataType: 'currency', required: false, description: 'Refundable security deposit.', example: '35000', aliases: ['deposit', 'security_deposit'] },
      { key: 'water_meter_number', label: 'Water Meter Number', dataType: 'string', required: false, description: 'NCWSC water meter reference.', example: 'NCWSC-88101', aliases: ['water_meter', 'ncwsc_meter'] },
      { key: 'electricity_meter_number', label: 'Electricity Meter', dataType: 'string', required: false, description: 'KPLC token or account number.', example: 'KPLC-142091', aliases: ['electricity_meter', 'kplc_meter', 'token_no'] },
    ],
    sampleRows: [
      { unit_number: 'A-101', property_code: 'JAC-001', unit_type: 'TWO_BEDROOM', monthly_rent_kes: '35000', security_deposit_kes: '35000', water_meter_number: 'NCWSC-88101', electricity_meter_number: 'KPLC-142091' },
      { unit_number: 'A-102', property_code: 'JAC-001', unit_type: 'ONE_BEDROOM', monthly_rent_kes: '25000', security_deposit_kes: '25000', water_meter_number: 'NCWSC-88102', electricity_meter_number: 'KPLC-142092' },
      { unit_number: 'B-201', property_code: 'JAC-001', unit_type: 'THREE_BEDROOM', monthly_rent_kes: '55000', security_deposit_kes: '55000', water_meter_number: 'NCWSC-88103', electricity_meter_number: 'KPLC-142093' },
    ],
  },

  tenants: {
    module: 'tenants',
    title: 'Tenants & Residents',
    description: 'Bulk register resident contacts, IDs, and M-Pesa billing details.',
    fields: [
      { key: 'full_name', label: 'Full Name', dataType: 'string', required: true, description: 'Full legal name.', example: 'Amina Hassan Noor', aliases: ['name', 'tenant_name', 'resident'] },
      { key: 'phone', label: 'M-Pesa Phone Number', dataType: 'phone', required: true, description: 'Kenyan MSISDN (07XX / 2547XX).', example: '254712345678', aliases: ['mobile', 'phone_number', 'msisdn', 'mpesa_phone'] },
      { key: 'email', label: 'Email Address', dataType: 'string', required: true, description: 'Primary email for invoices & receipts.', example: 'amina.noor@example.com', aliases: ['email_address', 'mail'] },
      { key: 'national_id', label: 'National ID / Passport', dataType: 'string', required: false, description: 'Kenyan National ID number.', example: '31223344', aliases: ['id_number', 'national_id_number', 'passport'] },
      { key: 'emergency_contact_name', label: 'Emergency Contact Name', dataType: 'string', required: false, description: 'Next of kin full name.', example: 'Hassan Noor', aliases: ['kin_name', 'next_of_kin'] },
      { key: 'emergency_contact_phone', label: 'Emergency Contact Phone', dataType: 'phone', required: false, description: 'Next of kin phone.', example: '254722998877', aliases: ['kin_phone', 'emergency_phone'] },
    ],
    sampleRows: [
      { full_name: 'Amina Hassan Noor', phone: '0712345678', email: 'amina.noor@example.com', national_id: '31223344', emergency_contact_name: 'Hassan Noor', emergency_contact_phone: '0722998877' },
      { full_name: 'Peter Mwangi Gatitu', phone: '0722111222', email: 'peter.mwangi@example.com', national_id: '28445566', emergency_contact_name: 'Grace Wanjiku', emergency_contact_phone: '0733445566' },
    ],
  },

  leases: {
    module: 'leases',
    title: 'Lease Agreements',
    description: 'Import active and historical rental contracts.',
    fields: [
      { key: 'lease_number', label: 'Lease Number', dataType: 'string', required: true, description: 'Unique lease code.', example: 'LSE-2026-001', aliases: ['lease_code', 'contract_number'] },
      { key: 'unit_number', label: 'Unit Number', dataType: 'string', required: true, description: 'Assigned unit.', example: 'A-101', aliases: ['unit', 'unit_no'] },
      { key: 'tenant_phone', label: 'Tenant Phone', dataType: 'phone', required: true, description: 'Tenant phone identifier.', example: '254712345678', aliases: ['phone', 'tenant_identifier'] },
      { key: 'start_date', label: 'Start Date', dataType: 'date', required: true, description: 'Lease commencement date (YYYY-MM-DD).', example: '2026-12-01', aliases: ['commencement_date', 'lease_start'] },
      { key: 'end_date', label: 'End Date', dataType: 'date', required: true, description: 'Lease expiration date (YYYY-MM-DD).', example: '2027-11-30', aliases: ['expiration_date', 'lease_end'] },
      { key: 'monthly_rent_kes', label: 'Rent (KES)', dataType: 'currency', required: true, description: 'Contractual monthly rent.', example: '35000', aliases: ['rent', 'amount'] },
      { key: 'deposit_held_kes', label: 'Deposit (KES)', dataType: 'currency', required: false, description: 'Security deposit held.', example: '35000', aliases: ['deposit', 'security_deposit'] },
    ],
    sampleRows: [
      { lease_number: 'LSE-2026-001', unit_number: 'A-101', tenant_phone: '0712345678', start_date: '2026-12-01', end_date: '2027-11-30', monthly_rent_kes: '35000', deposit_held_kes: '35000' },
    ],
  },

  invoices: {
    module: 'invoices',
    title: 'Rent & Utility Invoices',
    description: 'Bulk import monthly billing statements and invoices.',
    fields: [
      { key: 'invoice_number', label: 'Invoice Number', dataType: 'string', required: true, description: 'Unique invoice identifier.', example: 'INV-202611-001', aliases: ['invoice_code', 'inv_number', 'inv_no'] },
      { key: 'unit_number', label: 'Unit Number', dataType: 'string', required: true, description: 'Billed unit.', example: 'A-101', aliases: ['unit', 'unit_no'] },
      { key: 'billing_period', label: 'Billing Period', dataType: 'string', required: true, description: 'Period in YYYY-MM format.', example: '2026-11', aliases: ['period', 'month'] },
      { key: 'due_date', label: 'Due Date', dataType: 'date', required: true, description: 'Payment due date (YYYY-MM-DD).', example: '2026-11-05', aliases: ['due', 'payment_due_date'] },
      { key: 'total_amount_kes', label: 'Total Amount (KES)', dataType: 'currency', required: true, description: 'Total invoice amount billed.', example: '35000', aliases: ['amount', 'total', 'billed'] },
    ],
    sampleRows: [
      { invoice_number: 'INV-202611-001', unit_number: 'A-101', billing_period: '2026-11', due_date: '2026-11-05', total_amount_kes: '35000' },
    ],
  },

  payments: {
    module: 'payments',
    title: 'Payment Records (Reconciled)',
    description: 'Import bank or historical payment records with reconciliation evidence.',
    fields: [
      { key: 'receipt_number', label: 'Receipt Number', dataType: 'string', required: true, description: 'Internal RMS receipt code.', example: 'RCT-00192', aliases: ['receipt', 'rct_no'] },
      { key: 'mpesa_receipt_number', label: 'M-Pesa / Bank Reference', dataType: 'string', required: true, description: 'Transaction code (e.g. SJK99102KL).', example: 'QWE89102KL', aliases: ['transaction_code', 'reference', 'trans_id'] },
      { key: 'payer_phone', label: 'Payer Phone', dataType: 'phone', required: true, description: 'Phone number of payer.', example: '254712345678', aliases: ['phone', 'mobile'] },
      { key: 'amount_kes', label: 'Amount Paid (KES)', dataType: 'currency', required: true, description: 'Verified payment amount.', example: '35000', aliases: ['amount', 'paid'] },
      { key: 'payment_date', label: 'Payment Date', dataType: 'date', required: true, description: 'Date transaction was executed (YYYY-MM-DD).', example: '2026-11-04', aliases: ['date', 'trans_date'] },
      { key: 'reconciliation_status', label: 'Status', dataType: 'enum', required: true, description: 'Audit verification status.', example: 'RECONCILED', allowedValues: ['RECONCILED', 'PENDING_APPROVAL'], aliases: ['status'] },
    ],
    sampleRows: [
      { receipt_number: 'RCT-00192', mpesa_receipt_number: 'QWE89102KL', payer_phone: '0712345678', amount_kes: '35000', payment_date: '2026-11-04', reconciliation_status: 'RECONCILED' },
    ],
  },

  maintenance: {
    module: 'maintenance',
    title: 'Maintenance Tickets',
    description: 'Bulk import work orders, repair requests, and technician assignments.',
    fields: [
      { key: 'request_number', label: 'Ticket Number', dataType: 'string', required: true, description: 'Unique ticket code.', example: 'MNT-202611-001', aliases: ['ticket_no', 'job_code'] },
      { key: 'unit_number', label: 'Unit Number', dataType: 'string', required: true, description: 'Unit experiencing issue.', example: 'A-101', aliases: ['unit'] },
      {
        key: 'category',
        label: 'Category',
        dataType: 'enum',
        required: true,
        description: 'Work category.',
        example: 'PLUMBING',
        allowedValues: ['PLUMBING', 'ELECTRICAL', 'CARPENTRY', 'MASONRY', 'PAINTING', 'APPLIANCE', 'HVAC', 'GENERAL'],
        aliases: ['type', 'service']
      },
      { key: 'title', label: 'Title / Summary', dataType: 'string', required: true, description: 'Brief issue headline.', example: 'Kitchen sink leak', aliases: ['summary', 'headline', 'issue'] },
      { key: 'estimated_cost_kes', label: 'Est. Cost (KES)', dataType: 'currency', required: false, description: 'Estimated repair cost.', example: '2500', aliases: ['cost', 'estimate'] },
      { key: 'priority', label: 'Priority', dataType: 'enum', required: false, description: 'Urgency level.', example: 'HIGH', allowedValues: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], aliases: ['urgency'] },
    ],
    sampleRows: [
      { request_number: 'MNT-202611-001', unit_number: 'A-101', category: 'PLUMBING', title: 'Leaking kitchen pipe under sink', estimated_cost_kes: '2500', priority: 'HIGH' },
    ],
  },

  vendors: {
    module: 'vendors',
    title: 'Service Vendors & Contractors',
    description: 'Vetted artisans, plumbers, electricians, security firms, and suppliers.',
    fields: [
      { key: 'vendor_name', label: 'Vendor / Contractor Name', dataType: 'string', required: true, description: 'Business or individual name.', example: 'Fundi Express Plumbers', aliases: ['name', 'company'] },
      { key: 'specialty', label: 'Trade / Specialty', dataType: 'string', required: true, description: 'Primary technical service.', example: 'Plumbing & Drainage', aliases: ['trade', 'category'] },
      { key: 'phone', label: 'Contact Phone', dataType: 'phone', required: true, description: 'Operational phone number.', example: '254711223344', aliases: ['contact', 'mobile'] },
      { key: 'email', label: 'Email Address', dataType: 'string', required: false, description: 'Business email address.', example: 'orders@fundiexpress.co.ke', aliases: ['email'] },
      { key: 'kra_pin', label: 'KRA PIN', dataType: 'string', required: false, description: 'Kenyan tax PIN.', example: 'P051234567A', aliases: ['tax_pin', 'pin'] },
    ],
    sampleRows: [
      { vendor_name: 'Fundi Express Plumbers', specialty: 'Plumbing & Sanitation', phone: '0711223344', email: 'orders@fundiexpress.co.ke', kra_pin: 'P051234567A' },
      { vendor_name: 'MetroVolt Electricals Ltd', specialty: 'Electrical Systems', phone: '0722334455', email: 'info@metrovolt.co.ke', kra_pin: 'P059876543B' },
    ],
  },

  expenses: {
    module: 'expenses',
    title: 'Property Expenses & Operating Costs',
    description: 'Operating expenditures, utility vouchers, security invoices, and repairs.',
    fields: [
      { key: 'expense_date', label: 'Expense Date', dataType: 'date', required: true, description: 'Date incurred (YYYY-MM-DD).', example: '2026-11-01', aliases: ['date', 'voucher_date'] },
      {
        key: 'category',
        label: 'Expense Category',
        dataType: 'enum',
        required: true,
        description: 'Accounting category.',
        example: 'UTILITIES_WATER',
        allowedValues: ['UTILITIES_WATER', 'UTILITIES_ELECTRICITY', 'MAINTENANCE_REPAIRS', 'SECURITY_SERVICES', 'GARBAGE_COLLECTION', 'MANAGEMENT_FEES', 'INSURANCE', 'LEGAL_STATUTORY', 'OTHER_OPERATING'],
        aliases: ['type', 'account']
      },
      { key: 'amount_kes', label: 'Amount (KES)', dataType: 'currency', required: true, description: 'Expenditure amount in KES.', example: '12500', aliases: ['amount', 'cost', 'total'] },
      { key: 'payee_vendor', label: 'Payee / Vendor', dataType: 'string', required: true, description: 'Recipient of payment.', example: 'Nairobi Water (NCWSC)', aliases: ['vendor', 'payee'] },
      { key: 'reference_number', label: 'Voucher / Receipt Ref', dataType: 'string', required: false, description: 'Invoice or payment code.', example: 'NCWSC-VOUCH-01', aliases: ['reference', 'voucher_no'] },
      { key: 'description', label: 'Description', dataType: 'string', required: false, description: 'Details of service or goods.', example: 'Common area water bill for Oct', aliases: ['notes', 'memo'] },
    ],
    sampleRows: [
      { expense_date: '2026-11-01', category: 'UTILITIES_WATER', amount_kes: '12500', payee_vendor: 'Nairobi Water (NCWSC)', reference_number: 'NCWSC-OCT-01', description: 'Compound water bill' },
      { expense_date: '2026-11-02', category: 'SECURITY_SERVICES', amount_kes: '45000', payee_vendor: 'G4S Kenya Ltd', reference_number: 'G4S-INV-8812', description: 'October 24/7 guard services' },
    ],
  },

  inspections: {
    module: 'inspections',
    title: 'Property & Unit Inspections',
    description: 'Move-in, move-out, routine maintenance, and compliance audits.',
    fields: [
      { key: 'inspection_code', label: 'Inspection Code', dataType: 'string', required: true, description: 'Unique audit identifier.', example: 'INSP-202611-01', aliases: ['code', 'report_no'] },
      { key: 'unit_number', label: 'Unit Number', dataType: 'string', required: true, description: 'Inspected unit.', example: 'A-101', aliases: ['unit'] },
      {
        key: 'inspection_type',
        label: 'Type',
        dataType: 'enum',
        required: true,
        description: 'Inspection milestone.',
        example: 'MOVE_IN',
        allowedValues: ['MOVE_IN', 'MOVE_OUT', 'ROUTINE_QUARTERLY', 'EMERGENCY', 'ANNUAL_COMPLIANCE'],
        aliases: ['type', 'category']
      },
      { key: 'inspection_date', label: 'Inspection Date', dataType: 'date', required: true, description: 'Date of audit (YYYY-MM-DD).', example: '2026-11-03', aliases: ['date'] },
      { key: 'inspector_name', label: 'Inspector Name', dataType: 'string', required: true, description: 'Staff or agent performing audit.', example: 'Peter Mwangi', aliases: ['inspector', 'auditor'] },
      { key: 'overall_condition', label: 'Condition', dataType: 'enum', required: false, description: 'Assessment score.', example: 'EXCELLENT', allowedValues: ['EXCELLENT', 'GOOD', 'FAIR', 'REQUIRES_REPAIRS', 'CRITICAL_DAMAGE'], aliases: ['condition', 'rating'] },
      { key: 'notes', label: 'Inspection Notes', dataType: 'string', required: false, description: 'Detailed observations.', example: 'Fixtures intact, clean paintwork', aliases: ['remarks', 'findings'] },
    ],
    sampleRows: [
      { inspection_code: 'INSP-202611-01', unit_number: 'A-101', inspection_type: 'MOVE_IN', inspection_date: '2026-11-03', inspector_name: 'Peter Mwangi', overall_condition: 'EXCELLENT', notes: 'Fixtures verified in good working order.' },
    ],
  },

  documents: {
    module: 'documents',
    title: 'Document Registry',
    description: 'Lease contracts, title deeds, KRA tax certificates, and compliance permits.',
    fields: [
      { key: 'document_title', label: 'Document Title', dataType: 'string', required: true, description: 'File title.', example: 'Title Deed - Kilimani Parcel', aliases: ['title', 'name'] },
      { key: 'document_category', label: 'Category', dataType: 'enum', required: true, description: 'Document type.', example: 'TITLE_DEED', allowedValues: ['LEASE_AGREEMENT', 'TITLE_DEED', 'TENANT_ID', 'UTILITY_BILL', 'INSPECTION_REPORT', 'TAX_COMPLIANCE', 'OTHER'], aliases: ['category', 'type'] },
      { key: 'file_name', label: 'File Name', dataType: 'string', required: true, description: 'Digital file name.', example: 'signed_lease_A101.pdf', aliases: ['file', 'attachment'] },
      { key: 'linked_reference', label: 'Linked Reference', dataType: 'string', required: false, description: 'Unit, Tenant, or Property code.', example: 'Unit A-101', aliases: ['reference', 'link'] },
    ],
    sampleRows: [
      { document_title: 'Signed Tenancy Agreement - Unit A-101', document_category: 'LEASE_AGREEMENT', file_name: 'lease_A101.pdf', linked_reference: 'Unit A-101' },
    ],
  },
};

/**
 * Standard RFC 4180 CSV parser supporting escaped commas, quotes, and newlines
 */
export function parseCsv(text: string): Record<string, string>[] {
  const lines: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some((c) => c.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((c) => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map((h) => h.replace(/^\uFEFF/, '').trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowObj: Record<string, string> = {};
    const cols = lines[i];
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = (cols[j] ?? '').trim();
    }
    rows.push(rowObj);
  }

  return rows;
}

/**
 * Parses tab-separated spreadsheet values from clipboard paste (Excel / Google Sheets)
 */
export function parseClipboardTsv(tsvText: string, expectedHeaders?: string[]): Record<string, string>[] {
  const lines = tsvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const firstLineCols = lines[0].split('\t').map((c) => c.trim());

  // Check if first line appears to be headers or data
  const hasHeaders = expectedHeaders
    ? firstLineCols.some((c) => expectedHeaders.some((eh) => eh.toLowerCase() === c.toLowerCase()))
    : false;

  let headers: string[] = [];
  let dataLines: string[] = [];

  if (hasHeaders) {
    headers = firstLineCols;
    dataLines = lines.slice(1);
  } else if (expectedHeaders && expectedHeaders.length > 0) {
    headers = expectedHeaders;
    dataLines = lines;
  } else {
    headers = firstLineCols.map((_, i) => `Column_${i + 1}`);
    dataLines = lines;
  }

  const result: Record<string, string>[] = [];
  for (const line of dataLines) {
    const cells = line.split('\t').map((c) => c.trim());
    const obj: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = cells[i] ?? '';
    }
    result.push(obj);
  }

  return result;
}

/**
 * Automatically maps raw source file headers to template field keys
 */
export function autoMapColumns(
  sourceHeaders: string[],
  moduleKey: ImportModuleKey
): Record<string, string> {
  const template = MODULE_TEMPLATES[moduleKey];
  if (!template) return {};

  const mapping: Record<string, string> = {};

  for (const field of template.fields) {
    const targetKey = field.key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetLabel = field.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    const aliases = (field.aliases || []).map((a) => a.toLowerCase().replace(/[^a-z0-9]/g, ''));

    // Find best match among source headers
    for (const src of sourceHeaders) {
      const cleanSrc = src.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchAlias = aliases.some(
        (a) => a === cleanSrc || cleanSrc.includes(a) || a.includes(cleanSrc)
      );
      if (
        cleanSrc === targetKey ||
        cleanSrc === targetLabel ||
        matchAlias ||
        cleanSrc.includes(targetKey) ||
        targetKey.includes(cleanSrc)
      ) {
        mapping[field.key] = src;
        break;
      }
    }
  }

  return mapping;
}

/**
 * Normalizes Kenyan MSISDN to standard international format (2547XXXXXXXX or 2541XXXXXXXX)
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) return `254${digits}`;
  return null;
}

/**
 * Client-side validation mirroring server-side validation rules
 */
export function validateImportRows(
  moduleKey: ImportModuleKey,
  rawRows: Record<string, any>[],
  columnMapping?: Record<string, string>
): ValidationSummary {
  const template = MODULE_TEMPLATES[moduleKey];
  const errors: RowError[] = [];
  const previewRows: PreviewRow[] = [];
  let duplicateCount = 0;
  const seenIdentities = new Map<string, number>();

  const identityKey = template.fields[0].key;

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const mapped: Record<string, any> = {};
    const rowErrors: string[] = [];

    template.fields.forEach((fieldDef) => {
      const srcCol = columnMapping ? columnMapping[fieldDef.key] || fieldDef.key : fieldDef.key;
      const rawVal = row[srcCol] ?? row[fieldDef.label] ?? '';
      let strVal = String(rawVal ?? '').trim();

      // Required check
      if (fieldDef.required && !strVal) {
        const err: RowError = {
          rowIndex: rowNum,
          field: fieldDef.key,
          value: strVal,
          errorCode: 'REQUIRED_FIELD_MISSING',
          errorMessage: `'${fieldDef.label}' is mandatory and cannot be empty.`,
          suggestion: `Provide a valid value like '${fieldDef.example}'.`,
        };
        errors.push(err);
        rowErrors.push(err.errorMessage);
      }

      // Type checks
      if (strVal) {
        if (fieldDef.dataType === 'currency' || fieldDef.dataType === 'number') {
          const cleanNum = strVal.replace(/[^\d.-]/g, '');
          if (isNaN(Number(cleanNum)) || cleanNum.length === 0) {
            const err: RowError = {
              rowIndex: rowNum,
              field: fieldDef.key,
              value: strVal,
              errorCode: 'INVALID_NUMERIC',
              errorMessage: `'${fieldDef.label}' must be a valid number (received '${strVal}').`,
              suggestion: `Example: ${fieldDef.example}`,
            };
            errors.push(err);
            rowErrors.push(err.errorMessage);
          }
        } else if (fieldDef.dataType === 'phone') {
          const norm = normalizePhone(strVal);
          if (!norm) {
            const err: RowError = {
              rowIndex: rowNum,
              field: fieldDef.key,
              value: strVal,
              errorCode: 'INVALID_KENYAN_PHONE',
              errorMessage: `'${strVal}' is not a valid Kenyan phone number.`,
              suggestion: `Format as 07XXXXXXXX or 2547XXXXXXXX.`,
            };
            errors.push(err);
            rowErrors.push(err.errorMessage);
          } else {
            strVal = norm;
          }
        } else if (fieldDef.dataType === 'date') {
          const isDate = /^\d{4}-\d{2}-\d{2}$/.test(strVal) && !isNaN(Date.parse(strVal));
          if (!isDate) {
            const err: RowError = {
              rowIndex: rowNum,
              field: fieldDef.key,
              value: strVal,
              errorCode: 'INVALID_DATE_FORMAT',
              errorMessage: `'${fieldDef.label}' must be in YYYY-MM-DD format (received '${strVal}').`,
              suggestion: 'Use format YYYY-MM-DD (e.g. 2026-12-01).',
            };
            errors.push(err);
            rowErrors.push(err.errorMessage);
          }
        } else if (fieldDef.dataType === 'enum' && fieldDef.allowedValues) {
          const upper = strVal.toUpperCase();
          if (!fieldDef.allowedValues.some((v) => v.toUpperCase() === upper)) {
            const err: RowError = {
              rowIndex: rowNum,
              field: fieldDef.key,
              value: strVal,
              errorCode: 'INVALID_ENUM',
              errorMessage: `'${strVal}' is not a valid option for '${fieldDef.label}'.`,
              suggestion: `Allowed: ${fieldDef.allowedValues.join(', ')}`,
            };
            errors.push(err);
            rowErrors.push(err.errorMessage);
          }
        }
      }

      mapped[fieldDef.key] = strVal;
    });

    // In-batch duplicate check
    let isDuplicate = false;
    const identVal = mapped[identityKey];
    if (identVal) {
      if (seenIdentities.has(identVal)) {
        isDuplicate = true;
        duplicateCount++;
        const firstRow = seenIdentities.get(identVal);
        const err: RowError = {
          rowIndex: rowNum,
          field: identityKey,
          value: identVal,
          errorCode: 'DUPLICATE_IN_BATCH',
          errorMessage: `Duplicate key '${identVal}' already appeared on row ${firstRow}.`,
          suggestion: 'Ensure unique identifier across all batch rows.',
        };
        errors.push(err);
        rowErrors.push(err.errorMessage);
      } else {
        seenIdentities.set(identVal, rowNum);
      }
    }

    const status = rowErrors.length > 0 ? (isDuplicate ? 'DUPLICATE' : 'INVALID') : 'VALID';

    previewRows.push({
      rowIndex: rowNum,
      status,
      fields: mapped,
      errors: rowErrors,
    });
  });

  const totalRows = rawRows.length;
  const invalidRowsCount = previewRows.filter((r) => r.status === 'INVALID' || r.status === 'DUPLICATE').length;
  const validRowsCount = totalRows - invalidRowsCount;

  return {
    module: moduleKey,
    totalRows,
    validRowsCount,
    invalidRowsCount,
    duplicateRowsCount: duplicateCount,
    errors,
    previewRows,
  };
}

/**
 * Generates and downloads a clean CSV template file
 */
export function generateTemplateCsv(moduleKey: ImportModuleKey): string {
  const template = MODULE_TEMPLATES[moduleKey];
  if (!template) return '';

  const headers = template.fields.map((f) => f.key);
  const rows = template.sampleRows.map((row) =>
    headers.map((h) => {
      const val = String(row[h] ?? '');
      return val.includes(',') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Exports arbitrary data rows to CSV file in browser or returns CSV string
 */
export function exportRowsToCsv(
  param1: string | FieldDefinition[],
  rows: Record<string, any>[],
  explicitHeaders?: string[]
): string {
  if (!rows || rows.length === 0) return '';

  let headers: string[] = [];
  let filename: string | null = null;

  if (Array.isArray(param1)) {
    headers = param1.map((f) => f.key);
  } else {
    filename = param1;
    headers = explicitHeaders || Object.keys(rows[0]);
  }

  const lines: string[] = [headers.join(',')];

  for (const row of rows) {
    const rowVals = headers.map((h) => {
      const val = String(row[h] ?? '');
      return val.includes(',') || val.includes('"') || val.includes('\n')
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    });
    lines.push(rowVals.join(','));
  }

  const output = lines.join('\n');

  if (filename && typeof document !== 'undefined') {
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(output);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return output;
}
