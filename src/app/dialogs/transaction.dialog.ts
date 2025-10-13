import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { DialogShellComponent } from '../shared/dialog/dialog-shell.component';
import { TransactionDetailsComponent } from './transaction-details.component';
import type { Transaction } from '../shared/interfaces/transaction.interface';
import { getChainImage } from '../shared/utils/common.utils';

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [DialogShellComponent, TransactionDetailsComponent, RouterModule, CdkCopyToClipboard],
  templateUrl: './transaction.dialog.html',
})
export class TransactionDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public tx: Transaction,
    public dialogRef: MatDialogRef<TransactionDialogComponent>
  ) { }

  get logoSrc(): string {
    return getChainImage(this.tx.sourceChainId);
  }
}
