import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MODULE_TEMPLATES,
  generateTemplateCsv,
  exportRowsToCsv,
  parseCsv,
  parseClipboardTsv,
  validateImportRows,
} from '../lib/importEngine.ts';

test('Import System: All 13 modules have valid downloadable templates and required metadata', () => {
  const expectedModules = [
    'properties',
    'buildings',
    'floors',
    'units',
    'tenants',
    'leases',
    'invoices',
    'payments',
    'maintenance',
    'vendors',
    'expenses',
    'inspections',
    'documents',
  ];

  for (const mod of expectedModules) {
    const tpl = MODULE_TEMPLATES[mod];
    assert.ok(tpl, `Template for module ${mod} must exist`);
    assert.ok(tpl.title, `Template ${mod} must have a title`);
    assert.ok(tpl.fields.length > 0, `Template ${mod} must have at least one field`);
    assert.ok(tpl.sampleRows.length > 0, `Template ${mod} must provide sample starter rows`);

    // Verify CSV generation with module key
    const csv = generateTemplateCsv(mod);
    assert.ok(csv.includes('\n'), `CSV for ${mod} must have header and sample row`);
    const parsed = parseCsv(csv);
    assert.ok(parsed.length >= 1, `Parsed CSV for ${mod} must have sample row`);
  }
});

test('Import System: Excel clipboard TSV paste into Units validates required fields and rent', () => {
  const tsvData = `B-101\tPRP-001\tTWO_BEDROOM\t35000\t1\t35000\t2\n` +
    `B-102\tPRP-001\tTWO_BEDROOM\t40000\t1\t40000\t2`;

  const keys = ['unit_number', 'property_code', 'unit_type', 'monthly_rent_kes', 'floor_number', 'deposit_amount_kes', 'bedrooms'];
  const parsedRows = parseClipboardTsv(tsvData, keys);
  assert.equal(parsedRows.length, 2);

  const val = validateImportRows('units', parsedRows);
  assert.equal(val.errors.length, 0, 'No validation errors expected for valid TSV paste');
  assert.equal(val.previewRows.length, 2);
  assert.equal(val.validRowsCount, 2);
  assert.equal(val.invalidRowsCount, 0);
});

test('Import System: Kenyan MSISDN phone normalization and validation in Tenants import', () => {
  const rawRows = [
    {
      full_name: 'Wanjiku Kamau',
      phone: '0712345678', // Kenyan 10-digit
      email: 'wanjiku@example.co.ke',
      national_id: '32109876',
      status: 'ACTIVE',
    },
    {
      full_name: 'John Ochieng',
      phone: '+254 722 999 888', // International with spaces
      email: 'john@example.co.ke',
      national_id: '29876543',
      status: 'ACTIVE',
    },
    {
      full_name: 'Invalid Phone User',
      phone: '12345', // Bad phone
      email: 'bad@example.co.ke',
      national_id: '12345678',
      status: 'ACTIVE',
    },
  ];

  const val = validateImportRows('tenants', rawRows);
  assert.equal(val.totalRows, 3);
  assert.equal(val.validRowsCount, 2);
  assert.equal(val.invalidRowsCount, 1);

  // Phone should be normalized to 254712345678 in valid preview rows
  assert.equal(val.previewRows[0].fields['phone'], '254712345678');
  assert.equal(val.previewRows[1].fields['phone'], '254722999888');
});

test('Import System: CSV export formats currency and headers cleanly', () => {
  const tpl = MODULE_TEMPLATES.leases;
  const sampleData = [
    {
      lease_number: 'LS-2026-001',
      unit_id: 'U-101',
      tenant_id: 'TNT-001',
      monthly_rent_kes: 35000,
      security_deposit_kes: 35000,
      billing_day: 5,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      status: 'ACTIVE',
    },
  ];

  const csv = exportRowsToCsv(tpl.fields, sampleData);
  assert.ok(csv.includes('lease_number'), 'Header should include lease_number');
  assert.ok(csv.includes('LS-2026-001'));
  assert.ok(csv.includes('35000'));
});
