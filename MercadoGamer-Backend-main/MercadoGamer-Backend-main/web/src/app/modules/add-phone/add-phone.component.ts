import { Component, OnInit } from '@angular/core';
import { PageService } from 'src/app/core/page.service';

type TypePhoneNunmber = {
  countryCode: string;
  number: string;
};

@Component({
  selector: 'app-add-phone',
  templateUrl: './add-phone.component.html',
  styleUrls: ['./add-phone.component.scss'],
})
export class AddPhoneComponent implements OnInit {
  phoneNumber: TypePhoneNunmber = { countryCode: '', number: '' };
  validated = false;
  constructor(public pageService: PageService) {}

  ngOnInit(): void {}

  changePhoneNumber(value): void {
    this.phoneNumber = value;
    if (this.phoneNumber.countryCode && this.phoneNumber.number) {
      this.validated = true;
    } else {
      this.validated = false;
    }
  }

  async changePhone(): Promise<void> {
    try {
      const res = await this.pageService.httpPut(
        `${this.pageService.global.settings.endPoints.users}`,
        {
          phoneNumber: `${this.phoneNumber.countryCode}${this.phoneNumber.number}`,
        }
      );
      localStorage.setItem(
        this.pageService.global.settings.storage.phoneNumber,
        res.phoneNumber
      );
      this.pageService.navigateRoute('verification-code');
    } catch (error) {
      this.pageService.showError(error);
    }
  }
}
