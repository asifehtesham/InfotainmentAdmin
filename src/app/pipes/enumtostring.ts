import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumtostring'
})
export class EnumtostringPipe implements PipeTransform {

  transform(value: number, enumType: any): any {
    console.log("Enum to string pipe");
    console.log(enumType);
    return enumType[value].split(/(?=[A-Z])/).join().replace(",", " ");
  }

}
