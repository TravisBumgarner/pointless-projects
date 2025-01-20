import { useEffect } from "react";
import useStore from "./store";

const Alert = () => {
  const alert = useStore((state) => state.alert);
  const setAlert = useStore((state) => state.setAlert);

  useEffect(() => {
    if (alert) {
      setTimeout(() => setAlert(null), 5000);
    }
  }, [alert, setAlert]);

  if (alert) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16, 
          padding: 16,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          color: "white",
          borderRadius: 8,
        }}
      >
        {alert}
      </div>
    );
  }

  return null;
};

export default Alert;
