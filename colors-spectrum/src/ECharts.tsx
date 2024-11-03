import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

type Props = {
    selectedColors: Set<string>
}

const selectedColors = new Set<string>(['#34a848']);

const ECharts3DScatter = (
    // {selectedColors}: Props
) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('use effect called')
    let counter = 0
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
        // Not sure how charts play with Hex vs RGB so I'm doing this awful mashup.
      const data = [];

      for (let r = 0; r < 256; r += 4) {
        for (let g = 0; g < 256; g += 4) {
          for (let b = 0; b < 256; b += 4) {
            const color = `${r},${g},${b}`;
      
            if (selectedColors.has(color)) {
                console.log(counter, 'match', color);
                counter += 1
            }
      
            // const rgbaColor = `rgba(${r}, ${g}, ${b}, ${selectedColors.has(hexColor) ? 1 : 1})`;
            data.push([r, g, b, `rgb(${color})`]);
          }
        }
      }
      console.log('selected colors should be a const?????', selectedColors)

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
  }, [
    // selectedColors
]);

  return <div ref={chartRef} style={{ width: '500px', height: '500px' }} />;
};

export default ECharts3DScatter;