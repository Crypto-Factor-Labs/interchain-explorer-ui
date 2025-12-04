import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { buildExternalTxUrl, buildExternalAddressUrl, getExplorerName, } from './external-explorer.util';

@Component({
  selector: 'app-external-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-link.component.html',
})
export class ExternalLinkComponent {
  @Input({ required: true }) chainId!: number;

  // TX mode
  @Input() txHash?: string;   // Tx mode
  @Input() address?: string;  // Address mode

  // Tx wins if both are provided
  get url(): string | null {
    if (this.txHash) {
      return buildExternalTxUrl(this.chainId, this.txHash);
    }
    if (this.address) {
      return buildExternalAddressUrl(this.chainId, this.address);
    }
    return null;
  }

  get name(): string | null {
    return getExplorerName(this.chainId);
  }
}
