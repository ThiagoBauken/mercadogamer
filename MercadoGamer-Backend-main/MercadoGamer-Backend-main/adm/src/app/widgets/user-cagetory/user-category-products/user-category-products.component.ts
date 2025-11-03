import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-user-category-products',
  templateUrl: './user-category-products.component.html',
  styleUrls: ['./user-category-products.component.scss'],
})
export class UserCategoryProductsComponent implements OnInit {
  @Input() userId: string = '';
  @Input() perPage: number = 5;
  @Input() country: any = {};

  public products: any[] = [];
  public currentPage: number = 1;
  public totalPage: number = 1;
  public loading = false;

  constructor(public pageService: PageService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userId.currentValue !== changes.userId.previousValue) {
      this.getProducts();
    }
  }

  private async getProducts(): Promise<void> {
    try {
      if (this.userId) {
        this.loading = true;
        const endPoints = this.pageService.global.settings.endPoints.products;
        const filters = { user: this.userId };
        const response = await this.pageService.httpGetAll(
          endPoints,
          filters,
          {},
          ['platform'],
          this.currentPage,
          this.perPage
        );
        this.totalPage = response.pages;
        this.products = response.data;
      }
    } catch (error) {
      this.pageService.showError(error);
    } finally {
      this.loading = false;
    }
  }

  public nextPage(): void {
    this.currentPage++;
    this.getProducts();
  }

  public previousPage(): void {
    this.currentPage--;
    this.getProducts();
  }
}
