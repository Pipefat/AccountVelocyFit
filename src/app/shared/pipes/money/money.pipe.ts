import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe){}

  transform(value: string | number, ...args: unknown[]): string {
    const number = typeof(value) === 'number' ? Math.floor(value).toString() : value;
    const currency = this.currencyPipe.transform(number.replace(/([^-\d]|(?<=.)-)/g, '').replace(/^0+/, ''), '$', 'symbol', '1.0-0');
    return currency ? currency.replace(/,/g, '.') : '';
  }

}
