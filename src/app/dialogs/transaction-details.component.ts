import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { Transaction } from '../shared/interfaces/transaction.interface';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent {
  @Input({ required: true }) tx!: Transaction;

  get txHash(): string { return this.tx.transactionHash; }
  get execPartsCount(): number { return this.tx.executionParts?.length ?? 0; }
}
