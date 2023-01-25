import { useRef, useCallback } from 'react';
import * as echarts from 'echarts';

interface IProps {
  option: echarts.EChartsOption;
  style?: any;
}

export const Chart: React.FC<IProps> = (props) => {
  const instance = useRef<echarts.ECharts>(null);

  const callbackRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      if (instance.current) {
        instance.current.setOption(props.option);
      } else {
        const chart = echarts.init(ref);
        chart.setOption(props.option);
      }
    },
    [props.option]
  );

  return <div style={props.style || {}} ref={callbackRef} className="chart-container"></div>;
};
