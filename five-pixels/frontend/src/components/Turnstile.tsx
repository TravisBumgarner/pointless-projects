import { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

const Turnstile = ({ siteKey, onVerify }: TurnstileProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number>();

  useEffect(() => {
    if (!window.turnstile || !divRef.current) return;

    widgetId.current = window.turnstile.render(divRef.current, {
      sitekey: siteKey,
      callback: onVerify,
    });

    return () => {
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
      }
    };
  }, [siteKey, onVerify]);

  return <div ref={divRef} />;
};

export default Turnstile;
