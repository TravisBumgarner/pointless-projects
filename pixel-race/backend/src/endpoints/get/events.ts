import { Request, Response } from "express";
import { clients } from "../../singletons/clients";

export const events = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  const clientId = clients.addClient(res);

  req.on("close", () => {
    clients.removeClient(clientId);
  });

  res.write(JSON.stringify({ t: "auth", m: clientId }));
};
