import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) { }

  // Type-safe open: component + data in, dialogRef out
  openDialog<T, D = unknown, R = unknown>(
    component: ComponentType<T>,
    data: D,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    const base: MatDialogConfig<D> = {
      data,
      // UX defaults
      autoFocus: false,          // don’t steal focus from the page
      restoreFocus: true,        // return focus on close
      closeOnNavigation: true,
      disableClose: true,        // keep your current behavior
      panelClass: 'custom-dialog',
      backdropClass: 'custom-light-backdrop',
      width: 'auto',
      maxWidth: '90vw',          // responsive
      maxHeight: '85vh',         // avoid off-screen
      position: { top: '110px' },
    };

    return this.dialog.open(component, { ...base, ...(config ?? {}) });
  }
}
