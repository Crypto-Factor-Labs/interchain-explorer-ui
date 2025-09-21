import { Pipe, PipeTransform } from '@angular/core';
import { txStateToWord } from '../utils/common.utils';

@Pipe({ name: 'txStateWord', standalone: true })
export class TxStateWordPipe implements PipeTransform {
  transform(state: number | null | undefined): string {
    return txStateToWord(state);
  }
}
