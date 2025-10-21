import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
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

  constructor(@Optional() private dialogRef?: MatDialogRef<unknown>) { }

  get isRevert() { return !!this.ep?.isRevert; }

  // TEMPORARY: naive status derivation, to be replaced later by 'dots' (?)
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

  get showOpenTxIcon(): boolean {
    return !!this.dialogRef; // true in Tx-dialog, false on Tx-page
  }
}
