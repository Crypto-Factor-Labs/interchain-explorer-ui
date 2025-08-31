import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AnimationEvent as NgAnimationEvent } from '@angular/animations';
import { SHARED_IMPORTS } from '../../shared/shared-standalone.js';
import { Tx, TxExecutionPart } from '../../shared/interfaces/transaction.interface.js';
import { expandCollapse, staggerItems } from '../masterblocks.animations.js';
import { scrollExpandedIntoView } from '../../shared/utils/scroll-on-expand.js';

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
}