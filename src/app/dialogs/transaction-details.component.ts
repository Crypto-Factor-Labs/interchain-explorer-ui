import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { Transaction } from '../shared/interfaces/transaction.interface';
import { triStateLabel, triStateClass, triStateIcon } from '../shared/utils/tri-state';
import { formatChainAddress, getExplorerName } from '../shared/utils/external-explorer.util';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [RouterModule, ...SHARED_IMPORTS],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent {
  @Input({ required: true }) tx!: Transaction;
  @Input() showExecPartsCount = false;
  @Input() context: 'dialog' | 'page' = 'page';
  @Output() openTx = new EventEmitter<void>();
  @Output() openMasterBlock = new EventEmitter<string>();

  constructor(@Optional() private dialogRef?: MatDialogRef<unknown>) { }

  triStateLabel = triStateLabel;
  triStateClass = triStateClass;
  triStateIcon = triStateIcon;

  get hash(): string { return this.tx.transactionHash; }
  get hasMB(): boolean { return !!this.tx.includedInMasterBlock; }

  get inDialogMode(): boolean {
    return !!this.dialogRef; // true in Tx-dialog, false on Tx-page
  }

  onBeforeNavigate() {
    this.dialogRef?.close(); // closes if we're in a dialog; no-op on the page
  }

  onOpenMasterBlock(): void {
    if (!this.tx?.includedInMasterBlock) return;
    this.openMasterBlock.emit(this.tx.includedInMasterBlock);
  }

  get senderDisplay(): string {
    return formatChainAddress(this.tx?.sourceChainId, this.tx?.sourceSender);
  }

  get sourceChainName(): string | null {
    return getExplorerName(this.tx?.sourceChainId ?? null);
  }
}
