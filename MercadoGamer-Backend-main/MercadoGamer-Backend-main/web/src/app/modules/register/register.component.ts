import { Component, OnInit } from '@angular/core';
import { PageService } from '../../core/page.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  currentStep = 0;
  userInfo: { [key: string]: string } = {};
  errors: { [key: string]: string } = {};
  phoneNumber: { [key: string]: string } = { countryCode: '', number: '' };
  sentSms: boolean;
  constructor(public pageService: PageService) {}

  ngOnInit(): void {
    this.errors = {};
  }

  changeValue(key, value): void {
    this.userInfo = { ...this.userInfo, [key]: value };
    delete this.errors[key];
    if (key === 'emailAddress') {
      value !== undefined && this.checkEmail();
    }
  }

  setValue(key: string, value: any): void {
    if (!this.errors) {
      this.errors = {};
    }
    if (key === 'phoneNumber' && this.currentStep) {
      if (!value.countryCode || !value.number) {
        this.errors.phoneNumber = 'Introduce el teléfono';
      } else {
        delete this.errors.phoneNumber;
        this.errors = { ...this.errors };
      }
    }
    this[key] = value;
  }

  checkEmail(): void {
    if (!this.errors) {
      this.errors = {};
    }
    if (this.userInfo.emailAddress) {
      const regex =
        /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;
      if (regex.test(this.userInfo.emailAddress)) {
        delete this.errors.emailAddress;
      } else {
        this.errors = {
          ...this.errors,
          emailAddress: 'El formato del correo electrónico es incorrecto.',
        };
      }
    } else {
      this.errors = {
        ...this.errors,
        emailAddress: 'Por favor introduzca su correo electrónico.',
      };
    }
  }

  checkError(): boolean {
    return this.errors && !!Object.keys(this.errors).length;
  }

  async register(): Promise<void> {
    if (!this.currentStep) {
      if (!this.userInfo.firstName) {
        this.errors.firstName = 'Campo requerido';
      }
      if (!this.userInfo.lastName) {
        this.errors.lastName = 'Campo requerido';
      }
      if (!this.userInfo.username) {
        this.errors.username = 'Campo requerido';
      } else {
        const checkName = await this.pageService.httpGet(
          `${this.pageService.global.settings.endPoints.users}/checkName/${this.userInfo.username}`
        );
        if (!checkName) {
          this.errors.username = 'Nombre de usuario tomado';
        }
      }
      if (this.userInfo.emailAddress) {
        const checkEmail = await this.pageService.httpGet(
          `${this.pageService.global.settings.endPoints.users}/checkEmail/${this.userInfo.emailAddress}`
        );
        if (!checkEmail) {
          this.errors.emailAddress =
            'El correo ya se está utilizando en otra cuenta';
        }
      }
      if (this.checkError()) {
        return;
      }
      this.currentStep++;
    } else {
      if (
        !this.userInfo.password ||
        this.userInfo.password !== this.userInfo.confirm_password
      ) {
        this.errors.confirm_password = 'Por favor confirme la contraseña';
      }
      if (!this.phoneNumber.countryCode || !this.phoneNumber.number) {
        this.errors.phoneNumber = 'Ingresa tu número celular';
      }
      if (!this.userInfo.twoFactor) {
        this.errors.twoFactor = 'Campo requerido';
      }
      if (!this.checkError()) {
        this.userInfo.phoneNumber = `${this.phoneNumber.countryCode}${this.phoneNumber.number}`;
        this.userInfo.country = this.phoneNumber.countryId;
        try {
          const result = await this.pageService.httpPost(
            `${this.pageService.global.settings.endPoints.users}`,
            this.userInfo
          );
          this.savePost(result.data);
        } catch (error) {
          console.log({ error });
          // if (error.status === 500) {
          //   this.errors.twoFactor = error.message;
          // }
          this.pageService.showError(error.error);
        }
      }
    }

    // uploadFile(); : void {
    // this.pageService
    //   .showImageUpload()
    //   .then((res: any) => {
    //     if (res?.data.file) {
    //       this.form.patchValue({ dniPicture: res.data.file });
    //     }
    //   })
    //   .catch((e) => this.pageService.showError(e));
  }

  // onSubmitPerform(item) {
  //   const endPoint = this.settings.endPoints.users;

  //   if (item.password !== item.passwordConfirm) {
  //     return this.pageService.showError('Las contraseñas deben coincidir');
  //   }

  //   this.sent = true;
  //   item.country = this.country.id;

  //   this.pageService
  //     .httpPost(endPoint, item)
  //     .then((res) => this.savePost(res.data))
  //     .catch((e) => this.pageService.showError(e))
  //     .finally(() => (this.sent = false));
  // }

  savePost(item): void {
    this.pageService.global.saveUser(item);
    localStorage.setItem(
      this.pageService.global.settings.storage.token,
      item.token
    );
    this.pageService.showSuccess('Usuario registrado con éxito!');
    this.pageService.navigateRoute('home');
  }

  sendSms(): void {
    if (this.phoneNumber.countryCode && this.phoneNumber.number) {
      this.pageService
        .httpGet(
          `${this.pageService.global.settings.endPoints.users}/sendSms/${this.phoneNumber.countryCode}${this.phoneNumber.number}`
        )
        .then(() => {
          this.sentSms = true;
          setTimeout(() => {
            this.sentSms = false;
          }, 60000);
        })
        .catch((error) => {
          this.pageService.showError(error);
        });
    }
  }
}
