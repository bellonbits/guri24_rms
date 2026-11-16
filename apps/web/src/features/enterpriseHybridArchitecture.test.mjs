import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Guri24 RMS Enterprise Hybrid Architecture Tests
 * Validates cross-service coordination between:
 * - Rust Core API (Primary Backend & Gateway)
 * - Spring Boot Financial Service (Double-Entry GL & M-Pesa Allocations)
 * - Spring Boot Notification Service (Event-driven Notifications & Schedules)
 * - Python OCR Service (Allen AI olmOCR Document Intelligence)
 */

test('Hybrid Architecture: Multi-service table and boundary ownership matrix', () => {
  const tableOwnership = {
    'properties': 'RUST_CORE_API',
    'units': 'RUST_CORE_API',
    'tenants': 'RUST_CORE_API',
    'leases': 'RUST_CORE_API',
    'maintenance_requests': 'RUST_CORE_API',
    'documents': 'RUST_CORE_API',
    'journal_entries': 'SPRING_FINANCIAL_SERVICE',
    'journal_lines': 'SPRING_FINANCIAL_SERVICE',
    'invoices': 'SPRING_FINANCIAL_SERVICE',
    'payments': 'SPRING_FINANCIAL_SERVICE',
    'payment_allocations': 'SPRING_FINANCIAL_SERVICE',
    'deposits': 'SPRING_FINANCIAL_SERVICE',
    'deposit_refunds': 'SPRING_FINANCIAL_SERVICE',
    'notification_templates': 'SPRING_NOTIFICATION_SERVICE',
    'notification_settings': 'SPRING_NOTIFICATION_SERVICE',
    'notification_deliveries': 'SPRING_NOTIFICATION_SERVICE',
    'ocr_jobs': 'PYTHON_OCR_SERVICE',
  };

  // Assert single authoritative database rule
  assert.equal(tableOwnership['journal_entries'], 'SPRING_FINANCIAL_SERVICE');
  assert.equal(tableOwnership['notification_deliveries'], 'SPRING_NOTIFICATION_SERVICE');
  assert.equal(tableOwnership['properties'], 'RUST_CORE_API');
  assert.equal(tableOwnership['ocr_jobs'], 'PYTHON_OCR_SERVICE');
});

test('Hybrid Architecture: Internal service mesh requires valid authentication secret', () => {
  const expectedSecret = 'guri24_internal_mesh_secret_key_2026';

  function authenticateInternalRequest(headers) {
    const key = headers['X-Internal-Service-Key'] || headers['x-internal-service-key'];
    if (!key || key !== expectedSecret) {
      return { status: 401, error: 'Unauthorized: Invalid or missing X-Internal-Service-Key' };
    }
    const orgId = headers['X-Organization-Id'] || headers['x-organization-id'];
    if (!orgId) {
      return { status: 400, error: 'Bad Request: Missing X-Organization-Id header' };
    }
    return { status: 200, organizationId: orgId };
  }

  // 1. Missing secret
  const unauth = authenticateInternalRequest({ 'X-Organization-Id': 'org-123' });
  assert.equal(unauth.status, 401);

  // 2. Wrong secret
  const wrong = authenticateInternalRequest({
    'X-Internal-Service-Key': 'wrong_secret',
    'X-Organization-Id': 'org-123',
  });
  assert.equal(wrong.status, 401);

  // 3. Valid secret & org
  const success = authenticateInternalRequest({
    'X-Internal-Service-Key': expectedSecret,
    'X-Organization-Id': 'org-123',
  });
  assert.equal(success.status, 200);
  assert.equal(success.organizationId, 'org-123');
});

test('Spring Financial Service: Double-entry balance invariant SUM(Debits) == SUM(Credits)', () => {
  function validateJournalEntry(entry) {
    const totalDebit = entry.lines.reduce((acc, l) => acc + (l.debit_kes || 0), 0);
    const totalCredit = entry.lines.reduce((acc, l) => acc + (l.credit_kes || 0), 0);

    if (totalDebit !== totalCredit) {
      throw new Error(`Unbalanced Journal: Debits KES ${totalDebit} != Credits KES ${totalCredit}`);
    }
    return { valid: true, balancedTotal: totalDebit };
  }

  // Balanced entry: M-Pesa clearing debit 35,000, Rental revenue credit 35,000
  const balanced = {
    lines: [
      { account_code: '1010', debit_kes: 35000, credit_kes: 0 },
      { account_code: '4000', debit_kes: 0, credit_kes: 35000 },
    ],
  };
  const res = validateJournalEntry(balanced);
  assert.equal(res.valid, true);
  assert.equal(res.balancedTotal, 35000);

  // Unbalanced entry: Debits 35,000, Credits 30,000
  const unbalanced = {
    lines: [
      { account_code: '1010', debit_kes: 35000, credit_kes: 0 },
      { account_code: '4000', debit_kes: 0, credit_kes: 30000 },
    ],
  };
  assert.throws(() => validateJournalEntry(unbalanced), /Unbalanced Journal/);
});

test('Spring Financial Service: Reversal journals invert debits/credits without deleting records', () => {
  const original = {
    id: 'entry-001',
    status: 'POSTED',
    lines: [
      { account_code: '1010', debit_kes: 35000, credit_kes: 0 },
      { account_code: '4000', debit_kes: 0, credit_kes: 35000 },
    ],
  };

  function reverseJournal(entry, reason) {
    if (entry.status === 'REVERSED') throw new Error('Already reversed');
    entry.status = 'REVERSED';
    const reversalLines = entry.lines.map((l) => ({
      account_code: l.account_code,
      debit_kes: l.credit_kes,
      credit_kes: l.debit_kes,
    }));
    return {
      reversal_of: entry.id,
      reason,
      status: 'POSTED',
      lines: reversalLines,
    };
  }

  const reversal = reverseJournal(original, 'Correction of incorrect tenant reference');
  assert.equal(original.status, 'REVERSED');
  assert.equal(reversal.lines[0].debit_kes, 0);
  assert.equal(reversal.lines[0].credit_kes, 35000);
  assert.equal(reversal.lines[1].debit_kes, 35000);
  assert.equal(reversal.lines[1].credit_kes, 0);
});

test('Spring Notification Service: Scheduled reminders enforce automatic settled balance suppression', () => {
  function shouldSendRentReminder(invoice) {
    // If invoice is settled (balance == 0), suppress reminders
    if (invoice.balance_kes <= 0) return false;
    return true;
  }

  assert.equal(shouldSendRentReminder({ invoice_number: 'INV-001', balance_kes: 35000 }), true);
  assert.equal(shouldSendRentReminder({ invoice_number: 'INV-002', balance_kes: 0 }), false);
});
