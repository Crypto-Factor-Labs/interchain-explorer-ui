import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from './backend.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    private router: Router,
    private backend: BackendService,
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
          this.router.navigate([{ outlets: { modal: ['block', hash] } }]);
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
          this.router.navigate([{ outlets: { modal: ['pblock', hash] } }]);
        } else {
          this.showNotFound();
        }
      },
      error: () => this.showNotFound()
    });
  }

  private showNotFound(): void {
    this.snackBar.open('🔎 No block found', undefined, {
      duration: 3500,
      panelClass: ['snack-error', 'snack-compact'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

}
