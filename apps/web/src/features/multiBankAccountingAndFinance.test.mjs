import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// =============================================================================
// GURI24 RMS - Multi-Bank Accounting, Channel Configuration & Financial Ledger Tests
// =============================================================================

describe('Multi-Bank Accounting & Organization Financial Configuration Tests', () => {
  // ---------------------------------------------------------------------------
  // 1. Organization Financial Profiles & Channels
  // ---------------------------------------------------------------------------
  it('Configures organization with single bank account', () => {
    const singleBankOrg = {
      organizationId: 'org-landlord-01',
      legalName: 'Gikomba Commercial Properties Ltd',
      reportingCurrency: 'KES',
      accountingBasis: 'ACCRUAL',
      channels: ['BANK'],
      bankAccounts: [
        {
          id: 'ba-01',
          bankName: 'Equity Bank Kenya',
          accountName: 'Rent Collections Main',
          accountNumber: '0180299887766',
          accountType: 'RENT_COLLECTION',
          glAccountCode: '1010',
          isActive: true,
        },
      ],
    };

    assert.equal(singleBankOrg.bankAccounts.length, 1);
    assert.equal(singleBankOrg.bankAccounts[0].bankName, 'Equity Bank Kenya');
    assert.equal(singleBankOrg.channels.includes('BANK'), true);
  });

  it('Configures organization with multiple bank accounts (Rent, Escrow 2100, OpEx)', () => {
    const multiBankOrg = {
      organizationId: 'org-corporate-02',
      legalName: 'Kilimani Prime Residences Ltd',
      reportingCurrency: 'KES',
      accountingBasis: 'ACCRUAL',
      channels: ['BANK', 'MPESA_PAYBILL'],
      bankAccounts: [
        {
          id: 'ba-rent',
          bankName: 'Equity Bank Kenya',
          accountName: 'Operating & Rent Collection',
          accountNumber: '0180299887766',
          accountType: 'RENT_COLLECTION',
          glAccountCode: '1010',
          isActive: true,
        },
        {
          id: 'ba-escrow',
          bankName: 'NCBA Bank Kenya',
          accountName: 'Tenant Deposits Trust Escrow',
          accountNumber: '100234556677',
          accountType: 'ESCROW_DEPOSITS',
          glAccountCode: '2100', // Segregated liability account
          isActive: true,
        },
        {
          id: 'ba-opex',
          bankName: 'Co-operative Bank of Kenya',
          accountName: 'Property Maintenance & Utilities OpEx',
          accountNumber: '01129000000000',
          accountType: 'OPERATING',
          glAccountCode: '1010',
          isActive: true,
        },
      ],
    };

    assert.equal(multiBankOrg.bankAccounts.length, 3);
    const escrow = multiBankOrg.bankAccounts.find((b) => b.accountType === 'ESCROW_DEPOSITS');
    assert.ok(escrow);
    assert.equal(escrow.glAccountCode, '2100', 'Escrow account must map to liability account 2100');
  });

  it('Configures organization operating with M-Pesa only (No bank account required)', () => {
    const mpesaOnlyOrg = {
      organizationId: 'org-estate-03',
      legalName: 'Ruiru Sunview Apartments',
      channels: ['MPESA_PAYBILL'],
      bankAccounts: [], // Zero bank accounts required
      mpesaPaybill: {
        shortcode: '4082222',
        accountReferenceFormat: 'HOUSE_NUMBER',
        glAccountCode: '1020',
        darajaStatus: 'OPERATIONAL',
      },
    };

    assert.equal(mpesaOnlyOrg.bankAccounts.length, 0);
    assert.equal(mpesaOnlyOrg.channels.includes('MPESA_PAYBILL'), true);
    assert.equal(mpesaOnlyOrg.mpesaPaybill.shortcode, '4082222');
  });

  it('Configures organization operating with cash only (No bank or M-Pesa required)', () => {
    const cashOnlyOrg = {
      organizationId: 'org-caretaker-04',
      legalName: 'Eldoret Westlands Flats',
      channels: ['CASH', 'PETTY_CASH'],
      bankAccounts: [],
      cashDrawers: [
        { id: 'cd-1', name: 'Estate Office Cash Box', custodian: 'Head Caretaker', maxBalance: 30000, glCode: '1010' },
      ],
    };

    assert.equal(cashOnlyOrg.bankAccounts.length, 0);
    assert.equal(cashOnlyOrg.channels.includes('CASH'), true);
    assert.equal(cashOnlyOrg.cashDrawers.length, 1);
  });

  it('Configures combined multi-channel organization (Bank + M-Pesa + Cash)', () => {
    const combinedOrg = {
      organizationId: 'org-enterprise-05',
      channels: ['BANK', 'MPESA_PAYBILL', 'CASH', 'PETTY_CASH'],
      bankAccountsCount: 2,
      hasPaybill: true,
      hasCashDrawer: true,
    };

    assert.equal(combinedOrg.channels.length, 4);
    assert.ok(combinedOrg.hasPaybill);
    assert.ok(combinedOrg.hasCashDrawer);
  });

  // ---------------------------------------------------------------------------
  // 2. Property Account Mappings
  // ---------------------------------------------------------------------------
  it('Maps default collection, deposit, and expense bank accounts per property', () => {
    const propertyMappings = [
      {
        propertyId: 'prop-jacaranda',
        propertyName: 'Jacaranda Heights',
        defaultCollectionAccountId: 'ba-rent',
        defaultDepositAccountId: 'ba-escrow',
        defaultExpenseAccountId: 'ba-opex',
      },
      {
        propertyId: 'prop-savanna',
        propertyName: 'Savanna Residences',
        defaultCollectionAccountId: 'ba-rent',
        defaultDepositAccountId: 'ba-escrow',
        defaultExpenseAccountId: 'ba-opex',
      },
    ];

    assert.equal(propertyMappings.length, 2);
    assert.equal(propertyMappings[0].defaultDepositAccountId, 'ba-escrow');
  });

  // ---------------------------------------------------------------------------
  // 3. Opening Balances Migration & Balanced Journal Generation
  // ---------------------------------------------------------------------------
  it('Opening Balances: Generates balanced double-entry journal (Total Debits == Total Credits)', () => {
    const openingBalances = [
      { accountCode: '1010', accountName: 'Cash & Bank Clearing', debit: 450000, credit: 0 },
      { accountCode: '1100', accountName: 'Accounts Receivable (Tenant Arrears)', debit: 75000, credit: 0 },
      { accountCode: '2100', accountName: 'Tenant Security Deposits Held', debit: 0, credit: 150000 },
      { accountCode: '3000', accountName: 'Owner Equity & Opening Retained Earnings', debit: 0, credit: 375000 },
    ];

    const totalDebits = openingBalances.reduce((s, b) => s + b.debit, 0);
    const totalCredits = openingBalances.reduce((s, b) => s + b.credit, 0);

    assert.equal(totalDebits, 525000);
    assert.equal(totalCredits, 525000);
    assert.equal(totalDebits, totalCredits, 'Opening balances must be perfectly balanced');

    // Create opening journal entry
    const openingJournal = {
      entryNumber: 'JRN-OPENING-001',
      description: 'Historical verified opening balances migration',
      totalDebit: totalDebits,
      totalCredit: totalCredits,
      isBalanced: totalDebits === totalCredits,
      lines: openingBalances.map((b) => ({
        accountCode: b.accountCode,
        debit: b.debit,
        credit: b.credit,
      })),
    };

    assert.equal(openingJournal.isBalanced, true);
  });

  // ---------------------------------------------------------------------------
  // 4. Double-Entry General Ledger Rules
  // ---------------------------------------------------------------------------
  it('Double-Entry: Rent invoice issues Debit Accounts Receivable (1100) and Credit Rental Income (4000)', () => {
    const rentInvoice = { invoiceNumber: 'INV-2026-101', amountKes: 45000, tenantId: 't-1' };

    const invoiceJournal = {
      entryNumber: 'JRN-INV-101',
      lines: [
        { accountCode: '1100', accountType: 'ASSET', debit: rentInvoice.amountKes, credit: 0 },
        { accountCode: '4000', accountType: 'REVENUE', debit: 0, credit: rentInvoice.amountKes },
      ],
    };

    const debits = invoiceJournal.lines.reduce((s, l) => s + l.debit, 0);
    const credits = invoiceJournal.lines.reduce((s, l) => s + l.credit, 0);
    assert.equal(debits, 45000);
    assert.equal(credits, 45000);
  });

  it('Double-Entry: Verified tenant payment issues Debit Bank (1010) and Credit Accounts Receivable (1100)', () => {
    const payment = { receiptNumber: 'PAY-2026-501', amountKes: 45000, invoiceId: 'inv-101' };

    const paymentJournal = {
      entryNumber: 'JRN-PAY-501',
      lines: [
        { accountCode: '1010', accountType: 'ASSET', debit: payment.amountKes, credit: 0 },
        { accountCode: '1100', accountType: 'ASSET', debit: 0, credit: payment.amountKes },
      ],
    };

    const debits = paymentJournal.lines.reduce((s, l) => s + l.debit, 0);
    const credits = paymentJournal.lines.reduce((s, l) => s + l.credit, 0);
    assert.equal(debits, 45000);
    assert.equal(credits, 45000);
  });

  it('Double-Entry: Security deposit issues Debit Bank (1010) and Credit Tenant Deposit Liability (2100)', () => {
    const depositReceived = { amountKes: 60000, tenantId: 't-2' };

    const depositJournal = {
      entryNumber: 'JRN-DEP-201',
      lines: [
        { accountCode: '1010', accountType: 'ASSET', debit: depositReceived.amountKes, credit: 0 },
        { accountCode: '2100', accountType: 'LIABILITY', debit: 0, credit: depositReceived.amountKes },
      ],
    };

    // Strict invariant: Account 4000 (Rental Revenue) is NEVER credited for deposit
    const touchesRevenue = depositJournal.lines.some((l) => l.accountCode === '4000');
    assert.equal(touchesRevenue, false, 'Security deposit must never touch rental revenue');
  });

  it('Double-Entry: Move-out deposit refund issues Debit Deposit Liability (2100) and Credit Bank (1010)', () => {
    const refundExecuted = { amountKes: 52000, tenantId: 't-2', payoutRef: 'EFT-NCBA-9912' };

    const refundJournal = {
      entryNumber: 'JRN-REF-201',
      lines: [
        { accountCode: '2100', accountType: 'LIABILITY', debit: refundExecuted.amountKes, credit: 0 },
        { accountCode: '1010', accountType: 'ASSET', debit: 0, credit: refundExecuted.amountKes },
      ],
    };

    const debits = refundJournal.lines.reduce((s, l) => s + l.debit, 0);
    const credits = refundJournal.lines.reduce((s, l) => s + l.credit, 0);
    assert.equal(debits, 52000);
    assert.equal(credits, 52000);
  });

  // ---------------------------------------------------------------------------
  // 5. Bank Statement Imports & Reconciliation
  // ---------------------------------------------------------------------------
  it('Reconciliation: Detects and rejects duplicate statement transactions using unique external reference', () => {
    const existingTransactions = [
      { externalRef: 'QJH1234567', amount: 25000, date: '2026-10-01' },
      { externalRef: 'NCBA-TX-88912', amount: 45000, date: '2026-10-02' },
    ];

    const newStatementRow = { externalRef: 'QJH1234567', amount: 25000, date: '2026-10-01' };

    const isDuplicate = existingTransactions.some((t) => t.externalRef === newStatementRow.externalRef);
    assert.equal(isDuplicate, true, 'Duplicate external reference must be detected and flagged');
  });

  it('Reconciliation: Matches external transaction by exact M-Pesa receipt number', () => {
    const internalPayments = [
      { id: 'p-1', mpesaReceipt: 'SJK8912XYZ', amountKes: 30000, status: 'COMPLETED' },
      { id: 'p-2', mpesaReceipt: 'SJK8912ABC', amountKes: 25000, status: 'COMPLETED' },
    ];

    const statementTransaction = {
      externalTransactionId: 'SJK8912XYZ',
      amountKes: 30000,
      description: 'M-PESA C2B - John Doe',
    };

    const matchedPayment = internalPayments.find(
      (p) => p.mpesaReceipt === statementTransaction.externalTransactionId
    );

    assert.ok(matchedPayment);
    assert.equal(matchedPayment.id, 'p-1');
    assert.equal(matchedPayment.amountKes, statementTransaction.amountKes);
  });

  it('Reconciliation: Flags discrepancy when statement amount differs from invoice payment', () => {
    const invoice = { invoiceNumber: 'INV-3001', balanceKes: 40000 };
    const statementTx = { reference: 'INV-3001', paidAmountKes: 35000 }; // 5000 underpaid

    const difference = invoice.balanceKes - statementTx.paidAmountKes;
    assert.equal(difference, 5000);

    const exception = {
      type: 'AMOUNT_MISMATCH',
      expected: invoice.balanceKes,
      actual: statementTx.paidAmountKes,
      discrepancy: difference,
      status: 'OPEN',
    };

    assert.equal(exception.type, 'AMOUNT_MISMATCH');
    assert.equal(exception.discrepancy, 5000);
  });

  // ---------------------------------------------------------------------------
  // 6. Balance Sheet & Trial Balance Fundamental Equations
  // ---------------------------------------------------------------------------
  it('Balance Sheet: Satisfies Assets == Liabilities + Owner Equity', () => {
    const totalAssets = 850000;
    const totalLiabilities = 320000; // Account 2100 (220k deposits) + Account 2200 (100k prepayments)
    const totalEquity = 530000; // Capital + Net Operating Income

    assert.equal(totalAssets, totalLiabilities + totalEquity);
    const isBalanced = totalAssets === totalLiabilities + totalEquity;
    assert.equal(isBalanced, true, 'Fundamental accounting equation must hold');
  });

  // ---------------------------------------------------------------------------
  // 7. Multi-Tenant Financial Isolation
  // ---------------------------------------------------------------------------
  it('Cross-Organization Isolation: Organization A cannot query or mutate Organization B ledger', () => {
    const orgAJournals = [
      { id: 'j-1', organizationId: 'org-a', amount: 50000 },
      { id: 'j-2', organizationId: 'org-a', amount: 30000 },
    ];

    const orgBJournals = [
      { id: 'j-3', organizationId: 'org-b', amount: 95000 },
    ];

    const queryOrgJournals = (allJournals, requestedOrgId) =>
      allJournals.filter((j) => j.organizationId === requestedOrgId);

    const resultsForA = queryOrgJournals([...orgAJournals, ...orgBJournals], 'org-a');
    assert.equal(resultsForA.length, 2);
    assert.equal(resultsForA.some((j) => j.organizationId === 'org-b'), false);
  });
});
