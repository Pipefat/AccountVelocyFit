import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'envelope'
})
export class EnvelopePipe implements PipeTransform {

  transform(sales: number, color: 'green' | 'red'): number {
    if (color === 'green') {
      return Math.floor((sales * 0.4) / 100) * 100;
    } else {
      return Math.ceil((sales * 0.6) / 100) * 100;
    }
  }

}
