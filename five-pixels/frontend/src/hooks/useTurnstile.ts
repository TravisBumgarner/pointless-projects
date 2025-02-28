import { useEffect, useRef } from "react";

interface UseTurnstileProps {
  onVerify: (token: string) => void;
}
const SITE_KEY = "0x4AAAAAAA-7n5-_4jek6S7A";

const useTurnstile = ({ onVerify }: UseTurnstileProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number>();

  useEffect(() => {
    const renderWidget = () => {
      if (!window.turnstile || !divRef.current) return;
      
      // Cleanup existing widget first
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
      }

      widgetId.current = window.turnstile.render(divRef.current, {
        sitekey: SITE_KEY,
        callback: onVerify,
        "refresh-expired": "auto"
      });
    };

    renderWidget();

    return () => {
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
      }
    };
  }, [onVerify]);

  return divRef;
};

export default useTurnstile;
