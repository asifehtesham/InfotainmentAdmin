// import { Time } from '@angular/common';
import { DateTime } from 'luxon';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value: DateTime): string {
    if (value === null)
      return "no value";

    return (value.hour ? value.hour : "00") + ":" + (value.minute ? value.minute : "00");

  }
}