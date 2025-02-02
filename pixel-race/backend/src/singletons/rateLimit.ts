import rateLimit from "express-rate-limit";
import log from "./log";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    handler: (req, res) => {
        log.write(`Rate limit exceeded for ${req.ip}`);
        res.status(429).send("Too many requests, please try again later.");
    }
})

export default limiter;