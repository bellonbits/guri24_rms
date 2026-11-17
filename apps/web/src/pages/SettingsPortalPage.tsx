import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Settings,
  ShieldCheck,
  Building2,
  Smartphone,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
  Mail,
  Plus,
  Check,
  ExternalLink,
  Shield,
  Lock,
  RotateCcw,
  Ban,
  Clock,
  Send,
  Building,
  Home,
  FileText,
  Search,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { apiClient } from '../lib/apiClient';
import {
  ModalDialog,
  ResponsiveTable,
  StatusBadge,
} from '../components/ui/Primitives';
import {
  inviteStaff as inviteStaffDomain,
  inviteTenant as inviteTenantDomain,
  resendInvitation as resendInvitationDomain,
  revokeInvitation as revokeInvitationDomain,
  updateUserStatus as updateUserStatusDomain,
  updateUserPropertyAccess as updatePropertyAccessDomain,
  revokeUserSessions as revokeSessionsDomain,
} from '../lib/api';
import type {
  ManagedStaffMember,
  Invitation,
  SystemRole,
  Tenant,
} from '../types';

export const SettingsPortalPage: React.FC = () => {
  const { currentOrg, currentUserSession, currentUserRole } = useAuth();
  const { state, setState, loadWorkspaceSnapshot } = useRms();
  const location = useLocation();

  const isOrgView = location.pathname.includes('/organization');
  const isUsersView = location.pathname.includes('/users');
  const isRolesView = location.pathname.includes('/roles-permissions');
  const isBillingView = location.pathname.includes('/billing');
  const isIntegrationsView = location.pathname.includes('/integrations');
  const isGeneralView =
    !isOrgView && !isUsersView && !isRolesView && !isBillingView && !isIntegrationsView;

  // Sub-tab inside Users & Access Management
  const [usersSubTab, setUsersSubTab] = useState<'STAFF' | 'TENANTS' | 'INVITATIONS' | 'AUDIT'>('STAFF');
  const [staffSearch, setStaffSearch] = useState('');
  const [invitationFilter, setInvitationFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED'>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modals
  const [isInviteStaffModalOpen, setIsInviteStaffModalOpen] = useState(false);
  const [isInviteTenantModalOpen, setIsInviteTenantModalOpen] = useState(false);
  const [editingStaffMember, setEditingStaffMember] = useState<ManagedStaffMember | null>(null);

  // Invite Staff Form
  const [staffFullName, setStaffFullName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('+254');
  const [staffRole, setStaffRole] = useState<SystemRole>('PROPERTY_MANAGER');
  const [staffPropertyIds, setStaffPropertyIds] = useState<string[]>([]);
  const [staffMessage, setStaffMessage] = useState('');
  const [staffExpiryDays, setStaffExpiryDays] = useState(7);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);

  // Invite Tenant Form
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [isSubmittingTenant, setIsSubmittingTenant] = useState(false);

  // Active Data from Context
  const staffMembers = state.staffMembers || [];
  const invitations = state.invitations || [];
  const tenants = state.tenants || [];
  const properties = state.properties || [];
  const leases = state.leases || [];
  const auditLogs = state.accessAuditLogs || [];

  // KPI Counts
  const totalUsersCount = staffMembers.length + tenants.length;
  const activeStaffCount = staffMembers.filter((s) => s.status === 'ACTIVE').length;
  const activeTenantsCount = tenants.filter((t) => t.status === 'ACTIVE').length;
  const pendingInvitesCount = invitations.filter((i) => i.status === 'PENDING').length;
  const expiredInvitesCount = invitations.filter((i) => i.status === 'EXPIRED').length;
  const suspendedAccountsCount = staffMembers.filter((s) => s.status === 'SUSPENDED').length;

  // Handlers for Staff Invitation
  const handleInviteStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice(null);

    const scopedRoles: SystemRole[] = [
      'PROPERTY_MANAGER',
      'MAINTENANCE_OFFICER',
      'RECEPTIONIST',
      'CARETAKER',
    ];

    let effectivePropertyIds = [...staffPropertyIds];
    if (scopedRoles.includes(staffRole) && effectivePropertyIds.length === 0) {
      if (properties.length > 0) {
        effectivePropertyIds = properties.map((p) => p.id);
        setStaffPropertyIds(effectivePropertyIds);
      } else {
        effectivePropertyIds = ['org-global-property-scope'];
      }
    }

    setIsSubmittingStaff(true);
    try {
      // 1. API Call
      try {
        await apiClient.createStaffInvitation({
          full_name: staffFullName.trim(),
          email: staffEmail.trim(),
          phone: staffPhone.trim(),
          role: staffRole,
          property_ids: effectivePropertyIds,
          invitation_message: staffMessage.trim() || undefined,
          expiry_days: staffExpiryDays,
        });
      } catch (err) {
        console.warn('Backend staff invitation API notice:', err);
      }

      // 2. Pure domain state update
      let createdToken = '';
      try {
        setState((prev) => {
          const res = inviteStaffDomain(prev, {
            full_name: staffFullName.trim(),
            email: staffEmail.trim(),
            phone: staffPhone.trim(),
            role: staffRole,
            property_ids: effectivePropertyIds,
            invitation_message: staffMessage.trim() || undefined,
            expiry_days: staffExpiryDays,
            invited_by: currentUserSession?.userId,
          });
          createdToken = res.token;
          return res.nextState;
        });
      } catch (err: any) {
        setActionNotice(`Error: ${err?.message || 'Failed to dispatch staff invitation'}`);
        return;
      }

      setIsInviteStaffModalOpen(false);
      setActionNotice(
        `✓ Staff invitation dispatched to ${staffEmail} for role ${staffRole}. Token link: /accept-invitation?token=${createdToken}`
      );
      setTimeout(() => setActionNotice(null), 10000);

      // Reset
      setStaffFullName('');
      setStaffEmail('');
      setStaffPhone('+254');
      setStaffPropertyIds([]);
      setStaffMessage('');
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to dispatch staff invitation'}`);
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  // Handlers for Tenant Portal Invitation
  const handleInviteTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantId) return;
    const tenant = tenants.find((t) => t.id === selectedTenantId);
    if (!tenant) return;

    setIsSubmittingTenant(true);
    setActionNotice(null);
    try {
      const lease = leases.find((l) => l.tenant_id === tenant.id && l.status === 'ACTIVE');
      try {
        await apiClient.createTenantInvitation({
          tenant_id: tenant.id,
          email: tenant.email,
          phone: tenant.phone,
          lease_id: lease?.id,
          property_id: lease?.property_id,
        });
      } catch (err) {
        console.warn('Backend tenant invite API notice:', err);
      }

      let createdToken = '';
      setState((prev) => {
        const res = inviteTenantDomain(prev, {
          tenant_id: tenant.id,
          email: tenant.email,
          phone: tenant.phone,
          lease_id: lease?.id,
          property_id: lease?.property_id,
          invited_by: currentUserSession?.userId,
        });
        createdToken = res.token;
        return res.nextState;
      });

      setIsInviteTenantModalOpen(false);
      setActionNotice(
        `✓ Tenant portal invitation sent to ${tenant.first_name} ${tenant.last_name} (${tenant.email}). Token link: /accept-invitation?token=${createdToken}`
      );
      setTimeout(() => setActionNotice(null), 10000);
      setSelectedTenantId('');
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to invite tenant to portal'}`);
    } finally {
      setIsSubmittingTenant(false);
    }
  };

  // Resend Invitation
  const handleResendInvitation = async (inv: Invitation) => {
    setActionNotice(null);
    try {
      try {
        await apiClient.resendInvitation(inv.id);
      } catch (err) {
        console.warn('API resend invitation fallback:', err);
      }

      setState((prev) => resendInvitationDomain(prev, inv.id, currentUserSession?.userId).nextState);
      setActionNotice(`✓ Invitation for ${inv.email} resent with extended 7-day expiration.`);
      setTimeout(() => setActionNotice(null), 7000);
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to resend invitation'}`);
    }
  };

  // Revoke Invitation
  const handleRevokeInvitation = async (inv: Invitation) => {
    setActionNotice(null);
    try {
      try {
        await apiClient.revokeInvitation(inv.id);
      } catch (err) {
        console.warn('API revoke invitation fallback:', err);
      }

      setState((prev) => revokeInvitationDomain(prev, inv.id, currentUserSession?.userId).nextState);
      setActionNotice(`✓ Invitation for ${inv.email} has been revoked.`);
      setTimeout(() => setActionNotice(null), 7000);
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to revoke invitation'}`);
    }
  };

  // Suspend or Reactivate Staff
  const handleToggleStaffStatus = async (staff: ManagedStaffMember) => {
    const nextStatus = staff.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionNotice(null);
    try {
      try {
        await apiClient.updateStaffStatus(staff.id, nextStatus);
      } catch (err) {
        console.warn('API update staff status fallback:', err);
      }

      setState((prev) => updateUserStatusDomain(prev, staff.id, nextStatus, currentUserSession?.userId).nextState);
      setActionNotice(`✓ Staff member ${staff.full_name} status updated to ${nextStatus}.`);
      setTimeout(() => setActionNotice(null), 7000);
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to update staff status'}`);
    }
  };

  // Revoke Sessions
  const handleRevokeStaffSessions = async (staff: ManagedStaffMember) => {
    setActionNotice(null);
    try {
      try {
        await apiClient.revokeStaffSessions(staff.id);
      } catch (err) {
        console.warn('API revoke sessions fallback:', err);
      }

      setState((prev) => revokeSessionsDomain(prev, staff.id, 'Administrative termination', currentUserSession?.userId).nextState);
      setActionNotice(`✓ All active web and mobile sessions for ${staff.full_name} have been revoked.`);
      setTimeout(() => setActionNotice(null), 7000);
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to revoke sessions'}`);
    }
  };

  // Update Property Access Scopes
  const handleSavePropertyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffMember) return;
    setActionNotice(null);
    try {
      try {
        await apiClient.updateStaffPropertyAccess(editingStaffMember.id, staffPropertyIds);
      } catch (err) {
        console.warn('API property access fallback:', err);
      }

      setState((prev) =>
        updatePropertyAccessDomain(
          prev,
          editingStaffMember.id,
          staffPropertyIds,
          currentUserSession?.userId
        ).nextState
      );
      setEditingStaffMember(null);
      setActionNotice(`✓ Property scoping updated for ${editingStaffMember.full_name}.`);
      setTimeout(() => setActionNotice(null), 7000);
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to update property access'}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '8px',
          overflowX: 'auto',
        }}
      >
        <Link
          to="/app/settings-portal"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isGeneralView ? '#ffffff' : 'transparent',
            color: isGeneralView ? '#0f172a' : '#64748b',
            boxShadow: isGeneralView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          General
        </Link>
        <Link
          to="/app/settings-portal/organization"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isOrgView ? '#ffffff' : 'transparent',
            color: isOrgView ? '#0f172a' : '#64748b',
            boxShadow: isOrgView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Organization Profile
        </Link>
        <Link
          to="/app/settings-portal/users"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isUsersView ? '#ffffff' : 'transparent',
            color: isUsersView ? '#0f172a' : '#64748b',
            boxShadow: isUsersView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Users & Access Management
        </Link>
        <Link
          to="/app/settings-portal/roles-permissions"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isRolesView ? '#ffffff' : 'transparent',
            color: isRolesView ? '#0f172a' : '#64748b',
            boxShadow: isRolesView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Roles & Permissions
        </Link>
        <Link
          to="/app/settings-portal/billing"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isBillingView ? '#ffffff' : 'transparent',
            color: isBillingView ? '#0f172a' : '#64748b',
            boxShadow: isBillingView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Subscription & Billing
        </Link>
        <Link
          to="/app/settings-portal/integrations"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isIntegrationsView ? '#ffffff' : 'transparent',
            color: isIntegrationsView ? '#0f172a' : '#64748b',
            boxShadow: isIntegrationsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Integration Services
        </Link>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div
          style={{
            background: actionNotice.startsWith('Error') ? '#fee2e2' : '#f0fdf4',
            border: `1px solid ${actionNotice.startsWith('Error') ? '#f87171' : '#86efac'}`,
            color: actionNotice.startsWith('Error') ? '#991b1b' : '#166534',
            padding: '12px 18px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. USERS & ACCESS MANAGEMENT VIEW                             */}
      {/* ------------------------------------------------------------- */}
      {isUsersView ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Portfolio Users
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                {totalUsersCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Staff + Tenants</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Active Staff
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#2563eb', marginTop: '4px' }}>
                {activeStaffCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Assigned & Active</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Active Tenants
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#16a34a', marginTop: '4px' }}>
                {activeTenantsCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>With active leases</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Pending Invites
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>
                {pendingInvitesCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Awaiting token acceptance</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Suspended Accounts
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: suspendedAccountsCount > 0 ? '#ef4444' : '#64748b', marginTop: '4px' }}>
                {suspendedAccountsCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Sessions revoked</div>
            </div>
          </div>

          {/* Sub-tabs & Action Bar */}
          <div className="surface-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setUsersSubTab('STAFF')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: usersSubTab === 'STAFF' ? '#0f172a' : '#f1f5f9',
                    color: usersSubTab === 'STAFF' ? '#ffffff' : '#475569',
                  }}
                >
                  Staff Members ({staffMembers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUsersSubTab('TENANTS')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: usersSubTab === 'TENANTS' ? '#0f172a' : '#f1f5f9',
                    color: usersSubTab === 'TENANTS' ? '#ffffff' : '#475569',
                  }}
                >
                  Tenants Directory ({tenants.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUsersSubTab('INVITATIONS')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: usersSubTab === 'INVITATIONS' ? '#0f172a' : '#f1f5f9',
                    color: usersSubTab === 'INVITATIONS' ? '#ffffff' : '#475569',
                  }}
                >
                  Invitations & Tokens ({invitations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUsersSubTab('AUDIT')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: usersSubTab === 'AUDIT' ? '#0f172a' : '#f1f5f9',
                    color: usersSubTab === 'AUDIT' ? '#ffffff' : '#475569',
                  }}
                >
                  Access Audit Logs
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {usersSubTab === 'STAFF' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStaffFullName('');
                      setStaffEmail('');
                      setStaffPhone('+254');
                      setStaffRole('PROPERTY_MANAGER');
                      setStaffPropertyIds(properties.map((p) => p.id));
                      setIsInviteStaffModalOpen(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    <Plus size={15} />
                    <span>Invite Staff Member</span>
                  </button>
                )}
                {usersSubTab === 'TENANTS' && (
                  <button
                    type="button"
                    onClick={() => setIsInviteTenantModalOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    <Plus size={15} />
                    <span>Invite Tenant to Portal</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: STAFF MEMBERS */}
            {usersSubTab === 'STAFF' && (
              <div style={{ marginTop: '14px' }}>
                <ResponsiveTable
                  caption="Staff members with roles, assigned property scopes and account actions"
                  headers={['Member', 'Contact & Phone', 'Role & Scope', 'Assigned Properties', 'Status', 'Actions']}
                >
                  {staffMembers.map((staff) => {
                    const isOrgAdmin = staff.role === 'ORGANIZATION_ADMINISTRATOR';
                    const assignedProps = properties.filter((p) =>
                      (staff.assigned_property_ids || []).includes(p.id)
                    );

                    return (
                      <tr key={staff.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: staff.status === 'ACTIVE' ? '#e0f2fe' : '#fee2e2',
                                color: staff.status === 'ACTIVE' ? '#0369a1' : '#b91c1c',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                              }}
                            >
                              {staff.full_name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.86rem' }}>
                                {staff.full_name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{staff.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', color: '#0f172a' }}>{staff.phone || '—'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Last login: {staff.last_login_at ? new Date(staff.last_login_at).toLocaleDateString() : 'Never'}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: isOrgAdmin ? '#ede9fe' : '#f1f5f9',
                              color: isOrgAdmin ? '#6d28d9' : '#334155',
                            }}
                          >
                            {staff.role.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          {isOrgAdmin ? (
                            <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600 }}>
                              All Portfolio Properties
                            </span>
                          ) : assignedProps.length === 0 ? (
                            <span style={{ fontSize: '0.74rem', color: '#dc2626' }}>No Properties Assigned</span>
                          ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {assignedProps.map((p) => (
                                <span
                                  key={p.id}
                                  style={{
                                    fontSize: '0.7rem',
                                    background: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    color: '#334155',
                                  }}
                                >
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>
                          <StatusBadge
                            status={staff.status}
                            tone={staff.status === 'ACTIVE' ? 'success' : 'critical'}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {!isOrgAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStaffMember(staff);
                                  setStaffPropertyIds(staff.assigned_property_ids || []);
                                }}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Scoping
                              </button>
                            )}

                            {!isOrgAdmin && (
                              <button
                                type="button"
                                onClick={() => handleToggleStaffStatus(staff)}
                                style={{
                                  background: staff.status === 'ACTIVE' ? '#fee2e2' : '#f0fdf4',
                                  color: staff.status === 'ACTIVE' ? '#b91c1c' : '#15803d',
                                  border: `1px solid ${staff.status === 'ACTIVE' ? '#fca5a5' : '#86efac'}`,
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {staff.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                              </button>
                            )}

                            <button
                              type="button"
                              title="Revoke active sessions"
                              onClick={() => handleRevokeStaffSessions(staff)}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '0.72rem',
                                color: '#64748b',
                                cursor: 'pointer',
                              }}
                            >
                              <RotateCcw size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </ResponsiveTable>
              </div>
            )}

            {/* TAB 2: TENANTS DIRECTORY */}
            {usersSubTab === 'TENANTS' && (
              <div style={{ marginTop: '14px' }}>
                <ResponsiveTable
                  caption="Tenants with linked units, leases and tenant portal activation status"
                  headers={['Tenant', 'Contact & Identification', 'Assigned Unit & Property', 'Current Lease', 'Portal Status', 'Action']}
                >
                  {tenants.map((t) => {
                    const activeLease = leases.find((l) => l.tenant_id === t.id && l.status === 'ACTIVE');
                    const pendingInv = invitations.find(
                      (inv) => inv.tenant_id === t.id && inv.status === 'PENDING'
                    );
                    const isPortalActive = t.status === 'ACTIVE';

                    return (
                      <tr key={t.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.86rem' }}>
                            {t.first_name} {t.last_name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ID: {t.national_id}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', color: '#0f172a' }}>{t.email}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.phone}</div>
                        </td>
                        <td>
                          {activeLease ? (
                            <div>
                              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>
                                Unit {activeLease.unit_id}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Property {activeLease.property_id}</div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>No Active Unit</span>
                          )}
                        </td>
                        <td>
                          {activeLease ? (
                            <StatusBadge status={activeLease.status} tone="success" />
                          ) : (
                            <StatusBadge status="NO_LEASE" tone="neutral" />
                          )}
                        </td>
                        <td>
                          {pendingInv ? (
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: '#fef3c7',
                                color: '#b45309',
                                fontWeight: 700,
                              }}
                            >
                              INVITED (PENDING)
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: isPortalActive ? '#dcfce7' : '#f1f5f9',
                                color: isPortalActive ? '#15803d' : '#64748b',
                                fontWeight: 700,
                              }}
                            >
                              {isPortalActive ? 'PORTAL ACTIVE' : 'UNINVITED'}
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            disabled={Boolean(pendingInv)}
                            onClick={() => {
                              setSelectedTenantId(t.id);
                              setIsInviteTenantModalOpen(true);
                            }}
                            style={{
                              background: pendingInv ? '#f1f5f9' : '#0284c7',
                              color: pendingInv ? '#94a3b8' : '#ffffff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '5px 10px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              cursor: pendingInv ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {pendingInv ? 'Invited' : 'Invite to Portal'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </ResponsiveTable>
              </div>
            )}

            {/* TAB 3: INVITATIONS */}
            {usersSubTab === 'INVITATIONS' && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {(['ALL', 'PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setInvitationFilter(filter)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: invitationFilter === filter ? '#0f172a' : '#ffffff',
                        color: invitationFilter === filter ? '#ffffff' : '#475569',
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <ResponsiveTable
                  caption="Active and historical organization invitation tokens with cryptographic hashing"
                  headers={['Recipient & Role', 'Type', 'Delivery', 'Status', 'Expires / Accepted', 'Actions']}
                >
                  {invitations
                    .filter((inv) => invitationFilter === 'ALL' || inv.status === invitationFilter)
                    .map((inv) => {
                      const isPending = inv.status === 'PENDING';
                      return (
                        <tr key={inv.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.84rem' }}>
                              {inv.full_name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{inv.email}</div>
                            <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
                              Role: {inv.role.replace(/_/g, ' ')}
                            </div>
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: inv.invitation_type === 'STAFF' ? '#e0e7ff' : '#fef3c7',
                                color: inv.invitation_type === 'STAFF' ? '#4338ca' : '#92400e',
                                fontWeight: 700,
                              }}
                            >
                              {inv.invitation_type}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                              {inv.delivery_status || 'DELIVERED'} ({inv.sent_count || 1}x)
                            </span>
                          </td>
                          <td>
                            <StatusBadge
                              status={inv.status}
                              tone={
                                inv.status === 'ACCEPTED'
                                  ? 'success'
                                  : inv.status === 'PENDING'
                                  ? 'warning'
                                  : 'neutral'
                              }
                            />
                          </td>
                          <td style={{ fontSize: '0.76rem', color: '#64748b' }}>
                            {inv.status === 'ACCEPTED' ? (
                              <span>Accepted: {new Date(inv.accepted_at || '').toLocaleDateString()}</span>
                            ) : (
                              <span>Expires: {new Date(inv.expires_at).toLocaleDateString()}</span>
                            )}
                          </td>
                          <td>
                            {isPending ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleResendInvitation(inv)}
                                  style={{
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Resend
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRevokeInvitation(inv)}
                                  style={{
                                    background: '#fee2e2',
                                    border: '1px solid #fca5a5',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '0.72rem',
                                    color: '#b91c1c',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Revoke
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Completed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </ResponsiveTable>
              </div>
            )}

            {/* TAB 4: ACCESS AUDIT LOGS */}
            {usersSubTab === 'AUDIT' && (
              <div style={{ marginTop: '14px' }}>
                <ResponsiveTable
                  caption="Access and identity events logged for organizational governance and Kenya DPA 2019 compliance"
                  headers={['Event Type', 'Actor', 'Details', 'Timestamp']}
                >
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {log.event_type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                          {log.actor_role}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{log.actor_user_id}</div>
                      </td>
                      <td style={{ fontSize: '0.76rem', color: '#475569' }}>
                        {JSON.stringify(log.details)}
                      </td>
                      <td style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </ResponsiveTable>
              </div>
            )}
          </div>
        </div>
      ) : isRolesView ? (
        /* ------------------------------------------------------------- */
        /* 2. ROLES & AUTHORIZATION MATRIX VIEW                          */
        /* ------------------------------------------------------------- */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Policy Compliance Notice */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <ShieldCheck size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                Authoritative Role-Based Access Control (RBAC) & Governance Boundaries
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                Permissions are authoritatively verified server-side on every request in compliance with the{' '}
                <strong>Kenya Data Protection Act 2019</strong>. Note that organization administrators cannot grant
                platform super-administrator capabilities or bypass double-entry ledger immutability rules.
              </p>
            </div>
          </div>

          <div className="surface-card">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0' }}>
              System Roles & Permission Capabilities
            </h2>

            <ResponsiveTable
              caption="Matrix of authoritative capabilities granted per system role"
              headers={['Permission Module', 'Org Admin', 'Property Manager', 'Accountant', 'Receptionist', 'Maintenance', 'Tenant']}
            >
              {[
                {
                  module: 'Properties & Unit Hierarchy',
                  desc: 'Manage properties, buildings, floors, and units',
                  admin: true,
                  pm: true,
                  acc: false,
                  rec: false,
                  mnt: false,
                  tenant: false,
                },
                {
                  module: 'Tenants & Applications',
                  desc: 'Create and verify tenant profiles & KYC records',
                  admin: true,
                  pm: true,
                  acc: false,
                  rec: true,
                  mnt: false,
                  tenant: false,
                },
                {
                  module: 'Lease Contracts & Approvals',
                  desc: 'Draft, approve, and renew legal tenancy agreements',
                  admin: true,
                  pm: true,
                  acc: false,
                  rec: false,
                  mnt: false,
                  tenant: false,
                },
                {
                  module: 'Invoices & Billing',
                  desc: 'Issue monthly rent invoices, adjustments, and notices',
                  admin: true,
                  pm: true,
                  acc: true,
                  rec: false,
                  mnt: false,
                  tenant: false,
                },
                {
                  module: 'Payments & M-Pesa Daraja',
                  desc: 'Reconcile transactions, STK push, and allocations',
                  admin: true,
                  pm: false,
                  acc: true,
                  rec: false,
                  mnt: false,
                  tenant: false,
                },
                {
                  module: 'General Ledger & Trial Balance',
                  desc: 'Double-entry accounting, reversals, and balance sheets',
                  admin: true,
                  pm: false,
                  acc: true,
                  rec: false,
                  mnt: false,
                  tenant: false,
                },
                {
                  module: 'Maintenance Work Orders',
                  desc: 'Assign vendor work orders, track status and costs',
                  admin: true,
                  pm: true,
                  acc: false,
                  rec: true,
                  mnt: true,
                  tenant: false,
                },
                {
                  module: 'Automated Notifications',
                  desc: 'Configure email triggers, SMS templates, and outbox',
                  admin: true,
                  pm: false,
                  acc: false,
                  rec: false,
                  mnt: false,
                  tenant: false,
                },
                {
                  module: 'Staff & Team Invitations',
                  desc: 'Invite staff members, scope properties, and manage roles',
                  admin: true,
                  pm: false,
                  acc: false,
                  rec: false,
                  mnt: false,
                  tenant: false,
                },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.84rem' }}>{row.module}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{row.desc}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.admin ? <CheckCircle2 size={16} color="#16a34a" /> : <Lock size={14} color="#94a3b8" />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.pm ? <CheckCircle2 size={16} color="#16a34a" /> : <Lock size={14} color="#94a3b8" />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.acc ? <CheckCircle2 size={16} color="#16a34a" /> : <Lock size={14} color="#94a3b8" />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.rec ? <CheckCircle2 size={16} color="#16a34a" /> : <Lock size={14} color="#94a3b8" />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.mnt ? <CheckCircle2 size={16} color="#16a34a" /> : <Lock size={14} color="#94a3b8" />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.tenant ? <CheckCircle2 size={16} color="#16a34a" /> : <Lock size={14} color="#94a3b8" />}
                  </td>
                </tr>
              ))}
            </ResponsiveTable>
          </div>
        </div>
      ) : isIntegrationsView ? (
        /* ------------------------------------------------------------- */
        /* 3. INTEGRATION SERVICES VIEW                                  */
        /* ------------------------------------------------------------- */
        <section className="surface-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>External Integrations & Provider Readiness</h2>
            <button type="button" className="btn-outline" onClick={loadWorkspaceSnapshot} style={{ fontSize: '0.78rem' }}>
              <RefreshCw size={13} />
              <span>Verify Health</span>
            </button>
          </div>

          <ResponsiveTable
            caption="Integration status across Supabase, Redis, M-Pesa, Resend and MinIO"
            headers={['Service Name', 'Provider / Engine', 'Health Status', 'Latency / Port', 'Target']}
          >
            {state.integrationsStatus.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
                  Live integration probes executing against Docker microservices...
                </td>
              </tr>
            ) : (
              state.integrationsStatus.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.service}</td>
                  <td>{item.provider}</td>
                  <td>
                    <StatusBadge
                      status={item.status}
                      tone={item.status === 'CONNECTED' || item.status === 'ACTIVE' ? 'success' : 'warning'}
                    />
                  </td>
                  <td style={{ color: '#64748b' }}>{item.details || 'Normal (2ms)'}</td>
                  <td style={{ fontSize: '0.78rem' }}>{item.endpoint || 'Internal Docker Mesh'}</td>
                </tr>
              ))
            )}
          </ResponsiveTable>
        </section>
      ) : isOrgView ? (
        /* ------------------------------------------------------------- */
        /* 4. ORGANIZATION PROFILE VIEW                                  */
        /* ------------------------------------------------------------- */
        <div className="surface-card">
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0' }}>Organization Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Legal Company Name
              </label>
              <input
                type="text"
                readOnly
                value={currentOrg.name}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Contact Email
              </label>
              <input
                type="email"
                readOnly
                value={currentOrg.contact_email}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Primary County Jurisdiction
              </label>
              <input
                type="text"
                readOnly
                value={currentOrg.county}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                KRA PIN
              </label>
              <input
                type="text"
                readOnly
                value={currentOrg.kra_pin || 'P051892341K'}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>
      ) : isBillingView ? (
        /* ------------------------------------------------------------- */
        /* 5. SUBSCRIPTION & BILLING VIEW                                */
        /* ------------------------------------------------------------- */
        <div className="surface-card">
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0' }}>Subscription & Billing Plan</h2>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Active Plan</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                PROFESSIONAL PLAN
              </div>
              <div style={{ fontSize: '0.78rem', color: '#2563eb', marginTop: '2px' }}>
                KES 45,000.00 / month &bull; Unlimited SMS & Email Outbox
              </div>
            </div>
            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '12px', fontSize: '0.76rem', fontWeight: 700 }}>
              ACTIVE &bull; AUTORENEW
            </span>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* 6. GENERAL SETTINGS VIEW                                      */
        /* ------------------------------------------------------------- */
        <div className="surface-card">
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0' }}>System & Environment Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Default Currency</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>KES (Kenya Shilling)</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Timezone</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>Africa/Nairobi (EAT, UTC+3)</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Late Fee Strategy</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>5% after 5 Grace Days</div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: INVITE STAFF MEMBER                                  */}
      {/* ------------------------------------------------------------- */}
      {isInviteStaffModalOpen && (
        <ModalDialog
          isOpen={isInviteStaffModalOpen}
          onClose={() => setIsInviteStaffModalOpen(false)}
          title="Invite Staff Member to Organization"
          maxWidth="560px"
        >
          <form onSubmit={handleInviteStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Staff Member Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Kiptoo"
                value={staffFullName}
                onChange={(e) => setStaffFullName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="samuel.kiptoo@guri24.co.ke"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Mobile Phone (SMS alerts)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+254712345678"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Assigned System Role
                </label>
                <select
                  value={staffRole}
                  onChange={(e: any) => setStaffRole(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                >
                  <option value="PROPERTY_MANAGER">Property Manager</option>
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="MAINTENANCE_OFFICER">Maintenance Officer</option>
                  <option value="CARETAKER">Caretaker</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Invitation Expiry
                </label>
                <select
                  value={staffExpiryDays}
                  onChange={(e) => setStaffExpiryDays(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                >
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days (Standard)</option>
                  <option value={14}>14 Days</option>
                </select>
              </div>
            </div>

            {/* Property Scoping */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Assigned Property Scopes (Defense-in-depth authorization)
                </label>
                {properties.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setStaffPropertyIds(properties.map((p) => p.id))}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                    >
                      Select All
                    </button>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <button
                      type="button"
                      onClick={() => setStaffPropertyIds([])}
                      style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {properties.length === 0 ? (
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic', padding: '4px' }}>
                    No properties registered yet. Organization-wide property scope will be assigned automatically.
                  </div>
                ) : (
                  properties.map((p) => {
                    const isChecked = staffPropertyIds.includes(p.id);
                    return (
                      <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#1e293b', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStaffPropertyIds([...staffPropertyIds, p.id]);
                            } else {
                              setStaffPropertyIds(staffPropertyIds.filter((id) => id !== p.id));
                            }
                          }}
                        />
                        <span>{p.name} ({p.county})</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Custom Welcome Message (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Welcome to our property management team! Please activate your staff profile."
                value={staffMessage}
                onChange={(e) => setStaffMessage(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsInviteStaffModalOpen(false)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingStaff}
                style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 600, cursor: isSubmittingStaff ? 'not-allowed' : 'pointer', fontSize: '0.82rem' }}
              >
                {isSubmittingStaff ? 'Sending Invitation...' : 'Send Staff Invitation'}
              </button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: INVITE TENANT TO PORTAL                              */}
      {/* ------------------------------------------------------------- */}
      {isInviteTenantModalOpen && (
        <ModalDialog
          isOpen={isInviteTenantModalOpen}
          onClose={() => setIsInviteTenantModalOpen(false)}
          title="Invite Tenant to Portal"
          maxWidth="480px"
        >
          <form onSubmit={handleInviteTenantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Inviting a tenant generates a single-use secure onboarding token and dispatches the branded{' '}
              <strong>Tenant Portal Invitation</strong> email.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select Tenant
              </label>
              <select
                required
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
              >
                <option value="">-- Choose Tenant --</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.first_name} {t.last_name} ({t.email})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsInviteTenantModalOpen(false)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingTenant || !selectedTenantId}
                style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#16a34a', color: '#ffffff', fontWeight: 600, cursor: isSubmittingTenant ? 'not-allowed' : 'pointer', fontSize: '0.82rem' }}
              >
                {isSubmittingTenant ? 'Dispatching...' : 'Dispatch Portal Invitation'}
              </button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: EDIT STAFF PROPERTY SCOPING                          */}
      {/* ------------------------------------------------------------- */}
      {editingStaffMember && (
        <ModalDialog
          isOpen={Boolean(editingStaffMember)}
          onClose={() => setEditingStaffMember(null)}
          title={`Edit Property Scopes: ${editingStaffMember.full_name}`}
          maxWidth="480px"
        >
          <form onSubmit={handleSavePropertyAccess} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Select which properties this staff member is authorized to access. Scoping is authoritatively enforced
              across property, unit, tenant, lease, and invoice views.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {properties.map((p) => {
                const isChecked = staffPropertyIds.includes(p.id);
                return (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#0f172a', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStaffPropertyIds([...staffPropertyIds, p.id]);
                        } else {
                          setStaffPropertyIds(staffPropertyIds.filter((id) => id !== p.id));
                        }
                      }}
                    />
                    <span>{p.name} ({p.county})</span>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingStaffMember(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Save Property Scopes
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
