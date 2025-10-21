import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { MasterChainBlock } from '../shared/interfaces/master-chain.interface';

@Component({
  selector: 'app-masterblock-details',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './masterblock-details.component.html',
  styleUrls: ['./masterblock-details.component.scss'],
})
export class MasterBlockDetailsComponent {
  @Input({ required: true }) masterBlock!: MasterChainBlock;
}
