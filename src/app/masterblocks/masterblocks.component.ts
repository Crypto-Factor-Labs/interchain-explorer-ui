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
  dummyTransactions: any[] = [];
  errMsg: string = '';  // For displaying error messages if the data retrieval fails

  constructor(
    private router: Router,
    private backendService: BackendService
  ) { }

  ngOnInit(): void {
    // Retrieve MasterBlock data on component load
    this.backendService.getMasterBlocks(5).pipe(
      catchError((error) => {
        this.errMsg = 'Failed to load MasterBlocks';
        console.error('Error loading MasterBlock data:', error);
        return of(null);  // Return a null observable to continue the execution
      })
    ).subscribe((data: any) => {
      if (data) {
        this.masterBlocks = data;
      }
    });
  }

  // Open the page that shows the data of a MasterBlock
  goToMasterBlock(block: any): void {
    this.router.navigate(['/masterblock'], { state: { block } });
  }
}
