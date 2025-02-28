import { PAINTING_TIME_MS } from "../../shared";
import Turnstile from "./components/Turnstile";
import useStore from "./store";

const WelcomeModal = () => {
  const showWelcomeModal = useStore((state) => state.showWelcomeModal);
  const setShowWelcomeModal = useStore((state) => state.setShowWelcomeModal);
  const token = useStore((state) => state.turnstileToken);
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
          maxWidth: "500px",
        }}
      >
        <h1>How To:</h1>
        <ol style={{ margin: "15px 0 15px 20px" }}>
          <li>Click "Queue".</li>
          <li>Wait Your Turn.</li>
          <li>Select Colors.</li>
          <li>Paint On Canvas.</li>
          <li>You have {Math.round(PAINTING_TIME_MS / 1000)} seconds!</li>
          <li>Click "Paint" to submit.</li>
        </ol>
        <Turnstile />
        <button
          style={{ marginTop: "15px" }}
          disabled={token === null}
          onClick={() => setShowWelcomeModal(false)}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
