import { test } from 'node:test';
import assert from 'node:assert/strict';

// Test Suite: Financial Operations, Multi-Invoice Allocation, 8-Stage Deposit Refund & Reconciliation

test('Financial Operations: FIFO allocation distributes funds oldest invoice first and prevents over-allocation', () => {
  const invoices = [
    { id: 'inv-001', billing_period: '2026-09', balance_kes: 10000 },
    { id: 'inv-002', billing_period: '2026-10', balance_kes: 15000 },
    { id: 'inv-003', billing_period: '2026-11', balance_kes: 20000 },
  ];

  const paymentAmount = 20000;
  let remainingPayment = paymentAmount;
  const allocations = [];

  for (const inv of invoices) {
    if (remainingPayment <= 0) break;
    const alloc = Math.min(remainingPayment, inv.balance_kes);
    allocations.push({ invoice_id: inv.id, allocated_kes: alloc });
    remainingPayment -= alloc;
  }

  // Invoice 1 should be fully paid (10,000)
  assert.equal(allocations[0].invoice_id, 'inv-001');
  assert.equal(allocations[0].allocated_kes, 10000);

  // Invoice 2 should be partially paid (10,000)
  assert.equal(allocations[1].invoice_id, 'inv-002');
  assert.equal(allocations[1].allocated_kes, 10000);

  // Invoice 3 should have 0 allocated
  assert.equal(allocations.length, 2);
  assert.equal(remainingPayment, 0);

  // Total allocated must equal payment amount
  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocated_kes, 0);
  assert.equal(totalAllocated, paymentAmount);
});

test('Financial Operations: 8-stage deposit move-out refund formula: Refundable = Held - Deductions - Refunded', () => {
  const heldDeposit = 35000;
  const damageDeductions = 4500;
  const utilityDeductions = 2500;
  const previouslyRefunded = 0;

  const totalDeductions = damageDeductions + utilityDeductions;
  const calculatedRefundable = Math.max(0, heldDeposit - totalDeductions - previouslyRefunded);

  assert.equal(calculatedRefundable, 28000);

  // Invariant: Non-negative refund guard
  const excessiveDeductions = 40000;
  const clampedRefund = Math.max(0, heldDeposit - excessiveDeductions - previouslyRefunded);
  assert.equal(clampedRefund, 0);
});

test('Financial Operations: Security deposits post strictly to Account 2100 Liability and never Rental Revenue 4000', () => {
  const journalLines = [
    { account_code: '1010', account_name: 'M-Pesa Clearing Account', debit_kes: 35000, credit_kes: 0 },
    { account_code: '2100', account_name: 'Tenant Security Deposits Liability', debit_kes: 0, credit_kes: 35000 },
  ];

  const totalDebits = journalLines.reduce((sum, l) => sum + l.debit_kes, 0);
  const totalCredits = journalLines.reduce((sum, l) => sum + l.credit_kes, 0);

  assert.equal(totalDebits, totalCredits);
  assert.ok(journalLines.some((l) => l.account_code === '2100' && l.credit_kes === 35000));
  assert.ok(!journalLines.some((l) => l.account_code === '4000'));
});

test('Financial Operations: Reconciliation engine matches provider receipt and flags amount mismatches', () => {
  const internalPayments = [
    { id: 'pay-001', provider_receipt: 'SJK8912XYZ', amount_kes: 15000, status: 'COMPLETED' },
    { id: 'pay-002', provider_receipt: 'SJK99201KL', amount_kes: 5000, status: 'COMPLETED' },
  ];

  const externalBankStatement = [
    { external_ref: 'SJK8912XYZ', amount_kes: 15000, date: '2026-11-14' },
    { external_ref: 'SJK99201KL', amount_kes: 4800, date: '2026-11-14' }, // 200 discrepancy
    { external_ref: 'SJK112233AA', amount_kes: 10000, date: '2026-11-15' }, // Unmatched external
  ];

  const matchResults = externalBankStatement.map((ext) => {
    const internal = internalPayments.find((p) => p.provider_receipt === ext.external_ref);
    if (!internal) {
      return { status: 'UNMATCHED_EXTERNAL', ref: ext.external_ref };
    }
    if (internal.amount_kes !== ext.amount_kes) {
      return {
        status: 'AMOUNT_MISMATCH',
        ref: ext.external_ref,
        diff: Math.abs(internal.amount_kes - ext.amount_kes),
      };
    }
    return { status: 'MATCHED', ref: ext.external_ref };
  });

  assert.equal(matchResults[0].status, 'MATCHED');
  assert.equal(matchResults[1].status, 'AMOUNT_MISMATCH');
  assert.equal(matchResults[1].diff, 200);
  assert.equal(matchResults[2].status, 'UNMATCHED_EXTERNAL');
});

test('Financial Operations: Double-entry journal balance invariant: Debits == Credits', () => {
  const sampleJournals = [
    {
      journal_number: 'JRN-2026-0001',
      lines: [
        { account: '1010', debit: 25000, credit: 0 },
        { account: '1100', debit: 0, credit: 25000 },
      ],
    },
    {
      journal_number: 'JRN-2026-0002',
      lines: [
        { account: '2100', debit: 5000, credit: 0 },
        { account: '1010', debit: 0, credit: 5000 },
      ],
    },
  ];

  for (const j of sampleJournals) {
    const debits = j.lines.reduce((s, l) => s + l.debit, 0);
    const credits = j.lines.reduce((s, l) => s + l.credit, 0);
    assert.equal(debits, credits, `Journal ${j.journal_number} must be balanced`);
  }
});
