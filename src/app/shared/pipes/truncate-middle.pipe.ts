import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateMiddle',
  standalone: true
})
export class TruncateMiddlePipe implements PipeTransform {
  transform(value: string | null | undefined, firstLastCount: number = 6): string {
    if (value == null) return '';

    // If the value is too short to format, just return it.
    if (value.length <= firstLastCount * 2) {
      return value;
    }

    const start = value.slice(0, firstLastCount);
    const end = value.slice(-firstLastCount);

    return `${start}...${end}`;
  }
}
