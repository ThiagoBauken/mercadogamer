import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  // Props
  @Input() items: any[] = [];
  @Output() reloadEvent = new EventEmitter();

  // variables
  country: any = {};

  constructor(public pageService: PageService) {}

  ngOnInit(): void {
    // this.loadProducts();
    this.country = this.pageService.global.load(
      this.pageService.global.settings.storage.country
    );
  }

  goToProductType(): void {
    this.pageService.navigateRoute('product-type');
  }
}
