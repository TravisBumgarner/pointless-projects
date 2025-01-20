import { Request, Response } from "express";
import { z } from "zod";
import { MAX_PAINT_POINTS } from "../../../../shared";
import { PointMap, SSEMessageType } from "../../../../shared/types";
import { canvas } from "../../singletons/canvas";
import { clients } from "../../singletons/clients";
import { queue } from "../../singletons/queue";

const ColorSchema = z.string().regex(/^[A-Za-z0-9]$/);
const PointSchema = z.record(z.string(), ColorSchema);
const ClientIdSchema = z.string().uuid();

const validateOrThrow = (body: unknown) => {
  const parsed = z.object({
    points: PointSchema,
    clientId: ClientIdSchema
  }).parse(body);

  if(Object.keys(parsed.points).length > MAX_PAINT_POINTS) {
    throw new Error(`Only ${MAX_PAINT_POINTS} can be plotted.`);
  }
  return parsed as { points: PointMap, clientId: string };
};

export const paint = (req: Request, res: Response) => {
  try {
    const {points, clientId} = validateOrThrow(req.body);
    
    if (queue.getCurrentClientId() !== clientId) {
      res.status(400).json({ error: "You are not the current painter." });
      return;
    }

    canvas.update(points);
    queue.releaseCurrentClient();
    clients.messageAll({type: SSEMessageType.Paint, points});
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid input format." });
  }
};

