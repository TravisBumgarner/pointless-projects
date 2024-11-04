import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { RGBColor } from 'react-color';
import { PickedColors } from './types';
import { generateColors } from './utilities';
import ColorDisplay from './ColorDisplay';
import styled from 'styled-components';

type Color = 'r' | 'g' | 'b';

type Props = {
  selectedColors: PickedColors;
  projectionColorKey: Color
}

const ECharts1DScatter = ({ selectedColors, projectionColorKey }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [projectionColors, setProjectionColors] = React.useState<RGBColor[]>([]);

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
      
      const newProjectionColors: RGBColor[] = []
      generateColors(selectedColors).forEach((color) => {
        // sloopy slooopy
        const projectedColor = {r: projectionColorKey === 'r' ? color.r : 0, g: projectionColorKey === 'g' ? color.g : 0, b: projectionColorKey === 'b' ? color.b : 0};
        const projectionColor = `rgba(${projectionColorKey ==='r' ? color.r : 0},${projectionColorKey ==='g' ? color.g : 0},${projectionColorKey ==='b' ? color.b : 0}, 1)` 
        newProjectionColors.push(projectedColor);
        data.push([color[projectionColorKey], 0, projectionColor]);
      });

      setProjectionColors(newProjectionColors);

      const option = {
        tooltip: {},
        xAxis: {
          type: 'value',
          name: projectionColorKey,
          min: 0,
          max: 255
        },
        yAxis: {
          type: 'value',
          min: -5,
          max: 5
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
  }, [selectedColors, projectionColorKey]);

  return <Wrapper>
  <div ref={chartRef} style={{ width: '300px', height: '300px' }} />
    <ColorDisplay column colors={projectionColors} />

  </Wrapper>
};

const Wrapper = styled.div`
`

export default ECharts1DScatter;