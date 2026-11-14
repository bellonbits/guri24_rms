import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Modern Web Guidance `dialog` & `html`:
 * Uses the native `<dialog>` element opened via `.showModal()`.
 * No redundant `role="dialog"` or `aria-modal` attributes; resets `returnValue` on close.
 */
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
      // Reset returnValue so stale values do not leak across Esc dismissals
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBlockEnd: '1rem',
          marginBlockEnd: '1rem',
          borderBlockEnd: '1px solid var(--color-border-subtle)',
        }}
      >
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => dialogRef.current?.close('cancel')}
          aria-label={`Close ${title} dialog`}
        >
          <X size={18} aria-hidden="true" />
          <span>Close</span>
        </button>
      </div>
      {children}
    </dialog>
  );
}

interface ResponsiveTableProps {
  caption: string;
  headers: string[];
  children: React.ReactNode;
}

/**
 * Modern Web Guidance `responsive-table` & `accessibility`:
 * Scrollable `<div tabIndex={0} role="region" aria-labelledby={captionId} className="table-wrapper">`
 * with sticky headers and CSS variable labels for `< 600px` container query stacked layout.
 */
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
      <table className="data-table" style={labelVariables as React.CSSProperties}>
        <caption id={captionId}>{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function StatusBadge({
  status,
  tone = 'neutral',
}: {
  status: string;
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const symbol =
    tone === 'success'
      ? '●'
      : tone === 'warning'
      ? '▲'
      : tone === 'danger'
      ? '◆'
      : '•';
  return (
    <span className={`status-badge status-badge-${tone}`}>
      <span aria-hidden="true">{symbol}</span>
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
}
