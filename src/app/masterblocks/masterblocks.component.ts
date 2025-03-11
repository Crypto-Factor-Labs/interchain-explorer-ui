import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // To access ngIf etc in HTML
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BackendService } from '../backend.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-masterblocks',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './masterblocks.component.html',
  styleUrl: './masterblocks.component.scss'
})
export class MasterBlocksComponent implements OnInit {
  masterBlocks!: any[];
  blockIsExpanded!: boolean[]  // For tracking for which MasterBlock the PartialBlocks are shown
  dummyTransactions!: any[];
  errMsg: string = '';         // For displaying error messages if the data retrieval fails

  constructor(
    private router: Router,
    private backendService: BackendService
  ) { }

  ngOnInit(): void {
    // Retrieve MasterBlock data (including the related PartialBlocks) on component load
    this.backendService.getMasterBlocks(5, 0, true).pipe(
      catchError((error) => {
        this.errMsg = 'Failed to load MasterBlocks';
        console.error('Error loading MasterBlock data:', error);
        return of(null);  // Return a null observable to continue the execution
      })
    ).subscribe((blocks: any) => {
      if (blocks) {
        this.masterBlocks = blocks;
        this.blockIsExpanded = new Array(blocks.length).fill(false);
      }
    });
  }

  // Toggle visibility of PartialBlocks for the clicked MasterBlock
  togglePartialBlocks(idx: number): void {
    this.blockIsExpanded[idx] = !this.blockIsExpanded[idx];
  }

  // Open the page that shows the data of a MasterBlock
  goToMasterBlock(masterBlock: any): void {
    this.router.navigate(['/masterblock'], { state: { masterBlock } });
  }

  // Open the page that shows the data of a PartialBlock
  goToPartialBlock(partialBlock: any): void {
    this.router.navigate(['/partialblock'], { state: { partialBlock } });
  }

}
