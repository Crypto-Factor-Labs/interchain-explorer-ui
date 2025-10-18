import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-tx-page-icon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './open-tx-page-icon.component.html',
})
export class OpenTxPageIconComponent {
  /** Transaction hash to link to */
  @Input({ required: true }) txHash!: string;

  /**
   * If provided, the EP hash will be added as a query param (?ep=...)
   * Useful when linking from an EP dialog.
   */
  @Input() epHash?: string;

  /**
   * Controls visibility explicitly. Defaults to: visible only when used inside a MatDialog.
   * Set to true to force-show on pages; set to false to hide even in dialogs.
   */
  @Input() show?: boolean;

  /** Fires before navigation so parents (dialogs) can close. */
  @Output() beforeNavigate = new EventEmitter<void>();

  // Auto-detect if we’re inside a dialog
  constructor(@Optional() private dialogRef?: MatDialogRef<unknown>) { }

  get shouldShow(): boolean {
    // If consumer specified show, respect it. Otherwise, show only in dialogs.
    return this.show ?? !!this.dialogRef;
  }

  onClick() {
    this.beforeNavigate.emit();
  }
}
