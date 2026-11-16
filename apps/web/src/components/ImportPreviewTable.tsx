import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ALL', 'VALID', 'INVALID'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? '#2563eb' : '#1e293b',
                color: filter === tab ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab === 'ALL' ? `All (${rows.length})` : tab === 'VALID' ? `Valid (${rows.filter((r) => r.status === 'VALID').length})` : `Issues (${rows.filter((r) => r.status !== 'VALID').length})`}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
          Showing {displayedRows.length} of {filteredRows.length} rows
        </div>
      </div>

      <div
        style={{
          border: '1px solid var(--border-subtle, #243656)',
          borderRadius: '10px',
          overflow: 'auto',
          maxHeight: '320px',
          background: '#0b1320',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ background: '#111c2e', borderBottom: '1px solid #243656', position: 'sticky', top: 0, zIndex: 2 }}>
              <th style={{ padding: '8px 10px', textAlign: 'center', width: '50px', color: '#94a3b8' }}>#</th>
              <th style={{ padding: '8px 10px', textAlign: 'left', width: '90px', color: '#94a3b8' }}>Status</th>
              {fields.map((f) => (
                <th key={f.key} style={{ padding: '8px 12px', textAlign: 'left', color: '#f8fafc', whiteSpace: 'nowrap' }}>
                  {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 2} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
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
                      borderBottom: '1px solid #1e293b',
                      background: isInvalid ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
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
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#4ade80',
                            padding: '2px 6px',
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
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            padding: '2px 6px',
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
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            padding: '2px 6px',
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
                            color: hasError ? '#f87171' : str ? '#e2e8f0' : '#64748b',
                            background: hasError ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {str || <span style={{ fontStyle: 'italic', color: '#475569' }}>empty</span>}
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
