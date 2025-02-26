// useTabManager.t, useRefs (React Hook)
import { useEffect } from "react";
import { ErrorType } from "../../../shared";
import useStore from "../store";

export const useTabManager = () => {
  const setError = useStore((state) => state.setError);
  useEffect(() => {
    // Create the SharedWorker instance
    const worker = new SharedWorker("/tabManager.js");

    // Start communication with the worker
    worker.port.start();

    // Listen for messages from the worker
    worker.port.onmessage = (e: MessageEvent) => {
      console.log("Received from worker:", e.data);
      if (e.data.type === "TAB_STATUS" && !e.data.isFirstTab) {
        setError(ErrorType.OneTabError);
      }
    };

    // Handle any errors from the worker
    worker.port.addEventListener("error", (e) => {
      console.error("Worker error:", e);
    });

    // Clean up the worker when the component is unmounted
    return () => {
      worker.port.close();
    };
  }, [setError]);

  return null; // Nothing to render for this hook
};
