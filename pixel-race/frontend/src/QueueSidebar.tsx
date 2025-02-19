import { useMemo } from "react";
import { postQueue } from "./api";
import useStore from "./store";

const Queue = () => {
  const clientId = useStore((state) => state.clientId);
  const queue = useStore((state) => state.queue);
  const setQueue = useStore((state) => state.setQueue);
  const addAlert = useStore((state) => state.addAlert);
  const placeInQueue = useStore((state) => state.placeInQueue);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const setError = useStore((state) => state.setError);
  const setShowWelcomeModal = useStore((state) => state.setShowWelcomeModal);

  const joinQueue = async () => {
    if (!clientId) {
      addAlert("Something went wrong. Please refresh the page.");
      return;
    }
    const response = await postQueue(clientId);
    if ("error" in response) {
      setError(response.error);
    } else {
      if (response.queueSize === 0) {
        // Do Nothing. Another message will alert the user they can paint.
      } else if (response.queueSize === 1) {
        addAlert("You are the first in the queue.");
      } else {
        addAlert("You have joined the queue.");
      }
      setQueue(response.queueSize);
      console.log('setting size')
      setPlaceInQueue(response.queueSize);
    }
  };

  const display = useMemo(() => {
    if (placeInQueue === 0) {
      return `Almost there!`;
    }

    if (placeInQueue === null) {
      if (queue === 0) {
        return "Queue is Empty";
      }

      return `Queue: ${queue}`;
    }

    if (placeInQueue > 0) {
      return `Queue: ${placeInQueue} / ${queue}`;
    }
  }, [placeInQueue, queue]);

  return (
    <div className="border">
      <p style={{ textAlign: "center", marginBottom: '5px' }}>{display}</p>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: '5px' }}>
        <button disabled={placeInQueue !== null} onClick={joinQueue}>
          Queue
        </button>
        <button onClick={() => setShowWelcomeModal(true)}>How to Play</button>
      </div>
    </div>
  );
};

export default Queue;
