import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncateMiddlePipe } from './pipes/truncate-middle.pipe';
import { BNHexToDecPipe } from './pipes/bn-hex-to-dec.pipe';

@NgModule({
  declarations: [TimeAgoPipe, TruncateMiddlePipe, BNHexToDecPipe],
  imports: [CommonModule, MatDialogModule],
  exports: [TimeAgoPipe, TruncateMiddlePipe, BNHexToDecPipe]  // Export so that other modules can use it
})
export class SharedModule { }
