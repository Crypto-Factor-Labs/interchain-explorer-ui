import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogShellComponent } from '../shared/ui/dialog-shell.component';
import { ExecutionPartDetailsComponent } from './execution-part-details.component';
import type { ExecutionPart } from '../shared/interfaces/transaction.interface';
import { getChainImage } from '../shared/utils/common.utils';

@Component({
  selector: 'app-execution-part-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [DialogShellComponent, ExecutionPartDetailsComponent, RouterModule],
  templateUrl: './execution-part.dialog.html',
})
export class ExecutionPartDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public ep: ExecutionPart,
    public dialogRef: MatDialogRef<ExecutionPartDialogComponent>
  ) { }

  get logoSrc(): string {
    return getChainImage(this.ep.chainId);
  }
}
