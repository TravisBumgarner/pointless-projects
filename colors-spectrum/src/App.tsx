import { useCallback, useState } from 'react';
import './App.css';
import ColorInterpolator, { LazyRGBColor } from './ColorPicker';
import ECharts3DScatter from './ECharts';



function App() {

  const [selectedColors, setSelectedColors] = useState<LazyRGBColor[]>([]);
  const colorChangeCallback  = useCallback((colors: LazyRGBColor[]) => {
    // This should not mutate but make a new reference. 
    setSelectedColors(colors)
  }, [])

  return (
    <>
    <ColorInterpolator colorChangeCallback={colorChangeCallback} />
    <ECharts3DScatter 
    selectedColors={selectedColors}
    />
    {/* <ColorGraph/> */}
    </>
  );
}

export default App;
