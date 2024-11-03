import './App.css';
import ColorGraph from './ColorGraph';
import ColorInterpolator from './ColorPicker';
import ECharts3DScatter from './ECharts';

function App() {
  return (
    <>
    <ECharts3DScatter />
    <ColorGraph/>
    <ColorInterpolator />
    </>
  );
}

export default App;
