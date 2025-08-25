import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { ConfigService } from '../config.service';
import { BackendService } from '../shared/services/backend.service';
import { DialogService } from '../shared/services/dialog.service';
import { MasterBlockComponent } from '../masterblock/masterblock.component';
import { MasterChainBlock } from '../shared/interfaces/master-chain.interface'
import { PartialBlockComponent } from '../partialblock/partialblock.component';
import { PartialChainBlock } from '../shared/interfaces/master-chain.interface';
import { Tx, TxFetchResult } from '../shared/interfaces/transaction.interface';
import { getChainImage as utilGetChainImage } from '../shared/utils/common.utils';
import { MasterBlocksPanelComponent } from './masterblocks-panel/masterblocks-panel.component';
import { TransactionsPanelComponent } from './transactions-panel/transactions-panel.component';
import BN from 'bn.js';

interface FetchResult {
  blocks: MasterChainBlock[];
  latestHeight: BN;
}

@Component({
  selector: 'app-masterblocks',
  standalone: true,
  imports: [...SHARED_IMPORTS, MasterBlocksPanelComponent, TransactionsPanelComponent],
  templateUrl: './masterblocks.component.html',
  styleUrl: './masterblocks.component.scss'
})
export class MasterBlocksComponent implements OnInit {
  /* ---------------- MasterBlocks state ---------------- */
  masterBlocks!: MasterChainBlock[];
  expandedBlocks: { [id: string]: boolean } = {};
  latestHeight: BN = new BN(0);
  pageSize = 5;
  currentPage = 1;
  errMsg: string = '';
  pollingActive = false;
  getChainImage = utilGetChainImage;
  private pollingFreq: number = this.config.appPollFreq;
  private pollingTimeout: any;
  private subs = new Subscription();

  /* ---------------- Transactions state ---------------- */
  transactions: Tx[] = [];
  expandedTx: Record<string, boolean> = {};
  txPage = 1;
  txTotalPages = 1;              // adjust if your API provides a total
  txPolling = false;
  private txPollingTimeout: any;

  constructor(
    private config: ConfigService,
    private backendService: BackendService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.refreshData();   // MasterBlocks
    this.refreshTx();     // Transactions
  }

  ngOnDestroy(): void {
    clearTimeout(this.pollingTimeout);
    clearTimeout(this.txPollingTimeout);
    this.subs.unsubscribe();
  }

  /* ================= MasterBlocks ================= */
  refreshData(): void {
    this.currentPage = 1;
    this.pollingActive = true;
    clearTimeout(this.pollingTimeout);

    this.subs.add(
      this.fetchData(0, true).subscribe(result => {
        if (result) {
          this.masterBlocks = result.blocks;
          this.latestHeight = result.latestHeight;
        }
        this.scheduleNextPoll();
      })
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    if (page === 1) return this.refreshData();

    this.pollingActive = false;
    clearTimeout(this.pollingTimeout);

    this.currentPage = page;
    const skip = (page - 1) * this.pageSize;

    this.subs.add(
      this.fetchData(skip, false).subscribe(result => {
        if (result) this.masterBlocks = result.blocks;
      })
    );
  }

  private fetchData(skip: number, shouldPoll: boolean): Observable<FetchResult | null> {
    return this.backendService
      .getMasterBlocks(this.pageSize, skip, true)
      .pipe(
        catchError(err => {
          this.errMsg = 'Failed to load MasterBlocks';
          console.error('Error loading MasterBlock data:', err);
          if (shouldPoll) this.scheduleNextPoll();
          return of(null);
        }),
        map(blocks => {
          if (!blocks || blocks.length === 0) return null;

          const hydrated = blocks.map((block: MasterChainBlock) => ({
            ...block,
            partialBlocks: block.partialBlocks.map((pb: PartialChainBlock) => ({
              ...pb,
              parentTimestamp: block.timestamp
            }))
          }));

          const latestHeight = new BN(hydrated[0].height);
          return { blocks: hydrated, latestHeight };
        })
      );
  }

  get totalPages(): number {
    const totalBlocksBN = this.latestHeight.addn(1);
    const pagesBN = totalBlocksBN.addn(this.pageSize - 1).divn(this.pageSize);
    return pagesBN.toNumber();
  }

  togglePolling(): void {
    if (this.pollingActive) {
      this.pollingActive = false;
      clearTimeout(this.pollingTimeout);
    } else {
      this.refreshData();
    }
  }

  private scheduleNextPoll(): void {
    clearTimeout(this.pollingTimeout);
    this.pollingTimeout = setTimeout(() => this.refreshData(), this.pollingFreq);
  }

  togglePartialBlocks(blockHash: string): void {
    this.expandedBlocks[blockHash] = !this.expandedBlocks[blockHash];
  }

  trackByBlockHash(index: number, block: MasterChainBlock): string {
    return block.block_hash;
  }

  showMasterBlockData(block: MasterChainBlock): void {
    this.dialogService.openDialog(MasterBlockComponent, block);
  }

  showPartialBlockData(block: PartialChainBlock): void {
    this.dialogService.openDialog(PartialBlockComponent, block);
  }

  /* ================= Transactions ================= */

  /** Start polling page 1 for transactions */
  refreshTx(): void {
    this.txPage = 1;
    this.txPolling = true;
    clearTimeout(this.txPollingTimeout);

    this.subs.add(
      this.fetchTxData(0, true).subscribe(res => {
        if (res) {
          this.transactions = res.transactions;
          this.txTotalPages = Math.max(1, Math.ceil(res.total / this.pageSize));
        } else {
          this.transactions = [];
          this.txTotalPages = 1;
        }
        this.scheduleNextTxPoll();
      })
    );
  }

  /** Transactions: go to a specific page (turns off polling unless page 1) */
  goToTxPage(page: number): void {
    if (page < 1 || page > this.txTotalPages) return;

    if (page === 1) return this.refreshTx();

    this.txPolling = false;
    clearTimeout(this.txPollingTimeout);

    this.txPage = page;
    const skip = (page - 1) * this.pageSize;

    this.subs.add(
      this.fetchTxData(skip, false).subscribe(res => {
        if (res) {
          this.transactions = res.transactions;
          this.txTotalPages = Math.max(1, Math.ceil(res.total / this.pageSize));
        } else {
          this.transactions = [];
        }
      })
    );
  }

  /** Toggle transactions auto-refresh */
  onTxTogglePolling(): void {
    if (this.txPolling) {
      this.txPolling = false;
      clearTimeout(this.txPollingTimeout);
    } else {
      this.refreshTx();
    }
  }

  private scheduleNextTxPoll(): void {
    clearTimeout(this.txPollingTimeout);
    this.txPollingTimeout = setTimeout(() => this.refreshTx(), this.pollingFreq);
  }

  /** Backend adapter for transactions list ({ total, items }) */
  private fetchTxData(skip: number, shouldPoll: boolean): Observable<TxFetchResult | null> {
    return this.backendService
      .getTransactions(this.pageSize, skip, true)
      .pipe(
        catchError(err => {
          console.error('Error loading transactions:', err);
          if (shouldPoll) this.scheduleNextTxPoll();
          return of(null as TxFetchResult | null);
        })
      );
  }

  toggleTxExecutionParts = (hash: string) =>
    (this.expandedTx[hash] = !this.expandedTx[hash]);

  /** TrackBy for tx list */
  trackByTxHash = (_: number, tx: Tx) => tx.tx_hash;

  /** Open a transaction dialog (wire to your existing component if any) */
  openTxDialog(tx: Tx): void {
    // If you have a TransactionComponent, do:
    // this.dialogService.openDialog(TransactionComponent, tx);
    // For now, keep it safe:
    this.dialogService.openDialog(PartialBlockComponent, tx); // replace with your real TX component
    // Or simply: console.log('TX:', tx);
  }
}
