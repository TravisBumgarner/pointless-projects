import { useEffect, useRef, useState } from "react";
import useStore from "./store";

const Alert = () => {
  const alerts = useStore((state) => state.alerts);
  const getAndRemoveNextAlert = useStore((state) => state.getAndRemoveNextAlert);
  const [visibleAlerts, setVisibleAlerts] = useState<{id: number; message: string}[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    if (alerts.length > 0) {
      const nextAlert = getAndRemoveNextAlert();
      if (nextAlert) {
        const newAlert = {
          id: nextIdRef.current++,
          message: nextAlert
        };
        setVisibleAlerts(prev => [...prev, newAlert]);
        
        setTimeout(() => {
          setVisibleAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, 5_000);
      }
    }
  }, [alerts, getAndRemoveNextAlert]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', zIndex: 998 }}>
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            border: "2px solid var(--background-color)",
            textAlign: "center",
            color: "var(--background-color)",
            backgroundColor: "var(--primary-color)",
            padding: 16,
            borderRadius: 8,
            width: '200px',
            marginBottom: 8,
          }}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Alert;
