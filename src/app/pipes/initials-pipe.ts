import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(value: string): any {
    console.log("Enum to string pipe");

    return value.split(' ').map(n => n[0]).join('').toUpperCase();

  }

}
