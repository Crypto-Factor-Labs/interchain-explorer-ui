import { Component, OnDestroy, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-standalone';
import { Subscription, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../../config.service';
import { BackendService } from '../../backend.service';
import { DialogService } from '../../shared/services/dialog.service';

import { Transaction, ExecutionPart } from '../../shared/interfaces/transaction.interface';
import { getChainImage } from '../../shared/utils/common.utils';

// Optional: status helpers for template bindings
import { triStateLabel, triStateClass, triStateIcon } from '../../shared/utils/tri-state.utils';

interface TxFetchResult {
  transactions: Transaction[];
  total?: number; // if backend returns total count
}

@Component({
  selector: 'app-transaction-panel',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './transaction-panel.component.html',
  styleUrl: './transaction-panel.component.scss',
})
export class TransactionPanelComponent implements OnInit, OnDestroy {
  // Data + UI state
  transactions!: Transaction[];
  expandedTx: { [hash: string]: boolean } = {};
  errMsg = '';

  // Pagination/polling (same defaults as left panel)
  txPageSize = 5;
  txCurrentPage = 1;
  txTotalPages = 1;
  pollingActive = false;
  private pollingFreq = this.config.appPollFreq; // ms
  private pollingTimeout: any;
  private subs = new Subscription();

  // Expose helpers to template
  triStateLabel = triStateLabel;
  triStateClass = triStateClass;
  triStateIcon = triStateIcon;

  constructor(
    private config: ConfigService,
    private backendService: BackendService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    clearTimeout(this.pollingTimeout);
    this.subs.unsubscribe();
  }

  // === Public API for template ===

  refreshData(): void {
    this.txCurrentPage = 1;
    this.pollingActive = true;
    clearTimeout(this.pollingTimeout);

    this.subs.add(
      this.fetchTxData(0, true).subscribe(result => {
        if (result) {
          this.transactions = result.transactions;
          // If backend gives total, compute pages; else keep last known
          if (typeof result.total === 'number') {
            this.txTotalPages = Math.max(1, Math.ceil(result.total / this.txPageSize));
          }
        }
        this.scheduleNextPoll();
      })
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.txTotalPages) return;

    if (page === 1) {
      this.refreshData();
      return;
    }

    this.pollingActive = false;
    clearTimeout(this.pollingTimeout);

    this.txCurrentPage = page;
    const skip = (page - 1) * this.txPageSize;

    this.subs.add(
      this.fetchTxData(skip, false).subscribe(result => {
        if (result) this.transactions = result.transactions;
      })
    );
  }

  togglePolling(): void {
    if (this.pollingActive) {
      this.pollingActive = false;
      clearTimeout(this.pollingTimeout);
    } else {
      this.refreshData();
    }
  }

  toggleExecutionParts(txHash: string): void {
    this.expandedTx[txHash] = !this.expandedTx[txHash];
  }

  trackByTxHash(_: number, tx: Transaction): string {
    return tx.transactionHash;
  }

  trackByExecPart(_: number, part: ExecutionPart): string {
    return `${part.transactionHash}:${part.transactionExecutionPartIndex}`;
  }

  showTransactionData(tx: Transaction): void {
    // Provide a dialog component matching your app (or swap to router nav)
    //this.dialogService.openDialog<any>(/* TransactionComponent */ null as any, tx);
  }

  showExecutionPartData(part: ExecutionPart): void {
    //this.dialogService.openDialog<any>(/* ExecutionPartComponent */ null as any, part);
  }

  getChainImage(chainId: number): string {
    return getChainImage(chainId);
  }

  // === Private ===

  private fetchTxData(skip: number, shouldPoll: boolean): Observable<TxFetchResult | null> {
    return this.backendService
      // Align signature with your BackendService (take, skip, verbose?)
      .getTransactions(this.txPageSize, skip, true)
      .pipe(
        catchError(err => {
          this.errMsg = 'Failed to load Transactions';
          console.error('Error loading Transaction data:', err);
          if (shouldPoll) this.scheduleNextPoll();
          return of(null);
        }),
        map(res => {
          const raw = Array.isArray(res) ? res : (res?.items ?? []);
          const items: Transaction[] = raw.map((t: any) => ({
            ...t,
            // SAFETY: always an array so template can use `.length`
            executionParts: Array.isArray(t.executionParts) ? t.executionParts : [],
          }));

          if (!items.length) return null;
          const total = Array.isArray(res) ? undefined : res?.total;
          return { transactions: items, total };
        })
      );
  }

  private scheduleNextPoll(): void {
    clearTimeout(this.pollingTimeout);
    if (this.pollingActive) {
      this.pollingTimeout = setTimeout(() => this.refreshData(), this.pollingFreq);
    }
  }
}
