import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import type { PartialChainBlock } from '../shared/interfaces/master-chain.interface';

@Component({
  selector: 'app-partial-block-details',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './partial-block-details.component.html',
  styleUrls: ['./partial-block-details.component.scss'],
})
export class PartialBlockDetailsComponent {
  @Input({ required: true }) partialBlock!: PartialChainBlock;
}
