import { useEffect, useRef } from "react";
import useStore from "../store";

const useTurnstile = () => {
  const setTurnstileToken = useStore((state) => state.setTurnstileToken);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const widgetId = window.turnstile.render(ref.current, {
      sitekey: "0x4AAAAAAA-7n5-_4jek6S7A",
      callback: setTurnstileToken,
    });

    return () => {
      window.turnstile.remove(widgetId);
    };
  }, [setTurnstileToken]);

  return ref;
};

const Turnstile = () => {
  const turnstileRef = useTurnstile();

  return <div ref={turnstileRef} />;
};

export default Turnstile;
