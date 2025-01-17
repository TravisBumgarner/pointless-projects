import { useEffect } from "react";
import { SSEMessage, SSEMessageType } from "../../shared/types";
import useStore from "./store";

const URL = "http://localhost:8000/events";

const useEventSource = () => {
  const setClientId = useStore((state) => state.setClientId);
  const setQueue = useStore((state) => state.setQueue);
  const setPoints = useStore((state) => state.setPoints);
  useEffect(() => {
    const eventSource = new EventSource(URL);

    eventSource.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as SSEMessage;
      switch (message.t) {
        case SSEMessageType.Auth: {
          setClientId(message.m);
          break;
        }
        case SSEMessageType.Queue: {
          setQueue(message.m);
          break;
        }
        case SSEMessageType.Paint: {
          setPoints(message.p);
          break;
        }
        case SSEMessageType.UserInfo: {
          alert(message.m)
          break;
        }
        case SSEMessageType.System: {
          console.log(message.m)
          break;
        }
        default: {
          console.error("Unknown event type", message);
        }
      }
    };

    eventSource.onopen = () => {
      // setIsConnected(true);
    };

    eventSource.onerror = () => {
      // setError("Error with SSE connection");
      console.error("Error with SSE connection");
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Clean up the connection on component unmount
    };
  }, [
    setClientId,
    setQueue,
    setPoints,
  ]);
};

export default useEventSource;
