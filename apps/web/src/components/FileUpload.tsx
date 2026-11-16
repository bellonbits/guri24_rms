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
            border: `2px dashed ${dragActive ? '#2563eb' : 'var(--border-subtle, #334155)'}`,
            borderRadius: '12px',
            padding: '28px 20px',
            textAlign: 'center',
            background: dragActive ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-subtle, #0f172a)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#38bdf8',
            }}
          >
            <Upload size={22} />
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main, #f8fafc)' }}>
            Drag and drop your spreadsheet or document
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', marginTop: '4px' }}>
            Supports CSV, Excel (.xlsx, .xls), PDF scans, and image documents (up to {maxSizeMb}MB)
          </div>
          <button
            type="button"
            className="btn-outline"
            style={{ marginTop: '14px', fontSize: '0.78rem', padding: '6px 14px' }}
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
            padding: '12px 16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') ? (
              <FileSpreadsheet size={22} color="#22c55e" />
            ) : (
              <FileText size={22} color="#38bdf8" />
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#f8fafc' }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for preview & column mapping
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={12} /> Loaded
            </span>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                title="Remove file"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
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
            gap: '6px',
            color: '#f87171',
            fontSize: '0.78rem',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
          }}
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
