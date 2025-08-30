import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BNHexToDecPipe } from './pipes/bn-hex-to-dec.pipe';
import { FilterExecPartsByStatePipe } from './pipes/filter-exec-parts-by-state.pipe';
import { TxStateWordPipe } from './pipes/state-to-word.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncateMiddlePipe } from './pipes/truncate-middle.pipe';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  BNHexToDecPipe,
  FilterExecPartsByStatePipe,
  TxStateWordPipe,
  TimeAgoPipe,
  TruncateMiddlePipe,
];
