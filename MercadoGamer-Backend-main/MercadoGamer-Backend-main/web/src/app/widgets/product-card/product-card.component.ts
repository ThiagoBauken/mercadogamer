import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  // props
  @Input() product: any = {};
  @Input() country: any = {};
  @Output() reloadEvent = new EventEmitter();
  // variables
  global: GlobalService;

  constructor(public pageService: PageService) {
    this.global = this.pageService.global;
  }

  ngOnInit(): void {}

  goToProductEdit(id: string): void {
    this.pageService.navigateRoute('product-edit/' + id);
  }

  disableProduct(id: string): void {
    const endPoint = `${this.pageService.global.settings.endPoints.products}/${id}`;

    this.pageService
      .httpDelete(endPoint)
      .then((res) => {
        this.pageService.showSuccess('Producto eliminado con éxito!');
        this.reloadEvent.emit();
      })
      .catch((e) => this.pageService.showError(e));
  }

  getProductCadeStatus(status: string): string {
    switch (status) {
      case 'approved':
        return 'Publicado en el mercado';
      case 'rejected':
        return 'Publicación rechazada';
      default:
        return 'Esperando aprobación...';
    }
  }
}
