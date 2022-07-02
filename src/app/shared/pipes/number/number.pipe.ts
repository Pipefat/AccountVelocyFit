import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number'
})
export class NumberPipe implements PipeTransform {

  transform(value: string | null, ...args: unknown[]): number {
    const stringNum: string = value ?
      value.replace(/([^-\d]|(?<=.)-)/g, '').replace(/^0+/, '') !== '' ?
        value.replace(/([^-\d]|(?<=.)-)/g, '').replace(/^0+/, '')
        : '0'
      :'0'
    return parseInt(stringNum);
  }

}
