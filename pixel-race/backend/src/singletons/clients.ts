class Clients {
    private clients: any[] = [];
    // Todo - this should not be an array.

    public addClient(client: any) {
        this.clients.push(client);
    }

    public removeClient(client: any) {
        this.clients = this.clients.filter(c => c !== client);
    }

    public messageAll(message: any) {
        this.clients.forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));
    }
}

export const clients = new Clients();