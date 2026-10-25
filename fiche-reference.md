# Fiche de référence — Messages texte et JSON

La connexion démarre automatiquement au montage de l’interface. Le chat est affiché par défaut ; l’onglet **Atelier** rassemble les contrôles de connexion, le journal et les simulations. Après un échec ou une fermeture, utilisez **Réessayer** dans le chat ou **Connecter** dans Atelier. La reprise automatique après coupure reste pour S5.

À garder à côté du TP. La connexion S2 est fournie.

| Étape | Dans ce projet | Piège à éviter |
|---|---|---|
| Soumission | `@submit.prevent="sendMessage"` | Recharger la page avec le formulaire |
| Disponibilité | `socket && socket.readyState === WebSocket.OPEN` | Se fier seulement au bouton ou à un ancien badge |
| Encodage | `JSON.stringify({ event: 'chat:send', data: { content } })` | Envoyer directement l’objet |
| Envoi | `socket.send(texte)` | Croire obtenir la réponse en valeur de retour |
| Serveur | `@MessageBody()` reçoit `data` décodé | Refaire `JSON.parse(data)` |
| Réponse | Retourner `{ event: 'chat:message', data: message }` | Diffuser aux autres clients |
| Réception | Callback natif `message`, propriété `event.data` | Confondre `event.data` et `response.data` |
| Décodage | `JSON.parse(event.data)` dans le `try` | Laisser une erreur de syntaxe sans diagnostic |
| Contrôle | `isChatMessage(response)` fourni | Prendre tout JSON valide pour un message |
| Affichage | `messages.value.push(response.data)` | Ajouter aussi une entrée à l’envoi |
| Erreur | Modifier `notice.value` dans le `catch` | Effacer les anciens messages ou fermer le canal |

## Deux sens du mot « événement »

```js
// Événement natif émis par WebSocket : câblage déjà fourni.
socket.addEventListener('message', receiveMessage);
// Nom applicatif à l’intérieur du JSON :
const response = { event: 'chat:message', data: { /* champs du contrat */ } };
```

`chat:error` arrive également dans `message` ; ce n’est pas l’événement réseau `error`.

## Patron de réception

```js
try {
  if (typeof event.data !== 'string') throw new Error('Texte attendu');
  const response = JSON.parse(event.data);
  // Garder ici le cas chat:error fourni dans le squelette.
  if (!isChatMessage(response)) throw new Error('Réponse hors contrat');
  messages.value.push(response.data);
} catch {
  notice.value = 'Réponse invalide ignorée ; vous pouvez continuer.';
}
```

Dans le script Vue, une `ref` utilise `.value` ; le template la déballe automatiquement. Le composant fourni échappe le texte avec l’interpolation, utilise `id` pour sa clé et convertit `createdAt` pour l’affichage local.

## Diagnostic rapide

- Rien ne sort : vérifier connexion, TODO 1–2 et le bon panneau `:3000/chat`.
- Sortie sans réponse : vérifier `chat:send`, `data.content`, TODO 3–4 et redémarrage du backend.
- Réponse visible dans Réseau mais liste vide : vérifier TODO 5–6 et les champs.
- Réponse en double : chercher un deuxième écouteur ou un ajout à l’envoi.
- Erreur après injection : vérifier le diagnostic et refaire un envoi réel.

Binaire : possible avec WebSocket, hors exercice ; ce contrat attend du texte JSON. Sources de l’API : [send()](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send) et [message](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/message_event).
