import { Request, Response } from 'express';
import Canvas from '../../singletons/canvas';
import Clients from '../../singletons/clients';

const canvas = Canvas.getInstance();
const clients = Clients.getInstance();

export const paint = (req: Request, res: Response) => {
    const encodedPoints = req.body as Record<string, string>; 
    // Todo - Validate this data.  
    canvas.update(encodedPoints)

    clients.messageAll(encodedPoints);
    res.json({ success: true });
}