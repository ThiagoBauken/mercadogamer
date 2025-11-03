import { Pipe, PipeTransform } from '@angular/core';
import { Settings } from '../../../app.settings';

@Pipe({
  name: 'toUSD'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number, country?: {[k: string]: any}, toUSD?: number): string | number {

    if (!country && !toUSD) return value;

    return country ? (value / country.toUSD).toFixed(2) : (value / toUSD).toFixed(2);
  }

}
