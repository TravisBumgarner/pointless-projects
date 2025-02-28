import { useEffect, useRef, useState } from "react";

const useTurnstile = ({
  setToken,
}: {
  setToken: (token: string | null) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const widgetId = window.turnstile.render(ref.current, {
      sitekey: "0x4AAAAAAA-7n5-_4jek6S7A",
      callback: setToken,
    });

    return () => {
      window.turnstile.remove(widgetId);
    };
  }, [setToken]);

  return ref;
};

const Turnstile = ({
  setToken,
}: {
  setToken: (token: string | null) => void;
}) => {
  const turnstileRef = useTurnstile({ setToken });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

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
