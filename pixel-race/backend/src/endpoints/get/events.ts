import { Request, Response } from "express";
import { SSEMessageType } from "../../../../shared";
import { clients } from "../../singletons/clients";
import { queue } from "../../singletons/queue";

export const events = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  const clientId = clients.addClient(res);

  req.on("close", () => {
    clients.removeClient(clientId);
    queue.remove(clientId);
    clients.messageAll({ t: SSEMessageType.Queue, m: queue.size() });
  });

  clients.messageOne(clientId, { t: SSEMessageType.Auth, m: clientId });
};
