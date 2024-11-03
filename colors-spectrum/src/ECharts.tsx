import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

const ECharts3DScatter = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const data = [];
      for (let r = 0; r < 256; r += 16) {
        for (let g = 0; g < 256; g += 16) {
          for (let b = 0; b < 256; b += 16) {
            data.push([r, g, b, `rgb(${r},${g},${b})`]);
          }
        }
      }

      const option = {
        tooltip: {},
        xAxis3D: {
          type: 'value',
          name: 'Red',
          min: 0,
          max: 255
        },
        yAxis3D: {
          type: 'value',
          name: 'Green',
          min: 0,
          max: 255
        },
        zAxis3D: {
          type: 'value',
          name: 'Blue',
          min: 0,
          max: 255
        },
        grid3D: {
          viewControl: {
            projection: 'perspective'
          }
        },
        series: [
          {
            type: 'scatter3D',
            symbolSize: 8,
            data: data,
            itemStyle: {
              color: (params: any) => params.value[3]
            }
          }
        ]
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '1000px', height: '1000px' }} />;
};

export default ECharts3DScatter;