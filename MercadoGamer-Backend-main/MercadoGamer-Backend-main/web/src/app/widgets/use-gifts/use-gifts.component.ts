import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-use-gifts',
  templateUrl: './use-gifts.component.html',
  styleUrls: ['./use-gifts.component.scss'],
})
export class UseGiftsComponent extends BaseComponent implements OnInit {
  discountCode = '';
  ngOnInit(): void {}

  checkDiscountCode(): void {
    if (!this.discountCode) return;
    const endPoint =
      this.settings.endPoints.discountCodes +
      this.settings.endPointsMethods.discountCodes.check +
      '/' +
      this.discountCode;
    this.pageService
      .httpGet(endPoint)
      .then((res) => {
        this.global.saveUser(res.data);
      })
      .catch((e) => this.pageService.showError(e));
  }
}
