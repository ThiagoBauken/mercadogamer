import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  // variables
  password = '';
  confirmPassword = '';
  error = '';

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCompleted: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {}

  async changePassword(): Promise<void> {
    if (this.password !== this.confirmPassword || !this.password) {
      this.error = 'Por favor, confirme la nueva contraseña.';
    } else {
      try {
        await this.pageService.httpPut(
          `${this.pageService.global.settings.endPoints.users}/changePassword/${this.user.id}`,
          {
            passwordNew: this.password,
            passwordNewVerify: this.confirmPassword,
          }
        );
        this.pageService.showSuccess(
          'Su contraseña ha sido cambiada exitosamente.'
        );
        this.onCompleted.emit();
      } catch (error) {
        this.pageService.showError(error);
      }
    }
  }
}
