import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // To access ngIf etc in HTML
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigService } from '../config.service';
import { SharedModule } from '../shared/shared.module';
import { BackendService } from '../backend.service';
import { MasterChainBlock } from '../shared/master-chain.interface'

@Component({
  selector: 'app-masterblocks',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './masterblocks.component.html',
  styleUrl: './masterblocks.component.scss'
})
export class MasterBlocksComponent implements OnInit {
  masterBlocks!: any[];
  expandedBlocks: { [id: string]: boolean } = {}; // For tracking for which MasterBlocks the PartialBlocks are shown
  dummyTransactions!: any[];
  errMsg: string = '';  // For displaying error messages if the data retrieval fails
  private pollingFreq: number = this.config.appPollFreq;  // In milliseconds
  private pollingTimeout: any;

  constructor(
    private router: Router,
    private config: ConfigService,
    private backendService: BackendService,
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    // Fetch MasterBlock data (including the related PartialBlocks)
    //console.log(">>> refreshData");
    this.backendService.getMasterBlocks(5, 0, true).pipe(
      catchError((error) => {
        this.errMsg = 'Failed to load MasterBlocks';
        console.error('Error loading MasterBlock data:', error);
        this.pollingTimeout = setTimeout(() => this.refreshData(), this.pollingFreq);  // Schedule the next refresh
        return of(null);  // Return a null observable to continue the execution
      })
    ).subscribe((blocks: any) => {
      if (blocks) {
        this.masterBlocks = blocks;
        this.pollingTimeout = setTimeout(() => this.refreshData(), this.pollingFreq);  // Schedule the next refresh
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
    }
  }

  // Toggle visibility of PartialBlocks for the clicked MasterBlock
  togglePartialBlocks(blockHash: string): void {
    this.expandedBlocks[blockHash] = !this.expandedBlocks[blockHash];
  }

  // Tracking function used by ngFor to see if a MasterBlock is expanded
  trackByBlockHash(index: number, block: MasterChainBlock): string {
    return block.block_hash;
  }

  // Open the page that shows the data of a MasterBlock
  goToMasterBlock(masterBlock: any): void {
    this.router.navigate(['/masterblock'], { state: { masterBlock } });
  }

  // Open the page that shows the data of a PartialBlock
  goToPartialBlock(partialBlock: any): void {
    this.router.navigate(['/partialblock'], { state: { partialBlock } });
  }

  getChainImage(chainId: number): string {
    switch (chainId) {
      case 1130:
      case 1131:
        return 'assets/images/defichain_logo.png';
      case 18500:
        return 'assets/images/partisia_logo.png';
      default:
        return 'assets/images/interchain_logo.png';
    }
  }
}
