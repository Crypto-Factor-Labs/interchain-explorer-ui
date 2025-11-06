import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ChainEventDto, ChainEvents } from '../../shared/interfaces/chain-events.interface';
import {
  getEvents as _getEvents,
  getStepTitle as _getStepTitle,
  hasStepTx as _hasStepTx,
  getStepTxHash as _getStepTxHash,
} from '../../shared/utils/ep-progress';
import { openExternalTx } from '../../shared/utils/external-explorer.util';

type EventsLike = ReadonlyArray<ChainEventDto> | ChainEvents | null | undefined;

@Component({
  selector: 'app-ep-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ep-progress.component.html',
  styleUrls: ['./ep-progress.component.scss'],
})
export class EpProgressComponent {
  @Input({ required: true }) chainId!: number | null | undefined;
  @Input({ required: true }) events!: EventsLike;

  // Expose utils for template
  readonly getStepTitle = (i: number) =>
    _getStepTitle(this.chainId ?? 0, this.events, i);

  readonly hasStepTx = (i: number) => _hasStepTx(this.events, i);

  onStepClick(i: number, ev: Event) {
    ev.stopPropagation();
    const txHash = _getStepTxHash(this.events, i);
    if (!txHash || this.chainId == null) return;
    openExternalTx(this.chainId, txHash);
  }

  // In case an EP is passed instead of events:
  getEvents(ep: any): EventsLike { return _getEvents(ep); }
}
