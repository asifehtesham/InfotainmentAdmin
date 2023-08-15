import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time_duration'
})
export class TimeDurationPipe implements PipeTransform {
  transform(value: Date): string {
    var today = new Date();

    if (typeof (value) === 'string') {
      value = new Date(value);
    }

    var Time = today.getTime() - value.getTime();
    var Days = Time / (1000 * 3600 * 24); //Diference in Days

    if (Days > 365) {
      return (Days / 365).toFixed(0) + ' year(s) before';

    } else if (Days > 30) {
      return (Days / 30).toFixed(0) + ' month(s) before';
    } else if (Days > 7) {
      return (Days / 7).toFixed(0) + ' week(s) before';
    }
    else {
      return Days.toFixed(0) + ' days before';
    }
  }
}