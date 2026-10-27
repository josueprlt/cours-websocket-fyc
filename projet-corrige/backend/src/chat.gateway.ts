import { randomUUID } from 'node:crypto';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import WebSocket from 'ws';

@WebSocketGateway({ path: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // TODO 1 — Registre : socket → identifiant de connexion créé par le serveur.
  private readonly clients = new Map<WebSocket, string>();

  handleConnection(client: WebSocket) {
    // TODO 2 — Ajouter la connexion et un nouvel UUID au registre.
    this.clients.set(client, randomUUID());
    // Fourni pour l’interface : annoncer son identité à cette seule connexion.
    const senderId = this.clients.get(client);
    if (typeof senderId === 'string') {
      client.send(JSON.stringify({ event: 'chat:welcome', data: { senderId } }));
    }
    console.log(`[registre] ouverture : ${this.clients.size} connexion(s)`);
  }

  handleDisconnect(client: WebSocket) {
    // TODO 5 — Retirer cette connexion du registre.
    this.clients.delete(client);
    console.log(`[registre] fermeture : ${this.clients.size} connexion(s)`);
  }

  @SubscribeMessage('chat:send')
  handleMessage(@ConnectedSocket() sender: WebSocket, @MessageBody() data: unknown) {
    // Acquis de S3 : le serveur vérifie et normalise chaque demande.
    const content = typeof data === 'object' && data !== null && 'content' in data
      && typeof data.content === 'string' ? data.content.trim() : '';
    if (!content || content.length > 500) {
      // Le refus reste privé : WsAdapter l'envoie uniquement au demandeur.
      return { event: 'chat:error', data: { message: 'Contenu attendu : 1 à 500 unités UTF-16 après trim().' } };
    }
    const senderId = this.clients.get(sender);
    if (!senderId) return;
    // Le nom est une étiquette d’affichage, jamais une identité authentifiée.
    const senderName = typeof data === 'object' && data !== null && 'senderName' in data
      && typeof data.senderName === 'string' ? data.senderName.trim().slice(0, 32) || 'Vous' : 'Vous';
    const message = { id: randomUUID(), senderId, senderName, content, createdAt: new Date().toISOString() };
    // TODO 3 — Sérialiser une seule enveloppe, avant de parcourir les clients.
    const payload = JSON.stringify({ event: 'chat:message', data: message });
    // TODO 4 — Envoyer à chaque connexion OPEN, émetteur inclus.
    for (const client of this.clients.keys()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
    // Aucun retour de chat:message : la diffusion a déjà inclus l'émetteur.
  }
}
