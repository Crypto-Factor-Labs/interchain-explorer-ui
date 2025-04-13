import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';  // CommonModule to access ngIf etc in HTML
import { SharedModule } from '../shared/shared.module';
import { PartialChainBlock } from '../shared/master-chain.interface';
import { getChainImage } from '../shared/utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partialblock',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './partialblock.component.html',
  styleUrls: ['./partialblock.component.scss'],
  encapsulation: ViewEncapsulation.None,  // In order to let the dialog be positioned
})
export class PartialBlockComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public partialBlock: PartialChainBlock,
    public dialogRef: MatDialogRef<PartialBlockComponent>
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getChainImage(chainId: number): string {
    return getChainImage(chainId);  // Call the imported function
  }
}
