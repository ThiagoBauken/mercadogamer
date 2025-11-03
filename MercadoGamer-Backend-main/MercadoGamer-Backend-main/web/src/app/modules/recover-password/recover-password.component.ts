import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent extends BaseComponent {
  sent: boolean;

  getFormNew() {
    return this.formBuilder.group({
      username: [null, Validators.required],
    });
  }

  onSubmitPerform(item) {
    const endPoint =
      this.settings.endPoints.users +
      this.settings.endPointsMethods.users.recoveryPassword +
      '/' +
      item.username;

    this.sent = true;

    this.pageService
      .httpPost(endPoint, {})
      .then((res) => this.savePost(res.data))
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.sent = false));
  }

  savePost(item) {
    this.pageService.showSuccess('Nueva contraseña enviada a su email!');
    this.pageService.navigateRoute('login');
  }
}
