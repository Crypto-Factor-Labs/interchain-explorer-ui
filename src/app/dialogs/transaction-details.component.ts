import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { Transaction } from '../shared/interfaces/transaction.interface';
import { triStateLabel, triStateClass, triStateIcon } from '../shared/utils/tri-state';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [RouterModule, ...SHARED_IMPORTS],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent {
  @Input({ required: true }) tx!: Transaction;
  @Output() openTx = new EventEmitter<void>();

  constructor(@Optional() private dialogRef?: MatDialogRef<unknown>) { }

  triStateLabel = triStateLabel;
  triStateClass = triStateClass;
  triStateIcon = triStateIcon;

  get hash(): string { return this.tx.transactionHash; }
  get hasMB(): boolean { return !!this.tx.includedInMasterBlock; }

  get showOpenTxIcon(): boolean {
    return !!this.dialogRef; // true in Tx-dialog, false on Tx-page
  }
}
