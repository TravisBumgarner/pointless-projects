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
        <ol>
          <li>Join Queue.</li>
          <li>Wait your turn.</li>
          <li>Select color(s) and draw on canvas.<br/>You have 30 seconds!</li>
          <li>Click "Paint" to submit.</li>
        </ol>

        <button onClick={() => setShowWelcomeModal(false)}>Let's Go!</button>
      </div>
    </div>
  );
};

export default WelcomeModal;
