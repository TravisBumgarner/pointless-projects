import { useCallback, useEffect, useRef } from "react";
import { MAX_PAINT_POINTS } from "../../shared";
import { postPaint } from "./api";
import ColorPicker from "./ColorPicker";
import useStore from "./store";

const PaintSidebar = () => {
  const tempPoints = useStore((state) => state.tempPoints);
  const pointsLeft = MAX_PAINT_POINTS - Object.keys(tempPoints).length;
  const timeRemaining = useStore((state) => state.timeRemaining);
  const placeInQueue = useStore((state) => state.placeInQueue);
  const addAlert = useStore((state) => state.addAlert);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const setTempPoints = useStore((state) => state.setTempPoints);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickTimeRemaining = useStore((state) => state.tickTimeRemaining);
  const resetTimeRemaining = useStore((state) => state.resetTimeRemaining);
  const canPaint = placeInQueue === 0;
  const hasPainted = Object.keys(tempPoints).length > 0;
  const clientId = useStore((state) => state.clientId);
  const setError = useStore((state) => state.setError);

  const clearTempPoints = () => {
    setTempPoints({});
  };

  const handlePaint = async () => {
    if (!clientId) {
      addAlert("You are not logged in.");
      return;
    }

    const response = await postPaint(tempPoints, clientId);
    if ("error" in response) {
      setError(response.error);
    } else {
      setTempPoints({});
      setPlaceInQueue(null);
    }
  };

  const reset = useCallback(() => {
    resetTimeRemaining();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlaceInQueue(null);
    setTempPoints({});
  }, [setPlaceInQueue, setTempPoints, resetTimeRemaining]);

  useEffect(() => {
    // Once the user finishes their turn, their placeInQueue is set to null so we reset.
    if (placeInQueue === null) {
      reset();
    }
  }, [placeInQueue, reset]);

  const startTimer = useCallback(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      tickTimeRemaining();
    }, 1000);

    // Return cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tickTimeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      addAlert("Your time has expired.");
      reset();
    }
  }, [timeRemaining, addAlert, reset]);

  useEffect(() => {
    if (placeInQueue === 0) {
      // Store the cleanup function
      const cleanup = startTimer();
      // Run cleanup on unmount
      return cleanup;
    }
  }, [placeInQueue, startTimer]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: '5px' }}>
        <div className="border" style={{ flexGrow: 1, textAlign: "center" }}>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>{pointsLeft}</p>
          <p>Pixels Left</p>
        </div>
        <div className="border" style={{ flexGrow: 1, textAlign: "center" }}>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            {timeRemaining}s
          </p>
          <p>To Go</p>
        </div>
      </div>
      <ColorPicker />
      <div
        className="border"
        style={{
          flexGrow: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          disabled={!hasPainted}
          onClick={clearTempPoints}
          className="destructive"
        >
          Clear
        </button>
        <button
          style={{ marginLeft: "5px" }}
          disabled={!canPaint || !hasPainted}
          onClick={handlePaint}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PaintSidebar;
