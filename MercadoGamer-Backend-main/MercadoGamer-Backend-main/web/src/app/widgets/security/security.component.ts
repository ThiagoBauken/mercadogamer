import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';

type TypeActionStatus = 'password' | 'phone' | '';
type TypeCurrentStep = '' | 'verification' | 'change-password' | 'change-phone';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent extends BaseComponent implements OnInit {
  actionStatus: TypeActionStatus = '';
  currentStep: TypeCurrentStep = '';

  ngOnInit(): void {}

  setActionStatus(status: TypeActionStatus): void {
    this.actionStatus = status;
    this.currentStep = 'verification';
  }

  confirmAction(): void {
    if (this.currentStep === 'verification') {
      if (this.actionStatus === 'password') {
        this.currentStep = 'change-password';
      } else if (this.actionStatus === 'phone') {
        this.currentStep = 'change-phone';
      }
    } else {
    }
  }

  successChangePassword(): void {
    this.actionStatus = '';
    this.currentStep = '';
  }

  async setVerification(status: boolean): Promise<void> {
    try {
      if (status !== this.user.verificationSms) {
        const response = await this.pageService.httpPut(
          `${this.settings.endPoints.users}/${this.user.id}`,
          { verificationSms: status }
        );
        this.user = response.data;
        this.global.saveUser(this.user);
      }
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  getPhoneNumber(): string {
    const phoneNumber = this.user.phoneNumber;
    if (phoneNumber.length > 10) {
      return phoneNumber.replace(
        /([+]\d{2})(\d*)(\d{4})\d{2}(\d{2})$/,
        '($1) $2-****-**$4'
      );
    } else {
      return 'No phone';
    }
  }
}
