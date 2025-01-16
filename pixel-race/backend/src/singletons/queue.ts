import { SSEMessageType } from '../../../shared';
import { clients } from './clients';

class Queue {
    private queue: Set<string> = new Set();
    private currentClientId: string | null = null;

    public add(clientId: string) {
        this.queue.add(clientId);
        this.processQueue();
    }

    public remove(clientId: string) {
        this.queue.delete(clientId);
        if (this.currentClientId === clientId) {
            this.currentClientId = null;
            this.processQueue();
        }
    }

    public size() {
        return this.queue.size;
    }

    private getNextClient(): string | null {
        for (const clientId of this.queue) {
            if (clientId !== this.currentClientId) {
                return clientId;
            }
        }
        return null;
    }

    public processQueue() {
        if (this.currentClientId) {
            return; // Someone is currently painting
        }

        const nextClientId = this.getNextClient();
        if (nextClientId) {
            this.currentClientId = nextClientId;
            // Notify the client they can paint
            clients.messageOne(nextClientId, { t: SSEMessageType.UserInfo, m: 'You can now paint.' });
            // Notify the next client in queue
            const iterator = this.queue.values();
            iterator.next(); // Skip the currentClientId
            const upcomingClient = iterator.next().value;
            if (upcomingClient) {
                clients.messageOne(upcomingClient, { t: SSEMessageType.UserInfo, m: 'You are next in the queue.' });
            }
        }
    }

    public releaseCurrentClient() {
        if (this.currentClientId) {
            this.currentClientId = null;
            this.processQueue();
        }
    }

    public getCurrentClientId(): string | null {
        return this.currentClientId;
    }
}

export const queue = new Queue();