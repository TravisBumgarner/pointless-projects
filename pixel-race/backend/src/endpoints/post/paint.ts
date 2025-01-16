import { Request, Response } from "express";
import { z } from "zod";
import { PointEncoded, SSEMessageType } from "../../../../shared/types";
import { canvas } from "../../singletons/canvas";
import { clients } from "../../singletons/clients";
import { queue } from "../../singletons/queue";

const EncodedPointSchema = z.string().regex(/^\d+_[A-Za-z0-9]$/);
const EncodedPointArraySchema = z.array(EncodedPointSchema).min(1).max(5);
const ClientIdSchema = z.string().uuid();

const validateOrThrow = (body: unknown) => {
  const parsed = z.object({
    points: EncodedPointArraySchema,
    clientId: ClientIdSchema
  }).parse(body);
  return parsed as { points: PointEncoded[], clientId: string };
};

export const paint = (req: Request, res: Response) => {
  try {
    const {points, clientId} = validateOrThrow(req.body);
    
    if (queue.getCurrentClientId() !== clientId) {
      res.status(400).json({ error: "You are not the current painter." });
      return;
    }

    canvas.update(points);
    clients.messageAll({t: SSEMessageType.Paint, p: points, q: queue.size()});
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid input format." });
  }
};

