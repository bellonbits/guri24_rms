import React, { useState } from 'react';
import {
  Download,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Settings2,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  ImportModuleKey,
  MODULE_TEMPLATES,
  generateTemplateCsv,
  parseCsv,
  autoMapColumns,
  validateImportRows,
  ConflictStrategy,
  ValidationSummary as IValidationSummary,
} from '../lib/importEngine';
import { apiClient } from '../lib/apiClient';
import { FileUpload } from './FileUpload';
import { ColumnMapper } from './ColumnMapper';
import { ImportPreviewTable } from './ImportPreviewTable';
import { ValidationSummary } from './ValidationSummary';
import { RowErrorViewer } from './RowErrorViewer';

type Step = 'UPLOAD' | 'MAP' | 'PREVIEW' | 'RESULTS';

interface ImportWizardProps {
  module: ImportModuleKey;
  onClose: () => void;
  onImportComplete?: (result: any) => void;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({
  module,
  onClose,
  onImportComplete,
}) => {
  const template = MODULE_TEMPLATES[module];
  const [currentStep, setCurrentStep] = useState<Step>('UPLOAD');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [conflictStrategy, setConflictStrategy] = useState<ConflictStrategy>('SKIP_DUPLICATES');
  const [validation, setValidation] = useState<IValidationSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitResult, setCommitResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Download template
  const handleDownloadTemplate = () => {
    const csv = generateTemplateCsv(module);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${module}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Handle file selection & parse
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);

    try {
      const text = await file.text();
      const rows = parseCsv(text);

      if (rows.length === 0) {
        setErrorMessage('Uploaded file is empty or could not be parsed.');
        return;
      }

      const headers = Object.keys(rows[0]);
      setSourceHeaders(headers);
      setParsedRows(rows);

      // Auto map columns
      const autoMap = autoMapColumns(headers, module);
      setColumnMapping(autoMap);

      // Pre-validate
      const val = validateImportRows(module, rows, autoMap);
      setValidation(val);

      setCurrentStep('MAP');
    } catch (err) {
      setErrorMessage(`Failed to read file: ${(err as Error).message}`);
    }
  };

  // 3. Move from Mapping to Preview
  const handleProceedToPreview = () => {
    const val = validateImportRows(module, parsedRows, columnMapping);
    setValidation(val);
    setCurrentStep('PREVIEW');
  };

  // 4. Commit to backend API
  const handleCommit = async () => {
    if (!validation) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const mappedRows = parsedRows.map((r) => {
        const item: Record<string, any> = {};
        template.fields.forEach((f) => {
          const srcCol = columnMapping[f.key] || f.key;
          item[f.key] = r[srcCol] ?? r[f.label] ?? '';
        });
        return item;
      });

      const res = await apiClient.commitImport({
        module,
        rows: mappedRows,
        conflict_strategy: conflictStrategy,
        file_name: selectedFile?.name,
      });

      setCommitResult(res);
      setCurrentStep('RESULTS');
      if (onImportComplete) {
        onImportComplete(res);
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to commit import to backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-wizard-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25), 0 10px 20px -5px rgba(15, 23, 42, 0.1)',
          overflow: 'hidden',
          color: '#0F172A',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}
            >
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 id="import-wizard-title" style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: '#0F172A' }}>
                Bulk Import Wizard — {template.title}
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                Step-by-step verified data acquisition with column mapping, deep schema validation &amp; conflict resolution.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            aria-label="Close bulk import wizard"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4-Step Progress Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            background: '#FFFFFF',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}
        >
          {[
            { id: 'UPLOAD', label: '1. Upload File', num: 1 },
            { id: 'MAP', label: '2. Column Mapping', num: 2 },
            { id: 'PREVIEW', label: '3. Preview & Validate', num: 3 },
            { id: 'RESULTS', label: '4. Import Results', num: 4 },
          ].map((s, idx) => {
            const stepOrder = ['UPLOAD', 'MAP', 'PREVIEW', 'RESULTS'];
            const activeIdx = stepOrder.indexOf(currentStep);
            const isCompleted = idx < activeIdx;
            const isCurrent = currentStep === s.id;

            return (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: isCurrent ? '#2563EB' : isCompleted ? '#16A34A' : '#64748B',
                  borderBottom: isCurrent ? '2px solid #2563EB' : '2px solid transparent',
                  background: isCurrent ? '#EFF6FF' : '#FFFFFF',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: isCurrent ? '#2563EB' : isCompleted ? '#DCFCE7' : '#F1F5F9',
                    color: isCurrent ? '#FFFFFF' : isCompleted ? '#16A34A' : '#64748B',
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={13} /> : s.num}
                </span>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Body Content */}
        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1, background: '#F8FAFC' }}>
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                borderRadius: '10px',
                fontSize: '0.84rem',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: UPLOAD */}
          {currentStep === 'UPLOAD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Template Download Area */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                    Need the formatted module template?
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                    Download the pre-formatted CSV template with authoritative headers, field constraints &amp; sample Kenyan records.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#2563EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={15} />
                  <span>Download Template</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '18px 20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                  Select CSV or Excel (.xlsx) File to Import
                </label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onClear={() => {
                    setSelectedFile(null);
                    setParsedRows([]);
                    setValidation(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 2: MAP */}
          {currentStep === 'MAP' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <ColumnMapper
                  sourceHeaders={sourceHeaders}
                  fieldDefinitions={template.fields}
                  mapping={columnMapping}
                  onMappingChange={setColumnMapping}
                  sampleRow={parsedRows[0]}
                />
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & VALIDATE */}
          {currentStep === 'PREVIEW' && validation && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ValidationSummary summary={validation} />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings2 size={16} color="#2563EB" />
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>Conflict Resolution Strategy:</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {(
                    [
                      { id: 'SKIP_DUPLICATES', label: 'Skip Duplicates' },
                      { id: 'UPDATE_EXISTING', label: 'Update Existing' },
                      { id: 'ABORT_ON_ERROR', label: 'Abort on Any Error' },
                    ] as const
                  ).map((opt) => (
                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0F172A', fontWeight: 500 }}>
                      <input
                        type="radio"
                        name="conflict_strategy"
                        value={opt.id}
                        checked={conflictStrategy === opt.id}
                        onChange={() => setConflictStrategy(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {validation.errors.length > 0 && <RowErrorViewer errors={validation.errors} />}

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <ImportPreviewTable fields={template.fields} rows={validation.previewRows} />
              </div>
            </div>
          )}

          {/* STEP 4: RESULTS */}
          {currentStep === 'RESULTS' && commitResult && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '36px 20px',
                textAlign: 'center',
                gap: '16px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16A34A',
                }}
              >
                <CheckCircle2 size={34} />
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                  Import Completed Successfully!
                </h3>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: '#64748B' }}>
                  Processed <strong>{commitResult.total_rows}</strong> row(s) into the {template.title} database records.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '14px',
                  width: '100%',
                  maxWidth: '520px',
                  marginBlock: '8px',
                }}
              >
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748B' }}>INSERTED</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#16A34A', marginTop: '2px' }}>
                    {commitResult.inserted_count}
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748B' }}>UPDATED</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2563EB', marginTop: '2px' }}>
                    {commitResult.updated_count}
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748B' }}>SKIPPED / FAILED</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: commitResult.failed_count > 0 ? '#DC2626' : '#64748B', marginTop: '2px' }}>
                    {commitResult.skipped_count + commitResult.failed_count}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 28px',
                  minHeight: '42px',
                  marginTop: '12px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Close &amp; View Updated Records
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep !== 'RESULTS' && (
          <div
            style={{
              padding: '16px 24px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {currentStep === 'MAP' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('UPLOAD')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: '8px 14px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              {currentStep === 'PREVIEW' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('MAP')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: '8px 14px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={14} /> Back to Mapping
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  padding: '8px 16px',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              {currentStep === 'UPLOAD' && (
                <button
                  type="button"
                  disabled={!selectedFile || parsedRows.length === 0}
                  onClick={() => setCurrentStep('MAP')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: '8px 18px',
                    background: !selectedFile || parsedRows.length === 0 ? '#94A3B8' : '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: !selectedFile || parsedRows.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span>Continue to Mapping</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'MAP' && (
                <button
                  type="button"
                  onClick={handleProceedToPreview}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: '8px 18px',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <span>Preview &amp; Validate</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'PREVIEW' && (
                <button
                  type="button"
                  onClick={handleCommit}
                  disabled={isSubmitting || (conflictStrategy === 'ABORT_ON_ERROR' && (validation?.invalidRowsCount || 0) > 0)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: '8px 20px',
                    background: isSubmitting || (conflictStrategy === 'ABORT_ON_ERROR' && (validation?.invalidRowsCount || 0) > 0) ? '#94A3B8' : '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      <span>Committing Records...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Commit {validation?.validRowsCount || 0} Records</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
