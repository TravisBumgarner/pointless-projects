import { useEffect } from "react";
import Alert from "./AlertManager";
import { init } from "./api";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";
import ErrorHandler from "./ErrorHandler";
import MoreFromTheCreator from "./MoreFromTheCreator";
import PaintSidebar from "./PaintSidebar";
import QueueSidebar from "./QueueSidebar";
import useStore from "./store";
import useEventSource from "./useEventSource";
import WelcomeModal from "./WelcomeModal";
function App() {
  useEventSource();

  const setPoints = useStore((state) => state.setPoints);
  const setQueue = useStore((state) => state.setQueue);
  const setError = useStore((state) => state.setError);
  
  useEffect(() => {
    init().then((response) => {
      if ("error" in response) {
        setError(response.error);
      } else {
        setPoints(response.canvas);
        setQueue(response.queue);
      }
    });
  }, [setPoints, setQueue, setError]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}>  
      <WelcomeModal />
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
          <h1 style={{ textAlign: "center" }}>Colab Canvas</h1>
          <QueueSidebar />
          <PaintSidebar />
          <MoreFromTheCreator />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Canvas />
          <ColorPicker />
        </div>
      </div>
    </div>
  );
}

export default App;
