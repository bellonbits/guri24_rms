import React, { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface ModalDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function ModalDialog({ open, isOpen, onClose, title, children, maxWidth }: ModalDialogProps) {
  const isDialogActive = Boolean(open ?? isOpen);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDialogActive && !dialog.open) {
      dialog.showModal();
    } else if (!isDialogActive && dialog.open) {
      dialog.close('');
    }
  }, [isDialogActive]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="rms-dialog"
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
    >
      <div className="dialog-inner">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBlockEnd: '12px',
            borderBlockEnd: '1px solid var(--border-subtle)',
          }}
        >
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="btn-icon-only"
            onClick={() => dialogRef.current?.close('cancel')}
            aria-label={`Close ${title} dialog`}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

interface ResponsiveTableProps {
  caption: string;
  headers: string[];
  children: React.ReactNode;
}

export function ResponsiveTable({ caption, headers, children }: ResponsiveTableProps) {
  const captionId = useId();
  const labelVariables: Record<string, string> = {};
  (headers || []).forEach((h, idx) => {
    labelVariables[`--label-${idx + 1}`] = `"${(h || '').replace(/"/g, '')}"`;
  });

  return (
    <div
      tabIndex={0}
      role="region"
      aria-labelledby={captionId}
      className="table-wrapper"
    >
      <table className="rms-table" style={labelVariables as React.CSSProperties}>
        <caption id={captionId} className="visually-hidden">
          {caption}
        </caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {React.Children.count(children) === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>No live records found</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Connected to live API. Add records to see them appear here.</span>
                </div>
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({
  status,
  tone = 'neutral',
}: {
  status: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  const mapClass =
    tone === 'success'
      ? 'badge-green'
      : tone === 'warning'
      ? 'badge-amber'
      : tone === 'danger'
      ? 'badge-red'
      : tone === 'info'
      ? 'badge-blue'
      : 'badge-neutral';

  const formatted = status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return <span className={`badge-pill ${mapClass}`}>{formatted}</span>;
}

/**
 * 24-bar mini vertical barcode sparkline matching the top KPI cards in the reference UI
 */
export function MiniSparkline({
  seed = 1,
  activeColor = '#2563eb',
  mutedColor = '#cbd5e1',
}: {
  seed?: number;
  activeColor?: string;
  mutedColor?: string;
}) {
  const heights = [
    42, 68, 50, 75, 44, 62, 86, 52, 70, 92, 58, 76, 48, 84, 64, 96, 55, 72, 60, 88, 50, 66, 45, 38,
  ];
  return (
    <div className="mini-bars" aria-hidden="true">
      {heights.map((baseH, idx) => {
        const h = ((baseH + seed * 11 + idx * 7) % 68) + 28;
        const isHighlighted = (idx + seed) % 3 !== 0 && idx < 19;
        return (
          <span
            key={idx}
            className="mini-bar"
            style={{
              height: `${h}%`,
              backgroundColor: isHighlighted ? activeColor : mutedColor,
              opacity: isHighlighted ? 0.85 : 0.45,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * 40-tick multi-color vertical progress bar matching the right-bottom Performance card
 */
export function SegmentedTickBar({
  segments,
}: {
  segments: { percentage: number; color: string }[];
}) {
  const totalTicks = 40;
  const ticks: string[] = [];
  segments.forEach((seg) => {
    const count = Math.max(1, Math.round((seg.percentage / 100) * totalTicks));
    for (let i = 0; i < count && ticks.length < totalTicks; i++) {
      ticks.push(seg.color);
    }
  });
  while (ticks.length < totalTicks) {
    ticks.push(segments[segments.length - 1]?.color ?? '#e2e8f0');
  }

  return (
    <div className="tick-bar-row" aria-hidden="true">
      {ticks.map((color, idx) => (
        <span
          key={idx}
          className="tick-segment"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

interface FeaturedPropertyPhotoProps {
  imageUrl?: string;
  altText?: string;
  propertyName?: string;
  isRepresentative?: boolean;
}

/**
 * High-quality architectural photograph for the Featured Property / Unit card
 * Supports responsive image formats (WebP, JPG), skeleton loading shimmer,
 * accessible alt text, and graceful SVG fallback.
 */
export function FeaturedPropertyIllustration({
  imageUrl = '/featured_nairobi_apartment.webp',
  altText = 'Contemporary residential apartment building in Nairobi, Kenya featuring modern balconies and tropical landscaping',
  propertyName,
  isRepresentative = true,
}: FeaturedPropertyPhotoProps = {}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="featured-stage"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '150px',
        maxHeight: '210px',
        aspectRatio: '16 / 9',
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBlock: '6px 10px',
      }}
    >
      {/* Loading Shimmer Skeleton */}
      {!imageLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s infinite',
          }}
          aria-hidden="true"
        />
      )}

      {/* High-quality architectural photo with WebP/JPG fallback */}
      {!hasError ? (
        <picture style={{ width: '100%', height: '100%' }}>
          <source srcSet="/featured_nairobi_apartment.webp" type="image/webp" />
          <img
            src={imageUrl || '/featured_nairobi_apartment.jpg'}
            alt={altText}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setHasError(true);
              setImageLoaded(true);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              display: 'block',
              transition: 'opacity 0.3s ease-in-out',
              opacity: imageLoaded ? 1 : 0,
            }}
          />
        </picture>
      ) : (
        /* Graceful SVG fallback in case image fails to load */
        <svg
          viewBox="0 0 320 135"
          width="100%"
          height="125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="160" cy="122" rx="126" ry="8" fill="#CBD5E1" fillOpacity="0.55" />
          <rect x="104" y="16" width="112" height="104" rx="8" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
          <rect x="98" y="12" width="124" height="7" rx="3.5" fill="#1E293B" />
        </svg>
      )}

      {/* Representative portfolio label badge */}
      {isRepresentative && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '6px',
            letterSpacing: '0.02em',
            pointerEvents: 'none',
          }}
        >
          Illustrative Portfolio Model
        </div>
      )}
    </div>
  );
}
