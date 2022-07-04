import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number'
})
export class NumberPipe implements PipeTransform {

  transform(value: string | null, ...args: unknown[]): number {
    const stringNum: string = value ?
      this.valueNumber(value) !== '' ?
        this.valueNumber(value)
        : '0'
      :'0'
    return parseInt(stringNum);
  }

  valueNumber(value: string): string {
    return value
      .replace(/([^-\d]|(?<=.)-|-(?!(\d|\$0*[1-9])))/g, '')
      .replace(/(?<=^-?)0+/, '');
  }

}
