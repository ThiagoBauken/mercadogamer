import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import {
  AreaChartOptions,
  ChartOptions,
} from 'src/app/core/models/chartOptions';
import { ChartComponent } from 'ng-apexcharts';
import * as moment from 'moment';

type FilterDateType = 'today' | 'week' | 'month' | 'total';

@Component({
  selector: 'app-profits',
  templateUrl: './profits.component.html',
  styleUrls: ['./profits.component.scss'],
})
export class ProfitsComponent extends BaseComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public AreaChartOptions: Partial<ChartOptions>;
  public SalesChartOptions: Partial<AreaChartOptions>;
  public ProfitsChartOptions: Partial<AreaChartOptions>;
  chat = false;
  selectedCountry = '';
  countries: { [k: string]: any }[];
  orders: { [k: string]: any }[];
  filterDate: FilterDateType = 'today';
  perPage = 24;

  filterDates: { label: string; value: FilterDateType }[] = [
    { label: 'Hoy', value: 'today' },
    { label: 'Semana', value: 'week' },
    { label: 'Mes', value: 'month' },
    { label: 'Totales', value: 'total' },
  ];

  weeks = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
  months = [
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
    'Nov',
    'Dec',
  ];
  ngOnInit(): void {
    this.getItems();
    this.getCountries();
    this.AreaChartOptions = {
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
        categories: [],
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
        max: 10000,
        tickAmount: 5,
      },
    };
    this.SalesChartOptions = {
      series: [
        {
          name: 'Ventas',
          data: [],
        },
      ],
      title: {
        text: '52',
        margin: 48,
        style: {
          color: '#F78A0E',
          fontFamily: 'Montserrat',
          fontSize: '18px',
        },
      },
      xaxis: {
        categories: [],
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
    this.ProfitsChartOptions = {
      series: [
        {
          name: 'Ventas',
          data: [],
        },
      ],
      title: {
        text: '$80.000',
        margin: 48,
        style: {
          color: '#F78A0E',
          fontFamily: 'Montserrat',
          fontSize: '18px',
        },
      },
      xaxis: {
        categories: [],
        tooltip: {
          enabled: false,
        },
        tickAmount: 5,
        axisBorder: {
          show: false,
        },
        floating: false,
      },
    };
  }

  onChangeFilter(filter: FilterDateType): void {
    this.filterDate = filter;
    this.getItems();
  }

  getFilterLabel(): string {
    return this.filterDates.find((item) => item.value === this.filterDate)
      ?.label;
  }

  getXaxisKey(date: string): string {
    switch (this.filterDate) {
      case 'today':
        return moment(date).format('HH:00');
      case 'week':
        const day = moment(date).get('day');
        return day ? this.weeks[day - 1] : this.weeks[this.weeks.length];
      case 'month':
        return moment(date).format('DD');
      case 'total':
        const month = moment(date).get('month');
        return moment(date).format('YYYY-MMM');
    }
  }

  getItems(): void {
    this.loading = true;
    const endPoint = this.settings.endPoints.orders;
    const filter: { [k: string]: any } = {
      status: 'finished',
      product: { $ne: null },
    };
    const today = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD');
    // tslint:disable-next-line: variable-name
    const _today = moment();
    switch (this.filterDate) {
      case 'today':
        // this.AreaChartOptions.chart.type = 'bar';
        filter.paidDate = { $gt: today };
        break;
      case 'week':
        filter.paidDate = { $gt: today.add(-today.get('day'), 'day') };
        break;
      case 'month':
        today.set('date', 1);
        filter.paidDate = { $gt: today };
        break;
    }
    if (this.selectedCountry) {
      filter.country = this.selectedCountry;
    }

    this.loading = true;

    this.pageService
      .httpGetAll(
        endPoint,
        filter,
        { createdAt: -1 },
        ['product', 'country'],
        this.page,
        0
      )
      .then((res) => {
        let orders = res.data;
        this.totalPages = Math.ceil(res.count / this.perPage);
        const orderData = {};
        const profitData = {};
        switch (this.filterDate) {
          case 'today':
            for (let i = 0; i < _today.get('hours'); i++) {
              const key = `${i < 10 ? '0' : ''}${i}:00`;
              orderData[key] = 0;
              profitData[key] = 0;
            }
            break;
          case 'week':
            let day = _today.get('day');
            if (!day) {
              day = 7;
            }
            for (let i = 0; i < day; i++) {
              orderData[this.weeks[i]] = 0;
              profitData[this.weeks[i]] = 0;
            }
            break;
          case 'month':
            for (let i = 0; i < _today.get('date'); i++) {
              orderData[i + 1] = 0;
              profitData[i + 1] = 0;
            }
            break;
          case 'total':
            break;
        }
        orders = orders.filter((item) => item.product);
        for (const order of orders) {
          order.adminDiscount = 0;

          if (order.product?.discount) {
            order.adminDiscount =
              (order.product.price - order.product.priceWithDiscount) *
              order.country.toUSD;
          }

          if (order.discountCodePrice) {
            order.adminDiscount = order.adminDiscount + order.discountCodePrice;
          }
          order.commissionC =
            (order.product?.price / 100) * 4 +
            order.country.processingFee * order.country.toUSD;

          order.commissionV = order.product?.commission;

          order.discount = order.initPoint
            ? order.pricePaid - order.initPoint.unitPrice
            : order.pricePaid;
          const commissionSum = order.commissionC + order.commissionV;
          order.adminIncome =
            commissionSum / order.country.toUSD - order.discount;

          order.className = 'text-success';

          if (order.adminIncome < 0) {
            order.className = 'text-danger';
          }

          const date = this.getXaxisKey(order.paidDate);
          orderData[date] = orderData[date] ? orderData[date] + 1 : 1;
          const profit = order.adminIncome;
          profitData[date] = profitData[date]
            ? profitData[date] + profit
            : profit;
        }

        const keys = Object.keys(orderData);
        const salesSeries = [];
        const profitSeries = [];
        const categories = [];
        if (!['week', 'month'].includes(this.filterDate)) {
          const a = keys.sort((a, b) =>
            this.filterDate === 'total'
              ? moment(a, 'YYYY-MMM').valueOf() -
                moment(b, 'YYYY-MMM').valueOf()
              : a > b
              ? 1
              : -1
          );
          console.log(a);
        }

        keys.forEach((key) => {
          salesSeries.push(Number(orderData[key])?.toFixed(2));
          profitSeries.push(Number(profitData[key])?.toFixed(2));
          categories.push(key);
        });
        this.SalesChartOptions.title.text = salesSeries.reduce(
          (previousValue, currentValue) =>
            previousValue + Number(currentValue) || 0,
          0
        );
        this.SalesChartOptions.series = [{ name: 'Ventas', data: salesSeries }];
        this.SalesChartOptions.xaxis.categories = categories;
        this.SalesChartOptions.yaxis = {
          min: 0,
          max: Math.max(...salesSeries) + 10,
          tickAmount: keys.length,
        };

        this.ProfitsChartOptions.title.text = `$${profitSeries
          .reduce(
            (previousValue, currentValue) =>
              previousValue + Number(currentValue) || 0,
            0
          )
          .toFixed(2)}`;
        this.ProfitsChartOptions.series = [
          { name: 'Ventas', data: profitSeries },
        ];
        this.ProfitsChartOptions.xaxis.categories = categories;
        this.ProfitsChartOptions.yaxis = {
          min: 0,
          max: Math.max(...profitSeries) + 10,
          tickAmount: keys.length,
        };
        this.orders = orders;
        this.loading = false;
      })
      .catch((e) => {
        console.log(e);
        this.pageService.showError(e);
      })
      .finally(() => (this.loading = false));
  }

  getCountries(): void {
    const endPoint = this.settings.endPoints.countries;

    this.pageService
      .httpGetAll(endPoint)
      .then((res) => (this.countries = res.data))
      .catch((e) => this.pageService.showError(e));
  }
  nextPage(): void {
    this.page++;
  }

  previousPage(): void {
    this.page--;
  }
}
