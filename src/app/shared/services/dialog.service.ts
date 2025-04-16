import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) { }

  openDialog(component: any, data: any): void {
    this.dialog.open(component, {
      data,
      width: 'auto',
      panelClass: 'custom-dialog',
      backdropClass: 'custom-light-backdrop',
      disableClose: true,
      position: {
        top: '110px'
      }
    });
  }
}
