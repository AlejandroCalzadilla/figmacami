import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class MessageWsService {
  private connectedClients: Map<string, Socket> = new Map();

  registerClient(client: Socket) {
    this.connectedClients.set(client.id, client);
  }

  removeClient(clientId: string) {
    this.connectedClients.delete(clientId);
  }

  getConectedClients(): string[] {
    return Array.from(this.connectedClients.keys());
  }

  getClientById(clientId: string): Socket | undefined {
    return this.connectedClients.get(clientId);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  // Método para verificar si un cliente está en una sala específica
  isClientInRoom(clientId: string, roomId: string): boolean {
    const client = this.getClientById(clientId);
    return client ? client.rooms.has(roomId) : false;
  }
} 