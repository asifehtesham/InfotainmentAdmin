import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minuteorhour'
  })
  export class MinuteOrHourPipe implements PipeTransform {
    transform(value: number): string {
       if(value > 0 && value/60 < 1) {
         return value + ' m';
  
       } else {
         return (value/60).toFixed(2) + ' h';
       }
    }
  }