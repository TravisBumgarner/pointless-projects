import cors from "cors";
import express, { Request, Response } from "express";

import endpoints from "./endpoints";
import { verifyTurnstileMiddleware } from "./middleware/turnstile";
import log from "./singletons/log";
import { limiter, requestCounter } from "./singletons/rateLimit";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/ok", (_req: Request, res: Response) => {
  res.send("OK");
});
app.get("/events", endpoints.get.events);
app.get("/init", endpoints.get.init);

// Rate limiting below.
app.use(limiter);
app.use(requestCounter);
app.use(verifyTurnstileMiddleware);
app.post("/paint", endpoints.post.paint);
app.post("/queue", endpoints.post.queue);

// Only start the server if we're not testing
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    log.write(`SSE server running at http://localhost:${port}`);
  });
}

export { app };
