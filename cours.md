# Séquence 4 — Diffuser les messages à plusieurs utilisateurs

**Objectif :** transformer l’aller-retour individuel de S3 en conversation collective. À la fin, trois fenêtres peuvent écrire et chacune reçoit une seule copie de chaque message, émetteur compris. Le serveur libère les connexions fermées.

**Prérequis :** avoir compris S3, le contrat `{ event, data }`, `JSON.stringify`, les événements WebSocket et les états de connexion. Le formulaire, la validation JSON et le cycle de vie Vue sont fournis. Durée totale : **90 minutes**, selon le [parcours](README.md). Pour les 15 premières minutes : lire ce cours (9 min), regarder la capsule 1 ou sa transcription (4 min), répondre aux questions (2 min).

## 1. Une connexion par fenêtre

En S3, le gestionnaire retournait une enveloppe : `WsAdapter` l’envoyait uniquement à la connexion demandeuse. En S4, le serveur connaît les connexions et transmet le même message à chacune d’elles.

```text
S3 : A ── chat:send ──> serveur ── chat:message ──> A

S4 :                              registre des connexions
                                  ┌───────────────────┐
A ── chat:send ──> serveur ────────>│ socket A → id A    │──> A : +1 message
                 contrôle         │ socket B → id B    │──> B : +1 message
                 crée le message  │ socket C → id C    │──> C : +1 message
                 sérialise 1 fois  └───────────────────┘
                                   envoi si état OPEN
```

Les navigateurs ne communiquent pas directement entre eux. Un envoi de A produit une trame entrante sur le serveur et trois trames sortantes si A, B et C sont ouverts. Chaque fenêtre ajoute le message seulement lors de sa réception. L’émetteur est inclus : aucun ajout local au clic, aucune exclusion de A dans la boucle.

Nous simulons trois utilisateurs avec trois fenêtres. Techniquement, le registre représente des **connexions**, pas des comptes authentifiés : deux onglets de la même personne représentent deux connexions.

## 2. Un registre partagé par le gateway

Le registre est une propriété du gateway, conservée entre les appels. Une collection créée à l’intérieur de `handleMessage` repartirait de zéro à chaque message.

Nous choisissons `Map<WebSocket, string>` : la clé est l’objet connexion et la valeur est un identifiant attribué par le serveur.

| Opération | Rôle |
|---|---|
| `new Map<WebSocket, string>()` | Créer un registre vide |
| `clients.set(client, randomUUID())` | Associer une connexion à un identifiant |
| `clients.get(sender)` | Retrouver l’auteur d’une demande |
| `clients.keys()` | Parcourir les connexions |
| `clients.delete(client)` | Retirer une connexion fermée |
| `clients.size` | Observer le nombre d’entrées |

Un `Set<WebSocket>` conviendrait pour conserver uniquement les connexions. La `Map` simplifie ici l’association avec leur identifiant. Deux appels à `set` sur la même clé ne créent pas deux entrées ; on attribue toutefois l’identifiant une seule fois à l’ouverture pour qu’il reste stable pendant la connexion.

NestJS appelle `handleConnection(client)` à l’arrivée d’un client et `handleDisconnect(client)` lors de sa déconnexion, lorsque le gateway implémente les interfaces correspondantes. Ces méthodes servent à maintenir le registre. [Cycle de vie des gateways NestJS](https://docs.nestjs.com/websockets/gateways#lifecycle-hooks).

```text
Connexion ouverte → ajout (socket, UUID) → messages → fermeture observée → suppression
                     size : 2 → 3                                 size : 3 → 2
```

L’identifiant de connexion change à la reconnexion. Il ne constitue ni un mot de passe ni une identité utilisateur permanente. Ce registre est en mémoire dans un seul processus ; un redémarrage le vide.

## 3. Le contrat de S3, enrichi de l’auteur

Le navigateur envoie le contenu et un nom d’affichage facultatif :

```json
{ "event": "chat:send", "data": { "content": "Bonjour à tous !", "senderName": "Alice" } }
```

Le serveur contrôle et nettoie le texte comme en S3 (1 à 500 unités UTF-16 après `trim()`). Il retrouve `senderId` dans le registre puis construit **un seul message** :

```json
{
  "event": "chat:message",
  "data": {
    "id": "8a2f3297-89be-47a2-941e-32bcc93ba946",
    "senderId": "fc7b0261-d068-4615-a189-1fc542031140",
    "senderName": "Alice",
    "content": "Bonjour à tous !",
    "createdAt": "2026-10-27T10:00:00.000Z"
  }
}
```

Ces valeurs sont illustratives. `id` identifie le message ; `senderId` identifie la connexion qui l’a émis ; `createdAt` date le traitement serveur. Tous les destinataires reçoivent les **mêmes valeurs**. Deux envois du même texte ont deux `id` différents, même si leur `senderId` est identique. Le serveur n’accepte pas un auteur choisi dans la demande du navigateur.

L’interface S4 permet de modifier son nom directement dans le champ discret « Vous », en bas à gauche. Le serveur normalise ce nom (espaces extérieurs retirés, 32 unités UTF-16 maximum, « Vous » par défaut) et le joint aux prochains messages dans `senderName`. Les anciens messages conservent leur nom au moment de l’envoi. Ce nom est une étiquette choisie librement, pas une identité authentifiée.

À l’ouverture, un message privé `chat:welcome` contenant `data.senderId` indique au navigateur son identifiant serveur. Le client le mémorise sans ajouter de bulle. Il peut ainsi reconnaître ses propres messages : à gauche, en vert, avec la mention « (vous) ». Les autres sont à droite, en gris. Deux noms identiques n’affectent pas cette distinction. Après reconnexion, les anciens identifiants restent mémorisés pendant la vie de la page. Les identifiants complets restent accessibles au survol de la mention sous la bulle et dans les trames. Ce câblage d’interface est fourni dans les deux projets et ne constitue pas un TODO supplémentaire.

## 4. Diffuser aux connexions ouvertes

Avec `@ConnectedSocket()`, le gestionnaire récupère la connexion demandeuse. `@MessageBody()` lui fournit les données déjà décodées. Il n’a pas besoin d’un nouveau `JSON.parse`.

Après validation, on prépare l’enveloppe et on la sérialise **avant** la boucle. On parcourt ensuite le registre et on appelle `send(payload)` sur chaque connexion dont `readyState === WebSocket.OPEN`. Ici, `WebSocket` est importé de `ws` côté Node ; côté navigateur, l’API native est déjà disponible. [Exemple de diffusion de la bibliothèque ws](https://github.com/websockets/ws#server-broadcast).

```text
Créer un id + une date + retrouver senderId
                     ↓
              JSON.stringify une fois
                     ↓
           pour chaque socket du registre
                     ↓
          OPEN ? oui → send(payload)
                 non → ne pas envoyer
```

La garde d’état s’applique à chaque destinataire, pas seulement à l’émetteur. Une connexion peut être encore dans la collection alors qu’elle est en cours de fermeture. La garde évite de lui demander un envoi ; le hook de déconnexion supprime ensuite la référence.

**Un seul chemin de succès :** après la diffusion, ne retournez pas l’enveloppe `chat:message`. Dans notre `WsAdapter`, un résultat retourné serait à nouveau envoyé au demandeur. A recevrait alors deux trames, tandis que B et C n’en recevraient qu’une. Un retour `undefined` ne déclenche pas cette réponse supplémentaire.

Le refus `chat:error` conserve son retour S3 : seule la connexion qui a soumis une donnée invalide reçoit l’explication. On ne diffuse pas ce refus à tout le salon.

> **Comprendre `bufferedAmount` — sans laboratoire obligatoire**
>
> `send()` met des données en attente d’envoi ; il ne confirme pas leur affichage chez le destinataire. Dans l’API navigateur, `bufferedAmount` indique le nombre d’octets soumis par `send()` et encore en attente de transmission. Une valeur élevée peut révéler que l’application produit plus vite que le réseau ne transmet. Une valeur nulle ne prouve pas la réception ni le traitement par le serveur. Côté `ws`, cette propriété renseigne aussi les octets en file d’envoi. La gestion des clients lents nécessite une politique spécifique ; elle n’est pas demandée ici. Aucun test de saturation ou d’accumulation ne fait partie du parcours ni de la validation. [MDN : bufferedAmount](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount), [API ws](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketbufferedamount).

## 5. Nettoyer les connexions et les écouteurs

Retirer une connexion du registre évite de conserver des références inutiles. Fermer la fenêtre ou cliquer sur Déconnecter conduit normalement à un événement de fermeture. Le serveur appelle alors `handleDisconnect`, qui exécute `delete`. Une seconde suppression est sans effet : elle ne retire pas un autre client.

Une coupure silencieuse n’est pas toujours détectée immédiatement. La recette porte sur des fermetures observées ; elle ne promet pas une détection instantanée d’un câble débranché. La surveillance active et la reprise automatique dépassent S4.

Côté navigateur, un autre nettoyage concerne les écouteurs. `useConnection.js` possède déjà un écouteur `message` et son retrait avec la même référence de fonction. Un second callback qui appelle lui aussi `onMessage` ferait traiter deux fois une seule trame.

```js
// Deux fonctions distinctes : la même trame est traitée deux fois.
current.addEventListener('message', receive);
current.addEventListener('message', (event) => receive(event));
```

Réenregistrer exactement la même référence avec les mêmes paramètres ne produit pas ce doublon dans `EventTarget`. Le piège est la création d’une nouvelle fonction, notamment une fonction anonyme. [MDN : addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

Comptez d’abord les trames, puis les appels du gestionnaire et les entrées affichées. Une trame et deux appels orientent vers les écouteurs ; deux trames seulement chez l’émetteur orientent vers le retour serveur resté en place. Ne masquez pas le défaut en supprimant les textes identiques : deux vrais envois identiques doivent rester visibles.

## 6. Questions avant le TP

1. Si A envoie et que A, B et C sont ouverts, qui reçoit ? Combien de trames le serveur envoie-t-il ?
2. Pourquoi créer l’identifiant du message avant la boucle ? Quelle différence avec l’identifiant de connexion ?
3. Pourquoi contrôler `OPEN` **et** supprimer les connexions fermées ?

Passez au [TP](tp-guide.md). Réponses et explication du trajet dans le [corrigé](corriges.md). Le salon ne rejoue pas les anciens messages : un client arrivé plus tard ne reçoit que les prochaines diffusions. L’historique reste propre à chaque page et disparaît au rechargement.
