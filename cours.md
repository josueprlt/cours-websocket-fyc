# Séquence 3 — Envoyer et recevoir les messages du chat

La connexion démarre automatiquement au montage de l’interface. Le chat est affiché par défaut ; l’onglet **Atelier** rassemble les contrôles de connexion, le journal et les simulations. Après un échec ou une fermeture, utilisez **Réessayer** dans le chat ou **Connecter** dans Atelier. La reprise automatique après coupure reste pour S5.

En S2, vous avez ouvert une connexion WebSocket, observé ses états et demandé sa fermeture. Vous disposez maintenant d’un canal. Cette séquence lui donne un usage : transmettre du texte, le traiter sur le serveur et afficher la réponse sans recharger la page.

**Durée : environ 1 h 30. Objectif :** réaliser un aller-retour complet. Prérequis : S2 validée, objets JavaScript, fonctions, événements et notions de `ref` Vue. La connexion corrigée de S2 est fournie pour se concentrer sur les messages.

| Étape | Durée | Supports et activité |
|---|---:|---|
| Définir les échanges | 15 min | Ce cours §1–3 (10 min), capsule trajet (4 min), question (1 min) |
| Envoyer depuis le formulaire | 20 min | TP A : garde d’état et sérialisation, TODO 1–2 |
| Traiter sur le serveur | 20 min | Capsule live coding (5 min), TP B et TODO 3–4 (15 min) |
| Recevoir et afficher | 20 min | Fiche (4 min), TP C et TODO 5–7 (16 min) |
| Tester et corriger | 15 min | Jeu de tests (9 min), corrigé (4 min), bilan (2 min) |
| **Total** | **90 min** | Les vidéos sont incluses dans les durées |

Les scripts et transcriptions des capsules sont dans [videos.md](videos.md). Ce dépôt contient les supports de tournage, pas de vidéos enregistrées. En autonomie, lire les transcriptions à la place des capsules.

## 1. Du formulaire à la réponse

```text
Navigateur de l’émetteur                  Backend NestJS
Formulaire → sendMessage()
  vérification OPEN
  objet → JSON.stringify → send() ─────> WsAdapter : JSON → event + data
                                         handleMessage(data)
                                         contrôle du texte
                                         identifiant + date
message ← réponse JSON <──────────────── retour { event, data }
  event.data → JSON.parse
  contrôle de la forme
  messages.value.push → Vue affiche
```

L’envoi et la réception sont deux moments distincts. `send()` ne retourne pas la réponse métier et n’est pas une promesse de livraison. L’interface annonce donc « Envoi demandé », puis « Réponse reçue » uniquement après traitement de la réponse. Un serveur qui disparaît entre ces moments peut laisser l’application en attente : la reprise et les délais d’attente seront étudiés ultérieurement.

La liste commence vide. Vous n’ajoutez aucun message au clic : chaque entrée visible doit provenir d’une réponse validée. Cela rend l’aller-retour vérifiable et évite un double affichage, à l’envoi puis à la réception.

## 2. Fixer le contrat JSON

WebSocket transporte les données ; il ne définit pas les champs de notre chat. Nous choisissons une enveloppe commune. L’adaptateur `WsAdapter` déjà configuré attend, en entrée, un événement applicatif et ses données. Le nom d’événement doit correspondre à celui du gestionnaire NestJS. [Adaptateur WebSocket de NestJS](https://docs.nestjs.com/websockets/adapter).

### Demande du navigateur

```json
{
  "event": "chat:send",
  "data": { "content": "Bonjour le salon 👋" }
}
```

### Réponse du serveur à ce même navigateur

```json
{
  "event": "chat:message",
  "data": {
    "id": "b7a26941-5b35-478a-bac0-0cc42315ae21",
    "content": "Bonjour le salon 👋",
    "createdAt": "2026-10-21T10:00:00.000Z"
  }
}
```

L’identifiant et la date ci-dessus sont illustratifs ; ils changent à chaque traitement. `randomUUID()` génère l’identifiant sur le serveur ; `new Date().toISOString()` produit une date UTC, reconnaissable au `Z`. Le composant fourni la présente à l’heure locale. Le client ne choisit pas ces valeurs.

| Champ | Qui le produit ? | Règle du TP |
|---|---|---|
| `event` | Chaque émetteur | `chat:send`, `chat:message` ou `chat:error` |
| `data.content` | Client, puis normalisé par le serveur | Chaîne non vide après `trim()`, longueur ≤ 500 |
| `data.id` | Serveur | UUID créé pour chaque traitement accepté |
| `data.createdAt` | Serveur | Chaîne ISO UTC générée lors du traitement |
| `data.message` | Serveur, pour `chat:error` | Explication du refus |

La limite utilise `.length` JavaScript : elle compte des unités UTF-16, pas forcément des caractères visibles. Un emoji peut en occuper deux. Nous appliquons la même règle des deux côtés. `trim()` retire les espaces aux extrémités et conserve ceux à l’intérieur.

Une demande avec un contenu absent, numérique, vide ou trop long reçoit :

```json
{
  "event": "chat:error",
  "data": { "message": "Contenu attendu : 1 à 500 unités UTF-16 après trim()." }
}
```

Ce refus métier n’est pas l’événement natif `error` de S2. Il arrive lui aussi dans un événement natif `message`. Un paquet entrant qui n’est pas du JSON ou dont le nom d’événement est inconnu n’atteint pas nécessairement notre méthode : le TP ne promet pas de réponse métier à toute donnée arbitraire.

**Question :** lequel des trois champs `content`, `id`, `createdAt` doit figurer dans la demande ? Pourquoi les deux autres appartiennent-ils au serveur ?

## 3. Préparer et envoyer le texte

Le formulaire utilise `@submit.prevent` pour éviter la navigation HTML habituelle. Son bouton est désactivé si la connexion n’est pas ouverte. Cette aide visuelle ne remplace pas le contrôle dans la fonction : on vérifie l’objet courant au moment de l’envoi.

```js
if (!socket || socket.readyState !== WebSocket.OPEN) {
  notice.value = 'Ouvrez la connexion avant d’envoyer.';
  return;
}
const request = { event: 'chat:send', data: { content } };
socket.send(JSON.stringify(request));
```

Un objet JavaScript n’est pas une chaîne JSON : la sérialisation fabrique le texte transmis. La méthode native `send()` met les données en file d’envoi. Pendant `CONNECTING`, elle peut lever une exception ; en fermeture ou après fermeture, les données sont écartées. D’où le garde-fou et le `try/catch` fourni. [Méthode `send()` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send).

Le brouillon est vidé seulement après l’appel réussi. Cela ne prouve pas sa livraison. Il reste intact en cas de refus local (hors connexion ou contenu vide). L’historique n’est jamais modifié par `sendMessage()`.

## 4. Traiter sur le serveur

Dans `backend/src/chat.gateway.ts`, `@SubscribeMessage('chat:send')` sélectionne la demande et `@MessageBody()` donne son champ `data`, déjà décodé par l’adaptateur. Ne faites pas un second `JSON.parse(data)`.

Le contrôle du contenu est fourni. Il est nécessaire même si le formulaire vérifie déjà la saisie : un autre client peut envoyer directement une demande. L’exercice consiste ensuite à construire le message et à retourner l’enveloppe attendue.

```ts
const message = {
  id: randomUUID(),
  content,
  createdAt: new Date().toISOString(),
};
return { event: 'chat:message', data: message };
```

Dans ce montage, l’adaptateur sérialise le résultat et l’envoie sur la connexion demandeuse. Il n’y a ni parcours des autres clients ni diffusion. Deux onglets connectés auront donc des listes différentes. La diffusion sera l’objet de S4. L’identifiant distingue deux envois de texte identique ; il ne constitue pas un mécanisme de déduplication des tentatives.

## 5. Recevoir, décoder, vérifier, afficher

`message` est le nom de l’événement natif de réception. `chat:message` est un champ dans le JSON de notre application. Ce sont deux niveaux différents.

```js
socket.addEventListener('message', receiveMessage);
```

Ce branchement et son retrait sont déjà assurés par `useConnection.js`. Ne rajoutez pas un deuxième écouteur : cela afficherait deux fois la même réponse. Le gestionnaire reçoit un `MessageEvent`. Pour un message texte, sa propriété `data` contient une chaîne. [Événement `message` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/message_event).

Trois étapes sont indispensables :

1. Décoder avec `JSON.parse(event.data)` dans un `try/catch`.
2. Vérifier l’événement et les champs avec `isChatMessage(response)`, fourni.
3. Ajouter `response.data` à la liste réactive.

`JSON.parse('null')` réussit, mais n’obtient pas un message. Une chaîne JSON syntaxiquement correcte peut également avoir un contenu numérique ou oublier la date. Le décodage et le contrôle de forme répondent à deux problèmes distincts.

Le composant `MessageList.vue` reçoit la liste et utilise `id` comme clé. Il affiche le texte avec `{{ message.content }}` : un texte comme `<b>Bonjour</b>` doit rester visible tel quel, sans être interprété comme du HTML. Ne remplacez pas cette interpolation par `v-html`.

Le `catch` affiche un diagnostic sans vider les réponses déjà reçues, sans ajouter l’entrée invalide et sans fermer la connexion. L’envoi suivant doit encore fonctionner. Une réponse `chat:error` conforme affiche son explication sans entrer dans la conversation.

## 6. Et les échanges binaires ?

WebSocket permet aussi de transmettre des données binaires, par exemple avec un `Blob` ou un `ArrayBuffer`. À la réception, leur représentation dépend notamment de `binaryType`. Notre protocole S3 accepte uniquement le texte JSON : son gestionnaire rejette une donnée non textuelle. Aucun exercice binaire n’est obligatoire. Envoyer un fichier exigerait de définir un autre contrat et un traitement adapté ; `JSON.parse()` n’est pas un décodeur universel de données binaires. [Données d’un événement `message` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/message_event).

## 7. Passer à la pratique

Suivez [tp-guide.md](tp-guide.md), puis [tests-et-validation.md](tests-et-validation.md). La validation est obtenue lorsqu’un texte envoyé revient enrichi et apparaît sans rechargement, plusieurs fois de suite, et qu’une réponse mal formée n’empêche pas la suite.

L’historique reste en mémoire dans l’onglet : recharger efface la liste. Ni stockage, ni authentification, ni diffusion, ni reconnexion automatique ne sont nécessaires à cette séance.
