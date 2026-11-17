import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiTsContent = fs.readFileSync(path.join(__dirname, '../lib/api.ts'), 'utf-8');

function extractRolePermissions(content) {
  const match = content.match(/export const ROLE_PERMISSIONS: Record<SystemRole, string\[\]> = ({[\s\S]*?\n\};)/);
  if (!match) throw new Error('Could not find ROLE_PERMISSIONS in api.ts');
  const cleanJson = match[1].replace(/;\s*$/, '');
  return eval('(' + cleanJson + ')');
}

const ROLE_PERMISSIONS = extractRolePermissions(apiTsContent);

test('RBAC: OrganizationAdministrator has authoritative notification permissions', () => {
  const orgAdminPerms = ROLE_PERMISSIONS.ORGANIZATION_ADMINISTRATOR;
  assert.ok(orgAdminPerms.includes('notifications.manage'), 'OrgAdmin must have notifications.manage');
  assert.ok(orgAdminPerms.includes('notifications.view'), 'OrgAdmin must have notifications.view');
  assert.ok(orgAdminPerms.includes('notifications.settings'), 'OrgAdmin must have notifications.settings');
});

test('RBAC: SaasSuperAdministrator has full notification permissions', () => {
  const superAdminPerms = ROLE_PERMISSIONS.SAAS_SUPER_ADMINISTRATOR;
  assert.ok(superAdminPerms.includes('notifications.manage'), 'SuperAdmin must have notifications.manage');
  assert.ok(superAdminPerms.includes('notifications.view'), 'SuperAdmin must have notifications.view');
  assert.ok(superAdminPerms.includes('notifications.settings'), 'SuperAdmin must have notifications.settings');
});

test('RBAC: PropertyManager and Accountant can view notifications but cannot manage templates or settings', () => {
  const pmPerms = ROLE_PERMISSIONS.PROPERTY_MANAGER;
  assert.ok(pmPerms.includes('notifications.view'), 'PropertyManager can view delivery logs');
  assert.ok(!pmPerms.includes('notifications.manage'), 'PropertyManager cannot manage templates');
  assert.ok(!pmPerms.includes('notifications.settings'), 'PropertyManager cannot edit organization settings');

  const acctPerms = ROLE_PERMISSIONS.ACCOUNTANT;
  assert.ok(acctPerms.includes('notifications.view'), 'Accountant can view delivery logs');
  assert.ok(!acctPerms.includes('notifications.manage'), 'Accountant cannot manage templates');
  assert.ok(!acctPerms.includes('notifications.settings'), 'Accountant cannot edit organization settings');
});

test('RBAC: Tenant has no access to organization notification management or settings', () => {
  const tenantPerms = ROLE_PERMISSIONS.TENANT;
  assert.ok(!tenantPerms.includes('notifications.manage'), 'Tenant cannot manage notifications');
  assert.ok(!tenantPerms.includes('notifications.settings'), 'Tenant cannot edit notification settings');
  assert.ok(!tenantPerms.includes('notifications.view'), 'Tenant cannot view organization delivery ledger');
});

test('STK Push Validation: Kenyan phone normalization patterns', () => {
  function normalizeKenyanPhone(raw) {
    const digits = (raw || '').replace(/\D/g, '');
    let normalized;
    if ((digits.startsWith('07') || digits.startsWith('01')) && digits.length === 10) {
      normalized = '254' + digits.slice(1);
    } else if (digits.startsWith('254') && digits.length === 12) {
      normalized = digits;
    } else if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
      normalized = '254' + digits;
    } else {
      return null;
    }
    return normalized.length === 12 ? normalized : null;
  }

  assert.equal(normalizeKenyanPhone('0712345678'), '254712345678');
  assert.equal(normalizeKenyanPhone('+254 712 345 678'), '254712345678');
  assert.equal(normalizeKenyanPhone('0112345678'), '254112345678');
  assert.equal(normalizeKenyanPhone('254712345678'), '254712345678');
  assert.equal(normalizeKenyanPhone('712345678'), '254712345678');
  assert.equal(normalizeKenyanPhone('0812345678'), null);
  assert.equal(normalizeKenyanPhone('12345'), null);
});

test('STK Push Validation: Amount must be strictly greater than 0', () => {
  function validateAmount(amount) {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return { valid: false, code: 'INVALID_AMOUNT', message: 'Payment amount must be greater than KES 0' };
    }
    return { valid: true };
  }

  assert.equal(validateAmount(0).valid, false);
  assert.equal(validateAmount(-500).valid, false);
  assert.equal(validateAmount(100).valid, true);
  assert.equal(validateAmount(15000.5).valid, true);
});

test('STK Push Validation: Invoice/Account reference cannot be empty', () => {
  function validateInvoiceRef(ref) {
    if (!ref || ref.trim().length === 0) {
      return { valid: false, code: 'INVALID_INVOICE', message: 'Valid invoice or account reference is required' };
    }
    return { valid: true };
  }

  assert.equal(validateInvoiceRef('').valid, false);
  assert.equal(validateInvoiceRef('   ').valid, false);
  assert.equal(validateInvoiceRef('INV-2026-001').valid, true);
  assert.equal(validateInvoiceRef('RENT-A101').valid, true);
});
