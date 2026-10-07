# TP guidé — Brancher et piloter la connexion

Vous utilisez le projet apprenant livré. Consultez le corrigé après vos essais. Les six TODO se trouvent dans **`frontend/src/useConnection.js`** ; le backend et l’interface sont fournis.

## Préparer le poste — inclus dans les 10 minutes de repérage

Le poste Node 24 et les outils ont été préparés en S1. Arrêtez les anciens services S1 pour libérer 3000 et 5173. Ouvrez un terminal dans `projet`, puis :

```sh
npm ci
npm run dev:back
```

Dans un second terminal, dans le même dossier racine :

```sh
npm run dev:front
```

Ouvrez `http://127.0.0.1:5173`. Le badge indique « Non connecté ». Au départ, Connecter affiche une consigne : le premier TODO contient un `return` temporaire qu’il faudra remplacer.

**Si vous continuez votre dépôt S1 :** conservez une copie de votre travail, remplacez `frontend/src/App.vue` par l’écran S2 fourni et ajoutez `frontend/src/useConnection.js` depuis le projet apprenant. Vous pouvez aussi reprendre le `frontend/index.html` S2 pour le titre de page. Aucune dépendance ou configuration backend ne change. Les données fictives et le formulaire de S1 seront repris en S3 ; S2 utilise un écran ciblé sur la connexion.

## Repérage — 10 minutes avec la vidéo

| Élément fourni | Rôle |
|---|---|
| `url` | Adresse saisie dans le champ |
| `socket` | Objet technique conservé entre les clics |
| `readyState` | Copie réactive de l’état pour l’interface |
| `information` | Retour textuel destiné à l’utilisateur |
| `record()` | Ajout d’une observation au journal |
| `canConnect`, `canClose` | Activation des boutons selon l’état |
| `onOpen`, `onError`, `onClose` | Gestionnaires à compléter |

Le test au début de `connect()` empêche de créer une seconde connexion tant que la précédente n’est pas fermée. Les écouteurs de l’ancienne connexion sont retirés avant une nouvelle tentative. Le code de nettoyage est fourni : concentrez-vous sur les six TODO.

## Partie A — Connecter le navigateur · 25 minutes

### TODO 1 · Instancier le client · environ 5 min

Dans le `try`, remplacez **les deux lignes temporaires** :

```js
information.value = 'TODO 1 : instancier WebSocket dans useConnection.js.';
return;
```

par la construction native affectée à `current`, en utilisant `url.value` comme adresse. Ne créez pas un client Socket.IO. Ne mettez pas `await` devant le constructeur.

**Résultat intermédiaire :** le navigateur peut tenter une ouverture, même si votre indicateur n’est pas encore synchronisé. Les autres TODO restent nécessaires.

### TODO 2 · Reporter l’état initial · environ 4 min

Après `socket = current`, affectez l’état courant du nouvel objet à `readyState.value`.

**Indice :** le nom de la propriété est le même sur l’objet natif, mais la donnée Vue utilise `.value`.

**Résultat attendu :** une ligne `construction` avec l’état 0 apparaît. Cette ligne ne prouve pas encore l’ouverture.

### TODO 3 · Traiter l’ouverture · environ 6 min

Dans `onOpen()` :

1. Recopiez l’état courant de `current` dans `readyState.value`.
2. Affectez à `information.value` un texte signalant l’ouverture.
3. Conservez l’appel `record('open')` fourni.

**Résultat attendu :** le badge indique « Connecté », l’état observé vaut 1 et le journal contient `open`. Le bouton Connecter devient indisponible et Déconnecter disponible. Il ne fermera réellement la connexion qu’après TODO 6.

### TODO 4 · Traiter une erreur · environ 5 min

Dans `onError()`, renseignez un texte qui invite à vérifier l’adresse et le serveur. Ne prétendez pas connaître la cause exacte et n’ajoutez pas une valeur numérique inventée pour `ERROR`.

Le gestionnaire `close` sera terminé dans la partie B. Tant qu’il manque, un échec peut laisser un badge incomplet : c’est une étape de réalisation, pas le comportement final attendu.

### Vérification réseau ciblée · environ 3 min

Après sauvegarde, si nécessaire rechargez la page pour repartir sans tentative active. Ouvrez Réseau dans les outils du navigateur, puis cliquez sur Connecter. Sélectionnez la connexion vers `127.0.0.1:3000/chat`.

Relevez :

```text
URL de la connexion métier :
Statut de l’ouverture HTTP/1.1 :
En-tête signalant le protocole demandé :
Événement ajouté dans le journal :
```

### Point d’étape · environ 2 min

Expliquez pourquoi le texte « Connecté » se trouve dans `onOpen()` plutôt que juste après le constructeur. Si le navigateur ne se connecte pas, vérifiez `/health`, l’adresse 3000/chat et le terminal backend.

## Partie B — État final et fermeture · 20 minutes

### Lire la fiche et prévoir le comportement · environ 4 min

Ouvrez `fiche-reference.md`. Anticipez les deux observations qui suivront un clic sur Déconnecter : demande de fermeture, puis événement de fermeture.

### TODO 5 · Traiter `close` · environ 7 min

Complétez `onClose(event)` pour :

1. Recopier l’état courant du socket dans `readyState.value`.
2. Afficher une information de fermeture, éventuellement différente selon `event.wasClean`.
3. Appeler `record('close', détail)` avec `event.code`, `event.reason` et `event.wasClean` dans le détail.

Le journal doit conserver un motif vide comme une absence d’information, pas le transformer en « serveur arrêté ». À la fin, l’état vaut 3 et une nouvelle ouverture manuelle est possible.

**Indice progressif :** commencez par enregistrer le code ; ajoutez ensuite la raison et `wasClean` pour aider le diagnostic. Aucun décodage JSON n’est nécessaire.

### TODO 6 · Fermer volontairement · environ 6 min

Dans `disconnect()` :

1. Demandez une fermeture normale avec le code 1000 et une raison courte.
2. Copiez aussitôt l’état courant de `socket` dans `readyState.value`.
3. Conservez le message et la ligne de journal fournis.

N’affectez pas directement `CLOSED` pour faire disparaître le badge : attendez l’événement qui confirme la fermeture. N’utilisez aucun temporisateur.

### Vérifier le parcours nominal · environ 3 min

Connecter → `open` → Déconnecter → `close`. La transition 2 peut être visuellement très brève : le journal en garde la trace. Attendez ensuite quelques secondes ; aucune reconnexion ne doit se produire sans clic.

## Partie C — Tester et corriger · 20 minutes

Réalisez les cinq scénarios de `tests-et-validation.md` puis comparez votre solution au corrigé. Vous pouvez redémarrer manuellement après un échec ; n’ajoutez pas de reprise automatique.

**À rendre :** le fichier complété, la matrice renseignée, votre relevé réseau et les réponses de bilan. Gardez les deux services pour les essais, puis arrêtez-les avec `Ctrl+C`.
