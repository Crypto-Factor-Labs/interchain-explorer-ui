import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// import your standalone pipes
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { TruncateMiddlePipe } from '../../shared/pipes/truncate-middle.pipe';

export interface Tx {
  tx_hash: string;
  timestamp?: number | string | Date;
}

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

  @Input() trackByTxHash!: (i: number, tx: Tx) => any;

  @Output() togglePolling = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() openTx = new EventEmitter<Tx>();
}
