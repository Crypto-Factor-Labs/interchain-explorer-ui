import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { map, switchMap, catchError, startWith } from 'rxjs/operators';
import { of } from 'rxjs';

import { BackendService } from '../shared/services/backend.service';
import type { Transaction } from '../shared/interfaces/transaction.interface';
import { TransactionDetailsComponent } from '../dialogs/transaction-details.component';

@Component({
  selector: 'app-transaction-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TransactionDetailsComponent],
  template: `
    <div class="page-container">
      <h1>Transaction</h1>

      <ng-container *ngIf="vm$ | async as vm">
        <p *ngIf="vm.loading">Loading transaction…</p>

        <div *ngIf="vm.error" class="error-box">
          Could not load this transaction.
        </div>

        <app-transaction-details *ngIf="vm.tx" [tx]="vm.tx"></app-transaction-details>
      </ng-container>
    </div>
  `,
  styles: [`
    .page-container { max-width: 960px; margin: 0 auto; padding: 16px; }
    .error-box { margin-top: 12px; padding: 10px 12px; border: 1px solid #c0392b44; color: #e74c3c; border-radius: 6px; }
  `]
})
export class TransactionPageComponent {
  vm$ = this.route.paramMap.pipe(
    map(params => params.get('hash') ?? ''),
    switchMap(hash =>
      this.backend.getTransaction(hash).pipe(
        map((tx: Transaction) => ({ loading: false, error: false, tx })),
        startWith({ loading: true, error: false, tx: null as Transaction | null }),
        catchError(() => of({ loading: false, error: true, tx: null as Transaction | null }))
      )
    )
  );

  constructor(private route: ActivatedRoute, private backend: BackendService) { }
}
