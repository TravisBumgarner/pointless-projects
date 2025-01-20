import { useEffect } from 'react';
import Alert from './AlertManager';
import { init } from './api';
import './App.css';
import Canvas from './Canvas';
import ConnectionError from './ConnectionError';
import Queue from './Queue';
import useStore from './store';
import useEventSource from './useEventSource';

function App() {
  useEventSource();
  
  const connectionError = useStore((state) => state.connectionError);
  
  const setPoints = useStore((state) => state.setPoints);
  const setQueue = useStore((state) => state.setQueue);
  const clientId = useStore((state) => state.clientId);

  useEffect(() => {
    init().then(({ canvas, queue }) => {
      setPoints(canvas);
      setQueue(queue);
    });
  }, [setPoints, setQueue]);

  return (
    <>
    {connectionError && <ConnectionError />}
    <h5>You are {clientId}</h5>
     <Queue />
     <Canvas  />
     <Alert />
    </>
  )
}

export default App
