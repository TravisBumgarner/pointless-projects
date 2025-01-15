import { Request, Response } from 'express';
import { clients } from './singletons/clients';
let canvasData: Record<string, string> = {};

export const paint = (req: Request, res: Response) => {
    const encodedPoints = req.body as Record<string, string>;
    Object.entries(encodedPoints).forEach(([index, color]) => {
        canvasData[index] = color;
    });

    clients.messageAll(encodedPoints);
    res.json({ success: true });
}


