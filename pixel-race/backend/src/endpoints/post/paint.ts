import { Request, Response } from "express";
import { z } from "zod";
import { PointEncoded, SSEMessageType } from "../../../../shared/types";
import { canvas } from "../../singletons/canvas";
import { clients } from "../../singletons/clients";
import { queue } from "../../singletons/queue";

const EncodedPointSchema = z.string().regex(/^\d+_[A-Za-z0-9]$/);
const EncodedPointArraySchema = z.array(EncodedPointSchema).min(1).max(5);

const validateOrThrow = (body: unknown) => {
  const parsed = EncodedPointArraySchema.parse(body);
  return parsed as PointEncoded[];
};

const decodePoints = (encodedPoints: string[]): [number, string][] => {
  return encodedPoints.map((encodedPoint) => {
    const [index, colorKey] = encodedPoint.split("_");
    return [parseInt(index), colorKey];
  });
};

export const paint = (req: Request, res: Response) => {

  try {
    const encodedPoints = validateOrThrow(req.body);

    const points = decodePoints(encodedPoints);

    canvas.update(points);

    clients.messageAll({t: SSEMessageType.Paint, p: encodedPoints, q: queue.size()});
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid input format." });
  }
};

