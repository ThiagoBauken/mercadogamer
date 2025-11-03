import { Component, ViewChild, OnInit } from '@angular/core';
import { PageService } from '../../core/page.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/core/models/chartOptions';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public AreaChartOptions: Partial<ChartOptions>;
  public DonutChartOptions: Partial<ChartOptions>;
  chat = false;
  selectedCountry = 'select';

  public filterOptions: { label: string; code: string }[] = [
    { label: 'Hoy', code: 'day' },
    { label: 'Semana', code: 'week' },
    { label: 'Mes', code: 'month' },
    { label: 'Totales', code: 'total' },
  ];

  public currentFilter = 'day';

  constructor(
    public pageService: PageService,
    public config: NgbCarouselConfig
  ) {
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
                label: 'Compras',
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
      labels: ['Finalizadas', 'Con descuento', 'Resueltos', 'Devueltos'],
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
          breakpoint: 1480,
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

  ngOnInit(): void {}

  public filterData(type: string): void {
    this.currentFilter = type;
    switch (type) {
      case 'week':
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
      case 'day':
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
      case 'month':
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
}
