import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    private router: Router,
    private backend: BackendService,
    private snackBar: MatSnackBar
  ) { }

  // Try Tx by hash; if not found, try MasterBlock; then PartialBlock.
  async search(hash: string): Promise<void> {
    const trimmed = hash.trim();
    if (!trimmed) return;

    // 1) Transaction (full page)
    const txFound = await this.tryTransaction(trimmed);
    if (txFound) return;

    // 2) MasterBlock (modal)
    const mbFound = await this.tryMasterBlock(trimmed);
    if (mbFound) return;

    // 3) PartialBlock (modal)
    const pbFound = await this.tryPartialBlock(trimmed);
    if (pbFound) return;

    // Nothing matched
    this.showNotFound();
  }

  private async tryTransaction(hash: string): Promise<boolean> {
    try {
      const tx = await firstValueFrom(this.backend.getTransaction(hash));
      if (tx && tx.transactionHash) {
        await this.router.navigate([{ outlets: { modal: ['tx', hash] } }]);
        return true;
      }
    } catch { /* swallow and fall through */ }
    return false;
  }

  private async tryMasterBlock(hash: string): Promise<boolean> {
    try {
      const block = await firstValueFrom(this.backend.getMasterBlock(hash));
      if (block && block.block_hash) {
        await this.router.navigate([{ outlets: { modal: ['mblock', hash] } }]);
        return true;
      }
    } catch { /* swallow */ }
    return false;
  }

  private async tryPartialBlock(hash: string): Promise<boolean> {
    try {
      const pblock = await firstValueFrom(this.backend.getPartialBlock(hash));
      if (pblock && pblock.block_hash) {
        await this.router.navigate([{ outlets: { modal: ['pblock', hash] } }]);
        return true;
      }
    } catch { /* swallow */ }
    return false;
  }

  private showNotFound(): void {
    this.snackBar.open('🔎 No transaction or block found', undefined, {
      duration: 4000,
      panelClass: ['snack-error', 'snack-compact'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
