import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { map, switchMap, catchError, startWith } from 'rxjs/operators';
import { of } from 'rxjs';

import { BackendService } from '../../shared/services/backend.service';
import type { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionDetailsComponent } from '../../dialogs/transaction-details.component';
import { TxExecutionPartsComponent } from './tx-exec-parts.component';
import { PanelComponent } from '../../shared/ui/panel.component';
import { getChainImage } from '../../shared/utils/common.utils';
import { SHARED_IMPORTS } from '../../shared/shared-standalone';

@Component({
  selector: 'app-tx-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelComponent,
    TransactionDetailsComponent, TxExecutionPartsComponent, ...SHARED_IMPORTS],
  templateUrl: './tx-page.component.html',
  styleUrls: ['./tx-page.component.scss'],
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private backend: BackendService,
  ) { }

  // Track opened ExecutionParts by hash
  opened = new Set<string>();
  initialOpenEpHash: string | null = null;

  ngOnInit() {
    this.initialOpenEpHash = this.route.snapshot.queryParamMap.get('ep');
  }

  toggleEP(hash: string) {
    if (!hash) return;
    if (this.opened.has(hash)) this.opened.delete(hash);
    else this.opened.add(hash);
  }

  isOpen(hash: string): boolean {
    return this.opened.has(hash);
  }

  onOpenMasterBlock(hash: string) {
    this.router.navigate([
      { outlets: { modal: ['mblock', hash] } }
    ]);
  }
}
