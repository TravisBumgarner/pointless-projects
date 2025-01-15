class Queue {
    private queue: string[] = [];

    public join(name: string) {
        this.queue.push(name);
    }

    public leave(name: string) {
        this.queue = this.queue.filter(q => q !== name);
    }

    public size() {
        return this.queue.length;
    }

    public getNext() {
        return this.queue.shift();
    }
}

export const queue = new Queue();