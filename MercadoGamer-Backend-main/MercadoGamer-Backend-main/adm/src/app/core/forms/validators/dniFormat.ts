import { FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function dniFormat(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const REGEX_DNI = /^\d{8}(?:[-\s]\d{4})?$/;
    if (!REGEX_DNI.test(String(control.value))) {
      return { dniFormat: true };
    }
    return null;
  }

}