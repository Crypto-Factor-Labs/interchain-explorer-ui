import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { ExecutionPart } from '../../shared/interfaces/transaction.interface';
import { SHARED_IMPORTS } from '../../shared/shared-standalone';
import { ExecutionPartDetailsComponent } from '../../dialogs/execution-part-details.component';
import { getChainImage } from '../../shared/utils/common.utils';
import { expandCollapse } from '../../shared/utils/animations';

@Component({
  selector: 'app-tx-execution-parts',
  standalone: true,
  imports: [CommonModule, ExecutionPartDetailsComponent, ...SHARED_IMPORTS],
  animations: [expandCollapse],
  templateUrl: './tx-exec-parts.component.html',
  styleUrls: ['./tx-exec-parts.component.scss'],
})
export class TxExecutionPartsComponent {
  // Backing fields + guards so nothing crashes if inputs arrive out of order
  private _epList: ExecutionPart[] = [];
  private _revertEp: ExecutionPart | null = null;
  private _initialEpHash: string | null = null;
  private _initialApplied = false;

  constructor(private router: Router) { }

  @Input({ required: true })
  set epList(epList: ExecutionPart[] | null | undefined) {
    this._epList = epList ?? [];
    this.tryOpenInitialEp();
  }
  get epList(): ExecutionPart[] {
    return this._epList;
  }

  @Input()
  set revertEp(revertEp: ExecutionPart | null | undefined) {
    this._revertEp = revertEp ?? null;
    this.tryOpenInitialEp();
  }
  get revertEp(): ExecutionPart | null {
    return this._revertEp;
  }

  @Input()
  set initialOpenEpHash(hash: string | null | undefined) {
    this._initialEpHash = hash ?? null;
    this.tryOpenInitialEp();
  }

  opened = new Set<string>();

  private tryOpenInitialEp() {
    if (this._initialApplied || !this._initialEpHash || this._epList.length === 0) return;

    const targetHash = this._initialEpHash.trim();
    const existsInList = this._epList.some(ep => ep?.hash === targetHash);
    const isRevertMatch = this._revertEp?.hash === targetHash;

    if (existsInList || isRevertMatch) {
      this.opened.add(targetHash);
      this._initialApplied = true;
    }
  }

  toggleEP(hash: string) {
    if (!hash) return;
    this.opened.has(hash) ? this.opened.delete(hash) : this.opened.add(hash);
  }

  isOpen(hash: string) {
    return this.opened.has(hash);
  }

  trackByHash = (_: number, ep: { hash: string }) => ep.hash;

  logoSrc(chainId: number): string {
    return getChainImage(chainId);
  }

  onOpenPartialBlock(hash: string) {
    this.router.navigate([{ outlets: { modal: ['pblock', hash] } }]);
  }
}
