import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mailFormat(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      let emailRE = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      if(!emailRE.test(String(control.value).toLowerCase())) {
        return { mailFormat: true };
      }
      return null;
    }

}
