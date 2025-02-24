import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // To access ngIf etc in HTML
import { RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-masterblocks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './masterblocks.component.html',
  styleUrl: './masterblocks.component.scss'
})
export class MasterBlocksComponent implements OnInit {
  masterBlocks!: any[];
  errMsg: string = '';  // For displaying error messages if the data retrieval fails

  constructor(private backendService: BackendService) { }

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
}
