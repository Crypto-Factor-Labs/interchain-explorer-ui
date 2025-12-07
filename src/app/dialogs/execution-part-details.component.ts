import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import { ExecutionPart as CoreEP } from '../shared/interfaces/transaction.interface';
import { getEvents, getSteps, getStepTitle, hasStepTx, getStepTxHash } from '../shared/utils/ep-progress';
import { formatChainAddress, openExternalTx } from '../shared/utils/external-explorer.util';

// Allow optional isRevert without touching the core model
type EP = CoreEP & { isRevert?: boolean };

@Component({
  selector: 'app-execution-part-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ...SHARED_IMPORTS],
  templateUrl: './execution-part-details.component.html',
  styleUrls: ['./execution-part-details.component.scss'],
})
export class ExecutionPartDetailsComponent {
  @Input({ required: true }) ep!: EP;
  @Output() openTx = new EventEmitter<void>();
  @Output() openExternalTx = new EventEmitter<string>();
  @Output() openPartialBlock = new EventEmitter<string>();

  constructor(@Optional() private dialogRef?: MatDialogRef<unknown>) { }

  get isRevert() { return !!this.ep?.isRevert; }

  get inDialogMode(): boolean {
    return !!this.dialogRef; // true in Tx-dialog, false on Tx-page
  }

  onOpenPartialBlock(): void {
    if (!this.ep?.includedInPartialBlock) return;
    this.openPartialBlock.emit(this.ep.includedInPartialBlock);
  }

  // Functions to the progress of the Execution Parts
  readonly steps = getSteps;
  readonly stepTitle = getStepTitle;
  readonly getEvents = getEvents;
  readonly hasStepTx = hasStepTx;

  readonly onStepClick = (chainId: number, events: any, i: number, ev: Event) => {
    ev.stopPropagation();
    const txHash = getStepTxHash(events, i);
    if (txHash) openExternalTx(chainId, txHash);
  };

  get operatorAddressDisplay(): string {
    return formatChainAddress(this.ep?.chainId ?? null, this.ep?.operatorAddress ?? '');
  }

  // Signature toggle
  showFullSignature = false;

  toggleSignature(): void {
    this.showFullSignature = !this.showFullSignature;
  }
}