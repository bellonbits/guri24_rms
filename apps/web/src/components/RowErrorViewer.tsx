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
        gap: '8px',
        maxHeight: '260px',
        overflowY: 'auto',
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '10px',
        marginBlock: '10px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#f87171' }}>
        <AlertCircle size={15} />
        <span>Validation Issues Found ({errors.length})</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {errors.map((err, idx) => (
          <div
            key={idx}
            onClick={() => onSelectRow && onSelectRow(err.rowIndex)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '8px 10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: onSelectRow ? 'pointer' : 'default',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, color: '#f8fafc', background: '#334155', padding: '1px 6px', borderRadius: '4px' }}>
                  Row {err.rowIndex}
                </span>
                <span style={{ color: '#93c5fd', fontWeight: 600 }}>{err.field}</span>
                <span style={{ color: '#f87171' }}>• {err.errorMessage}</span>
              </div>
              {err.suggestion && (
                <div style={{ color: '#94a3b8', fontSize: '0.73rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HelpCircle size={12} color="#38bdf8" />
                  <span>Fix suggestion: {err.suggestion}</span>
                </div>
              )}
            </div>

            {onSelectRow && (
              <span style={{ color: '#38bdf8', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Inspect <ArrowRight size={11} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
