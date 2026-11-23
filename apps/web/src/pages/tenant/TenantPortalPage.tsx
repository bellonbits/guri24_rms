import React, { useState } from 'react';
import {
  FileText,
  MessageSquare,
  ArrowRight,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  CreditCard,
  Plus,
} from 'lucide-react';

interface TenantPortalPageProps {
  view?:
    | 'dashboard'
    | 'tenants'
    | 'properties'
    | 'financials'
    | 'maintenance'
    | 'documents'
    | 'settings';
}

export const TenantPortalPage: React.FC<TenantPortalPageProps> = ({ view = 'tenants' }) => {
  // Toggle between Screenshot 2 (Active Tenancy Overview) and Screenshot 1 (Application Details)
  const [activeTabMode, setActiveTabMode] = useState<'overview' | 'application'>('overview');

  // Application Details Tabs (Screenshot 1)
  const [appSubTab, setAppSubTab] = useState<'application' | 'rental_history' | 'documents' | 'notes'>('application');

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Switcher Bar (Allows seamlessly switching between Screenshot 2 & Screenshot 1) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Tenant Details
          </h2>

          {/* Pill selector to switch between the two user-provided views */}
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '3px',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setActiveTabMode('overview')}
              style={{
                border: 'none',
                background: activeTabMode === 'overview' ? '#ffffff' : 'transparent',
                color: activeTabMode === 'overview' ? '#2563eb' : '#64748b',
                fontWeight: activeTabMode === 'overview' ? 700 : 500,
                fontSize: '0.78rem',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: activeTabMode === 'overview' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Tenancy Overview (Default)
            </button>
            <button
              onClick={() => setActiveTabMode('application')}
              style={{
                border: 'none',
                background: activeTabMode === 'application' ? '#ffffff' : 'transparent',
                color: activeTabMode === 'application' ? '#2563eb' : '#64748b',
                fontWeight: activeTabMode === 'application' ? 700 : 500,
                fontSize: '0.78rem',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: activeTabMode === 'application' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Application Details Tab
            </button>
          </div>
        </div>

        {/* Right Action / Status area */}
        {activeTabMode === 'overview' ? (
          // Screenshot 2: "Rent Details : $5000/month Paid"
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Rent Details :</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              $5000/month
            </span>
            <span
              style={{
                background: '#ecfdf5',
                color: '#10b981',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
              }}
            >
              Paid
            </span>
          </div>
        ) : (
          // Screenshot 1: "Reject" and "Proceed Application ->"
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => showToast('Application marked as Rejected.')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
                padding: '8px 14px',
              }}
            >
              Reject
            </button>
            <button
              onClick={() => showToast('Proceeding application to lease creation...')}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <span>Proceed Application</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          SCREENSHOT 2 VIEW: TENANCY OVERVIEW (PERSONAL + LEASE + ADDITIONAL + MAINTENANCE + PAYMENTS)
      ========================================================================== */}
      {activeTabMode === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '24px',
            alignItems: 'start',
          }}
          className="tenant-overview-grid"
        >
          {/* LEFT COLUMN: Main Tenant Details Card (Screenshot 2) */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Header: Photo Avatar + Courtney Henry */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                alt="Courtney Henry"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0',
                }}
              />
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  Courtney Henry
                </h3>
              </div>
            </div>

            {/* SECTION 1: Personal Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                Personal Details
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px 24px',
                  fontSize: '0.82rem',
                }}
              >
                {/* Row 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Contact No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Emergency No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Email Id :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>courtneyh@gmail.com</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Current Address :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>
                    9865 Aurore Expressway
                  </span>
                </div>

                {/* Row 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Occupation :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Sr. UX/UI Designer</span>
                </div>
                <div />
              </div>
            </div>

            <div style={{ height: '1px', background: '#f1f5f9' }} />

            {/* SECTION 2: Lease Agreement */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                Lease Agreement
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px 24px',
                  fontSize: '0.82rem',
                }}
              >
                {/* Start Date & Lease Document */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b' }}>Start Date :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>21 June 2023</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ color: '#64748b' }}>Lease document :</span>
                  {/* PDF Document Card from screenshot */}
                  <div
                    onClick={() => showToast('Opening Lease_document_Courtney.pdf...')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          maxWidth: '130px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        Lease_document_Courtney.pdf
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>20 MB</div>
                    </div>
                  </div>
                </div>

                {/* End Date & Payment terms */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>End Date :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>21 June 2024</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Payment terms :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Monthly</span>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f1f5f9' }} />

            {/* SECTION 3: Additional Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                Additional Details
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px 24px',
                  fontSize: '0.82rem',
                }}
              >
                {/* Row 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Guarantor Name :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Alexa Joseph</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Contact No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Allotted Parking :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>02</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Access Card No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>9834Y65</span>
                </div>

                {/* Row 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Occupation :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Sr. UX/UI Designer</span>
                </div>
                <div />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Maintenance Requests & Payment History (Screenshot 2) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* CARD 1: Maintenance Requests */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  Maintenance Requests
                </h4>
                <button
                  onClick={() => showToast('Opening all maintenance tickets...')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#2563eb',
                    cursor: 'pointer',
                  }}
                >
                  View All
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Issue Description</th>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Priority</th>
                      <th style={{ padding: '8px 6px', fontWeight: 500, textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1 */}
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 6px', color: '#64748b' }}>23-06-20</td>
                      <td style={{ padding: '12px 6px', color: '#0f172a', fontWeight: 500 }}>
                        Leaky faucet in kitchen
                      </td>
                      <td style={{ padding: '12px 6px' }}>
                        <span
                          style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        >
                          Pending
                        </span>
                      </td>
                      <td style={{ padding: '12px 6px', color: '#ef4444', fontWeight: 600 }}>High</td>
                      <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                          <MessageSquare size={14} style={{ cursor: 'pointer' }} />
                          <ArrowRight size={14} style={{ cursor: 'pointer' }} />
                        </div>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 6px', color: '#64748b' }}>23-06-20</td>
                      <td style={{ padding: '12px 6px', color: '#0f172a', fontWeight: 500 }}>
                        Broken AC unit in bedroom
                      </td>
                      <td style={{ padding: '12px 6px' }}>
                        <span
                          style={{
                            background: '#ccfbf1',
                            color: '#0f766e',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        >
                          In Progress
                        </span>
                      </td>
                      <td style={{ padding: '12px 6px', color: '#64748b', fontWeight: 500 }}>Normal</td>
                      <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                          <MessageSquare size={14} style={{ cursor: 'pointer' }} />
                          <ArrowRight size={14} style={{ cursor: 'pointer' }} />
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr>
                      <td style={{ padding: '12px 6px', color: '#64748b' }}>23-06-20</td>
                      <td style={{ padding: '12px 6px', color: '#0f172a', fontWeight: 500 }}>
                        Broken garage door opener
                      </td>
                      <td style={{ padding: '12px 6px' }}>
                        <span
                          style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        >
                          Pending
                        </span>
                      </td>
                      <td style={{ padding: '12px 6px', color: '#64748b', fontWeight: 500 }}>Normal</td>
                      <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                          <MessageSquare size={14} style={{ cursor: 'pointer' }} />
                          <ArrowRight size={14} style={{ cursor: 'pointer' }} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CARD 2: Payment History */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  Payment History
                </h4>
                <button
                  onClick={() => showToast('Opening complete payment ledger...')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#2563eb',
                    cursor: 'pointer',
                  }}
                >
                  View All
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Amount</th>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Payment Method</th>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1 */}
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 6px', color: '#64748b' }}>23-06-2024</td>
                      <td style={{ padding: '12px 6px', fontWeight: 700, color: '#0f172a' }}>$5000</td>
                      <td style={{ padding: '12px 6px', color: '#475569' }}>Online</td>
                      <td style={{ padding: '12px 6px' }}>
                        <span
                          style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        >
                          Overdue
                        </span>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr>
                      <td style={{ padding: '12px 6px', color: '#64748b' }}>23-06-2024</td>
                      <td style={{ padding: '12px 6px', fontWeight: 700, color: '#0f172a' }}>$5000</td>
                      <td style={{ padding: '12px 6px', color: '#475569' }}>Check</td>
                      <td style={{ padding: '12px 6px', color: '#10b981', fontWeight: 600 }}>
                        Paid
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREENSHOT 1 VIEW: APPLICATION DETAILS TAB VIEW
      ========================================================================== */}
      {activeTabMode === 'application' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
            gap: '24px',
            alignItems: 'start',
          }}
          className="tenant-app-grid"
        >
          {/* LEFT CARD: Tenant Profile (Screenshot 1) */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
              alt="Courtney Henry"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e2e8f0',
                marginBottom: '10px',
              }}
            />
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Courtney Henry
            </h3>

            <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                Personal Details
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Contact No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Email Id :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>courtneyh@gmail.com</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Occupation :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Sr. UX/UI Designer</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Emergency Contact No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Current Address :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>
                    9865 Aurore Expressway
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Tabs (Application Details | Rental History 02 | Documents 03 | Notes & Comments) */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '16px',
              padding: '24px',
              minHeight: '400px',
            }}
          >
            {/* Tab navigation headers */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '12px',
                marginBottom: '24px',
              }}
            >
              <button
                onClick={() => setAppSubTab('application')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: appSubTab === 'application' ? 700 : 500,
                  color: appSubTab === 'application' ? '#2563eb' : '#64748b',
                  cursor: 'pointer',
                  position: 'relative',
                  paddingBottom: '12px',
                  marginBottom: '-13px',
                  borderBottom: appSubTab === 'application' ? '2px solid #2563eb' : '2px solid transparent',
                }}
              >
                Application Details
              </button>

              <button
                onClick={() => setAppSubTab('rental_history')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: appSubTab === 'rental_history' ? 700 : 500,
                  color: appSubTab === 'rental_history' ? '#2563eb' : '#64748b',
                  cursor: 'pointer',
                  position: 'relative',
                  paddingBottom: '12px',
                  marginBottom: '-13px',
                  borderBottom: appSubTab === 'rental_history' ? '2px solid #2563eb' : '2px solid transparent',
                }}
              >
                Rental History <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>02</span>
              </button>

              <button
                onClick={() => setAppSubTab('documents')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: appSubTab === 'documents' ? 700 : 500,
                  color: appSubTab === 'documents' ? '#2563eb' : '#64748b',
                  cursor: 'pointer',
                  position: 'relative',
                  paddingBottom: '12px',
                  marginBottom: '-13px',
                  borderBottom: appSubTab === 'documents' ? '2px solid #2563eb' : '2px solid transparent',
                }}
              >
                Documents <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>03</span>
              </button>

              <button
                onClick={() => setAppSubTab('notes')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: appSubTab === 'notes' ? 700 : 500,
                  color: appSubTab === 'notes' ? '#2563eb' : '#64748b',
                  cursor: 'pointer',
                  position: 'relative',
                  paddingBottom: '12px',
                  marginBottom: '-13px',
                  borderBottom: appSubTab === 'notes' ? '2px solid #2563eb' : '2px solid transparent',
                }}
              >
                Notes & Comments
              </button>
            </div>

            {/* TAB CONTENT: Application Details (Screenshot 1) */}
            {appSubTab === 'application' && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px 32px',
                  fontSize: '0.84rem',
                }}
              >
                {/* Row 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Application Date :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>23 June 2024</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>No. of Occupants :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>02</span>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Desired Move-in Date :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>01 July 2024</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Pet(s) :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>--</span>
                </div>

                {/* Row 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Desired Lease Term :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>2 Years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Car(s) :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>02</span>
                </div>

                {/* Row 4 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Marital Status :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Married</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Monthly Income :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>$15000/month</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Rental History */}
            {appSubTab === 'rental_history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Previous Landlord: Kensington Court Estates</div>
                  <div style={{ color: '#64748b', marginTop: '4px' }}>Duration: 2021 - 2023 &bull; Rent: $4,500/mo &bull; Status: Settled with zero arrears</div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Previous Landlord: Victoria Park Residences</div>
                  <div style={{ color: '#64748b', marginTop: '4px' }}>Duration: 2019 - 2021 &bull; Rent: $4,000/mo &bull; Full deposit returned</div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Documents */}
            {appSubTab === 'documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                {['Employment_Verification_Letter.pdf', 'Bank_Statement_3_Months.pdf', 'National_Identity_Passport.pdf'].map((docName) => (
                  <div
                    key={docName}
                    style={{
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="#ef4444" />
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{docName}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Downloading ${docName}...`)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Notes */}
            {appSubTab === 'notes' && (
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9', fontSize: '0.84rem' }}>
                <p style={{ margin: 0, color: '#334155', lineHeight: 1.5 }}>
                  Applicant has verified employment with verified monthly income exceeding 3x monthly rent. Credit rating excellent. Move-in date requested for 1st July 2024.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .tenant-overview-grid {
            grid-template-columns: 1fr !important;
          }
          .tenant-app-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
