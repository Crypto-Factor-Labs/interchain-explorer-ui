import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { TruncateMiddlePipe } from '../../shared/pipes/truncate-middle.pipe';
import { Tx, TxExecutionPart } from '../../shared/interfaces/transaction.interface';

@Component({
  selector: 'app-transactions-panel',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, TruncateMiddlePipe],
  templateUrl: './transactions-panel.component.html',
  styleUrls: ['./transactions-panel.component.scss'],
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
  trackByPart = (i: number, ep: TxExecutionPart) => ep.hash ?? i;

  onExpandClick(hash: string): void {
    console.log('[child] emit', hash);
    this.toggleExecutionParts.emit(hash);
  }

}
