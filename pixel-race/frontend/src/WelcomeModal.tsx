import useStore from "./store";

const WelcomeModal = () => {
  const showWelcomeModal = useStore((state) => state.showWelcomeModal);
  const setShowWelcomeModal = useStore((state) => state.setShowWelcomeModal);

  if (!showWelcomeModal) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
            maxWidth: '500px'
        }}
      >
        <h1>Welcome!</h1>
        <p>Queue up, wait your turn, draw some pixels, and paint together!</p>
        <p>Instructions:</p>
        <ul>
          <li>Join Queue</li>
          <li>Wait your turn</li>
          <li>Select color and draw on canvas</li>
          <li>Click "Paint" to submit</li>
        </ul>

        <button onClick={() => setShowWelcomeModal(false)}>Let's Go!</button>
      </div>
    </div>
  );
};

export default WelcomeModal;
