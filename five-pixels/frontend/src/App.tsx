import { useEffect } from "react";
import { init } from "./api";
import AlertManager from "./components/AlertManager";
import Canvas from "./components/Canvas";
import ErrorHandler from "./components/ErrorHandler";
import Header from "./components/Header";
import PaintSidebar from "./components/PaintSidebar";
import QueueSidebar from "./components/QueueSidebar";
import WelcomeModal from "./components/WelcomeModal";
import useEventSource from "./hooks/useEventSource";
import { useTabManager } from "./hooks/useTabManager";
import { useTimer } from "./hooks/useTimer";
import useStore from "./store";

function App() {
  useEventSource();
  useTimer();
  useTabManager();

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
    <div
      style={{
        margin: "5px auto 0",
        width: "510px",
        maxWidth: "100vw",
      }}
    >
      <Header />
      <WelcomeModal />
      <ErrorHandler />
      <Canvas />
      {canPaint ? <PaintSidebar /> : <QueueSidebar />}
      <AlertManager />
    </div>
  );
}

export default App;
