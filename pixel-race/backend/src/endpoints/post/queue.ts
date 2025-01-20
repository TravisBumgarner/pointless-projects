import { Request, Response } from "express";

import {
  QueuePostRequest,
  QueuePostResponse,
  SSEMessageType,
} from "../../../../shared";
import { clients } from "../../singletons/clients";
import { queue as queueSingleton } from "../../singletons/queue";

const validateOrThrow = (clientId: string) => {
  let hasErrored = false;

  if (!clientId) {
    console.error("Client ID is required to queue");
    hasErrored = true;
  }

  if (queueSingleton.size() >= 1_000) {
    console.error("Queue is full");
    hasErrored = true;
  }

  if (!clients.hasConnection(clientId)) {
    console.error("Connection not found");
    hasErrored = true;
  }

  if (hasErrored) {
    throw new Error("Invalid request");
  }
};

const queue = (req: Request, res: Response) => {
  try {
    const { clientId } = req.body as QueuePostRequest;
    validateOrThrow(clientId);
    queueSingleton.add(clientId);
    const queueSize = queueSingleton.size();
    
    clients.messageAllExcept([clientId], {
      type: SSEMessageType.Queue,
      size: queueSize,
    });

    const response: QueuePostResponse = {
      p: queueSize,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ p: null });
  }
};

export { queue };
