import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ArrowRight,
  Plus,
  CreditCard,
  CheckCircle2,
  Bell,
  MessageSquare,
  Calendar,
  Home,
  FileText,
  Wrench,
  Download,
  Upload,
} from 'lucide-react';

interface TenantPortalPageProps {
  view?:
    | 'home'
    | 'payments'
    | 'notifications'
    | 'community'
    | 'apartment'
    | 'services'
    | 'account';
}

export const TenantPortalPage: React.FC<TenantPortalPageProps> = ({ view }) => {
  const location = useLocation();

  // Determine current active subview based on prop or URL path
  const currentView = React.useMemo(() => {
    if (view) return view;
    if (location.pathname.includes('/payments') || location.pathname.includes('/financials')) {
      return 'payments';
    }
    if (location.pathname.includes('/notification')) {
      return 'notifications';
    }
    if (location.pathname.includes('/community') || location.pathname.includes('/messages')) {
      return 'community';
    }
    if (location.pathname.includes('/apartment') || location.pathname.includes('/lease')) {
      return 'apartment';
    }
    if (location.pathname.includes('/services') || location.pathname.includes('/maintenance')) {
      return 'services';
    }
    if (location.pathname.includes('/account') || location.pathname.includes('/profile')) {
      return 'account';
    }
    return 'payments'; // Default to the prominent payments view from the user image
  }, [view, location.pathname]);

  // Notifications Filter Tab State
  const [notificationTab, setNotificationTab] = useState<'All' | 'Messages' | 'Alert' | 'Announcements' | 'Classifieds'>('All');
  const [notificationSearch, setNotificationSearch] = useState('');

  // Payment Modal State
  const [showMakePaymentModal, setShowMakePaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('2,345.76');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Ledger Transactions matching the table in the reference image
  const ledgerTransactions = [
    {
      date: 'May 2, 2022',
      type: 'Pest Control',
      badgeBg: '#e0f7fa',
      badgeColor: '#00838f',
      source: 'Property',
      amount: '$782.01',
      balance: '$782.01',
    },
    {
      date: 'May 2, 2022',
      type: 'Water',
      badgeBg: '#e1f5fe',
      badgeColor: '#0277bd',
      source: 'Property',
      amount: '$1,586.63',
      balance: '$1,586.63',
    },
    {
      date: 'May 2, 2022',
      type: 'Recurring Concession',
      badgeBg: '#ede7f6',
      badgeColor: '#5e35b1',
      source: 'Property',
      amount: '$1,877.42',
      balance: '$1,877.42',
    },
    {
      date: 'May 2, 2022',
      type: 'Pest Control',
      badgeBg: '#e0f7fa',
      badgeColor: '#00838f',
      source: 'Property',
      amount: '$782.01',
      balance: '$782.01',
    },
    {
      date: 'April 1, 2022',
      type: 'Trash Removal',
      badgeBg: '#fbe9e7',
      badgeColor: '#d84315',
      source: 'Property',
      amount: '$1,451.78',
      balance: '$1,451.78',
    },
    {
      date: 'April 1, 2022',
      type: 'Recurring Concession',
      badgeBg: '#ede7f6',
      badgeColor: '#5e35b1',
      source: 'Property',
      amount: '$782.01',
      balance: '$782.01',
    },
    {
      date: 'April 1, 2022',
      type: 'Pest Control',
      badgeBg: '#e0f7fa',
      badgeColor: '#00838f',
      source: 'Property',
      amount: '$473.85',
      balance: '$473.85',
    },
    {
      date: 'April 1, 2022',
      type: 'Trash Removal',
      badgeBg: '#fbe9e7',
      badgeColor: '#d84315',
      source: 'Property',
      amount: '$2,100.26',
      balance: '$2,100.26',
    },
  ];

  // Auto-Payment items from reference image
  const autoPaymentItems = [
    { title: 'Charge - Trash Removal', date: 'May 2, 2022', amount: '$ 2,827.51' },
    { title: 'Charge - Trash Removal', date: 'May 2, 2022', amount: '$ 2,827.51' },
    { title: 'Charge - Trash Removal', date: 'May 2, 2022', amount: '$ 2,827.51' },
    { title: 'Charge - Trash Removal', date: 'May 2, 2022', amount: '$ 2,827.51' },
  ];

  // Notifications list matching Screen 2 in reference image
  const notificationItems = [
    {
      id: 1,
      title: 'Grab and Go Breakfast',
      badge: 'Announcements',
      badgeBg: '#e0f7fa',
      badgeColor: '#00838f',
      date: 'May 2, 2022 · 11 AM',
      body: 'We will be serving chick-fil-a breakfast sandwiches, yogurt parfaits, fruits and refreshments! 11 AM',
      hasViewAll: true,
      category: 'Announcements',
    },
    {
      id: 2,
      title: 'Millenium Santa Monica',
      badge: 'Messages',
      badgeBg: '#fbe9e7',
      badgeColor: '#d84315',
      date: 'May 2, 2022 · 11 AM',
      body: 'Fire Alarm 412002',
      hasViewAll: false,
      category: 'Messages',
    },
    {
      id: 3,
      title: 'Millenium Santa Monica',
      badge: 'Messages',
      badgeBg: '#fbe9e7',
      badgeColor: '#d84315',
      date: 'May 2, 2022 · 11 AM',
      body: 'Water Pressure for 4/B Building',
      hasViewAll: false,
      category: 'Messages',
    },
    {
      id: 4,
      title: 'Birthday party',
      badge: 'Announcements',
      badgeBg: '#e0f7fa',
      badgeColor: '#00838f',
      date: 'May 2, 2022 · 11 AM',
      body: "We're going to drink some Margaritas! 🍹",
      hasViewAll: true,
      category: 'Announcements',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=160&q=80',
    },
  ];

  const filteredNotifications = notificationItems.filter((item) => {
    if (notificationTab !== 'All' && item.category !== notificationTab) return false;
    if (notificationSearch.trim()) {
      const q = notificationSearch.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '28px',
            right: '28px',
            background: '#131726',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#f27a54" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW: PAYMENTS (FOREGROUND SCREEN IN USER IMAGE)
      ========================================================================== */}
      {(currentView === 'payments' || currentView === 'home') && (
        <>
          {/* Header Title */}
          <div>
            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Payments
            </h1>
          </div>

          {/* Top Section: Card + Credit Balance + Auto-Payment (Exact 3-column row from screenshot) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 310px) minmax(200px, 240px) 1fr',
              gap: '32px',
              alignItems: 'start',
            }}
            className="payments-top-grid"
          >
            {/* 1. Bank of America / Dark Stylized Card */}
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #1c2237 0%, #101422 100%)',
                  borderRadius: '16px',
                  padding: '20px 22px',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px rgba(19, 23, 38, 0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Subtle wavy contour lines from screenshot */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    opacity: 0.15,
                    pointerEvents: 'none',
                  }}
                  viewBox="0 0 200 120"
                >
                  <path d="M0,60 Q50,20 100,60 T200,60" fill="none" stroke="#ffffff" strokeWidth="1" />
                  <path d="M0,75 Q50,35 100,75 T200,75" fill="none" stroke="#ffffff" strokeWidth="1" />
                  <path d="M0,90 Q50,50 100,90 T200,90" fill="none" stroke="#ffffff" strokeWidth="1" />
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Bank of America
                  </span>
                  <div
                    style={{
                      width: '26px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '1.5px solid rgba(255,255,255,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ width: '8px', height: '6px', background: 'rgba(255,255,255,0.6)', borderRadius: '1px' }} />
                  </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1, margin: '14px 0 6px 0' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                    Daria Boichuk
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', letterSpacing: '0.12em', marginTop: '2px' }}>
                    •••• 1234 &nbsp;&nbsp; 09/27
                  </div>
                </div>
              </div>

              {/* Add New Card link & carousel pagination dots */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  padding: '0 4px',
                }}
              >
                <button
                  onClick={() => showToast('Opening payment method setup...')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.8rem',
                    color: '#64748b',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <Plus size={13} />
                  <span>Add New Card</span>
                </button>

                {/* Pagination indicator: o - - */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f27a54' }} />
                  <span style={{ width: '12px', height: '2px', background: '#cbd5e1', borderRadius: '1px' }} />
                  <span style={{ width: '12px', height: '2px', background: '#cbd5e1', borderRadius: '1px' }} />
                </div>
              </div>
            </div>

            {/* 2. Credit Balance */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#8c95a6', fontWeight: 500, marginBottom: '6px' }}>
                Credit Balance
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                }}
              >
                $ 2,345.76
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={() => setShowMakePaymentModal(true)}
                  style={{
                    background: '#f27a54', // Exact coral color from reference image
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 20px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(242, 122, 84, 0.3)',
                  }}
                >
                  Make Payment
                </button>
                <button
                  onClick={() => showToast('Viewing credit balance breakdown...')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8c95a6',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Details
                </button>
              </div>
            </div>

            {/* 3. Auto - Payment List */}
            <div
              style={{
                borderLeft: '1px solid #f1f5f9',
                paddingLeft: '32px',
              }}
              className="auto-payment-column"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                  Auto - Payment
                </span>
                <span style={{ fontSize: '0.78rem', color: '#8c95a6', cursor: 'pointer' }}>
                  June ▾
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {autoPaymentItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#8c95a6', fontSize: '0.78rem' }}>&rarr;</span>
                      <div>
                        <div style={{ color: '#334155', fontWeight: 500 }}>{item.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.date}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Ledger transactions */}
          <div style={{ marginTop: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                Ledger transactions
              </h3>
              <button
                onClick={() => showToast('Opening complete chronological ledger...')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.78rem',
                  color: '#8c95a6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Full Ledger</span>
                <span>&rsaquo;</span>
              </button>
            </div>

            {/* Table matching the reference layout & colorful badges */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#8c95a6', borderBottom: '1px solid #f1f5f9' }}>
                    <th style={{ padding: '8px 12px 12px 4px', fontWeight: 500 }}>Date</th>
                    <th style={{ padding: '8px 12px 12px 12px', fontWeight: 500 }}>Type</th>
                    <th style={{ padding: '8px 12px 12px 12px', fontWeight: 500 }}>Source</th>
                    <th style={{ padding: '8px 12px 12px 12px', fontWeight: 500 }}>Charges / Payments</th>
                    <th style={{ padding: '8px 4px 12px 12px', fontWeight: 500, textAlign: 'right' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerTransactions.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 12px 12px 4px', color: '#334155' }}>{row.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: row.badgeBg,
                            color: row.badgeColor,
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            display: 'inline-block',
                          }}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{row.source}</td>
                      <td style={{ padding: '12px', color: '#0f172a', fontWeight: 500 }}>{row.amount}</td>
                      <td style={{ padding: '12px 4px 12px 12px', color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>
                        {row.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW: NOTIFICATIONS (BACKGROUND SCREEN IN USER IMAGE)
      ========================================================================== */}
      {currentView === 'notifications' && (
        <>
          {/* Header & Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Notification
            </h1>

            {/* Search Input from reference image */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 14px',
                width: '240px',
              }}
            >
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search"
                value={notificationSearch}
                onChange={(e) => setNotificationSearch(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.82rem',
                  color: '#0f172a',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Filter Tabs: All, Messages, Alert, Announcements, Classifieds */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '12px',
              fontSize: '0.86rem',
            }}
          >
            {(['All', 'Messages', 'Alert', 'Announcements', 'Classifieds'] as const).map((tab) => {
              const active = notificationTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setNotificationTab(tab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0 0 12px 0',
                    marginBottom: '-13px',
                    fontSize: '0.86rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#f27a54' : '#8c95a6', // Coral active text
                    borderBottom: active ? '2px solid #f27a54' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Notifications List matching reference image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                    {n.title}
                  </h3>
                  <span
                    style={{
                      background: n.badgeBg,
                      color: n.badgeColor,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: '12px',
                    }}
                  >
                    {n.badge}
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{n.date}</div>

                {n.image && (
                  <div style={{ margin: '6px 0' }}>
                    <img
                      src={n.image}
                      alt="Party thumbnail"
                      style={{ width: '84px', height: '54px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, maxWidth: '680px' }}>
                  {n.body}
                </p>

                {n.hasViewAll && (
                  <button
                    onClick={() => showToast(`Opening ${n.title} details...`)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'transparent',
                      border: 'none',
                      color: '#f27a54',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 0 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>View All</span>
                    <span>↗</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW: MY APARTMENT
      ========================================================================== */}
      {currentView === 'apartment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            My Apartment & Lease
          </h1>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '16px',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.76rem', color: '#8c95a6' }}>Property</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                Millenium Santa Monica
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Unit 4/B &bull; Building 4</div>
            </div>

            <div>
              <div style={{ fontSize: '0.76rem', color: '#8c95a6' }}>Lease Duration</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                12 Months Fixed
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Expires Dec 31, 2026</div>
            </div>

            <div>
              <div style={{ fontSize: '0.76rem', color: '#8c95a6' }}>Base Rent</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f27a54', marginTop: '4px' }}>
                $ 2,345.76 / month
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Due 1st of every month</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW: COMMUNITY & MESSAGES
      ========================================================================== */}
      {currentView === 'community' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Community & Messages
          </h1>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem' }}>
              Connect with building management, view community announcements, and chat with neighbors.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW: RESIDENT PORTAL / SERVICES
      ========================================================================== */}
      {currentView === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Resident Portal Services
          </h1>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem' }}>
              Request unit maintenance, schedule move-in inspections, and download counter-signed documents.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW: ACCOUNT
      ========================================================================== */}
      {currentView === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Account Settings
          </h1>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Daria Boichuk</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>daria.boichuk@example.com</div>
          </div>
        </div>
      )}

      {/* Make Payment Modal */}
      {showMakePaymentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 23, 38, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Make Payment
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#64748b' }}>
              Confirm your payment of <strong>${paymentAmount}</strong> using Bank of America ending in 1234.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowMakePaymentModal(false)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMakePaymentModal(false);
                  showToast('Payment of $2,345.76 processed successfully!');
                }}
                style={{
                  background: '#f27a54',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .payments-top-grid {
            grid-template-columns: 1fr !important;
          }
          .auto-payment-column {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
          }
        }
      `}</style>
    </div>
  );
};
