import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelComponent } from '../../shared/ui/panel.component';
import { TxsListLiteComponent } from './txs-list-lite.component';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { BackendService } from '../../shared/services/backend.service';
import { formatChainHash } from '../../shared/utils/external-explorer.util';

type Vm = {
  loading: boolean;
  error: string | null;
  sender: string | null;
  senderDisplay: string | null;
  txs: readonly any[];  // uses the mapTx() shape
  page: number;
  total: number;
  pages: number;
};

const PAGE_SIZE = 8;

@Component({
  standalone: true,
  selector: 'app-txs-page',
  imports: [CommonModule, PanelComponent, TxsListLiteComponent],
  templateUrl: './txs-page.component.html',
  styleUrls: ['./txs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TxsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly backend = inject(BackendService);

  readonly vm$: Observable<Vm> = this.route.queryParamMap.pipe(
    map(q => {
      const sender = q.get('sender')?.trim() || null;
      const page = Math.max(1, Number(q.get('page') || 1) || 1);
      return { sender, page };
    }),
    switchMap(({ sender, page }) => {
      const senderForFilter = sender ?? undefined;
      const skip = (page - 1) * PAGE_SIZE;
      return this.backend
        .getTransactions(PAGE_SIZE, skip, false, false, undefined, senderForFilter)
        .pipe(
          map(res => {
            const total = res.total ?? 0;
            const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

            const txs = res.transactions ?? [];
            const chainId = txs.length > 0 ? txs[0]?.chainId ?? null : null;

            const senderDisplay =
              sender && chainId != null
                ? formatChainHash(chainId, sender)
                : sender;

            return {
              loading: false,
              error: null,
              sender,
              senderDisplay,
              txs,
              page,
              total,
              pages,
            };
          }),
          startWith({
            loading: true,
            error: null,
            sender,
            senderDisplay: sender,
            txs: [],
            page,
            total: 0,
            pages: 1,
          }),
          catchError(() =>
            of({
              loading: false,
              error: 'Failed to load',
              sender: null,
              senderDisplay: null,
              txs: [],
              page,
              total: 0,
              pages: 1,
            })
          )
        );
    })
  );

  onOpenTx = (hash: string) => this.router.navigate(['/tx', hash]);

  // Helper to update only the page (keeps sender)
  gotoPage = (page: number) => {
    const q = { ...this.route.snapshot.queryParams, page };
    this.router.navigate([], { relativeTo: this.route, queryParams: q, queryParamsHandling: 'merge' });
  };


}
