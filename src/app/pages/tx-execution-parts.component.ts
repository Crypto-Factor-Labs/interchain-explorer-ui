import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ExecutionPart } from '../shared/interfaces/transaction.interface';
import { ExecutionPartDetailsComponent } from '../dialogs/execution-part-details.component';

@Component({
  selector: 'app-tx-execution-parts',
  standalone: true,
  imports: [CommonModule, ExecutionPartDetailsComponent],
  templateUrl: './tx-execution-parts.component.html',
})
export class TxExecutionPartsComponent {
  @Input({ required: true }) epList!: ExecutionPart[];
  @Input() revertEp?: ExecutionPart | null;

  opened = new Set<string>();

  toggleEP(hash: string) {
    if (!hash) return;
    this.opened.has(hash) ? this.opened.delete(hash) : this.opened.add(hash);
  }

  isOpen(hash: string): boolean {
    return this.opened.has(hash);
  }

  shortHash(h: string, len = 8): string {
    if (!h) return '—';
    return h.length <= len ? h : `${h.slice(0, len)}…`;
  }

  trackByHash = (_: number, ep: { hash: string }) => ep.hash;
}
