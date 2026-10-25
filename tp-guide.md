# TP guidé — Un aller-retour complet

Travaillez dans `projet`. La connexion de S2, l’interface, le contrôle des données et le composant d’affichage sont fournis. Sept TODO se répartissent entre `frontend/src/useChat.js` et `backend/src/chat.gateway.ts`. Consultez le corrigé après vos essais.

## Préparer le poste

Utilisez Node 24.x comme en S2. Arrêtez les anciens services pour libérer 3000 et 5173. Depuis `projet` :

```sh
npm ci
npm run dev:back
```

Dans un deuxième terminal, depuis `projet` :

```sh
npm run dev:front
```

Ouvrez `http://127.0.0.1:5173` : la connexion démarre automatiquement. Avant tout exercice, le badge doit afficher Connecté. Le squelette compile mais n’envoie pas encore de message. Le bouton Envoyer affiche une consigne TODO.

**Si vous poursuivez votre projet S2 :** sauvegardez votre travail, reprenez les fichiers S3 `App.vue`, `useConnection.js`, `useChat.js`, `protocol.js`, `MessageList.vue`, `responseFixtures.js` dans `frontend/src`, puis `chat.gateway.ts` dans `backend/src`. Reprenez aussi `frontend/index.html` pour le titre. Les dépendances et l’adaptateur ne changent pas. `useConnection` conserve le cycle de vie S2 et fournit désormais un callback de réception et `getSocket()`.

Le chat affiche les réponses en bulles, avec leur heure. L’identifiant serveur reste consultable au survol de « Reçu par le serveur » ou dans la trame réseau. L’onglet Atelier regroupe les contrôles de connexion, les injections et le journal repliable. Changer d’onglet conserve la connexion, le brouillon et les messages.

Le backend ne se relance pas automatiquement : après chaque modification TypeScript, arrêtez-le puis relancez `npm run dev:back`, et cliquez sur Réessayer dans le chat (ou Connecter dans Atelier). Vite actualise le frontend ; reconnectez-vous si le rechargement du module a fermé le canal.

## A — Envoyer depuis le formulaire · 20 min

### Repérer le trajet · 4 min

Dans `App.vue`, trouvez `@submit.prevent="sendMessage"`, le `v-model="draft"` et la liste. Dans `useChat.js`, identifiez `draft`, `messages`, `notice` et `connection.getSocket()`. La fonction de réception est déjà branchée par `useConnection` ; ne modifiez pas ses écouteurs.

### TODO 1 · Contrôler l’état · 5 min

Dans `sendMessage`, remplacez `false` par la condition qui refuse l’envoi si l’objet n’existe pas **ou** si son état n’est pas `WebSocket.OPEN`. Le message et le `return` sont fournis. Le contrôle de saisie qui suit est également fourni.

**Vérification :** dans Atelier, cliquez sur Déconnecter, puis revenez dans général : le bouton Envoyer est désactivé. Pour vérifier aussi la fonction, retirez temporairement `:disabled="!canClose"` du seul bouton Envoyer, soumettez un brouillon et vérifiez le diagnostic sans perte du texte. Rétablissez ensuite cet attribut, puis cliquez sur Réessayer.

### TODO 2 · Sérialiser et envoyer · 8 min

Remplacez la consigne temporaire dans le `try` par :

1. une enveloppe `chat:send`, avec `data.content` ;
2. sa sérialisation et son envoi ;
3. le vidage de `draft.value` et une information « Envoi demandé ; attente de la réponse ».

Extrait de référence à adapter :

```js
const request = { event: 'chat:send', data: { content } };
socket.send(JSON.stringify(request));
```

N’ajoutez rien à `messages`. Ne faites pas `await socket.send(...)`.

### Vérifier l’étape · 3 min

Dans Réseau → WebSocket → `:3000/chat` → Messages (ou Frames), envoyez « Bonjour ». Une trame sortante doit contenir le JSON. À ce stade, le backend du squelette ne renvoie rien pour un texte valide. C’est normal jusqu’aux TODO 3–4. Ne confondez pas cette connexion avec celle de Vite.

## B — Traiter sur le serveur · 20 min

### Capsule de live coding · 5 min

Regardez la capsule 2 ou lisez sa transcription dans `videos.md`. Repérez le décorateur, `data`, le contrôle fourni et la valeur retournée.

### TODO 3 · Construire le message · 6 min

Dans `handleMessage`, après le contrôle de contenu, créez `message` avec :

- `id` : appel à `randomUUID()`, déjà importé ;
- `content` : texte contrôlé et normalisé, déjà disponible ;
- `createdAt` : date courante sérialisée avec `toISOString()`.

Ne reprenez pas d’identifiant ou de date envoyés par le navigateur. N’écrivez pas une date fixe copiée du cours.

### TODO 4 · Répondre à l’émetteur · 5 min

Remplacez le `return` temporaire par l’enveloppe `chat:message`, dont `data` contient `message`. Le retour sera envoyé par `WsAdapter` au client demandeur. Ne sérialisez pas manuellement ce retour et n’ajoutez pas de diffusion.

### Vérifier l’étape · 4 min

Redémarrez le backend, reconnectez-vous et envoyez « Bonjour ». Dans le panneau réseau, relevez la demande puis la réponse avec ses trois champs. La liste peut encore être vide : les TODO de réception ne sont pas terminés.

## C — Recevoir et afficher · 20 min

### Lire la fiche de référence · 4 min

Distinguez événement natif, enveloppe applicative, décodage et contrôle de forme.

### TODO 5 · Décoder dans le `try` · 5 min

Dans `receiveMessage(event)`, remplacez `const response = undefined` : refusez une donnée dont le type n’est pas `string`, puis décodez `event.data` avec `JSON.parse`. Gardez le traitement fourni de `chat:error`.

Indice : pour faire passer une donnée non conforme dans le `catch`, utilisez `throw new Error('Texte attendu')`.

### TODO 6 · Contrôler et ajouter · 5 min

Appelez `isChatMessage(response)`. Si le résultat est faux, levez une erreur. Sinon, ajoutez `response.data` dans `messages.value`, puis annoncez la réception. Le composant fourni se met à jour grâce à la liste réactive. Aucune manipulation directe du DOM n’est nécessaire.

### TODO 7 · Protéger la suite · 3 min

Dans le `catch`, renseignez `notice.value` pour indiquer que la réponse invalide est ignorée. Conservez la liste existante. Ne relancez pas l’exception et ne fermez pas la connexion.

### Vérifier · 3 min

Envoyez un texte et observez son apparition. Ouvrez l’onglet Atelier, cliquez « JSON cassé » dans « Simuler une réponse reçue », puis revenez dans général et envoyez un deuxième texte réel. L’erreur doit être visible et la deuxième réponse doit s’ajouter normalement.

Ces boutons appellent localement le même gestionnaire avec des données brutes. Ils testent le décodage, mais ne constituent pas la preuve d’un aller-retour réseau.

## D — Tester et corriger · 15 min

Suivez `tests-et-validation.md` : 9 min de recette, 4 min de comparaison, 2 min de bilan. À rendre : les deux fichiers complétés, la matrice et une preuve de demande/réponse réseau accompagnée de l’affichage. Terminez en arrêtant les services avec Ctrl+C.
