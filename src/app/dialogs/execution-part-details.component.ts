import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import { ExecutionPart as CoreEP } from '../shared/interfaces/transaction.interface';

// Allow optional isRevert without touching the core model
type EP = CoreEP & { isRevert?: boolean };

@Component({
  selector: 'app-execution-part-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ...SHARED_IMPORTS],
  templateUrl: './execution-part-details.component.html',
  styleUrls: ['./execution-part-details.component.scss'],
})
export class ExecutionPartDetailsComponent {
  @Input({ required: true }) ep!: EP;
  @Output() openTx = new EventEmitter<void>();

  get isRevert() { return !!this.ep?.isRevert; }

  // TEMPORARY: naive status derivation
  get statusLabel(): string {
    const ep = this.ep;
    if (!ep) return '—';
    // naive derivation — adjust later when you share exact event/result rules
    if ((ep as any).targetChainExecutionEvent) return 'Executed';
    if ((ep as any).targetChainPublishEvent) return 'Published';
    if ((ep as any).targetChainSchedulingEvent) return 'Scheduled';
    if ((ep as any).mempoolEpochCommitEvent) return 'Committed';
    return '—';
  }

}
