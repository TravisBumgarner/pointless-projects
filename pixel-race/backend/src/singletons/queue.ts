

class Queue {
    // Sets maintain insertion order in JS.
    private queue: Set<string> = new Set();

    public add(clientId: string) {
        this.queue.add(clientId);
    }

    public remove(clientId: string) {
        this.queue.delete(clientId);
    }

    public size() {
        return this.queue.size;
    }

    public getNext() {
        const next = this.queue.values().next();
        if (next.done) {
            return null;
        }
        this.queue.delete(next.value);
        return next.value;
    }
}

export const queue = new Queue();