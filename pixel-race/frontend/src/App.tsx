import { useEffect } from "react";
import Alert from "./AlertManager";
import { init } from "./api";
import "./App.css";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";
import ConnectionError from "./ConnectionError";
import PaintSidebar from "./PaintSidebar";
import QueueSidebar from "./QueueSidebar";
import useStore from "./store";
import useEventSource from "./useEventSource";

function App() {
  useEventSource();

  const setPoints = useStore((state) => state.setPoints);
  const setQueue = useStore((state) => state.setQueue);

  useEffect(() => {
    init().then(({ canvas, queue }) => {
      setPoints(canvas);
      setQueue(queue);
    });
  }, [setPoints, setQueue]);

  return (
    <>
      <h1 style={{ margin: "10px" }}>Pixel Race</h1>
      <ConnectionError />
      <Alert />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
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
