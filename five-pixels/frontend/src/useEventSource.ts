import { useEffect } from "react";
import { ErrorType } from "../../shared";
import { SSEMessage, SSEMessageType } from "../../shared/types";
import useStore from "./store";
import { playSound } from "./utilities";

const URL = `${import.meta.env.VITE_API_BASE_URL}/events`;

const useEventSource = () => {
  const setClientId = useStore((state) => state.setClientId);
  const setQueue = useStore((state) => state.setQueue);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const setPoints = useStore((state) => state.setPoints);
  const addAlert = useStore((state) => state.addAlert);
  const moveUpInQueue = useStore((state) => state.moveUpInQueue);
  const setError = useStore((state) => state.setError);
  const stateError = useStore((state) => state.error);
  const setCanPaint = useStore((state) => state.setCanPaint);

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
          addAlert(`You can paint!`);
          playSound("beep");
          setCanPaint(true);
          document.title = "You can paint!";
          break;
        }
        case SSEMessageType.YouAreNext: {
          addAlert("You're up next!");
          playSound("beep");
          document.title = "You're up next!";
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
        case SSEMessageType.TurnOver: {
          setCanPaint(false);
          document.title = "Five Pixels"
          // There's a race condition with trying to setPlaceInQUeue to null with YourTurn so putting here.
          setPlaceInQueue(null);
          break;
        }
        case SSEMessageType.System: {
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

    eventSource.onerror = (error: Event) => {
      console.error("Event source error", error);
      if (stateError === ErrorType.ConnectionError) {
        // If the server has failed from rate limiting, no need to display a connection error.
        setError(ErrorType.ConnectionError);
      }
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
    moveUpInQueue,
    setError,
    stateError,
    setCanPaint,
    setPlaceInQueue,
  ]);
};

export default useEventSource;
