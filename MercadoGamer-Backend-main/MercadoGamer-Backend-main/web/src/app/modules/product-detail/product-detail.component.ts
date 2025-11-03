import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
  question: string;
  productId: string;
  product: { [k: string]: any };
  productsQAs: { [k: string]: any }[];
  deliver: string;
  public featuredProducts: { [k: string]: any }[];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productId = params.id;
      this.getProduct();
      this.getProductsQAs();
      this.getFeaturedProducts();
    });
  }

  sendQuestion(): void {
    if (this.user) {
      const endPoint = this.settings.endPoints.productsQAs;
      const item = {
        question: this.question,
        buyer: this.user.id,
        seller: this.product.user.id,
        product: this.productId,
      };

      this.pageService
        .httpPost(endPoint, item)
        .then((res) => {
          this.pageService.showSuccess('Pregunta enviada con éxito!');
          this.question = null;
          this.close();
          this.getProductsQAs();
        })
        .catch((e) => this.pageService.showError(e));
    } else {
      this.pageService.navigateRoute('login');
    }
  }

  getProductsQAs(): void {
    const endPoint = this.settings.endPoints.productsQAs;
    const filters = {
      product: this.productId,
    };
    const populates = ['buyer', 'seller'];

    this.pageService
      .httpGetAll(endPoint, filters, { createdAt: -1 }, populates)
      .then((res) => {
        this.productsQAs = res.data;
      })
      .catch((e) => this.pageService.showError(e));
  }

  getProduct(): void {
    const endPoint = this.settings.endPoints.products;
    const populates = ['platform', 'category', 'user', 'stockProduct'];

    this.pageService
      .httpGetById(endPoint, this.productId, populates)
      .then((res) => {
        this.product = res.data;
        this.deliver = res.data.stockProduct[0]?.retirementType;
      })
      .catch((e) => this.pageService.showError(e));
  }

  private getFeaturedProducts(): void {
    const endPoint = this.settings.endPoints.products;
    const filters = {
      featured: false,
    };
    const populates = ['platform', 'category', 'user'];
    this.pageService
      .httpGetAll(endPoint, filters, {}, populates, 1, 100)
      .then((res) => {
        const newList = res.data.filter(
          (item) =>
            item.status === 'approved' &&
            item.enabled === true &&
            item.stock > 0
        );
        this.featuredProducts = this.getRandomArrayElements(newList, 4);
      })
      .catch((e) => this.pageService.showError(e));
  }

  goToCheckout(): void {
    this.pageService.navigateRoute(
      this.user ? 'checkout/' + this.productId : 'login'
    );
  }

  goToCatalogue(filter: string, id: string): void {
    this.pageService.navigateRoute('catalogue/' + filter + '/' + id);
  }

  goToSellerProfile(): void {
    this.pageService.navigateRoute('profile/seller/' + this.product.user.id);
  }

  goToProductDetail(id: string, newWindow = false): void {
    if (newWindow) {
      window.open(`/product-detail/${id}`);
    } else {
      this.pageService.navigateRoute(`product-detail/${id}`);
    }
  }
}
