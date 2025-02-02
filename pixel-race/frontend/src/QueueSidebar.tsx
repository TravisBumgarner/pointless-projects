import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const setError = useStore((state) => state.setError);
  const setTempPoints = useStore((state) => state.setTempPoints);
  const [timeRemaining, setTimeRemaining] = useState(PAINTING_TIME_MS / 1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  const reset = useCallback(() => {
    setTimeRemaining(PAINTING_TIME_MS / 1000);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlaceInQueue(null);
    setTempPoints({});  
  }, [setPlaceInQueue, setTempPoints]);

  useEffect(() => {
    // Once the user finishes their turn, their placeInQueue is set to null so we reset.
    if (placeInQueue === null) {
      reset();
    }
  }, [placeInQueue, reset]);


  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === 1) {
          reset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    if (placeInQueue === 0) {
      startTimer();
    }
  }, [placeInQueue, startTimer]);

  useEffect(() => {
    if (placeInQueue === 0 && timeRemaining === 0) {
      addAlert("Your time has expired, please queue again.");
      reset();
    }
  }, [timeRemaining, placeInQueue, addAlert, reset]);

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
      setPlaceInQueue(response.queueSize);
    }
  };

  const display = useMemo(() => {
    if (placeInQueue === 0) {
      return `Time Remaining: ${timeRemaining}`;
    }

    if (placeInQueue === null) {
      if (queue === 0) {
        return "No one painting";
      }

      return `Queue: ${queue}`;
    }

    if (placeInQueue > 0) {
      return `Queue: ${placeInQueue} / ${queue}`;
    }
  }, [placeInQueue, queue, timeRemaining]);

  return (
    <div className="border">
      <p style={{ textAlign: "center" }}>{display}</p>
      <div>
        <button disabled={placeInQueue !== null} onClick={joinQueue}>
          Join Queue
        </button>
      </div>
    </div>
  );
};

export default Queue;
