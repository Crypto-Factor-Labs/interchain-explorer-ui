import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false  // Make sure the pipe is always executed, also when the timestamp is not changed
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    let date: Date;
    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
    }

    return seconds + ' second' + (seconds === 1 ? '' : 's') + ' ago';
  }
}
