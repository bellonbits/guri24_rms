import React, { useState } from 'react';
import { Plus, Trash2, Clipboard, CheckCircle2, AlertCircle, Save, Download, X } from 'lucide-react';
import {
  FieldDefinition,
  ImportModuleKey,
  MODULE_TEMPLATES,
  parseClipboardTsv,
  validateImportRows,
  exportRowsToCsv,
} from '../lib/importEngine';
import type { Organization } from '../types';

export interface BulkEditableGridProps {
  moduleTitle?: string;
  fields?: FieldDefinition[];
  initialModule?: ImportModuleKey;
  currentOrg?: Organization;
  initialRows?: Record<string, string>[];
  onCommit?: (rows: Record<string, string>[]) => Promise<void> | void;
  onSave?: (rows: Record<string, string>[], modKey?: ImportModuleKey) => Promise<void> | void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const BulkEditableGrid: React.FC<BulkEditableGridProps> = ({
  moduleTitle,
  fields,
  initialModule,
  currentOrg,
  initialRows = [],
  onCommit,
  onSave,
  onCancel,
  onClose,
}) => {
  const resolvedTemplate = initialModule ? MODULE_TEMPLATES[initialModule] : undefined;
  const effectiveFields: FieldDefinition[] =
    fields && fields.length > 0 ? fields : (resolvedTemplate?.fields || []);
  const effectiveTitle =
    moduleTitle || resolvedTemplate?.title || (initialModule ? initialModule.toUpperCase() : 'Data Entry');

  const createEmptyRow = () => {
    const row: Record<string, string> = {};
    (effectiveFields || []).forEach((f) => {
      row[f.key] = '';
    });
    return row;
  };

  const [rows, setRows] = useState<Record<string, string>[]>(() => {
    if (initialRows && initialRows.length > 0) return initialRows;
    return [createEmptyRow(), createEmptyRow(), createEmptyRow()];
  });
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  const handleCellChange = (rowIndex: number, fieldKey: string, val: string) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[rowIndex] = { ...copy[rowIndex], [fieldKey]: val };
      return copy;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const handleDeleteSelected = () => {
    if (selectedIndices.length === 0) return;
    setRows((prev) => prev.filter((_, idx) => !selectedIndices.includes(idx)));
    setSelectedIndices([]);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setPasteNotice('Clipboard is empty.');
        return;
      }
      const fieldKeys = (effectiveFields || []).map((f) => f.key);
      const parsed = parseClipboardTsv(text, fieldKeys);
      if (parsed.length > 0) {
        setRows((prev) => {
          const hasData = prev.some((r) => Object.values(r).some((v) => (v || '').trim() !== ''));
          return hasData ? [...prev, ...parsed] : parsed;
        });
        setPasteNotice(`Successfully pasted ${parsed.length} row(s) from clipboard!`);
        setTimeout(() => setPasteNotice(null), 4000);
      } else {
        setPasteNotice('No valid tab-separated table data found in clipboard.');
        setTimeout(() => setPasteNotice(null), 4000);
      }
    } catch {
      setPasteNotice('Clipboard access denied. Please allow clipboard permissions.');
      setTimeout(() => setPasteNotice(null), 4000);
    }
  };

  // Instant validation
  const validCount = rows.filter((r) => {
    return (effectiveFields || []).every((f) => {
      if (f.required && !r[f.key]) return false;
      return true;
    });
  }).length;

  const handleSave = async () => {
    const nonEmptyRows = rows.filter((r) => Object.values(r).some((v) => (v || '').trim() !== ''));
    if (nonEmptyRows.length === 0) {
      alert('Please enter at least one non-empty row to submit.');
      return;
    }
    setIsCommitting(true);
    try {
      if (onSave) {
        await onSave(nonEmptyRows, initialModule);
      } else if (onCommit) {
        await onCommit(nonEmptyRows);
      }
      if (onClose) {
        onClose();
      }
    } finally {
      setIsCommitting(false);
    }
  };

  const gridContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '20px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: onClose ? '90vh' : 'auto',
        overflow: 'hidden',
        boxShadow: onClose ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
            Spreadsheet Bulk Data Entry — {effectiveTitle}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
            Type directly into cells or copy-paste (Ctrl+V / Cmd+V) multiple rows from Excel or Google Sheets.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={handlePasteFromClipboard}
            style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Paste tab-separated values from Excel/Sheets"
          >
            <Clipboard size={14} />
            <span>Paste from Excel</span>
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={handleAddRow}
            style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={14} />
            <span>Add Row</span>
          </button>
          {selectedIndices.length > 0 && (
            <button
              type="button"
              className="btn-outline"
              onClick={handleDeleteSelected}
              style={{ fontSize: '0.78rem', padding: '6px 14px', borderColor: '#ef4444', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={14} />
              <span>Delete ({selectedIndices.length})</span>
            </button>
          )}
          <button
            type="button"
            className="btn-outline"
            onClick={() => exportRowsToCsv(`${effectiveTitle.toLowerCase().replace(/\s+/g, '_')}_grid.csv`, rows)}
            style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Export current grid to CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '4px',
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Close modal"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {pasteNotice && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <CheckCircle2 size={14} />
          <span>{pasteNotice}</span>
        </div>
      )}

      {/* Spreadsheet Table */}
      <div
        style={{
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: onClose ? '55vh' : '400px',
          background: '#FFFFFF',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 3 }}>
              <th style={{ padding: '8px 6px', textAlign: 'center', width: '36px' }}>
                <input
                  type="checkbox"
                  checked={rows.length > 0 && selectedIndices.length === rows.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIndices(rows.map((_, i) => i));
                    } else {
                      setSelectedIndices([]);
                    }
                  }}
                />
              </th>
              <th style={{ padding: '8px 6px', textAlign: 'center', width: '36px', color: '#64748B' }}>#</th>
              {(effectiveFields || []).map((f) => (
                <th key={f.key} style={{ padding: '8px 10px', textAlign: 'left', color: '#334155', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {f.label} {f.required && <span style={{ color: '#DC2626' }}>*</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const isSelected = selectedIndices.includes(rIdx);

              return (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                  }}
                >
                  <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIndices((prev) => [...prev, rIdx]);
                        } else {
                          setSelectedIndices((prev) => prev.filter((i) => i !== rIdx));
                        }
                      }}
                    />
                  </td>
                  <td style={{ padding: '4px 6px', textAlign: 'center', color: '#64748B', fontSize: '0.74rem' }}>
                    {rIdx + 1}
                  </td>
                  {(effectiveFields || []).map((f) => {
                    const isMissing = f.required && !row[f.key];
                    return (
                      <td key={f.key} style={{ padding: '3px 4px' }}>
                        {f.allowedValues ? (
                          <select
                            value={row[f.key] || ''}
                            onChange={(e) => handleCellChange(rIdx, f.key, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '5px 8px',
                              background: isMissing ? '#FEF2F2' : '#FFFFFF',
                              border: `1px solid ${isMissing ? '#EF4444' : '#CBD5E1'}`,
                              borderRadius: '6px',
                              color: '#0F172A',
                              fontSize: '0.82rem',
                            }}
                          >
                            <option value="">-- Select --</option>
                            {f.allowedValues.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={row[f.key] || ''}
                            placeholder={f.example}
                            onChange={(e) => handleCellChange(rIdx, f.key, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '5px 8px',
                              background: isMissing ? '#FEF2F2' : '#FFFFFF',
                              border: `1px solid ${isMissing ? '#EF4444' : '#CBD5E1'}`,
                              borderRadius: '6px',
                              color: '#0F172A',
                              fontSize: '0.82rem',
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom status and commit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '6px' }}>
        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
          Total Rows: <strong style={{ color: '#0F172A' }}>{rows.length}</strong> • Ready to Save:{' '}
          <strong style={{ color: '#16A34A' }}>{validCount}</strong>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(onCancel || onClose) && (
            <button
              type="button"
              className="btn-outline"
              onClick={onClose || onCancel}
              style={{ fontSize: '0.82rem', padding: '6px 16px' }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="btn-dark"
            onClick={handleSave}
            disabled={isCommitting}
            style={{ fontSize: '0.82rem', padding: '6px 20px', minBlockSize: '36px' }}
          >
            <Save size={14} style={{ marginRight: '6px' }} />
            <span>{isCommitting ? 'Committing...' : `Commit ${rows.length} Records to RMS`}</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Spreadsheet Bulk Data Entry - ${effectiveTitle}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflowY: 'auto',
        }}
      >
        {gridContent}
      </div>
    );
  }

  return gridContent;
};
