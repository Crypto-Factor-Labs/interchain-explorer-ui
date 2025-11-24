import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared/shared-standalone';
import { getChainImage } from '../../shared/utils/common.utils';

export type TxListItem = {
  tx_hash: string;
  chainId: string;
  masterBlockHeight?: string | number | null;
  masterBlockTxIndex?: number | null;
  state?: number | null;
};

@Component({
  standalone: true,
  selector: 'app-txs-list-lite',
  imports: [CommonModule, ...SHARED_IMPORTS],
  templateUrl: './txs-list-lite.component.html',
  styleUrls: ['./txs-list-lite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TxsListLiteComponent {
  @Input() transactions: readonly TxListItem[] | null = [];
  @Output() openTransaction = new EventEmitter<string>();

  getChainImage = getChainImage;

  trackByTxHash = (_: number, tx: TxListItem) => tx.tx_hash;
}
