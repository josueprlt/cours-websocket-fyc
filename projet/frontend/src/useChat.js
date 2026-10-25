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
    if (false) { // Remplacer false par la condition de refus.
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
      notice.value = 'TODO 2 : sérialiser et envoyer, puis vider le brouillon.';
    } catch {
      notice.value = 'Envoi impossible ; vérifiez la connexion.';
    }
  }

  function receiveMessage(event) {
    try {
      // TODO 5 — Décoder le texte JSON reçu.
      const response = undefined; // Remplacer par le décodage protégé.
      // Fourni : réponse d’erreur métier du serveur.
      if (response?.event === 'chat:error' && typeof response.data?.message === 'string') {
        notice.value = response.data.message;
        return;
      }
      // TODO 6 — Vérifier la forme, puis ajouter la réponse à la liste.
      notice.value = 'TODO 6 : contrôler et afficher la réponse.';
    } catch {
      // TODO 7 — Signaler une réponse invalide sans modifier les messages.
      // Afficher un diagnostic ; ne pas ajouter de message.
    }
  }

  return { ...connection, draft, messages, notice, sendMessage, receiveMessage };
}
