-- =============================================================================
-- Migration 0014: Authoritative Notification Permissions for RBAC
-- Ensures OrganizationAdministrator, PropertyManager, and Accountant
-- have authoritative database-seeded notification permissions scoped per tenant.
-- =============================================================================

INSERT INTO permissions (code, module, description) VALUES
    ('notifications.view', 'notifications', 'View organization email delivery logs, schedules and notification history'),
    ('notifications.manage', 'notifications', 'Manage notification templates, retry failed deliveries, and dispatch test notifications'),
    ('notifications.settings', 'notifications', 'Configure organization-wide automated reminder schedules and Resend delivery policies')
ON CONFLICT (code) DO NOTHING;
