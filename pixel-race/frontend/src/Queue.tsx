import { useCallback, useEffect, useMemo, useState } from "react";
import { PAINTING_TIME_MS } from "../../shared";
import { postQueue } from "./api";
import useStore from "./store";

const Queue = () => {
  const clientId = useStore((state) => state.clientId);
  const queue = useStore((state) => state.queue);
  const setQueue = useStore((state) => state.setQueue);
  const addAlert = useStore((state) => state.addAlert);
  const placeInQueue = useStore((state) => state.placeInQueue);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const [timeRemaining, setTimeRemaining] = useState(PAINTING_TIME_MS / 1000);

  const startTimer = useCallback(() => {
    setTimeRemaining(PAINTING_TIME_MS / 1000);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (placeInQueue === 0) {
      startTimer();
    }
  }, [placeInQueue, startTimer]);

  const joinQueue = async () => {
    if (!clientId) {
      addAlert("Something went wrong. Please refresh the page.");
      return;
    }
    const response = await postQueue(clientId);
    if (response.p !== null) {
      if (response.p === 1) {
        addAlert("You are the first in the queue.");
      } else {
        addAlert("You have joined the queue.");
      }
      setQueue(response.p);
      setPlaceInQueue(response.p);
    }
    if (!response) {
      addAlert("Something went wrong. Please refresh the page.");
    }
  };

  const display = useMemo(() => {
    if (placeInQueue === null) {
      return `Queue: ${queue}`;
    }

    if (placeInQueue === 0 && timeRemaining === 0) {
      return "Your time has expired, please queue again.";
    }

    if (placeInQueue === 0) {
      return `Time Remaining: ${timeRemaining}`;
    }

    if (placeInQueue > 0) {
      return `Queue: ${placeInQueue} / ${queue}`;
    }
  }, [placeInQueue, queue, timeRemaining]);

  return (
    <div>
      <h3>{display}</h3>
      <div>
        <button onClick={joinQueue}>Join</button>
      </div>
    </div>
  );
};

export default Queue;
