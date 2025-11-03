import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-puchases',
  templateUrl: './puchases.component.html',
  styleUrls: ['./puchases.component.scss'],
})
export class PuchasesComponent implements OnInit {
  // props
  @Input() data: any = {};

  // variables
  country: any;
  fileUrl: string;
  global: GlobalService;
  selected: any;

  constructor(public pageService: PageService) {
    this.country = this.pageService.global.load(
      this.pageService.global.settings.storage.country
    );

    this.global = this.pageService.global;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue !== changes.data.previousValue) {
      this.selected = changes.data.currentValue?.items?.[0];
    }
  }

  onCardClick(order, mercadoPago = true): void {
    if (window.innerWidth > 840) {
      this.selected = order;
    } else {
      this.goToPurchase(order, mercadoPago);
    }
  }

  goToPurchase(order, mercadoPago = true): void {
    if (order.status === 'cancelled' || order.status === 'returned') {
      return;
    }

    if (mercadoPago && order.status === 'pending') {
      return this.getInitPoint(order);
    }

    const status = {
      pending: 'product-detail/' + order.product.id,
      paid: 'purchase/' + order.id,
      finished: 'purchase/' + order.id,
      complaint: 'purchase/' + order.id,
    };

    this.pageService.navigateRoute(status[order.status]);
  }

  getInitPoint(order): void {
    const endPoint =
      this.global.settings.endPoints.mp +
      this.global.settings.endPointsMethods.mp.initPoint;

    this.pageService
      .httpPost(endPoint, order.initPoint)
      .then((res) => window.open(res.data, '_blank'))
      .catch((e) => this.pageService.showError(e));
  }
}
