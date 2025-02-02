import { useMemo } from "react";
import { ErrorType } from "../../shared";
import useStore from "./store";

const ErrorHandler = () => {
  const error = useStore((state) => state.error);
  const handleRefresh = () => {
    window.location.reload();
  };

  const message = useMemo(() => {
    switch (error) {
      case ErrorType.ConnectionError:
        return <p>Connection to server lost, refresh page.</p>;
      case ErrorType.RateLimitError:
        return <p>Rate limit exceeded, please try again later.</p>;
      case ErrorType.UnknownError:
        return <p>An unknown error occurred, please try again later.</p>;
    }
  }, [error]);

  const action = useMemo(() => {
    switch (error) {
      case ErrorType.ConnectionError:
        return <button onClick={handleRefresh}>Refresh</button>;
    }
  }, [error]);

  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "500px" }}>
        <p>{message}</p>
       {action}
      </div>
    </div>
  );
};

export default ErrorHandler;
