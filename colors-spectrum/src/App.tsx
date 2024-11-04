import { useCallback, useState } from 'react';
import './App.css';
import ColorInterpolator, { LazyRGBColor } from './ColorPicker';
import ECharts3DScatter from './ECharts3D';
import styled from 'styled-components';
import ECharts2DScatter from './ECharts2D';



function App() {

  const [selectedColors, setSelectedColors] = useState<LazyRGBColor[]>([]);
  const colorChangeCallback  = useCallback((colors: LazyRGBColor[]) => {
    // This should not mutate but make a new reference. 
    setSelectedColors(colors)
  }, [])

  return (
    <Wrapper>
    <ColorInterpolator colorChangeCallback={colorChangeCallback} />
    <ChartContainer>

    {/* <ECharts3DScatter selectedColors={selectedColors}/> */}
    </ChartContainer>
    <ECharts2DScatter selectedColors={selectedColors} projectionColors={['red', 'green']} />
    <ECharts2DScatter selectedColors={selectedColors} projectionColors={['green', 'blue']} />
    <ECharts2DScatter selectedColors={selectedColors} projectionColors={['red', 'blue']} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
`;

const ChartContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export default App;
