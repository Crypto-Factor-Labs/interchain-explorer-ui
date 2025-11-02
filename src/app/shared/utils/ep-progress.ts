import { ChainEventDto, ChainEventStatus, ChainEvents } from '../../../app/shared/interfaces/chain-events.interface';

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
  events: ChainEvents | ChainEventDto[] | null | undefined,
  i: number
): string {
  const e = (events as ChainEventDto[] | undefined)?.[i];
  if (!e) return `Step ${i + 1}: pending`;
  const when = e.timestamp ? new Date(e.timestamp).toLocaleString() : '';
  const statusPretty = String(e.status).replace('_', ' ');
  return when ? `${e.name}: ${statusPretty} — ${when}` : `${e.name}: ${statusPretty}`;
}

/** Helper: safely extract events from any EP-like object. */
export function getEvents(obj: unknown): ChainEventDto[] | null {
  const ev = (obj as any)?.events;
  return Array.isArray(ev) ? (ev as ChainEventDto[]) : null;
}
