import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // To access ngIf etc in HTML
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigService } from '../config.service';
import { SharedModule } from '../shared/shared.module';
import { BackendService } from '../backend.service';
import { MasterBlockComponent } from '../masterblock/masterblock.component';
import { MasterChainBlock } from '../shared/master-chain.interface'
import { PartialBlockComponent } from '../partialblock/partialblock.component';
import { PartialChainBlock } from '../shared/master-chain.interface';
import { getChainImage } from '../shared/utils';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-masterblocks',
  standalone: true,
  imports: [CommonModule, SharedModule],
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
    private config: ConfigService,
    private backendService: BackendService,
    private dialog: MatDialog,
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

  // Show the data of a MasterBlock in a dialog on top of the current page
  // (so no routing to a new page!)
  showMasterBlockData(block: MasterChainBlock): void {
    this.openDialog(MasterBlockComponent, block);
  }

  // Show the data of a PartialBlock in a dialog on top of the current page
  // (so no routing to a new page!)
  showPartialBlockData(block: PartialChainBlock): void {
    this.openDialog(PartialBlockComponent, block);
  }

  openDialog(component: any, data: any): void {
    this.dialog.open(component, {
      data: data,
      width: 'auto',
      panelClass: 'custom-dialog',
      backdropClass: 'custom-light-backdrop',
      disableClose: true  // 🔒 prevents backdrop click & ESC-key from closing
    });
  }

  getChainImage(chainId: number): string {
    return getChainImage(chainId);  // Call the imported function
  }
}
