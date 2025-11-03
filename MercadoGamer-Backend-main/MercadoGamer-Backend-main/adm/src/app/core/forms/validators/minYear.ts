import { FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export function minYear(requiredYear: number): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    let birthdayDate = moment(control.value);
    let years = moment().diff(birthdayDate, 'years');
    if (years < requiredYear) {
        return {minYear: {requiredYear: requiredYear} }
    }
    return null;
  }

}
