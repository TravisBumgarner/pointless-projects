import { Request, Response } from 'express';

import { SSEMessageType } from '../../../../shared';
import { clients } from '../../singletons/clients';
import { queue as queueSingleton } from '../../singletons/queue';

const validateOrThrow = (clientId: string) => {
    let hasErrored = false
    
    if (!clientId) {
        console.error("Client ID is required to queue");
        hasErrored = true;
    }

    if (queueSingleton.size() >= 1_000) {
        console.error("Queue is full");
        hasErrored = true;
    }

    if (!clients.hasConnection(clientId)) {
        console.error("Connection not found");
        hasErrored = true;
    }

    if (hasErrored) {
        throw new Error("Invalid request");
    }
}

const queue = (req: Request, res: Response) => {
    try {
        const { clientId } = req.body;
        validateOrThrow(clientId);
        queueSingleton.add(clientId);
        clients.messageAll({ t: SSEMessageType.Queue, m: queueSingleton.size() });
        res.status(200).json({ message: "Joined queue" });
    } catch (error) {
        res.status(500).json({ message: "Failed to join queue" });
    }
}

export { queue };
