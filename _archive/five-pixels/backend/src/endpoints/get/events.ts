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
    const { before, after } = queue.getClientIdsBeforeAndAfter(clientId);
    clients.removeClient(clientId);
    queue.remove(clientId);
    clients.bulkMessage(before, {
      type: SSEMessageType.Queue,
      size: queue.size(),
      shouldAdvanceInQueue: false,
    });
    clients.bulkMessage(after, {
      type: SSEMessageType.Queue,
      size: queue.size(),
      shouldAdvanceInQueue: true,
    });
  });

  clients.messageOne(clientId, { type: SSEMessageType.Auth, clientId });
};
