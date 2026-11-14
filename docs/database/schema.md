# Guri24 RMS — PostgreSQL Schema & Financial Integrity Specification

## 1. Core Database Principles
- **Monetary Precision**: All currency columns use `NUMERIC(14, 2)` in `KES`. Floating-point types (`REAL`, `DOUBLE PRECISION`) are prohibited.
- **UUID Primary Keys**: All tables use `UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Multi-Tenant Partitioning**: Every tenant-scoped table carries `organization_id UUID NOT NULL REFERENCES organizations(id)` with composite indexes `(organization_id, ...)`.
- **Immutability of Posted Ledger Entries**: PostgreSQL trigger `prevent_posted_financial_deletion()` (`0005_accounting_double_entry.sql`) raises an exception on any `DELETE` against `journal_entries` or `journal_lines`. Corrections must use reversing journal entries (`reversal_of_id`).

---

## 2. Migration Domains (`backend/migrations/`)

1. **`0001_init_saas_and_identity.sql`**
   - `organizations` (KRA PIN, KES currency, `Africa/Nairobi` timezone)
   - `subscription_plans`, `organization_subscriptions`
   - `users` (`password_hash` Argon2id), `roles`, `permissions`, `role_permissions`, `organization_memberships`, `refresh_tokens`
2. **`0002_properties_buildings_floors_units.sql`**
   - `properties` -> `buildings` -> `floors` -> `units`
   - `unit_amenities`, `utility_meters`, `unit_status_history`
   - Unique constraint: `UNIQUE(organization_id, building_id, unit_number)`
3. **`0003_tenants_applications_leases.sql`**
   - `tenants`, `tenant_contacts`, `guarantors`
   - `rental_applications`
   - `leases`, `lease_occupants`, `lease_charges`, `lease_renewals`, `move_in_checklists`, `move_out_checklists`
4. **`0004_billing_payments_mpesa_deposits.sql`**
   - `recurring_charge_schedules`, `invoices`, `invoice_lines`, `credit_notes`, `late_fee_rules`, `arrears_cases`
   - `payment_methods`, `payments`, `payment_allocations`, `receipts`, `unmatched_payments`
   - `mpesa_configurations`, `mpesa_stk_requests`, `mpesa_callbacks` (`UNIQUE(mpesa_receipt_number)`), `payment_reconciliation_items`
   - `security_deposits`, `deposit_deductions`, `deposit_refunds`
5. **`0005_accounting_double_entry.sql`**
   - `accounts` (Chart of Accounts: `1000` Cash/Bank, `1010` M-Pesa Clearing, `1100` Tenant A/R, `2000` Tenant Prepayments, `2100` Security Deposits Liability, `4000` Rental Income, `4100` Utility Income, `4200` Late Fee Income, `5000` Maintenance Expense, `5100` Property Expense)
   - `journal_entries`, `journal_lines`, `expense_categories`, `expenses`, `owner_payouts`
6. **`0006_maintenance_documents_notifications_audit.sql`**
   - `vendors`, `maintenance_requests`, `maintenance_photos`, `work_orders`, `work_order_costs`, `inspections`, `inspection_items`
   - `documents` (private S3 storage key), `notification_templates`, `notifications`, `notification_deliveries`, `audit_logs`, `outbox_events`
