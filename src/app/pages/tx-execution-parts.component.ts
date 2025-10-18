import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ExecutionPart } from '../shared/interfaces/transaction.interface';
import { ExecutionPartDetailsComponent } from '../dialogs/execution-part-details.component';

@Component({
  selector: 'app-tx-execution-parts',
  standalone: true,
  imports: [CommonModule, ExecutionPartDetailsComponent],
  templateUrl: './tx-execution-parts.component.html',
  styleUrls: ['./tx-execution-parts.component.scss'],
})
export class TxExecutionPartsComponent {
  // Backing fields + guards so nothing crashes if inputs arrive out of order
  private _epList: ExecutionPart[] = [];
  private _revertEp: ExecutionPart | null = null;
  private _initialEpHash: string | null = null;
  private _initialApplied = false;

  @Input({ required: true })
  set epList(epList: ExecutionPart[] | null | undefined) {
    this._epList = epList ?? [];
    this.tryOpenInitialEp();
  }
  get epList() { return this._epList; }

  @Input()
  set revertEp(revertEp: ExecutionPart | null | undefined) {
    this._revertEp = revertEp ?? null;
    this.tryOpenInitialEp();
  }
  get revertEp() { return this._revertEp; }

  @Input()
  set initialOpenEpHash(hash: string | null | undefined) {
    this._initialEpHash = (hash ?? null);
    this.tryOpenInitialEp();
  }

  opened = new Set<string>();

  private tryOpenInitialEp() {
    // Nothing to do yet?
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

  shortHash(h: string, len = 8) {
    return !h ? '—' : h.length <= len ? h : `${h.slice(0, len)}…`;
  }

  trackByHash = (_: number, ep: { hash: string }) => ep.hash;
}
