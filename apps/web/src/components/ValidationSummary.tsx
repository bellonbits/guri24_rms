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
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '14px',
        marginBlock: '10px 14px',
      }}
    >
      {/* Total Rows */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '14px 16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ fontSize: '0.74rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.03em' }}>
          Total Rows
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
          {totalRows.toLocaleString()}
        </div>
      </div>

      {/* Valid Rows */}
      <div
        style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '10px',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#16A34A', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.03em' }}>
          <CheckCircle2 size={14} />
          <span>Valid Rows</span>
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
          {validRowsCount.toLocaleString()}
        </div>
      </div>

      {/* Invalid Rows */}
      <div
        style={{
          background: invalidRowsCount > 0 ? '#FEF2F2' : '#FFFFFF',
          border: `1px solid ${invalidRowsCount > 0 ? '#FECACA' : '#E2E8F0'}`,
          borderRadius: '10px',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: invalidRowsCount > 0 ? '#DC2626' : '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.03em' }}>
          <XCircle size={14} />
          <span>Invalid Rows</span>
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: invalidRowsCount > 0 ? '#DC2626' : '#64748B', marginTop: '4px' }}>
          {invalidRowsCount.toLocaleString()}
        </div>
      </div>

      {/* Duplicate Rows */}
      <div
        style={{
          background: duplicateRowsCount > 0 ? '#FFFBEB' : '#FFFFFF',
          border: `1px solid ${duplicateRowsCount > 0 ? '#FDE68A' : '#E2E8F0'}`,
          borderRadius: '10px',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: duplicateRowsCount > 0 ? '#D97706' : '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.03em' }}>
          <Copy size={14} />
          <span>Duplicates</span>
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: duplicateRowsCount > 0 ? '#D97706' : '#64748B', marginTop: '4px' }}>
          {duplicateRowsCount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
