import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { FieldDefinition, PreviewRow } from '../lib/importEngine';

interface ImportPreviewTableProps {
  fields: FieldDefinition[];
  rows: PreviewRow[];
  maxDisplay?: number;
}

export const ImportPreviewTable: React.FC<ImportPreviewTableProps> = ({
  fields,
  rows,
  maxDisplay = 50,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'INVALID' | 'VALID'>('ALL');
  const filteredRows = rows.filter((r) => {
    if (filter === 'INVALID') return r.status === 'INVALID' || r.status === 'DUPLICATE';
    if (filter === 'VALID') return r.status === 'VALID';
    return true;
  });

  const displayedRows = filteredRows.slice(0, maxDisplay);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ALL', 'VALID', 'INVALID'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? '#2563eb' : '#f1f5f9',
                color: filter === tab ? '#ffffff' : '#475569',
                border: filter === tab ? '1px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab === 'ALL' ? `All (${rows.length})` : tab === 'VALID' ? `Valid (${rows.filter((r) => r.status === 'VALID').length})` : `Issues (${rows.filter((r) => r.status !== 'VALID').length})`}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Showing <strong>{displayedRows.length}</strong> of {filteredRows.length} rows
        </div>
      </div>

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          overflow: 'auto',
          maxHeight: '340px',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 2 }}>
              <th style={{ padding: '9px 10px', textAlign: 'center', width: '50px', color: '#64748b', fontWeight: 600 }}>#</th>
              <th style={{ padding: '9px 10px', textAlign: 'left', width: '90px', color: '#64748b', fontWeight: 600 }}>Status</th>
              {fields.map((f) => (
                <th key={f.key} style={{ padding: '9px 12px', textAlign: 'left', color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {f.label} {f.required && <span style={{ color: '#dc2626' }}>*</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 2} style={{ textAlign: 'center', padding: '28px', color: '#64748b' }}>
                  No rows matching the current filter.
                </td>
              </tr>
            ) : (
              displayedRows.map((row) => {
                const isInvalid = row.status === 'INVALID' || row.status === 'DUPLICATE';
                return (
                  <tr
                    key={row.rowIndex}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isInvalid ? '#fff5f5' : '#ffffff',
                    }}
                  >
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                      {row.rowIndex}
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      {row.status === 'VALID' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#dcfce7',
                            color: '#16a34a',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircle2 size={11} /> VALID
                        </span>
                      ) : row.status === 'DUPLICATE' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          <AlertTriangle size={11} /> DUP
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                          title={row.errors.join('; ')}
                        >
                          <AlertCircle size={11} /> INVALID
                        </span>
                      )}
                    </td>
                    {fields.map((f) => {
                      const val = row.fields[f.key];
                      const str = val !== undefined && val !== null ? String(val) : '';
                      const hasError = row.errors.some((e) => e.toLowerCase().includes(f.label.toLowerCase()) || e.toLowerCase().includes(f.key.toLowerCase()));

                      return (
                        <td
                          key={f.key}
                          style={{
                            padding: '8px 12px',
                            color: hasError ? '#dc2626' : str ? '#0f172a' : '#94a3b8',
                            background: hasError ? '#fef2f2' : 'transparent',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {str || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>empty</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
