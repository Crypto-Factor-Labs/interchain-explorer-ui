import { Pipe, PipeTransform } from '@angular/core';
import BN from 'bn.js';

@Pipe({
  name: 'bnHexToDec',
  standalone: true
})
export class BNHexToDecPipe implements PipeTransform {
  transform(value: BN): number {
    if (!value) {
      return 0;
    }

    // Assume the BN to be in hexadecimal format.
    // Parse the hexadecimal value as a base-16 number, resulting in a decimal number.
    const hexString = value.toString(16);
    return parseInt(hexString, 16);
  }
}
