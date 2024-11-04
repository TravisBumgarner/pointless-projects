import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import { RGBColor } from 'react-color';
import ColorDisplay from './ColorDisplay';
import { generateColors } from './utilities';
import { PickedColors } from './types';
import styled from 'styled-components';

type Props = {
    selectedColors: PickedColors
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

      generateColors(selectedColors).forEach((color) => {
        const {r, g, b} = color
        data.push([r, g, b, `rgba(${r},${g},${b}, 1)`]);
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

    return <Wrapper>
    <div ref={chartRef} style={{ width: '100%', height: '100%', flex: 1 }} />
    <ColorDisplay colors={generateColors(selectedColors)} />
    </Wrapper>
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`

export default ECharts3DScatter;