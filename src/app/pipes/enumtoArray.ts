import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumtoArray'
})
export class EnumtoArrayPipe implements PipeTransform {

  transform(value: any): any {
    console.log("Enum to array pipe");
    console.log(value);

    let keys = [];
    for (var enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        keys.push({key: enumMember, value: value[enumMember]});
      } 
    }
    return keys;

    //return enumType[value].split(/(?=[A-Z])/).join().replace(",", " ");
  }

}
