import { useState } from "react";

const WelcomeModal = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

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

        <button onClick={closeWelcomeModal}>Let's Go!</button>
      </div>
    </div>
  );
};

export default WelcomeModal;
