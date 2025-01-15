import { Request, Response } from 'express';

import { queue as queueSingleton } from '../../singletons/queue';

const queue = (req: Request, res: Response) => {
    const { name } = req.body;
    queueSingleton.join(name);
    res.status(200).json({ message: "Joined queue" });
}

export { queue };
