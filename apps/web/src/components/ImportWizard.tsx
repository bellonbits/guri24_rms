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
  Clipboard,
  Layers,
} from 'lucide-react';
import {
  ImportModuleKey,
  MODULE_TEMPLATES,
  generateTemplateCsv,
  parseCsv,
  parseClipboardTsv,
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
  onOpenBulkGrid?: (mod: ImportModuleKey) => void;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({
  module,
  onClose,
  onImportComplete,
  onOpenBulkGrid,
}) => {
  const [activeModule, setActiveModule] = useState<ImportModuleKey>(module);
  const template = MODULE_TEMPLATES[activeModule] || MODULE_TEMPLATES['units'];
  const [currentStep, setCurrentStep] = useState<Step>('UPLOAD');
  const [uploadMode, setUploadMode] = useState<'FILE' | 'CLIPBOARD'>('FILE');
  const [clipboardText, setClipboardText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [conflictStrategy, setConflictStrategy] = useState<ConflictStrategy>('SKIP_DUPLICATES');
  const [validation, setValidation] = useState<IValidationSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitResult, setCommitResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Switch active module
  const handleModuleChange = (newMod: ImportModuleKey) => {
    setActiveModule(newMod);
    setErrorMessage(null);
    if (parsedRows.length > 0) {
      const autoMap = autoMapColumns(sourceHeaders, newMod);
      setColumnMapping(autoMap);
      const val = validateImportRows(newMod, parsedRows, autoMap);
      setValidation(val);
    }
  };

  // 1. Download template
  const handleDownloadTemplate = () => {
    const csv = generateTemplateCsv(activeModule);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${activeModule}.csv`);
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
      const autoMap = autoMapColumns(headers, activeModule);
      setColumnMapping(autoMap);

      // Pre-validate
      const val = validateImportRows(activeModule, rows, autoMap);
      setValidation(val);

      setCurrentStep('MAP');
    } catch (err) {
      setErrorMessage(`Failed to read file: ${(err as Error).message}`);
    }
  };

  // Parse clipboard pasted text
  const handleParseClipboard = () => {
    if (!clipboardText.trim()) {
      setErrorMessage('Please paste rows from your Excel sheet or CSV table first.');
      return;
    }
    setErrorMessage(null);
    try {
      let rows: Record<string, any>[] = [];
      if (clipboardText.includes('\t')) {
        rows = parseClipboardTsv(clipboardText);
      } else {
        rows = parseCsv(clipboardText);
      }
      if (rows.length === 0) {
        setErrorMessage('Uploaded or pasted data contains no recognizable tabular rows.');
        return;
      }
      const headers = Object.keys(rows[0]);
      setSourceHeaders(headers);
      setParsedRows(rows);
      const autoMap = autoMapColumns(headers, activeModule);
      setColumnMapping(autoMap);
      const val = validateImportRows(activeModule, rows, autoMap);
      setValidation(val);
      setCurrentStep('MAP');
    } catch (err) {
      setErrorMessage(`Failed to parse table: ${(err as Error).message}`);
    }
  };

  // 3. Move from Mapping to Preview
  const handleProceedToPreview = () => {
    const val = validateImportRows(activeModule, parsedRows, columnMapping);
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
        module: activeModule,
        rows: mappedRows,
        conflict_strategy: conflictStrategy,
        file_name: selectedFile?.name || `clipboard_${activeModule}_data.tsv`,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 id="import-wizard-title" style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: '#0F172A' }}>
                  Bulk Import Wizard
                </h2>
                <select
                  value={activeModule}
                  onChange={(e) => handleModuleChange(e.target.value as ImportModuleKey)}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    background: '#FFFFFF',
                    border: '1.5px solid #2563EB',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  aria-label="Target RMS Module"
                >
                  {Object.entries(MODULE_TEMPLATES).map(([key, t]) => (
                    <option key={key} value={key}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                Acquire data via CSV/XLSX file or Excel clipboard paste with automatic column mapping &amp; validation.
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

              {/* Input Method Switcher Tabs */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setUploadMode('FILE')}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: uploadMode === 'FILE' ? '#2563EB' : '#FFFFFF',
                    color: uploadMode === 'FILE' ? '#FFFFFF' : '#475569',
                    border: uploadMode === 'FILE' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Upload size={14} />
                  <span>Upload CSV / Excel File (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('CLIPBOARD')}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: uploadMode === 'CLIPBOARD' ? '#2563EB' : '#FFFFFF',
                    color: uploadMode === 'CLIPBOARD' ? '#FFFFFF' : '#475569',
                    border: uploadMode === 'CLIPBOARD' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Clipboard size={14} />
                  <span>Paste from Excel / Sheets</span>
                </button>
                {onOpenBulkGrid && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenBulkGrid(activeModule);
                    }}
                    style={{
                      marginLeft: 'auto',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#F1F5F9',
                      color: '#0F172A',
                      border: '1px solid #CBD5E1',
                    }}
                    title="Open spreadsheet inline grid for manual entry and Excel paste"
                  >
                    <Layers size={14} color="#2563EB" />
                    <span>Open Spreadsheet Grid</span>
                  </button>
                )}
              </div>

              {/* Upload Dropzone / Paste Area */}
              {uploadMode === 'FILE' ? (
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
                    Select CSV or Excel (.xlsx) File for {template.title}
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
              ) : (
                <div
                  style={{
                    background: '#FFFFFF',
                    padding: '18px 20px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                      Paste Cells from Excel or Google Sheets (Ctrl+V / Cmd+V)
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Auto-detects Tab-Separated (TSV) or Comma-Separated (CSV) rows
                    </span>
                  </div>
                  <textarea
                    value={clipboardText}
                    onChange={(e) => setClipboardText(e.target.value)}
                    placeholder={`Copy cells from Excel or Google Sheets (including headers) and paste here...\nExample:\nunit_number\trent_amount\tbedrooms\nA101\t25000\t2\nA102\t32000\t3`}
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '0.82rem',
                      fontFamily: 'monospace',
                      color: '#0F172A',
                      background: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '8px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setClipboardText('')}
                      style={{
                        padding: '6px 14px',
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        color: '#64748B',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handleParseClipboard}
                      style={{
                        padding: '7px 20px',
                        background: '#2563EB',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Parse Table &amp; Proceed to Mapping</span>
                    </button>
                  </div>
                </div>
              )}
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
