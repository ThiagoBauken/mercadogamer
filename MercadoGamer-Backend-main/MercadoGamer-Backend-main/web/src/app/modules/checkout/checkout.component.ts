import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent extends BaseComponent implements OnInit {
  success = false;
  product: { [k: string]: any };
  productId: string;
  paymentMethod = 'select';
  total: number;
  error: string;
  processingFee: number;

  code: string;
  balancePay = false;
  sent = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productId = params.id;
      this.getProduct();
      this.form = this.getFormNew();
    });

    this.pageService.socket.on(
      this.settings.socket.notification,
      (notification) => {
        if (notification.action !== this.settings.actions.productPaid) {
          return;
        }

        this.success = true;

        setTimeout(() => {
          this.pageService.navigateRoute('purchase/' + notification.payload.id);
          this.modalService.dismissAll();
        }, 3000);
      }
    );
    this.asyncUser();
  }

  getProduct(): void {
    const endPoint = this.settings.endPoints.products;
    const populates = [];

    this.pageService
      .httpGetById(endPoint, this.productId, populates)
      .then((res) => {
        this.product = res.data;
        this.processingFee =
          ((this.product.discount
            ? this.product.priceWithDiscount
            : this.product.price) /
            100) *
            4 +
          this.country.processingFee * this.country.toUSD;
        this.total =
          this.processingFee +
          (this.product.discount
            ? this.product.priceWithDiscount
            : this.product.price);
      })
      .catch((e) => this.pageService.showError(e));
  }

  getFormNew(): any {
    return this.formBuilder.group({
      firstName: [this.user?.firstName || null, Validators.required],
      lastName: [this.user?.lastName || null, Validators.required],
      emailAddress: [this.user?.emailAddress || null, Validators.required],
      phoneNumber: [this.user?.phoneNumber || null, Validators.required],
      country: [this.country?.id],
      address: [this.user?.address || null, Validators.required],
      postalCode: [this.user?.postalCode || null, Validators.required],
      discountCode: [null],
    });
  }

  openModal(content): void {
    if (!this.form.valid) {
      return;
    }

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  onSubmitPerform(item): void {
    let endPoint;
    if (this.paymentMethod === 'select') {
      endPoint =
        this.settings.endPoints.orders +
        this.settings.endPointsMethods.orders.save;
    } else if (this.paymentMethod === 'mercadoPago') {
      endPoint =
        this.settings.endPoints.orders +
        this.settings.endPointsMethods.orders.pay;
    } else if (this.paymentMethod === ('mercadoPago' && 'select')) {
      endPoint =
        this.settings.endPoints.orders +
        this.settings.endPointsMethods.orders.pay;
    }

    this.error = null;
    this.success = false;
    this.sent = true;
    item = this.savePre(item);
    this.pageService
      .httpPost(endPoint, item)
      .then((res) => {
        try {
          new URL(res.data);
          window.open(res.data, '_blank');
        } catch (_) {
          this.success = true;
          setTimeout(() => {
            this.pageService.navigateRoute('purchase/' + res.data);
            this.modalService.dismissAll();
          }, 3000);
        }
      })
      .catch((e) => {
        this.sent = false;
        this.error = e.message;
      });
  }

  savePre(item): void {
    item.paymentMethod = this.paymentMethod;
    item.seller = this.product.user;
    item.buyer = this.user.id;
    item.product = this.productId;
    item.processingFee = this.processingFee;
    item.balancePay = this.balancePay;
    return item;
  }

  /**
   * useBalance
   */
  public useBalance(): void {
    this.balancePay = true;
  }

  getProductPrice(): number {
    return this.product.discount
      ? this.product.priceWithDiscount
      : this.product.price;
  }

  asyncUser(): void {
    const endPoint = this.settings.endPoints.users + '/' + this.user.id;
    this.pageService
      .httpGet(endPoint)
      .then((res) => {
        this.user = { ...this.user, ...res.data };
        localStorage.setItem(
          this.settings.storage.user,
          JSON.stringify(this.user)
        );
      })
      .catch((e) => this.pageService.showError(e));
  }

  paymentMethodChange(): void {
    this.balancePay = false;
  }
}
