import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw,
  Copy,
  Check,
  Lock,
  FileCode,
} from 'lucide-react';
import type { OcrJobRecord, OcrExtractedField, OcrJobStatus } from '../types';

export interface OCRReviewFormProps {
  job?: OcrJobRecord | any;
  jobId?: string;
  fileName?: string;
  documentCategory?: string;
  confidence?: number;
  extractedFields?: Array<{
    id?: string;
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
    validation_errors?: string[];
    is_sensitive_pii?: boolean;
  }>;
  onApprove: (correctionsOrJobId: any, notesOrFields?: any) => Promise<void> | void;
  onReject: (jobIdOrReason?: any, reason?: any) => Promise<void> | void;
  onRetry?: (jobId: string) => Promise<void> | void;
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
  onRetry,
  onClose,
}) => {
  const activeFileName = fileName || job?.file_name || job?.filename || 'Document.pdf';
  const activeJobId = jobId || job?.id || 'ocr-job';
  const activeCategory = documentCategory || job?.document_category || job?.category || 'GENERAL_DOCUMENT';
  const activeStatus: OcrJobStatus = job?.status || 'NEEDS_REVIEW';

  // Overall confidence
  const activeConfidence = useMemo(() => {
    if (confidence !== undefined) return confidence;
    if (job?.overall_confidence !== undefined) return job.overall_confidence;
    if (job?.overall_confidence_pct !== undefined) return Number(job.overall_confidence_pct) / 100;
    return 0;
  }, [confidence, job]);

  // Normalized fields list - strictly genuine data, never synthesized mock fields
  const normalizedFields = useMemo(() => {
    const raw = extractedFields || job?.fields || job?.extracted_fields || [];
    if (!Array.isArray(raw) || raw.length === 0) {
      return [];
    }
    return raw.map((f: any, idx: number) => {
      const key = String(f.field_name || f.field_key || f.name || f.key || `field_${idx + 1}`).toLowerCase();
      const extVal = String(f.extracted_value ?? f.value ?? '');
      const normVal = String(f.normalized_value ?? extVal);
      const rawConf = typeof f.confidence === 'number' ? f.confidence : (typeof f.confidence_pct === 'number' ? f.confidence_pct / 100 : (extVal ? 0.90 : 0));

      return {
        id: f.id || `f-${idx}`,
        field_name: f.field_name || f.field_key || f.name || f.key || `field_${idx + 1}`,
        field_label: f.field_label || f.label || (f.field_name ? f.field_name.replace(/_/g, ' ') : `Field ${idx + 1}`),
        extracted_value: extVal,
        normalized_value: normVal,
        confidence: rawConf,
        human_verified: Boolean(f.human_verified || f.verified),
        validation_errors: Array.isArray(f.validation_errors) ? f.validation_errors : (f.validation_error ? [f.validation_error] : []),
        is_sensitive_pii: Boolean(f.is_sensitive_pii || (key.includes('id') || key.includes('pin'))),
      };
    });
  }, [extractedFields, job]);

  // Field values state for manual corrections
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'FIELDS' | 'RAW_TEXT' | 'AUDIT'>('FIELDS');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Raw extracted text
  const rawExtractedText = useMemo(() => {
    return job?.raw_extracted_text || job?.raw_text || '';
  }, [job]);

  useEffect(() => {
    const init: Record<string, string> = {};
    normalizedFields.forEach((f) => {
      init[f.field_name] = f.normalized_value || f.extracted_value;
    });
    setFieldValues(init);
  }, [normalizedFields]);

  const handleFieldChange = (key: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (job?.id) {
        await onApprove(job.id, fieldValues);
      } else {
        await onApprove(fieldValues, notes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    if (!notes.trim()) {
      alert('Please enter a reason or notes explaining why this extraction was rejected.');
      return;
    }
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

  const documentUrl = job?.document_url || job?.signed_url || null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Workbench Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          background: '#0f172a',
          color: '#ffffff',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Document Review Workspace
              </h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: activeStatus === 'VERIFIED' ? '#14532d' : activeStatus === 'FAILED' ? '#7f1d1d' : '#854d0e',
                  color: activeStatus === 'VERIFIED' ? '#4ade80' : activeStatus === 'FAILED' ? '#f87171' : '#fde047',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {activeStatus}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
              Reference ID: <code>{activeJobId}</code> &bull; Model: <strong>allenai/olmOCR-2-7B-1025-FP8</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '6px',
              background: activeConfidence >= 0.85 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
              color: activeConfidence >= 0.85 ? '#4ade80' : '#fde047',
            }}
          >
            Confidence: {Math.round(activeConfidence * 100)}%
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '4px 8px',
              }}
              title="Close Workspace"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Safety Safeguard Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 20px',
          background: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          fontSize: '0.78rem',
          color: '#1e40af',
        }}
      >
        <Lock size={15} color="#2563eb" style={{ flexShrink: 0 }} />
        <div>
          <strong>Financial & Legal Protection Rule:</strong> OCR extracted fields remain pending drafts until an authorized administrator verifies them. Approving updates the OCR record but does NOT automatically mutate active leases, bank ledgers, or invoices without explicit submission.
        </div>
      </div>

      {/* Failure Banner if job failed or error reported */}
      {(activeStatus === 'FAILED' || job?.error_message) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '12px 20px',
            background: '#fef2f2',
            borderBottom: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
            <div>
              <strong>Extraction Error:</strong> {job?.error_message || 'OCR engine could not recognize text or validate document structure. No mock data was generated.'}
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => onRetry(activeJobId)}
              style={{ fontSize: '0.74rem', padding: '4px 10px', borderColor: '#fca5a5', color: '#b91c1c' }}
            >
              Retry OCR
            </button>
          )}
        </div>
      )}

      {/* 3-Panel Grid Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 35%) minmax(360px, 42%) minmax(260px, 23%)',
          gap: '16px',
          padding: '16px 20px',
          alignItems: 'start',
        }}
      >
        {/* ================= LEFT PANEL: DOCUMENT PREVIEW ================= */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '14px',
            minHeight: '520px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
              Original Document
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setZoomLevel((prev) => Math.max(60, prev - 15))}
                style={{ padding: '3px 6px', fontSize: '0.74rem' }}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setZoomLevel(100)}
                style={{ padding: '3px 6px', fontSize: '0.72rem' }}
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setZoomLevel((prev) => Math.min(160, prev + 15))}
                style={{ padding: '3px 6px', fontSize: '0.74rem' }}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Document Render Area */}
          <div
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto',
              minHeight: '380px',
            }}
          >
            {documentUrl ? (
              documentUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={documentUrl}
                  title="Document Preview"
                  style={{
                    width: `${zoomLevel}%`,
                    height: '420px',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <img
                  src={documentUrl}
                  alt="Original Document"
                  style={{
                    maxWidth: `${zoomLevel}%`,
                    maxHeight: '420px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                  }}
                />
              )
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: '#64748b' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    color: '#2563eb',
                  }}
                >
                  <FileText size={32} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  {activeFileName}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                  Category: {activeCategory}
                </div>
                <div
                  style={{
                    margin: '14px 0',
                    fontSize: '0.72rem',
                    color: '#475569',
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px dashed #cbd5e1',
                  }}
                >
                  Private Supabase S3 Storage &bull; Authenticated Access
                </div>
                {documentUrl && (
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ fontSize: '0.76rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={13} />
                    <span>Download Original</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>Source: Signed Storage Stream</span>
            <span>Orientation: 0&deg; Normal</span>
          </div>
        </section>

        {/* ================= MAIN PANEL: EXTRACTED CONTENT ================= */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '14px',
            minHeight: '520px',
          }}
        >
          {/* Panel Tabs */}
          <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('FIELDS')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: activeTab === 'FIELDS' ? '#0f172a' : '#f1f5f9',
                color: activeTab === 'FIELDS' ? '#ffffff' : '#64748b',
              }}
            >
              Extracted Fields ({normalizedFields.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('RAW_TEXT')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: activeTab === 'RAW_TEXT' ? '#0f172a' : '#f1f5f9',
                color: activeTab === 'RAW_TEXT' ? '#ffffff' : '#64748b',
              }}
            >
              Layout Markdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('AUDIT')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: activeTab === 'AUDIT' ? '#0f172a' : '#f1f5f9',
                color: activeTab === 'AUDIT' ? '#ffffff' : '#64748b',
              }}
            >
              Rules & Validation
            </button>
          </div>

          {/* TAB 1: STRUCTURED FIELDS */}
          {activeTab === 'FIELDS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '440px' }}>
              {normalizedFields.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 12px', color: '#94a3b8' }}>
                  <AlertTriangle size={28} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 600, color: '#334155' }}>No Structured Fields Extracted</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    olmOCR did not detect key-value pairs. Review the raw layout Markdown tab or enter corrections below.
                  </div>
                </div>
              ) : (
                normalizedFields.map((f) => {
                  const hasErr = f.validation_errors.length > 0;
                  return (
                    <div
                      key={f.field_name}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: hasErr ? '1px solid #fecaca' : '1px solid #e2e8f0',
                        background: hasErr ? '#fff5f5' : '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                            {f.field_label}
                          </span>
                          {f.is_sensitive_pii && (
                            <span
                              style={{
                                fontSize: '0.66rem',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: '#fef3c7',
                                color: '#b45309',
                                fontWeight: 700,
                              }}
                            >
                              PII
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: f.confidence >= 0.9 ? '#15803d' : '#b45309',
                            }}
                          >
                            {Math.round(f.confidence * 100)}% conf
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(f.extracted_value, f.field_name)}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                            title="Copy extracted value"
                          >
                            {copiedKey === f.field_name ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={fieldValues[f.field_name] ?? ''}
                          onChange={(e) => handleFieldChange(f.field_name, e.target.value)}
                          style={{
                            fontSize: '0.82rem',
                            padding: '6px 10px',
                            minBlockSize: '32px',
                            background: '#ffffff',
                          }}
                        />
                      </div>

                      {hasErr && (
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} />
                          <span>{f.validation_errors.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: RAW LAYOUT TEXT */}
          {activeTab === 'RAW_TEXT' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                Spatial and layout-aware text generated by Allen AI olmOCR:
              </div>
              <textarea
                readOnly
                value={rawExtractedText || 'No text extracted from document stream.'}
                style={{
                  flex: 1,
                  minHeight: '380px',
                  fontFamily: 'monospace',
                  fontSize: '0.76rem',
                  lineHeight: '1.45',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#0f172a',
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  resize: 'none',
                }}
              />
            </div>
          )}

          {/* TAB 3: RULES & VALIDATION */}
          {activeTab === 'AUDIT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: '#334155' }}>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Kenyan ID Validation:</strong> Ensures national IDs contain 7-8 numeric digits and are masked in user-facing previews.
              </div>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Kenyan Phone Standardization:</strong> Normalizes Safaricom/Airtel MSISDNs to E.164 (+254) before linking to tenant accounts.
              </div>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Financial Ledger Guard:</strong> OCR invoices and receipts will not generate journal entries until approved and synced with the Spring Financial Service.
              </div>
            </div>
          )}
        </section>

        {/* ================= RIGHT PANEL: METADATA & ACTIONS ================= */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '14px',
            minHeight: '520px',
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
            Job Intelligence & Audit
          </span>

          {/* Metadata Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Category:</span>
              <strong style={{ color: '#0f172a' }}>{activeCategory}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pages:</span>
              <strong style={{ color: '#0f172a' }}>{job?.page_count || 1}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>File Size:</span>
              <strong style={{ color: '#0f172a' }}>
                {Math.round(((job?.file_size_bytes || job?.file_size_kb * 1024) || 2048) / 1024)} KB
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Engine:</span>
              <strong style={{ color: '#0f172a' }}>olmOCR FP8</strong>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

          {/* Processing Timeline */}
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Lifecycle History
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                <CheckCircle2 size={13} />
                <span>Uploaded to Secure Storage</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                <CheckCircle2 size={13} />
                <span>Inference Complete (olmOCR)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeStatus === 'VERIFIED' ? '#16a34a' : '#d97706' }}>
                {activeStatus === 'VERIFIED' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                <span>{activeStatus === 'VERIFIED' ? 'Verified by Administrator' : 'Awaiting Human Verification'}</span>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

          {/* Review Notes Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.76rem', color: '#334155', fontWeight: 600 }}>
              Verification / Rejection Notes
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add audit notes (required when rejecting)..."
              style={{ fontSize: '0.78rem', resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <button
              type="button"
              className="btn-dark"
              onClick={handleConfirm}
              disabled={isSubmitting}
              style={{
                fontSize: '0.8rem',
                padding: '8px 12px',
                background: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Submitting...' : 'Approve & Verify (VERIFIED)'}</span>
            </button>

            <button
              type="button"
              className="btn-outline"
              onClick={handleRejectClick}
              disabled={isSubmitting}
              style={{
                fontSize: '0.78rem',
                borderColor: '#ef4444',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <XCircle size={15} />
              <span>Reject Extraction</span>
            </button>

            {onRetry && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => onRetry(activeJobId)}
                style={{
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={13} />
                <span>Reprocess with olmOCR</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
