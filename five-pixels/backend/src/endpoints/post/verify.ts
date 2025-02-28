import { Request, Response } from "express";
import { verifyTurnstileToken } from "../../routes/auth";

const verify = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const isValid = await verifyTurnstileToken(token);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid CAPTCHA" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
};

export { verify };
