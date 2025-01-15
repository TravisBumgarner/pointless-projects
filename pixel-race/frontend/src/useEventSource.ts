import { useEffect } from "react";
import { MessageType } from "../../shared/types";
import useEventStore from "./store";
import { EventType } from "./types";
import { decodePoints } from "./utilities";

const URL = "http://localhost:8000/events";

type PaintEvent = {
  t: MessageType.Paint;
  p: Record<string, string>;
  q: number;
};

type SystemEvent = {
  t: MessageType.System;
  m: "connected" | "disconnected";
};

export type Event = PaintEvent | SystemEvent;

const useEventSource = () => {
  const setEventData = useEventStore((state) => state.setEventData);

  useEffect(() => {
    const eventSource = new EventSource(URL);

    eventSource.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as Event;

        switch (message.t) {
            case MessageType.Paint: {
                const points = decodePoints(message.p);
                setEventData({ points, queue: message.q, type: EventType.Paint });
                break;
            }
            case MessageType.System: {
                console.log(message);
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
  }, [setEventData]);
};

export default useEventSource;
