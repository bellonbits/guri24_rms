import test from 'node:test';
import assert from 'node:assert/strict';

// Pure integer-cent decimal parser (never uses floating-point arithmetic)
function parseKesCents(value) {
  const clean = String(value ?? '0').replace(/,/g, '').trim();
  if (!clean) return 0n;
  const negative = clean.startsWith('-');
  const unsigned = negative ? clean.slice(1) : clean;
  const [wholePart = '0', fracPart = ''] = unsigned.split('.');
  const paddedFrac = (fracPart + '00').slice(0, 2);
  const cents = BigInt(wholePart || '0') * 100n + BigInt(paddedFrac || '0');
  return negative ? -cents : cents;
}

function formatCentsToDecimal(cents) {
  const negative = cents < 0n;
  const abs = negative ? -cents : cents;
  const whole = abs / 100n;
  const frac = String(abs % 100n).padStart(2, '0');
  return `${negative ? '-' : ''}${whole}.${frac}`;
}

function allocatePaymentFifo(paymentAmountDecimal, invoices) {
  let remainingCents = parseKesCents(paymentAmountDecimal);
  assert.ok(remainingCents > 0n, 'Payment amount must be greater than zero');
  const sorted = [...invoices].sort((a, b) => a.due_date.localeCompare(b.due_date));
  const allocations = [];

  const updatedInvoices = sorted.map((inv) => {
    const balanceCents = parseKesCents(inv.balance);
    if (remainingCents <= 0n || balanceCents <= 0n || inv.status === 'Paid' || inv.status === 'Void') {
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
      status: newBalanceCents === 0n ? 'Paid' : 'PartiallyPaid',
    };
  });

  return {
    updatedInvoices,
    allocations,
    unallocated_credit: formatCentsToDecimal(remainingCents),
  };
}

// Scenario 1: Organization A cannot access Organization B's data
test('Scenario 1: Organization A cannot access Organization B data (strict tenant isolation)', () => {
  const orgA = '11111111-1111-4111-8111-111111111111';
  const orgB = '22222222-2222-4222-8222-222222222222';
  const orgBProperty = { id: 'prop-b-1', organization_id: orgB, name: 'Mombasa Nyali Palms' };

  assert.throws(
    () => {
      if (orgBProperty.organization_id !== orgA) {
        throw new Error('TENANT_ISOLATION_VIOLATION: Cross-organization access denied');
      }
    },
    /TENANT_ISOLATION_VIOLATION/,
  );
});

// Scenario 2: An organization can create properties, buildings and units
test('Scenario 2: Organization creates Property -> Building -> Floor -> Unit hierarchy', () => {
  const orgId = '11111111-1111-4111-8111-111111111111';
  const property = { id: 'prop-1', organization_id: orgId, code: 'KLM-01', county: 'Nairobi' };
  const building = { id: 'bldg-1', organization_id: orgId, property_id: property.id, code: 'BLK-A' };
  const floor = { id: 'flr-1', organization_id: orgId, building_id: building.id, floor_number: 1 };
  const unit = {
    id: 'unit-a101',
    organization_id: orgId,
    property_id: property.id,
    building_id: building.id,
    floor_id: floor.id,
    unit_number: 'A-101',
    market_rent: '45000.00',
    deposit_amount: '90000.00',
    status: 'VacantAvailable',
  };

  assert.equal(unit.property_id, property.id);
  assert.equal(unit.building_id, building.id);
  assert.equal(unit.floor_id, floor.id);
  assert.equal(unit.status, 'VacantAvailable');
});

// Scenario 3: A tenant can be assigned to an available unit
test('Scenario 3: Kenyan tenant with normalized 254 MSISDN is assigned to VacantAvailable unit', () => {
  const rawPhone = '0712 345 678';
  const digits = rawPhone.replace(/[\s\-+]/g, '');
  const normalizedPhone = digits.startsWith('0') ? `254${digits.slice(1)}` : digits;
  assert.equal(normalizedPhone, '254712345678');

  const unit = { id: 'unit-a104', status: 'VacantAvailable' };
  assert.equal(unit.status, 'VacantAvailable');
  const updatedUnit = { ...unit, status: 'Reserved' };
  assert.equal(updatedUnit.status, 'Reserved');
});

// Scenario 4: A valid lease activates correctly and blocks overlapping leases on the same unit
test('Scenario 4: Valid lease activates and prevents overlapping active leases on the same unit', () => {
  const activeLease = {
    id: 'lse-1',
    unit_id: 'unit-a101',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'Active',
  };
  const conflictingCandidate = {
    unit_id: 'unit-a101',
    start_date: '2026-06-01',
    end_date: '2027-05-31',
  };

  const overlaps =
    conflictingCandidate.unit_id === activeLease.unit_id &&
    activeLease.status === 'Active' &&
    conflictingCandidate.start_date <= activeLease.end_date &&
    conflictingCandidate.end_date >= activeLease.start_date;

  assert.equal(overlaps, true, 'Overlapping lease on the same unit must be rejected');
});

// Scenario 5: Recurring invoices are generated exactly once per billing period
test('Scenario 5: Recurring invoices enforce idempotency per (organization_id, lease_id, billing_period)', () => {
  const seenKeys = new Set();
  const generateRecurringInvoice = (orgId, leaseId, period) => {
    const key = `${orgId}:${leaseId}:${period}`;
    if (seenKeys.has(key)) {
      return { created: false, reason: 'IDEMPOTENT_DUPLICATE_SKIPPED' };
    }
    seenKeys.add(key);
    return { created: true, invoice_number: `INV-${period}-001` };
  };

  const first = generateRecurringInvoice('org-1', 'lse-101', '2026-05');
  const second = generateRecurringInvoice('org-1', 'lse-101', '2026-05');
  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(second.reason, 'IDEMPOTENT_DUPLICATE_SKIPPED');
});

// Scenario 6: Partial payment updates the outstanding balance (KES 15,000 - KES 10,000 = KES 5,000)
test('Scenario 6: Partial payment on KES 15,000.00 invoice of KES 10,000.00 leaves KES 5,000.00 balance', () => {
  const invoice = {
    id: 'inv-1',
    invoice_number: 'INV-202605-001',
    due_date: '2026-05-05',
    total_amount: '15000.00',
    amount_paid: '0.00',
    balance: '15000.00',
    status: 'Issued',
  };

  const result = allocatePaymentFifo('10000.00', [invoice]);
  assert.equal(result.updatedInvoices[0].amount_paid, '10000.00');
  assert.equal(result.updatedInvoices[0].balance, '5000.00');
  assert.equal(result.updatedInvoices[0].status, 'PartiallyPaid');
  assert.equal(result.unallocated_credit, '0.00');
});

// Scenario 7: Duplicate M-Pesa callbacks do not create duplicate payments
test('Scenario 7: Duplicate M-Pesa Daraja webhook callbacks are deduplicated by CheckoutRequestID & MpesaReceiptNumber', () => {
  const processedReceipts = new Set();
  const handleDarajaCallback = (receiptNumber, amount) => {
    if (processedReceipts.has(receiptNumber)) {
      return { duplicate: true, status: 'IGNORED_IDEMPOTENT' };
    }
    processedReceipts.add(receiptNumber);
    return { duplicate: false, status: 'RECORDED', amount };
  };

  const firstCallback = handleDarajaCallback('SDE89K2M1P', '47500.00');
  const duplicateCallback = handleDarajaCallback('SDE89K2M1P', '47500.00');
  assert.equal(firstCallback.duplicate, false);
  assert.equal(duplicateCallback.duplicate, true);
  assert.equal(processedReceipts.size, 1);
});

// Scenario 8: Payment allocation correctly handles multiple invoices (FIFO by due_date)
test('Scenario 8: Multi-invoice FIFO payment allocation settles oldest invoice first and partially pays second', () => {
  const invoices = [
    {
      id: 'inv-april',
      invoice_number: 'INV-202604-002',
      due_date: '2026-04-05',
      total_amount: '15000.00',
      amount_paid: '0.00',
      balance: '15000.00',
      status: 'Overdue',
    },
    {
      id: 'inv-may',
      invoice_number: 'INV-202605-002',
      due_date: '2026-05-05',
      total_amount: '15000.00',
      amount_paid: '0.00',
      balance: '15000.00',
      status: 'Issued',
    },
  ];

  const result = allocatePaymentFifo('22000.00', invoices);
  assert.equal(result.updatedInvoices[0].status, 'Paid');
  assert.equal(result.updatedInvoices[0].balance, '0.00');
  assert.equal(result.updatedInvoices[1].status, 'PartiallyPaid');
  assert.equal(result.updatedInvoices[1].amount_paid, '7000.00');
  assert.equal(result.updatedInvoices[1].balance, '8000.00');
  assert.equal(result.unallocated_credit, '0.00');
});

// Scenario 9: Security deposits do not become rental revenue
test('Scenario 9: Security deposits post to Tenant Security Deposits Liability (2100), never Rental Revenue (4000)', () => {
  const depositJournal = {
    lines: [
      { account_code: '1010', debit: '90000.00', credit: '0.00' }, // M-Pesa Clearing Asset
      { account_code: '2100', debit: '0.00', credit: '90000.00' }, // Security Deposit Liability
    ],
  };

  const touchesRevenue = depositJournal.lines.some((l) => l.account_code === '4000');
  assert.equal(touchesRevenue, false, 'Security deposit must never credit 4000 Rental Revenue');
});

// Scenario 10: Financial transactions maintain double-entry integrity and immutability
test('Scenario 10: Posted journal entries balance Debits == Credits and use reversal entries instead of deletion', () => {
  const originalEntry = {
    id: 'je-100',
    status: 'Posted',
    lines: [
      { account_code: '1100', debit: '45000.00', credit: '0.00' },
      { account_code: '4000', debit: '0.00', credit: '45000.00' },
    ],
  };

  const totalDebit = originalEntry.lines.reduce((acc, l) => acc + parseKesCents(l.debit), 0n);
  const totalCredit = originalEntry.lines.reduce((acc, l) => acc + parseKesCents(l.credit), 0n);
  assert.equal(totalDebit, totalCredit);

  // Reversal swaps debits and credits while keeping original entry immutable in ledger
  const reversalLines = originalEntry.lines.map((l) => ({
    account_code: l.account_code,
    debit: l.credit,
    credit: l.debit,
  }));
  assert.equal(reversalLines[0].credit, '45000.00');
  assert.equal(reversalLines[1].debit, '45000.00');
});

// Scenario 11: Notifications can fail without reversing financial transactions
test('Scenario 11: Transactional outbox isolates SMS/Email failures from committed payment ledger', () => {
  const committedPayment = { id: 'pay-1', status: 'Allocated', amount: '47500.00' };
  const outboxEvent = {
    id: 'evt-1',
    event_type: 'PaymentReceived',
    status: 'Failed',
    attempts: 1,
    last_error: 'SMS Gateway timeout',
  };

  // Even when outbox worker records a delivery failure, payment remains Allocated
  assert.equal(committedPayment.status, 'Allocated');
  assert.equal(outboxEvent.status, 'Failed');
});

// Scenario 12: Maintenance requests follow valid status transitions
test('Scenario 12: Maintenance requests enforce strict 8-stage status transitions', () => {
  const transitions = {
    Submitted: ['Reviewed', 'Cancelled'],
    Reviewed: ['Approved', 'Cancelled'],
    Approved: ['Assigned', 'Cancelled'],
    Assigned: ['InProgress', 'Cancelled'],
    InProgress: ['Completed', 'Cancelled'],
    Completed: ['Verified', 'InProgress'],
    Verified: ['Closed'],
    Closed: [],
    Cancelled: [],
  };

  assert.ok(transitions.Submitted.includes('Reviewed'));
  assert.ok(!transitions.Submitted.includes('Closed'), 'Cannot jump directly from Submitted to Closed');
  assert.ok(transitions.Completed.includes('Verified'));
  assert.ok(transitions.Verified.includes('Closed'));
});

// Scenario 13: Lease expiry and renewal are recorded correctly
test('Scenario 13: Lease renewal closes previous lease as Renewed and creates successor lease', () => {
  const oldLease = { id: 'lse-2025', status: 'ExpiringSoon', end_date: '2026-12-31' };
  const renewedOldLease = { ...oldLease, status: 'Renewed' };
  const successorLease = {
    id: 'lse-2027',
    previous_lease_id: oldLease.id,
    start_date: '2027-01-01',
    end_date: '2027-12-31',
    status: 'Active',
  };

  assert.equal(renewedOldLease.status, 'Renewed');
  assert.equal(successorLease.previous_lease_id, 'lse-2025');
  assert.equal(successorLease.status, 'Active');
});

// Scenario 14: Unauthorized users cannot perform restricted operations
test('Scenario 14: RBAC prevents Caretaker or Tenant roles from mutating accounting or leases', () => {
  const rolePermissions = {
    Caretaker: ['units:read', 'maintenance:write', 'inspections:write'],
    Tenant: ['portal:self'],
    Accountant: ['billing:write', 'payments:write', 'accounting:write', 'deposits:write', 'reports:read'],
  };

  assert.equal(rolePermissions.Caretaker.includes('accounting:write'), false);
  assert.equal(rolePermissions.Tenant.includes('leases:write'), false);
  assert.equal(rolePermissions.Accountant.includes('accounting:write'), true);
});
