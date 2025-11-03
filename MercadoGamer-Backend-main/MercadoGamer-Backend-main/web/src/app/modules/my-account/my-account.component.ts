import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexStroke,
  ApexFill,
  ApexGrid,
  ApexDataLabels,
  ApexLegend,
  ApexMarkers,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStates,
  ApexTheme,
  ApexResponsive,
} from 'ng-apexcharts';
import { GlobalService } from 'src/app/core/global.service';
import { FormBuilder } from '@angular/forms';
import { PageService } from 'src/app/core/page.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatIconRegistry } from '@angular/material/icon';
import * as globalVariables from 'src/app/core/globals';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  labels: any;
  states: ApexStates;
  theme: ApexTheme;
  legend: ApexLegend;
  responsive: Array<ApexResponsive>;
  colors: any[];
};

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent extends BaseComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public pageService: PageService,
    public global: GlobalService,
    public modalService: NgbModal,
    public activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public matIconRegistry: MatIconRegistry
  ) {
    super(
      formBuilder,
      activatedRoute,
      modalService,
      pageService,
      sanitizer,
      deviceService,
      router,
      matIconRegistry
    );
  }
  editing: boolean;
  retirementMethod = 'select';
  retirementCBU: string;
  retirementAmount: number;
  loading = false;
  page = 1;
  totalPages = 1;
  buy = true;
  sell = false;
  ticket = false;
  setting = false;
  option = '11';
  success = false;
  closeResult = '';
  showSuccess = false;
  method = 'select';
  items: any;
  ticketSent = false;
  itemSelected: { [k: string]: any } = null;
  selectedTypeFilter: { [k: string]: any } = null;

  selectedScreenObj: { [k: string]: any };
  selectedScreen:
    | 'shopping'
    | 'sales'
    | 'tickets'
    | 'settings'
    | 'QAs'
    | 'gifts'
    | 'security' = 'shopping';
  selectedSaleScreen:
    | 'sales-products'
    | 'sales'
    | 'sales-summary'
    | 'sales-retire'
    | 'sales-QAs' = 'sales';
  screens = [
    {
      code: 'shopping',
      label: 'Compras',
      imgActive: 'assets/imgs/buys-active.svg',
      imgInactive: 'assets/imgs/buys.svg',
      sellerOnly: false,
      endPoint: 'orders',
      method: 'userRecord',
      id: this.user.id,
      filters: { buyer: this.user.id, status: { $ne: 'pending' } },
      sort: {
        createdAt: -1,
      },
      populates: ['product', 'seller', 'country'],
      perPage: 5,
    },
    {
      code: 'sales',
      label: 'Ventas',
      imgActive: 'assets/imgs/sells-active.svg',
      imgInactive: 'assets/imgs/sells.svg',
      sellerOnly: true,
      endPoint: 'orders',
      method: null,
      id: null,
      filters: { seller: this.user.id },
      sort: { created: -1 },
      populates: ['product', 'buyer'],
      perPage: 5,
    },
    {
      code: 'tickets',
      label: 'Tickets',
      imgActive: 'assets/imgs/ticket-active.svg',
      imgInactive: 'assets/imgs/ticket.svg',
      sellerOnly: false,
      endPoint: 'tickets',
      method: null,
      id: null,
      filters: { user: this.user.id },
      sort: {
        createdAt: -1,
      },
      populates: ['product', 'buyer'],
      perPage: 20,
    },
    {
      code: 'settings',
      label: 'Ajustes',
      imgActive: 'assets/imgs/setting-active.svg',
      imgInactive: 'assets/imgs/ajustes.svg',
      sellerOnly: false,
    },
    {
      code: 'QAs',
      label: 'Preguntas',
      imgActive: 'assets/imgs/question-active.svg',
      imgInactive: 'assets/imgs/question.svg',
      sellerOnly: false,
      endPoint: 'productsQAs',
      method: null,
      id: null,
      filters: { buyer: this.user.id },
      sort: {
        createdAt: -1,
      },
      populates: ['product', 'seller'],
      perPage: 20,
    },
    {
      code: 'gifts',
      label: 'Regalos',
      imgActive: '',
      imgInactive: '',
      sellerOnly: false,
    },
    {
      code: 'security',
      label: 'Retirar',
      imgActive: 'assets/imgs/sellFive-active.svg',
      imgInactive: 'assets/imgs/sellFive.svg',
      // endPoint: 'withdrawals',
      method: 'paymentMethods',
      id: this.user.id,
      filters: {},
      sort: {},
      populates: [],
      perPage: 20,
    },
  ];
  salesScreens = [
    {
      code: 'sales',
      label: 'Ventas',
      imgActive: 'assets/imgs/dolar-active.svg',
      imgInactive: 'assets/imgs/dolar.svg',
      endPoint: 'orders',
      method: null,
      id: null,
      filters: { seller: this.user.id, status: { $ne: 'pending' } },
      sort: {
        createdAt: -1,
      },
      populates: ['product', 'buyer'],
      perPage: 5,
    },
    {
      code: 'sales-products',
      label: 'Productos',
      imgActive: 'assets/imgs/sellSecond-active.svg',
      imgInactive: 'assets/imgs/sellSecond.svg',
      endPoint: 'products',
      method: null,
      id: null,
      filters: { user: this.user.id, enabled: true },
      sort: {
        createdAt: -1,
      },
      populates: ['game', 'category', 'platform'],
      perPage: 5,
    },
    {
      code: 'sales-summary',
      label: 'Resumen',
      imgActive: 'assets/imgs/sellThird-active.svg',
      imgInactive: 'assets/imgs/sellThird.svg',
    },
    {
      code: 'sales-QAs',
      label: 'Consultas',
      imgActive: 'assets/imgs/sellFour-active.svg',
      imgInactive: 'assets/imgs/sellFour.svg',
      endPoint: 'productsQAs',
      method: null,
      id: null,
      filters: { seller: this.user.id },
      sort: { createdAt: -1 },
      populates: ['buyer', 'product'],
      perPage: 20,
    },
    {
      code: 'sales-retire',
      label: 'Retirar',
      imgActive: 'assets/imgs/sellFive-active.svg',
      imgInactive: 'assets/imgs/sellFive.svg',
      // endPoint: 'withdrawals',
      method: 'paymentMethods',
      id: this.user.id,
      filters: {},
      sort: {},
      populates: [],
      perPage: 20,
    },
  ];
  answer: string;
  ticketTitle: string;
  ticketBody: string;

  //
  @ViewChild('chart') chart: ChartComponent;
  public AreaChartOptions: Partial<ChartOptions>;
  public DonutChartOptions: Partial<ChartOptions>;

  public menuItems: Array<any> = [
    {
      displayName: 'Compras',
      iconName: 'compras_new',
      route: 'my-account/shopping',
    },
    {
      displayName: 'Ventas',
    },
    {
      displayName: 'Ventas',
      iconName: 'bill',
      route: 'my-account/sales',
    },
    {
      displayName: 'Productos',
      iconName: 'productos_new',
      route: 'my-account/sales-products',
    },
    {
      displayName: 'Consultas',
      iconName: 'consultas',
      route: 'my-account/sales-QAs',
    },
    // {
    //   displayName: 'Resumen',
    //   iconName: 'resumen',
    //   route: 'my-account/sales-summary'
    // },
    {
      displayName: 'Retirar',
      iconName: 'retirar',
      route: 'my-account/sales-retire',
    },
    {
      displayName: 'Otros',
    },
    {
      displayName: 'Ajustes',
      iconName: 'ajustes',
      route: 'my-account/settings',
    },
    {
      displayName: 'Preguntas',
      iconName: 'preguntas',
      route: 'my-account/QAs',
    },
    {
      displayName: 'Regalos',
      iconName: 'gift',
      route: 'my-account/gifts',
    },
    {
      displayName: 'Tickets',
      iconName: 'tickets',
      route: 'my-account/tickets',
    },
    {
      displayName: 'Seguridad',
      iconName: 'security_new',
      route: 'my-account/security',
    },
  ];

  ngOnInit(): void {
    this.page = globalVariables.pageInfo.page;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.asyncUser();
      if (params.screen) {
        const els = params.screen.split('-');
        if (els.length > 0 && els[0] === 'sales') {
          this.selectedScreen = 'sales';
          this.selectedSaleScreen = params.screen;
        } else {
          this.selectedScreen = params.screen;
        }
      }
      this.selectedScreenObj =
        this.selectedScreen === 'sales'
          ? (this.selectedScreenObj = this.salesScreens.find(
              (screen) => screen.code === this.selectedSaleScreen
            ))
          : this.screens.find((screen) => screen.code === this.selectedScreen);
      this.getItems();
    });

    this.AreaChartOptions = {
      series: [
        {
          name: 'Reporte de ventas',
          data: [58, 25, 59, 38, 22, 46, 16, 28, 63, 73],
        },
      ],
      chart: {
        height: 350,
        width: '100%',
        type: 'area',
        foreColor: '#a7a8af',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      grid: {
        borderColor: '#fafafb1c',
      },
      title: {
        text: 'Reporte de ventas',
        margin: 10,
        style: {
          color: '#F78A0E',
          fontFamily: 'Montserrat',
          fontSize: '18px',
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: 'dark',
      },
      markers: {
        size: 6,
        hover: {
          size: 9,
          sizeOffset: 10,
        },
        strokeWidth: 3,
        strokeColors: '#AE8FF7',
        colors: ['#FFFFFF'],
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: ['#AE8FF7'],
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          gradientToColors: ['rgba(253, 93, 239, 0.04)'],
          type: 'horizontal',
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
        ],
        tooltip: {
          enabled: false,
        },
        tickAmount: 5,
        axisBorder: {
          show: false,
        },
        floating: false,
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
      },
    };
    this.DonutChartOptions = {
      series: [44, 55, 41, 17],
      chart: {
        height: 370,
        type: 'donut',
        dropShadow: {
          enabled: true,
          color: '#111',
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                color: '#a7a8af',
                fontSize: '16px',
                label: 'Transacciones',
              },
              value: {
                color: '#FAFAFB',
                fontSize: '30px',
                fontWeight: '800',
              },
            },
          },
        },
      },
      labels: [
        'Ventas Comcretadas',
        'Ventas con reclamos',
        'Reembolsos',
        'Reclamos solucionados',
      ],
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      theme: {
        palette: 'palette2',
      },
      title: {
        text: 'Analisis',
        margin: 48,
        style: {
          color: '#F78A0E',
          fontFamily: 'Montserrat',
          fontSize: '18px',
        },
      },
      legend: {
        fontSize: '16px',
        fontWeight: '600',
        labels: {
          colors: '#a7a8af',
        },
        markers: {
          width: 15,
          height: 15,
          radius: 5,
        },
      },
      responsive: [
        {
          breakpoint: 2000,
          options: {
            chart: {
              height: 500,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  getItems(): void {
    this.items = null;
    if (!this.selectedScreenObj.endPoint) {
      return;
    }

    let endPoint = this.settings.endPoints[this.selectedScreenObj.endPoint];

    if (this.selectedScreenObj.method) {
      endPoint +=
        this.settings.endPointsMethods[this.selectedScreenObj.endPoint][
          this.selectedScreenObj.method
        ];
    }

    if (this.selectedScreenObj.id) {
      endPoint += '/' + this.selectedScreenObj.id;
    }
    globalVariables.pageInfo.page = this.page;
    this.loading = true;
    let filters = this.selectedScreenObj.filters;
    if (this.selectedScreenObj.code === 'sales' && this.selectedTypeFilter) {
      filters = {
        ...filters,
        status: this.selectedTypeFilter.code,
      };
    }
    this.pageService
      .httpGetAll(
        endPoint,
        filters,
        this.selectedScreenObj.sort,
        this.selectedScreenObj.populates,
        this.page,
        this.selectedScreenObj.perPage
      )
      .then((res) => {
        this.items = res.data;
        this.totalPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }

  public handleScreen(menuItem): void {
    this.routeNavigate(menuItem.route);
    this.page = 1;
    this.itemSelected = null;
  }

  selectItem(item): void {
    this.itemSelected =
      this.itemSelected && this.itemSelected.id === item.id ? null : item;
  }

  nextPage(): void {
    this.page++;
    this.getItems();
  }

  previousPage(): void {
    this.page--;
    this.getItems();
  }

  selectOption(value: any): void {
    this.option = value;
  }

  goToProductType(): void {
    this.pageService.navigateRoute('product-type');
  }

  goToProductEdit(id: string): void {
    this.pageService.navigateRoute('product-edit/' + id);
  }

  sendQualification(): void {
    this.success = true;
    setTimeout(() => {
      this.changeSuccess();
    }, 1500);
  }

  sendAnswer(): void {
    const endPoint =
      this.settings.endPoints.productsQAs +
      this.settings.endPointsMethods.productsQAs.answer +
      '/' +
      this.itemSelected.id;
    const item = {
      answer: this.answer,
    };

    this.pageService
      .httpPut(endPoint, item)
      .then((res) => {
        this.pageService.showSuccess('Respuesta enviada con éxito!');
        this.answer = null;
        this.close();
        this.getItems();
      })
      .catch((e) => this.pageService.showError(e));
  }

  sendTicket(): void {
    if (this.ticketSent) {
      return;
    }
    const endPoint = this.settings.endPoints.tickets;
    const item = {
      title: this.ticketTitle,
      body: this.ticketBody,
      user: this.user.id,
    };
    this.ticketSent = true;
    this.pageService
      .httpPost(endPoint, item)
      .then((res) => {
        this.pageService.showSuccess('Ticket enviado con éxito!');
        this.ticketTitle = null;
        this.ticketBody = null;
        this.close();
        this.getItems();
        this.showSuccess = true;
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => {
        this.ticketSent = false;
      });
  }

  deletePaymentMethod(id: string): void {
    const endPoint = this.settings.endPoints.paymentMethods + '/' + id;

    this.pageService
      .httpPut(endPoint, { enabled: false })
      .then((res) => this.getItems())
      .catch((e) => this.pageService.showError(e));
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
      finished: 'product-detail/' + order.product.id,
      complaint: 'purchase/' + order.id,
    };

    this.pageService.navigateRoute(status[order.status]);
  }

  getInitPoint(order): void {
    const endPoint =
      this.settings.endPoints.mp + this.settings.endPointsMethods.mp.initPoint;

    this.pageService
      .httpPost(endPoint, order.initPoint)
      .then((res) => window.open(res.data, '_blank'))
      .catch((e) => this.pageService.showError(e));
  }

  goToSale(): void {
    this.pageService.navigateRoute('sale');
  }

  changeSuccess(): void {
    this.success = false;
    this.showSuccess = true;
  }

  handlePicture(field: string): void {
    if (!this.editing) {
      return;
    }

    this.pageService
      .showImageUpload()
      .then((res: any) => {
        if (!res?.data.file) {
          return;
        }

        this.user[field] = res.data.file;
      })
      .catch((e) => this.pageService.showError(e));
  }

  handleEdit(): void {
    this.editing = !this.editing;

    if (this.editing) {
      return;
    }

    const endPoint = this.settings.endPoints.users + '/' + this.user.id;

    this.pageService
      .httpPut(endPoint, this.user)
      .then((res) => this.global.saveUser(res.data))
      .catch((e) => this.pageService.showError(e));
  }

  disableProduct(id: string): void {
    const endPoint = this.settings.endPoints.products + '/' + id;

    this.pageService
      .httpPut(endPoint, { enabled: false })
      .then((res) => this.getItems())
      .catch((e) => this.pageService.showError(e));
  }

  openModal(content, item?): void {
    if (item) {
      this.itemSelected = item;
    }

    this.showSuccess = false;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
  }

  close(): void {
    this.modalService.dismissAll();
  }

  /**
   * filterResumenData
   *
   * @returns void
   */
  public filterResumenData(type: 'w' | 'd' | 'm'): void {
    switch (type) {
      case 'w':
        this.AreaChartOptions.xaxis = {
          ...this.AreaChartOptions.xaxis,
          categories: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
        };
        this.AreaChartOptions.series = [
          {
            name: 'Reporte de ventas',
            data: [58, 25, 59, 38, 22, 46, 16],
          },
        ];
        break;
      case 'd':
        this.AreaChartOptions.xaxis = {
          ...this.AreaChartOptions.xaxis,
          categories: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24,
          ],
        };
        this.AreaChartOptions.series = [
          {
            name: 'Reporte de ventas',
            data: [
              25, 59, 58, 38, 22, 46, 16, 18, 30, 35, 80, 20, 25, 59, 58, 38,
              22, 46, 16, 18, 30, 35, 80, 20,
            ],
          },
        ];
        break;
      case 'm':
        this.AreaChartOptions.xaxis = {
          ...this.AreaChartOptions.xaxis,
          categories: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
          ],
        };
        this.AreaChartOptions.series = [
          {
            name: 'Reporte de ventas',
            data: [
              25, 59, 22, 46, 16, 23, 31, 40, 50, 12, 50, 22, 25, 59, 22, 46,
              16, 23, 31, 40, 50, 12, 50, 22, 25, 59, 22, 46, 16, 23, 31,
            ],
          },
        ];
        break;

      default:
        break;
    }
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

  setLoading(value: boolean): void {
    this.loading = value;
  }

  filterProducts(variable: string, filter: { [k: string]: any }): void {
    this[variable] = filter;
    this.getItems();
    // this.getProfileItems();
  }
}
