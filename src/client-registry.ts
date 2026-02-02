import type { Client } from './client.js';

export class ClientRegistry {
  private clientMap: Map<string, Client> = new Map();
  constructor() {}

  public registerClient(client: Client) {
    this.clientMap.set(client.getClientId(), client);
  }
  public unregisterClient(clientId: string) {
    this.clientMap.delete(clientId);
  }
}
