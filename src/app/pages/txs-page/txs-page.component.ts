import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelComponent } from '../../shared/ui/panel.component';
import { TxsListLiteComponent } from './txs-list-lite.component';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { BackendService } from '../../shared/services/backend.service';

type Vm = {
  loading: boolean;
  error: string | null;
  sender: string | null;  // read from query param (not used yet)
  txs: readonly any[];    // uses the mapTx() shape
};

const PAGE_SIZE = 10; // tweak as you like

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
    map(q => q.get('sender')?.trim() || null),
    switchMap(senderParam => {
      const sender = senderParam ?? undefined; // normalize
      return this.backend.getTransactions(PAGE_SIZE, 0, false, false, undefined, sender).pipe(
        map(res => ({ loading: false, error: null, sender: senderParam, txs: res.transactions })),
        startWith({ loading: true, error: null, sender: senderParam, txs: [] }),
        catchError(() => of({ loading: false, error: 'Failed to load', sender: senderParam, txs: [] }))
      );
    })
  );

  onOpenTx = (hash: string) => this.router.navigate(['/tx', hash]);
}
