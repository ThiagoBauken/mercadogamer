import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import * as globalVariables from 'src/app/core/globals';
@Component({
  selector: 'app-sells',
  templateUrl: './sells.component.html',
  styleUrls: ['./sells.component.scss'],
})
export class SellsComponent extends BaseComponent {
  selectedStatus: string;
  page = globalVariables.pages.sells || 1;
  _orders: { [k: string]: any }[];
  orders: { [k: string]: any }[];
  totalPages = 1;
  loading: boolean;
  search = '';
  timeInterval: NodeJS.Timeout;
  perPage = 24;
  getItems() {
    const endPoint = this.settings.endPoints.orders;
    let filters: { [k: string]: any } = {};
    this.loading = true;
    if (this.selectedStatus) filters.status = this.selectedStatus;

    this.pageService
      .httpGetAll(
        endPoint,
        filters,
        { createdAt: -1 },
        ['buyer', 'seller', 'country', 'product'],
        this.page,
        0
      )
      .then((res) => {
        this._orders = res.data;
        this.searchItems();
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }

  searchItems(): void {
    this.orders = this._orders.filter(
      (item) =>
        new RegExp(this.search, 'i').test(item.product?.name) ||
        new RegExp(this.search, 'i').test(item.number) ||
        new RegExp(this.search, 'i').test(item.buyer?.username) ||
        new RegExp(this.search, 'i').test(item.seller?.username)
    );
    this.totalPages = Math.ceil(this.orders.length / this.perPage);
  }

  goToPurchase(order) {
    if (order.status === 'pending') return;

    this.pageService.navigateRoute('purchase/' + order.id);
  }

  getBackgroundImageUrl(url): string {
    return `background-image:url('${this.filesUrl}${url}'), url('/assets/imgs/placeholder.png')`;
  }

  onChange(value: string): void {
    this.search = value;
    clearTimeout(this.timeInterval);
    this.timeInterval = setTimeout(() => {
      this.page = 1;
      this.searchItems();
    }, 500);
  }

  previousPage(): void {
    this.page--;
    globalVariables.pages.sells = this.page;
  }
  nextPage(): void {
    this.page++;
    globalVariables.pages.sells = this.page;
  }
}
