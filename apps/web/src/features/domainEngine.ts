import {
  formatKes,
  formatNextStatusLabel,
  getValidNextMaintenanceStatuses,
  maskKenyanNationalId,
  normalizeKenyanPhone,
  parseKesCents,
  formatCentsToDecimal,
} from '../lib/formatters';
import type {
  Invoice,
  JournalEntry,
  Lease,
  MaintenanceStatus,
  RoleName,
  Unit,
} from '../types';

export interface TenantScopedRecord {
  id: string;
  organization_id: string;
}

/**
 * Scenario 1: Multi-tenant isolation guard.
 * Never trusts client-supplied organization_id; filters strictly by authenticated context.
 */
export function enforceTenantIsolation<T extends TenantScopedRecord>(
  authenticatedOrgId: string,
  record: T,
): T {
  if (record.organization_id !== authenticatedOrgId) {
    throw new Error('TENANT_ISOLATION_VIOLATION: Cross-organization access denied');
  }
  return record;
}

/**
 * Scenario 4: Lease overlap and activation check.
 */
export function canActivateLease(
  candidate: Pick<Lease, 'unit_id' | 'start_date' | 'end_date' | 'rent_amount' | 'due_day'>,
  existingLeases: Pick<Lease, 'id' | 'unit_id' | 'start_date' | 'end_date' | 'status'>[],
): { valid: boolean; reason?: string } {
  if (parseKesCents(candidate.rent_amount) <= 0n) {
    return { valid: false, reason: 'Monthly rent must be greater than KES 0.00' };
  }
  if (candidate.due_day < 1 || candidate.due_day > 28) {
    return { valid: false, reason: 'Due day must be between 1 and 28' };
  }
  const start = candidate.start_date;
  const end = candidate.end_date ?? '9999-12-31';
  if (end < start) {
    return { valid: false, reason: 'Lease end date cannot precede start date' };
  }

  const overlapping = existingLeases.find((existing) => {
    if (existing.unit_id !== candidate.unit_id) return false;
    if (existing.status !== 'Active' && existing.status !== 'Approved' && existing.status !== 'ExpiringSoon') {
      return false;
    }
    const existingEnd = existing.end_date ?? '9999-12-31';
    return start <= existingEnd && end >= existing.start_date;
  });

  if (overlapping) {
    return {
      valid: false,
      reason: `Unit already has an active lease (${overlapping.id}) overlapping ${start}..${end}`,
    };
  }
  return { valid: true };
}

/**
 * Scenario 6 & 8: FIFO Payment Allocation across single or multiple invoices using integer cents.
 */
export function allocatePaymentFifo(
  paymentAmountDecimal: string,
  invoices: Invoice[],
): {
  updatedInvoices: Invoice[];
  allocations: { invoice_id: string; invoice_number: string; allocated_amount: string }[];
  unallocated_credit: string;
} {
  let remainingCents = parseKesCents(paymentAmountDecimal);
  if (remainingCents <= 0n) {
    throw new Error('Payment amount must be greater than zero');
  }

  const sorted = [...invoices].sort((a, b) => a.due_date.localeCompare(b.due_date));
  const allocations: { invoice_id: string; invoice_number: string; allocated_amount: string }[] = [];

  const updatedInvoices = sorted.map((inv) => {
    const balanceCents = parseKesCents(inv.balance);
    if (
      remainingCents <= 0n ||
      balanceCents <= 0n ||
      inv.status === 'Paid' ||
      inv.status === 'Void'
    ) {
      return inv;
    }

    const appliedCents = remainingCents >= balanceCents ? balanceCents : remainingCents;
    remainingCents -= appliedCents;

    const newPaidCents = parseKesCents(inv.amount_paid) + appliedCents;
    const newBalanceCents = balanceCents - appliedCents;

    allocations.push({
      invoice_id: inv.id,
      invoice_number: inv.invoice_number,
      allocated_amount: formatCentsToDecimal(appliedCents),
    });

    return {
      ...inv,
      amount_paid: formatCentsToDecimal(newPaidCents),
      balance: formatCentsToDecimal(newBalanceCents),
      status: (newBalanceCents === 0n ? 'Paid' : 'PartiallyPaid') as Invoice['status'],
    };
  });

  return {
    updatedInvoices,
    allocations,
    unallocated_credit: formatCentsToDecimal(remainingCents),
  };
}

/**
 * Scenario 9 & 10: Double-entry journal validator & security deposit liability check.
 */
export function validateDoubleEntryJournal(entry: JournalEntry, isSecurityDeposit = false): {
  balanced: boolean;
  totalDebits: string;
  totalCredits: string;
} {
  if (entry.lines.length < 2) {
    throw new Error('Journal entry requires at least 2 lines');
  }

  let debitCents = 0n;
  let creditCents = 0n;

  for (const line of entry.lines) {
    const d = parseKesCents(line.debit);
    const c = parseKesCents(line.credit);
    if ((d > 0n && c > 0n) || (d === 0n && c === 0n)) {
      throw new Error('Each journal line must have either a positive debit OR a positive credit');
    }
    if (isSecurityDeposit && line.account_code === '4000') {
      throw new Error(
        'ACCOUNTING_VIOLATION: Security deposits must be credited to Liability (2100), never Rental Revenue (4000)',
      );
    }
    debitCents += d;
    creditCents += c;
  }

  if (debitCents !== creditCents) {
    throw new Error(
      `UNBALANCED_JOURNAL: Debits (${formatCentsToDecimal(debitCents)}) != Credits (${formatCentsToDecimal(creditCents)})`,
    );
  }

  return {
    balanced: true,
    totalDebits: formatCentsToDecimal(debitCents),
    totalCredits: formatCentsToDecimal(creditCents),
  };
}

/**
 * Scenario 14: Role-Based Access Control check.
 */
export function hasPermission(role: RoleName, permission: string): boolean {
  const matrix: Record<RoleName, string[]> = {
    SuperAdmin: ['*'],
    OrganizationOwner: ['*'],
    PropertyManager: [
      'properties:write',
      'units:write',
      'tenants:write',
      'leases:write',
      'billing:write',
      'payments:write',
      'maintenance:write',
      'reports:read',
    ],
    Accountant: [
      'billing:write',
      'payments:write',
      'accounting:write',
      'deposits:write',
      'reports:read',
    ],
    Caretaker: ['units:read', 'maintenance:write', 'inspections:write'],
    MaintenanceTechnician: ['maintenance:write'],
    Auditor: ['accounting:read', 'reports:read', 'audit:read'],
    SupportAgent: ['tenants:read', 'maintenance:read', 'notifications:write'],
    Tenant: ['portal:self'],
  };

  const allowed = matrix[role] ?? [];
  return allowed.includes('*') || allowed.includes(permission);
}

export {
  formatKes,
  formatNextStatusLabel,
  getValidNextMaintenanceStatuses,
  maskKenyanNationalId,
  normalizeKenyanPhone,
  parseKesCents,
  formatCentsToDecimal,
};
export type { MaintenanceStatus, Unit };
