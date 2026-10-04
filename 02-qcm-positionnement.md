# QCM de positionnement — Séquence 1

**Durée : 10 minutes · 12 questions · Une seule bonne réponse par question**

Ce diagnostic porte sur vos prérequis JavaScript et HTTP. Il se passe avant le cours sur WebSocket. Travaillez individuellement, sans exécuter les extraits. Si vous ne savez pas, laissez la réponse vide : cela aide à identifier les notions à revoir.

**Barème :** 1 point par réponse correcte, 0 sinon ; aucune pénalité. Le résultat ne constitue pas une certification et n’exclut pas de la formation.

Prénom : ____________________    Date : ____________________

## JavaScript — Questions 1 à 8

### 1. Accéder à une propriété

```js
const message = { author: 'Lina', content: 'Salut' };
```

Quelle expression renvoie `'Salut'` ?

- A. `message.author`
- B. `message.content`
- C. `message[0]`
- D. `content.message`

### 2. Comprendre `const`

```js
const messages = [];
messages.push('Bonjour');
```

Quel est le résultat ?

- A. Une erreur : `const` interdit toute modification du tableau.
- B. Le tableau reste vide.
- C. Le tableau contient `'Bonjour'` : sa référence n’a pas été réaffectée.
- D. `messages` devient une chaîne de caractères.

### 3. Utiliser une fonction

```js
const nettoyer = (texte) => texte.trim();
```

Que renvoie `nettoyer('  Salut  ')` ?

- A. `'Salut'`
- B. `'  Salut  '`
- C. `true`
- D. `undefined`

### 4. Transformer un tableau

```js
const messages = [
  { content: 'Salut' },
  { content: 'À bientôt' }
];
const textes = messages.map((message) => message.content);
```

Quelle est la valeur de `textes` ?

- A. `'Salut,À bientôt'`
- B. `2`
- C. Un tableau vide.
- D. `['Salut', 'À bientôt']`

### 5. Distinguer objet et JSON

Quelle opération transforme l’objet `{ content: 'Salut' }` en texte JSON ?

- A. `JSON.parse({ content: 'Salut' })`
- B. `JSON.stringify({ content: 'Salut' })`
- C. `Object.keys({ content: 'Salut' })`
- D. `console.log({ content: 'Salut' })`

### 6. Lire du code asynchrone

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');
```

Dans quel ordre les lettres s’affichent-elles ?

- A. A, B, C
- B. B, A, C
- C. A, C, B
- D. L’ordre change aléatoirement.

### 7. Comprendre une réponse `fetch`

Dans une fonction `async`, on écrit :

```js
const response = await fetch('/messages');
```

Que permet `await response.json()` si le corps de la réponse contient du JSON valide ?

- A. Lire et convertir le corps en valeur JavaScript.
- B. Ouvrir automatiquement une connexion WebSocket.
- C. Recharger la page.
- D. Transformer la requête GET en POST.

### 8. Réagir à un événement

```js
button.addEventListener('click', envoyer);
```

Quand la fonction `envoyer` est-elle appelée par cet écouteur ?

- A. Une fois à chaque seconde.
- B. Uniquement lorsque le serveur démarre.
- C. Immédiatement pendant l’enregistrement de l’écouteur.
- D. Lorsqu’un événement `click` atteint le bouton.

## Architecture HTTP — Questions 9 à 12

### 9. Identifier une requête HTTP

Le navigateur envoie `GET /messages`. Que signifie cette requête dans une API classique ?

- A. Il demande nécessairement la suppression des messages.
- B. Il demande au serveur la ressource désignée par `/messages`.
- C. Il diffuse directement à tous les autres navigateurs.
- D. Il crée automatiquement une connexion permanente de chat.

### 10. Comprendre un statut

Une réponse HTTP avec le statut `404` signifie généralement :

- A. La requête a réussi et créé une ressource.
- B. Le serveur a nécessairement été éteint.
- C. La ressource demandée n’a pas été trouvée.
- D. Le navigateur n’a pas JavaScript.

### 11. Situer le client

Dans notre application Vue exécutée dans un navigateur, le code qui met à jour les bulles de discussion s’exécute :

- A. Dans le navigateur de l’utilisateur.
- B. Uniquement dans la base de données.
- C. Toujours sur le serveur NestJS.
- D. Dans le dépôt Git distant.

### 12. Lire une adresse locale

Dans `http://localhost:5173`, que représente `5173` ?

- A. Le nombre maximum de messages.
- B. La version de JavaScript.
- C. L’identifiant de l’utilisateur.
- D. Le port auquel le client cherche à joindre le service local.

## Feuille de réponses

| Question | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Réponse | | | | | | | | | | | | |

**Auto-positionnement, sans point :** quelle question vous a semblé la plus difficile ? Pourquoi ?

_________________________________________________________________________

Le corrigé et les pistes de révision figurent dans le guide réservé au formateur.
