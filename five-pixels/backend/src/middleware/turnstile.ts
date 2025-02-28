import { NextFunction, Request, Response } from "express";
import { verifyTurnstileToken } from "../routes/auth";

const verifyTurnstileMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("verify", req.originalUrl);
  if (req.method !== "POST" || req.path !== "/paint") {
    return next();
  }

  console.log("verify", req.originalUrl);
  console.log("verify", req.body);
  const { token } = req.body;

  try {
    const isValid = await verifyTurnstileToken(token);
    if (!isValid) {
      return res.status(400).json({ error: "No thanks" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "No thanks" });
  }
};

export { verifyTurnstileMiddleware };
