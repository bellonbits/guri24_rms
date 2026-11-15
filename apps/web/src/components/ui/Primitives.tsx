import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ModalDialog({ open, onClose, title, children }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close('');
    }
  }, [open]);

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
  headers.forEach((h, idx) => {
    labelVariables[`--label-${idx + 1}`] = `"${h.replace(/"/g, '')}"`;
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

/**
 * Clean architectural illustration for the Featured Property / Unit card
 */
export function FeaturedPropertyIllustration() {
  return (
    <div className="featured-stage" aria-hidden="true">
      <svg
        viewBox="0 0 320 135"
        width="100%"
        height="125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft ground shadow */}
        <ellipse cx="160" cy="122" rx="126" ry="8" fill="#CBD5E1" fillOpacity="0.55" />
        {/* Left Wing */}
        <rect x="44" y="38" width="68" height="82" rx="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Center Main Luxury Tower */}
        <rect x="104" y="16" width="112" height="104" rx="8" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
        {/* Right Wing */}
        <rect x="208" y="44" width="68" height="76" rx="6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Roofline Accent */}
        <rect x="98" y="12" width="124" height="7" rx="3.5" fill="#1E293B" />
        {/* Panoramic Glass Balconies on Center Tower */}
        {[28, 50, 72].map((y) => (
          <g key={y}>
            <rect x="116" y={y} width="38" height="14" rx="3" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.2" />
            <rect x="164" y={y} width="38" height="14" rx="3" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.2" />
            <line x1="114" y1={y + 14} x2="204" y2={y + 14} stroke="#64748B" strokeWidth="1.5" />
          </g>
        ))}
        {/* Left & Right Wing Windows */}
        {[50, 70, 90].map((y) => (
          <g key={`w-${y}`}>
            <rect x="56" y={y} width="16" height="11" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.2" />
            <rect x="78" y={y} width="16" height="11" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.2" />
            <rect x="224" y={y + 4} width="16" height="10" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.2" />
            <rect x="246" y={y + 4} width="16" height="10" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.2" />
          </g>
        ))}
        {/* Grand Entrance Canopy */}
        <rect x="136" y="96" width="48" height="24" rx="4" fill="#1E293B" />
        <rect x="146" y="101" width="28" height="19" rx="2" fill="#38BDF8" fillOpacity="0.35" />
        {/* Palm / Landscaping Accents */}
        <circle cx="38" cy="106" r="10" fill="#10B981" fillOpacity="0.25" />
        <circle cx="38" cy="106" r="5" fill="#059669" />
        <circle cx="282" cy="108" r="9" fill="#10B981" fillOpacity="0.25" />
        <circle cx="282" cy="108" r="4.5" fill="#059669" />
      </svg>
    </div>
  );
}
