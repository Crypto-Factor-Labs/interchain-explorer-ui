import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { TruncateMiddlePipe } from '../../shared/pipes/truncate-middle.pipe';

@Component({
  selector: 'app-masterblocks-panel',
  templateUrl: './masterblocks-panel.component.html',
  styleUrls: ['./masterblocks-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, TruncateMiddlePipe]
})
export class MasterBlocksPanelComponent {
  // Data
  @Input() masterBlocks: any[] = [];
  @Input() expandedBlocks: Record<string, boolean> = {};
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pollingActive = true;

  // Helpers (optionally passed from parent)
  @Input() getChainImage!: (chainId: number | string) => string;
  @Input() trackByBlockHash!: (index: number, block: any) => any;

  // Events
  @Output() togglePolling = new EventEmitter<void>();
  @Output() openMasterBlock = new EventEmitter<any>();
  @Output() openPartialBlock = new EventEmitter<any>();
  @Output() togglePartialBlocks = new EventEmitter<string>(); // block_hash
  @Output() pageChange = new EventEmitter<number>(); // new page number
}
