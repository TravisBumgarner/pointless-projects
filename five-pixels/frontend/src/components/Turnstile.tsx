import { useEffect, useRef, useState } from "react";

const useTurnstile = ({
  callback,
}: {
  callback: (token: string | null) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // There appears to be a race condition where the turnstile script is not
      // available immediately, so we need to check if it's available before
      // rendering the widget.
      if (ref.current && window.turnstile) {
        const widgetId = window.turnstile.render(ref.current, {
          sitekey: "0x4AAAAAAA-7n5-_4jek6S7A",
          callback,
        });
        clearInterval(intervalId); // Stop checking once it's available

        return () => {
          window.turnstile.remove(widgetId);
        };
      } else {
        console.log("Turnstile unavailable, trying again...");
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [callback]);

  return ref;
};

const Turnstile = ({
  setToken,
}: {
  setToken: (token: string | null) => void;
}) => {
  const [visible, setVisible] = useState(true);

  const triggerHide = () => {
    setTimeout(() => {
      setVisible(false);
    }, 1000);
  };

  const callback = (token: string | null) => {
    setToken(token);
    triggerHide();
  };

  const turnstileRef = useTurnstile({ callback });

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
      }}
      ref={turnstileRef}
    />
  );
};

export default Turnstile;
