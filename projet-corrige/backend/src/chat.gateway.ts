import { randomUUID } from 'node:crypto';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ path: '/chat' })
export class ChatGateway {
  @SubscribeMessage('chat:send')
  handleMessage(@MessageBody() data: unknown) {
    // Fourni : toute entrée réseau doit être vérifiée, même avec un formulaire.
    const content = typeof data === 'object' && data !== null && 'content' in data
      && typeof data.content === 'string' ? data.content.trim() : '';
    if (!content || content.length > 500) {
      return { event: 'chat:error', data: { message: 'Contenu attendu : 1 à 500 unités UTF-16 après trim().' } };
    }
    // TODO 3 — Construire le message enrichi par le serveur.
    const message = { id: randomUUID(), content, createdAt: new Date().toISOString() };
    // TODO 4 — Retourner l’enveloppe uniquement à l’émetteur.
    return { event: 'chat:message', data: message };
  }
}
