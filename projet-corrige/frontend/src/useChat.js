import { ref } from 'vue';
import { useConnection } from './useConnection.js';
import { isChatMessage } from './protocol.js';

export function useChat() {
  const draft = ref('');
  const messages = ref([]);
  const notice = ref('Les réponses du serveur apparaîtront ici.');
  const connection = useConnection(receiveMessage);

  function sendMessage() {
    const socket = connection.getSocket();
    // TODO 1 — Refuser l’envoi si le socket n’est pas ouvert.
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
      // TODO 2 — Sérialiser l’enveloppe et l’envoyer.
      socket.send(JSON.stringify({ event: 'chat:send', data: { content } }));
      draft.value = '';
      notice.value = 'Envoi demandé ; attente de la réponse du serveur.';
    } catch {
      notice.value = 'Envoi impossible ; vérifiez la connexion.';
    }
  }

  function receiveMessage(event) {
    try {
      // TODO 5 — Décoder le texte JSON reçu.
      if (typeof event.data !== 'string') throw new Error('Texte attendu');
      const response = JSON.parse(event.data);
      // Fourni : réponse d’erreur métier du serveur.
      if (response?.event === 'chat:error' && typeof response.data?.message === 'string') {
        notice.value = response.data.message;
        return;
      }
      // TODO 6 — Vérifier la forme, puis ajouter la réponse à la liste.
      if (!isChatMessage(response)) throw new Error('Réponse hors contrat');
      messages.value.push(response.data);
      notice.value = 'Réponse reçue et affichée.';
    } catch {
      // TODO 7 — Signaler une réponse invalide sans modifier les messages.
      notice.value = 'Réponse invalide ignorée ; vous pouvez continuer.';
    }
  }

  return { ...connection, draft, messages, notice, sendMessage, receiveMessage };
}
