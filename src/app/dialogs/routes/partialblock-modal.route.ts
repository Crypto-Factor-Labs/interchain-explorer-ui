import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { BackendService } from '../../shared/services/backend.service';
import { DialogService } from '../../shared/services/dialog.service';
import { PartialBlockDialogComponent } from '../partialblock.dialog'; // thin wrapper like MasterBlock
import type { PartialChainBlock } from '../../shared/interfaces/master-chain.interface';

@Component({
  selector: 'app-partialblock-modal-route',
  standalone: true,
  template: ``,
})
export class PartialblockModalRouteComponent implements OnDestroy {
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    private dialogs: DialogService
  ) {
    this.sub = this.route.paramMap.pipe(
      take(1),
      switchMap(pm => this.backend.getPartialBlock(pm.get('hash') || ''))
    ).subscribe({
      next: (block: PartialChainBlock) => {
        const ref = this.dialogs.openDialog(PartialBlockDialogComponent, block);
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
