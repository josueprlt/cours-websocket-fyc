import { WebSocketGateway } from '@nestjs/websockets';

// Fourni en S1 : point de connexion natif, sur le port HTTP 3000.
// S2 : le navigateur ouvrira cette connexion et affichera son état.
// S3 : les gestionnaires de messages seront ajoutés ici.
@WebSocketGateway({ path: '/chat' })
export class ChatGateway {}
