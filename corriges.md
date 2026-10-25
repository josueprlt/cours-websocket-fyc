# Corrigé commenté — Séquence 3

À consulter après votre tentative. `projet-corrige` contient la solution exécutable. Les extraits remplacent les zones correspondantes, sans ajouter de nouveaux écouteurs. Le cycle de vie de S2 est fourni dans les deux projets.

## TODO 1 — Vérifier la connexion réelle

Dans `frontend/src/useChat.js`, remplacer `false` :

```js
if (!socket || socket.readyState !== WebSocket.OPEN) {
  notice.value = 'Ouvrez la connexion avant d’envoyer.';
  return;
}
```

Le court-circuit évite de lire `readyState` sur `null`. L’objet natif porte l’état au moment de l’appel ; le bouton désactivé ne remplace pas cette vérification.

## TODO 2 — Sérialiser, envoyer, vider le brouillon

Dans le `try` de `sendMessage`, remplacer la consigne :

```js
socket.send(JSON.stringify({ event: 'chat:send', data: { content } }));
draft.value = '';
notice.value = 'Envoi demandé ; attente de la réponse du serveur.';
```

`content` a déjà été nettoyé et contrôlé. Le `catch` fourni couvre une exception immédiate d’envoi. On ne modifie pas `messages` : seul le retour serveur validera le résultat à afficher. Un appel réussi ne garantit pas une livraison future.

## TODO 3 — Produire les métadonnées serveur

Dans `backend/src/chat.gateway.ts`, après le contrôle fourni :

```ts
const message = {
  id: randomUUID(),
  content,
  createdAt: new Date().toISOString(),
};
```

L’import `randomUUID` est fourni. Le texte vient de la demande contrôlée ; l’identifiant et la date sont produits pour ce traitement. Deux textes identiques envoyés deux fois reçoivent deux identifiants différents. Les dates peuvent être égales si les traitements se produisent dans la même milliseconde : ne les utilisez pas comme clés uniques.

## TODO 4 — Répondre sur la connexion demandeuse

```ts
return { event: 'chat:message', data: message };
```

`WsAdapter` se charge de l’envoi du résultat. Retourner `JSON.stringify(...)` ici ne respecte pas le patron retenu pour ce cours. Ne faites pas non plus un envoi manuel en plus du retour : cela produirait deux réponses. Redémarrez le backend pour compiler les changements.

## TODO 5 à 7 — Décoder, contrôler et afficher

Version complète de `receiveMessage` :

```js
function receiveMessage(event) {
  try {
    // TODO 5
    if (typeof event.data !== 'string') throw new Error('Texte attendu');
    const response = JSON.parse(event.data);
    // Fourni : refus métier transmis sous forme de message.
    if (response?.event === 'chat:error' && typeof response.data?.message === 'string') {
      notice.value = response.data.message;
      return;
    }
    // TODO 6
    if (!isChatMessage(response)) throw new Error('Réponse hors contrat');
    messages.value.push(response.data);
    notice.value = 'Réponse reçue et affichée.';
  } catch {
    // TODO 7
    notice.value = 'Réponse invalide ignorée ; vous pouvez continuer.';
  }
}
```

Le `try` couvre le décodage et le contrôle de forme. `isChatMessage` vérifie notamment le nom d’événement, un identifiant textuel non vide, le contenu et une date au format attendu et interprétable. Ce contrôle de forme n’authentifie pas le serveur. Le `catch` protège la conversation existante et ne ferme pas le canal.

`messages.value.push` déclenche l’actualisation du composant fourni. La réponse d’erreur est affichée dans le diagnostic, jamais comme une entrée de conversation.

## Résultats commentés des tests

- **T1 :** `chat:send` contient seulement le texte ; `chat:message` revient avec l’identifiant et la date. Une entrée prouve le traitement côté client, le relevé réseau prouve le transport.
- **T2 :** chaque demande valide produit une réponse. Le second `Un` doit être conservé, avec un autre identifiant.
- **T3 :** `trim()` supprime les espaces extérieurs. L’interpolation Vue préserve les caractères visibles et affiche les balises comme texte.
- **T4 :** le refus se produit avant `send`, donc aucune nouvelle demande réseau.
- **T5 :** le contrôle d’état protège la fonction même quand l’interface est contournée.
- **T6 :** JSON tronqué échoue au décodage ; les quatre autres exemples échouent au contrôle de forme. Tous doivent être ignorés avec diagnostic.
- **T7 :** le callback est toujours branché et la connexion ouverte ; le message suivant s’ajoute normalement.

Pour le test facultatif à deux onglets, seul l’émetteur reçoit la réponse. Pour le dépassement de taille ou un contenu numérique, le serveur retourne `chat:error`, même si la demande contourne le formulaire.

## Réponses au bilan

1. `send()` demande un envoi ; le retour enrichi et sa réception prouvent le trajet complet.
2. `message` est l’événement natif ; `chat:message` est un nom choisi dans notre contrat JSON.
3. Le décodage contrôle la syntaxe JSON ; la fonction de validation contrôle la forme métier. `null` est du JSON valide mais pas une réponse de chat.
4. Le serveur les attribue au moment du traitement pour établir des métadonnées communes, indépendantes de celles que le client pourrait proposer.

## Comparer sans perdre votre travail

Sauvegardez vos deux fichiers avant comparaison. Vous pouvez reprendre uniquement `useChat.js` et `chat.gateway.ts` du corrigé. Les autres fichiers S3 sont identiques entre les projets. Pour lancer la solution complète : depuis `projet-corrige`, `npm ci`, puis `npm run dev:back` et `npm run dev:front` dans deux terminaux. Ne lancez pas les deux projets simultanément : les ports sont communs.
