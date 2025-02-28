import { useEffect, useRef } from "react";

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
  const turnstileRef = useTurnstile({ callback: setToken });

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
      }}
      ref={turnstileRef}
    />
  );
};

export default Turnstile;
