import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // To access ngIf etc in HTML
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-masterblock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masterblock.component.html',
  styleUrls: ['./masterblock.component.scss'],
})
export class MasterBlockComponent {
  masterBlock: any;
  errMsg: string = '';  // For displaying error messages if the data fetch fails

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
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
  }
}
