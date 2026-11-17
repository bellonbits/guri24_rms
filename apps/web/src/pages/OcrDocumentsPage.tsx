import React, { useState, useMemo, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FileSearch, Upload, FileText, CheckCircle2, AlertCircle, Clock, Eye, ShieldCheck, Filter, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { ResponsiveTable, StatusBadge, ModalDialog } from '../components/ui/Primitives';
import { OCRReviewForm } from '../components/OCRReviewForm';
import { formatNairobiDate } from '../lib/formatters';
import { OcrJobRecord, OcrJobStatus, DocumentItem } from '../types';

export const OcrDocumentsPage: React.FC = () => {
  const { currentOrg, hasPermission } = useAuth();
  const { state, setState, setIsScannerOpen } = useRms();
  const { id: reviewJobId } = useParams<{ id?: string }>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'LEASE_AGREEMENT' | 'TENANT_IDENTIFICATION' | 'RECEIPT_OR_INVOICE'>('LEASE_AGREEMENT');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  // Active Job for Review Form
  const activeReviewJob = useMemo(() => {
    if (reviewJobId) {
      return orgOcrJobs.find((j) => j.id === reviewJobId) || null;
    }
    if (isReviewView) {
      return orgOcrJobs.find((j) => j.status === 'NEEDS_REVIEW') || orgOcrJobs[0] || null;
    }
    return null;
  }, [reviewJobId, isReviewView, orgOcrJobs]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newJob: OcrJobRecord = {
      id: `ocr-${Date.now()}`,
      organization_id: currentOrg.id,
      document_id: `doc-${Date.now()}`,
      filename: selectedFile.name,
      file_size_bytes: selectedFile.size,
      mime_type: selectedFile.type || 'application/pdf',
      category: selectedCategory,
      status: 'NEEDS_REVIEW',
      extracted_fields: [
        { field_name: 'full_name', value: 'Kamau Mwangi', confidence: 0.94, verified: false },
        { field_name: 'id_number', value: '29841234', confidence: 0.96, verified: false },
        { field_name: 'monthly_rent_kes', value: '45000', confidence: 0.91, verified: false },
        { field_name: 'unit_number', value: 'B-204', confidence: 0.89, verified: false },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      ocrJobs: [newJob, ...prev.ocrJobs],
    }));

    setSelectedFile(null);
    setIsUploadModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation */}
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
      {isReviewView && activeReviewJob && (
        <section className="surface-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                olmOCR Human Verification & Review
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.15rem', fontWeight: 700 }}>
                {activeReviewJob.filename}
              </h2>
            </div>
            <Link to="/app/ocr-documents/processing-jobs" className="btn-outline" style={{ textDecoration: 'none' }}>
              Back to Jobs
            </Link>
          </div>

          <OCRReviewForm
            job={activeReviewJob}
            onApprove={(jobId, fields) => {
              setState((prev) => ({
                ...prev,
                ocrJobs: prev.ocrJobs.map((j) =>
                  j.id === jobId ? { ...j, status: 'VERIFIED', extracted_fields: fields } : j
                ),
              }));
            }}
            onReject={(jobId, reason) => {
              setState((prev) => ({
                ...prev,
                ocrJobs: prev.ocrJobs.map((j) =>
                  j.id === jobId ? { ...j, status: 'FAILED' } : j
                ),
              }));
            }}
          />
        </section>
      )}

      {/* Jobs Table or Documents Table */}
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
            {orgOcrJobs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  No documents in OCR queue. Upload a lease agreement, national ID, or utility receipt.
                </td>
              </tr>
            ) : (
              orgOcrJobs.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{j.filename}</td>
                  <td>{j.category}</td>
                  <td style={{ color: '#64748b' }}>{Math.round((j.file_size_bytes || 1024) / 1024)} KB</td>
                  <td style={{ fontSize: '0.8rem' }}>{formatNairobiDate(j.created_at)}</td>
                  <td>
                    <StatusBadge
                      status={j.status}
                      tone={j.status === 'VERIFIED' ? 'success' : j.status === 'NEEDS_REVIEW' ? 'warning' : 'info'}
                    />
                  </td>
                  <td>
                    {j.status === 'NEEDS_REVIEW' ? (
                      <Link
                        to={`/app/ocr-documents/review/${j.id}`}
                        className="btn-dark"
                        style={{ padding: '3px 8px', fontSize: '0.74rem', textDecoration: 'none' }}
                      >
                        Review
                      </Link>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Verified</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </ResponsiveTable>
        </section>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <ModalDialog
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Document for OCR Processing"
        >
          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
              <button type="button" className="btn-outline" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Queue for olmOCR
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
