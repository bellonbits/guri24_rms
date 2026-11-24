import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Shield,
  Upload,
} from 'lucide-react';

interface LeaseRenewalsViewProps {
  propertyName: string;
  unitNumber: string;
  leaseExpires: string;
  monthlyRentKes: number;
  fmt: (amountKes: number, amountUsd?: number) => string;
  showToast: (msg: string) => void;
}

export const LeaseRenewalsView: React.FC<LeaseRenewalsViewProps> = ({
  propertyName,
  unitNumber,
  leaseExpires,
  monthlyRentKes,
  fmt,
  showToast,
}) => {
  const [renewalRequests, setRenewalRequests] = useState([
    {
      id: 'REN-2026-081',
      requestDate: '15 Nov 2026',
      duration: '1 Year (12 Months)',
      preferredDate: '01 Jan 2027',
      proposedRent: 25000,
      status: 'UNDER_REVIEW',
      statusLabel: 'Under Review by Property Manager',
      statusColor: '#d97706',
      statusBg: '#fef3c7',
      comments: 'Tenant requesting lease continuation with standard annual terms. Excellent payment record.',
      managerResponse: 'Pending landlord formal sign-off. Draft addendum in preparation.',
    },
    {
      id: 'REN-2025-044',
      requestDate: '10 Nov 2025',
      duration: '1 Year',
      preferredDate: '01 Jan 2026',
      proposedRent: 25000,
      status: 'APPROVED',
      statusLabel: 'Approved & Countersigned',
      statusColor: '#059669',
      statusBg: '#ecfdf5',
      comments: 'Annual renewal approved for 2026 tenancy period.',
      managerResponse: 'Agreement UF-LS-2026-A204 executed and sealed.',
    },
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [formDuration, setFormDuration] = useState('1 Year (12 Months)');
  const [formStartDate, setFormStartDate] = useState('2027-01-01');
  const [formProposedRent, setFormProposedRent] = useState('25000');
  const [formNotes, setFormNotes] = useState('');

  const handleCreateRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `REN-${Date.now().toString().slice(-4)}`,
      requestDate: 'Today',
      duration: formDuration,
      preferredDate: formStartDate,
      proposedRent: parseInt(formProposedRent, 10) || monthlyRentKes,
      status: 'SUBMITTED',
      statusLabel: 'Submitted to Property Office',
      statusColor: '#2563eb',
      statusBg: '#eff6ff',
      comments: formNotes || 'Standard renewal request submitted via Tenant Self-Service Portal.',
      managerResponse: 'Awaiting review by Katherine Moss.',
    };

    setRenewalRequests([newReq, ...renewalRequests]);
    setShowNewForm(false);
    setFormNotes('');
    showToast(`Lease renewal request ${newReq.id} submitted for management review!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Link to="/portal/lease" style={{ fontSize: '0.82rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              &larr; Back to My Lease
            </Link>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Lease Renewal Requests
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
            Submit formal requests for tenancy extension and track property manager reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}
        >
          <Plus size={16} />
          <span>New Renewal Request</span>
        </button>
      </div>

      {/* Expiry Banner */}
      <div
        style={{
          background: '#fefce8',
          border: '1px solid #fef08a',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#fef08a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#854d0e',
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#854d0e' }}>
              Current Tenancy Expiry: {leaseExpires}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#a16207', marginTop: '2px' }}>
              {propertyName} &bull; {unitNumber} &bull; Current Rent: <strong>{fmt(monthlyRentKes)}/mo</strong>
            </div>
          </div>
        </div>

        <span
          style={{
            background: '#ecfdf5',
            color: '#059669',
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid #a7f3d0',
          }}
        >
          ✓ Eligible for 12/24 Month Extension
        </span>
      </div>

      {/* New Request Form Modal */}
      {showNewForm && (
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #2563eb',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Submit Formal Lease Renewal Request
            </h3>
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.84rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateRenewal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Requested Extension Duration
                </label>
                <select
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none' }}
                >
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year (12 Months)">1 Year (12 Months)</option>
                  <option value="2 Years (24 Months)">2 Years (24 Months)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Preferred Effective Date
                </label>
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Proposed Monthly Rent (KES)
                </label>
                <input
                  type="number"
                  value={formProposedRent}
                  onChange={(e) => setFormProposedRent(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Additional Notes / Special Requests
              </label>
              <textarea
                rows={3}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Mention any requested maintenance touching up, parking slot preferences, or lease terms..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Renewal Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Renewal Requests Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Renewal History & Active Requests
        </h3>

        {renewalRequests.map((req) => (
          <div
            key={req.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '22px 24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>
                  {req.id}
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  Extension: {req.duration}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  &bull; Effective: <strong>{req.preferredDate}</strong>
                </span>
              </div>

              <span
                style={{
                  background: req.statusBg,
                  color: req.statusColor,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px',
                }}
              >
                {req.statusLabel}
              </span>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
              {req.comments}
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155' }}>
              <strong>Property Management Note:</strong> {req.managerResponse}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
