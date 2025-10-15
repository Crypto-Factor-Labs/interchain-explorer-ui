import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { PartialChainBlock } from '../shared/interfaces/master-chain.interface';

@Component({
  selector: 'app-partialblock-details',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './partialblock-details.component.html',
  styleUrls: ['./partialblock-details.component.scss'],
})
export class PartialBlockDetailsComponent {
  @Input({ required: true }) partialBlock!: PartialChainBlock;
}
