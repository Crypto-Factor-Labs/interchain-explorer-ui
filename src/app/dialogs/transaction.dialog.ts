import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DialogShellComponent } from '../shared/dialog/dialog-shell.component';
import { TransactionDetailsComponent } from './transaction-details.component';
import type { Transaction } from '../shared/interfaces/transaction.interface';

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule, DialogShellComponent, TransactionDetailsComponent],
  templateUrl: './transaction.dialog.html',
})
export class TransactionDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public tx: Transaction,
    public dialogRef: MatDialogRef<TransactionDialogComponent>
  ) { }
}
