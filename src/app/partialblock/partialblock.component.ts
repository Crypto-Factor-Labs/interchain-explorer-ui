import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';  // CommonModule to access ngIf etc in HTML
import { PartialChainBlock } from '../shared/master-chain.interface';

@Component({
  selector: 'app-partialblock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partialblock.component.html',
  styleUrls: ['./partialblock.component.scss']
})
export class PartialBlockComponent {
  @Input() partialBlock: PartialChainBlock | null = null;
  errMsg: string = '';  // For displaying error messages if the data fetch fails

  ngOnInit(): void {
    if (history.state.partialBlock) {
      this.partialBlock = history.state.partialBlock;
    } else {
      // Handle the error when no block is passed.
      this.errMsg = 'No PartialBlock data was provided.';
      console.error('No block data was passed to PartialBlockComponent.');
      // Optionally, navigate back to the MasterBlocks list after a delay:
      //setTimeout(() => {
      //  this.router.navigate(['/masterblocks']);
      //}, 3000);
    }
  }

  goBack(): void {
    window.history.back();
  }
}

/*
import { Component } from '@angular/core';

@Component({
  selector: 'app-partialblock',
  standalone: true,
  imports: [],
  templateUrl: './partialblock.component.html',
  styleUrl: './partialblock.component.scss'
})
export class PartialblockComponent {

}
*/