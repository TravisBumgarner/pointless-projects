import { Request, Response } from "express";
import { canvas as canvasSingleton } from "../../singletons/canvas";
import { queue as queueSingleton } from "../../singletons/queue";


export const init = (_req: Request, res: Response) => {
    const canvas = canvasSingleton.getCanvas();
    const queue = queueSingleton.size();
    res.json({ canvas, queue });
};
