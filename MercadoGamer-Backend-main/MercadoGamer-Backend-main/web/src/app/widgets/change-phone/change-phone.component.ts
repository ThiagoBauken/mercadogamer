import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
type TypePhoneNunmber = {
  countryCode: string;
  number: string;
};
@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.component.html',
  styleUrls: ['./change-phone.component.scss'],
})
export class ChangePhoneComponent extends BaseComponent implements OnInit {
  phoneNumber: TypePhoneNunmber = { countryCode: '', number: '' };
  currentStep = '';
  error = '';
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCompleted: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {}

  async changePhone(): Promise<void> {
    if (
      !this.phoneNumber.countryCode ||
      !this.phoneNumber.number ||
      String(this.phoneNumber.number).length !== 10
    ) {
      this.error = 'Por favor, confirme su teléfono.';
    } else {
      try {
        const res = await this.pageService.httpPut(
          `${this.settings.endPoints.users}/changePhone/${this.user.id}`,
          {
            phoneNumber: `${this.phoneNumber.countryCode}${this.phoneNumber.number}`,
          }
        );
        console.log('SMS code=>', res.data);
        // this.global.saveUser(res.data);
        this.currentStep = 'verification';
      } catch (error) {
        this.pageService.showError(error);
      }
    }
    // this.pageService.httpPut()
  }

  changePhoneNumber(value): void {
    this.error = '';
    this.phoneNumber = value;
  }

  verificationSms(): void {
    this.onCompleted.emit();
  }
}
