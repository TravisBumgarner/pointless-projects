import { PAINTING_TIME, SSEMessageType } from '../../../shared';
import { clients } from './clients';

class Queue {
    private keys: Set<string> = new Set();
    private queueItems: string[] = [];
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
            this.clearPaintingTimer();
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
                size: this.size()
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