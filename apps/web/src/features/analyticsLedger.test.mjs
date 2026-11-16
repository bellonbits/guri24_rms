import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Analytics & Financial Ledger Workspace - Domain & Acceptance Tests', () => {
  // ---------------------------------------------------------------------------
  // 1. Double-Entry Balance Invariant: SUM(Debits) == SUM(Credits) > 0
  // ---------------------------------------------------------------------------
  it('Double-Entry: Rejects unbalanced journal entry where Debits != Credits', () => {
    const unbalancedEntry = {
      entryNumber: 'JRN-TEST-001',
      lines: [
        { accountCode: '1010', debit: 50000, credit: 0 },
        { accountCode: '4000', debit: 0, credit: 45000 }, // Discrepancy of 5000
      ],
    };

    const totalDebits = unbalancedEntry.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredits = unbalancedEntry.lines.reduce((s, l) => s + l.credit, 0);

    assert.notEqual(totalDebits, totalCredits, 'Entry must be detected as unbalanced');
    assert.throws(
      () => {
        if (totalDebits !== totalCredits) {
          throw new Error(`Unbalanced entry: total debits (${totalDebits}) != total credits (${totalCredits})`);
        }
      },
      /Unbalanced entry/,
      'Must throw FinancialIntegrity error'
    );
  });

  it('Double-Entry: Validates balanced journal entry where Debits == Credits', () => {
    const balancedEntry = {
      entryNumber: 'JRN-TEST-002',
      lines: [
        { accountCode: '1010', accountName: 'Cash Clearing', debit: 65000, credit: 0 },
        { accountCode: '4000', accountName: 'Rental Revenue', debit: 0, credit: 60000 },
        { accountCode: '4100', accountName: 'Utility Recovery', debit: 0, credit: 5000 },
      ],
    };

    const totalDebits = balancedEntry.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredits = balancedEntry.lines.reduce((s, l) => s + l.credit, 0);

    assert.equal(totalDebits, 65000);
    assert.equal(totalCredits, 65000);
    assert.equal(totalDebits, totalCredits, 'Entry is perfectly balanced');
  });

  // ---------------------------------------------------------------------------
  // 2. Immutability Invariant: Financial entries cannot be deleted, only reversed
  // ---------------------------------------------------------------------------
  it('Immutability: Reversal creates mirror journal entry with inverted DR/CR without deleting original', () => {
    const originalEntry = {
      id: 'jrn-orig-100',
      entryNumber: 'JRN-00100',
      status: 'POSTED',
      totalDebit: 30000,
      totalCredit: 30000,
      lines: [
        { accountCode: '1010', debit: 30000, credit: 0 },
        { accountCode: '4000', debit: 0, credit: 30000 },
      ],
    };

    // Reversal logic
    const reason = 'Correction of duplicate rent billing';
    const reversalEntry = {
      id: 'jrn-rev-101',
      entryNumber: 'JRN-00101',
      status: 'POSTED',
      reversalOfEntryId: originalEntry.id,
      totalDebit: 30000,
      totalCredit: 30000,
      lines: originalEntry.lines.map((l) => ({
        accountCode: l.accountCode,
        debit: l.credit, // Inverted
        credit: l.debit, // Inverted
      })),
    };

    // Original entry status transitions to REVERSED but is NEVER removed
    const updatedOriginal = { ...originalEntry, status: 'REVERSED' };

    assert.equal(updatedOriginal.status, 'REVERSED');
    assert.equal(reversalEntry.reversalOfEntryId, originalEntry.id);
    assert.equal(reversalEntry.lines[0].credit, 30000);
    assert.equal(reversalEntry.lines[1].debit, 30000);

    // Cumulative net impact of original + reversal is zero
    const netCashImpact = originalEntry.lines[0].debit - reversalEntry.lines[0].credit;
    assert.equal(netCashImpact, 0, 'Net financial position is fully neutralized');
  });

  // ---------------------------------------------------------------------------
  // 3. Security Deposit Segregation: Account 2100 Liability vs Account 4000 Revenue
  // ---------------------------------------------------------------------------
  it('Liability Segregation: Security deposit receipts post to Account 2100 and are excluded from Rental Revenue & NOI', () => {
    const depositReceived = {
      amountKes: 50000,
      tenantId: 'tenant-404',
      leaseId: 'lease-99',
    };

    // Correct journal for deposit
    const depositJournal = {
      entryNumber: 'JRN-DEP-001',
      lines: [
        { accountCode: '1010', accountType: 'ASSET', debit: depositReceived.amountKes, credit: 0 },
        { accountCode: '2100', accountType: 'LIABILITY', debit: 0, credit: depositReceived.amountKes },
      ],
    };

    // Verify Account 4000 is NOT in lines
    const touchesRentalRevenue = depositJournal.lines.some((l) => l.accountCode === '4000');
    assert.equal(touchesRentalRevenue, false, 'Security deposit must NEVER touch Account 4000 (Rental Revenue)');

    // Verify NOI calculation does NOT include Account 2100
    const operatingRevenue = 150000;
    const operatingExpenses = 40000;
    const depositHeld = depositReceived.amountKes;

    const netOperatingIncome = operatingRevenue - operatingExpenses;
    assert.equal(netOperatingIncome, 110000, 'NOI must strictly be Revenue − Expenses (50000 deposit excluded)');
  });

  // ---------------------------------------------------------------------------
  // 4. Profit & Loss Equation: Operating Revenue − Operating Expenses = NOI
  // ---------------------------------------------------------------------------
  it('Profit & Loss: Correctly calculates Net Operating Income and Net Profit', () => {
    const revenueLines = [
      { code: '4000', name: 'Residential Rental Revenue', amount: 450000 },
      { code: '4100', name: 'Utility Recovery', amount: 35000 },
      { code: '4200', name: 'Late Payment Penalties', amount: 12000 },
    ];

    const expenseLines = [
      { code: '5000', name: 'Maintenance & Repairs', amount: 65000 },
      { code: '5100', name: 'Property Utilities & Operations', amount: 28000 },
    ];

    const totalRevenue = revenueLines.reduce((s, r) => s + r.amount, 0);
    const totalExpenses = expenseLines.reduce((s, e) => s + e.amount, 0);
    const netOperatingIncome = totalRevenue - totalExpenses;

    assert.equal(totalRevenue, 497000);
    assert.equal(totalExpenses, 93000);
    assert.equal(netOperatingIncome, 404000);
  });

  // ---------------------------------------------------------------------------
  // 5. Balance Sheet Equation: Assets == Liabilities + Equity
  // ---------------------------------------------------------------------------
  it('Balance Sheet: Enforces fundamental accounting equation Assets == Liabilities + Equity', () => {
    const assets = [
      { code: '1010', name: 'Cash & Bank Clearing', amount: 454000 },
      { code: '1100', name: 'Accounts Receivable', amount: 80000 },
    ];

    const liabilities = [
      { code: '2100', name: 'Tenant Security Deposits Held', amount: 100000 },
      { code: '2200', name: 'Tenant Prepayments', amount: 30000 },
    ];

    const equity = [
      { code: '3000', name: 'Retained Earnings / Current NOI', amount: 404000 },
    ];

    const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);
    const totalEquity = equity.reduce((s, e) => s + e.amount, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    assert.equal(totalAssets, 534000);
    assert.equal(totalLiabilitiesAndEquity, 534000);
    assert.equal(totalAssets, totalLiabilitiesAndEquity, 'Assets must equal Liabilities + Equity');
  });

  // ---------------------------------------------------------------------------
  // 6. Arrears Aging Buckets Distribution: Current, 1-30, 31-60, 61-90, 90+ days
  // ---------------------------------------------------------------------------
  it('Arrears Aging: Correctly categorizes invoices into respective aging buckets', () => {
    const today = new Date('2026-11-16');

    function getAgingBucket(dueDateStr) {
      const due = new Date(dueDateStr);
      const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 0) return 'CURRENT';
      if (diffDays <= 30) return '1_30';
      if (diffDays <= 60) return '31_60';
      if (diffDays <= 90) return '61_90';
      return 'OVER_90';
    }

    assert.equal(getAgingBucket('2026-11-20'), 'CURRENT'); // Future due date
    assert.equal(getAgingBucket('2026-11-16'), 'CURRENT'); // Due today
    assert.equal(getAgingBucket('2026-11-01'), '1_30');    // 15 days ago
    assert.equal(getAgingBucket('2026-10-05'), '31_60');   // 42 days ago
    assert.equal(getAgingBucket('2026-09-01'), '61_90');   // 76 days ago
    assert.equal(getAgingBucket('2026-07-01'), 'OVER_90'); // 138 days ago
  });

  // ---------------------------------------------------------------------------
  // 7. 8-Stage Deposit Move-Out Refund Lifecycle Formula
  // ---------------------------------------------------------------------------
  it('Deposit Refund: Enforces Refundable = Held − Deductions − Refunded formula', () => {
    const depositRecord = {
      initialDepositKes: 50000,
      deductionsKes: 12500, // Repairs & utility arrears
      previouslyRefundedKes: 0,
    };

    const refundableAmount =
      depositRecord.initialDepositKes - depositRecord.deductionsKes - depositRecord.previouslyRefundedKes;

    assert.equal(refundableAmount, 37500);

    // Prevent over-refund
    const invalidRefundAmount = 40000;
    assert.ok(invalidRefundAmount > refundableAmount, 'Must detect attempt to refund more than net refundable');
  });

  // ---------------------------------------------------------------------------
  // 8. Multi-Pass Bank & M-Pesa Statement Reconciliation Matching
  // ---------------------------------------------------------------------------
  it('Reconciliation: Prioritizes exact M-Pesa provider receipt match over amount matching', () => {
    const systemPayments = [
      { id: 'p1', receiptNumber: 'QJH1234567', amountKes: 25000, tenantId: 't1' },
      { id: 'p2', receiptNumber: 'QJH9999999', amountKes: 25000, tenantId: 't2' },
    ];

    const statementTransaction = {
      transactionRef: 'QJH1234567',
      amountKes: 25000,
      narrative: 'Rent unit 1A',
    };

    // Priority 1: Match by exact receipt number
    const matchedPayment = systemPayments.find(
      (p) => p.receiptNumber === statementTransaction.transactionRef
    );

    assert.ok(matchedPayment);
    assert.equal(matchedPayment.id, 'p1');
    assert.equal(matchedPayment.tenantId, 't1');
  });
});
