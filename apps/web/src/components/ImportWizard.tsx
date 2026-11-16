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
      // Map rows using established column mapping
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
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          background: '#0b1320',
          border: '1px solid #243656',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: '#111c2e',
            borderBottom: '1px solid #243656',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet size={20} color="#38bdf8" />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Bulk Import Wizard — {template.title}
              </h2>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Step-by-step import with column mapping, deep validation, and conflict controls.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #1e293b',
            background: '#0b1320',
            fontSize: '0.76rem',
            fontWeight: 600,
          }}
        >
          {[
            { id: 'UPLOAD', label: '1. Upload File' },
            { id: 'MAP', label: '2. Column Mapping' },
            { id: 'PREVIEW', label: '3. Preview & Validate' },
            { id: 'RESULTS', label: '4. Results' },
          ].map((s, idx) => (
            <div
              key={s.id}
              style={{
                flex: 1,
                padding: '10px 12px',
                textAlign: 'center',
                color: currentStep === s.id ? '#38bdf8' : idx < ['UPLOAD', 'MAP', 'PREVIEW', 'RESULTS'].indexOf(currentStep) ? '#4ade80' : '#64748b',
                borderBottom: currentStep === s.id ? '2px solid #38bdf8' : 'none',
                background: currentStep === s.id ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
              }}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#f87171',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: UPLOAD */}
          {currentStep === 'UPLOAD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#111c2e',
                  border: '1px solid #243656',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>
                    Need the formatted template?
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                    Download the official CSV template with pre-filled headers and sample Kenyan data.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-outline"
                  onClick={handleDownloadTemplate}
                  style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Download CSV Template</span>
                </button>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                  Select File to Import
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
              <ColumnMapper
                sourceHeaders={sourceHeaders}
                fieldDefinitions={template.fields}
                mapping={columnMapping}
                onMappingChange={setColumnMapping}
                sampleRow={parsedRows[0]}
              />
            </div>
          )}

          {/* STEP 3: PREVIEW */}
          {currentStep === 'PREVIEW' && validation && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ValidationSummary summary={validation} />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#111c2e',
                  border: '1px solid #243656',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings2 size={16} color="#38bdf8" />
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>Conflict Resolution Strategy:</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {(
                    [
                      { id: 'SKIP_DUPLICATES', label: 'Skip Duplicates' },
                      { id: 'UPDATE_EXISTING', label: 'Update Existing' },
                      { id: 'ABORT_ON_ERROR', label: 'Abort on Any Error' },
                    ] as const
                  ).map((opt) => (
                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#cbd5e1' }}>
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

              <RowErrorViewer errors={validation.errors} />

              <ImportPreviewTable fields={template.fields} rows={validation.previewRows} />
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
                padding: '32px 16px',
                textAlign: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4ade80',
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>
                  Import Completed Successfully!
                </h3>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
                  Processed <strong>{commitResult.total_rows}</strong> row(s) into the {template.title} registry.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  width: '100%',
                  maxWidth: '480px',
                  marginBlock: '8px',
                }}
              >
                <div style={{ background: '#111c2e', padding: '12px', borderRadius: '8px', border: '1px solid #243656' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>INSERTED</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80' }}>
                    {commitResult.inserted_count}
                  </div>
                </div>
                <div style={{ background: '#111c2e', padding: '12px', borderRadius: '8px', border: '1px solid #243656' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>UPDATED</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
                    {commitResult.updated_count}
                  </div>
                </div>
                <div style={{ background: '#111c2e', padding: '12px', borderRadius: '8px', border: '1px solid #243656' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>SKIPPED / FAILED</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: commitResult.failed_count > 0 ? '#f87171' : '#94a3b8' }}>
                    {commitResult.skipped_count + commitResult.failed_count}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-dark"
                onClick={onClose}
                style={{ padding: '8px 24px', minBlockSize: '38px', marginTop: '12px' }}
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
              padding: '14px 20px',
              background: '#111c2e',
              borderTop: '1px solid #243656',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {currentStep === 'MAP' && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setCurrentStep('UPLOAD')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              {currentStep === 'PREVIEW' && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setCurrentStep('MAP')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  <ArrowLeft size={14} /> Back to Mapping
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-outline" onClick={onClose} style={{ fontSize: '0.8rem' }}>
                Cancel
              </button>

              {currentStep === 'UPLOAD' && (
                <button
                  type="button"
                  className="btn-dark"
                  disabled={!selectedFile || parsedRows.length === 0}
                  onClick={() => setCurrentStep('MAP')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  <span>Continue to Mapping</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'MAP' && (
                <button
                  type="button"
                  className="btn-dark"
                  onClick={handleProceedToPreview}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  <span>Preview &amp; Validate</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'PREVIEW' && (
                <button
                  type="button"
                  className="btn-dark"
                  onClick={handleCommit}
                  disabled={isSubmitting || (conflictStrategy === 'ABORT_ON_ERROR' && (validation?.invalidRowsCount || 0) > 0)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      <span>Committing Records...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
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
