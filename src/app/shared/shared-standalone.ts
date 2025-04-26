import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncateMiddlePipe } from './pipes/truncate-middle.pipe';
import { BNHexToDecPipe } from './pipes/bn-hex-to-dec.pipe';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  TimeAgoPipe,
  TruncateMiddlePipe,
  BNHexToDecPipe,
];
