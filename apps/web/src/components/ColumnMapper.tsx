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
      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
        Map columns from your uploaded file to the official Guri24 RMS fields. Columns with recognized aliases have been automatically matched.
      </div>

      <div
        style={{
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#FFFFFF',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 40px 1.5fr 1.5fr',
            padding: '12px 16px',
            background: '#F1F5F9',
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <div>Destination RMS Field</div>
          <div />
          <div>Uploaded File Column</div>
          <div>Sample Extracted Value</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '360px', overflowY: 'auto' }}>
          {fieldDefinitions.map((field, idx) => {
            const mappedCol = mapping[field.key] || '';
            const sampleVal = sampleRow && mappedCol ? sampleRow[mappedCol] : null;

            return (
              <div
                key={field.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 40px 1.5fr 1.5fr',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  fontSize: '0.84rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{field.label}</span>
                    {field.required && (
                      <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.8rem' }} title="Mandatory Field">
                        *
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                    Type: <code style={{ background: '#F1F5F9', padding: '1px 4px', borderRadius: '4px' }}>{field.dataType}</code>{' '}
                    {field.allowedValues ? `(${field.allowedValues.length} choices)` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  <ArrowRight size={15} />
                </div>

                <div>
                  <select
                    style={{
                      width: '100%',
                      fontSize: '0.82rem',
                      padding: '6px 10px',
                      height: '34px',
                      borderRadius: '6px',
                      border: mappedCol ? '1px solid #2563EB' : '1px solid #CBD5E1',
                      background: mappedCol ? '#EFF6FF' : '#FFFFFF',
                      color: '#0F172A',
                      fontWeight: mappedCol ? 600 : 400,
                    }}
                    value={mappedCol}
                    onChange={(e) => handleSelect(field.key, e.target.value)}
                  >
                    <option value="">— Do Not Map / Skip —</option>
                    {sourceHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sampleVal !== null && sampleVal !== undefined && sampleVal !== '' ? (
                    <span
                      style={{
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        color: '#0F172A',
                        fontFamily: 'monospace',
                      }}
                      title={String(sampleVal)}
                    >
                      {String(sampleVal)}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontStyle: 'italic' }}>
                      {mappedCol ? '(empty in row 1)' : 'Not mapped'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
