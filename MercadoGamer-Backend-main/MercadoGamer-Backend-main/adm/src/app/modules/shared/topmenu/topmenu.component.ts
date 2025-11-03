import { Component } from '@angular/core';
import { BaseComponent } from '../../../core/base.component';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss'],
})
export class TopmenuComponent extends BaseComponent {
  notifications: { [k: string]: any }[] = [];

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    const endPoint = this.settings.endPoints.notifications;
    const filters = {
      user: null,
      new: true,
    };

    this.pageService
      .httpGetAll(endPoint, filters, { createdAt: -1 })
      .then((res) => {
        this.notifications = res.data;
      })
      .catch((e) => this.pageService.showError(e));
  }

  handleNotification(notification: { [k: string]: any }) {
    this[notification.action](notification);

    const endPoint =
      this.settings.endPoints.notifications + '/' + notification.id;

    this.pageService
      .httpPut(endPoint, { new: false })
      .then((res) => this.getNotifications())
      .catch((e) => this.pageService.showError(e));
  }

  productPaid(notification: { [k: string]: any }) {
    this.pageService.navigateRoute('purchase/' + notification.payload.id);
  }

  productRejected(notification: { [k: string]: any }) {
    this.pageService.navigateRoute('my-account/shopping');
  }

  newMessage(notification: { [k: string]: any }) {
    this.pageService.navigateRoute('purchase/' + notification.payload.id);
  }

  productAccepted(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('my-account/sales-products');
  }

  saleSuccess(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('my-account/sales/');
  }
  question(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('my-account/sales-QAs');
  }

  answer(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('my-account/QAs');
  }

  purchaseSuccess(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('my-account/shopping');
  }
  ClaimReceive(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('purchase/' + notification.payload.id);
  }

  receiveSuccess(notificationSeller: { [k: string]: any }): void {
    this.pageService.navigateRoute('purchase/' + notificationSeller.payload.id);
  }

  logout() {
    this.global.removeUser();
    this.pageService.navigateRoute('login');
  }
}
