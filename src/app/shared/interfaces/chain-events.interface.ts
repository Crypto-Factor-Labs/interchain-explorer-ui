export type ChainEventStatus =
  | 'pending'
  | 'in_progress'
  | 'success'
  | 'failed'
  | 'revert'
  | 'skipped';

export interface ChainEventDto {
  name: string;
  status: ChainEventStatus;
  startedAt?: string;   // ISO
  finishedAt?: string;  // ISO
}

// Tuple of exactly 4 items
export type ChainEvents = [ChainEventDto, ChainEventDto, ChainEventDto, ChainEventDto];
