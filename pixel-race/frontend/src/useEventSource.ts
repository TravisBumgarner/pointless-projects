import { useEffect } from "react";
import { SSEMessage, SSEMessageType } from "../../shared/types";
import useStore from "./store";

const URL = "http://localhost:8000/events";

const useEventSource = () => {
  const setClientId = useStore((state) => state.setClientId);
  const setQueue = useStore((state) => state.setQueue);
  const setPoints = useStore((state) => state.setPoints);
  const addAlert = useStore((state) => state.addAlert);
  const moveUpInQueue = useStore((state) => state.moveUpInQueue);
  const setConnectionError = useStore((state) => state.setConnectionError);

  useEffect(() => {
    const eventSource = new EventSource(URL);

    eventSource.onmessage = (rawEvent: MessageEvent) => {
      const event = JSON.parse(rawEvent.data) as SSEMessage;
      switch (event.type) {
        case SSEMessageType.Auth: {
          setClientId(event.clientId);
          break;
        }
        case SSEMessageType.YourTurn: {
          addAlert("You can now paint. You have 10 seconds.");
          break;
        }
        case SSEMessageType.Queue: {
          setQueue(event.size);
          if (event.shouldAdvanceInQueue) {
            moveUpInQueue();
          }
          break;
        }
        case SSEMessageType.Paint: {
          setPoints(event.points);
          moveUpInQueue();
          break;
        }
        case SSEMessageType.UserInfo: {
          addAlert(event.message)
          break;
        }
        case SSEMessageType.System: {
          console.log(event.message)
          break;
        }
        default: {
          console.error("Unknown event type", event);
        }
      }
    };

    eventSource.onopen = () => {
      addAlert("Welcome!");
    };

    eventSource.onerror = () => {
      setConnectionError(true);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Clean up the connection on component unmount
    };
  }, [
    setClientId,
    setQueue,
    setPoints,
    addAlert,
    moveUpInQueue
  ]);
};

export default useEventSource;
