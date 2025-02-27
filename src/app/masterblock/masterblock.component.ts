import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';  // CommonModule to access ngIf etc in HTML
import { Router } from '@angular/router';

@Component({
  selector: 'app-masterblock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masterblock.component.html',
  styleUrls: ['./masterblock.component.scss'],
})
export class MasterBlockComponent implements OnInit {
  masterBlock: any;
  errMsg: string = '';  // For displaying error messages if the data fetch fails

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    if (history.state.block) {
      this.masterBlock = history.state.block;
    } else {
      // Handle the error when no block is passed.
      this.errMsg = 'Error: No block data was provided.';
      console.error('No block data was passed to MasterBlockComponent.');
      // Optionally, navigate back to the MasterBlocks list after a delay:
      setTimeout(() => {
        this.router.navigate(['/masterblocks']);
      }, 3000);
    }

    /*
    import { catchError } from 'rxjs/operators';
    import { of } from 'rxjs';
    
    // Fetch master block data on component load
    this.backendService.getLatestMasterBlock().pipe(
      catchError((error) => {
        this.errMsg = 'Failed to load latest block data';
        console.error('Error loading block data:', error);
        return of(null);  // Return a null observable to continue the execution
      })
    ).subscribe((data: any) => {
      if (data) {
        this.masterBlock = data;
      }
    });
    */
  }

  // Go back to the previous page
  goBack(): void {
    this.location.back();
  }
}
