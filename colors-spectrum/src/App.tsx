import { useCallback, useState } from 'react';
import './App.css';
import ColorInterpolator from './ColorPicker';
import ECharts3DScatter from './ECharts';



function App() {

  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  console.log(selectedColors)
  const colorChangeCallback  = useCallback((colors: Set<string>) => {
    // This should not mutate but make a new reference. 
    setSelectedColors(colors)
  }, [])

  return (
    <>
    <ColorInterpolator colorChangeCallback={colorChangeCallback} />
    <ECharts3DScatter selectedColors={selectedColors}/>
    {/* <ColorGraph/> */}
    </>
  );
}

export default App;
