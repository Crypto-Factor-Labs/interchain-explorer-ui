import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'asDash', standalone: true })
export class AsDashPipe implements PipeTransform {
  transform<T>(v: T | null | undefined, empty: string = '—'): T | string {
    return (v === null || v === undefined || v === '') ? empty : (v as T);
  }
}
