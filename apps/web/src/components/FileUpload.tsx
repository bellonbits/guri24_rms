import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSizeMb?: number;
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onClear?: () => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = '.csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg',
  maxSizeMb = 15,
  onFileSelect,
  selectedFile,
  onClear,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const sizeMb = file.size / (1024 * 1024);

    if (sizeMb > maxSizeMb) {
      setError(`File size (${sizeMb.toFixed(1)}MB) exceeds maximum limit of ${maxSizeMb}MB.`);
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? '#2563EB' : '#CBD5E1'}`,
            borderRadius: '12px',
            padding: '28px 20px',
            textAlign: 'center',
            background: dragActive ? '#EFF6FF' : '#F8FAFC',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#2563EB',
            }}
          >
            <Upload size={22} />
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A' }}>
            Drag and drop your spreadsheet or document
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
            Supports CSV, Excel (.xlsx, .xls), PDF scans, and image documents (up to {maxSizeMb}MB)
          </div>
          <button
            type="button"
            style={{
              marginTop: '14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '7px 16px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              color: '#0F172A',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
            disabled={disabled}
          >
            Browse Local Files
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') ? (
              <FileSpreadsheet size={24} color="#16A34A" />
            ) : (
              <FileText size={24} color="#2563EB" />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for preview &amp; column mapping
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#DCFCE7',
                border: '1px solid #BBF7D0',
                color: '#16A34A',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} /> Loaded
            </span>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                title="Remove file"
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#DC2626',
            fontSize: '0.8rem',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            padding: '9px 14px',
            borderRadius: '8px',
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
