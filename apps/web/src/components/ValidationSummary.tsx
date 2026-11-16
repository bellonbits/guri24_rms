import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Copy } from 'lucide-react';
import { ValidationSummary as IValidationSummary } from '../lib/importEngine';

interface ValidationSummaryProps {
  summary: IValidationSummary;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({ summary }) => {
  const { totalRows, validRowsCount, invalidRowsCount, duplicateRowsCount } = summary;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBlock: '12px 16px',
      }}
    >
      {/* Total Rows */}
      <div
        style={{
          background: 'var(--bg-surface, #111c2e)',
          border: '1px solid var(--border-subtle, #243656)',
          borderRadius: '10px',
          padding: '12px 14px',
        }}
      >
        <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
          Total Rows
        </div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
          {totalRows.toLocaleString()}
        </div>
      </div>

      {/* Valid Rows */}
      <div
        style={{
          background: 'var(--bg-surface, #111c2e)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '10px',
          padding: '12px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#4ade80', textTransform: 'uppercase', fontWeight: 600 }}>
          <CheckCircle2 size={13} />
          <span>Valid Rows</span>
        </div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#4ade80', marginTop: '2px' }}>
          {validRowsCount.toLocaleString()}
        </div>
      </div>

      {/* Invalid Rows */}
      <div
        style={{
          background: 'var(--bg-surface, #111c2e)',
          border: `1px solid ${invalidRowsCount > 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle, #243656)'}`,
          borderRadius: '10px',
          padding: '12px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: invalidRowsCount > 0 ? '#f87171' : '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
          <XCircle size={13} />
          <span>Invalid Rows</span>
        </div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: invalidRowsCount > 0 ? '#f87171' : '#94a3b8', marginTop: '2px' }}>
          {invalidRowsCount.toLocaleString()}
        </div>
      </div>

      {/* Duplicate Rows */}
      <div
        style={{
          background: 'var(--bg-surface, #111c2e)',
          border: `1px solid ${duplicateRowsCount > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-subtle, #243656)'}`,
          borderRadius: '10px',
          padding: '12px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: duplicateRowsCount > 0 ? '#fbbf24' : '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
          <Copy size={13} />
          <span>Duplicates</span>
        </div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: duplicateRowsCount > 0 ? '#fbbf24' : '#94a3b8', marginTop: '2px' }}>
          {duplicateRowsCount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
