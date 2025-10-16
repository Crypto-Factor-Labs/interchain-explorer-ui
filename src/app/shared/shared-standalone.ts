import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { AsDashPipe } from './pipes/as-dash.pipe';
import { BNHexToDecPipe } from './pipes/bn-hex-to-dec.pipe';
import { FilterExecPartsByStatePipe } from './pipes/filter-exec-parts-by-state.pipe';
import { TxStateWordPipe } from './pipes/state-to-word.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncateMiddlePipe } from './pipes/truncate-middle.pipe';
import { CopyIconComponent } from '../shared/utils/copy-icon.component';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  CdkCopyToClipboard,
  AsDashPipe,
  BNHexToDecPipe,
  FilterExecPartsByStatePipe,
  TxStateWordPipe,
  TimeAgoPipe,
  TruncateMiddlePipe,
  CopyIconComponent,
];
