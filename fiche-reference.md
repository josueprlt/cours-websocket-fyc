# Fiche de synthèse — Diffusion S4

**Une demande → un message serveur → une copie par connexion ouverte, émetteur inclus.**

```text
Formulaire → chat:send → validation serveur → message commun
                                               ↓
                                         JSON.stringify
                                               ↓
                                   Map : pour chaque socket OPEN
                                      ↙        ↓        ↘
                                     A         B         C
                                      → réception → liste Vue
```

| Besoin | Patron | Attention |
|---|---|---|
| Conserver les connexions | `new Map<WebSocket, string>()` sur la classe | Pas de nouvelle collection par message |
| Identifier à l’ouverture | `clients.set(client, randomUUID())` | Identité de connexion, pas de compte |
| Retrouver l’auteur | `clients.get(sender)` | Ne pas accepter un auteur fourni par le client |
| Identifier un message | `id: randomUUID()` avant la boucle | Même id chez tous les destinataires |
| Sérialiser | `JSON.stringify({ event: 'chat:message', data: message })` | Une fois avant la boucle |
| Parcourir | `for (const client of clients.keys())` | Inclure l’émetteur |
| Vérifier l’état | `client.readyState === WebSocket.OPEN` | Pour chaque destinataire |
| Transmettre | `client.send(payload)` | Pas de retour `chat:message` après diffusion |
| Retirer à la fermeture | `clients.delete(client)` | La garde OPEN ne libère pas la référence |
| Afficher | Un seul callback de réception ajoute à la liste | Aucun ajout local à l’envoi |
| Retirer l’écouteur | `removeEventListener('message', receive)` | Même référence que lors de l’ajout |

`WebSocket` vient de `ws` côté serveur, de l’API native côté navigateur. Le câblage `WsAdapter` reste inchangé. La demande contient `{ content, senderName }` ; la diffusion contient `{ id, senderId, senderName, content, createdAt }`. Le nom est modifiable dans le champ discret « Vous ». L’accueil privé `chat:welcome` fournit le `senderId` local pour distinguer vos messages (gauche, vert) des autres (droite, gris). Un refus `chat:error` reste privé.

## Deux identifiants

- `id` : nouveau pour chaque message accepté. Identique dans toutes ses copies.
- `senderId` : stable pendant une connexion, nouveau après reconnexion. Utilisé pour reconnaître vos messages ; consultable au survol de la mention sous la bulle.

## Diagnostiquer les doublons

- **Deux trames chez A, une chez B/C** : chercher un retour serveur après la boucle.
- **Une trame, deux traitements** : chercher deux fonctions enregistrées pour `message`.
- **Une trame, une réception mais deux ajouts** : chercher aussi un ajout optimiste à l’envoi.

Deux envois réels du même texte restent deux messages. La clé Vue ne constitue pas un mécanisme de déduplication.

> **bufferedAmount :** quantité d’octets encore en attente d’envoi. Ce n’est pas le nombre de destinataires, ni un accusé de réception. Pas de laboratoire d’accumulation dans S4.

Le registre vit en mémoire dans un processus. Le nouvel arrivant reçoit seulement les prochains messages ; la reconnexion reste manuelle. Pour finir : trois clients, une copie chacun, registre à zéro après fermeture des trois fenêtres.
