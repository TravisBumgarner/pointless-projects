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
        }, 5000);
      }
    }
  }, [alerts, getAndRemoveNextAlert]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 998 }}>
      {visibleAlerts.map((alert, index) => (
        <div
          key={alert.id}
          style={{
            borderColor: "var(--border-color)",
            textAlign: "center",
            color: "var(--border-color)",
            backgroundColor: "var(--neutral-dark-color)",
            padding: 16,
            borderRadius: 8,
            width: '200px',
            marginTop: index > 0 ? 8 : 0,
          }}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Alert;
