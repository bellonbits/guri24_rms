const kesFormatter = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatKes(amount: number): string {
  return kesFormatter.format(amount);
}

export function formatNairobiDate(isoDateOrTimestamp: string): string {
  try {
    const date = new Date(isoDateOrTimestamp);
    return new Intl.DateTimeFormat('en-KE', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  } catch {
    return isoDateOrTimestamp;
  }
}

export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if ((digits.startsWith('07') || digits.startsWith('01')) && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }
  if (digits.startsWith('254') && digits.length === 12) {
    return digits;
  }
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
    return `254${digits}`;
  }
  return null;
}

export function maskNationalId(rawId: string): string {
  const clean = rawId.trim();
  if (clean.length <= 4) {
    return `****${clean}`;
  }
  return `****${clean.slice(-4)}`;
}

/**
 * Modern Web Guidance `performance` & `schedule-tasks-by-priority`:
 * Yield to the main thread using `scheduler.yield()` when available to keep INP < 50ms.
 */
export async function yieldToMain(): Promise<void> {
  const g = globalThis as unknown as {
    scheduler?: { yield?: () => Promise<void> };
  };
  if (g.scheduler && typeof g.scheduler.yield === 'function') {
    await g.scheduler.yield();
    return;
  }
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}
