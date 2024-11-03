import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import { LazyRGBColor } from './ColorPicker';

type Props = {
    selectedColors: LazyRGBColor[]
}

const ECharts3DScatter = (
    {selectedColors}: Props
) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
        // Not sure how charts play with Hex vs RGB so I'm doing this awful mashup.
      const data = [];

      for (let r = 0; r < 256; r += 16) {
        for (let g = 0; g < 256; g += 16) {
          for (let b = 0; b < 256; b += 16) {
            const color = `${r},${g},${b}`;
            data.push([r, g, b, `rgba(${color}, 0.1)`]);
          }
        }
      }
      console.log('selected', selectedColors)
      selectedColors.forEach((color) => {
        const {red, green, blue} = color
        data.push([red, green, blue, `rgba(${red},${green},${blue}, 1)`]);
      })

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
          },
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
  }, [
    selectedColors
]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default ECharts3DScatter;