import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { SSEMessage } from "../../../shared";


class Clients {
  private clients: Map<string, Response> = new Map();

  public addClient(client: Response) {
    const clientId = uuidv4();
    this.clients.set(clientId, client);
    return clientId;
  }

  public removeClient(clientId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.end();
      this.clients.delete(clientId);
    }
  }

  public messageAllExcept(senderIds: string[], message: SSEMessage) {
    this.clients.forEach((client, clientId) => {
      if (!senderIds.includes(clientId)) {
        client.write(`data: ${JSON.stringify(message)}\n\n`);
      }
    });
  }

  public messageAll(message: SSEMessage) {
    this.clients.forEach((client) =>
      client.write(`data: ${JSON.stringify(message)}\n\n`)
    );
  }

  public bulkMessage(clientIds: string[], message: SSEMessage) {
    clientIds.forEach((clientId) => this.messageOne(clientId, message));
  }

  public messageOne(clientId: string, message: SSEMessage) {
    const client = this.clients.get(clientId);
    if (client) {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    }
  }

  public hasConnection(clientId: string) {
    return this.clients.has(clientId);
  }

  public size() {
    return this.clients.size;
  }
}

export const clients = new Clients();
