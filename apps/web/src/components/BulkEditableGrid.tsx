import React, { useState } from 'react';
import { Plus, Trash2, Clipboard, CheckCircle2, AlertCircle, Save, Download } from 'lucide-react';
import { FieldDefinition, parseClipboardTsv, validateImportRows, exportRowsToCsv } from '../lib/importEngine';

interface BulkEditableGridProps {
  moduleTitle: string;
  fields: FieldDefinition[];
  initialRows?: Record<string, string>[];
  onCommit: (rows: Record<string, string>[]) => Promise<void> | void;
  onCancel?: () => void;
}

export const BulkEditableGrid: React.FC<BulkEditableGridProps> = ({
  moduleTitle,
  fields,
  initialRows = [],
  onCommit,
  onCancel,
}) => {
  const createEmptyRow = () => {
    const row: Record<string, string> = {};
    fields.forEach((f) => {
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
      const fieldKeys = fields.map((f) => f.key);
      const parsed = parseClipboardTsv(text, fieldKeys);
      if (parsed.length > 0) {
        setRows((prev) => {
          // If all current rows are empty, replace them; otherwise append
          const hasData = prev.some((r) => Object.values(r).some((v) => v.trim() !== ''));
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
  const validation = validateImportRows('units', rows); // generic validation
  const validCount = rows.filter((r) => {
    return fields.every((f) => {
      if (f.required && !r[f.key]) return false;
      return true;
    });
  }).length;

  const handleSave = async () => {
    const nonEmptyRows = rows.filter((r) => Object.values(r).some((v) => v.trim() !== ''));
    if (nonEmptyRows.length === 0) {
      alert('Please enter at least one non-empty row to submit.');
      return;
    }
    setIsCommitting(true);
    try {
      await onCommit(nonEmptyRows);
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#0b1320',
        border: '1px solid #243656',
        borderRadius: '12px',
        padding: '16px',
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            Spreadsheet Bulk Data Entry — {moduleTitle}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
            Type directly into cells or copy-paste (Ctrl+V / Cmd+V) multiple rows from Excel or Google Sheets.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={handlePasteFromClipboard}
            style={{ fontSize: '0.76rem', padding: '5px 12px' }}
            title="Paste tab-separated values from Excel/Sheets"
          >
            <Clipboard size={14} style={{ marginRight: '4px' }} />
            <span>Paste from Excel</span>
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={handleAddRow}
            style={{ fontSize: '0.76rem', padding: '5px 12px' }}
          >
            <Plus size={14} style={{ marginRight: '4px' }} />
            <span>Add Row</span>
          </button>
          {selectedIndices.length > 0 && (
            <button
              type="button"
              className="btn-outline"
              onClick={handleDeleteSelected}
              style={{ fontSize: '0.76rem', padding: '5px 12px', borderColor: '#ef4444', color: '#f87171' }}
            >
              <Trash2 size={14} style={{ marginRight: '4px' }} />
              <span>Delete ({selectedIndices.length})</span>
            </button>
          )}
          <button
            type="button"
            className="btn-outline"
            onClick={() => exportRowsToCsv(`${moduleTitle.toLowerCase()}_grid.csv`, rows)}
            style={{ fontSize: '0.76rem', padding: '5px 12px' }}
            title="Export current grid to CSV"
          >
            <Download size={14} style={{ marginRight: '4px' }} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {pasteNotice && (
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
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
          border: '1px solid #243656',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: '380px',
          background: '#111c2e',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#0b1320', borderBottom: '1px solid #243656', position: 'sticky', top: 0, zIndex: 3 }}>
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
              <th style={{ padding: '8px 6px', textAlign: 'center', width: '36px', color: '#94a3b8' }}>#</th>
              {fields.map((f) => (
                <th key={f.key} style={{ padding: '8px 10px', textAlign: 'left', color: '#f8fafc', whiteSpace: 'nowrap' }}>
                  {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const isSelected = selectedIndices.includes(rIdx);
              const rowMissingRequired = fields.some((f) => f.required && !row[f.key]);

              return (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: '1px solid #1e293b',
                    background: isSelected ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
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
                  <td style={{ padding: '4px 6px', textAlign: 'center', color: '#64748b', fontSize: '0.74rem' }}>
                    {rIdx + 1}
                  </td>
                  {fields.map((f) => {
                    const isMissing = f.required && !row[f.key];
                    return (
                      <td key={f.key} style={{ padding: '2px 4px' }}>
                        {f.allowedValues ? (
                          <select
                            value={row[f.key] || ''}
                            onChange={(e) => handleCellChange(rIdx, f.key, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '5px 8px',
                              background: isMissing ? 'rgba(239, 68, 68, 0.1)' : '#0b1320',
                              border: `1px solid ${isMissing ? '#ef4444' : '#334155'}`,
                              borderRadius: '4px',
                              color: '#f8fafc',
                              fontSize: '0.8rem',
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
                              background: isMissing ? 'rgba(239, 68, 68, 0.1)' : '#0b1320',
                              border: `1px solid ${isMissing ? '#ef4444' : '#334155'}`,
                              borderRadius: '4px',
                              color: '#f8fafc',
                              fontSize: '0.8rem',
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
        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          Total Rows: <strong style={{ color: '#f8fafc' }}>{rows.length}</strong> • Ready to Save:{' '}
          <strong style={{ color: '#4ade80' }}>{validCount}</strong>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {onCancel && (
            <button
              type="button"
              className="btn-outline"
              onClick={onCancel}
              style={{ fontSize: '0.8rem', padding: '6px 16px' }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="btn-dark"
            onClick={handleSave}
            disabled={isCommitting}
            style={{ fontSize: '0.8rem', padding: '6px 20px', minBlockSize: '36px' }}
          >
            <Save size={14} style={{ marginRight: '6px' }} />
            <span>{isCommitting ? 'Committing...' : `Commit ${rows.length} Records to RMS`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
