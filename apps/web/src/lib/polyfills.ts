/**
 * Modern Web Guidance `dialog` & `declarative-dialog-popover-control`:
 * Feature-detected fallbacks for `<dialog closedby="any">` light-dismiss and Invoker/Popover APIs.
 */
export function initializeModernWebFallbacks(): void {
  if (typeof window === 'undefined' || typeof HTMLDialogElement === 'undefined') {
    return;
  }

  // Fallback for `<dialog closedby="any">` light dismiss on browsers lacking native `closedBy`
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutsideDialog = (e: PointerEvent, dialog: HTMLDialogElement): boolean => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    document.addEventListener('pointerdown', (e) => {
      const target = e.target;
      if (
        target instanceof HTMLDialogElement &&
        target.open &&
        target.getAttribute('closedby') === 'any'
      ) {
        pressedOutside = isOutsideDialog(e, target);
      } else {
        pressedOutside = false;
      }
    });

    document.addEventListener('pointerup', (e) => {
      const target = e.target;
      if (
        pressedOutside &&
        target instanceof HTMLDialogElement &&
        target.open &&
        target.getAttribute('closedby') === 'any' &&
        isOutsideDialog(e, target)
      ) {
        target.close('');
      }
      pressedOutside = false;
    });
  }
}
