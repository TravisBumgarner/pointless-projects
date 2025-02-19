import { useEffect } from "react";
import Alert from "./AlertManager";
import { init } from "./api";
import Canvas from "./Canvas";
import ErrorHandler from "./ErrorHandler";
import MoreFromTheCreator from "./MoreFromTheCreator";
import PaintSidebar from "./PaintSidebar";
import QueueSidebar from "./QueueSidebar";
import useStore from "./store";
import useEventSource from "./useEventSource";
import WelcomeModal from "./WelcomeModal";
import { useTimer } from "./useTimer";

function App() {
  useEventSource();
  useTimer();
  
  const setPoints = useStore((state) => state.setPoints);
  const setQueue = useStore((state) => state.setQueue);
  const setError = useStore((state) => state.setError);
  const canPaint = useStore((state) => state.canPaint);
  
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
        <div style={{ display: "flex", flexDirection: "column", width: "220px", marginRight: '10px' }}>
          <h1>Paint Together!</h1>
          {canPaint ? <PaintSidebar /> : <QueueSidebar />}
          <MoreFromTheCreator />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Canvas />
        </div>
      </div>
    </div>
  );
}

export default App;
