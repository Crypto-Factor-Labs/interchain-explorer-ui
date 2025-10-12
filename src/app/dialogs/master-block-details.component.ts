import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { MasterChainBlock } from '../shared/interfaces/master-chain.interface';

@Component({
  selector: 'app-master-block-details',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './master-block-details.component.html',
  styleUrls: ['./master-block-details.component.scss'],
})
export class MasterBlockDetailsComponent {
  @Input({ required: true }) masterBlock!: MasterChainBlock;
}
