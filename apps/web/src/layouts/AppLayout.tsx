import React, { useState, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  CreditCardIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ChartBarSquareIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowUpTrayIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  DevicePhoneMobileIcon,
  CheckIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { SystemRole } from '../types';
import { ImportWizard } from '../components/ImportWizard';
import { BulkEditableGrid } from '../components/BulkEditableGrid';
import { DocumentScanner } from '../components/DocumentScanner';
import { ModalDialog } from '../components/ui/Primitives';
import { exportRowsToCsv } from '../lib/importEngine';

export interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ReactNode;
  requiredPermission?: string;
  badge?: string;
}

export const APP_NAV_ITEMS: NavItemConfig[] = [
  { to: '/app/dashboard', label: 'Dashboard', icon: <HomeIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/leases-bookings', label: 'Leases & Bookings', icon: <CalendarDaysIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/properties-units', label: 'Properties & Units', icon: <BuildingOffice2Icon style={{ width: 16, height: 16 }} /> },
  { to: '/app/tenants', label: 'Tenants', icon: <UserGroupIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/payments-mpesa', label: 'Payments & M-Pesa', icon: <CreditCardIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/estates-deposits', label: 'Estates & Deposits', icon: <MapPinIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/maintenance', label: 'Maintenance', icon: <WrenchScrewdriverIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/ocr-documents', label: 'OCR & Documents', icon: <DocumentMagnifyingGlassIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/assistant', label: 'AI Assistant', icon: <SparklesIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/analytics-ledger', label: 'Analytics & Ledger', icon: <ChartBarSquareIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/automated-emails', label: 'Automated Emails', icon: <EnvelopeIcon style={{ width: 16, height: 16 }} /> },
  { to: '/app/settings-portal', label: 'Settings & Portal', icon: <Cog6ToothIcon style={{ width: 16, height: 16 }} /> },
];

const ROLES_LIST: SystemRole[] = [
  'SAAS_SUPER_ADMINISTRATOR',
  'ORGANIZATION_ADMINISTRATOR',
  'PROPERTY_OWNER',
  'PROPERTY_MANAGER',
  'ACCOUNTANT',
  'RECEPTIONIST',
  'MAINTENANCE_OFFICER',
  'TENANT',
  'VENDOR',
];

export const AppLayout: React.FC = () => {
  const { currentOrg, currentUserSession, currentUserRole, logout, switchOrganization, switchRole, organizations, hasPermission } = useAuth();
  const {
    state,
    setState,
    toastMessage,
    importWizardModule,
    setImportWizardModule,
    bulkGridModule,
    setBulkGridModule,
    isScannerOpen,
    setIsScannerOpen,
    isSwitcherModalOpen,
    setIsSwitcherModalOpen,
    isMpesaModalOpen,
    setIsMpesaModalOpen,
  } = useRms();

  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const isSuperAdmin = currentUserRole === 'SAAS_SUPER_ADMINISTRATOR';

  const formatRoleLabel = (role?: string) => {
    switch (role) {
      case 'SAAS_SUPER_ADMINISTRATOR':
        return 'Super Admin';
      case 'ORGANIZATION_ADMINISTRATOR':
        return 'Admin';
      case 'PROPERTY_MANAGER':
        return 'Property Manager';
      case 'ACCOUNTANT':
        return 'Accountant';
      case 'RECEPTIONIST':
        return 'Receptionist';
      case 'MAINTENANCE_OFFICER':
        return 'Maintenance';
      case 'CARETAKER':
        return 'Caretaker';
      case 'TENANT':
        return 'Tenant';
      case 'VENDOR':
        return 'Vendor';
      case 'PROPERTY_OWNER':
        return 'Owner';
      default:
        return 'Staff';
    }
  };

  const profileDisplayName = isSuperAdmin
    ? 'Super Admin'
    : (currentUserSession?.fullName || currentOrg.name.replace(/\s*(Rental|Property)?\s*Management\s*(Ltd|LLC)?/gi, '').trim() || currentOrg.name);

  const profileSubtitle = isSuperAdmin
    ? (currentOrg.name.length > 18 ? 'Guri24 RMS' : currentOrg.name)
    : formatRoleLabel(currentUserRole);

  const profileAvatarInitials = isSuperAdmin
    ? 'SA'
    : (profileDisplayName.slice(0, 2).toUpperCase());

  // Determine active item based on URL
  const activeNavItem = useMemo(() => {
    return (
      APP_NAV_ITEMS.find((item) => {
        if (item.to === '/app/dashboard') {
          return location.pathname === '/app/dashboard' || location.pathname === '/app';
        }
        return location.pathname.startsWith(item.to);
      }) || APP_NAV_ITEMS[0]
    );
  }, [location.pathname]);

  // Dynamic breadcrumb segments
  const breadcrumbs = useMemo(() => {
    const cleanPath = location.pathname.replace(/^\/app\/?/, '');
    if (!cleanPath || cleanPath === 'dashboard') {
      return [{ label: 'Dashboard', to: '/app/dashboard' }];
    }
    const parts = cleanPath.split('/').filter(Boolean);
    const crumbs = [{ label: 'App', to: '/app/dashboard' }];
    let accumulated = '/app';
    parts.forEach((p) => {
      accumulated += `/${p}`;
      const matchingNav = APP_NAV_ITEMS.find((item) => item.to === accumulated);
      const title = matchingNav
        ? matchingNav.label
        : p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');
      crumbs.push({ label: title, to: accumulated });
    });
    return crumbs;
  }, [location.pathname]);

  // Filtered nav items based on search and permissions
  const filteredNavItems = useMemo(() => {
    return APP_NAV_ITEMS.filter((item) => {
      // Role-based navigation visibility
      if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
        return false;
      }
      if (!navSearchQuery.trim()) return true;
      return item.label.toLowerCase().includes(navSearchQuery.toLowerCase());
    });
  }, [navSearchQuery, hasPermission]);

  return (
    <div className="app-shell">
      {/* Toast announcement */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <SparklesIcon style={{ width: 16, height: 16, color: '#38bdf8' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. DESKTOP SIDEBAR NAVIGATION                                 */}
      {/* ------------------------------------------------------------- */}
      <aside className="sidebar" aria-label="Primary Navigation">
        {/* Brand Header */}
        <div className="brand-header">
          <Link to="/app/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/Guri24 RMS Property Logo.png"
              alt="Guri24 RMS"
              style={{ maxHeight: '42px', maxWidth: '170px', objectFit: 'contain' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
            />
          </Link>
        </div>

        {/* Sidebar Search Bar */}
        <div className="sidebar-search">
          <MagnifyingGlassIcon style={{ width: 14, height: 14 }} className="sidebar-search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search modules..."
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
            className="sidebar-search-input"
            aria-label="Search modules"
          />
        </div>

        {/* Navigation List */}
        <div className="menu-section-label">Operations & Finance</div>
        <nav className="nav-list" aria-label="Primary navigation links">
          {filteredNavItems.map((item) => {
            const isActive =
              item.to === '/app/dashboard'
                ? location.pathname === '/app/dashboard' || location.pathname === '/app'
                : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className="nav-btn"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  background: isActive ? '#eceef2' : 'transparent',
                  color: isActive ? '#111827' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                }}
              >
                <div className="nav-btn-left">
                  <span style={{ color: isActive ? '#2563eb' : 'inherit' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="badge-pill badge-neutral" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Platform Super Administrator Portal Link */}
        {currentUserRole === 'SAAS_SUPER_ADMINISTRATOR' && (
          <div style={{ padding: '0 12px 10px 12px' }}>
            <Link
              to="/platform/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#090d16',
                color: '#38bdf8',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheckIcon style={{ width: 14, height: 14, color: '#38bdf8' }} />
                <span>Platform Controls</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>&rarr;</span>
            </Link>
          </div>
        )}

        {/* Organization & Profile Switcher Card */}
        <div
          className="sidebar-profile-card"
          onClick={() => setIsSwitcherModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsSwitcherModalOpen(true);
            }
          }}
          aria-label="Switch organization or profile"
          title="Click to switch organization or role"
        >
          <div
            className="profile-avatar"
            style={{
              inlineSize: '32px',
              blockSize: '32px',
              fontSize: '0.74rem',
              fontWeight: 700,
              background: isSuperAdmin
                ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              boxShadow: '0 1px 3px rgba(37,99,235,0.25)',
              flexShrink: 0,
            }}
          >
            {profileAvatarInitials}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={profileDisplayName}
            >
              {profileDisplayName}
            </div>
            <div
              style={{
                fontSize: '0.70rem',
                color: '#64748b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '1px',
              }}
            >
              {profileSubtitle}
            </div>
          </div>
          <ChevronDownIcon style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0 }} />
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE CONTENT OUTLET                              */}
      {/* ------------------------------------------------------------- */}
      <main className="workspace">
        {/* Mobile Header Bar */}
        <header className="mobile-header">
          <button
            type="button"
            className="mobile-header-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Bars3Icon style={{ width: 22, height: 22 }} />
          </button>

          <Link to="/app/dashboard" className="mobile-header-brand">
            <img
              src="/Guri24 RMS Property Logo.png"
              alt="Guri24 RMS"
              style={{ maxHeight: '34px', maxWidth: '140px', objectFit: 'contain' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
            />
          </Link>

          <button
            type="button"
            className="mobile-avatar-pill"
            onClick={() => setIsSwitcherModalOpen(true)}
            title="Switch Organization / Role"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '3px 8px 3px 3px',
              cursor: 'pointer',
            }}
          >
            <div
              className="profile-avatar"
              style={{
                inlineSize: '26px',
                blockSize: '26px',
                fontSize: '0.68rem',
                fontWeight: 700,
                background: isSuperAdmin ? '#1e3a8a' : '#2563eb',
              }}
            >
              {profileAvatarInitials}
            </div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#0f172a',
                maxWidth: '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {profileDisplayName}
            </span>
            <ChevronDownIcon style={{ width: 13, height: 13, color: 'var(--text-muted)' }} />
          </button>
        </header>

        {/* Top Page Header Bar & Breadcrumbs */}
        <header className="topbar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Breadcrumb line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.to}>
                  {idx > 0 && <ChevronRightIcon style={{ width: 12, height: 12, color: '#94a3b8' }} />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{crumb.label}</span>
                  ) : (
                    <Link to={crumb.to} style={{ color: '#64748b', textDecoration: 'none' }}>
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 id="main-heading" style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {activeNavItem.label}
              </h1>
              <span className="badge-pill badge-neutral">
                {currentOrg.county} &bull; {currentOrg.currency}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="topbar-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => setImportWizardModule('units')}
              title="Bulk Import Wizard (CSV/Excel across all modules)"
            >
              <ArrowUpTrayIcon style={{ width: 14, height: 14 }} />
              <span>Bulk Import</span>
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setBulkGridModule('units')}
              title="Spreadsheet Bulk Entry & Paste from Excel"
            >
              <PencilSquareIcon style={{ width: 14, height: 14 }} />
              <span>Excel Entry</span>
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                exportRowsToCsv(
                  state.units.map((u) => ({
                    unit_number: u.unit_number,
                    property_id: u.property_id,
                    type: u.unit_type,
                    rent_kes: u.rent_amount_kes,
                    status: u.status,
                  })),
                  `units_export_${Date.now()}.csv`
                );
              }}
              title="Export records to CSV"
            >
              <ArrowDownTrayIcon style={{ width: 14, height: 14 }} />
              <span>Export</span>
            </button>
            <button
              type="button"
              className="btn-dark"
              onClick={() => setIsMpesaModalOpen(true)}
              title="Initiate Kenyan M-Pesa STK Push Prompt"
            >
              <DevicePhoneMobileIcon style={{ width: 14, height: 14 }} />
              <span>M-Pesa Pay</span>
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={logout}
              title="Sign Out of Guri24 RMS"
              style={{ color: '#dc2626' }}
            >
              <ArrowRightOnRectangleIcon style={{ width: 14, height: 14 }} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Outlet */}
        <Outlet />
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. MOBILE SLIDE-OVER DRAWER                                   */}
      {/* ------------------------------------------------------------- */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src="/Guri24 RMS Property Logo.png"
                  alt="Guri24 RMS"
                  style={{ maxHeight: '30px', maxWidth: '120px', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <button
                type="button"
                className="btn-icon-only"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <XMarkIcon style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <nav className="mobile-drawer-nav" aria-label="Mobile Navigation Drawer">
              <div style={{ padding: '10px 14px' }}>
                <div className="menu-section-label" style={{ marginBottom: '8px' }}>
                  All System Modules (12)
                </div>
                {APP_NAV_ITEMS.map((item) => {
                  const isActive =
                    item.to === '/app/dashboard'
                      ? location.pathname === '/app/dashboard' || location.pathname === '/app'
                      : location.pathname.startsWith(item.to);

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        marginBottom: '4px',
                        background: isActive ? '#eff6ff' : 'transparent',
                        color: isActive ? '#2563eb' : '#334155',
                        fontWeight: isActive ? 600 : 500,
                        textDecoration: 'none',
                        fontSize: '0.86rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="badge-pill badge-neutral" style={{ fontSize: '0.65rem' }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Sign out in drawer footer */}
              <div style={{ padding: '16px 14px', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowRightOnRectangleIcon style={{ width: 16, height: 16 }} />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. MOBILE FIXED BOTTOM NAVIGATION BAR                         */}
      {/* ------------------------------------------------------------- */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Quick Navigation">
        <Link
          to="/app/dashboard"
          className={`bottom-nav-item ${
            location.pathname === '/app/dashboard' || location.pathname === '/app' ? 'active' : ''
          }`}
          aria-label="Dashboard"
        >
          <HomeIcon style={{ width: 20, height: 20 }} />
          <span>Home</span>
          {(location.pathname === '/app/dashboard' || location.pathname === '/app') && (
            <span className="bottom-nav-indicator" />
          )}
        </Link>

        <Link
          to="/app/properties-units"
          className={`bottom-nav-item ${location.pathname.startsWith('/app/properties-units') ? 'active' : ''}`}
          aria-label="Properties & Units"
        >
          <BuildingOffice2Icon style={{ width: 20, height: 20 }} />
          <span>Units</span>
          {location.pathname.startsWith('/app/properties-units') && <span className="bottom-nav-indicator" />}
        </Link>

        <Link
          to="/app/payments-mpesa"
          className={`bottom-nav-item ${location.pathname.startsWith('/app/payments-mpesa') ? 'active' : ''}`}
          aria-label="Payments & M-Pesa"
        >
          <CreditCardIcon style={{ width: 20, height: 20 }} />
          <span>Payments</span>
          {location.pathname.startsWith('/app/payments-mpesa') && <span className="bottom-nav-indicator" />}
        </Link>

        <Link
          to="/app/assistant"
          className={`bottom-nav-item ${location.pathname.startsWith('/app/assistant') ? 'active' : ''}`}
          aria-label="AI Assistant"
        >
          <SparklesIcon style={{ width: 20, height: 20 }} />
          <span>AI Help</span>
          {location.pathname.startsWith('/app/assistant') && <span className="bottom-nav-indicator" />}
        </Link>

        <button
          type="button"
          className={`bottom-nav-item ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="All Modules Menu"
        >
          <Bars3Icon style={{ width: 20, height: 20 }} />
          <span>Menu</span>
        </button>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 5. GLOBAL MODALS & UTILITIES                                  */}
      {/* ------------------------------------------------------------- */}
      {/* Bulk Import Wizard Modal */}
      {importWizardModule && (
        <ImportWizard
          initialModule={importWizardModule}
          currentOrg={currentOrg}
          onClose={() => setImportWizardModule(null)}
          onImportComplete={(importedRows, modKey) => {
            setImportWizardModule(null);
          }}
        />
      )}

      {/* Bulk Editable Grid Modal */}
      {bulkGridModule && (
        <BulkEditableGrid
          initialModule={bulkGridModule}
          currentOrg={currentOrg}
          onClose={() => setBulkGridModule(null)}
          onSave={(rows, modKey) => {
            setBulkGridModule(null);
          }}
        />
      )}

      {/* Document Scanner Camera/File Modal */}
      {isScannerOpen && (
        <DocumentScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanComplete={async (file, category) => {
            setIsScannerOpen(false);
          }}
        />
      )}

      {/* Organization & Role Switcher Modal */}
      {/* Organization Switcher Modal */}
      {isSwitcherModalOpen && (
        <ModalDialog
          isOpen={isSwitcherModalOpen}
          onClose={() => setIsSwitcherModalOpen(false)}
          title="Portfolio Organization Context"
          maxWidth="540px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
              Select your active residential portfolio organization context. Data boundaries and RBAC permissions are authoritatively enforced server-side.
            </p>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Active Portfolio Organization
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {organizations.map((org) => {
                  const isSelected = org.id === currentOrg.id;
                  return (
                    <div
                      key={org.id}
                      onClick={() => {
                        switchOrganization(org.id);
                        setIsSwitcherModalOpen(false);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{org.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                          Jurisdiction: {org.county} &bull; Currency: {org.currency}
                        </div>
                      </div>
                      {isSelected && <CheckIcon style={{ width: 18, height: 18, color: '#2563eb' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Current Role: <strong style={{ color: '#0f172a' }}>{currentUserRole || 'Administrator'}</strong>
              </div>
              <Link
                to="/app/settings-portal/users"
                onClick={() => setIsSwitcherModalOpen(false)}
                style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
              >
                Manage Team & Roles &rarr;
              </Link>
            </div>
          </div>
        </ModalDialog>
      )}
    </div>
  );
};
