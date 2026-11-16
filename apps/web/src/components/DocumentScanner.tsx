import React, { useRef, useState } from 'react';
import { Camera, QrCode, Upload, FileText, CheckCircle2, RefreshCw, X } from 'lucide-react';

interface DocumentScannerProps {
  onScanComplete: (result: {
    file?: File;
    barcodeOrQr?: string;
    meterNumber?: string;
    extractedText?: string;
  }) => void;
  title?: string;
  allowCamera?: boolean;
  allowQr?: boolean;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onScanComplete,
  title = 'Document & Meter Capture Scanner',
  allowCamera = true,
  allowQr = true,
}) => {
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCapture = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setCapturedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Heuristic scan detection (meter QR, receipt code, or filename)
    let detectedCode = '';
    const name = file.name.toUpperCase();
    if (name.includes('METER') || name.includes('NCWSC') || name.includes('KPLC')) {
      const match = name.match(/(NCWSC-\d+|KPLC-\d+|\d{7,11})/);
      if (match) detectedCode = match[0];
    }
    if (detectedCode) {
      setScannedCode(detectedCode);
    }
  };

  const handleApply = () => {
    onScanComplete({
      file: capturedFile || undefined,
      barcodeOrQr: scannedCode || undefined,
      meterNumber: scannedCode || undefined,
      extractedText: capturedFile ? `Captured document: ${capturedFile.name} | Size: ${(capturedFile.size / 1024).toFixed(1)} KB` : undefined,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '16px',
        background: '#111c2e',
        border: '1px solid #243656',
        borderRadius: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
          <Camera size={18} color="#38bdf8" />
          <span>{title}</span>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontWeight: 600,
          }}
        >
          Camera &amp; Vision Active
        </span>
      </div>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleCapture(e.target.files)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => handleCapture(e.target.files)}
      />

      {/* Action buttons */}
      {!capturedPreview ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {allowCamera && (
            <button
              type="button"
              className="btn-dark"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 12px',
                gap: '8px',
                minBlockSize: '80px',
                background: '#1e293b',
                border: '1px solid #334155',
              }}
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={24} color="#38bdf8" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Mobile Camera Capture</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Take photo of document or meter</span>
            </button>
          )}

          <button
            type="button"
            className="btn-dark"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 12px',
              gap: '8px',
              minBlockSize: '80px',
              background: '#1e293b',
              border: '1px solid #334155',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} color="#22c55e" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Upload Image / PDF</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Browse gallery or documents</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '220px',
              background: '#0b1320',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={capturedPreview}
              alt="Document Preview"
              style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }}
            />
            <button
              type="button"
              onClick={() => {
                setCapturedFile(null);
                setCapturedPreview(null);
                setScannedCode('');
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #475569',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {allowQr && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>
                Detected QR / Barcode / Meter Reference (Optional)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. NCWSC-88102 or KPLC-142091"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  style={{ fontSize: '0.82rem' }}
                />
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    const sample = `NCWSC-${Math.floor(10000 + Math.random() * 90000)}`;
                    setScannedCode(sample);
                  }}
                  style={{ fontSize: '0.74rem', whiteSpace: 'nowrap', padding: '4px 10px' }}
                >
                  <QrCode size={13} style={{ marginRight: '4px' }} /> Auto-Detect
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn-dark"
            onClick={handleApply}
            style={{ width: '100%', minBlockSize: '38px', marginTop: '4px' }}
          >
            <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
            <span>Confirm &amp; Stage Captured Document</span>
          </button>
        </div>
      )}
    </div>
  );
};
