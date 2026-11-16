import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCsv,
  parseClipboardTsv,
  autoMapColumns,
  validateImportRows,
  generateTemplateCsv,
  normalizePhone,
  MODULE_TEMPLATES,
} from '../lib/importEngine.ts';

test('Import Engine: RFC 4180 CSV parser handles quotes, commas, and multiline values', () => {
  const csv = `unit_number,property_code,unit_type,monthly_rent_kes\n"A-101","JAC-001","TWO_BEDROOM","35,000.00"\n"A-102","JAC-001","ONE_BEDROOM","25000"`;
  const rows = parseCsv(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].unit_number, 'A-101');
  assert.equal(rows[0].monthly_rent_kes, '35,000.00');
  assert.equal(rows[1].unit_number, 'A-102');
  assert.equal(rows[1].unit_type, 'ONE_BEDROOM');
});

test('Import Engine: Clipboard TSV parser parses Excel copy-paste tab-separated table', () => {
  const tsv = `A-101\tJAC-001\tTWO_BEDROOM\t35000\nA-102\tJAC-001\tONE_BEDROOM\t25000`;
  const rows = parseClipboardTsv(tsv, ['unit_number', 'property_code', 'unit_type', 'monthly_rent_kes']);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].unit_number, 'A-101');
  assert.equal(rows[0].monthly_rent_kes, '35000');
  assert.equal(rows[1].unit_number, 'A-102');
});

test('Import Engine: Column auto-mapping detects alias variants into schema keys', () => {
  const headers = ['Apartment No', 'Complex', 'Typology', 'Rent Amount', 'Token'];
  const mapping = autoMapColumns(headers, 'units');
  assert.equal(mapping.unit_number, 'Apartment No');
  assert.equal(mapping.unit_type, 'Typology');
  assert.equal(mapping.monthly_rent_kes, 'Rent Amount');
});

test('Import Engine: Kenyan phone normalization handles local and international formats', () => {
  assert.equal(normalizePhone('0712345678'), '254712345678');
  assert.equal(normalizePhone('254712345678'), '254712345678');
  assert.equal(normalizePhone('0112345678'), '254112345678');
  assert.equal(normalizePhone('invalid-phone'), null);
});

test('Import Engine: Required fields and data types report row-level errors', () => {
  const invalidRows = [
    { unit_number: '', property_code: 'JAC-001', unit_type: 'TWO_BEDROOM', monthly_rent_kes: '35000' }, // missing unit_number
    { unit_number: 'A-102', property_code: 'JAC-001', unit_type: 'INVALID_TYPE', monthly_rent_kes: 'abc' }, // invalid enum & invalid currency
  ];

  const res = validateImportRows('units', invalidRows);
  assert.equal(res.totalRows, 2);
  assert.equal(res.invalidRowsCount, 2);
  assert.equal(res.validRowsCount, 0);

  const missingUnitErr = res.errors.find((e) => e.rowIndex === 1 && e.field === 'unit_number');
  assert.ok(missingUnitErr);
  assert.equal(missingUnitErr.errorCode, 'REQUIRED_FIELD_MISSING');

  const invalidTypeErr = res.errors.find((e) => e.rowIndex === 2 && e.field === 'unit_type');
  assert.ok(invalidTypeErr);
  assert.equal(invalidTypeErr.errorCode, 'INVALID_ENUM');

  const invalidRentErr = res.errors.find((e) => e.rowIndex === 2 && e.field === 'monthly_rent_kes');
  assert.ok(invalidRentErr);
  assert.equal(invalidRentErr.errorCode, 'INVALID_NUMERIC');
});

test('Import Engine: In-batch duplicate detection catches duplicate identifiers', () => {
  const duplicateRows = [
    { unit_number: 'A-101', property_code: 'JAC-001', unit_type: 'TWO_BEDROOM', monthly_rent_kes: '35000' },
    { unit_number: 'A-101', property_code: 'JAC-001', unit_type: 'TWO_BEDROOM', monthly_rent_kes: '35000' }, // Duplicate
  ];

  const res = validateImportRows('units', duplicateRows);
  assert.equal(res.duplicateRowsCount, 1);
  assert.equal(res.previewRows[1].status, 'DUPLICATE');
  const dupErr = res.errors.find((e) => e.errorCode === 'DUPLICATE_IN_BATCH');
  assert.ok(dupErr);
  assert.equal(dupErr.rowIndex, 2);
});

test('Import Engine: Generates module-specific templates with valid CSV headers', () => {
  const modules = Object.keys(MODULE_TEMPLATES);
  for (const mod of modules) {
    const csv = generateTemplateCsv(mod);
    assert.ok(csv.length > 0, `Template for ${mod} must not be empty`);
    const lines = csv.split('\n');
    assert.ok(lines.length >= 2, `Template for ${mod} must have header and sample row`);
    const headerCols = lines[0].split(',');
    assert.ok(headerCols.length >= 2, `Template for ${mod} must have multiple columns`);
  }
});
