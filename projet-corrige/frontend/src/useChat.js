import { ref } from 'vue';
import { useConnection } from './useConnection.js';
import { isChatMessage } from './protocol.js';

export function useChat() {
  const draft = ref('');
  const username = ref('Vous');
  const ownSenderIds = new Set();
  const messages = ref([]);
  const notice = ref('Les messages du salon apparaîtront ici.');
  const connection = useConnection(receiveMessage);

  function sendMessage() {
    const socket = connection.getSocket();

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      notice.value = 'Ouvrez la connexion avant d’envoyer.';
      return;
    }
    // Fourni : confort de saisie ; le serveur contrôle aussi le contenu.
    const content = draft.value.trim();
    if (!content || content.length > 500) {
      notice.value = 'Saisissez entre 1 et 500 unités UTF-16 après trim().';
      return;
    }
    try {
      socket.send(JSON.stringify({ event: 'chat:send', data: { content, senderName: username.value.trim().slice(0, 32) || 'Vous' } }));
      draft.value = '';
      notice.value = 'Envoi demandé ; attente de la réponse du serveur.';
    } catch {
      notice.value = 'Envoi impossible ; vérifiez la connexion.';
    }
  }

  function receiveMessage(event) {
    try {
      if (typeof event.data !== 'string') throw new Error('Texte attendu');
      const response = JSON.parse(event.data);
      if (response?.event === 'chat:welcome' && typeof response.data?.senderId === 'string') {
        ownSenderIds.add(response.data.senderId);
        return;
      }
      // Fourni : réponse d’erreur métier du serveur.
      if (response?.event === 'chat:error' && typeof response.data?.message === 'string') {
        notice.value = response.data.message;
        return;
      }

      if (!isChatMessage(response)) throw new Error('Réponse hors contrat');
      messages.value.push({ ...response.data, isOwn: ownSenderIds.has(response.data.senderId) });
      notice.value = 'Réponse reçue et affichée.';
    } catch {
      notice.value = 'Réponse invalide ignorée ; vous pouvez continuer.';
    }
  }

  return { ...connection, draft, username, messages, notice, sendMessage, receiveMessage };
}
