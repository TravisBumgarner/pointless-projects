import { useCallback, useState } from 'react';
import './App.css';
import ColorInterpolator, { LazyRGBColor } from './ColorPicker';
import ECharts3DScatter from './ECharts';
import styled from 'styled-components';



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

    <ECharts3DScatter 
    selectedColors={selectedColors}
    />
          </ChartContainer>

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
