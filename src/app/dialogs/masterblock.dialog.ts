import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogShellComponent } from '../shared/ui/dialog-shell.component';
import type { MasterChainBlock } from '../shared/interfaces/master-chain.interface';
import { MasterBlockDetailsComponent } from './masterblock-details.component';
import { getChainImage } from '../shared/utils/common.utils';

@Component({
  selector: 'app-masterblock-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [DialogShellComponent, MasterBlockDetailsComponent],
  templateUrl: './masterblock.dialog.html',
})
export class MasterBlockDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public masterBlock: MasterChainBlock,
    public dialogRef: MatDialogRef<MasterBlockDialogComponent>
  ) { }

  get logoSrc(): string {
    return getChainImage(null);  // Default MasterChain image
  }
}