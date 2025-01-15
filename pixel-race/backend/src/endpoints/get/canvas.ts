import { Request, Response } from "express";
import { canvas as canvasSingleton } from "../../singletons/canvas";

export const canvas = (_req: Request, res: Response) => {
    res.json(canvasSingleton.getCanvas());
};
