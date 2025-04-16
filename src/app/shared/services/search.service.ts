import { Injectable } from '@angular/core';
import { BackendService } from '../../backend.service';
import { DialogService } from './dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterBlockComponent } from '../../masterblock/masterblock.component';
import { PartialBlockComponent } from '../../partialblock/partialblock.component';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    private backend: BackendService,
    private dialog: DialogService,
    private snackBar: MatSnackBar
  ) { }

  async searchBlock(hash: string): Promise<void> {
    const trimmedHash = hash.trim();
    if (!trimmedHash) return;

    // First see if the provided hash is from a MasterBlock,
    // If no block is found, try if it is from a PartialBlock.
    this.backend.getMasterBlock(trimmedHash).subscribe({
      next: (block) => {
        if (block && block.block_hash) {
          this.dialog.openDialog(MasterBlockComponent, block);
        } else {
          this.tryPartialBlock(trimmedHash);
        }
      },
      error: () => this.tryPartialBlock(trimmedHash)
    });
  }

  private tryPartialBlock(hash: string): void {
    this.backend.getPartialBlock(hash).subscribe({
      next: (partialBlock) => {
        if (partialBlock && partialBlock.block_hash) {
          this.dialog.openDialog(PartialBlockComponent, partialBlock);
        } else {
          this.showNotFound();
        }
      },
      error: () => this.showNotFound()
    });
  }

  private showNotFound(): void {
    this.snackBar.open('Block not found', 'Dismiss', {
      duration: 4000,
      panelClass: ['snack-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
