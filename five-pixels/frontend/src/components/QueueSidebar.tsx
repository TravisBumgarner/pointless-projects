import { useMemo, useState } from "react";
import { postQueue } from "../api";
import useStore from "../store";
import Turnstile from "./Turnstile";

const Queue = () => {
  const clientId = useStore((state) => state.clientId);
  const queue = useStore((state) => state.queue);
  const setQueue = useStore((state) => state.setQueue);
  const addAlert = useStore((state) => state.addAlert);
  const placeInQueue = useStore((state) => state.placeInQueue);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const setError = useStore((state) => state.setError);
  const setShowWelcomeModal = useStore((state) => state.setShowWelcomeModal);
  const [token, setToken] = useState<string | null>(null);
  console.log("token", token);
  const joinQueue = async () => {
    if (!clientId) {
      addAlert("Something went wrong. Please refresh the page.");
      return;
    }

    if (!token) {
      addAlert("Something went wrong. Please refresh the page.");
      return;
    }

    const response = await postQueue({ token, clientId });
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
  console.log("placeInQueue", placeInQueue);
  console.log("token", token);
  return (
    <div
      className="border"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: "10px",
      }}
    >
      <Turnstile setToken={setToken} />
      <p style={{ flexGrow: 1, textAlign: "center" }}>{display}</p>
      <button
        style={{ width: "100px" }}
        disabled={placeInQueue !== null || !token}
        onClick={joinQueue}
      >
        {!token ? "Authing..." : "Queue"}
      </button>
      <button
        style={{ width: "125px" }}
        onClick={() => setShowWelcomeModal(true)}
      >
        How to Play
      </button>
    </div>
  );
};

export default Queue;
