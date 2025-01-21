import useStore from "./store";

const ConnectionError = () => {
  const connectionError = useStore((state) => state.connectionError);
  const handleRefresh = () => {
    window.location.reload();
  };

  if (!connectionError) return null;
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
      <p> Connection to server lost, refresh page.</p>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default ConnectionError;
