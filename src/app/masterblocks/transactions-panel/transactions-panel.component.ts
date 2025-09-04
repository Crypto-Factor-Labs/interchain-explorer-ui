import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AnimationEvent as NgAnimationEvent } from '@angular/animations';
import { SHARED_IMPORTS } from '../../shared/shared-standalone.js';
import { Tx, TxExecutionPart } from '../../shared/interfaces/transaction.interface.js';
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

  @Input() expandedTx: Record<string, boolean> = {};
  @Input() getChainImage!: (chainId: number | string) => string;
  @Input() trackByTxHash!: (index: number, tx: Tx) => any;

  @Output() togglePolling = new EventEmitter<void>();
  @Output() toggleExecutionParts = new EventEmitter<string>();
  @Output() openTx = new EventEmitter<Tx>();
  @Output() pageChange = new EventEmitter<number>();

  // trackBy for parts (fallback to index)
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
   * If backend provides `events[4]`, use that; otherwise infer from existing flags.
   */
  public getEpSteps(ep: TxExecutionPart): EpEventStatus[] {
    // Prefer explicit per-event statuses if backend provides them
    if (this.hasEvents(ep)) {
      return (ep as any).events.map((e: EpEvent) => e?.status ?? 'pending');
    }

    // Fallback with only known field(s)
    if (ep.isRevert === true) {
      // We know it failed, but not at which step → mark first as failed, rest pending
      return ['failed', 'pending', 'pending', 'pending'];
    }

    // Unknown granularity: show neutral pending for all
    //return ['pending', 'pending', 'pending', 'pending'];
    return ['success', 'in_progress', 'pending', 'pending'];
  }

  public getStepTitle(ep: TxExecutionPart, i: number, st: EpEventStatus): string {
    const has = this.hasEvents(ep);
    const name = has && (ep as any).events?.[i]?.name ? (ep as any).events[i]!.name : `Step ${i + 1}`;
    const ts = has ? (ep as any).events?.[i]?.timestamp : undefined;
    const when = ts ? ` — ${new Date(ts).toLocaleString()}` : '';
    return `${name}: ${st.replace('_', ' ')}${when}`;
  }
}
