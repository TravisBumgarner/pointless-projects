import { Request, Response } from "express";
import { z } from "zod";
import Canvas from "../../singletons/canvas";
import Clients from "../../singletons/clients";

const canvas = Canvas.getInstance();
const clients = Clients.getInstance();

const EncodedPointSchema = z.string().regex(/^\d+_[A-Za-z0-9]$/);
const EncodedPointArraySchema = z.array(EncodedPointSchema).min(1).max(5);

const validateOrThrow = (body: unknown): string[] => {
  const parsed = EncodedPointArraySchema.parse(body);
  return parsed;
};

const decodePoints = (encodedPoints: string[]): [number, string][] => {
  return encodedPoints.map((encodedPoint) => {
    const [index, colorKey] = encodedPoint.split("_");
    return [parseInt(index), colorKey];
  });
};

export const paint = (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const encodedPoints = validateOrThrow(req.body);
    const points = decodePoints(encodedPoints);

    canvas.update(points); // Ensure the update method accepts string[]

    clients.messageAll(points);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Invalid input format." });
  }
};
