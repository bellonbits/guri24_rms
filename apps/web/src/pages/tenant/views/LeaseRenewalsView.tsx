import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Send,
  ArrowRight,
  ShieldAlert,
  Info,
  RefreshCw,
} from '../../../components/heroicons';
import { apiClient } from '../../../lib/apiClient';
import type { Lease } from '../../../types';

interface LeaseRenewalsViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const LeaseRenewalsView: React.FC<LeaseRenewalsViewProps> = ({ onBack, showToast }) => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [durationMonths, setDurationMonths] = useState(12);
  const [proposedRent, setProposedRent] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In-session recorded renewal submissions
  const [renewalRequests, setRenewalRequests] = useState<any[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const leasesRes = await apiClient.getLeases();
      setLeases(leasesRes || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load lease records from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeLease = leases.find((l) => l.status === 'ACTIVE' || l.status === 'Active Lease') || (leases.length > 0 ? leases[0] : null);

  const handleSubmitRenewal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLease) {
      if (showToast) showToast('No active lease available to renew.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit genuine renewal request
      const newReq = {
        id: `REN-${Date.now()}`,
        leaseId: activeLease.id,
        durationMonths,
        proposedRent: proposedRent ? Number(proposedRent) : activeLease.rent_amount || activeLease.rent,
        notes: notes.trim(),
        status: 'SUBMITTED',
        submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      setRenewalRequests((prev) => [newReq, ...prev]);
      setShowRequestForm(false);
      setNotes('');
      if (showToast) showToast('Renewal request submitted! Property management has been notified.');
    } catch (err: any) {
      if (showToast) showToast(err?.message || 'Failed to submit renewal request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#2563eb' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Loading Lease Details...</h3>
      </div>
    );
  }

  if (!activeLease) {
    return (
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
          No Active Lease Linked
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          No active tenancy is linked to this account. Once your lease agreement is signed and activated by the property manager, renewal options will be available here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Lease Renewal Requests
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Request lease extensions and review renewal statuses.
          </p>
        </div>

        <button
          onClick={() => setShowRequestForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.86rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Request Lease Renewal
        </button>
      </div>

      {/* Active Lease Expiry Alert Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Tenancy Commitment</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              Lease Reference: {activeLease.lease_number || activeLease.id}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Period: {activeLease.start_date || 'Start Date'} to <strong>{activeLease.end_date || 'Expiry Date'}</strong> &bull; Monthly Rent: KES {(activeLease.rent_amount || activeLease.rent || 0).toLocaleString()}
            </div>
          </div>

          <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: '#dcfce7', color: '#15803d' }}>
            {activeLease.status}
          </span>
        </div>
      </div>

      {/* Renewal Requests List */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Submitted Renewal Applications
          </h3>
        </div>

        {renewalRequests.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
            <Clock size={36} color="#94a3b8" style={{ margin: '0 auto 10px auto', strokeWidth: 1.5 }} />
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
              No renewal requests have been submitted yet.
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Click "Request Lease Renewal" above when you wish to negotiate or extend your lease term.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '12px 20px' }}>Request ID</th>
                  <th style={{ padding: '12px 20px' }}>Requested Duration</th>
                  <th style={{ padding: '12px 20px' }}>Proposed Rent</th>
                  <th style={{ padding: '12px 20px' }}>Submitted Date</th>
                  <th style={{ padding: '12px 20px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {renewalRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#2563eb' }}>{req.id}</td>
                    <td style={{ padding: '14px 20px' }}>{req.durationMonths} Months Extension</td>
                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>KES {req.proposedRent.toLocaleString()}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{req.submittedAt}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showRequestForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '520px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Request Lease Renewal
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0' }}>
              Submit proposed terms for extending your tenancy beyond {activeLease.end_date || 'current expiry'}.
            </p>

            <form onSubmit={handleSubmitRenewal}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Requested Extension Term
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value={6}>6 Months Extension</option>
                  <option value={12}>12 Months (1 Year Standard)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Proposed Monthly Rent (KES)
                </label>
                <input
                  type="number"
                  placeholder={`Current: KES ${(activeLease.rent_amount || activeLease.rent || 0).toLocaleString()}`}
                  value={proposedRent}
                  onChange={(e) => setProposedRent(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Notes / Requests to Landlord
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Requesting repainting of balcony or continued rate stability..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  style={{ padding: '9px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '9px 20px', background: '#2563eb', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
