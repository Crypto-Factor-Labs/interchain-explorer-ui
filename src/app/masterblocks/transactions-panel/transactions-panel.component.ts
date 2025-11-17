import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AnimationEvent as NgAnimationEvent } from '@angular/animations';
import { SHARED_IMPORTS } from '../../shared/shared-standalone.js';
import { Transaction, Tx, TxExecutionPart } from '../../shared/interfaces/transaction.interface.js';
import { expandCollapse, staggerItems } from '../../shared/utils/animations.js';
import { scrollExpandedIntoView } from '../../shared/utils/scroll-on-expand.js';
import { getEvents } from '../../shared/utils/ep-progress';
import { Router } from '@angular/router';

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

  // Expose getEvents util for template
  public readonly getEvents = getEvents;

  constructor(private router: Router) { }

  // Handle click on Transaction hash
  onTxHashClick(event: MouseEvent, hash: string) {
    event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {  // Ctrl/Cmd → open dialog
      this.openTransaction.emit(hash);
    } else {                               // normal click → open full page
      this.router.navigate(['/tx', hash]);
    }
  }

  // Handle click on ExecutionPart hash
  onEpHashClick(event: MouseEvent, txHash: string, epHash: string) {
    event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {  // Ctrl/Cmd → open dialog
      this.openExecPart.emit({ tx_hash: txHash, ep_hash: epHash });
    } else {                               // normal click → open full page
      this.router.navigate(['/tx', txHash], { queryParams: { ep: epHash } });
    }
  }
}
