import { PAINTING_TIME, SSEMessageType } from '../../../shared';
import { clients } from './clients';

class Queue {
    private clientIds: Set<string> = new Set();
    private queue: string[] = [];
    private currentClientId: string | null = null;
    private currentClientTimer: NodeJS.Timeout | null = null;

    private startPaintingTimer() {
        if (this.currentClientTimer) {
            clearTimeout(this.currentClientTimer);
        }
        
        this.currentClientTimer = setTimeout(() => {
            if (this.currentClientId) {
                clients.messageOne(this.currentClientId, { 
                    type: SSEMessageType.UserInfo, 
                    message: 'Your painting time has expired.' 
                });
                this.releaseCurrentClient();
            }
        }, PAINTING_TIME); 
    }

    private clearPaintingTimer() {
        if (this.currentClientTimer) {
            clearTimeout(this.currentClientTimer);
            this.currentClientTimer = null;
        }
    }
    
    public add(clientId: string) {
        if (this.clientIds.has(clientId)) {
            return;
        } else {
            this.clientIds.add(clientId);
            this.queue.push(clientId);
        }
        this.processQueue();
    }

    public remove(clientId: string) {
        this.clientIds.delete(clientId);
        this.queue = this.queue.filter(id => id !== clientId);
        if (this.currentClientId === clientId) {
            this.clearPaintingTimer();
            this.currentClientId = null;
            this.processQueue();
        }
    }

    public size() {
        return this.clientIds.size;
    }

    private getNextClient(): string | null {
        const nextClient = this.queue.shift();
        if (nextClient) {
            this.clientIds.delete(nextClient);
        }
        return nextClient || null;
    }

    public getClientIdsBeforeAndAfter(clientId: string): { before: string[], after: string[] } {
        const index = this.queue.indexOf(clientId);
        const before = this.queue.slice(0, index);
        const after = this.queue.slice(index + 1);
        return { before, after };
    }

    private peakNextClient(): string | null {
        return this.queue[0] || null;
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
            // Start the painting timer
            this.startPaintingTimer();
            // Notify the client they can paint
            clients.messageOne(currentClientId, { 
                type: SSEMessageType.YourTurn, 
            });
            // Notify the next client in queue
            const upcomingClient = this.peakNextClient();
            if (upcomingClient) {
                clients.messageOne(upcomingClient, { 
                    type: SSEMessageType.UserInfo, 
                    message: 'You are next in the queue.' 
                });
            }
            clients.messageAll({
                type: SSEMessageType.Queue,
                size: this.size(),
                shouldAdvanceInQueue: true
            });
            
        }
    }
    
    // Update the queue when the current client is done painting or the time limit for painting is reached.
    public releaseCurrentClient() {
        if (this.currentClientId) {
            this.clearPaintingTimer();
            this.currentClientId = null;
            this.processQueue();
        }
    }

    public getCurrentClientId(): string | null {
        return this.currentClientId;
    }
}

export const queue = new Queue();