import { Request, Response } from "express";
import { clients } from "../../singletons/clients";

export const events = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  clients.addClient({ id: Date.now(), res });

  req.on("close", () => {
    clients.removeClient(res);
  });

  res.write('data: {"status": "connected"}\n\n');
};
