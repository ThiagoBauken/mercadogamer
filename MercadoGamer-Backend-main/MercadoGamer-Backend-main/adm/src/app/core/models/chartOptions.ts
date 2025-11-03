import {
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
  ApexResponsive
} from "ng-apexcharts";

type ChartOptions = {
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

type AreaChartOptions = {
  title: ApexTitleSubtitle;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
}

export { ChartOptions, AreaChartOptions };
