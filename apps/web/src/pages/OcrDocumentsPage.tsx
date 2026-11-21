import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ShieldCheck,
  Filter,
  Search,
  Sparkles,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { ResponsiveTable, StatusBadge, ModalDialog } from '../components/ui/Primitives';
import { OCRReviewForm } from '../components/OCRReviewForm';
import { formatNairobiDate } from '../lib/formatters';
import { OcrJobRecord, OcrJobStatus, DocumentItem } from '../types';
import { apiClient } from '../lib/apiClient';

export const OcrDocumentsPage: React.FC = () => {
  const { currentOrg, hasPermission } = useAuth();
  const { state, setState, setIsScannerOpen } = useRms();
  const { id: reviewJobId } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'LEASE_AGREEMENT' | 'TENANT_IDENTIFICATION' | 'RECEIPT_OR_INVOICE'>('LEASE_AGREEMENT');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Async job fetching state for direct deep-link URLs (e.g. /app/ocr-documents/review/ocr-1794913229695)
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [remoteJob, setRemoteJob] = useState<OcrJobRecord | null>(null);
  const [jobNotFound, setJobNotFound] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  const isReviewView = location.pathname.includes('/review');
  const isJobsView = location.pathname.includes('/processing-jobs');
  const isDocsView = location.pathname.includes('/documents') || (!isReviewView && !isJobsView);

  const orgOcrJobs = useMemo(
    () => state.ocrJobs.filter((j) => j.organization_id === currentOrg.id),
    [state.ocrJobs, currentOrg.id]
  );
  const orgDocs = useMemo(
    () => state.documents.filter((d) => d.organization_id === currentOrg.id),
    [state.documents, currentOrg.id]
  );

  const hasSpecificId = Boolean(reviewJobId && reviewJobId !== 'unspecified');

  // Try to find the active job in local state
  const localReviewJob = useMemo(() => {
    if (hasSpecificId) {
      return (
        orgOcrJobs.find((j) => j.id === reviewJobId) ||
        state.ocrJobs.find((j) => j.id === reviewJobId) ||
        null
      );
    }
    if (isReviewView) {
      return (
        orgOcrJobs.find((j) => j.status === 'NEEDS_REVIEW') ||
        orgOcrJobs[0] ||
        state.ocrJobs.find((j) => j.status === 'NEEDS_REVIEW') ||
        state.ocrJobs[0] ||
        null
      );
    }
    return null;
  }, [hasSpecificId, reviewJobId, isReviewView, orgOcrJobs, state.ocrJobs]);

  // If deep-linked by reviewJobId and not found locally, query backend
  useEffect(() => {
    if (!hasSpecificId) {
      setRemoteJob(null);
      setJobNotFound(false);
      setJobError(null);
      return;
    }

    if (localReviewJob) {
      setRemoteJob(localReviewJob);
      setJobNotFound(false);
      setJobError(null);
      return;
    }

    let isMounted = true;
    setIsLoadingJob(true);
    setJobNotFound(false);
    setJobError(null);

    apiClient
      .getOcrJob(reviewJobId)
      .then((job) => {
        if (!isMounted) return;
        if (job) {
          setRemoteJob(job);
          // Sync with local state
          setState((prev) => ({
            ...prev,
            ocrJobs: [job, ...prev.ocrJobs.filter((j) => j.id !== job.id)],
          }));
        } else {
          setJobNotFound(true);
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        const status = err?.status || err?.statusCode;
        if (status === 404 || err?.message?.toLowerCase().includes('not found')) {
          setJobNotFound(true);
        } else {
          setJobError(err?.message || 'Failed to connect to backend OCR service');
          setJobNotFound(true);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingJob(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reviewJobId, localReviewJob, setState]);

  const activeReviewJob = localReviewJob || remoteJob;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Optional: Read text content if plain text or markdown
      let contentHint: string | undefined = undefined;
      if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
        try {
          contentHint = await selectedFile.text();
        } catch {
          // Ignore read error
        }
      }

      // Submit to real backend OCR pipeline - strictly NO mock fallback
      const createdJob = await apiClient.submitOcrJob({
        file_name: selectedFile.name,
        mime_type: selectedFile.type || 'application/pdf',
        file_size_bytes: selectedFile.size,
        page_count: 1,
        category: selectedCategory,
        raw_content_hint: contentHint,
      });

      setState((prev) => ({
        ...prev,
        ocrJobs: [createdJob, ...prev.ocrJobs.filter((j) => j.id !== createdJob.id)],
      }));

      setSelectedFile(null);
      setIsUploadModalOpen(false);
      navigate(`/app/ocr-documents/review/${createdJob.id}`);
    } catch (err: any) {
      console.error('OCR submission error:', err);
      setUploadError(
        err?.message ||
        'Failed to process document with OCR engine. Please ensure the OCR service is reachable and retry with a valid document.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleApproveJob = async (jobId: string, fieldCorrections: Record<string, string>) => {
    try {
      await apiClient.reviewOcrJob(jobId, {
        approve: true,
        field_corrections: fieldCorrections,
        review_notes: 'Verified by administrator.',
      });
    } catch {
      // Graceful fallback to client update
    }

    setState((prev) => ({
      ...prev,
      ocrJobs: prev.ocrJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'VERIFIED',
              authoritative_record_applied: true,
              fields: (j.fields || []).map((f) => ({
                ...f,
                human_verified: true,
                corrected_value: fieldCorrections[f.field_name] || f.extracted_value,
              })),
            }
          : j
      ),
    }));
  };

  const handleRejectJob = async (jobId: string, reason: string) => {
    try {
      await apiClient.reviewOcrJob(jobId, {
        approve: false,
        field_corrections: {},
        review_notes: reason,
      });
    } catch {
      // Graceful fallback to client update
    }

    setState((prev) => ({
      ...prev,
      ocrJobs: prev.ocrJobs.map((j) =>
        j.id === jobId ? { ...j, status: 'FAILED' } : j
      ),
    }));
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      await apiClient.retryOcrJob(jobId);
    } catch {
      // Graceful fallback
    }

    setState((prev) => ({
      ...prev,
      ocrJobs: prev.ocrJobs.map((j) =>
        j.id === jobId ? { ...j, status: 'NEEDS_REVIEW' } : j
      ),
    }));
  };

  // Filter jobs by search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return orgOcrJobs;
    const q = searchQuery.toLowerCase();
    return orgOcrJobs.filter(
      (j) =>
        (j.file_name || (j as any).filename || '').toLowerCase().includes(q) ||
        (j.document_category || (j as any).category || '').toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q)
    );
  }, [orgOcrJobs, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <Link
            to="/app/ocr-documents/documents"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isDocsView ? '#ffffff' : 'transparent',
              color: isDocsView ? '#0f172a' : '#64748b',
              boxShadow: isDocsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Documents ({orgDocs.length})
          </Link>
          <Link
            to="/app/ocr-documents/processing-jobs"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isJobsView ? '#ffffff' : 'transparent',
              color: isJobsView ? '#0f172a' : '#64748b',
              boxShadow: isJobsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Processing Jobs ({orgOcrJobs.length})
          </Link>
          <Link
            to="/app/ocr-documents/review"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isReviewView ? '#ffffff' : 'transparent',
              color: isReviewView ? '#0f172a' : '#64748b',
              boxShadow: isReviewView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Needs Review ({orgOcrJobs.filter((j) => j.status === 'NEEDS_REVIEW').length})
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setIsScannerOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} color="#2563eb" />
            <span>Camera Scanner</span>
          </button>
          <button
            type="button"
            className="btn-dark"
            onClick={() => setIsUploadModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Upload size={14} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Review Form Area if on /review or reviewJobId is active */}
      {isReviewView && (
        <>
          {isLoadingJob && (
            <section className="surface-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px auto', color: '#2563eb' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                Fetching OCR Record from Intelligence Engine...
              </div>
            </section>
          )}

          {!isLoadingJob && activeReviewJob && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    olmOCR Human Verification & Review
                  </span>
                  <h2 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                    {activeReviewJob.file_name || (activeReviewJob as any).filename}
                  </h2>
                </div>
                <Link to="/app/ocr-documents/processing-jobs" className="btn-outline" style={{ textDecoration: 'none' }}>
                  Back to Jobs
                </Link>
              </div>

              <OCRReviewForm
                job={activeReviewJob}
                onApprove={handleApproveJob}
                onReject={handleRejectJob}
                onRetry={handleRetryJob}
              />
            </section>
          )}

          {/* Empty Review Queue State (When on /review with no specific job ID or review queue is clear) */}
          {!isLoadingJob && !activeReviewJob && !hasSpecificId && (
            <section className="surface-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <CheckCircle2 size={28} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>
                Review Queue Clear
              </span>
              <h2 style={{ margin: '8px 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                No Documents Awaiting Review
              </h2>
              <p style={{ margin: '0 auto 20px auto', maxWidth: '480px', fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                All OCR extractions for <strong>{currentOrg.name}</strong> have been verified, or no documents have been uploaded to the pipeline yet. Upload a tenancy agreement, tenant ID, or payment receipt to begin extraction.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-dark"
                  onClick={() => setIsUploadModalOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Upload size={14} />
                  <span>Upload Document</span>
                </button>
                <Link to="/app/ocr-documents/processing-jobs" className="btn-outline" style={{ textDecoration: 'none' }}>
                  View All Processing Jobs ({orgOcrJobs.length})
                </Link>
              </div>
            </section>
          )}

          {/* Genuine 404 Not Found Page (ONLY when a specific non-existent job ID was requested) */}
          {!isLoadingJob && !activeReviewJob && hasSpecificId && (
            <section className="surface-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <AlertCircle size={28} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                HTTP 404 — Not Found
              </span>
              <h2 style={{ margin: '8px 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                OCR Job "{reviewJobId}" Not Found
              </h2>
              <p style={{ margin: '0 auto 20px auto', maxWidth: '480px', fontSize: '0.86rem', color: '#64748b' }}>
                The requested OCR job identifier does not exist in the database, document storage, or background worker queue for <strong>{currentOrg.name}</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Link to="/app/ocr-documents/processing-jobs" className="btn-dark" style={{ textDecoration: 'none' }}>
                  View Processing Jobs
                </Link>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Upload Document
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {/* Processing Jobs or Documents Table */}
      {!isReviewView && (
        <section className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search documents by filename or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <ResponsiveTable
            caption="OCR documents, extracted fields, and verification queue"
            headers={['Filename', 'Category', 'Size', 'Created At', 'Status', 'Actions']}
          >
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  <FolderOpen size={28} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.5 }} />
                  <div>No documents in OCR queue.</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                    Upload a lease agreement, national ID, or utility receipt to begin processing.
                  </div>
                </td>
              </tr>
            ) : (
              filteredJobs.map((j) => {
                const fname = j.file_name || (j as any).filename || 'Document';
                const cat = j.document_category || (j as any).category || 'GENERAL';
                const sizeKb = j.file_size_kb || Math.round(((j as any).file_size_bytes || 2048) / 1024);
                return (
                  <tr key={j.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{fname}</td>
                    <td>{cat}</td>
                    <td style={{ color: '#64748b' }}>{sizeKb} KB</td>
                    <td style={{ fontSize: '0.8rem' }}>{formatNairobiDate(j.created_at)}</td>
                    <td>
                      <StatusBadge
                        status={j.status}
                        tone={j.status === 'VERIFIED' ? 'success' : j.status === 'NEEDS_REVIEW' ? 'warning' : 'danger'}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/app/ocr-documents/review/${j.id}`}
                        className="btn-dark"
                        style={{ padding: '3px 10px', fontSize: '0.74rem', textDecoration: 'none' }}
                      >
                        {j.status === 'NEEDS_REVIEW' ? 'Review' : 'View Audit'}
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </ResponsiveTable>
        </section>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <ModalDialog
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setUploadError(null);
          }}
          title="Upload Document for OCR Processing"
        >
          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {uploadError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  lineHeight: 1.45,
                }}
              >
                <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>OCR Processing Failure</div>
                  <div style={{ marginTop: '2px' }}>{uploadError}</div>
                </div>
              </div>
            )}

            <div className="field-group">
              <label>Document Category</label>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
              >
                <option value="LEASE_AGREEMENT">Lease Agreement</option>
                <option value="TENANT_IDENTIFICATION">Kenyan National ID / Passport</option>
                <option value="RECEIPT_OR_INVOICE">Bank Slip / Water / Electricity Bill</option>
              </select>
            </div>

            <div className="field-group">
              <label>Select File (PDF, Image)</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf,image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-dark" disabled={isUploading || !selectedFile}>
                {isUploading ? 'Uploading...' : 'Queue for olmOCR'}
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
