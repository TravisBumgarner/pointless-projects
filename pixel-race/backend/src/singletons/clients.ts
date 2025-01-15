class Clients {
    private clients: any[] = [];
    private static instance: Clients;
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

    public static getInstance(): Clients {
        if (!Clients.instance) {
            Clients.instance = new Clients();
        }
        return Clients.instance;
    }
}

export default Clients;