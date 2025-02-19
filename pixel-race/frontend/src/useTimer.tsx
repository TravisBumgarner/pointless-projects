import { useCallback, useEffect, useRef } from "react";
import useStore from "./store";

export const useTimer = () => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const tickTimeRemaining = useStore((state) => state.tickTimeRemaining);
    const timeRemaining = useStore((state) => state.timeRemaining);
    const addAlert = useStore((state) => state.addAlert);
    const resetTimeRemaining = useStore((state) => state.resetTimeRemaining);
    const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
    const setTempPoints = useStore((state) => state.setTempPoints);
    const canPaint = useStore((state) => state.canPaint);
    const setCanPaint = useStore((state) => state.setCanPaint);

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
          console.log('cleanup');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }, []);
    
      useEffect(() => {
        if (timeRemaining === 0) {
            // Only alert here. Everything else in next useEffect.
            addAlert("Your time has expired.");
        }
      }, [timeRemaining, addAlert, reset]);
    
      useEffect(() => {
        if (canPaint!) reset();
      }, [canPaint, reset]);

      useEffect(() => {
        console.log('can paint??', canPaint)
        if (canPaint) {
          const cleanup = startTimer();
          return cleanup;
        }
      }, [canPaint, startTimer]);
}