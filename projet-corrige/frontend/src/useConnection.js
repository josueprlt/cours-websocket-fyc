import { computed, onBeforeUnmount, ref } from 'vue';

export function useConnection() {
  const url = ref('ws://127.0.0.1:3000/chat');
  const readyState = ref(null); // null = aucune tentative ; hors états de WebSocket.
  const information = ref('Ouvrez une connexion avec le bouton Connecter.');
  const journal = ref([]);
  let socket = null;
  let removeListeners = () => {};

  const labels = ['Connexion en cours', 'Connecté', 'Fermeture en cours', 'Fermé'];
  const label = computed(() => readyState.value === null ? 'Non connecté' : labels[readyState.value]);
  const canConnect = computed(() => readyState.value === null || readyState.value === WebSocket.CLOSED);
  const canClose = computed(() => readyState.value === WebSocket.OPEN);

  function record(event, detail = '') {
    journal.value = [...journal.value.slice(-11), { event, detail, state: readyState.value }];
  }

  function connect() {
    // Fourni : empêche plusieurs connexions en cours/ouvertes/en fermeture.
    if (socket && socket.readyState !== WebSocket.CLOSED) return;
    removeListeners();
    information.value = '';
    let current;
    try {
      // TODO 1 — Créer le client natif à partir de url.value.
      current = new WebSocket(url.value);
    } catch {
      // Une URL syntaxiquement invalide peut échouer avant tout événement réseau.
      readyState.value = null;
      information.value = 'Adresse invalide : vérifiez le format de l’URL.';
      record('exception', 'Aucun objet WebSocket créé');
      return;
    }
    socket = current;
    // TODO 2 — Reporter immédiatement l’état initial du nouvel objet.
    readyState.value = current.readyState;
    record('construction');

    function onOpen() {
      if (socket !== current) return;
      // TODO 3 — Synchroniser l’état lors de open et renseigner le retour utilisateur.
      readyState.value = current.readyState;
      information.value = 'Connexion ouverte ; les messages seront traités en S3.';
      record('open');
    }
    function onError() {
      if (socket !== current) return;
      // TODO 4 — Afficher un diagnostic prudent, sans inventer un état ERROR.
      information.value = 'Connexion en erreur : vérifiez l’adresse, le serveur et l’onglet Réseau.';
      record('error', 'La cause précise n’est pas fournie par cet événement');
    }
    function onClose(event) {
      if (socket !== current) return;
      // TODO 5 — Synchroniser l’état final et enregistrer les informations de fermeture.
      readyState.value = current.readyState;
      information.value = event.wasClean
        ? 'Connexion fermée. Une nouvelle ouverture reste manuelle.'
        : 'Connexion interrompue ou ouverture échouée. Vérifiez le diagnostic.';
      record('close', `code=${event.code}; reason=${event.reason || '(vide)'}; wasClean=${event.wasClean}`);
    }

    // Câblage fourni : les exercices portent sur le contenu des gestionnaires.
    current.addEventListener('open', onOpen);
    current.addEventListener('error', onError);
    current.addEventListener('close', onClose);
    removeListeners = () => {
      current.removeEventListener('open', onOpen);
      current.removeEventListener('error', onError);
      current.removeEventListener('close', onClose);
    };
  }

  function disconnect() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    // TODO 6 — Demander une fermeture normale, puis reporter l’état courant.
    socket.close(1000, 'Fin de la séance');
    readyState.value = socket.readyState;
    information.value = 'Fermeture demandée ; attente de l’événement close.';
    record('close demandé');
  }

  // Fourni : libérer la connexion quand l’interface est démontée.
  onBeforeUnmount(() => {
    removeListeners();
    if (socket && socket.readyState < WebSocket.CLOSING) socket.close(1000, 'Interface quittée');
    socket = null;
  });

  return { url, readyState, information, journal, label, canConnect, canClose, connect, disconnect };
}
