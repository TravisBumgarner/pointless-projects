import { useEffect } from "react";
import Alert from "./AlertManager";
import { init } from "./api";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";
import ErrorHandler from "./ErrorHandler";
import PaintSidebar from "./PaintSidebar";
import QueueSidebar from "./QueueSidebar";
import useStore from "./store";
import useEventSource from "./useEventSource";

function App() {
  useEventSource();

  const setPoints = useStore((state) => state.setPoints);
  const setQueue = useStore((state) => state.setQueue);
  const setError = useStore((state) => state.setError);
  
  useEffect(() => {
    init().then((response) => {
      console.log('response', response)
      if ("error" in response) {
        setError(response.error);
      } else {
        setPoints(response.canvas);
        setQueue(response.queue);
      }
    });
  }, [setPoints, setQueue, setError]);

  return (
    <>
      <h1>Colab Canvas</h1>
      <ErrorHandler />
      <Alert />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "200px" }}>
          <QueueSidebar />
          <PaintSidebar />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Canvas />
          <ColorPicker />
        </div>
      </div>
    </>
  );
}

export default App;
