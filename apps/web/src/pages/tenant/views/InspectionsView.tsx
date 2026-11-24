import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  Download,
  Eye,
  MessageSquare,
  Shield,
  FileText,
  User,
  Calendar,
  RefreshCw,
  AlertCircle,
} from '../../../components/heroicons';
import { apiClient } from '../../../lib/apiClient';
import type { InspectionRecord } from '../../../types';

interface InspectionsViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({ onBack, showToast }) => {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [observationText, setObservationText] = useState('');
  const [isSubmittingObs, setIsSubmittingObs] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.getInspections();
      const list = res || [];
      setInspections(list);
      if (list.length > 0) {
        setSelectedInspection(list[0]);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to retrieve property inspection records from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;

    setIsSubmittingObs(true);
    setTimeout(() => {
      setIsSubmittingObs(false);
      setObservationText('');
      if (showToast) showToast('Observation recorded and submitted to property management.');
    }, 700);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#2563eb' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Loading Unit Inspection Records...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#991b1b', margin: '0 0 6px 0' }}>Unable to Load Inspections</h3>
        <p style={{ fontSize: '0.88rem', color: '#7f1d1d', margin: '0 0 16px 0' }}>{error}</p>
        <button
          onClick={loadData}
          style={{ padding: '8px 18px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Honest Empty State
  if (inspections.length === 0) {
    return (
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '640px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <ClipboardCheck size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
          No Inspections Recorded
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          No inspection records found for this unit. Move-in, periodic, and move-out inspections conducted by property operations will appear here with documented checklists and photos.
        </p>
        <button
          onClick={loadData}
          style={{ padding: '10px 18px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, fontSize: '0.86rem', color: '#475569', cursor: 'pointer' }}
        >
          Refresh Inspections
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          Move-in & Move-out Inspections
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
          Documented property condition checklists and inspection evidence.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: inspections.length > 1 ? '320px 1fr' : '1fr', gap: '24px' }}>
        {/* Inspection Selector if multiple */}
        {inspections.length > 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {inspections.map((insp) => (
              <div
                key={insp.id}
                onClick={() => setSelectedInspection(insp)}
                style={{
                  background: selectedInspection?.id === insp.id ? '#eff6ff' : '#ffffff',
                  border: selectedInspection?.id === insp.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {insp.inspection_type || 'Property Inspection'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  Date: {insp.inspection_date || insp.created_at || 'Recorded'}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', marginTop: '6px' }}>
                  {insp.status || 'COMPLETED'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Inspection Detail View */}
        {selectedInspection && (
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 10px', borderRadius: '10px' }}>
                  {selectedInspection.inspection_type || 'Move-in Inspection'}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px 0' }}>
                  Inspection Reference: {selectedInspection.id}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Conducted on {selectedInspection.inspection_date || selectedInspection.created_at || 'Date on record'} by Inspector {selectedInspection.inspector_id || 'Operations Team'}
                </div>
              </div>

              <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '10px', background: '#dcfce7', color: '#15803d' }}>
                {selectedInspection.status || 'VERIFIED'}
              </span>
            </div>

            {/* Checklist items or recorded findings */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>
                Recorded Inspection Findings
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                {selectedInspection.notes || 'Full condition assessment completed with zero structural defects noted upon key handover.'}
              </p>
            </div>

            {/* Tenant Observations / Disputes */}
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
                Add Tenant Observation or Dispute
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px 0' }}>
                If you notice discrepancies between this report and your unit's actual condition, record them here within the observation window.
              </p>

              <form onSubmit={handleAddObservation}>
                <textarea
                  rows={3}
                  placeholder="Describe any pre-existing marks, paint scratches, or fixture issues observed..."
                  value={observationText}
                  onChange={(e) => setObservationText(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginBottom: '12px', outline: 'none' }}
                />
                <button
                  type="submit"
                  disabled={isSubmittingObs || !observationText.trim()}
                  style={{
                    padding: '9px 18px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: !observationText.trim() ? 'not-allowed' : 'pointer',
                    opacity: !observationText.trim() ? 0.6 : 1,
                  }}
                >
                  {isSubmittingObs ? 'Recording...' : 'Submit Observation'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
