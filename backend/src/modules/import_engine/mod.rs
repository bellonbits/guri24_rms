use std::collections::HashMap;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;


#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ImportModule {
    Properties,
    Buildings,
    Floors,
    Units,
    Tenants,
    Leases,
    Invoices,
    Payments,
    Maintenance,
    Vendors,
    Expenses,
    Inspections,
    Documents,
}

impl ImportModule {
    pub fn from_str_slug(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "properties" => Some(Self::Properties),
            "buildings" => Some(Self::Buildings),
            "floors" => Some(Self::Floors),
            "units" => Some(Self::Units),
            "tenants" => Some(Self::Tenants),
            "leases" => Some(Self::Leases),
            "invoices" => Some(Self::Invoices),
            "payments" => Some(Self::Payments),
            "maintenance" => Some(Self::Maintenance),
            "vendors" => Some(Self::Vendors),
            "expenses" => Some(Self::Expenses),
            "inspections" => Some(Self::Inspections),
            "documents" => Some(Self::Documents),
            _ => None,
        }
    }

    pub fn to_slug(&self) -> &'static str {
        match self {
            Self::Properties => "properties",
            Self::Buildings => "buildings",
            Self::Floors => "floors",
            Self::Units => "units",
            Self::Tenants => "tenants",
            Self::Leases => "leases",
            Self::Invoices => "invoices",
            Self::Payments => "payments",
            Self::Maintenance => "maintenance",
            Self::Vendors => "vendors",
            Self::Expenses => "expenses",
            Self::Inspections => "inspections",
            Self::Documents => "documents",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemplateField {
    pub key: String,
    pub label: String,
    pub data_type: String, // "string", "number", "currency", "date", "phone", "enum", "boolean"
    pub required: bool,
    pub description: String,
    pub example: String,
    pub allowed_values: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportTemplate {
    pub module: ImportModule,
    pub title: String,
    pub description: String,
    pub fields: Vec<TemplateField>,
    pub sample_csv: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ConflictStrategy {
    SkipDuplicates,
    UpdateExisting,
    AbortOnError,
}

impl Default for ConflictStrategy {
    fn default() -> Self {
        Self::SkipDuplicates
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RowErrorDetail {
    pub row_index: usize,
    pub field: String,
    pub value: Option<String>,
    pub error_code: String,
    pub error_message: String,
    pub suggestion: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportPreviewRow {
    pub row_index: usize,
    pub status: String, // "VALID", "INVALID", "WARNING", "DUPLICATE"
    pub fields: HashMap<String, serde_json::Value>,
    pub errors: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportValidationResult {
    pub module: ImportModule,
    pub total_rows: usize,
    pub valid_rows_count: usize,
    pub invalid_rows_count: usize,
    pub duplicate_rows_count: usize,
    pub errors: Vec<RowErrorDetail>,
    pub preview_rows: Vec<ImportPreviewRow>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportJobRecord {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub user_id: Uuid,
    pub module: ImportModule,
    pub file_name: String,
    pub file_size_kb: usize,
    pub status: String, // "COMPLETED", "FAILED", "PARTIAL"
    pub total_rows: usize,
    pub inserted_count: usize,
    pub updated_count: usize,
    pub skipped_count: usize,
    pub failed_count: usize,
    pub conflict_strategy: ConflictStrategy,
    pub error_summary: Option<String>,
    pub errors: Vec<RowErrorDetail>,
    pub created_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ValidateImportCommand {
    pub module: String,
    pub raw_csv: Option<String>,
    pub rows: Option<Vec<HashMap<String, serde_json::Value>>>,
    pub column_mapping: Option<HashMap<String, String>>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CommitImportCommand {
    pub module: String,
    pub rows: Vec<HashMap<String, serde_json::Value>>,
    pub conflict_strategy: Option<ConflictStrategy>,
    pub file_name: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ExportErrorsCommand {
    pub errors: Vec<RowErrorDetail>,
}

pub struct ImportEngine;

impl ImportEngine {
    pub fn get_template(module: ImportModule) -> ImportTemplate {
        match module {
            ImportModule::Properties => ImportTemplate {
                module,
                title: "Properties Bulk Import Template".to_string(),
                description: "Import residential complexes, commercial estates, and apartment buildings.".to_string(),
                fields: vec![
                    TemplateField {
                        key: "name".to_string(),
                        label: "Property Name".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Official legal name of the property or estate.".to_string(),
                        example: "Jacaranda Heights".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "property_code".to_string(),
                        label: "Property Code".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Unique alphanumeric property code (e.g. PROP-001).".to_string(),
                        example: "JAC-001".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "county".to_string(),
                        label: "County".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Kenyan county where property is situated.".to_string(),
                        example: "Nairobi".to_string(),
                        allowed_values: Some(vec!["Nairobi".to_string(), "Mombasa".to_string(), "Kiambu".to_string(), "Machakos".to_string(), "Nakuru".to_string()]),
                    },
                    TemplateField {
                        key: "estate".to_string(),
                        label: "Estate / Locality".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "Neighborhood, suburb or estate name.".to_string(),
                        example: "Kilimani".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "land_registration_number".to_string(),
                        label: "Title / LR Number".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "Ministry of Lands LR Number.".to_string(),
                        example: "LR 209/14298".to_string(),
                        allowed_values: None,
                    },
                ],
                sample_csv: "name,property_code,county,estate,land_registration_number\nJacaranda Heights,JAC-001,Nairobi,Kilimani,LR 209/14298\nWestlands Brookside,WES-002,Nairobi,Westlands,LR 1870/IX/45".to_string(),
            },
            ImportModule::Units => ImportTemplate {
                module,
                title: "Units Bulk Import Template".to_string(),
                description: "Import residential units, apartments, penthouses, and studios.".to_string(),
                fields: vec![
                    TemplateField {
                        key: "unit_number".to_string(),
                        label: "Unit Number".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Door/unit identifier (e.g. A-101, B-204).".to_string(),
                        example: "A-101".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "property_code".to_string(),
                        label: "Property Code".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Target property code for foreign-key link.".to_string(),
                        example: "JAC-001".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "unit_type".to_string(),
                        label: "Unit Type".to_string(),
                        data_type: "enum".to_string(),
                        required: true,
                        description: "Architectural classification.".to_string(),
                        example: "TWO_BEDROOM".to_string(),
                        allowed_values: Some(vec![
                            "ONE_BEDROOM".to_string(),
                            "TWO_BEDROOM".to_string(),
                            "THREE_BEDROOM".to_string(),
                            "STUDIO".to_string(),
                            "BEDSITTER".to_string(),
                            "PENTHOUSE".to_string(),
                            "COMMERCIAL".to_string(),
                        ]),
                    },
                    TemplateField {
                        key: "monthly_rent_kes".to_string(),
                        label: "Monthly Rent (KES)".to_string(),
                        data_type: "currency".to_string(),
                        required: true,
                        description: "Contractual base monthly rent in KES.".to_string(),
                        example: "35000".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "security_deposit_kes".to_string(),
                        label: "Security Deposit (KES)".to_string(),
                        data_type: "currency".to_string(),
                        required: false,
                        description: "Refundable deposit requirement.".to_string(),
                        example: "35000".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "water_meter_number".to_string(),
                        label: "Water Meter Number".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "NCWSC or private water meter reference.".to_string(),
                        example: "NCWSC-77102".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "electricity_meter_number".to_string(),
                        label: "Electricity Meter Number".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "KPLC meter account or token number.".to_string(),
                        example: "KPLC-04192837".to_string(),
                        allowed_values: None,
                    },
                ],
                sample_csv: "unit_number,property_code,unit_type,monthly_rent_kes,security_deposit_kes,water_meter_number,electricity_meter_number\nA-101,JAC-001,TWO_BEDROOM,35000,35000,NCWSC-77101,KPLC-142091\nA-102,JAC-001,ONE_BEDROOM,25000,25000,NCWSC-77102,KPLC-142092\nB-201,JAC-001,THREE_BEDROOM,55000,55000,NCWSC-77103,KPLC-142093".to_string(),
            },
            ImportModule::Tenants => ImportTemplate {
                module,
                title: "Tenants Bulk Import Template".to_string(),
                description: "Import resident profiles, Kenyan National ID references, and M-Pesa phone numbers.".to_string(),
                fields: vec![
                    TemplateField {
                        key: "full_name".to_string(),
                        label: "Full Name".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Official full names as per National ID.".to_string(),
                        example: "Amina Hassan Noor".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "phone".to_string(),
                        label: "M-Pesa Phone Number".to_string(),
                        data_type: "phone".to_string(),
                        required: true,
                        description: "Kenyan MSISDN (e.g. 0712345678 or 254712345678).".to_string(),
                        example: "254712345678".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "email".to_string(),
                        label: "Email Address".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Email address for digital rent receipts.".to_string(),
                        example: "amina.noor@example.com".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "national_id".to_string(),
                        label: "National ID / Passport".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "Kenyan National ID or Alien Card.".to_string(),
                        example: "31223344".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "emergency_contact_name".to_string(),
                        label: "Emergency Contact Name".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "Next of kin full name.".to_string(),
                        example: "Hassan Noor".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "emergency_contact_phone".to_string(),
                        label: "Emergency Contact Phone".to_string(),
                        data_type: "phone".to_string(),
                        required: false,
                        description: "Next of kin phone number.".to_string(),
                        example: "254722998877".to_string(),
                        allowed_values: None,
                    },
                ],
                sample_csv: "full_name,phone,email,national_id,emergency_contact_name,emergency_contact_phone\nAmina Hassan Noor,0712345678,amina.noor@example.com,31223344,Hassan Noor,0722998877\nPeter Mwangi,0722111222,peter.mwangi@example.com,28445566,Grace Wanjiku,0733445566".to_string(),
            },
            ImportModule::Expenses => ImportTemplate {
                module,
                title: "Property Expenses Bulk Import Template".to_string(),
                description: "Import operational expenditures, utility bills, maintenance charges, and management fees.".to_string(),
                fields: vec![
                    TemplateField {
                        key: "expense_date".to_string(),
                        label: "Expense Date".to_string(),
                        data_type: "date".to_string(),
                        required: true,
                        description: "Date of expenditure (YYYY-MM-DD).".to_string(),
                        example: "2026-11-01".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "category".to_string(),
                        label: "Expense Category".to_string(),
                        data_type: "enum".to_string(),
                        required: true,
                        description: "Chart of Accounts category.".to_string(),
                        example: "UTILITIES_WATER".to_string(),
                        allowed_values: Some(vec![
                            "UTILITIES_WATER".to_string(),
                            "UTILITIES_ELECTRICITY".to_string(),
                            "MAINTENANCE_REPAIRS".to_string(),
                            "SECURITY_SERVICES".to_string(),
                            "GARBAGE_COLLECTION".to_string(),
                            "MANAGEMENT_FEES".to_string(),
                            "INSURANCE".to_string(),
                            "LEGAL_STATUTORY".to_string(),
                            "OTHER_OPERATING".to_string(),
                        ]),
                    },
                    TemplateField {
                        key: "amount_kes".to_string(),
                        label: "Amount (KES)".to_string(),
                        data_type: "currency".to_string(),
                        required: true,
                        description: "Total invoice or voucher amount in KES.".to_string(),
                        example: "12500".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "payee_vendor".to_string(),
                        label: "Vendor / Payee".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Contractor, utility company, or service provider.".to_string(),
                        example: "Nairobi City Water & Sewerage Co".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "reference_number".to_string(),
                        label: "Voucher / Receipt Reference".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "Vendor invoice number or M-Pesa code.".to_string(),
                        example: "INV-NCWSC-998".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "description".to_string(),
                        label: "Description / Notes".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "Detailed description of expense.".to_string(),
                        example: "Common area water bill for October 2026".to_string(),
                        allowed_values: None,
                    },
                ],
                sample_csv: "expense_date,category,amount_kes,payee_vendor,reference_number,description\n2026-11-01,UTILITIES_WATER,12500,Nairobi Water,NCWSC-0012,Common area water bill\n2026-11-02,SECURITY_SERVICES,45000,G4S Kenya,SEC-9921,Monthly perimeter security\n2026-11-05,MAINTENANCE_REPAIRS,8500,Fundi Express,FND-881,Plumbing repairs at Block A".to_string(),
            },
            _ => ImportTemplate {
                module,
                title: format!("{:?} Bulk Import Template", module),
                description: format!("Standard data import template for {:?}.", module),
                fields: vec![
                    TemplateField {
                        key: "reference_code".to_string(),
                        label: "Reference Code".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Authoritative identifier.".to_string(),
                        example: "REF-001".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "name_or_title".to_string(),
                        label: "Name / Title".to_string(),
                        data_type: "string".to_string(),
                        required: true,
                        description: "Title or entity name.".to_string(),
                        example: "Standard Record Item".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "amount_kes".to_string(),
                        label: "Amount (KES)".to_string(),
                        data_type: "currency".to_string(),
                        required: false,
                        description: "Financial amount if applicable.".to_string(),
                        example: "10000".to_string(),
                        allowed_values: None,
                    },
                    TemplateField {
                        key: "notes".to_string(),
                        label: "Notes / Description".to_string(),
                        data_type: "string".to_string(),
                        required: false,
                        description: "Additional operational notes.".to_string(),
                        example: "Operational record entry".to_string(),
                        allowed_values: None,
                    },
                ],
                sample_csv: "reference_code,name_or_title,amount_kes,notes\nREF-001,Sample Item One,10000,Initial setup record\nREF-002,Sample Item Two,25000,Follow-up record".to_string(),
            },
        }
    }

    pub fn validate_records(
        module: ImportModule,
        rows: &[HashMap<String, serde_json::Value>],
        column_mapping: Option<&HashMap<String, String>>,
    ) -> ImportValidationResult {
        let template = Self::get_template(module);
        let mut errors: Vec<RowErrorDetail> = Vec::new();
        let mut preview_rows: Vec<ImportPreviewRow> = Vec::new();
        let mut duplicate_count = 0;
        let mut seen_keys: HashMap<String, usize> = HashMap::new();

        let identity_field_key = match module {
            ImportModule::Properties => "property_code",
            ImportModule::Buildings => "building_code",
            ImportModule::Units => "unit_number",
            ImportModule::Tenants => "phone",
            ImportModule::Leases => "lease_number",
            ImportModule::Invoices => "invoice_number",
            ImportModule::Payments => "mpesa_receipt_number",
            ImportModule::Maintenance => "request_number",
            ImportModule::Vendors => "vendor_name",
            ImportModule::Expenses => "reference_number",
            ImportModule::Inspections => "inspection_code",
            _ => "reference_code",
        };

        for (idx, raw_row) in rows.iter().enumerate() {
            let row_num = idx + 1;
            let mut mapped_fields = HashMap::new();
            let mut row_errors = Vec::new();

            // Apply column mapping or direct matching
            for field_def in &template.fields {
                let source_key = if let Some(map) = column_mapping {
                    map.get(&field_def.key).cloned().unwrap_or_else(|| field_def.key.clone())
                } else {
                    field_def.key.clone()
                };

                let val_opt = raw_row.get(&source_key).or_else(|| raw_row.get(&field_def.label));
                let string_val = val_opt.and_then(|v| {
                    if v.is_string() {
                        v.as_str().map(|s| s.trim().to_string())
                    } else if v.is_null() {
                        None
                    } else {
                        Some(v.to_string())
                    }
                }).unwrap_or_default();

                // Required check
                if field_def.required && string_val.is_empty() {
                    let err = RowErrorDetail {
                        row_index: row_num,
                        field: field_def.key.clone(),
                        value: None,
                        error_code: "REQUIRED_FIELD_MISSING".to_string(),
                        error_message: format!("'{}' is a mandatory field and cannot be empty", field_def.label),
                        suggestion: Some(format!("Provide a valid value for '{}' (e.g. '{}')", field_def.label, field_def.example)),
                    };
                    row_errors.push(err.error_message.clone());
                    errors.push(err);
                }

                // Data type checks
                if !string_val.is_empty() {
                    match field_def.data_type.as_str() {
                        "currency" | "number" => {
                            let clean = string_val.replace(',', "").replace("KES", "").replace("Ksh", "").trim().to_string();
                            if clean.parse::<f64>().is_err() {
                                let err = RowErrorDetail {
                                    row_index: row_num,
                                    field: field_def.key.clone(),
                                    value: Some(string_val.clone()),
                                    error_code: "INVALID_NUMERIC_FORMAT".to_string(),
                                    error_message: format!("Field '{}' must be a valid numeric/currency amount (received '{}')", field_def.label, string_val),
                                    suggestion: Some(format!("Format as number like '{}'", field_def.example)),
                                };
                                row_errors.push(err.error_message.clone());
                                errors.push(err);
                            }
                        }
                        "phone" => {
                            let digits: String = string_val.chars().filter(|c| c.is_ascii_digit()).collect();
                            let is_valid_ke = (digits.starts_with("254") && digits.len() == 12)
                                || (digits.starts_with('0') && digits.len() == 10)
                                || (digits.starts_with('7') && digits.len() == 9)
                                || (digits.starts_with('1') && digits.len() == 9);

                            if !is_valid_ke {
                                let err = RowErrorDetail {
                                    row_index: row_num,
                                    field: field_def.key.clone(),
                                    value: Some(string_val.clone()),
                                    error_code: "INVALID_KENYAN_PHONE".to_string(),
                                    error_message: format!("'{}' is not a valid Kenyan phone number (must be 07XX, 01XX, or 2547XX)", string_val),
                                    suggestion: Some("Format phone like '0712345678' or '254712345678'".to_string()),
                                };
                                row_errors.push(err.error_message.clone());
                                errors.push(err);
                            }
                        }
                        "date" => {
                            if chrono::NaiveDate::parse_from_str(&string_val, "%Y-%m-%d").is_err() {
                                let err = RowErrorDetail {
                                    row_index: row_num,
                                    field: field_def.key.clone(),
                                    value: Some(string_val.clone()),
                                    error_code: "INVALID_DATE_FORMAT".to_string(),
                                    error_message: format!("'{}' must be in YYYY-MM-DD ISO date format", field_def.label),
                                    suggestion: Some("Use format YYYY-MM-DD (e.g. 2026-11-01)".to_string()),
                                };
                                row_errors.push(err.error_message.clone());
                                errors.push(err);
                            }
                        }
                        "enum" => {
                            if let Some(ref allowed) = field_def.allowed_values {
                                let upper = string_val.to_uppercase();
                                if !allowed.iter().any(|a| a.to_uppercase() == upper) {
                                    let err = RowErrorDetail {
                                        row_index: row_num,
                                        field: field_def.key.clone(),
                                        value: Some(string_val.clone()),
                                        error_code: "INVALID_ENUM_VALUE".to_string(),
                                        error_message: format!("'{}' is not an allowed value for '{}'", string_val, field_def.label),
                                        suggestion: Some(format!("Allowed values: {}", allowed.join(", "))),
                                    };
                                    row_errors.push(err.error_message.clone());
                                    errors.push(err);
                                }
                            }
                        }
                        _ => {}
                    }
                }

                mapped_fields.insert(field_def.key.clone(), serde_json::Value::String(string_val));
            }

            // In-batch duplicate detection
            let mut is_duplicate = false;
            if let Some(val) = mapped_fields.get(identity_field_key).and_then(|v| v.as_str()) {
                if !val.is_empty() {
                    if let Some(first_row) = seen_keys.get(val) {
                        is_duplicate = true;
                        duplicate_count += 1;
                        let err = RowErrorDetail {
                            row_index: row_num,
                            field: identity_field_key.to_string(),
                            value: Some(val.to_string()),
                            error_code: "DUPLICATE_KEY_IN_BATCH".to_string(),
                            error_message: format!("Duplicate identifier '{}' already encountered on row {}", val, first_row),
                            suggestion: Some("Ensure unique identifiers across all records in the batch.".to_string()),
                        };
                        row_errors.push(err.error_message.clone());
                        errors.push(err);
                    } else {
                        seen_keys.insert(val.to_string(), row_num);
                    }
                }
            }

            let status = if !row_errors.is_empty() {
                if is_duplicate { "DUPLICATE".to_string() } else { "INVALID".to_string() }
            } else {
                "VALID".to_string()
            };

            preview_rows.push(ImportPreviewRow {
                row_index: row_num,
                status,
                fields: mapped_fields,
                errors: row_errors,
            });
        }

        let total_rows = rows.len();
        let invalid_rows_count = preview_rows.iter().filter(|r| r.status == "INVALID" || r.status == "DUPLICATE").count();
        let valid_rows_count = total_rows.saturating_sub(invalid_rows_count);

        ImportValidationResult {
            module,
            total_rows,
            valid_rows_count,
            invalid_rows_count,
            duplicate_rows_count: duplicate_count,
            errors,
            preview_rows,
        }
    }

    pub fn export_errors_csv(errors: &[RowErrorDetail]) -> String {
        let mut out = String::from("Row Number,Field Name,Submitted Value,Error Code,Error Message,Suggested Fix\n");
        for err in errors {
            let val = err.value.as_deref().unwrap_or("");
            let clean_val = val.replace('"', "\"\"");
            let clean_msg = err.error_message.replace('"', "\"\"");
            let clean_sug = err.suggestion.as_deref().unwrap_or("").replace('"', "\"\"");
            out.push_str(&format!(
                "{},\"{}\",\"{}\",\"{}\",\"{}\",\"{}\"\n",
                err.row_index, err.field, clean_val, err.error_code, clean_msg, clean_sug
            ));
        }
        out
    }
}
