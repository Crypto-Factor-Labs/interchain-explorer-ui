import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { Transaction } from '../shared/interfaces/transaction.interface';
import { RouterModule } from '@angular/router';
import { triStateLabel, triStateClass, triStateIcon } from '../shared/utils/tri-state';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [...SHARED_IMPORTS, RouterModule],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent {
  @Input({ required: true }) tx!: Transaction;

  triStateLabel = triStateLabel;
  triStateClass = triStateClass;
  triStateIcon = triStateIcon;

  get hash(): string { return this.tx.transactionHash; }
  get hasMB(): boolean { return !!this.tx.includedInMasterBlock; }
}
