import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { map, switchMap, catchError, startWith } from 'rxjs/operators';
import { of } from 'rxjs';

import { BackendService } from '../shared/services/backend.service';
import type { Transaction } from '../shared/interfaces/transaction.interface';
import { TransactionDetailsComponent } from '../dialogs/transaction-details.component';
import { TxExecutionPartsComponent } from './tx-execution-parts.component';
import { PanelComponent } from '../shared/ui/panel.component';
import { getChainImage } from '../shared/utils/common.utils';

@Component({
  selector: 'app-transaction-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelComponent, TransactionDetailsComponent, TxExecutionPartsComponent],
  templateUrl: './transaction-page.component.html',
  styleUrls: ['./transaction-page.component.scss'],
})
export class TransactionPageComponent {
  getChainImage = getChainImage;

  vm$ = this.route.paramMap.pipe(
    map(pm => pm.get('hash') ?? ''),
    switchMap(hash =>
      this.backend.getTransaction(hash).pipe(
        map((tx: Transaction) => ({ loading: false, error: false, tx })),
        startWith({ loading: true, error: false, tx: null as Transaction | null }),
        catchError(() => of({ loading: false, error: true, tx: null as Transaction | null }))
      )
    )
  );

  constructor(private route: ActivatedRoute, private backend: BackendService) { }

  // Track opened ExecutionParts by hash
  opened = new Set<string>();

  toggleEP(hash: string) {
    if (!hash) return;
    if (this.opened.has(hash)) this.opened.delete(hash);
    else this.opened.add(hash);
  }

  isOpen(hash: string): boolean {
    return this.opened.has(hash);
  }

  shortHash(h: string, len = 8): string {
    if (!h) return '—';
    return h.length <= len ? h : `${h.slice(0, len)}…`;
  }

}
