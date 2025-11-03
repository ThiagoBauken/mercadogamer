import { Directive } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Directive({ selector: "[formPage]" })
export abstract class FormPage {
  form: any = {};
  formSubmitAttempt = false;

  constructor(public formBuilder: FormBuilder) {
    this.form = this.getFormNew();
  }

  getFormNew() {
    return this.formBuilder.group({});
  }

  formValidated() {
    this.formSubmitAttempt = true;
    return this.form.valid;
  }

  formReset() {
    this.form.reset();
    this.formSubmitAttempt = false;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onSubmit() {
    if (this.formValidated()) {
      this.onSubmitPerform(this.form.value);
    } else {
      this.validateAllFormFields(this.form); //{7}
    }
  }

  abstract onSubmitPerform(item);

  // isFieldValid(field) {
  //   if (!this.form.controls[field]) return true;
  //   return (
  //     (!this.form.controls[field].valid && this.form.controls[field].touched)
  //     ||
  //     (this.form.controls[field].untouched && this.formSubmitAttempt)
  //   );
  // }

  isFieldValid(field) {
    if (!this.form.controls[field]) return true;
    if (!this.form.controls[field].valid && this.form.controls[field].touched)
      return false;
    if (this.form.controls[field].untouched && this.formSubmitAttempt)
      return true;
    return true;
  }

  getFieldError(field) {
    let message: any = "Validación OK.";
    if (this.form.controls[field]) {
      if (this.form.controls[field].errors) {
        let error = this.form.controls[field].errors;
        if (error.required) message = "Campo obligatorio.";
        else if (error.minlength)
          message = `Ingresar al menos ${error.minlength.requiredLength} caracteres.`;
        else if (error.maxlength)
          message = `Ingresar menos de ${error.maxlength.requiredLength} caracteres.`;
        else if (error.minYear)
          message = `Debe ser mayor a ${error.minYear.requiredYear} años.`;
        else if (error.min)
          message = `Debe ser mayor o igual a ${error.min.min}`;
        else if (error.max)
          message = `El valor permitido es hasta ${error.max.max}`;
        else if (error.mailFormat) message = "El email no es válido.";
        else if (error.dniFormat) message = "El DNI no es válido.";
        else if (error.usernameFormat)
          message = `
            Caracteres permitidos:
            a-z A-Z 0-9 . _
          `;
        else message = JSON.stringify(error);
      }
    }
    return message;
  }
}
