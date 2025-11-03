import { Pipe, PipeTransform } from '@angular/core';
import { Settings } from '../../../app.settings';

@Pipe({
  name: 'toUSD',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number): string | number {
    if (typeof value !== 'number') {
      value = Number(value) ?? 0;
    }
    // tslint:disable-next-line: use-isnan
    if (value === NaN) {
      value = 0;
    }
    const country = JSON.parse(localStorage.getItem(Settings.storage.country));
    return country ? (value / country.toUSD).toFixed(2) : value;
  }
}
