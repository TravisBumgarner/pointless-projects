import { useEffect } from "react";
import Alert from "./AlertManager";
import { init } from "./api";
import Canvas from "./Canvas";
import ErrorHandler from "./ErrorHandler";
import Header from "./Header";
import { useTabManager } from "./hooks/useTabManager";
import PaintSidebar from "./PaintSidebar";
import QueueSidebar from "./QueueSidebar";
import useStore from "./store";
import useEventSource from "./useEventSource";
import { useTimer } from "./useTimer";
import WelcomeModal from "./WelcomeModal";

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
      <Alert />
    </div>
  );
}

export default App;
