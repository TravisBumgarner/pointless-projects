import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SSEMessage } from '../../../shared';

class Clients {
    private clients: Map<string, Response> = new Map();

    public addClient(client: Response) {
        const id = uuidv4();
        this.clients.set(id, client);
        return id;
    }

    public removeClient(id: string) {
        this.clients.delete(id);
    }

    public messageAll(message: SSEMessage) {
        this.clients.forEach(client => client.write(`data: ${JSON.stringify(message)}\n\n`));
    }

    public size() {
        return this.clients.size;
    }
}

export const clients = new Clients();
