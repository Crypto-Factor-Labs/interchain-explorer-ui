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
  masterBlocks!: MasterChainBlock[];
  expandedBlocks: { [id: string]: boolean } = {}; // For tracking for which MasterBlocks the PartialBlocks are shown
  latestHeight: BN = new BN(0);
  pageSize = 5;
  currentPage = 1;
  dummyTransactions!: any[];
  errMsg: string = '';  // For displaying error messages if the data retrieval fails
  pollingActive = false;
  getChainImage = utilGetChainImage;  // Use the utility function for chain images
  private pollingFreq: number = this.config.appPollFreq;  // In milliseconds
  private pollingTimeout: any;
  private subs = new Subscription();  // Register calls so they can be stopped when necessary

  constructor(
    private config: ConfigService,
    private backendService: BackendService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    clearTimeout(this.pollingTimeout);
    this.subs.unsubscribe();
  }

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

  // Jump to an arbitrary page and disable refreshing
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    // Resume polling when jumping back to page 1
    if (page === 1) {
      return this.refreshData();
    }

    // Otherwise, stop polling and do a manual fetch
    this.pollingActive = false;
    clearTimeout(this.pollingTimeout);

    this.currentPage = page;
    const skip = (page - 1) * this.pageSize;

    this.subs.add(
      this.fetchData(skip, false).subscribe(result => {
        if (result) {
          this.masterBlocks = result.blocks;
        }
      })
    );
  }

  /**
   * Shared loader:
   *  • calls the backend
   *  • hydrates partialBlocks
   *  • parses latestHeight (hex vs. decimal)
   *  • handles errors (+ optional polling)
   */
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

          // Hydrate PartialBlocks
          const hydrated = blocks.map((block: MasterChainBlock) => ({
            ...block,
            partialBlocks: block.partialBlocks.map((pb: PartialChainBlock) => ({
              ...pb,
              parentTimestamp: block.timestamp
            }))
          }));

          // Also return the latest height
          const latestHeight = new BN(hydrated[0].height);
          return { blocks: hydrated, latestHeight };
        })
      );
  }

  // Compute total pages via BN ceil-division
  get totalPages(): number {
    // total blocks = latestHeight + 1
    const totalBlocksBN = this.latestHeight.addn(1);

    // pages = ceil(totalBlocks / pageSize)
    const pagesBN = totalBlocksBN
      .addn(this.pageSize - 1)  // bump for rounding up
      .divn(this.pageSize);
    return pagesBN.toNumber();
  }

  togglePolling(): void {
    if (this.pollingActive) {
      // turn it OFF: stop the timer, keep whatever page we’re on
      this.pollingActive = false;
      clearTimeout(this.pollingTimeout);
    } else {
      // turn it ON: always go back to page 1
      this.refreshData();
    }
  }

  // Schedule the next automatic refresh
  private scheduleNextPoll(): void {
    clearTimeout(this.pollingTimeout);
    this.pollingTimeout = setTimeout(() => this.refreshData(), this.pollingFreq);
  }

  // Toggle visibility of PartialBlocks for the clicked MasterBlock
  togglePartialBlocks(blockHash: string): void {
    this.expandedBlocks[blockHash] = !this.expandedBlocks[blockHash];
  }

  // Tracking function used by ngFor to see if a MasterBlock is expanded
  trackByBlockHash(index: number, block: MasterChainBlock): string {
    return block.block_hash;
  }

  // Show the data of a MasterBlock in a dialog on top of the current page
  // (so no routing to a new page!)
  showMasterBlockData(block: MasterChainBlock): void {
    this.dialogService.openDialog(MasterBlockComponent, block);
  }

  // Show the data of a PartialBlock in a dialog on top of the current page
  // (so no routing to a new page!)
  showPartialBlockData(block: PartialChainBlock): void {
    this.dialogService.openDialog(PartialBlockComponent, block);
  }

}
