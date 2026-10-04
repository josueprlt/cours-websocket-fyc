# Maîtriser le WebSocket au travers d’une application de messagerie instantanée
## Séquence 1 — Onboarding & positionnement

**Durée : 1 heure · Phase 1 : fondations · Niveau : initiation au temps réel**

Bienvenue ! Dans cette formation, vous allez transformer une interface de messagerie en application capable de faire circuler des messages entre plusieurs utilisateurs. Cette première séance sert à comprendre le projet et à préparer votre environnement. À la fin de l’heure, l’interface doit fonctionner sur votre ordinateur ; les échanges réseau du chat seront construits dans les séquences suivantes.

### 1. Ce que vous saurez faire

À l’issue de cette séquence, vous pourrez :

- raconter le trajet d’un message entre deux utilisateurs en identifiant le rôle du serveur ;
- expliquer l’intérêt d’une connexion WebSocket pour un chat ;
- distinguer une interface affichée à l’écran d’une application réellement connectée ;
- cloner le projet, installer ses dépendances et lancer le front en local ;
- repérer les connaissances JavaScript et HTTP à consolider.

**Critères de réussite :** l’interface s’affiche, une modification du titre apparaît dans le navigateur et vous savez expliquer pourquoi le bouton de démonstration n’envoie encore aucun message à un autre utilisateur.

### 2. Votre parcours pendant cette heure

| Temps | Activité | Résultat attendu |
|---|---|---|
| 00–03 min | Introduction vidéo ou présentation orale | Identifier le projet et l’objectif du jour |
| 03–08 min | Découverte de la maquette | Repérer les fonctions à construire |
| 08–18 min | QCM individuel de positionnement | Faire le point sur JavaScript et HTTP |
| 18–23 min | Correction et orientation | Choisir une notion à revoir |
| 23–35 min | Cours : du clic au message reçu | Comprendre le rôle du WebSocket |
| 35–53 min | Installation et exploration | Lancer le front Vue/Tailwind |
| 53–58 min | Vérification en binôme | Prouver le fonctionnement local |
| 58–60 min | Bilan de sortie | Formuler les acquis et les blocages |

**Avant la séance :** disposer d’un navigateur récent, d’un éditeur de code, de Git, de Node.js 24 LTS avec npm et d’un accès au dépôt donné par le formateur. L’installation de ces outils doit être anticipée pour garder l’atelier dans l’heure. Le QCM mesure vos acquis ; il ne vous demande aucune connaissance préalable du WebSocket.

### 3. Le projet : une messagerie qui prend vie progressivement

Imaginez que Camille et Alex ouvrent chacun l’application. Camille écrit « Bonjour ! ». Alex doit recevoir le message sans recharger sa page. Plus tard, ils pourront rejoindre des salons, utiliser des commandes et constater les effets d’une interruption réseau.

Le parcours complet représente **14 h 30** : 5 h de fondations, 6 h d’interactions temps réel et 3 h 30 d’extension et de déploiement.

| Étape | Évolution visible du projet |
|---|---|
| Séquence 1 | L’interface s’affiche sur votre ordinateur |
| Séquence 2 | Le serveur accepte une connexion |
| Séquence 3 | Un client envoie et reçoit des messages |
| Séquence 4 | Le serveur diffuse aux autres utilisateurs |
| Séquence 5 | L’interface réagit immédiatement et suit la confirmation serveur |
| Séquence 6 | Des commandes et une limitation anti-spam enrichissent le chat |
| Séquence 7 | Les conversations sont réparties dans des salons |
| Séquence 8 | Vous validez vos acquis et découvrez le déploiement |

**Aujourd’hui, la maquette contient trois messages fictifs.** Ils proviennent d’un tableau dans le code. Ils ne prouvent pas qu’un serveur de messagerie fonctionne. Le bouton « Envoyer (démo) » affiche uniquement une explication locale.

**Activité d’observation — 2 minutes.** Repérez la liste des messages, le champ de saisie, le bouton et l’indication de statut. Pour chacun, dites ce qui est purement visuel et ce qui nécessitera le serveur. Exemple : dessiner une bulle est une responsabilité de l’interface ; livrer son contenu à un autre navigateur nécessite une communication réseau.

### 4. Comprendre le trajet d’un message

#### 4.1 Client, serveur et réseau

Le **client** est ici le code exécuté dans le navigateur. Il affiche la conversation, recueille le texte saisi et réagit aux événements. Vue.js nous aide à faire évoluer l’interface quand les données changent. Tailwind CSS sert à la mise en forme.

Le **serveur de messagerie**, que nous construirons avec NestJS, reçoit les données des clients, les contrôle et décide à qui les transmettre. Le client de Camille ne connaît pas directement celui d’Alex : tous deux communiquent avec le serveur.

```text
Navigateur de Camille          Serveur de messagerie          Navigateur d’Alex
         |                              |                             |
         |------ « Bonjour ! » -------->|                             |
         |                              | contrôle le message         |
         |                              |------ « Bonjour ! » ------->|
         |                              |                             | affiche
```

Ce dessin est une vue simplifiée du comportement que vous construirez. Il suppose les connexions déjà établies. Les confirmations, erreurs et reconnexions seront ajoutées plus tard.

**Question de compréhension.** Si le navigateur d’Alex est fermé, suffit-il qu’un message soit envoyé pour qu’Alex le lise à son retour ? Non. Il faudra définir une stratégie de stockage et de récupération. Une connexion temps réel ne constitue pas un historique persistant.

#### 4.2 Le modèle HTTP que vous connaissez déjà

Dans un échange HTTP classique, le navigateur envoie une requête et le serveur renvoie une réponse. Par exemple, `GET /messages` peut demander une liste de messages. Le serveur répond avec un statut et des données. Le frontend peut demander ces données avec `fetch()` sans recharger toute la page.

Avec un **polling périodique**, le navigateur recommence la demande à intervalle régulier : « Y a-t-il du nouveau ? ». Même lorsqu’aucun message n’arrive, il continue à interroger le serveur.

```text
Client                     Serveur
  |---- des nouveautés ? ---->|
  |<--- aucune ---------------|
  |         attente           |
  |---- des nouveautés ? ---->|
  |<--- un message -----------|
```

**Exemple chiffré.** Avec 100 clients qui interrogent le serveur toutes les 3 secondes, on obtient environ 33 requêtes par seconde, même si la conversation est calme. Un message arrivé juste après une interrogation attendra presque 3 secondes avant la suivante, auxquelles s’ajoutent le réseau et le traitement.

Cela ne signifie pas qu’HTTP est inadapté au Web. Il convient très bien à de nombreuses opérations : charger une page, demander un profil ou consulter un historique. HTTP peut aussi utiliser des connexions persistantes : ne confondez pas une nouvelle requête avec l’ouverture systématique d’une nouvelle connexion TCP.

#### 4.3 Ce qu’apporte WebSocket

WebSocket permet une communication **bidirectionnelle** sur une connexion maintenue ouverte : après son établissement, client et serveur peuvent chacun envoyer des messages. Le serveur peut donc transmettre un nouveau message au client sans attendre son prochain sondage. Le protocole définit une ouverture de connexion, des échanges de données et une fermeture. Dans le cas classique HTTP/1.1 étudié ensuite, l’ouverture négocie un changement de protocole ; les en-têtes seront détaillés à la séquence 2. [Référence : RFC 6455](https://www.rfc-editor.org/rfc/rfc6455).

```text
Client                       Serveur
  |==== connexion établie ======|
  |------ message A ------------>|
  |<----- événement B -----------|
  |<----- événement C -----------|
  |------ message D ------------>|
```

Le terme « temps réel » désigne ici une expérience réactive. Il reste toujours un délai de transport et de traitement. Le Wi-Fi peut couper et le serveur peut redémarrer. Nous apprendrons à rendre ces situations compréhensibles dans l’interface.

| Besoin de l’application | Approche adaptée à notre projet |
|---|---|
| Charger l’interface | HTTP |
| Demander ponctuellement une ressource | Requête HTTP |
| Échanger fréquemment dans les deux sens | Connexion WebSocket |
| Retrouver les messages après un redémarrage | Stockage à concevoir séparément |

WebSocket transporte des données ; il ne fournit pas à lui seul les règles d’un chat. C’est notre code qui définira les destinataires, la validation, les confirmations et les autorisations. Un texte affiché dans une bulle ne prouve donc ni sa livraison ni sa lecture.

**Autre solution à connaître :** les Server-Sent Events permettent un flux du serveur vers le navigateur ; les envois du navigateur peuvent passer séparément par HTTP. Notre projet retient une communication bidirectionnelle. Vous n’avez pas à implémenter ni comparer ces solutions aujourd’hui.

#### 4.4 WebSocket et Socket.IO : deux niveaux distincts

**WebSocket est un protocole ; Socket.IO est une bibliothèque de communication événementielle.** Socket.IO peut s’appuyer sur WebSocket et ajoute ses propres conventions. Un client WebSocket natif ne dialogue pas directement avec un serveur Socket.IO. Les exercices de ce parcours utiliseront Socket.IO côté client et côté serveur. [Documentation Socket.IO](https://socket.io/docs/v4/).

Retenez simplement cette distinction. Aucun client réseau n’est à écrire pendant cette séance. Les termes `socket.id`, `broadcast.emit()` et `join()` rencontrés dans le programme appartiennent à l’API Socket.IO.

#### 4.5 À quoi ressemblera un message ?

Nous travaillerons avec des données structurées :

```js
const message = {
  author: 'Camille',
  content: 'Bonjour !',
  timestamp: '2026-09-30T09:00:00.000Z'
};
```

Cet objet JavaScript contient un auteur, un contenu et une date textuelle. Sa représentation JSON est :

```json
{
  "author": "Camille",
  "content": "Bonjour !",
  "timestamp": "2026-09-30T09:00:00.000Z"
}
```

`JSON.stringify(message)` produit une chaîne JSON ; `JSON.parse(texte)` reconstruit une valeur JavaScript à partir d’un JSON valide. Un objet JavaScript et du texte JSON ne sont donc pas la même chose. Avec Socket.IO, les objets usuels sont sérialisés par la bibliothèque ; on n’ajoutera pas systématiquement `JSON.stringify()` à chaque émission.

Cette structure est un exemple pédagogique, pas une preuve d’identité. Un client peut modifier les valeurs qu’il envoie. Le serveur devra appliquer ses propres contrôles ; l’horodatage validé sera traité à la séquence 5 et l’anti-spam à la séquence 6.

### 5. Atelier — Lancer votre interface en local

**Temps : 18 minutes. Travail individuel, entraide autorisée.** Vous devez obtenir l’interface « Le Salon », puis changer son titre. Ne créez pas un nouveau projet Vue : utilisez le squelette distribué.

#### Étape A — Vérifier les outils · 2 minutes

Ouvrez un terminal et exécutez séparément :

```sh
node --version
npm --version
git --version
```

Les trois commandes doivent afficher une version. Le poste de formation cible **Node.js 24 LTS**. Le projet livré exige au minimum Node.js 22.12 ; utilisez la version commune au groupe pour faciliter le dépannage. [Versions de Node.js](https://nodejs.org/en/about/previous-releases) · [Prérequis Vite](https://vite.dev/guide/).

Si une commande est introuvable, signalez-le immédiatement. Fermez et rouvrez le terminal après une installation récente. Si nécessaire, rejoignez temporairement un binôme et notez le blocage ; la validation individuelle de l’installation sera reprise ensuite.

#### Étape B — Cloner le dépôt · 3 minutes

Le formateur fournit l’adresse réelle du dépôt. Remplacez `URL_DU_DEPOT` par cette adresse ; ce texte est un emplacement à compléter.

```sh
git clone URL_DU_DEPOT messagerie-websocket
cd messagerie-websocket
```

Le dépôt formateur doit avoir le contenu du dossier `front-statique` à sa racine. Vous devez donc voir `package.json`, `package-lock.json`, `index.html` et `src/` immédiatement après le clonage.

**Pour cloner le dépôt local livré avec ce kit**, décompressez l’archive, ouvrez un terminal dans le dossier `sequence-1` qui contient `front-statique.bundle`, puis exécutez :

```sh
git clone front-statique.bundle messagerie-websocket
cd messagerie-websocket
```

Ce clonage fonctionne sans hébergement Git distant ; le téléchargement des dépendances à l’étape suivante exige encore un accès réseau.

**Autre solution avec l’archive :** ouvrez directement un terminal dans `sequence-1/front-statique`. Cela permet l’atelier local, mais ne valide pas la compétence « cloner un dépôt ».

#### Étape C — Installer et lancer · 5 minutes

À la racine du front :

```sh
npm ci
npm run dev
```

`npm ci` installe les versions décrites dans le fichier de verrouillage. `npm run dev` démarre le serveur de développement Vite. Gardez le terminal ouvert.

Ouvrez **l’adresse affichée par Vite**, généralement `http://127.0.0.1:5173`. Le port peut changer si 5173 est déjà occupé. Ne lancez pas le projet en double-cliquant sur `index.html`.

Le serveur Vite sert les fichiers du frontend et facilite le développement. **Ce n’est pas le futur serveur de messagerie NestJS.** Une page accessible en local ne signifie donc pas qu’un chat réseau est déjà disponible.

#### Étape D — Explorer et modifier · 5 minutes

| Fichier | Utilité |
|---|---|
| `package.json` | Dépendances et commandes du projet |
| `package-lock.json` | Versions résolues pour une installation reproductible |
| `index.html` | Page d’entrée du navigateur |
| `src/main.js` | Démarrage de Vue et chargement des styles |
| `src/App.vue` | Interface, messages fictifs et comportement local du formulaire |
| `src/style.css` | Import de Tailwind et styles globaux |
| `vite.config.js` | Configuration de Vue et Tailwind dans Vite |

1. Ouvrez `src/App.vue` et trouvez `const projectTitle = 'Le Salon';`.
2. Remplacez seulement `Le Salon` par `Le Salon de votre prénom` et enregistrez.
3. Vérifiez que le titre change dans le navigateur.
4. Repérez le tableau `messages`. Combien d’objets contient-il ?
5. Saisissez un texte et cliquez sur « Envoyer (démo) ». Lisez le retour affiché.

Vous venez de vérifier que vous modifiez le bon projet et que Vue se recharge. Le formulaire réagit localement mais ne transmet rien au serveur de chat, puisqu’il n’existe pas encore.

**Observation utile.** Vite utilise lui-même une connexion WebSocket pour son rechargement à chaud. Si vous en voyez une dans l’onglet Réseau du navigateur, ce n’est pas la connexion métier de notre messagerie.

#### Étape E — Faire votre preuve de fonctionnement · 3 minutes

Renseignez ce relevé dans votre espace de travail ou dans le LMS :

```text
Prénom :
Version de Node.js :
Adresse locale affichée par Vite :
Titre personnalisé visible :
Fichier contenant les messages fictifs :
Pourquoi mon texte n’est-il pas reçu dans un autre navigateur ?
Blocage éventuel et message d’erreur exact :
```

Vous pouvez joindre une capture de l’interface personnalisée. Pour arrêter Vite : revenez au terminal et utilisez `Ctrl+C`. Pour le redémarrer : `npm run dev` dans le même dossier.

### 6. Dépannage rapide

| Symptôme | Vérification et action |
|---|---|
| `node` ou `npm` introuvable | Vérifier l’installation de Node et rouvrir le terminal |
| `git` introuvable | Installer Git avec l’aide du formateur ; utiliser l’archive en dépannage |
| `Repository not found` ou accès refusé | Vérifier l’URL et les droits d’accès au dépôt |
| `ENOENT … package.json` | Revenir dans le dossier qui contient `package.json` |
| `npm ci` signale un verrouillage incohérent | Demander la bonne version du dépôt au formateur ; ne pas supprimer le verrouillage au hasard |
| `ENOTFOUND`, délai dépassé ou erreur de proxy | Vérifier le réseau et le proxy de l’établissement ; transmettre l’erreur exacte |
| Avertissement de version Node | Utiliser Node 24 LTS comme le groupe |
| La page ne s’ouvre pas | Vérifier que Vite tourne et copier l’adresse exacte du terminal |
| Le titre ne change pas | Enregistrer le bon `App.vue` et vérifier le dossier du terminal |
| Le message ne part pas | Comportement normal de la séquence 1 : l’envoi est une démonstration locale |

Ne cherchez pas à résoudre une panne d’installation en modifiant au hasard les versions des dépendances. Une erreur est une information : relevez la commande lancée, le dossier courant et les premières lignes significatives du message.

### 7. Vérifier vos acquis

Pendant les cinq minutes de vérification, montrez votre interface à un binôme, puis échangez les rôles. Chacun doit expliquer :

1. Le fichier qu’il a modifié et le résultat visible.
2. Le rôle du client et celui du futur serveur.
3. L’intérêt d’une connexion persistante pour recevoir de nouveaux messages.
4. La raison pour laquelle les messages actuels sont fictifs.

**Bilan de sortie — 2 minutes.** Complétez ces trois phrases :

- « Pour transmettre un message de Camille à Alex, le serveur doit… »
- « Mon interface fonctionne en local, mais il manque encore… »
- « Avant la prochaine séance, je dois revoir… / je suis prêt à… »

**Vous êtes prêt pour la séquence 2** si le front démarre et si vous distinguez affichage local et transmission réseau. Si une de ces conditions manque, identifiez le blocage avec le formateur et conservez les éléments utiles au dépannage.

### 8. Fiche mémo

- **Client :** affiche, collecte les saisies et réagit aux données reçues.
- **Serveur :** reçoit, contrôle et distribue selon les règles de l’application.
- **HTTP :** requêtes et réponses, utiles notamment au chargement et aux demandes ponctuelles.
- **Polling :** demandes répétées à intervalle régulier.
- **WebSocket :** connexion permettant des échanges dans les deux sens après ouverture.
- **Socket.IO :** bibliothèque retenue dans les exercices ; ses API diffèrent du WebSocket natif.
- **JSON :** format textuel de données structurées.
- **Localhost / 127.0.0.1 :** votre propre ordinateur ; cette adresse ne désigne pas le poste du voisin.
- **Port :** numéro identifiant un point d’écoute sur une machine.
- **Dépendance :** paquet logiciel utilisé par le projet.

Pour approfondir après la séance : [guide Vue](https://vuejs.org/guide/quick-start.html), [guide Vite](https://vite.dev/guide/), [intégration Tailwind avec Vite](https://tailwindcss.com/docs/installation/using-vite), [API WebSocket sur MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). Ces lectures sont facultatives ; elles ne s’ajoutent pas au travail obligatoire de l’heure.
