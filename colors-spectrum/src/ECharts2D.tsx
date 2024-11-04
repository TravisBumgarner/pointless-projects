import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { LazyRGBColor } from './ColorPicker';

type Color = 'red' | 'green' | 'blue';

type Props = {
  selectedColors: LazyRGBColor[]
  projectionColors: [Color, Color]
}

const ECharts2DScatter = ({ selectedColors, projectionColors }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const data = [];

      for (let r = 0; r < 256; r += 16) {
        for (let g = 0; g < 256; g += 16) {
          const color = `${r},${g},0`;
          data.push([r, g, `rgba(${color}, 0.1)`]);
        }
      }

      selectedColors.forEach((color) => {
        const projectionColor = `rgba(${projectionColors.includes('red') ? color.red : 0},${projectionColors.includes('green') ? color.green : 0},${projectionColors.includes('blue') ? color.blue : 0}, 1)` 

        data.push([color[projectionColors[0]], color[projectionColors[1]], projectionColor]);
      });

      const option = {
        tooltip: {},
        xAxis: {
          type: 'value',
          name: projectionColors[0],
          min: 0,
          max: 255
        },
        yAxis: {
          type: 'value',
          name: projectionColors[1],
          min: 0,
          max: 255
        },
        grid: {
          left: '10%',
          right: '10%',
          top: '10%',
          bottom: '10%'
        },
        series: [
          {
            type: 'scatter',
            symbolSize: 8,
            data: data,
            itemStyle: {
              color: (params: any) => params.value[2]
            }
          }
        ]
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [selectedColors, projectionColors]);

  return <div ref={chartRef} style={{ width: '500px', height: '500px' }} />;
};

export default ECharts2DScatter;