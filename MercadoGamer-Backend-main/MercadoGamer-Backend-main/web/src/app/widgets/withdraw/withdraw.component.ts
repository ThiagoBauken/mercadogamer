import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent extends BaseComponent implements OnInit {
  // props
  loading = false;

  // variables
  lastSales: any = [];
  withdrawals: any = [];
  paymentMethods: any[] = [];
  modal = '';

  paymentData: any = {};

  defaultPaymentMethods = [
    {
      text: 'Mercado Pago',
      value: 'mercadoPago',
    },
    {
      text: 'CVU/CBU',
      value: 'bankTransfer',
    },
  ];

  async ngOnInit(): Promise<void> {}
  // tslint:disable-next-line: use-lifecycle-interface
  async ngAfterContentInit(): Promise<void> {
    // this.setLoading.emit(true);
    this.loading = true;
    await this.getLastSales();
    await this.getWithdrawals();
    await this.getPaymentMethods();
    this.loading = false;
    // this.setLoading.emit(false);
  }
  async getLastSales(): Promise<void> {
    const endPoint = this.settings.endPoints.orders;
    try {
      const result = await this.pageService.httpGetAll(
        endPoint,
        { seller: this.user.id, status: 'finished', withdrawal: null },
        {},
        ['product', 'stockProduct']
      );
      this.lastSales = result.data;
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  async getPaymentMethods(): Promise<void> {
    const endPoint = this.settings.endPoints.paymentMethods;
    try {
      const result = await this.pageService.httpGetAll(
        endPoint,
        { user: this.user.id },
        {},
        [],
        1,
        20
      );
      this.paymentMethods = result.data.map((item) => ({
        text: this.settings.paymentMethods.type[item.type].label,
        value: item.id,
      }));
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  async getWithdrawals(): Promise<void> {
    const endPoint = this.settings.endPoints.withdrawals;
    try {
      const result = await this.pageService.httpGetAll(
        endPoint,
        { user: this.user.id },
        {},
        ['paymentMethod'],
        1,
        20
      );
      this.withdrawals = Array.isArray(result.data)
        ? result.data.filter((item) => item.paymentMethod)
        : [];
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  openModal(): void {
    this.modal = 'payment';
  }

  onChangeModal(key, value): void {
    this.paymentData = { ...this.paymentData, [key]: value };
  }

  checkEnableRetireButton(): boolean {
    return (
      this.paymentData.payment &&
      (this.paymentMethods.length
        ? this.user.balance
        : this.paymentData.userInfo)
    );
  }

  async retire(): Promise<void> {
    if (this.paymentMethods.length) {
      if (this.user.balance < this.paymentData.amount) {
        this.pageService.showError('El monto del retiro excede su saldo');
        return;
      }
      const endPoint =
        this.settings.endPoints.withdrawals +
        this.settings.endPointsMethods.withdrawals.create;
      const item = {
        amount: this.user.balance,
        paymentMethod: this.paymentData.payment,
        user: this.user.id,
      };
      try {
        const res = await this.pageService.httpPost(endPoint, item);
        this.user.balance = res.data.balance;
        this.global.saveUser(this.user);
        this.pageService.showSuccess('Solicitud de retiro enviada con éxito!');
        this.paymentData = {};
        this.loading = true;
        await this.getWithdrawals();
        await this.getLastSales();
        this.loading = false;
      } catch (error) {
        this.pageService.showError(error);
      } finally {
        this.modal = '';
      }
    } else {
      const endPoint = this.settings.endPoints.paymentMethods;
      const item = {
        type: this.paymentData.payment,
        identifier: this.paymentData.userInfo,
        user: this.user.id,
      };
      try {
        this.loading = true;
        await this.pageService.httpPost(endPoint, item);
        await this.getPaymentMethods();
        this.pageService.showSuccess('Método de pago creado con éxito!');
        this.paymentData = {};
      } catch (error) {
        this.pageService.showError(error);
      } finally {
        this.loading = false;
      }
    }
  }
}
