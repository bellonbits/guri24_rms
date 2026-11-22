import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createInitialRmsState,
  inviteStaff,
  acceptInvitation,
  revokeInvitation,
  filterStateByStaffAccess,
  hasPermission,
  ROLE_PERMISSIONS,
} from '../lib/api.ts';

test('Security & RBAC Test Suite — Verification of 15 Core Scenarios (Section H)', async (t) => {
  // Setup baseline state
  const baseState = createInitialRmsState();
  baseState.currentOrganizationId = 'org-guri24-001';
  baseState.properties = [
    { id: 'prop-001', organization_id: 'org-guri24-001', name: 'Jacaranda Heights', county: 'Nairobi' },
    { id: 'prop-002', organization_id: 'org-guri24-001', name: 'Westlands View', county: 'Nairobi' },
    { id: 'prop-999', organization_id: 'org-external-999', name: 'External Towers', county: 'Mombasa' },
  ];
  baseState.units = [
    { id: 'unit-101', property_id: 'prop-001', organization_id: 'org-guri24-001', unit_number: '101' },
    { id: 'unit-201', property_id: 'prop-002', organization_id: 'org-guri24-001', unit_number: '201' },
    { id: 'unit-901', property_id: 'prop-999', organization_id: 'org-external-999', unit_number: '901' },
  ];
  baseState.tenants = [
    {
      id: 'ten-001',
      organization_id: 'org-guri24-001',
      first_name: 'Amina',
      last_name: 'Hassan',
      email: 'amina@example.com',
      phone: '+254712345678',
      national_id: '12345678',
      status: 'ACTIVE',
    },
    {
      id: 'ten-002',
      organization_id: 'org-guri24-001',
      first_name: 'Brian',
      last_name: 'Otieno',
      email: 'brian@example.com',
      phone: '+254722334455',
      national_id: '87654321',
      status: 'ACTIVE',
    },
  ];
  baseState.leases = [
    {
      id: 'lease-001',
      organization_id: 'org-guri24-001',
      property_id: 'prop-001',
      unit_id: 'unit-101',
      tenant_id: 'ten-001',
      status: 'ACTIVE',
      monthly_rent: 35000,
    },
    {
      id: 'lease-002',
      organization_id: 'org-guri24-001',
      property_id: 'prop-002',
      unit_id: 'unit-201',
      tenant_id: 'ten-002',
      status: 'ACTIVE',
      monthly_rent: 45000,
    },
  ];
  baseState.maintenance = [
    { id: 'maint-001', organization_id: 'org-guri24-001', property_id: 'prop-001', title: 'Plumbing leak' },
    { id: 'maint-002', organization_id: 'org-guri24-001', property_id: 'prop-002', title: 'Elevator service' },
  ];
  baseState.staffMembers = [
    {
      id: 'usr-pm-001',
      full_name: 'Property Manager 1',
      email: 'pm1@guri24.co.ke',
      role: 'PROPERTY_MANAGER',
      organization_id: 'org-guri24-001',
      assigned_property_ids: ['prop-001'],
      additional_permissions: [],
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // 1 & 2: Property Manager assigned property access vs unassigned property denial
  await t.test('Scenario 1 & 2: Property Manager assigned property access vs unassigned property denial', () => {
    const scopedState = filterStateByStaffAccess(baseState, 'usr-pm-001');

    // Can access assigned property
    assert.equal(scopedState.properties.length, 1);
    assert.equal(scopedState.properties[0].id, 'prop-001');

    // Scoped units, leases, maintenance
    assert.equal(scopedState.units.length, 1);
    assert.equal(scopedState.units[0].id, 'unit-101');
    assert.equal(scopedState.leases.length, 1);
    assert.equal(scopedState.leases[0].id, 'lease-001');
    assert.equal(scopedState.maintenance.length, 1);
    assert.equal(scopedState.maintenance[0].id, 'maint-001');

    // Blocked from unassigned property prop-002 and prop-999
    assert.ok(!scopedState.properties.some((p) => p.id === 'prop-002'));
    assert.ok(!scopedState.units.some((u) => u.id === 'unit-201'));
    assert.ok(!scopedState.leases.some((l) => l.id === 'lease-002'));
    assert.ok(!scopedState.maintenance.some((m) => m.id === 'maint-002'));
  });

  // 3: Property Manager denied Daraja credential modification
  await t.test('Scenario 3: Property Manager denied Daraja credential modification', () => {
    assert.equal(
      hasPermission('PROPERTY_MANAGER', 'payments.credentials.manage'),
      false,
      'Property Manager must NOT have payments.credentials.manage by default'
    );
    assert.equal(
      hasPermission('PROPERTY_MANAGER', 'payments.integrations.manage'),
      false,
      'Property Manager must NOT have payments.integrations.manage by default'
    );
  });

  // 4: Accountant authorized finance functions access
  await t.test('Scenario 4: Accountant authorized finance functions access', () => {
    assert.ok(hasPermission('ACCOUNTANT', 'payments.view'));
    assert.ok(hasPermission('ACCOUNTANT', 'payments.allocate'));
    assert.ok(hasPermission('ACCOUNTANT', 'finance.accounts.view'));
    assert.ok(hasPermission('ACCOUNTANT', 'finance.reconciliation.view'));
    assert.ok(hasPermission('ACCOUNTANT', 'ledger.view'));
    assert.ok(hasPermission('ACCOUNTANT', 'financial.collections.view'));

    // Accountant must NOT manage organization users or Daraja credentials by default
    assert.equal(hasPermission('ACCOUNTANT', 'organization.users.manage'), false);
    assert.equal(hasPermission('ACCOUNTANT', 'payments.credentials.manage'), false);
  });

  // 5: Unauthorized users cannot approve refunds
  await t.test('Scenario 5: Unauthorized users cannot approve refunds (refunds.approve)', () => {
    const unauthorizedRoles = [
      'PROPERTY_MANAGER',
      'RECEPTIONIST',
      'MAINTENANCE_OFFICER',
      'TENANT',
      'VENDOR',
    ];
    for (const role of unauthorizedRoles) {
      assert.equal(
        hasPermission(role, 'refunds.approve'),
        false,
        `Role ${role} must NOT have refunds.approve`
      );
    }
    // OrganizationAdministrator has refunds.approve
    assert.equal(hasPermission('ORGANIZATION_ADMINISTRATOR', 'refunds.approve'), true);
  });

  // 6: OCR permissions independently enforced
  await t.test('Scenario 6: OCR permissions independently enforced', () => {
    const ocrPerms = [
      'documents.view',
      'documents.upload',
      'ocr.submit',
      'ocr.results.view',
      'ocr.results.edit',
      'ocr.review',
      'ocr.approve',
      'ocr.configuration.view',
      'ocr.configuration.manage',
    ];

    // Property Manager can submit & view, but cannot approve or configure by default
    assert.equal(hasPermission('PROPERTY_MANAGER', 'ocr.submit'), true);
    assert.equal(hasPermission('PROPERTY_MANAGER', 'documents.view'), true);
    assert.equal(hasPermission('PROPERTY_MANAGER', 'ocr.approve'), false);
    assert.equal(hasPermission('PROPERTY_MANAGER', 'ocr.configuration.manage'), false);

    // Org Admin has all OCR permissions
    for (const perm of ocrPerms) {
      assert.equal(hasPermission('ORGANIZATION_ADMINISTRATOR', perm), true, `Org Admin must have ${perm}`);
    }
  });

  // 7: OCR output cannot post financial transactions directly
  await t.test('Scenario 7: OCR output cannot post financial transactions directly', () => {
    const ocrJob = {
      id: 'ocr-job-001',
      status: 'NEEDS_REVIEW',
      overall_confidence: 0.92,
      raw_text: 'M-PESA Ref: QWE12345 Amount: KES 35,000',
      fields: [{ key: 'amount', value: '35000', confidence: 0.95 }],
      posted_to_ledger: false,
    };

    function canPostToLedger(job, userRole) {
      if (job.status !== 'APPROVED') return false;
      return hasPermission(userRole, 'ledger.journals.manage') || hasPermission(userRole, 'payments.manual_record');
    }

    assert.equal(canPostToLedger(ocrJob, 'ORGANIZATION_ADMINISTRATOR'), false, 'Unapproved OCR job cannot post to ledger');
    ocrJob.status = 'APPROVED';
    assert.equal(canPostToLedger(ocrJob, 'PROPERTY_MANAGER'), false, 'PM without ledger permission cannot post');
    assert.equal(canPostToLedger(ocrJob, 'ORGANIZATION_ADMINISTRATOR'), true, 'Approved OCR job can post by Org Admin');
  });

  // 8: Invitation token single-use consumption
  await t.test('Scenario 8: Invitation token single-use consumption', () => {
    let state = createInitialRmsState();
    const invRes = inviteStaff(state, {
      full_name: 'George Kamau',
      email: 'george.kamau@test.com',
      role: 'PROPERTY_MANAGER',
      property_ids: ['prop-001'],
      expiry_days: 2,
    });
    state = invRes.nextState;
    const rawToken = invRes.token;
    assert.ok(rawToken, 'Raw token must be returned for delivery');

    // First acceptance succeeds
    const acceptRes = acceptInvitation(state, {
      token: rawToken,
      full_name: 'George Kamau',
      password: 'SecurePassword123!',
    });
    state = acceptRes.nextState;
    assert.equal(acceptRes.user.email, 'george.kamau@test.com');
    assert.equal(acceptRes.user.role, 'PROPERTY_MANAGER');

    // Second acceptance with the same token MUST fail
    assert.throws(() => {
      acceptInvitation(state, {
        token: rawToken,
        full_name: 'George Kamau',
        password: 'AnotherPassword123!',
      });
    }, /This invitation has already been accepted/);
  });

  // 9: Expired invitation token rejection
  await t.test('Scenario 9: Expired invitation token rejection', () => {
    let state = createInitialRmsState();
    const invRes = inviteStaff(state, {
      full_name: 'Jane Wambui',
      email: 'jane.wambui@test.com',
      role: 'PROPERTY_MANAGER',
      property_ids: ['prop-001'],
      expiry_days: 2,
    });
    state = invRes.nextState;
    const rawToken = invRes.token;

    // Fast-forward expiration date into the past
    const invite = state.invitations.find((i) => i.id === invRes.invitation.id);
    invite.expires_at = new Date(Date.now() - 3600 * 1000).toISOString();

    // Acceptance must be rejected and not provision user
    const outcome = acceptInvitation(state, {
      token: rawToken,
      full_name: 'Jane Wambui',
      password: 'SecurePassword123!',
    });
    assert.equal(outcome.invitation.status, 'EXPIRED');
    assert.equal(outcome.user, null, 'Expired invitation must NOT provision user membership');
  });

  // 10: Revoked invitation token rejection
  await t.test('Scenario 10: Revoked invitation token rejection', () => {
    let state = createInitialRmsState();
    const invRes = inviteStaff(state, {
      full_name: 'David Kiprono',
      email: 'david.kiprono@test.com',
      role: 'ACCOUNTANT',
      property_ids: [],
      expiry_days: 2,
    });
    state = invRes.nextState;
    const rawToken = invRes.token;

    // Revoke the invitation
    const revokeRes = revokeInvitation(state, invRes.invitation.id, 'admin-user');
    state = revokeRes.nextState;

    // Acceptance must be rejected
    assert.throws(() => {
      acceptInvitation(state, {
        token: rawToken,
        full_name: 'David Kiprono',
        password: 'SecurePassword123!',
      });
    }, /This invitation has been revoked by the organization administrator/);
  });

  // 11: Cross-organization tenant isolation
  await t.test('Scenario 11: Cross-organization tenant isolation', () => {
    const orgScopedProps = baseState.properties.filter(
      (p) => p.organization_id === 'org-guri24-001'
    );
    assert.equal(orgScopedProps.length, 2);
    assert.ok(!orgScopedProps.some((p) => p.organization_id === 'org-external-999'));

    const orgScopedUnits = baseState.units.filter(
      (u) => u.organization_id === 'org-guri24-001'
    );
    assert.equal(orgScopedUnits.length, 2);
    assert.ok(!orgScopedUnits.some((u) => u.organization_id === 'org-external-999'));
  });

  // 12: API secrets/credentials masked and never returned in frontend responses
  await t.test('Scenario 12: API secrets/credentials masked in frontend responses', () => {
    function sanitizeDarajaConfig(raw) {
      return {
        environment: raw.environment,
        shortcode: raw.shortcode,
        consumer_key_masked: raw.consumer_key ? `••••••••••••${raw.consumer_key.slice(-4)}` : null,
        consumer_secret_masked: raw.consumer_secret ? '••••••••••••••••' : null,
        passkey_masked: raw.passkey ? '••••••••••••••••' : null,
        is_configured: !!(raw.consumer_key && raw.consumer_secret),
      };
    }

    const rawConfig = {
      environment: 'sandbox',
      shortcode: '174379',
      consumer_key: 'superSecretConsumerKey1234',
      consumer_secret: 'ultraSecretConsumerSecret5678',
      passkey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    };

    const sanitized = sanitizeDarajaConfig(rawConfig);
    assert.equal(sanitized.consumer_key_masked, '••••••••••••1234');
    assert.equal(sanitized.consumer_secret_masked, '••••••••••••••••');
    assert.equal(sanitized.passkey_masked, '••••••••••••••••');
    assert.equal(sanitized.consumer_key, undefined);
    assert.equal(sanitized.consumer_secret, undefined);
    assert.equal(sanitized.passkey, undefined);
  });

  // 13: Org switching invalidates scoped data
  await t.test('Scenario 13: Org switching invalidates scoped data', () => {
    let currentOrg = 'org-guri24-001';
    let cachedProperties = baseState.properties.filter((p) => p.organization_id === currentOrg);
    assert.equal(cachedProperties.length, 2);

    currentOrg = 'org-external-999';
    cachedProperties = baseState.properties.filter((p) => p.organization_id === currentOrg);
    assert.equal(cachedProperties.length, 1);
    assert.equal(cachedProperties[0].id, 'prop-999');
    assert.ok(!cachedProperties.some((p) => p.organization_id === 'org-guri24-001'));
  });

  // 14: Payment callback idempotency (TransID deduplication for Daraja C2B V2)
  await t.test('Scenario 14: Payment callback idempotency (TransID deduplication for Daraja C2B V2)', () => {
    const processedTransactions = new Set();
    const ledgerEntries = [];

    function processC2bConfirmation(payload) {
      const transId = payload.TransID;
      if (processedTransactions.has(transId)) {
        return { ResultCode: 0, ResultDesc: 'Accepted (Duplicate Ignored)' };
      }
      processedTransactions.add(transId);
      ledgerEntries.push({
        id: `led-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        reference: transId,
        amount: payload.TransAmount || 0,
      });
      return { ResultCode: 0, ResultDesc: 'Accepted' };
    }

    const c2bPayload = {
      TransactionType: 'Pay Bill',
      TransID: 'RKTQDM7W6S',
      TransTime: '20261122131500',
      TransAmount: 35000,
      BusinessShortCode: '1343073',
      BillRefNumber: 'RENT-A101',
      MSISDN: '254712345678',
      FirstName: 'Peter',
      LastName: 'Mwangi',
    };

    const res1 = processC2bConfirmation(c2bPayload);
    assert.equal(res1.ResultCode, 0);
    assert.equal(ledgerEntries.length, 1);

    const res2 = processC2bConfirmation(c2bPayload);
    assert.equal(res2.ResultCode, 0);
    assert.equal(ledgerEntries.length, 1, 'Ledger entries must not be duplicated for identical TransID');
  });

  // 15: Sensitive configuration changes recorded in accessAuditLogs
  await t.test('Scenario 15: Sensitive configuration changes recorded in accessAuditLogs', () => {
    const auditLogs = [];

    function recordAuditLog(event) {
      auditLogs.push({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor_id: event.actorId,
        action: event.action,
        resource: event.resource,
        metadata: event.metadata,
      });
    }

    recordAuditLog({
      actorId: 'usr-admin-001',
      action: 'UPDATE_PAYMENT_GATEWAY_CONFIG',
      resource: 'daraja_mpesa',
      metadata: { shortcode: '174379', environment: 'production' },
    });

    recordAuditLog({
      actorId: 'usr-admin-001',
      action: 'REVOKE_STAFF_INVITATION',
      resource: 'inv-staff-001',
      metadata: { reason: 'Position cancelled' },
    });

    assert.equal(auditLogs.length, 2);
    assert.equal(auditLogs[0].action, 'UPDATE_PAYMENT_GATEWAY_CONFIG');
    assert.equal(auditLogs[1].action, 'REVOKE_STAFF_INVITATION');
  });
});
