import { Location } from '@angular/common';
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PageService } from 'src/app/core/page.service';
import { BaseComponent } from '../../../core/base.component';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss'],
})
export class TopmenuComponent extends BaseComponent {
  options = 'home';
  search: string;
  notifications: { [k: string]: any }[] = [];
  public showCatalogPopup = false;
  events: string[] = [];
  opened: boolean;
  isMobile: boolean = window.innerWidth < 1200;
  showSearch = false;
  public notificationType = {
    saleSuccess: 'notification-sale-completed',
    purchaseSuccess: 'notification-purchase-completed',
    withdrawSuccess: 'notification-withdrawal-approved',
    answer: 'notification-answered',
    question: 'notification-question',
    receiveSuccess: 'notification-sale-received',
    productPaid: 'notification-purchase-processing',
    productRejected: 'notification-product-rejected',
    productAccepted: 'notification-product-approved',
    ClaimReceive: 'notification-claim-received',
  };

  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    public pageService: PageService,
    public sanitizer: DomSanitizer,
    public location: Location,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public matIconRegistry: MatIconRegistry
  ) {
    super(
      formBuilder,
      activatedRoute,
      modalService,
      pageService,
      sanitizer,
      deviceService,
      router,
      matIconRegistry
    );

    this.pageService.socket.on(
      this.settings.socket.notification,
      (notification) => {
        this.notifications.push(notification);
      }
    );
  }

  @Output() openSidebar = new EventEmitter<boolean>();

  @ViewChild('notificationsMenu', { static: true }) public notificationsMenu;
  @ViewChild('menu', { static: true }) public menu;

  handleSidebar(): void {
    if (this.user) {
      this.openSidebar.emit();
    } else {
      this.pageService.navigateRoute('login');
    }
  }

  checkUser(): void {
    // tslint:disable-next-line: variable-name
    this.global.getUserAsObservable().subscribe((res) => {
      this.user = this.global.getUser();
      this.country = this.global.load(this.settings.storage.country);
      if (this.user) {
        this.getNotifications();
      }
    });
    this.global.checkUser();
  }

  getNotifications(): void {
    const endPoint = this.settings.endPoints.notifications;
    const filters = {
      user: this.user.id,
      new: true,
    };
    this.pageService
      .httpGetAll(endPoint, filters, { createdAt: -1 })
      .then((res) => {
        this.notifications = res.data;
      })
      .catch((e) => this.pageService.showError(e));
  }

  handleNotification(notification: { [k: string]: any }): void {
    // Validação: verificar se o método existe antes de chamá-lo
    if (notification.action && typeof this[notification.action] === 'function') {
      this[notification.action](notification);
    } else {
      console.warn('Notification action not found or not a function:', notification.action);
    }

    const endPoint =
      this.settings.endPoints.notifications + '/' + notification.id;

    this.pageService
      .httpPut(endPoint, { new: false })
      .then((res) => this.getNotifications())
      .catch((e) => this.pageService.showError(e));
  }

  productPaid(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('purchase/' + notification.payload.id);
  }

  productRejected(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('my-account/sales-products');
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

  newMessage(notification: { [k: string]: any }): void {
    this.pageService.navigateRoute('purchase/' + notification.payload.id);
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

  searchCatalogue(): void {
    this.pageService.navigateRoute(
      this.search ? 'catalogue/search/' + this.search : 'catalogue'
    );
  }

  logout(route: string = 'login'): void {
    this.global.removeUser();
    this.pageService.navigateRoute(route);
  }

  setShowSearch(value: boolean): void {
    this.showSearch = value;
  }

  // getLogoSrc(): string {
  //   return `assets/imgs/logo${
  //     window.innerWidth <= 840 ? '-mobile-2' : '-laptop'
  //   }.png`;
  // }
}
