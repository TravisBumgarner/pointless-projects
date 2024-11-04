import { useCallback, useMemo, useState } from 'react';
import './App.css';
import ColorInterpolator from './ColorPicker';
import ECharts3DScatter from './ECharts3D';
import styled from 'styled-components';
import ECharts2DScatter from './ECharts2D';
import { RGBColor } from 'react-color';
import { PickedColors } from './types';
import ECharts1DScatter from './ECharts1D';



function App() {
  const [view, setView] = useState<'1d' | '2d' | '3d'>('3d');
  const [selectedColors, setSelectedColors] = useState<PickedColors>({startColor: {r: 0, g: 0, b: 0}, endColor: {r: 255, g: 255, b: 255}, increments: 5})  ;
  const colorChangeCallback  = useCallback((colors: PickedColors) => {
    // This should not mutate but make a new reference. 
    setSelectedColors(colors)
  }, [])

  const content = useMemo(() => {
    if (view === '1d') {
      return <>
      <ECharts1DScatter selectedColors={selectedColors} projectionColorKey={'r'} />
       <ECharts1DScatter selectedColors={selectedColors} projectionColorKey={'g'} />
       <ECharts1DScatter selectedColors={selectedColors} projectionColorKey={'b'} />
       </>
    } else if (view === '2d') {
      return <>
      <ECharts2DScatter selectedColors={selectedColors} projectionColorKeys={['r', 'g']} />
       <ECharts2DScatter selectedColors={selectedColors} projectionColorKeys={['g', 'b']} />
       <ECharts2DScatter selectedColors={selectedColors} projectionColorKeys={['r', 'b']} />
       </>
    } else {
      return <ECharts3DScatter selectedColors={selectedColors}/>
    }
  }, [view, selectedColors])

  return (
    <>
    <ButtonsWrapper>
      <button onClick={() => setView('1d')}>1D</button>
      <button onClick={() => setView('2d')}>2D</button>
      <button onClick={() => setView('3d')}>3D</button>
    </ButtonsWrapper>

    <Wrapper>
    
    <ColorInterpolator colorChangeCallback={colorChangeCallback} />
    {content}
    </Wrapper>
    </>
  );
}

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

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
