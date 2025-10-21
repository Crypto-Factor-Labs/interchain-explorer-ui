import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { BackendService } from '../../shared/services/backend.service';
import { DialogService } from '../../shared/services/dialog.service';
import { MasterBlockDialogComponent } from '../masterblock.dialog';
import type { MasterChainBlock } from '../../shared/interfaces/master-chain.interface';

@Component({
  selector: 'app-masterblock-modal-route',
  standalone: true,
  template: `` // no UI; the dialog is the UI
})
export class MasterblockModalRouteComponent implements OnDestroy {
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    private dialogs: DialogService
  ) {
    this.sub = this.route.paramMap.pipe(
      take(1),
      switchMap(pm => this.backend.getMasterBlock(pm.get('hash') || ''))
    ).subscribe({
      next: (block: MasterChainBlock) => {
        const ref = this.dialogs.openDialog(MasterBlockDialogComponent, block);
        ref.afterClosed().pipe(take(1)).subscribe(() => this.closeModalOutlet());
      },
      error: () => {
        // If fetch fails, just close the outlet; optionally route to a toast/page
        this.closeModalOutlet();
      }
    });
  }

  private closeModalOutlet() {
    // Remove only the modal outlet, keep the primary route as-is
    this.router.navigate([{ outlets: { modal: null } }], { replaceUrl: true });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
