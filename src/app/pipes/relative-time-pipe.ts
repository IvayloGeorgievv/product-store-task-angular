import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string): string {
    if(!value) return '';

    const date = new Date(value);
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if(elapsedSeconds < 60) {
      return 'Just now';
    }

    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (elapsedMinutes < 60) {
      return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if(elapsedHours < 24) {
      return `${elapsedHours} hour${elapsedHours === 1 ? '' : 's'} ago`;
    }

    const elapsedDays = Math.floor(elapsedHours / 24);
    if(elapsedDays < 7) {
      return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
    }

    return date.toLocaleDateString();
  }
}
