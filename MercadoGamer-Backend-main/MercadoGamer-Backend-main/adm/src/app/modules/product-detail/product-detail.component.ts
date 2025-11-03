import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from 'src/app/core/base.component';
import { PageService } from '../../core/page.service';
import { Input } from '@angular/core';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent extends BaseComponent {
  @Input() delivery = '';
  question: string;
  productId: string;
  product: { [k: string]: any };
  productsQAs: { [k: string]: any }[];
  deliver: string;

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productId = params.id;
      this.getProduct();
      this.getProductsQAs();
    });
  }

  getProductsQAs() {
    let endPoint = this.settings.endPoints.productsQAs;
    let filters = {
      product: this.productId,
    };
    let populates = ['buyer'];

    this.pageService
      .httpGetAll(endPoint, filters, { createdAt: -1 }, populates)
      .then((res) => (this.productsQAs = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  getProduct() {
    let endPoint = this.settings.endPoints.products;
    let populates = ['platform', 'category', 'user', 'game'];

    this.pageService
      .httpGetById(endPoint, this.productId, populates)
      .then((res) => {
        this.product = res.data;
        this.deliver = this.product.stockProduct[0]?.retirementType;
      })
      .catch((e) => this.pageService.showError(e));
  }
}
