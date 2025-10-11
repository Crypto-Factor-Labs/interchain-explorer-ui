import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogShellComponent } from '../shared/dialog/dialog-shell.component';
import { PartialBlockDetailsComponent } from './partial-block-details.component';
import type { PartialChainBlock } from '../shared/interfaces/master-chain.interface';
import { getChainImage } from '../shared/utils/common.utils';

@Component({
  selector: 'app-partialblock-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [DialogShellComponent, PartialBlockDetailsComponent],
  templateUrl: './partialblock.dialog.html',
})
export class PartialBlockDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public partialBlock: PartialChainBlock,
    public dialogRef: MatDialogRef<PartialBlockDialogComponent>
  ) { }

  get logoSrc(): string {
    return getChainImage(this.partialBlock.chain_id);
  }
}
