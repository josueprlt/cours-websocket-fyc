# QCM de positionnement — Séquence 1

**10 minutes : 7 minutes pour répondre, puis 3 minutes pour consulter la correction.**

Huit questions courtes, une seule bonne réponse par question. Sans exécuter le code. Une réponse correcte vaut un point, une réponse fausse ou absente vaut zéro. Ce diagnostic permet d’orienter vos révisions ; il ne demande aucune connaissance préalable de WebSocket.

## 1. Lire un objet JavaScript

```js
const message = { author: 'Camille', content: 'Bonjour' };
```

Quelle expression donne le contenu du message ?

- A. `message[0]`
- B. `message.content`
- C. `content.message`

## 2. Modifier un tableau

```js
const messages = [];
messages.push('Bonjour');
```

Que se passe-t-il ?

- A. Le tableau contient un élément : `const` n’interdit pas cette modification.
- B. Une erreur apparaît car `const` rend le tableau immuable.
- C. `messages` devient une chaîne.

## 3. Reconnaître un format de données

Le serveur fournit le texte suivant :

```json
{"author":"Camille","content":"Bonjour"}
```

Que représente-t-il ?

- A. Une fonction JavaScript qui envoie un message.
- B. Une page HTML.
- C. Des données structurées au format JSON.

## 4. Utiliser un événement

```js
button.addEventListener('click', envoyer);
```

Quand la fonction `envoyer` sera-t-elle appelée par cet écouteur ?

- A. Immédiatement lors de l’enregistrement de l’écouteur.
- B. Lors d’un événement `click` reçu par le bouton.
- C. Toutes les secondes.

## 5. Lire du code asynchrone

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');
```

Quel ordre d’affichage attend-on ?

- A. A, C, B.
- B. A, B, C.
- C. B, A, C.

## 6. Comprendre une requête HTTP

Dans une API classique, que demande `GET /messages` ?

- A. La suppression des messages.
- B. L’ouverture automatique d’un canal permanent entre tous les navigateurs.
- C. Une représentation de la ressource `/messages` au serveur.

## 7. Comprendre une réponse HTTP

Le navigateur reçoit une réponse `404`. Que signifie-t-elle généralement ?

- A. Le serveur est forcément éteint.
- B. La ressource demandée n’a pas été trouvée.
- C. Le serveur a créé une ressource.

## 8. Identifier les rôles

Dans notre application, qui met à jour les bulles affichées dans l’interface Vue ?

- A. Le code exécuté dans le navigateur.
- B. Le dépôt Git.
- C. Un autre navigateur qui écrit directement dans notre page.

## Vos réponses

| Question | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Réponse | | | | | | | | |

Ouvrez ensuite la partie QCM de `corriges.md`. Notez une priorité de révision si nécessaire. Il n’y a pas de manipulation JSON à apprendre pendant cette séquence ; son utilisation dans les échanges sera travaillée en S3.
