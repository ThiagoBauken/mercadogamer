import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-mercado-phone-input',
  templateUrl: './mercado-phone-input.component.html',
  styleUrls: ['./mercado-phone-input.component.scss'],
})
export class MercadoPhoneInputComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() error = false;
  @Input() helper = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() hideHelper = false;
  @Input() value: { countryCode: string; number: string | number } = {
    countryCode: '',
    number: '',
  };

  // tslint:disable-next-line: no-output-native
  @Output() valueChange: EventEmitter<{
    countryId: string;
    countryCode: string;
    number: string;
    phoneNumber: string;
  }> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFocus: EventEmitter<FocusEvent> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onBlur: EventEmitter<FocusEvent> = new EventEmitter();

  // variables
  global: GlobalService;
  countryCode = '';
  number = '';
  countries: { [k: string]: any }[];

  defaultCountries = [
    {
      name: 'Chile',
      phoneCode: '+56',
      url: `https://flagcdn.com/w40/cl.png`,
    },
    {
      name: 'Brazil',
      phoneCode: '+55',
      url: `https://flagcdn.com/w40/br.png`,
    },
    {
      name: 'Uruguay',
      phoneCode: '+598',
      url: `https://flagcdn.com/w40/uy.png`,
    },
  ];

  constructor(public pageService: PageService) {
    this.global = pageService.global;
  }

  ngOnInit(): void {
    this.getCountries();
  }

  async getCountries(): Promise<void> {
    try {
      const endPoint = this.pageService.global.settings.endPoints.countries;
      const res = await this.pageService.httpGet(endPoint);
      this.countries = res.data
        .filter((item) => !!item.picture)
        .concat(this.defaultCountries);
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  getSelectedCountry(phoneCode: string): any {
    return this.countries?.find((country) => country.phoneCode === phoneCode);
  }

  onChange(key: string, value: string | number): void {
    this[key] = value;
    this.valueChange.emit({
      countryId: this.getSelectedCountry(this.countryCode)?.id,
      countryCode: this.countryCode,
      number: this.number,
      phoneNumber: `${this.countryCode}${this.number}`,
    });
  }
}
