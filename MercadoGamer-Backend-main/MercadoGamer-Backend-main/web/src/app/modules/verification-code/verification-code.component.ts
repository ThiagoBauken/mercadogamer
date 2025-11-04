import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss'],
})
export class VerificationCodeComponent implements OnInit {
  @ViewChildren('inputs') inputs: QueryList<ElementRef>;

  @Input() title = 'Verificación de 2 pasos';
  @Input() description =
    'Esta verificación es necesaria para mantener tu cuenta segura.';
  @Output() confirmAction = new EventEmitter();

  value = [];
  country: any;
  resend = false;

  constructor(public router: Router, public pageService: PageService) {
    this.country = this.pageService.global.load(
      this.pageService.global.settings.storage.country
    );
  }

  ngOnInit(): void {
    this.sendSms();
    this.resend = true;
  }

  async sendSms(): Promise<void> {
    try {
      this.resend = false;
      await this.pageService.httpGet(
        `${this.pageService.global.settings.endPoints.users}/sendSms`
      );
      setTimeout(() => {
        this.resend = true;
      }, 60000);
    } catch (error) {
      this.pageService.showError(error);
      this.resend = true; // Reabilitar em caso de erro
    }
  }

  onKeyup(index): void {
    if (this.value[index - 1]) {
      const array = this.inputs.toArray();
      array[index].nativeElement.focus();
    }
  }

  async confirm(): Promise<void> {
    if (!this.value.every((item) => !!item)) {
      return;
    }
    try {
      const result = await this.pageService.httpPost(
        `${this.pageService.global.settings.endPoints.users}/confirmSms`,
        { sms: this.value.join('') }
      );
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

        if (this.confirmAction.observers.length) {
          this.confirmAction.emit();
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.pageService.showError('Por favor, confirme su código.');
      }
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  getPhoneNumber(): string {
    const phoneNumber = localStorage.getItem(
      this.pageService.global.settings.storage.phoneNumber
    );
    if (phoneNumber && phoneNumber.length > 10) {
      const countryCode = phoneNumber.substring(0, phoneNumber.length - 10);
      const phone = phoneNumber.substring(phoneNumber.length - 10);
      return `(${countryCode}) ${phone.substring(
        0,
        2
      )}-****-**${phone.substring(phone.length - 2)}`;
    } else {
      return 'No phone';
    }
  }

  onFocus(event): void {
    event.target.select();
  }
}
