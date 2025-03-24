import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // CommonModule to access ngIf etc in HTML
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-masterblock',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './masterblock.component.html',
  styleUrls: ['./masterblock.component.scss'],
})
export class MasterBlockComponent implements OnInit {
  masterBlock: any;
  errMsg: string = '';  // For displaying error messages if the data fetch fails

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (history.state.masterBlock) {
      this.masterBlock = history.state.masterBlock;
    } else {
      // Handle the error when no block is passed.
      this.errMsg = 'No MasterBlock data was provided.';
      console.error('No block data was passed to MasterBlockComponent.');
      // Optionally, navigate back to the MasterBlocks list after a delay:
      setTimeout(() => {
        this.router.navigate(['/masterblocks']);
      }, 3000);
    }
  }

  // Go back to the previous page
  goBack(): void {
    window.history.back();
  }
}
