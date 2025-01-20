import { SSEMessageType } from '../../../shared';
import { clients } from './clients';

class Queue {
    private keys: Set<string> = new Set();
    private queueItems: string[] = [];
    private currentClientId: string | null = null;

    public add(clientId: string) {
        if (this.keys.has(clientId)) {
            return;
        } else {
            this.keys.add(clientId);
            this.queueItems.push(clientId);
        }
        this.processQueue();
    }

    public remove(clientId: string) {
        this.keys.delete(clientId);
        this.queueItems = this.queueItems.filter(id => id !== clientId);
        if (this.currentClientId === clientId) {
            this.currentClientId = null;
            this.processQueue();
        }
    }

    public size() {
        return this.keys.size;
    }

    private getNextClient(): string | null {
        const nextClient = this.queueItems.shift();
        if (nextClient) {
            this.keys.delete(nextClient);
        }
        return nextClient || null;
    }

    private peakNextClient(): string | null {
        return this.queueItems[0] || null;
    }
    
    // Process the queue when a client is added or removed.
    // Called when a client is released from painting or the time limit for painting is reached.
    public processQueue() {
        if (this.currentClientId) {
            return; // Someone is currently painting
        }

        const currentClientId = this.getNextClient();
        if (currentClientId) {
            this.currentClientId = currentClientId;
            // Notify the client they can paint
            clients.messageOne(currentClientId, { t: SSEMessageType.UserInfo, m: 'You can now paint.' });
            // Notify the next client in queue
            const upcomingClient = this.peakNextClient();
            if (upcomingClient) {
                clients.messageOne(upcomingClient, { t: SSEMessageType.UserInfo, m: 'You are next in the queue.' });
            }
        }
    }
    
    // Update the queue when the current client is done painting or the time limit for painting is reached.
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