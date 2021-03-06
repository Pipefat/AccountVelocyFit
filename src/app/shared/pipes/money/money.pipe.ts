import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe){}

  transform(value: string | number, withoutSymbol?: boolean): string {
    const number = typeof(value) === 'number' ? Math.floor(value).toString() : value;
    const currency = this.currencyPipe.transform(
      number.replace(/([^-\d]|(?<=.)-|-(?!(\d|\$0*[1-9])))/g, '').replace(/(?<=^-?)0+/, ''),
      '$',
      'symbol',
      '1.0-0'
    );
    const currencyDots = currency ? currency.replace(/,/g, '.') : '';

    return withoutSymbol ? currencyDots.replace(/\$/g, '') : currencyDots;
  }

}
