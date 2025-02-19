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

  const handleClose = (id: number) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            border: "2px solid var(--background-color)",
            textAlign: "center",
            color: "var(--background-color)",
            backgroundColor: "var(--primary-color)",
            padding: '4px 16px 4px 8px',
            borderRadius: 8,
            position: 'relative',
          }}
        >
          {alert.message}
          <span
            onClick={() => handleClose(alert.id)}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            &times;
          </span>
        </div>
      ))}
    </div>
  );
};

export default Alert;
