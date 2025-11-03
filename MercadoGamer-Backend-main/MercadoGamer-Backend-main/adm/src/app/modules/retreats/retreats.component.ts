import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-retreats',
  templateUrl: './retreats.component.html',
  styleUrls: ['./retreats.component.scss'],
})
export class RetreatsComponent extends BaseComponent {
  selectedStatus: string;
  page = 1;
  withdrawals: { [k: string]: any }[];
  totalPages = 1;
  loading: boolean;
  selectedItem: { [k: string]: any };

  getItems() {
    const endPoint = this.settings.endPoints.withdrawals;
    let filters: { [k: string]: any } = {};

    if (this.selectedStatus) filters.status = this.selectedStatus;

    this.loading = true;

    this.pageService
      .httpGetAll(
        endPoint,
        filters,
        { createdAt: -1 },
        ['user', 'paymentMethod', { path: 'user', populate: 'country' }],
        this.page
      )
      .then((res) => {
        this.withdrawals = res.data;
        this.totalPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }

  pay() {
    const endPoint =
      this.settings.endPoints.withdrawals +
      this.settings.endPointsMethods.withdrawals.pay +
      '/' +
      this.selectedItem.id;

    this.pageService
      .httpPut(endPoint, {})
      .then((res) => {
        this.pageService.showSuccess('Solicitud pagada con éxito!');
        this.close();
        this.getItems();
      })
      .catch((e) => this.pageService.showError(e));
  }

  openModal(content, item?) {
    if (item.status === 'paid') return;

    if (item) this.selectedItem = item;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
}
