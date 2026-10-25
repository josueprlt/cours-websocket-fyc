# Séquence 3 — Projet apprenant

La connexion démarre automatiquement au montage de l’interface. Le chat est affiché par défaut ; l’onglet **Atelier** rassemble les contrôles de connexion, le journal et les simulations. Après un échec ou une fermeture, utilisez **Réessayer** dans le chat ou **Connecter** dans Atelier. La reprise automatique après coupure reste pour S5.

Prérequis : Node 24.x. Depuis ce dossier, lancer `npm ci`, puis `npm run dev:back` et `npm run dev:front` dans deux terminaux.

- Interface : http://127.0.0.1:5173
- Diagnostic HTTP : http://127.0.0.1:3000/health
- Connexion WebSocket : ws://127.0.0.1:3000/chat

Le cycle de vie S2 est fourni. `useConnection.js` reçoit un callback de réception et expose le socket courant via `getSocket()`. Le formulaire et `MessageList.vue` sont prêts ; les réponses invalides de `responseFixtures.js` peuvent être injectées localement avec les boutons Atelier.

Compléter sept TODO : 1–2 et 5–7 dans `frontend/src/useChat.js`, 3–4 dans `backend/src/chat.gateway.ts`. Le squelette compile ; avant les TODO, il se connecte mais n’envoie pas de chat. Les autres fichiers sont fournis.

Suivre le [TP](../tp-guide.md), le [cours](../cours.md) et la [recette](../tests-et-validation.md). Le contrat utilise `{ event, data }` ; le serveur répond uniquement à l’émetteur. La liste reste en mémoire dans cet onglet.

`npm run build` compile les deux workspaces. Après modification du backend, arrêter puis relancer `npm run dev:back` et reconnecter le navigateur. Les deux projets partagent les ports : ne pas les lancer simultanément. Arrêter les services avec Ctrl+C.
