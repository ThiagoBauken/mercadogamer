import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/base.component';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from '../../core/page.service';

@Component({
  selector: 'app-select-country',
  templateUrl: './select-country.component.html',
  styleUrls: ['./select-country.component.scss'],
})
export class SelectCountryComponent extends BaseComponent implements OnInit {
  countries: { [k: string]: any }[];
  selectedCountry: any = 'select';

  ngOnInit(): void {
    this.getCountries();
  }

  async getCountries(): Promise<void> {
    try {
      const endPoint = this.settings.endPoints.countries;
      const res = await this.pageService.httpGet(endPoint);
      this.countries = res.data.filter((item) => !!item.picture);
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  goToHome(): void {
    this.global.save(this.settings.storage.country, this.selectedCountry);
    this.pageService.navigateRoute('home');
  }
}
