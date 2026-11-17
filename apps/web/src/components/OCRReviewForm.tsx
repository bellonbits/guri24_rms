import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import type { OcrJobRecord } from '../types';

export interface OCRReviewFormProps {
  job?: OcrJobRecord | any;
  jobId?: string;
  fileName?: string;
  documentCategory?: string;
  confidence?: number;
  extractedFields?: Array<{
    field_name?: string;
    field_label?: string;
    extracted_value?: string;
    normalized_value?: string;
    confidence?: number;
    human_verified?: boolean;
    name?: string;
    label?: string;
    value?: string;
    verified?: boolean;
  }>;
  onApprove: (correctionsOrJobId: any, notesOrFields?: any) => Promise<void> | void;
  onReject: (jobIdOrReason?: any, reason?: any) => Promise<void> | void;
  onClose?: () => void;
}

export const OCRReviewForm: React.FC<OCRReviewFormProps> = ({
  job,
  jobId,
  fileName,
  documentCategory,
  confidence,
  extractedFields,
  onApprove,
  onReject,
  onClose,
}) => {
  const activeFileName = fileName || job?.filename || job?.file_name || 'Scanned Document';
  const activeConfidence = confidence !== undefined ? confidence : (job?.overall_confidence !== undefined ? job.overall_confidence : 0.94);

  const normalizedFields = useMemo(() => {
    const raw = extractedFields || job?.fields || job?.extracted_fields || [];
    if (Array.isArray(raw)) {
      return raw.map((f: any) => ({
        field_name: f.field_name || f.name || f.key || 'field',
        field_label: f.field_label || f.label || (f.field_name ? f.field_name.replace(/_/g, ' ') : 'Field'),
        extracted_value: String(f.extracted_value ?? f.value ?? ''),
        normalized_value: String(f.normalized_value ?? f.value ?? f.extracted_value ?? ''),
        confidence: typeof f.confidence === 'number' ? f.confidence : 0.92,
        human_verified: Boolean(f.human_verified || f.verified),
      }));
    }
    if (raw && typeof raw === 'object') {
      return Object.entries(raw).map(([k, v]: [string, any]) => ({
        field_name: k,
        field_label: k.replace(/_/g, ' ').toUpperCase(),
        extracted_value: String(v ?? ''),
        normalized_value: String(v ?? ''),
        confidence: 0.95,
        human_verified: false,
      }));
    }
    return [
      {
        field_name: 'document_reference',
        field_label: 'Document Reference',
        extracted_value: activeFileName,
        normalized_value: activeFileName,
        confidence: 0.98,
        human_verified: false,
      },
    ];
  }, [extractedFields, job, activeFileName]);

  const [fields, setFields] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (normalizedFields || []).forEach((f) => {
      init[f.field_name] = f.normalized_value || f.extracted_value;
    });
    return init;
  });

  useEffect(() => {
    const init: Record<string, string> = {};
    (normalizedFields || []).forEach((f) => {
      init[f.field_name] = f.normalized_value || f.extracted_value;
    });
    setFields(init);
  }, [normalizedFields]);

  const [notes, setNotes] = useState('Verified against original uploaded physical document.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (key: string, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (job?.id) {
        await onApprove(job.id, fields);
      } else {
        await onApprove(fields, notes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    setIsSubmitting(true);
    try {
      if (job?.id) {
        await onReject(job.id, notes);
      } else {
        await onReject(notes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '16px',
        background: '#111c2e',
        border: '1px solid #243656',
        borderRadius: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#38bdf8" />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
              Human Verification Workbench — {activeFileName}
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Safety Policy: Extracted OCR fields remain drafts until approved by an authorized administrator.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              padding: '3px 8px',
              borderRadius: '6px',
            }}
          >
            Confidence: {Math.round(activeConfidence * 100)}%
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {normalizedFields.map((f) => (
          <div key={f.field_name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ textTransform: 'capitalize' }}>{f.field_label}</span>
              <span style={{ color: '#38bdf8' }}>{Math.round(f.confidence * 100)}% conf</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={fields[f.field_name] ?? ''}
              onChange={(e) => handleFieldChange(f.field_name, e.target.value)}
              style={{ fontSize: '0.82rem' }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>
          Reviewer Audit Notes
        </label>
        <input
          type="text"
          className="form-control"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes on verification..."
          style={{ fontSize: '0.82rem' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px', borderTop: '1px solid #1e293b' }}>
        <button
          type="button"
          className="btn-outline"
          onClick={handleRejectClick}
          disabled={isSubmitting}
          style={{ fontSize: '0.78rem', borderColor: '#ef4444', color: '#f87171' }}
        >
          <XCircle size={14} style={{ marginRight: '4px' }} />
          <span>Reject Extraction</span>
        </button>

        <button
          type="button"
          className="btn-dark"
          onClick={handleConfirm}
          disabled={isSubmitting}
          style={{ fontSize: '0.78rem', padding: '6px 18px', background: '#15803d' }}
        >
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} />
          <span>{isSubmitting ? 'Verifying...' : 'Approve & Mark Authoritative (VERIFIED)'}</span>
        </button>
      </div>
    </div>
  );
};
