import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncateMiddlePipe } from './pipes/truncate-middle.pipe';

@NgModule({
  declarations: [TimeAgoPipe, TruncateMiddlePipe],
  imports: [CommonModule],
  exports: [TimeAgoPipe, TruncateMiddlePipe]  // Export so that other modules can use it
})
export class SharedModule { }
