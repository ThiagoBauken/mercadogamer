import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { ProductRejectDialogComponent } from './product-reject-dialog/product-reject-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends BaseComponent {
  status: 'pending' | 'approved' | 'rejected' = 'pending';
  page = 1;
  products: { [k: string]: any }[];
  totalPages = 1;
  loading: boolean;

  getItems() {
    const endPoint = this.settings.endPoints.products;
    this.loading = true;

    this.pageService
      .httpGetAll(
        endPoint,
        { status: this.status, enabled: true },
        { createdAt: -1 },
        ['category', 'platform', 'user'],
        this.page
      )
      .then((res) => {
        console.log(res.data);
        this.products = res.data;
        this.totalPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }

  filter(status: 'pending' | 'approved' | 'rejected') {
    this.status = status;
    this.page = 1;
    this.getItems();
  }

  goToProductDetail(id: string) {
    this.pageService.navigateRoute('product-detail/' + id);
  }

  handleStatus(id: string, status: string) {
    if (status === 'reject') {
      const dialogRef = this.dialog.open(ProductRejectDialogComponent, {
        width: '654px',
        height: '540px',
        // data: this.rejectOptionData,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.handleProductStatus(id, status, res.selectedReasons);
        }
      });
    } else {
      this.handleProductStatus(id, status, []);
    }
  }

  private handleProductStatus(
    id: string,
    status: string,
    message: Array<string>
  ): void {
    const endPoint =
      this.settings.endPoints.products +
      this.settings.endPointsMethods.products[status] +
      '/' +
      id;
    this.pageService
      .httpPut(endPoint, { message })
      .then((res) => {
        this.pageService.showSuccess(
          'Producto ' +
            (status === 'approve' ? 'aprobado' : 'rechazado') +
            ' con éxito!'
        );
        this.getItems();
      })
      .catch((e) => this.pageService.showError(e));
  }

  disableProduct(id: string) {
    const endPoint = this.settings.endPoints.products + '/' + id;
    // const endPoint = `${this.pageService.global.settings.endPoints.products}/${id}`;

    this.pageService
      .httpDelete(endPoint)
      .then((res) => {
        this.pageService.showSuccess('Producto eliminado con éxito!');
        this.getItems();
      })
      .catch((e) => this.pageService.showError(e));
  }
}
