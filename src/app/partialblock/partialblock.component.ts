import { Component, Inject, ViewEncapsulation, HostListener } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import { PartialChainBlock } from '../shared/interfaces/master-chain.interface';
import { getChainImage } from '../shared/utils/common.utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partialblock',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './partialblock.component.html',
  styleUrls: ['./partialblock.component.scss'],
  encapsulation: ViewEncapsulation.None,  // In order to let the dialog be positioned
})
export class PartialBlockComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public partialBlock: PartialChainBlock,
    public dialogRef: MatDialogRef<PartialBlockComponent>
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

  getChainImage(chainId: number): string {
    return getChainImage(chainId);  // Call the imported function
  }
}
