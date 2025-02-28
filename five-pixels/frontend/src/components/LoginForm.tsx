import { useTurnstile } from "../hooks/useTurnstile";
import useStore from "../store";

export default function LoginForm() {
  const setError = useStore((state) => state.setError);
  const setPoints = useStore((state) => state.setPoints);
  const setQueue = useStore((state) => state.setQueue);

  const onVerify = async (token: string) => {
    const response = await init(token);
    if ("error" in response) {
      setError(response.error);
    } else {
      setPoints(response.canvas);
      setQueue(response.queue);
    }
  };

  return <div id="turnstile" ref={useTurnstile(onVerify)} />;
} 