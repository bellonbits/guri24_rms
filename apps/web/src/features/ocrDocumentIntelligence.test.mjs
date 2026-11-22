import test from 'node:test';
import assert from 'node:assert/strict';
import {
  submitOcrDocumentJob,
  reviewOcrDocumentJob,
  createInitialRmsState,
} from '../lib/api.ts';

test('Guri24 RMS — OCR & Document Intelligence Pipeline', async (t) => {
  await t.test('1. Reference Job ocr-1794913229695: Non-existent record triggers authentic 404 Not Found without fabricating data', () => {
    const state = createInitialRmsState();
    const targetId = 'ocr-1794913229695';

    // The reference ID does not exist in the database or initial state
    const found = state.ocrJobs.find((j) => j.id === targetId);
    assert.equal(found, undefined, 'Target job ocr-1794913229695 must NOT exist in persisted records');

    // Attempting to review non-existent job throws clear NotFound error
    assert.throws(
      () => {
        reviewOcrDocumentJob(state, targetId, {
          approve: true,
          fieldCorrections: {},
          reviewNotes: 'Audit attempt',
        });
      },
      /not found/i,
      'Reviewing non-existent job must throw honest Not Found error'
    );
  });

  await t.test('2. Zero Fake Data Policy: Documents uploaded without text hint do NOT synthesize fake names or properties', () => {
    const state = createInitialRmsState();

    const { job } = submitOcrDocumentJob(state, {
      fileName: 'genuine_lease_agreement.pdf',
      mimeType: 'application/pdf',
      fileSizeKb: 1024,
      pageCount: 2,
      documentCategory: 'LEASE_AGREEMENT',
      rawSampleText: '', // No hint provided
    });

    assert.equal(job.raw_extracted_text, '');
    assert.equal(job.fields.length, 0, 'No fake fields must be synthesized when document has no text');
    assert.equal(job.overall_confidence, 0, 'Confidence must be 0 when no fields are recognized');
    assert.equal(job.status, 'NEEDS_REVIEW');
    assert.equal(job.authoritative_record_applied, false);
  });

  await t.test('3. Real Field Extraction: Extracts authentic key-value pairs from document text without hardcoded 96.5% confidence', () => {
    const state = createInitialRmsState();
    const genuineText = `
      Republic of Kenya
      National ID: 29841234
      Full Name: John Mwangi Kariuki
      Phone Number: 0712345678
      Monthly Rent: 35000.00
    `;

    const { job } = submitOcrDocumentJob(state, {
      fileName: 'id_and_lease.pdf',
      mimeType: 'application/pdf',
      fileSizeKb: 512,
      pageCount: 1,
      documentCategory: 'TENANT_IDENTIFICATION',
      rawSampleText: genuineText,
    });

    assert.equal(job.fields.length, 4);
    assert.equal(job.status, 'NEEDS_REVIEW');

    const idField = job.fields.find((f) => f.field_name === 'national_id');
    assert.ok(idField, 'Extracted national ID field');
    assert.equal(idField.extracted_value, '29841234');
    assert.notEqual(idField.confidence, 0.965, 'Confidence must NOT be hardcoded 96.5%');

    const phoneField = job.fields.find((f) => f.field_name === 'phone_number');
    assert.ok(phoneField, 'Extracted phone field');
    assert.equal(phoneField.extracted_value, '0712345678');
  });

  await t.test('4. Legal & Financial Safeguard: Human verification required before values affect authoritative records', () => {
    const state = createInitialRmsState();
    const genuineText = 'Tenant Name: Wanjiku Njoroge | Unit: B-101 | Rent: 28000';

    const { nextState: stateWithJob, job } = submitOcrDocumentJob(state, {
      fileName: 'lease_b101.pdf',
      mimeType: 'application/pdf',
      fileSizeKb: 650,
      pageCount: 1,
      documentCategory: 'LEASE_AGREEMENT',
      rawSampleText: genuineText,
    });

    // Verify initial unverified state
    assert.equal(job.authoritative_record_applied, false);
    assert.equal(job.status, 'NEEDS_REVIEW');

    // Authoritative leases and financial invoices in RMS must NOT be mutated
    const initialLeasesCount = state.leases.length;
    const initialInvoicesCount = state.invoices.length;
    assert.equal(stateWithJob.leases.length, initialLeasesCount);
    assert.equal(stateWithJob.invoices.length, initialInvoicesCount);

    // Human administrator reviews and approves
    const { nextState: verifiedState, job: verifiedJob } = reviewOcrDocumentJob(
      stateWithJob,
      job.id,
      {
        approve: true,
        fieldCorrections: { unit: 'B-101-CORRECTED' },
        reviewNotes: 'Verified against signed physical document',
      }
    );

    assert.equal(verifiedJob.status, 'VERIFIED');
    assert.equal(verifiedJob.authoritative_record_applied, true);
    assert.equal(verifiedJob.review_audit?.decision, 'APPROVED');

    // Even after verification, direct ledger mutations require explicit operator action in Financial Workspace
    assert.equal(verifiedState.invoices.length, initialInvoicesCount);
  });

  await t.test('5. Rejection Flow: Administrator rejection records reason and marks job FAILED without affecting business records', () => {
    const state = createInitialRmsState();
    const { nextState: stateWithJob, job } = submitOcrDocumentJob(state, {
      fileName: 'blurred_receipt.jpg',
      mimeType: 'image/jpeg',
      fileSizeKb: 300,
      pageCount: 1,
      documentCategory: 'RECEIPT_OR_INVOICE',
      rawSampleText: 'Payment received: unreadable',
    });

    const { job: rejectedJob } = reviewOcrDocumentJob(stateWithJob, job.id, {
      approve: false,
      fieldCorrections: {},
      reviewNotes: 'Image resolution too low to verify transaction reference',
    });

    assert.equal(rejectedJob.status, 'FAILED');
    assert.equal(rejectedJob.authoritative_record_applied, false);
    assert.equal(rejectedJob.review_audit?.decision, 'REJECTED');
    assert.match(rejectedJob.review_audit?.notes, /too low/);
  });

  await t.test('6. Financial Statement & Table Extraction: Parses multi-column tabular rent/deposit statements without colons into structured fields', () => {
    const state = createInitialRmsState();
    const tableText = `
Description          Amount
Monthly rent         KES 25,000
Deposit held         KES 25,000
November invoice     KES 25,000
Verified payments    KES 15,000
Outstanding rent     KES 10,000
    `;

    const { job } = submitOcrDocumentJob(state, {
      fileName: 'rent_summary_statement.png',
      mimeType: 'image/png',
      fileSizeKb: 256,
      pageCount: 1,
      documentCategory: 'RECEIPT_OR_INVOICE',
      rawSampleText: tableText,
    });

    assert.equal(job.fields.length, 5, 'Must extract all 5 financial rows from tabular layout');
    
    const rent = job.fields.find((f) => f.field_name === 'monthly_rent');
    assert.ok(rent, 'Extracted monthly rent');
    assert.equal(rent.extracted_value, 'KES 25,000');

    const deposit = job.fields.find((f) => f.field_name === 'deposit_held');
    assert.ok(deposit, 'Extracted deposit held');
    assert.equal(deposit.extracted_value, 'KES 25,000');

    const outstanding = job.fields.find((f) => f.field_name === 'outstanding_rent');
    assert.ok(outstanding, 'Extracted outstanding rent');
    assert.equal(outstanding.extracted_value, 'KES 10,000');
  });
});
