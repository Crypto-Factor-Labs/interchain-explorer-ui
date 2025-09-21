import { Component, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger, AnimationEvent } from '@angular/animations';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { TruncateMiddlePipe } from '../../shared/pipes/truncate-middle.pipe';

@Component({
  selector: 'app-masterblocks-panel',
  templateUrl: './masterblocks-panel.component.html',
  styleUrls: ['./masterblocks-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, TruncateMiddlePipe],

  // Animations for expanding/collapsing blocks and staggering partial block info
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(-4px)', overflow: 'hidden' }),
        animate('220ms cubic-bezier(0.2,0,0,1)', style({ height: '*', opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate('180ms cubic-bezier(0.4,0,0.2,1)', style({ height: 0, opacity: 0, transform: 'translateY(-4px)' })),
      ]),
    ]),
    trigger('staggerItems', [
      transition(':enter', [
        query('.partial-block-info', [
          style({ opacity: 0, transform: 'translateY(6px)' }),
          stagger(30, animate('160ms ease-out', style({ opacity: 1, transform: 'none' }))),
        ], { optional: true })
      ])
    ]),
  ],
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

  // Animation EventHandler: automatically scroll expanded blocks in view
  // Reference to the list container for scrolling
  @ViewChild('blockListRef', { static: false }) listRef?: ElementRef<HTMLDivElement>;

  onExpandDone(e: AnimationEvent) {
    // Only on expand (not collapse)
    if (e.toState === 'void') return;

    const target = e.element as HTMLElement;

    // Prefer scrolling the panel’s own scrollable container
    const container = this.listRef?.nativeElement;
    if (container) {
      // Scroll just enough so the expanded section is fully visible
      const c = container.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      const isBelow = t.bottom > c.bottom;
      const isAbove = t.top < c.top;

      if (isBelow || isAbove) {
        const offset = 8; // small padding
        const delta = isBelow ? (t.bottom - c.bottom + offset) : (t.top - c.top - offset);
        container.scrollTo({ top: container.scrollTop + delta, behavior: 'smooth' });
      }
      return;
    }

    // Fallback: scroll in the page
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}
