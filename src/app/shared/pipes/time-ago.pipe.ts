import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false // Make sure the pipe is always executed, also when the timestamp is not changed
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined): string {
    if (value == null) return '—';

    // Normalize to milliseconds since epoch
    let ms: number;
    if (value instanceof Date) {
      ms = value.getTime();
    } else if (typeof value === 'number') {
      // Backend uses ms; if it looks like seconds, upscale defensively
      ms = value < 1e12 ? value * 1000 : value;
    } else {
      const s = value.trim();
      if (/^\d+$/.test(s)) {
        const n = Number(s);
        ms = n < 1e12 ? n * 1000 : n;
      } else {
        const parsed = new Date(s).getTime();
        if (Number.isNaN(parsed)) return '—';
        ms = parsed;
      }
    }

    const now = Date.now();
    let seconds = Math.floor((now - ms) / 1000);
    const tense = seconds >= 0 ? 'ago' : 'from now';
    seconds = Math.abs(seconds);

    const fmt = (v: number, unit: string) => `${v} ${unit}${v === 1 ? '' : 's'} ${tense}`;

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return fmt(interval, 'year');

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return fmt(interval, 'month');

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return fmt(interval, 'day');

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return fmt(interval, 'hour');

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return fmt(interval, 'minute');

    return fmt(seconds, 'second');
  }
}
