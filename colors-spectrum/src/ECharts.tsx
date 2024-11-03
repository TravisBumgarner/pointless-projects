import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

type Props = {
    selectedColors: Set<string>
}

const ECharts3DScatter = ({selectedColors}: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
        // Not sure how charts play with Hex vs RGB so I'm doing this awful mashup.
      const data = [];

      for (let r = 0; r < 256; r += 4) {
        for (let g = 0; g < 256; g += 4) {
          for (let b = 0; b < 256; b += 4) {
            const hexR = r.toString(16).padStart(2, '0');
            const hexG = g.toString(16).padStart(2, '0');
            const hexB = b.toString(16).padStart(2, '0');
            const hexColor = `#${hexR}${hexG}${hexB}`;

            if(selectedColors.has(hexColor)){
                console.log('match', hexColor)

            }


            const rgbaColor = `rgba(${r}, ${g}, ${b}, ${selectedColors.has(hexColor) ? 1 : 0.01})`;
            data.push([r, g, b, rgbaColor]);
          }
        }
      }
      console.log(selectedColors)

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
  }, [selectedColors]);

  return <div ref={chartRef} style={{ width: '1000px', height: '1000px' }} />;
};

export default ECharts3DScatter;