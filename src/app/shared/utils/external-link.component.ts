import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { buildExternalTxUrl, buildExternalAddressUrl, buildExternalCustomUrl, getExplorerName, } from './external-explorer.util';

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
  @Input() custom?: string;   // Custom mode

  get url(): string | null {
    // Custom wins if provided
    if (this.custom) {
      return buildExternalCustomUrl(this.chainId, this.custom);
    }
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
