import { Component, OnInit, SimpleChange } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/base.component';
import { PageService } from '../../core/page.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  sent: boolean;
  username = '';
  password = '';
  errors: { [key: string]: string } = {};
  submitError = '';

  ngOnInit(): void {
    localStorage.removeItem(this.settings.storage.user);
    localStorage.removeItem(this.settings.storage.token);
    localStorage.removeItem(this.settings.storage.phoneNumber);
  }

  async onSubmit(): Promise<void> {
    this.errors = {};
    if (!this.username) {
      this.errors.username = 'Por favor, introduzca su nombre de usuario.';
    }
    if (!this.password) {
      this.errors.password = 'Introduzca su contraseña de usuario.';
    }

    if (Object.keys(this.errors).length) {
      return;
    }

    try {
      const endPoint = `${this.settings.endPoints.users}${this.settings.endPointsMethods.users.login}`;
      const res = await this.pageService.httpPost(endPoint, {
        username: this.username,
        password: this.password,
      });
      this.savePost(res);
    } catch (error) {
      if (error.status === 401) {
        this.submitError = 'Su nombre de usuario y contraseña incorrectos.';
      }
    }
  }

  savePost(item): void {
    localStorage.setItem(this.settings.storage.token, item.token);
    if (item.phoneNumber) {
      localStorage.setItem(this.settings.storage.phoneNumber, item.phoneNumber);
      this.pageService.showSuccess('Bienvenido!');
      item.verificationSms
        ? this.pageService.navigateRoute('verification-code')
        : this.confirm(item);
    } else {
      this.pageService.navigateRoute('add-phone');
    }
  }

  async confirm(result): Promise<void> {
    try {
      if (result) {
        localStorage.setItem(
          this.pageService.global.settings.storage.app_version,
          this.pageService.global.settings.APP_VERSION
        );
        if (result.country !== this.country.id) {
          const endPoint = this.pageService.global.settings.endPoints.countries;

          this.pageService
            .httpGetById(endPoint, result.country)
            .then((res) =>
              this.pageService.global.save(
                this.pageService.global.settings.storage.country,
                res.data
              )
            )
            .catch((e) => this.pageService.showError(e));
        }

        this.pageService.global.saveUser(result);
        this.pageService.navigateRoute('home');
      } else {
        this.pageService.showError('Por favor, confirme su código.');
      }
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  goToRegister(): void {
    this.pageService.navigateRoute('register');
  }

  changeValue(field: string, value: string): void {
    if (value) {
      delete this.errors[field];
    }
    this[field] = value;
  }
}
