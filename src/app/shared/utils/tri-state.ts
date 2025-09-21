import { TriState } from '../interfaces/transaction.interface.js';

export const TRI_STATE = {
  PENDING: 0 as TriState,
  SUCCESS: 1 as TriState,
  FAILED: 2 as TriState,
};

const LABELS: Record<TriState, string> = {
  0: 'Pending',
  1: 'Success',
  2: 'Failed',
};

const CLASSES: Record<TriState, string> = {
  0: 'pending', // e.g. yellow chip
  1: 'ok',      // e.g. green chip
  2: 'bad',     // e.g. red chip
};

const ICONS: Record<TriState, string> = {
  0: 'fa-hourglass-half',
  1: 'fa-check-circle',
  2: 'fa-times-circle',
};

export function isPending(v?: TriState | null): boolean { return v === 0; }
export function isSuccess(v?: TriState | null): boolean { return v === 1; }
export function isFailed(v?: TriState | null): boolean { return v === 2; }

/** Safe label for UI. */
export function triStateLabel(v?: TriState | null): string {
  if (v === 0 || v === 1 || v === 2) return LABELS[v];
  return '—';
}

/** CSS modifier class used in chips/badges. */
export function triStateClass(v?: TriState | null): string {
  if (v === 0 || v === 1 || v === 2) return CLASSES[v];
  // default to 'pending' for unknown/null
  return CLASSES[0];
}

/** Optional: icon name (Font Awesome). */
export function triStateIcon(v?: TriState | null): string {
  if (v === 0 || v === 1 || v === 2) return ICONS[v];
  return ICONS[0];
}

/** Coerce unknown values (string/number/boolean) into a TriState. */
export function coerceTriState(val: unknown, fallback: TriState = TRI_STATE.PENDING): TriState {
  if (val === 0 || val === 1 || val === 2) return val;
  if (typeof val === 'string') {
    const n = Number(val.trim());
    if (n === 0 || n === 1 || n === 2) return n as TriState;
    if (val.toLowerCase() === 'pending') return 0;
    if (val.toLowerCase() === 'success') return 1;
    if (val.toLowerCase() === 'failed' || val.toLowerCase() === 'fail' || val.toLowerCase() === 'rollback') return 2;
  }
  if (typeof val === 'boolean') return (val ? 1 : 2) as TriState; // true→success, false→failed
  return fallback;
}
