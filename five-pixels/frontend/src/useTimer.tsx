import { useCallback, useEffect, useRef } from "react";
import useStore from "./store";
import { playSound } from "./utilities";

export const useTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickTimeRemaining = useStore((state) => state.tickTimeRemaining);
  const timeRemaining = useStore((state) => state.timeRemaining);
  const addAlert = useStore((state) => state.addAlert);
  const resetTimeRemaining = useStore((state) => state.resetTimeRemaining);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const setTempPoints = useStore((state) => state.setTempPoints);
  const canPaint = useStore((state) => state.canPaint);

  useEffect(() => {
    if (timeRemaining <= 3 && timeRemaining > 0) {
      playSound("beep");
    } else if (timeRemaining === 0) {
      playSound("gameOver");
    }
  }, [timeRemaining]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      tickTimeRemaining();
    }, 1000);
  }, [tickTimeRemaining]);

  const reset = useCallback(() => {
    resetTimeRemaining();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlaceInQueue(null);
    setTempPoints({});
  }, [setPlaceInQueue, setTempPoints, resetTimeRemaining]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      // Only alert here. Everything else in next useEffect.
      addAlert("Your time has expired.");
      reset();
    }
  }, [timeRemaining, addAlert, reset]);

  useEffect(() => {
    if (!canPaint) reset();
  }, [canPaint, reset]);

  useEffect(() => {
    if (canPaint) {
      const cleanup = startTimer();
      return cleanup;
    }
  }, [canPaint, startTimer]);
};
