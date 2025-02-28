import useTurnstile from "../hooks/useTurnstile";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

const Turnstile = ({ siteKey, onVerify }: TurnstileProps) => {
  const divRef = useTurnstile({ siteKey, onVerify });

  return <div ref={divRef} />;
};

export default Turnstile;
