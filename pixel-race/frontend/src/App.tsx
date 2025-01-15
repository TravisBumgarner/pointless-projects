import './App.css';
import Canvas from './Canvas';
import Queue from './Queue';
import useEventSource from './useEventSource';
function App() {
  useEventSource();

  return (
    <>
     <Queue />
     <Canvas  />
    </>
  )
}

export default App
