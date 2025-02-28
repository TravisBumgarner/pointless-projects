import { useCallback, useEffect, useRef } from "react";

interface TurnstileProps {
  onVerify: (token: string) => void;
}

const useTurnstile = ({ onVerify }: { onVerify: (token: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const widgetId = window.turnstile.render(ref.current, {
      sitekey: "0x4AAAAAAA-7n5-_4jek6S7A",
      callback: onVerify,
    });

    return () => {
      window.turnstile.remove(widgetId);
    };
  }, [onVerify]);

  return ref;
};

const Turnstile = ({ onVerify }: TurnstileProps) => {
  const handleVerify = useCallback(
    (token: string) => {
      onVerify(token);
    },
    [onVerify]
  );

  const turnstileRef = useTurnstile({
    onVerify: handleVerify,
  });

  return (
    <div
      ref={turnstileRef}
      style={{ position: "fixed", top: "10px", left: "10px" }}
    />
  );
};

export default Turnstile;
