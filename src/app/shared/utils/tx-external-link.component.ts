import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { buildExternalExplorerUrl, getExplorerName } from '../utils/external-explorer.util';

@Component({
  selector: 'app-tx-external-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tx-external-link.component.html',
})
export class TxExternalLinkComponent {
  @Input({ required: true }) chainId!: number;
  @Input({ required: true }) txHash!: string;

  get url(): string | null { return buildExternalExplorerUrl(this.chainId, this.txHash); }
  get name(): string | null { return getExplorerName(this.chainId); }
}
