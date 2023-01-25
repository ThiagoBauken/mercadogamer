import { useCallback, useRef } from 'react';
import * as echarts from 'echarts';
import { FilterDateType } from '../..';
import { useWindowSize } from '@hooks';
import { formatInteger } from '@utils';
import moment from 'moment';
import { ThemeColor } from '@theme/color';

type Props = {
  type: FilterDateType;
  data: RouletteTransactionModelType[];
};
export const Charts: React.FC<Props> = ({ type, data }) => {
  const instance = useRef(null);
  const { width } = useWindowSize();

  const callbackRef = useCallback(
    (ref) => {
      const chartDom = document.getElementById('charts-container');
      const myChart = instance.current?.dispose ? instance.current : echarts.init(chartDom);
      let xAxisData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let series = [];
      switch (type) {
        case 'all':
          xAxisData = data.map((item) => moment(item.createdAt).format('YYYY-MM-DD'));
          xAxisData = [...new Set(xAxisData)];
          xAxisData.forEach((x, index) => {
            series.push(
              data.filter((item) => moment(item.createdAt).format('YYYY-MM-DD') === x).length
            );
          });
          break;
        case 'today':
          xAxisData = Array.from(Array(24).keys()).map((value) => formatInteger(value));
          xAxisData.forEach((x, index) => {
            series.push(data.filter((item) => moment(item.createdAt).hour() === index).length);
          });
          break;
        case 'week':
          xAxisData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          xAxisData.forEach((x, index) => {
            series.push(data.filter((item) => moment(item.createdAt).day() === index).length);
          });
          break;
        case 'thisMonth':
        case 'lastMonth':
          xAxisData = Array.from(Array(31).keys()).map((value) => formatInteger(value + 1));
          xAxisData.forEach((x, index) => {
            series.push(data.filter((item) => moment(item.createdAt).date() === index).length);
          });
          break;
        case 'year':
          xAxisData = Array.from(Array(12).keys()).map((value) => formatInteger(value + 1));
          xAxisData.forEach((x, index) => {
            series.push(data.filter((item) => moment(item.createdAt).month() === index).length);
          });
          break;
      }
      const option: echarts.EChartsOption = {
        xAxis: { type: 'category', data: xAxisData },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ThemeColor['gray-100'],
            },
          },
        },
        series: [
          {
            data: series,
            type: 'line',
            smooth: true,
            color: ThemeColor.primary,
          },
        ],
        grid: {
          top: 10,
          bottom: 30,
          right: 10,
          left: 40,
        },
      };

      option && myChart.setOption(option);

      instance.current = myChart;
    },
    [type, data, width]
  );

  return <div ref={callbackRef} id="charts-container" style={{ height: 350, width: '100%' }}></div>;
};
