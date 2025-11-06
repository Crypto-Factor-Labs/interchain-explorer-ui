import { getExplorerName, buildExternalExplorerUrl } from '../../shared/utils/external-explorer.util';
import { ChainEventDto, ChainEventStatus, ChainEvents } from '../../shared/interfaces/chain-events.interface';

type ChainEventsLike = ReadonlyArray<ChainEventDto> | ChainEvents | null | undefined;

// Normalize events input to exactly 4 statuses (pad with 'pending' if fewer)
export function getSteps(
  events: ChainEvents | ChainEventDto[] | null | undefined,
  count = 4
): ChainEventStatus[] {
  const PENDING: ChainEventStatus = 'pending';
  const pending = Array.from({ length: count }, () => PENDING);

  if (!events || !events.length) return pending;

  const mapped = (events as ChainEventDto[])
    .slice(0, count)
    .map(e => (e?.status ?? PENDING) as ChainEventStatus);

  while (mapped.length < count) mapped.push(PENDING);
  return mapped;
}

// Human title for a specific event index
export function getStepTitle(
  chainId: number,
  events: ChainEventsLike,
  i: number
): string {
  const e = (events as ReadonlyArray<ChainEventDto> | undefined)?.[i];
  if (!e) return `Step ${i + 1}: pending`;

  const when = e.timestamp ? new Date(e.timestamp).toLocaleString() : '';
  const statusPretty = String(e.status).replace('_', ' ');
  const base = when ? `${e.name}: ${statusPretty} — ${when}` : `${e.name}: ${statusPretty}`;

  if (e.txHash) {
    const name = getExplorerName(chainId) ?? 'blockchain';
    return `${base}\nClick to open in ${name} explorer`;
  }
  return base;
}

export function getStepTxHash(events: ChainEventsLike, i: number): string | null {
  if (!events || i < 0 || i >= events.length) return null;
  const hash = events[i]?.txHash;
  return (typeof hash === 'string' && hash.trim().length > 0) ? hash : null;
}

export function hasStepTx(events: ChainEventsLike, i: number): boolean {
  return getStepTxHash(events, i) != null;
}

/** Helper: safely extract events from any EP-like object. */
export function getEvents(obj: unknown): ChainEventDto[] | null {
  const ev = (obj as any)?.events;
  return Array.isArray(ev) ? (ev as ChainEventDto[]) : null;
}
