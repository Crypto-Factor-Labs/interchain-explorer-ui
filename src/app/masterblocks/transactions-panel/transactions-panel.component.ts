import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { TruncateMiddlePipe } from '../../shared/pipes/truncate-middle.pipe';
import { Tx } from '../../shared/interfaces/transaction.interface';

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

  @Input() getChainImage!: (chainId: number) => string;
  @Input() trackByTxHash!: (i: number, tx: Tx) => any;

  @Output() togglePolling = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() openTx = new EventEmitter<Tx>();
}
