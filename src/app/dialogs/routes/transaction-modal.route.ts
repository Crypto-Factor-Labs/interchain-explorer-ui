import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { BackendService } from '../../shared/services/backend.service';
import { DialogService } from '../../shared/services/dialog.service';
import { TransactionDialogComponent } from '../transaction.dialog';
import type { Transaction } from '../../shared/interfaces/transaction.interface';

@Component({
  selector: 'app-transaction-modal-route',
  standalone: true,
  template: ``,
})
export class TransactionModalRouteComponent implements OnDestroy {
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    private dialogs: DialogService
  ) {
    this.sub = this.route.paramMap.pipe(
      take(1),
      switchMap(pm => this.backend.getTransaction(pm.get('hash') || ''))
    ).subscribe({
      next: (tx: Transaction) => {
        const ref = this.dialogs.openDialog(TransactionDialogComponent, tx);
        ref.afterClosed().pipe(take(1)).subscribe(() => this.closeModalOutlet());
      },
      error: () => this.closeModalOutlet(),
    });
  }

  private closeModalOutlet() {
    this.router.navigate([{ outlets: { modal: null } }], { replaceUrl: true });
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}
