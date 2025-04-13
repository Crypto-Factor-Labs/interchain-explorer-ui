import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';  // CommonModule to access ngIf etc in HTML
import { SharedModule } from '../shared/shared.module';
import { MasterChainBlock } from '../shared/master-chain.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/* Angular Material is used to show the MasterBlock-data in a dialog that overlays the rest of the page */

@Component({
  selector: 'app-masterblock',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './masterblock.component.html',
  styleUrls: ['./masterblock.component.scss'],
  encapsulation: ViewEncapsulation.None,  // In order to let the dialog be positioned
})
export class MasterBlockComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public masterBlock: MasterChainBlock,
    public dialogRef: MatDialogRef<MasterBlockComponent>
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
