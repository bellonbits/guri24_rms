import React from 'react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { FieldDefinition } from '../lib/importEngine';

interface ColumnMapperProps {
  sourceHeaders: string[];
  fieldDefinitions: FieldDefinition[];
  mapping: Record<string, string>;
  onMappingChange: (mapping: Record<string, string>) => void;
  sampleRow?: Record<string, any>;
}

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  sourceHeaders,
  fieldDefinitions,
  mapping,
  onMappingChange,
  sampleRow,
}) => {
  const handleSelect = (fieldKey: string, sourceCol: string) => {
    onMappingChange({
      ...mapping,
      [fieldKey]: sourceCol,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
        Map columns from your uploaded file to the official Guri24 RMS fields. Columns with matching or recognized alias names have been auto-selected.
      </div>

      <div
        style={{
          border: '1px solid var(--border-subtle, #243656)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 40px 1.5fr 1.5fr',
            padding: '10px 14px',
            background: 'var(--bg-subtle, #0f172a)',
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--border-subtle, #243656)',
          }}
        >
          <div>Destination RMS Field</div>
          <div />
          <div>Uploaded File Column</div>
          <div>Sample Extracted Value</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '340px', overflowY: 'auto' }}>
          {fieldDefinitions.map((field) => {
            const mappedCol = mapping[field.key] || '';
            const sampleVal = sampleRow && mappedCol ? sampleRow[mappedCol] : null;
            const isAutoMapped = !!mappedCol;

            return (
              <div
                key={field.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 40px 1.5fr 1.5fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#111c2e',
                  borderBottom: '1px solid #1e293b',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{field.label}</span>
                    {field.required && (
                      <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }} title="Mandatory Field">
                        *
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Type: {field.dataType} {field.allowedValues ? `(${field.allowedValues.length} choices)` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <ArrowRight size={14} />
                </div>

                <div>
                  <select
                    className="form-control"
                    style={{ fontSize: '0.8rem', padding: '5px 8px', height: '32px' }}
                    value={mappedCol}
                    onChange={(e) => handleSelect(field.key, e.target.value)}
                  >
                    <option value="">-- Ignore this column --</option>
                    {sourceHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ fontSize: '0.78rem', color: sampleVal ? '#e2e8f0' : '#64748b', fontStyle: sampleVal ? 'normal' : 'italic' }}>
                  {sampleVal ? String(sampleVal).slice(0, 35) : '(No sample value)'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
