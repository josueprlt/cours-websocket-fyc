# TP guidé — Du chat individuel au salon partagé

Travaillez dans `projet`. L’envoi, la réception et les garde-fous S3 sont fournis ; le frontend est déjà adapté à `senderId`. Vous complétez cinq TODO backend, puis réalisez un sixième exercice de diagnostic côté navigateur. Le point de départ compile mais ne diffuse pas encore.

## A — Enregistrer les clients connectés · 20 min

### Préparer et repérer · 6 min

Prérequis : Node 24.x et npm. Arrêtez les anciens services sur 3000 et 5173. Depuis `projet`, exécutez :

```sh
npm ci
npm run dev:back
```

Dans un second terminal, depuis le même dossier :

```sh
npm run dev:front
```

Ouvrez trois fenêtres A, B, C à `http://127.0.0.1:5173`. Chacune doit afficher Connecté ; elles se connectent automatiquement. Dans Atelier, vous trouvez les boutons de connexion et le journal. Le panneau Réseau → WebSocket doit viser `:3000/chat`, pas le canal Vite.

Repérez `backend/src/chat.gateway.ts` : les hooks, le gestionnaire `chat:send` et le contrôle de contenu. `@ConnectedSocket()` fournit `sender`. Le registre existe déjà sous une forme provisoire pour que le squelette compile.

Si vous reprenez votre propre S3, sauvegardez-le puis utilisez le squelette S4 : le contrat frontend inclut maintenant `senderId` et le backend utilise les types de `ws`. Ne copiez pas seulement le gateway sans actualiser les dépendances et le client.

### TODO 1 — Typer le registre · 4 min

Remplacez les deux `unknown` de la `Map` : clé = objet `WebSocket` importé de `ws` ; valeur = chaîne. Gardez la propriété sur la classe, sans la recréer dans les hooks ni dans le gestionnaire.

### TODO 2 — Associer un identifiant serveur · 6 min

Dans `handleConnection`, ajoutez `client` au registre avec un identifiant issu de `randomUUID()`. L’import est fourni. Utilisez `set`. Chaque nouvelle connexion doit obtenir son identifiant ; les messages ultérieurs retrouvent celui-ci avec `get(sender)`.

### Observer · 4 min

Le backend n’a pas de surveillance automatique : arrêtez-le et relancez `npm run dev:back` après vos modifications. Reconnectez A, B et C avec Réessayer ou Atelier → Connecter. Le terminal doit indiquer successivement 1, 2, 3 connexions. N’envoyez pas encore de message pour valider cette étape : la diffusion est le prochain exercice. Le nettoyage n’est pas encore implémenté ; redémarrez pour repartir d’un registre vide si nécessaire.

## B — Diffuser les messages · 25 min

### Capsule de live coding · 5 min

Regardez la [capsule 2](videos.md#capsule-2--écrire-la-boucle-de-diffusion--5-min) ou lisez sa transcription. Repérez ce qui reste avant la boucle : contenu contrôlé, auteur, id du message, date et sérialisation.

### TODO 3 — Préparer une enveloppe commune · 6 min

Le message enrichi, y compris le nom d’affichage `senderName`, est fourni. L’accueil privé `chat:welcome` est également fourni après l’inscription au registre ; il permet à l’interface de reconnaître vos messages sans ajouter de bulle. Créez `payload`, une chaîne obtenue par `JSON.stringify` de `{ event: 'chat:message', data: message }`. Faites-le avant la boucle. Tous les clients doivent recevoir le même identifiant de message et le même horodatage.

### TODO 4 — Choisir les destinataires et transmettre · 9 min

Parcourez `this.clients.keys()`. Pour chaque `client`, vérifiez `client.readyState === WebSocket.OPEN`, puis transmettez `payload` avec `client.send(...)`.

- N’excluez pas `sender` : il doit recevoir le message comme les autres.
- Ne retournez pas `chat:message` après la boucle : ce serait une réponse supplémentaire au demandeur.
- Conservez le retour `chat:error` avant la boucle : un refus reste privé.
- Ne modifiez pas `messages` dans la fonction d’envoi du frontend.

Indice de syntaxe : `for (const valeur of collection) { /* ... */ }`.

### Vérifier · 5 min

Redémarrez le backend et reconnectez les trois fenêtres. Depuis A, envoyez `A-1`. Chacune doit ajouter une ligne. Dans les trames, comparez `id`, `senderId` et `createdAt` : ils doivent être identiques entre destinataires. Envoyez ensuite `B-1` depuis B : un nouvel `id` et un autre `senderId` doivent apparaître partout. Chaque fenêtre peut afficher un ancien historique différent ; comptez les **nouvelles** entrées.

## C — Nettoyer et vérifier · 20 min

### TODO 5 — Retirer les connexions fermées · 4 min

Complétez `handleDisconnect` avec `this.clients.delete(client)`. La garde `OPEN` évite un envoi inadapté ; `delete` libère la référence. Redémarrez puis reconnectez les trois fenêtres. Déconnectez C via Atelier. Attendez que le journal serveur passe de 3 à 2. Reconnectez C : le compteur revient à 3.

### TODO 6 — Diagnostiquer un double écouteur · 6 min

L’exercice consiste à provoquer puis corriger un défaut local. Sauvegardez `frontend/src/useConnection.js`. Juste après la ligne `current.addEventListener('message', receive)`, ajoutez temporairement :

```js
// Défaut volontaire pour le diagnostic S4 — à retirer après observation.
current.addEventListener('message', (event) => receive(event));
```

Rechargez complètement les trois pages pour remplacer les anciens sockets. Attendez trois connexions ouvertes. Envoyez `Diagnostic-1` une seule fois depuis A. Dans une fenêtre, relevez le nombre de trames `chat:message` reçues et le nombre d’appels à `receiveMessage` (point d’arrêt ou `console.count('receiveMessage')` au début de cette fonction). Deux ajouts peuvent aussi produire un avertissement Vue sur les clés dupliquées : une même réponse a été ajoutée deux fois.

Expliquez pourquoi il n’y a qu’une trame mais deux traitements. **Retirez la ligne ajoutée**, gardez l’écouteur `receive` d’origine et son `removeEventListener` existant. Retirez l’instrumentation temporaire, rechargez les pages, puis refaites un envoi : une trame, un traitement, une entrée. Ne corrigez pas en filtrant les textes identiques ou en ajoutant une déduplication qui masquerait la cause.

Si le diagnostic prend plus de temps, privilégiez la comparaison trames/appels plutôt que la mise en forme des captures.

### Recette à trois clients · 10 min

Exécutez la [matrice T1–T7](tests-et-validation.md). Conservez vos relevés. La fermeture de C doit laisser A et B discuter ; après sa reconnexion manuelle, C reçoit de nouveau les prochains messages sans doublon.

## D — Corriger et expliquer · 10 min

Consacrez 5 minutes à la comparaison avec [le corrigé](corriges.md), 2 minutes à la [fiche de synthèse](fiche-reference.md), puis 3 minutes aux questions de bilan dans la recette. Expliquez à voix haute le trajet d’un message de B jusqu’aux trois listes.

À rendre : `chat.gateway.ts`, `useConnection.js` après correction, matrice renseignée, un relevé des trames communes aux trois clients, le compteur avant/après fermeture et une courte explication du double écouteur. Arrêtez les services avec Ctrl+C.
