import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AnimationEvent as NgAnimationEvent } from '@angular/animations';
import { SHARED_IMPORTS } from '../../shared/shared-standalone.js';
import { Transaction, Tx, TxExecutionPart } from '../../shared/interfaces/transaction.interface.js';
import { expandCollapse, staggerItems } from '../masterblocks.animations.js';
import { scrollExpandedIntoView } from '../../shared/utils/scroll-on-expand.js';

// --- Progress helper types (local, non-exported) ---
type EpEventStatus = 'pending' | 'in_progress' | 'success' | 'failed' | 'revert' | 'skipped';

interface EpEvent {
  name?: string;
  status: EpEventStatus;
  timestamp?: string; // ISO
  attempts?: number;
}

@Component({
  selector: 'app-transactions-panel',
  standalone: true,
  imports: [...SHARED_IMPORTS],  // Import shared modules, components, and pipes
  templateUrl: './transactions-panel.component.html',
  styleUrls: ['./transactions-panel.component.scss'],
  animations: [expandCollapse, staggerItems('.execution-part-row', 45, '180ms')]  // Set the stagger delay and duration here
})
export class TransactionsPanelComponent {
  @Input() transactions: Tx[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pollingActive = true;
  @Input() masterBlockHash: string | null = null;  // for filtering
  @Input() masterBlockHeight: string | null = null;

  @Input() expandedTx: Record<string, boolean> = {};
  @Input() getChainImage!: (chainId: number | string) => string;
  @Input() trackByTxHash!: (index: number, tx: Tx) => any;

  @Output() togglePolling = new EventEmitter<void>();
  @Output() toggleExecutionParts = new EventEmitter<string>();
  @Output() openTransaction = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  @Output() openExecPart = new EventEmitter<{ tx_hash: string, ep_hash: string }>();

  // trackBy for ExecutionParts (fallback to index)
  trackByPart = (i: number, ep: TxExecutionPart) => ep.id ?? i;

  @ViewChild('txListRef') listRef?: ElementRef<HTMLDivElement>;
  onExpandDone(event: NgAnimationEvent) {
    scrollExpandedIntoView(this.listRef, event);
  }

  // -------- Progress helpers (for EP 4-step micro-tracker) --------

  // Narrowing guard: EP has explicit per-event statuses from backend
  private hasEvents(ep: TxExecutionPart): ep is TxExecutionPart & { events: EpEvent[] } {
    return Array.isArray((ep as any).events) && (ep as any).events.length === 4;
  }

  /**
   * Returns the 4 statuses that drive the micro-tracker UI.
   */
  getEpSteps(ep: any) {
    return ep?.events?.map((e: any) => e.status) ?? ['pending', 'pending', 'pending', 'pending'];
  }

  getStepTitle(ep: TxExecutionPart, i: number): string {
    const e = ep.events?.[i];
    if (!e) return `Step ${i + 1}: pending`;
    const when = e.timestamp ? new Date(e.timestamp).toLocaleString() : '';
    const status = e.status.replace('_', ' ');
    return when ? `${e.name}: ${status} — ${when}` : `${e.name}: ${status}`;
  }
}
