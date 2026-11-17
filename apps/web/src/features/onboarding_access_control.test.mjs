import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createInitialRmsState,
  inviteStaff,
  inviteTenant,
  resendInvitation,
  revokeInvitation,
  acceptInvitation,
  updateUserStatus,
  updateUserPropertyAccess,
  revokeUserSessions,
  registerPlatformOrganization,
  updatePlatformOrganizationStatus,
  filterStateByStaffAccess,
  hasPermission,
  ROLE_PERMISSIONS,
} from '../lib/api.ts';

test('Guri24 RMS — User Onboarding, Staff Management, Property Scoping & Access Control', async (t) => {
  // Setup baseline state
  const baseState = createInitialRmsState();
  baseState.currentOrganizationId = 'org-guri24-001';
  baseState.properties = [
    { id: 'prop-001', organization_id: 'org-guri24-001', name: 'Jacaranda Heights', county: 'Nairobi' },
    { id: 'prop-002', organization_id: 'org-guri24-001', name: 'Westlands View', county: 'Nairobi' },
  ];
  baseState.units = [
    { id: 'unit-101', property_id: 'prop-001', organization_id: 'org-guri24-001', unit_number: '101' },
    { id: 'unit-201', property_id: 'prop-002', organization_id: 'org-guri24-001', unit_number: '201' },
  ];
  baseState.tenants = [
    {
      id: 'ten-001',
      organization_id: 'org-guri24-001',
      first_name: 'Amina',
      last_name: 'Hassan',
      email: 'amina.hassan@example.com',
      phone: '+254712345678',
      national_id: '12345678',
      status: 'ACTIVE',
    },
    {
      id: 'ten-002',
      organization_id: 'org-guri24-001',
      first_name: 'Brian',
      last_name: 'Otieno',
      email: 'brian.otieno@example.com',
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
    },
    {
      id: 'lease-002',
      organization_id: 'org-guri24-001',
      property_id: 'prop-002',
      unit_id: 'unit-201',
      tenant_id: 'ten-002',
      status: 'ACTIVE',
    },
  ];
  baseState.invoices = [
    { id: 'inv-1', property_id: 'prop-001', organization_id: 'org-guri24-001', amount_kes: 35000 },
    { id: 'inv-2', property_id: 'prop-002', organization_id: 'org-guri24-001', amount_kes: 45000 },
  ];
  baseState.maintenance = [
    { id: 'mnt-1', property_id: 'prop-001', organization_id: 'org-guri24-001', title: 'Sink repair' },
    { id: 'mnt-2', property_id: 'prop-002', organization_id: 'org-guri24-001', title: 'Roof inspection' },
  ];

  await t.test('1. Staff Member Invitation: Validates inputs, assigns property scopes, generates token & hash', () => {
    // Missing email throws error
    assert.throws(
      () =>
        inviteStaff(baseState, {
          full_name: 'Samuel Kiptoo',
          email: '',
          phone: '+254712345678',
          role: 'PROPERTY_MANAGER',
          property_ids: ['prop-001'],
        }),
      /A valid email address is required/
    );

    // Scoped role without properties throws error
    assert.throws(
      () =>
        inviteStaff(baseState, {
          full_name: 'Samuel Kiptoo',
          email: 'samuel.kiptoo@guri24.co.ke',
          phone: '+254712345678',
          role: 'PROPERTY_MANAGER',
          property_ids: [],
        }),
      /requires at least one assigned property scope/
    );

    // Successful invitation
    const { nextState, invitation, token } = inviteStaff(baseState, {
      full_name: 'Samuel Kiptoo',
      email: 'samuel.kiptoo@guri24.co.ke',
      phone: '+254712345678',
      role: 'PROPERTY_MANAGER',
      property_ids: ['prop-001'],
      expiry_days: 7,
    });

    assert.equal(invitation.email, 'samuel.kiptoo@guri24.co.ke');
    assert.equal(invitation.role, 'PROPERTY_MANAGER');
    assert.equal(invitation.status, 'PENDING');
    assert.ok(invitation.token_hash.startsWith('sha256_'));
    assert.ok(token.startsWith('inv_tok_'));
    assert.deepEqual(invitation.property_ids, ['prop-001']);
    assert.equal(invitation.sent_count, 1);
    assert.ok(new Date(invitation.expires_at) > new Date());

    // Verify audit log added
    const audit = nextState.accessAuditLogs.find((l) => l.event_type === 'STAFF_INVITED');
    assert.ok(audit, 'Audit log for STAFF_INVITED must be recorded');
  });

  await t.test('2. Duplicate Pending Prevention: Rejects duplicate invite and existing active member', () => {
    const { nextState } = inviteStaff(baseState, {
      full_name: 'Esther Mwangi',
      email: 'esther.m@guri24.co.ke',
      phone: '+254722001122',
      role: 'ACCOUNTANT',
      property_ids: ['prop-001', 'prop-002'],
    });

    // Duplicate pending invitation should be rejected
    assert.throws(
      () =>
        inviteStaff(nextState, {
          full_name: 'Esther Mwangi',
          email: 'esther.m@guri24.co.ke',
          phone: '+254722001122',
          role: 'ACCOUNTANT',
          property_ids: ['prop-001'],
        }),
      /A pending invitation already exists/
    );

    // Active member duplicate should be rejected
    assert.throws(
      () =>
        inviteStaff(baseState, {
          full_name: 'Peter Gatitu Mwangi',
          email: 'petergatitu61@gmail.com', // existing active admin
          phone: '+254712345678',
          role: 'PROPERTY_MANAGER',
          property_ids: ['prop-001'],
        }),
      /is already an active member/
    );
  });

  await t.test('3. Tenant Portal Invitation: Generates single-use token and prevents duplicates', () => {
    // Non-existent tenant throws error
    assert.throws(
      () => inviteTenant(baseState, { tenant_id: 'ten-999', email: 'none@example.com' }),
      /Tenant record not found/
    );

    // Successful tenant portal invite
    const { nextState, invitation, token } = inviteTenant(baseState, {
      tenant_id: 'ten-001',
      lease_id: 'lease-001',
      property_id: 'prop-001',
    });

    assert.equal(invitation.invitation_type, 'TENANT');
    assert.equal(invitation.email, 'amina.hassan@example.com');
    assert.equal(invitation.role, 'TENANT');
    assert.equal(invitation.status, 'PENDING');
    assert.ok(token.length > 10);

    // Duplicate pending tenant invite throws error
    assert.throws(
      () => inviteTenant(nextState, { tenant_id: 'ten-001' }),
      /A pending portal invitation already exists/
    );
  });

  await t.test('4. Resend & Revoke Invitation Lifecycle', () => {
    const { nextState: stateWithInv, invitation } = inviteStaff(baseState, {
      full_name: 'Kevin Wafula',
      email: 'kevin.w@guri24.co.ke',
      phone: '+254733112233',
      role: 'RECEPTIONIST',
      property_ids: ['prop-001'],
    });

    // Resend increments count and refreshes expiry
    const { nextState: resentState, invitation: resentInv } = resendInvitation(
      stateWithInv,
      invitation.id
    );
    assert.equal(resentInv.sent_count, 2);
    assert.equal(resentInv.status, 'PENDING');

    // Revoke transitions status to REVOKED
    const { nextState: revokedState, invitation: revokedInv } = revokeInvitation(
      resentState,
      invitation.id
    );
    assert.equal(revokedInv.status, 'REVOKED');

    // Cannot resend a revoked invitation
    assert.throws(() => resendInvitation(revokedState, invitation.id), /Cannot resend/);
  });

  await t.test('5. Invitation Acceptance: Consumes token atomically and provisions staff profile', () => {
    const { nextState: stateWithInv, invitation, token } = inviteStaff(baseState, {
      full_name: 'Alice Muthoni',
      email: 'alice.muthoni@guri24.co.ke',
      phone: '+254711445566',
      role: 'MAINTENANCE_OFFICER',
      property_ids: ['prop-001'],
    });

    // Accept valid invitation
    const { nextState: acceptedState, invitation: accInv, user } = acceptInvitation(
      stateWithInv,
      {
        token,
        password: 'SecurePassword2026!',
        full_name: 'Alice Muthoni',
      }
    );

    assert.equal(accInv.status, 'ACCEPTED');
    assert.ok(accInv.accepted_at);
    assert.equal(user.email, 'alice.muthoni@guri24.co.ke');
    assert.equal(user.role, 'MAINTENANCE_OFFICER');
    assert.equal(user.status, 'ACTIVE');

    // Verify UserPropertyAccess was established
    const propAccess = acceptedState.userPropertyAccess.filter((upa) => upa.user_id === user.id);
    assert.equal(propAccess.length, 1);
    assert.equal(propAccess[0].property_id, 'prop-001');

    // Attempting to accept again throws error (single-use token consumption)
    assert.throws(
      () =>
        acceptInvitation(acceptedState, {
          token,
          password: 'AnotherPassword!',
        }),
      /This invitation has already been accepted/
    );
  });

  await t.test('6. Rejects Expired or Revoked Invitation Tokens', () => {
    // Revoked token
    const { nextState: stateWithInv, invitation, token } = inviteStaff(baseState, {
      full_name: 'Mark Otieno',
      email: 'mark.otieno@guri24.co.ke',
      phone: '+254722889900',
      role: 'CARETAKER',
      property_ids: ['prop-002'],
    });

    const { nextState: revokedState } = revokeInvitation(stateWithInv, invitation.id);

    assert.throws(
      () => acceptInvitation(revokedState, { token }),
      /This invitation has been revoked/
    );

    // Expired token
    const expiredInv = {
      ...invitation,
      id: 'inv-expired-001',
      token_hash: 'hash-expired',
      expires_at: new Date(Date.now() - 100000).toISOString(),
    };
    const expiredState = {
      ...baseState,
      invitations: [expiredInv, ...baseState.invitations],
    };

    const outcome = acceptInvitation(expiredState, { token: 'hash-expired' });
    assert.equal(outcome.invitation.status, 'EXPIRED');
    assert.equal(outcome.user, null);
  });

  await t.test('7. Property-Level Access Scoping: Scopes records strictly to assigned properties', () => {
    // Add staff member assigned only to prop-001
    const staffProp1 = {
      id: 'usr-staff-prop1',
      organization_id: 'org-guri24-001',
      email: 'staff.prop1@guri24.co.ke',
      phone: '+254711111111',
      full_name: 'Staff Property One',
      role: 'PROPERTY_MANAGER',
      status: 'ACTIVE',
      assigned_property_ids: ['prop-001'],
      created_at: new Date().toISOString(),
    };

    const stateWithStaff = {
      ...baseState,
      staffMembers: [staffProp1, ...baseState.staffMembers],
    };

    const scopedState = filterStateByStaffAccess(stateWithStaff, staffProp1.id);

    // Properties: Only prop-001
    assert.equal(scopedState.properties.length, 1);
    assert.equal(scopedState.properties[0].id, 'prop-001');

    // Units: Only unit-101
    assert.equal(scopedState.units.length, 1);
    assert.equal(scopedState.units[0].id, 'unit-101');

    // Leases: Only lease-001
    assert.equal(scopedState.leases.length, 1);
    assert.equal(scopedState.leases[0].id, 'lease-001');

    // Tenants: Only ten-001
    assert.equal(scopedState.tenants.length, 1);
    assert.equal(scopedState.tenants[0].id, 'ten-001');

    // Invoices: Only inv-1
    assert.equal(scopedState.invoices.length, 1);
    assert.equal(scopedState.invoices[0].id, 'inv-1');

    // Maintenance: Only mnt-1
    assert.equal(scopedState.maintenance.length, 1);
    assert.equal(scopedState.maintenance[0].id, 'mnt-1');

    // Organization Administrator retains access to ALL properties
    const adminUser = baseState.staffMembers.find((s) => s.role === 'ORGANIZATION_ADMINISTRATOR');
    const adminScoped = filterStateByStaffAccess(baseState, adminUser.id);
    assert.equal(adminScoped.properties.length, 2);
  });

  await t.test('8. Staff Status Update & Session Revocation', () => {
    const staff = baseState.staffMembers.find((s) => s.id === 'usr-staff-pm-001');
    assert.ok(staff);

    // Suspend staff member
    const { nextState: suspendedState, user: suspendedUser } = updateUserStatus(
      baseState,
      staff.id,
      'SUSPENDED'
    );
    assert.equal(suspendedUser.status, 'SUSPENDED');

    // Audit log recorded
    const auditSuspend = suspendedState.accessAuditLogs.find((l) => l.event_type === 'USER_SUSPENDED');
    assert.ok(auditSuspend);

    // Reactivate staff member
    const { user: reactivatedUser } = updateUserStatus(
      suspendedState,
      staff.id,
      'ACTIVE'
    );
    assert.equal(reactivatedUser.status, 'ACTIVE');

    // Cannot suspend the primary organization administrator
    const admin = baseState.staffMembers.find((s) => s.role === 'ORGANIZATION_ADMINISTRATOR');
    assert.throws(
      () => updateUserStatus(baseState, admin.id, 'SUSPENDED'),
      /Cannot suspend the primary Organization Administrator/
    );

    // Revoke sessions records audit log
    const { nextState: sessionState } = revokeUserSessions(baseState, staff.id, 'Security audit');
    const auditRevoke = sessionState.accessAuditLogs.find((l) => l.event_type === 'SESSIONS_REVOKED');
    assert.ok(auditRevoke);
  });

  await t.test('9. Update Staff Property Scopes', () => {
    const staff = baseState.staffMembers.find((s) => s.id === 'usr-staff-pm-001');

    // Change scope to ['prop-001', 'prop-002']
    const { nextState, user } = updateUserPropertyAccess(
      baseState,
      staff.id,
      ['prop-001', 'prop-002']
    );

    assert.deepEqual(user.assigned_property_ids, ['prop-001', 'prop-002']);

    const propAccess = nextState.userPropertyAccess.filter((upa) => upa.user_id === staff.id);
    assert.equal(propAccess.length, 2);

    const audit = nextState.accessAuditLogs.find((l) => l.event_type === 'PROPERTY_ACCESS_UPDATED');
    assert.ok(audit);
  });

  await t.test('10. Platform Administration: Provision Client Organization & Super-Admin Boundaries', () => {
    const { nextState, organization, adminInvitation } = registerPlatformOrganization(
      baseState,
      {
        name: 'Karen Luxury Residences Ltd',
        slug: 'karen-luxury-residences',
        organization_type: 'PROPERTY_MANAGEMENT_COMPANY',
        county: 'Nairobi',
        contact_email: 'info@karenluxury.co.ke',
        contact_phone: '+254700112233',
        admin_full_name: 'Beatrice Ndung’u',
        admin_email: 'beatrice@karenluxury.co.ke',
        admin_phone: '+254700112233',
        subscription_plan: 'ENTERPRISE',
      }
    );

    assert.equal(organization.name, 'Karen Luxury Residences Ltd');
    assert.equal(organization.slug, 'karen-luxury-residences');
    assert.equal(organization.status, 'ACTIVE');
    assert.equal(organization.monthly_mrr_kes, 65000);

    // Admin invitation was generated
    assert.equal(adminInvitation.email, 'beatrice@karenluxury.co.ke');
    assert.equal(adminInvitation.invitation_type, 'ORGANIZATION_ADMIN');
    assert.equal(adminInvitation.status, 'PENDING');

    // Suspend organization
    const { nextState: suspendedOrgState } = updatePlatformOrganizationStatus(
      nextState,
      organization.id,
      'SUSPENDED'
    );
    const suspendedOrg = suspendedOrgState.platformOrganizations.find((o) => o.id === organization.id);
    assert.equal(suspendedOrg.status, 'SUSPENDED');

    // Platform permissions are strictly reserved for SAAS_SUPER_ADMINISTRATOR
    assert.equal(hasPermission('SAAS_SUPER_ADMINISTRATOR', 'platform.admin'), true);
    assert.equal(hasPermission('ORGANIZATION_ADMINISTRATOR', 'platform.admin'), false);
    assert.equal(hasPermission('PROPERTY_MANAGER', 'platform.admin'), false);
    assert.equal(hasPermission('TENANT', 'platform.admin'), false);
  });
});
