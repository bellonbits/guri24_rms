import React from 'react';
import { AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { RowError } from '../lib/importEngine';

interface RowErrorViewerProps {
  errors: RowError[];
  onSelectRow?: (rowIndex: number) => void;
}

export const RowErrorViewer: React.FC<RowErrorViewerProps> = ({ errors, onSelectRow }) => {
  if (errors.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '260px',
        overflowY: 'auto',
        padding: '14px 16px',
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '10px',
        marginBlock: '8px 12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 700, color: '#DC2626' }}>
        <AlertCircle size={16} />
        <span>Validation Issues Found ({errors.length})</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {errors.map((err, idx) => (
          <div
            key={idx}
            onClick={() => onSelectRow && onSelectRow(err.rowIndex)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 12px',
              background: '#FFFFFF',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              fontSize: '0.8rem',
              cursor: onSelectRow ? 'pointer' : 'default',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: '#0F172A', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>
                  Row {err.rowIndex}
                </span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>{err.field}</span>
                <span style={{ color: '#DC2626', fontWeight: 500 }}>• {err.errorMessage}</span>
              </div>
              {err.suggestion && (
                <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HelpCircle size={13} color="#2563EB" />
                  <span>Fix suggestion: {err.suggestion}</span>
                </div>
              )}
            </div>

            {onSelectRow && (
              <span style={{ color: '#2563EB', fontSize: '0.74rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                Inspect <ArrowRight size={12} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
