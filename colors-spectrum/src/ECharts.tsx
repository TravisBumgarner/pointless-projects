import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

const ECharts3DScatter = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: '3D Scatter Plot',
        },
        tooltip: {},
        xAxis3D: {
          type: 'value',
        },
        yAxis3D: {
          type: 'value',
        },
        zAxis3D: {
          type: 'value',
        },
        grid3D: {
          viewControl: {
            projection: 'perspective',
          },
        },
        series: [
          {
            type: 'scatter3D',
            symbolSize: 5,
            data: [
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 9],
              [10, 11, 12],
              [13, 14, 15],
            ],
          },
        ],
      };

      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default ECharts3DScatter;