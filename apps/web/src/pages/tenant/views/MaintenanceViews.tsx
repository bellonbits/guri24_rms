import React, { useState, useEffect } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Camera,
  Upload,
  User,
  Phone,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import type { MaintenanceRequest, Property, Unit } from '../../../types';

interface MaintenanceViewsProps {
  mode: 'new' | 'detail';
  requestId?: string;
  onBack?: () => void;
  showToast?: (msg: string) => void;
  onNavigateDetail?: (id: string) => void;
}

export const MaintenanceViews: React.FC<MaintenanceViewsProps> = ({
  mode,
  requestId,
  onBack,
  showToast,
  onNavigateDetail,
}) => {
  // New Request Form State
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [category, setCategory] = useState('PLUMBING');
  const [priority, setPriority] = useState('NORMAL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionToEnter, setPermissionToEnter] = useState(true);

  // Detail View State
  const [requestItem, setRequestItem] = useState<MaintenanceRequest | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(mode === 'detail');
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFormPrerequisites() {
      try {
        const [p, u] = await Promise.all([
          apiClient.getProperties().catch(() => []),
          apiClient.getUnits().catch(() => []),
        ]);
        setProperties(p || []);
        setUnits(u || []);
        if (p && p.length > 0) setSelectedPropertyId(p[0].id);
        if (u && u.length > 0) setSelectedUnitId(u[0].id);
      } catch {}
    }
    loadFormPrerequisites();
  }, []);

  useEffect(() => {
    if (mode === 'detail' && requestId) {
      setIsLoadingDetail(true);
      setDetailError(null);
      apiClient
        .getMaintenance()
        .then((items) => {
          const found = (items || []).find((m) => m.id === requestId);
          if (found) {
            setRequestItem(found);
          } else {
            setDetailError(`Maintenance request ${requestId} was not found on server.`);
          }
        })
        .catch((err) => {
          setDetailError(err?.message || 'Unable to retrieve maintenance details.');
        })
        .finally(() => {
          setIsLoadingDetail(false);
        });
    }
  }, [mode, requestId]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      if (showToast) showToast('Please provide an issue title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await apiClient.createMaintenance({
        property_id: selectedPropertyId || undefined,
        unit_id: selectedUnitId || undefined,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      });

      if (showToast) {
        showToast(`Maintenance request ${created?.id || 'submitted'} created successfully!`);
      }
      if (onNavigateDetail && created?.id) {
        onNavigateDetail(created.id);
      } else if (onBack) {
        onBack();
      }
    } catch (err: any) {
      if (showToast) showToast(err?.message || 'Failed to submit maintenance request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'new') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.86rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={16} /> Back to Maintenance List
        </button>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Submit Maintenance Request
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
              Report a defect or repair request directly to property facilities management.
            </p>
          </div>

          <form onSubmit={handleCreateRequest}>
            {/* Property and Unit selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Property
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                  {properties.length === 0 && <option value="">No properties configured</option>}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Unit
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>{u.unit_number}</option>
                  ))}
                  {units.length === 0 && <option value="">No units configured</option>}
                </select>
              </div>
            </div>

            {/* Category selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Issue Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'PLUMBING', label: 'Plumbing' },
                  { id: 'ELECTRICAL', label: 'Electrical' },
                  { id: 'APPLIANCE', label: 'Appliance' },
                  { id: 'CARPENTRY', label: 'Carpentry' },
                  { id: 'LOCKSMITH', label: 'Lock & Door' },
                  { id: 'HVAC', label: 'HVAC' },
                  { id: 'OTHER', label: 'Other Issue' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: category === cat.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: category === cat.id ? '#eff6ff' : '#ffffff',
                      color: category === cat.id ? '#2563eb' : '#475569',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Urgency & Priority
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { id: 'LOW', label: 'Low', desc: 'Non-urgent' },
                  { id: 'NORMAL', label: 'Normal', desc: 'Standard 48hr' },
                  { id: 'HIGH', label: 'High', desc: 'Urgent 24hr' },
                  { id: 'EMERGENCY', label: 'Emergency', desc: 'Immediate' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border:
                        priority === p.id
                          ? p.id === 'EMERGENCY'
                            ? '2px solid #ef4444'
                            : '2px solid #2563eb'
                          : '1px solid #e2e8f0',
                      background:
                        priority === p.id
                          ? p.id === 'EMERGENCY'
                            ? '#fef2f2'
                            : '#eff6ff'
                          : '#ffffff',
                      color:
                        priority === p.id
                          ? p.id === 'EMERGENCY'
                            ? '#dc2626'
                            : '#2563eb'
                          : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem' }}>{p.label}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 400, marginTop: '2px' }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Issue Title / Summary
              </label>
              <input
                type="text"
                placeholder="e.g. Water dripping under bathroom basin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Detailed Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe when the defect started, whether it affects safety, and any temporary steps taken..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="entryPermission"
                checked={permissionToEnter}
                onChange={(e) => setPermissionToEnter(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="entryPermission" style={{ fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                <strong>Permission to enter:</strong> I authorize technician & caretaker to inspect if accompanied by building staff.
              </label>
            </div>

            {/* Submit button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={onBack}
                style={{ padding: '12px 20px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 26px',
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Detail Mode
  if (isLoadingDetail) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#2563eb' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Loading Request Details...</h3>
      </div>
    );
  }

  if (detailError || !requestItem) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#991b1b', margin: '0 0 6px 0' }}>Request Not Found</h3>
        <p style={{ fontSize: '0.88rem', color: '#7f1d1d', margin: '0 0 16px 0' }}>{detailError || 'This maintenance record does not exist on the server.'}</p>
        <button
          onClick={onBack}
          style={{ padding: '8px 18px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
        >
          Back to Maintenance List
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', fontSize: '0.86rem', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '16px' }}
      >
        <ArrowLeft size={16} /> Back to Maintenance List
      </button>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                {requestItem.id}
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}>
                {requestItem.category || 'GENERAL'}
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626' }}>
                {requestItem.priority || 'NORMAL'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              {requestItem.title}
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Reported on {requestItem.created_at || 'Recently'}
            </div>
          </div>

          <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', background: requestItem.status === 'RESOLVED' || requestItem.status === 'CLOSED' ? '#dcfce7' : '#eff6ff', color: requestItem.status === 'RESOLVED' || requestItem.status === 'CLOSED' ? '#15803d' : '#2563eb' }}>
            {requestItem.status}
          </span>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
            Issue Description
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
            {requestItem.description}
          </p>
        </div>

        {requestItem.resolution_notes && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px' }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#166534', margin: '0 0 6px 0' }}>
              Resolution Notes
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#15803d', margin: 0 }}>
              {requestItem.resolution_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
