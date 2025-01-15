import { Request, Response } from "express";
import Canvas from "../../singletons/canvas";

export const canvas = (_req: Request, res: Response) => {
    res.json(Canvas.getInstance().getCanvas());
};
