import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Edit3, Sparkles } from 'lucide-react';

interface OCRReviewFormProps {
  jobId: string;
  fileName: string;
  documentCategory: string;
  confidence: number;
  extractedFields: Array<{
    field_name: string;
    field_label: string;
    extracted_value: string;
    normalized_value: string;
    confidence: number;
    human_verified: boolean;
  }>;
  onApprove: (corrections: Record<string, string>, notes: string) => Promise<void> | void;
  onReject: () => Promise<void> | void;
  onClose?: () => void;
}

export const OCRReviewForm: React.FC<OCRReviewFormProps> = ({
  jobId,
  fileName,
  documentCategory,
  confidence,
  extractedFields,
  onApprove,
  onReject,
  onClose,
}) => {
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    extractedFields.forEach((f) => {
      init[f.field_name] = f.normalized_value || f.extracted_value;
    });
    return init;
  });
  const [notes, setNotes] = useState('Verified against original uploaded physical document.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (key: string, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(fields, notes);
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
              Human Verification Workbench — {fileName}
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
            Confidence: {Math.round(confidence * 100)}%
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
        {extractedFields.map((f) => (
          <div key={f.field_name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              <span>{f.field_label}</span>
              <span style={{ color: '#38bdf8' }}>{Math.round(f.confidence * 100)}% conf</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={fields[f.field_name] || ''}
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
          onClick={onReject}
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
