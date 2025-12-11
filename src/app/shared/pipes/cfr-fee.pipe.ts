import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cfrFee',
  standalone: true,
  pure: true,
})
export class CfrFeePipe implements PipeTransform {
  private static readonly DECIMALS = 18;

  transform(value: string | null | undefined): string {
    if (value == null || value === '') return '—';

    // Keep only digits, bail if it’s not valid
    const digits = value.replace(/^0+/, '') || '0';
    const d = CfrFeePipe.DECIMALS;

    let intPart: string;
    let fracPart: string;

    if (digits.length > d) {
      intPart = digits.slice(0, digits.length - d);
      fracPart = digits.slice(-d);
    } else {
      intPart = '0';
      fracPart = digits.padStart(d, '0');
    }

    // Trim trailing zeros in the fractional part
    fracPart = fracPart.replace(/0+$/, '');

    // Optional: add thousands separators to intPart
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const formatted =
      fracPart.length > 0 ? `${intPart}.${fracPart}` : intPart;

    return `${formatted} CFR`;
  }
}
