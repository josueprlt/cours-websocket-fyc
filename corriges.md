# Corrigé commenté — Séquence 4

Consultez ce document après vos essais. La solution exécutable est dans `projet-corrige`. Les cinq premiers TODO se trouvent dans `backend/src/chat.gateway.ts` ; le sixième est le diagnostic temporaire d’un double écouteur.

## TODO 1–2 — Registre et ouverture

```ts
private readonly clients = new Map<WebSocket, string>();

handleConnection(client: WebSocket) {
  this.clients.set(client, randomUUID());
  console.log(`[registre] ouverture : ${this.clients.size} connexion(s)`);
}
```

Le gateway implémente `OnGatewayConnection` et `OnGatewayDisconnect`, importés de `@nestjs/websockets`. `WebSocket` est importé de `ws`, `randomUUID` de `node:crypto`. La collection persiste entre les messages. Sa clé est la connexion elle-même, ce qui permet de retrouver et de retirer exactement la bonne entrée. Son identifiant est créé à l’ouverture, pas à chaque envoi. Conservez aussi le bloc fourni qui envoie ensuite `chat:welcome` à ce client : l’interface utilise cet accueil privé pour reconnaître vos propres messages. Le nom d’affichage `senderName` est normalisé par le code fourni ; il ne remplace jamais `senderId`.

## TODO 3–4 — Une enveloppe pour tous

Le contrôle de contenu fourni précède ce code ; il conserve son retour `chat:error` privé. Le paramètre `sender` provient de `@ConnectedSocket()`.

```ts
const senderId = this.clients.get(sender);
if (!senderId) return;
const message = {
  id: randomUUID(),
  senderId,
  senderName, // Nom normalisé par le code fourni.
  content,
  createdAt: new Date().toISOString(),
};
const payload = JSON.stringify({ event: 'chat:message', data: message });
for (const client of this.clients.keys()) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(payload);
  }
}
// Fin du gestionnaire : aucun retour d'enveloppe de succès.
```

`get(sender)` rattache l’auteur à une connexion réellement enregistrée. Le client ne choisit pas son `senderId`. Créer le message avant la boucle donne les mêmes métadonnées à toutes ses copies. La garde porte sur chaque destinataire. L’émetteur est une clé de la collection, donc il reçoit lui aussi le message.

Le retour de succès de S3 a disparu : `WsAdapter` enverrait un objet retourné au demandeur, en plus de la diffusion. Ici, la méthode se termine avec `undefined`. Le frontend ajoute seulement à réception ; il ne fait pas d’ajout optimiste au clic.

## TODO 5 — Nettoyage

```ts
handleDisconnect(client: WebSocket) {
  this.clients.delete(client);
  console.log(`[registre] fermeture : ${this.clients.size} connexion(s)`);
}
```

`delete` retire la référence, tandis que `OPEN` sert à choisir les destinataires à l’instant de la diffusion. Sans suppression, le compteur pourrait augmenter à chaque reconnexion même si la garde empêche les envois vers les anciennes connexions. Retirer une clé déjà absente est sans danger pour les autres entrées.

## TODO 6 — Réparer la cause du doublon

Supprimez cette ligne ajoutée pour l’exercice :

```js
current.addEventListener('message', (event) => receive(event));
```

Conservez le câblage d’origine et son nettoyage dans `removeListeners` :

```js
const receive = (event) => { if (socket === current) onMessage(event); };
current.addEventListener('message', receive);
// Dans removeListeners, avec les retraits open/error/close déjà présents :
current.removeEventListener('message', receive);
```

Ces lignes sont montrées séparément pour expliquer leur rôle : ne placez pas le retrait immédiatement après l’ajout. Il reste dans la fonction de nettoyage appelée avant une nouvelle connexion et au démontage du composant.

La fonction anonyme ajoutée est distincte de `receive`. L’événement déclenche les deux callbacks ; chacun appelle le même gestionnaire et ajoute la réponse. Le réseau ne transporte pourtant qu’une seule trame. Le retrait utilise la référence originale : recréer une fonction anonyme dans `removeEventListener` ne retirerait pas celle déjà enregistrée.

Après correction, **rechargez complètement les pages** pour détruire les anciens sockets et l’écouteur anonyme restant. Refaire un envoi donne une réception et un ajout. Réenregistrer la même référence de callback avec les mêmes paramètres ne serait pas un bon exemple de ce défaut : l’API navigateur ignore cette inscription identique.

## Résultats de la recette

- T1 : A reçoit aussi sa copie ; les trois messages ont les mêmes id, auteur et date.
- T2 : B et C deviennent chacun auteur ; les nouveaux messages ont des id distincts.
- T3 : le texte répété correspond à deux demandes ; conserver deux entrées et deux id.
- T4 : la fermeture de C réduit le registre à 2 ; A et B reçoivent, C n’ajoute rien.
- T5 : la nouvelle connexion C reçoit un nouvel identifiant ; elle reçoit les prochains messages, sans rejeu du message manqué.
- T6 : les cycles restent à 2/3 entrées ; le client ne multiplie pas ses traitements.
- T7 : après fermeture observée des trois clients, la collection est vide.

Les historiques peuvent différer selon l’heure d’arrivée ou les rechargements : la preuve porte sur les nouveaux messages reçus pendant que les clients sont ouverts.

## Réponses aux questions et au bilan

1. B soumet son formulaire. Le client vérifie la connexion et le texte, sérialise `chat:send` et appelle `send`. Le serveur décode via l’adaptateur, contrôle le contenu, retrouve l’auteur, crée l’id et la date, puis sérialise une enveloppe commune. Il l’envoie à A, B et C si leurs connexions sont ouvertes. Chaque gestionnaire frontend décode, valide et ajoute une fois à sa liste réactive.
2. `id` distingue les messages ; `senderId` distingue les connexions. Le même auteur garde son identifiant pendant sa connexion ; C en obtient un nouveau à la reconnexion. Un seul id de message est créé avant la boucle pour identifier le même envoi chez tous.
3. `OPEN` évite l’envoi vers un destinataire indisponible ; `delete` supprime la référence conservée par le registre. Aucune des deux opérations ne remplace l’autre.
4. Un retour serveur en trop produit deux trames chez l’émetteur. Un double écouteur produit une seule trame mais deux traitements. On corrige à l’endroit responsable, sans filtrer les textes identiques.
5. `bufferedAmount` renseigne une attente locale de transmission, pas le traitement de l’application distante. Zéro ne constitue donc pas une preuve d’affichage.

Dans la question initiale du cours, A, B et C ouverts donnent trois destinataires et trois trames sortantes serveur pour un envoi accepté de A.

## Exécuter et comparer

Sauvegardez vos fichiers avant comparaison. Vous pouvez reprendre le gateway du corrigé et restaurer le `useConnection.js` fourni après le diagnostic. Le reste du frontend est identique dans les deux projets.

Depuis `projet-corrige`, lancer `npm ci`, puis `npm run dev:back` et `npm run dev:front` dans deux terminaux. Ne lancez pas simultanément les deux projets sur les mêmes ports. `npm test` vérifie les trois connexions réelles, les refus privés, les identifiants, les fermetures/reconnexions, les gardes d’état et le cycle de vie frontend. `npm run build` compile backend et frontend.
