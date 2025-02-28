import { Request, Response } from "express";
import { verifyTurnstileToken } from "../../routes/auth";

const verify = async (req: Request, res: Response) => {
  console.log("verify", req.body);
  const { token } = req.body;

  try {
    const isValid = await verifyTurnstileToken(token);
    console.log("isValid", isValid);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid CAPTCHA" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
};

export { verify };
