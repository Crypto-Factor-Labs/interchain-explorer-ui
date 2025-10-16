import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { DialogShellComponent } from '../shared/ui/dialog-shell.component';
import type { Transaction } from '../shared/interfaces/transaction.interface';
import { TransactionDetailsComponent } from './transaction-details.component';
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
