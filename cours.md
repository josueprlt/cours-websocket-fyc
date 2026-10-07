# Séquence 2 — Ouvrir et gérer une connexion WebSocket

Durant la séquence 1, vous avez démarré les deux services et expliqué le trajet d’un message. Aujourd’hui, vous allez brancher le navigateur au point `/chat`, afficher son état et fermer la connexion à la demande de l’utilisateur. Les raisons du choix de WebSocket sont acquises ; nous passons à son cycle de vie.

## Résultat attendu

L’écran fourni possède une adresse, les boutons **Connecter** et **Déconnecter**, un indicateur et un journal. Après votre travail :

- le clic sur Connecter démarre une tentative et l’ouverture réussie est visible ;
- une adresse incorrecte ou un serveur indisponible produit un diagnostic exploitable ;
- Déconnecter demande une fermeture normale, puis l’écran confirme l’état fermé ;
- une nouvelle ouverture nécessite un nouveau clic.

Aucun message de chat n’est envoyé pendant cette séquence. « Connecté » décrit le canal, pas l’existence d’une conversation fonctionnelle.

| Étape | Durée | Support |
|---|---:|---|
| Comprendre l’ouverture | 15 min | Ce cours, §1–3, et démonstration du handshake |
| Repérer l’implémentation | 10 min | Live coding et repérage dans les fichiers |
| Connecter le navigateur | 25 min | TP, TODO 1 à 4, vérification réseau brève |
| Afficher l’état et fermer | 20 min | Fiche de référence, TODO 5 et 6 |
| Tester et corriger | 20 min | Matrice de tests, correction et validation |

## 1. Choisir la bonne adresse

Notre client doit viser :

```text
ws://127.0.0.1:3000/chat
│    │         │    └─ chemin de la gateway préparée
│    │         └────── port du backend
│    └──────────────── machine locale
└───────────────────── WebSocket sans TLS, pour cet atelier local
```

Le port 5173 sert le frontend ; 3000 accueille le backend. `/health` est une route HTTP de diagnostic ; `/chat` est le point d’entrée WebSocket. Ces trois destinations ne sont pas interchangeables.

**`ws://` et `wss://`.** La variante `wss://` ajoute la protection TLS. Une page HTTPS doit utiliser une connexion WebSocket sécurisée ; mélanger HTTPS et WebSocket non sécurisé peut être bloqué par le navigateur. Notre atelier reste en HTTP/WS sur la machine locale. Remplacer simplement `ws` par `wss` ne configure pas TLS sur le serveur : le serveur fourni n’écoute pas en TLS. [Guide client WebSocket — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications).

**Question de repérage.** Le frontend s’affiche, mais une tentative vers `ws://127.0.0.1:5173/chat` échoue. Quelle information avez-vous confondue ? Réponse : le port du serveur qui fournit l’interface et celui du backend à connecter.

## 2. Lire le handshake de notre atelier

Le navigateur crée la demande d’ouverture. Voici sa structure simplifiée pour HTTP/1.1 ; les valeurs des clés changent selon la tentative.

```http
GET /chat HTTP/1.1
Host: 127.0.0.1:3000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: <valeur générée par le navigateur>
Sec-WebSocket-Version: 13
```

Une acceptation comporte notamment :

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: <valeur calculée par le serveur>
```

Le statut **101** indique l’acceptation du changement de protocole dans ce scénario HTTP/1.1. Une réponse HTTP **200** sur `/health` prouve autre chose : la route de diagnostic répond. Il ne faut pas traiter ces deux observations comme deux variantes d’un même succès. [Mécanisme Upgrade — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism).

| Élément observé | Ce que vous devez en déduire |
|---|---|
| `/chat`, hôte et port | Le navigateur tente de joindre le bon point d’entrée |
| `Upgrade: websocket` | Il demande un changement de protocole |
| `Sec-WebSocket-Version: 13` | Version du protocole annoncée |
| `Sec-WebSocket-Key` et `Sec-WebSocket-Accept` | Éléments de vérification du handshake ; pas un mot de passe utilisateur |
| `101 Switching Protocols` | Le serveur a accepté l’ouverture HTTP/1.1 |

Le navigateur génère la clé et vérifie la réponse. La clé n’authentifie pas une personne et ne chiffre pas les échanges. Vous ne calculez aucun en-tête dans votre code Vue : les implémentations du protocole s’en chargent. [RFC 6455, §4](https://www.rfc-editor.org/rfc/rfc6455.html#section-4).

### Observer sans transformer la séance en laboratoire réseau

Lorsque votre client fonctionnera, ouvrez les outils de développement **avant** de cliquer sur Connecter. Dans Réseau/Network, filtrez les WebSockets si le navigateur le permet et sélectionnez l’URL terminant par **`:3000/chat`**. Relevez l’adresse et le statut de l’ouverture. La connexion de rechargement de Vite sur 5173 n’est pas la cible.

Une connexion peut rester indiquée comme active ou en attente dans la liste réseau : elle n’a pas vocation à se terminer juste après l’ouverture. Si vous ne trouvez pas les en-têtes, vérifiez d’abord l’URL sélectionnée. Cette vérification dure environ trois minutes pendant le TP.

## 3. Créer l’objet n’est pas attendre l’ouverture

```js
const socket = new WebSocket('ws://127.0.0.1:3000/chat');
```

Le constructeur retourne un objet et lance la tentative. L’établissement se poursuit de façon asynchrone. Il ne renvoie pas une promesse à attendre avec `await`. Une adresse syntaxiquement invalide peut lever une exception immédiatement ; un serveur injoignable se manifeste ensuite par les événements de connexion. [Constructeur WebSocket — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket).

Dans l’exercice, le `try/catch` autour du constructeur est fourni. Il couvre le premier cas, pas toutes les pannes réseau. Pour le second, vous complétez les gestionnaires.

```text
Clic Connecter
      │
      ├─ adresse invalide → exception immédiate → corriger l’adresse
      │
      └─ objet créé → tentative en cours
                         ├─ ouverture acceptée → événement open
                         └─ échec → événement error, puis close
```

Ce schéma sépare une erreur de construction et l’échec d’une tentative effectivement lancée. La durée avant le résultat dépend du réseau ; ne déduisez pas une réussite du simple fait qu’aucune erreur n’est encore affichée.

## 4. Relier événements et affichage

### `open` : une ouverture réellement obtenue

L’événement `open` est le signal à utiliser pour afficher « Connecté ». Écrire ce texte juste après le constructeur produirait un faux succès si le serveur était arrêté. [Événement `open` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/open_event).

Le gestionnaire doit copier l’état courant de l’objet dans la donnée réactive de l’interface, puis renseigner le retour utilisateur.

### `error` : un signal, pas un diagnostic complet

Dans le navigateur, `error` est un événement générique. Il ne fournit pas un diagnostic applicatif détaillé comme « mauvais port » ou « serveur éteint ». Le message affiché doit inviter à vérifier l’adresse, le serveur et les observations réseau, sans inventer la cause. [Événement `error` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/error_event).

Notre indicateur ne crée pas un cinquième état natif `ERROR`. Le texte de diagnostic et l’état de connexion sont deux informations distinctes. Une erreur de tentative sera suivie de la fermeture ; c’est le gestionnaire `close` qui mettra à jour l’état final.

### Une propriété technique ne rend pas Vue réactif à elle seule

Le navigateur modifie `socket.readyState`. Cette modification externe ne déclenche pas, à elle seule, une mise à jour d’une `ref` Vue. Le squelette fournit donc `readyState`, une donnée réactive qui reçoit l’état observé après construction, à l’ouverture, après la demande de fermeture et à la fermeture effective.

Cette copie évite un badge qui reste « Connexion en cours » alors que l’objet est déjà ouvert. Le problème de l’exercice est de synchroniser cette copie aux bons moments, pas de reconstruire le composant visuel.

## 5. Donner un sens aux états

| Valeur native | Constante | Conséquence pour notre écran |
|---:|---|---|
| 0 | `WebSocket.CONNECTING` | Tentative lancée ; ne pas en lancer une seconde |
| 1 | `WebSocket.OPEN` | Connexion établie ; autoriser la fermeture volontaire |
| 2 | `WebSocket.CLOSING` | Fermeture commencée ; attendre son résultat |
| 3 | `WebSocket.CLOSED` | Connexion fermée ou ouverture échouée ; autoriser une nouvelle tentative manuelle |

`null` est seulement notre valeur d’interface pour « aucune tentative », avant la création d’un objet. Ce n’est pas un état WebSocket. Les constantes natives et leurs valeurs sont définies par l’API. [Propriété `readyState` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState).

```text
Aucune tentative              ← état d’interface, pas état natif
        ↓ création d’un objet
CONNECTING ── ouverture ──> OPEN ── demande de fermeture ──> CLOSING
     └─ échec ──> CLOSED                                     ↓
                                                          CLOSED
```

Une interruption peut mener à `CLOSED` sans que l’écran ait le temps de montrer `CLOSING`. Le journal vous aide à distinguer les événements des transitions visuelles trop rapides. Il n’est pas nécessaire de ralentir artificiellement le réseau pour valider cette séquence.

## 6. Demander la fermeture, puis constater son résultat

Dans notre interface, Déconnecter est autorisé uniquement quand la connexion est ouverte :

```js
socket.close(1000, 'Fin de la séance');
```

L’appel initie la fermeture ; il ne signifie pas que l’événement `close` a déjà été reçu. Le code 1000 exprime une fermeture normale. Après l’appel, l’interface peut indiquer « Fermeture en cours » puis afficher « Fermé » à réception de `close`. L’API autorise, pour un code fourni par ce client, 1000 ou une valeur applicative entre 3000 et 4999. [Méthode `close()` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close).

L’événement `close` donne notamment :

- `code` : code de fermeture observé ;
- `reason` : raison textuelle, éventuellement vide ;
- `wasClean` : indication de clôture propre de la connexion.

Ces données expliquent une fermeture, pas la livraison ou la lecture des messages métier. [Événement `close` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close_event).

Un code **1006** peut être rapporté localement lorsqu’aucune fermeture normale n’a été reçue. Il ne permet pas de conclure à une cause unique et ne doit pas être envoyé dans `close(1006)`. [RFC 6455, §7.4.1](https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1).

Une fois l’objet fermé, une nouvelle tentative utilise un nouvel objet. Ici, elle reste manuelle. Le programme de reconnexion automatique sera construit en S5.

## 7. Votre travail

Ouvrez `tp-guide.md`. Vous compléterez six emplacements dans `frontend/src/useConnection.js`. L’interface, le journal, le câblage des écouteurs et le nettoyage au démontage sont fournis. Vous ne modifiez pas le serveur.

Vous aurez terminé lorsque vous pourrez ouvrir, expliquer l’état affiché, fermer volontairement et diagnostiquer les cas demandés. L’étape suivante utilisera ce canal pour les messages ; elle ne fait pas partie du travail de cette séance.
