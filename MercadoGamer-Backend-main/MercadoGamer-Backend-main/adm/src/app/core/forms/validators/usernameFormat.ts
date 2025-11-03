import { FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function usernameFormat(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const REGEX_STR = /^[\u00F1a-zA-Z0-9_.]*$/;
    if (!REGEX_STR.test(String(control.value).toLowerCase())) {
      return { usernameFormat: true };
    }
    return null;
  }

}