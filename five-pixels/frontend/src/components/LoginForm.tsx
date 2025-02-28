import Turnstile from "./Turnstile";

const LoginForm = () => {
  const handleVerify = async (token: string) => {
    // Send token to your backend for verification
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );

    if (response.ok) {
      // Continue with form submission
    }
  };

  return (
    <form>
      <Turnstile siteKey="0x4AAAAAAA-7n5-_4jek6S7A" onVerify={handleVerify} />
    </form>
  );
};

export default LoginForm;
