import { Component, Inject, ViewEncapsulation, HostListener } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import { MasterChainBlock } from '../shared/interfaces/master-chain.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/* Angular Material is used to show the MasterBlock-data in a dialog that overlays the rest of the page */

@Component({
  selector: 'app-masterblock',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './masterblock.component.html',
  styleUrls: ['./masterblock.component.scss'],
  encapsulation: ViewEncapsulation.None,  // In order to let the dialog be positioned
})
export class MasterBlockComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public masterBlock: MasterChainBlock,
    public dialogRef: MatDialogRef<MasterBlockComponent>
  ) { }

  // Close the dialog when Enter is pressed
  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent) {
    this.dialogRef.close();
  }

  // Close the dialog when ESC is pressed
  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: KeyboardEvent) {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
