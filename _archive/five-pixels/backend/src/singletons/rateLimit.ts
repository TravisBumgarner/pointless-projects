import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import log from "./log";
const requestCounts: Record<string, number> = {};

// Middleware to count requests
const requestCounter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip as string;
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;
  console.log(`Request count for ${ip}: ${requestCounts[ip]}`);
  next();
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: (req, res) => {
    log.write(
      `Rate limit exceeded for ${req.ip}. Total requests: ${
        requestCounts[req.ip]
      }`
    );
    res.status(429).send("Too many requests, please try again later.");
  },
});

export { limiter, requestCounter };
