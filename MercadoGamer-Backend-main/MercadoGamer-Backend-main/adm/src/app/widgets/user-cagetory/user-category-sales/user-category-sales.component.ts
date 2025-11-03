import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-user-category-sales',
  templateUrl: './user-category-sales.component.html',
  styleUrls: ['./user-category-sales.component.scss'],
})
export class UserCategorySalesComponent implements OnInit {
  @Input() type: string = 'buyer';
  @Input() userId: string = '';
  @Input() perPage: number = 5;

  public orders: any[] = [];
  public currentPage: number = 1;
  public totalPage: number = 1;
  public loading = false;

  constructor(public pageService: PageService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userId.currentValue !== changes.userId.previousValue) {
      this.getOrders();
    }
  }

  private async getOrders(): Promise<void> {
    try {
      if (this.userId) {
        this.loading = true;
        const endPoints = this.pageService.global.settings.endPoints.orders;
        const filters = { [this.type]: this.userId };
        const response = await this.pageService.httpGetAll(
          endPoints,
          filters,
          {},
          ['product', 'seller', 'country'],
          this.currentPage,
          this.perPage
        );
        this.totalPage = response.pages;
        this.orders = response.data;
      }
    } catch (error) {
      this.pageService.showError(error);
    } finally {
      this.loading = false;
    }
  }

  public nextPage(): void {
    this.currentPage++;
    this.getOrders();
  }

  public previousPage(): void {
    this.currentPage--;
    this.getOrders();
  }
}
