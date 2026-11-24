import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Wrench,
  FolderLock,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Building,
  Home,
  CheckCircle2,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  ClipboardCheck,
  Megaphone,
  Zap,
  LifeBuoy,
  Settings,
  ChevronDown,
  Check,
  AlertCircle,
  HelpCircle,
  Search,
} from '../components/heroicons';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';

export const TenantLayout: React.FC = () => {
  const { currentUserSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showTenancyDropdown, setShowTenancyDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleNavigation = () => {
    if (isMobile) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  // Live Tenancies from Backend
  const [tenancies, setTenancies] = useState<any[]>([]);
  const [isLoadingTenancies, setIsLoadingTenancies] = useState(true);
  const [activeTenancyId, setActiveTenancyId] = useState<string>(() => {
    try {
      return localStorage.getItem('unitflow_active_tenancy_id') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingTenancies(true);
      try {
        const [leases, properties, units, notifs] = await Promise.all([
          apiClient.getLeases().catch(() => []),
          apiClient.getProperties().catch(() => []),
          apiClient.getUnits().catch(() => []),
          apiClient.getNotificationDeliveries().catch(() => []),
        ]);

        if (!isMounted) return;

        if (Array.isArray(notifs)) {
          const unread = notifs.filter((n: any) => n.status !== 'DELIVERED').length;
          setUnreadNotifications(unread);
        }

        const activeLeases = (leases || []).filter(
          (l: any) => l.status === 'ACTIVE' || l.status === 'Active Lease'
        );

        const mapped = activeLeases.map((l: any) => {
          const prop = (properties || []).find((p: any) => p.id === l.property_id);
          const unit = (units || []).find((u: any) => u.id === l.unit_id);
          return {
            id: l.id,
            leaseId: l.id,
            propertyId: l.property_id,
            unitId: l.unit_id,
            propertyName: prop?.name || 'Assigned Property',
            unitNumber: unit?.unit_number || 'Unit',
            block: unit?.block || prop?.location || '',
            location: prop?.location || prop?.city || '',
            status: l.status,
            rent: l.rent_amount || l.rent || 0,
            badgeColor: '#10b981',
          };
        });

        setTenancies(mapped);
        if (mapped.length > 0) {
          const savedId = localStorage.getItem('unitflow_active_tenancy_id');
          const found = mapped.find((m: any) => m.id === savedId) || mapped[0];
          setActiveTenancyId(found.id);
          window.dispatchEvent(new CustomEvent('unitflow_tenancy_switched', { detail: found }));
        } else {
          setActiveTenancyId('');
        }
      } catch (err) {
        // Honest empty state
      } finally {
        if (isMounted) setIsLoadingTenancies(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeTenancy = tenancies.find((t) => t.id === activeTenancyId) || (tenancies.length > 0 ? tenancies[0] : null);

  const handleSelectTenancy = (id: string) => {
    setActiveTenancyId(id);
    localStorage.setItem('unitflow_active_tenancy_id', id);
    setShowTenancyDropdown(false);
    const selected = tenancies.find((t) => t.id === id);
    if (selected) {
      window.dispatchEvent(new CustomEvent('unitflow_tenancy_switched', { detail: selected }));
    }
  };

  // Unit Flow — Complete Primary Navigation
  const primaryNavItems = [
    {
      to: '/portal/dashboard',
      aliases: ['/portal', '/portal/overview', '/portal/home'],
      label: 'Dashboard',
      sublabel: 'Tenancy at a glance',
      icon: <LayoutDashboard size={18} />,
    },
    {
      to: '/portal/properties',
      aliases: ['/portal/properties/', '/portal/apartment'],
      label: 'My Properties',
      sublabel: 'Units & amenities',
      icon: <Building size={18} />,
    },
    {
      to: '/portal/payments',
      aliases: ['/portal/financials', '/portal/rent-payments', '/portal/payments/'],
      label: 'Rent & Payments',
      sublabel: 'C2B V2 verified receipts',
      icon: <CreditCard size={18} />,
    },
    {
      to: '/portal/statements',
      aliases: ['/portal/statements/'],
      label: 'Rent Statements',
      sublabel: 'Authoritative double-entry',
      icon: <FileText size={18} />,
    },
    {
      to: '/portal/lease',
      aliases: ['/portal/lease/documents', '/portal/lease/renewals', '/portal/renewals'],
      label: 'My Lease',
      sublabel: 'Agreements & renewals',
      icon: <Home size={18} />,
    },
    {
      to: '/portal/inspections',
      aliases: ['/portal/inspections/'],
      label: 'Move-in / Move-out',
      sublabel: 'Inspection checklists',
      icon: <ClipboardCheck size={18} />,
    },
    {
      to: '/portal/maintenance',
      aliases: ['/portal/maintenance/new', '/portal/maintenance/'],
      label: 'Maintenance',
      sublabel: 'Report & track repairs',
      icon: <Wrench size={18} />,
    },
    {
      to: '/portal/documents',
      aliases: ['/portal/documents/'],
      label: 'Documents',
      sublabel: 'Private rental vault',
      icon: <FolderLock size={18} />,
    },
    {
      to: '/portal/messages',
      aliases: ['/portal/community'],
      label: 'Messages',
      sublabel: 'Contact property staff',
      icon: <MessageSquare size={18} />,
    },
    {
      to: '/portal/announcements',
      aliases: ['/portal/announcements/'],
      label: 'Announcements',
      sublabel: 'Estate notices & alerts',
      icon: <Megaphone size={18} />,
    },
    {
      to: '/portal/notifications',
      aliases: ['/portal/notification'],
      label: 'Notifications',
      sublabel: 'Reminders & updates',
      icon: <Bell size={18} />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      to: '/portal/utilities',
      aliases: ['/portal/services'],
      label: 'Utilities & Services',
      sublabel: 'Water & power meters',
      icon: <Zap size={18} />,
    },
    {
      to: '/portal/support',
      aliases: ['/portal/support/'],
      label: 'Support',
      sublabel: 'Disputes & enquiries',
      icon: <LifeBuoy size={18} />,
    },
  ];

  const accountNavItems = [
    {
      to: '/portal/profile',
      aliases: ['/portal/account'],
      label: 'My Profile',
      sublabel: 'Masked identity & contacts',
      icon: <User size={18} />,
    },
    {
      to: '/portal/settings',
      aliases: ['/portal/settings/'],
      label: 'Account Settings',
      sublabel: 'Security, MFA & notices',
      icon: <Settings size={18} />,
    },
  ];

  const isNavActive = (item: { to: string; aliases: string[] }) => {
    if (location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)) {
      return true;
    }
    return item.aliases.some(
      (a) => location.pathname === a || location.pathname.startsWith(`${a}/`)
    );
  };

  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date())
    .toUpperCase();

  const [profile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('unitflow_tenant_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const tenantName = currentUserSession?.name || profile?.tenantName || 'Tenant Resident';
  const tenantEmail = currentUserSession?.email || profile?.email || '';
  const tenantAvatar = currentUserSession?.avatar || profile?.avatar || '';
  const initials = tenantName ? tenantName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'TR';
  const firstName = tenantName.split(' ')[0] || 'Resident';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
      }}
    >
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            zIndex: 45,
          }}
          className="md:hidden"
        />
      )}

      {/* Modern High-End Sidebar (Image 1, 2, 6, 7 Resident Portal Style) */}
      <aside
        style={{
          width: isMobile ? '260px' : isSidebarCollapsed ? '76px' : '260px',
          background: '#101322', // Sleek resident portal dark navy
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'width 0.2s ease, transform 0.2s ease',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: isMobile && isMobileMenuOpen ? '0 10px 40px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Top Brand Header */}
          <div
            style={{
              height: '70px',
              padding: isSidebarCollapsed && !isMobile ? '0 14px' : '0 18px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed && !isMobile ? 'center' : 'space-between',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            <Link
              to="/portal/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                color: '#ffffff',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  flexShrink: 0,
                }}
              >
                UF
              </div>
              {(!isSidebarCollapsed || isMobile) && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Unit Flow
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#60a5fa',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Tenant Portal
                  </div>
                </div>
              )}
            </Link>

            {/* Collapse / Expand Toggle Button inside Sidebar */}
            <button
              type="button"
              onClick={handleToggleNavigation}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#cbd5e1',
                padding: 0,
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              title={isSidebarCollapsed && !isMobile ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar collapse"
            >
              {isMobile ? (
                <X size={16} />
              ) : isSidebarCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>

          {/* Current Residence Summary & Tenancy Switcher Trigger */}
          {!isSidebarCollapsed && (
            <div style={{ padding: '14px 14px 6px 14px', flexShrink: 0 }}>
              <div
                onClick={() => setShowTenancyDropdown(!showTenancyDropdown)}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <Home size={13} color="#38bdf8" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isLoadingTenancies ? 'Loading Tenancies...' : activeTenancy ? activeTenancy.propertyName : 'No Active Tenancy'}
                    </span>
                  </div>
                  {tenancies.length > 1 && <ChevronDown size={13} color="#94a3b8" />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <span>{activeTenancy ? `${activeTenancy.unitNumber} • ${activeTenancy.location}` : 'No active lease linked'}</span>
                  {activeTenancy && <span style={{ color: activeTenancy.badgeColor, fontWeight: 700 }}>● Active</span>}
                </div>
              </div>

              {/* Multi-Tenancy Switcher Dropdown */}
              {showTenancyDropdown && (
                <div
                  style={{
                    marginTop: '6px',
                    background: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '10px',
                    padding: '6px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Switch Active Tenancy
                  </div>
                  {tenancies.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTenancy(t.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: t.id === activeTenancyId ? '#2563eb' : 'transparent',
                        color: t.id === activeTenancyId ? '#ffffff' : '#cbd5e1',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{t.propertyName}</div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>{t.unitNumber} &bull; {t.location}</div>
                      </div>
                      {t.id === activeTenancyId && <Check size={14} color="#ffffff" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Scrollable Navigation List */}
          <nav
            style={{
              padding: '8px 12px 16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {/* Group 1: MY ACCOUNT */}
            {!isSidebarCollapsed && (
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 8px 4px 8px' }}>
                My Account
              </div>
            )}
            {primaryNavItems.map((item) => {
              const active = isNavActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: isSidebarCollapsed ? '9px' : '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#f97316' : '#94a3b8',
                    background: active ? 'rgba(249, 115, 22, 0.12)' : 'transparent',
                    textDecoration: 'none',
                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  title={isSidebarCollapsed ? `${item.label} — ${item.sublabel}` : undefined}
                >
                  <span style={{ color: active ? '#f97316' : '#94a3b8', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, lineHeight: 1.15 }}>
                      <span style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    </div>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <span
                      style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                        padding: '1px 6px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Group 2: ACCOUNT */}
            {!isSidebarCollapsed && (
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 8px 4px 8px' }}>
                Account
              </div>
            )}
            {accountNavItems.map((item) => {
              const active = isNavActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: isSidebarCollapsed ? '9px' : '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#f97316' : '#94a3b8',
                    background: active ? 'rgba(249, 115, 22, 0.12)' : 'transparent',
                    textDecoration: 'none',
                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                    transition: 'all 0.15s ease',
                  }}
                  title={isSidebarCollapsed ? `${item.label} — ${item.sublabel}` : undefined}
                >
                  <span style={{ color: active ? '#f97316' : '#94a3b8', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, lineHeight: 1.15 }}>
                      <span style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Switcher / Sign Out */}
          <div style={{ padding: '12px', borderTop: '1px solid #1e293b', flexShrink: 0 }}>
            {!isSidebarCollapsed && (
              <Link
                to="/app/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: '8px',
                }}
              >
                <span>Staff Management Console</span>
                <ExternalLink size={12} color="#94a3b8" />
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isSidebarCollapsed ? '8px' : '6px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#94a3b8',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              }}
            >
              <LogOut size={15} />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Full-Page Content Pane */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? '0px' : isSidebarCollapsed ? '76px' : '260px',
          width: isMobile ? '100%' : `calc(100% - ${isSidebarCollapsed ? '76px' : '260px'})`,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease, width 0.2s ease',
        }}
        className="tenant-fullpage-main"
      >
        {/* Full-Width Top Header Bar */}
        <header
          style={{
            height: '70px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '0 16px' : '0 32px',
          }}
        >
          {/* Left: Functional Toggle + Date & Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={handleToggleNavigation}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              title={isMobile ? (isMobileMenuOpen ? 'Close drawer' : 'Open menu') : (isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
              aria-label="Toggle navigation menu"
            >
              {isMobile && isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#64748b',
                  letterSpacing: '0.06em',
                }}
              >
                {todayFormatted}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Good morning, {firstName}
              </div>
            </div>
          </div>

          {/* Center Search Bar (Image 7 / 1 Style) */}
          <div style={{ position: 'relative', width: '320px' }} className="hidden md:block">
            <Search
              size={15}
              style={{
                position: 'absolute',
                top: '50%',
                left: '14px',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Search for payments, documents, tickets..."
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none',
                color: '#0f172a',
                transition: 'all 0.15s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          {/* Right: Tenancy Switcher Dropdown, Notifications Bell, Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Top Bar Property/Tenancy Selector */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  if (tenancies.length > 1) setShowTenancyDropdown(!showTenancyDropdown);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: tenancies.length > 1 ? 'pointer' : 'default',
                }}
              >
                <Home size={13} color="#2563eb" />
                <span>
                  {isLoadingTenancies
                    ? 'Loading Tenancies...'
                    : activeTenancy
                    ? `${activeTenancy.propertyName} • ${activeTenancy.unitNumber}`
                    : 'No Active Tenancy Linked'}
                </span>
                {tenancies.length > 1 && <ChevronDown size={13} color="#64748b" />}
              </button>

              {showTenancyDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    minWidth: '260px',
                    zIndex: 60,
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Select Active Tenancy
                  </div>
                  {tenancies.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTenancy(t.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: t.id === activeTenancyId ? '#eff6ff' : '#ffffff',
                        border: t.id === activeTenancyId ? '1px solid #bfdbfe' : '1px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{t.propertyName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.unitNumber} &bull; {t.location}</div>
                      </div>
                      {t.id === activeTenancyId && <Check size={14} color="#2563eb" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Tenancy Pill - Only display when verified active tenancy exists! */}
            {activeTenancy ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
                className="hidden lg:flex"
              >
                <CheckCircle2 size={13} color="#059669" />
                <span>Active Lease &bull; Rent Current</span>
              </div>
            ) : null}

            {/* Notification Bell */}
            <Link
              to="/portal/notifications"
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                textDecoration: 'none',
              }}
              title="Notifications"
            >
              <Bell size={17} />
              {unreadNotifications > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '9px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#ef4444',
                  }}
                />
              )}
            </Link>

            {/* Profile Avatar Pill matching PropEasy Image */}
            <Link
              to="/portal/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {tenantAvatar ? (
                <img
                  src={tenantAvatar}
                  alt={tenantName}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #e2e8f0',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {initials}
                </div>
              )}
              <div className="hidden sm:block" style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                  {tenantName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{tenantEmail}</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Full-Page Main Content View */}
        <main
          style={{
            flex: 1,
            padding: '32px',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
