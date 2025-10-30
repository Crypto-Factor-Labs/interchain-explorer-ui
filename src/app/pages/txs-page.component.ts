import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PanelComponent } from '../shared/ui/panel.component';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, distinctUntilChanged } from 'rxjs/operators';

type Vm = {
  loading: boolean;
  error: string | null;
  sender: string | null;
  txs: readonly any[];
};

@Component({
  standalone: true,
  selector: 'app-txs-page',
  imports: [CommonModule, PanelComponent],
  templateUrl: './txs-page.component.html',
  styleUrls: ['./txs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TxsPageComponent {
  private readonly route = inject(ActivatedRoute);

  private fetchTxs(sender: string | null) {
    return of([] as any[]); // TODO: replace with real service
  }

  readonly vm$: Observable<Vm> = this.route.queryParamMap.pipe(
    map(q => (q.get('sender')?.trim() || '') || null),
    distinctUntilChanged(),
    switchMap(sender =>
      this.fetchTxs(sender).pipe(
        map(txs => ({ loading: false, error: null, sender, txs })),
        startWith({ loading: true, error: null, sender, txs: [] }),
        catchError(() => of({ loading: false, error: 'Failed to load', sender, txs: [] }))
      )
    )
  );
}
