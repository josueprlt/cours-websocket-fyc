# Guide formateur — Séquence 1 : Onboarding & positionnement

**Format : séance accompagnée de 60 minutes, en présentiel ou à distance.** Public supposé : apprenants ayant déjà manipulé HTML/CSS et les bases de JavaScript. Le support ne suppose aucune pratique préalable de NestJS ou de WebSocket. Les bases de Vue peuvent être présentées au fil du projet ; elles ne conditionnent pas le diagnostic JavaScript/HTTP.

## 1. Livrables et préparation

Le kit contient un cours apprenant, un QCM sans réponses, ce guide avec corrigé et script vidéo, et un front Vue/Tailwind. Le script est prêt à enregistrer ; aucun fichier vidéo n’est inclus. Le front est livré sous forme de fichiers et d’un bundle Git local, sans dépôt distant publié.

À préparer avant la séance :

- Communiquer les prérequis matériels et logiciels au moins la veille : Node 24 LTS, npm, Git, navigateur, éditeur et réseau.
- Restaurer le bundle ou placer le contenu du dossier `front-statique` à la racine du dépôt de formation. Fournir ensuite l’URL réelle aux apprenants. Ne pas leur transmettre littéralement `URL_DU_DEPOT`.
- Vérifier avec un compte apprenant que le dépôt est accessible et que `npm ci`, puis `npm run dev`, fonctionnent sur le réseau du lieu.
- Prévoir l’archive comme solution de secours et un binôme pour les blocages d’installation.
- Distribuer uniquement le cours, le QCM et le front aux apprenants avant le diagnostic ; conserver le corrigé et ce guide.
- Enregistrer l’introduction avec le script ci-dessous, ou la présenter en direct pendant le même créneau de trois minutes.

**Préparation hors temps apprenant :** l’installation de Node/Git et la publication éventuelle du dépôt ne sont pas incluses dans les 60 minutes. Un groupe débutant aussi sur le terminal aura besoin d’un créneau technique préalable.

## 2. Décision technique pour rendre le parcours cohérent

Le plan mélange l’API WebSocket native et Socket.IO. Ce kit explique le protocole WebSocket et retient **NestJS + Socket.IO** comme trajectoire pratique, car le programme utilise `socket.id`, `socket.broadcast.emit()` et `socket.join()`.

| Élément du programme | Ajustement à appliquer aux prochaines séquences |
|---|---|
| Événements `onopen`, `onmessage`, `onclose` en S3 | Les présenter comme API native en comparaison ; dans le projet Socket.IO utiliser `connect`, un événement métier tel que `chat:message`, et `disconnect` |
| Connexion du frontend en S3 | Employer `socket.io-client` avec le serveur Socket.IO, pas `new WebSocket()` |
| Reconnexion manuelle toutes les 3 secondes | Pour cet exercice imposé, désactiver `reconnection` de Socket.IO ; n’avoir qu’un seul intervalle et l’arrêter à la connexion ou au démontage du composant |
| Port dédié en S2 | Le conserver comme choix pédagogique ; NestJS peut aussi partager le port HTTP |

NestJS accepte plusieurs adaptateurs WebSocket : le nom `WebSocketGateway` ne garantit pas à lui seul l’usage du protocole natif sans bibliothèque. Voir les [gateways NestJS](https://docs.nestjs.com/websockets/gateways). Pour la reconnexion, consulter les [options du client Socket.IO](https://socket.io/docs/v4/client-options/#reconnection).

Si l’objectif devient ultérieurement « tout faire en WebSocket natif », il faudra adapter les exercices de diffusion, identifiants et salons ; les API Socket.IO ne pourront pas être reprises telles quelles. Aucune de ces fonctions avancées n’est introduite dans le starter de la séquence 1.

## 3. Déroulé d’animation — exactement 60 minutes

| Créneau | Animation et consigne | Observation / régulation |
|---|---|---|
| 00–03 | Lire ou diffuser l’introduction. Annoncer : « À la fin, le front fonctionne chez vous et vous savez expliquer ce qu’il reste à connecter. » | Faire identifier le résultat attendu, sans promettre un chat fonctionnel dès cette heure |
| 03–08 | Montrer la maquette : 1 min de visite, 2 min de repérage individuel, 2 min de partage. Demander quels éléments nécessiteront le serveur. | Réponse attendue : l’affichage existe ; transmission, validation et diffusion restent à construire |
| 08–18 | Distribuer le QCM de 12 questions. Travail individuel, sans exécuter le code. | Relever les hésitations ; ne pas corriger pendant le test |
| 18–23 | Afficher la grille de réponses, laisser 1 min d’auto-correction, commenter les 2 erreurs les plus fréquentes pendant 3 min, faire noter 1 priorité de révision pendant 1 min. | Ne pas lire les 12 explications à voix haute ; les fournir ensuite |
| 23–35 | 3 min sur client/serveur, 3 min sur HTTP et polling, 3 min sur WebSocket, 2 min sur la distinction Socket.IO et 1 min de reformulation. | Utiliser les schémas du cours et l’exemple « Camille envoie à Alex » |
| 35–53 | Atelier guidé : outils 2 min, clonage 3 min, installation 5 min, exploration 5 min, relevé 3 min. | À la 43e minute, repérer les installations bloquées et proposer un binôme |
| 53–58 | Démonstration par binômes, environ 2 min chacun, puis 1 min pour compléter les preuves. | Vérifier le titre modifié et l’explication de l’absence d’envoi |
| 58–60 | Trois phrases de bilan. Recueillir un blocage ou une notion à revoir. Annoncer l’ouverture du serveur en séquence 2. | Classer les besoins de suivi, sans lancer le backend |

**En distanciel :** demander une preuve écrite dans le chat ou le LMS et utiliser des binômes en sous-salles si disponibles. En autonomie, remplacer les échanges par les mêmes questions écrites ; fournir le corrigé seulement après soumission du QCM. Garder une possibilité de retour formateur pour les erreurs d’installation.

## 4. Notes pour expliquer les notions

### Partir de ce que l’apprenant voit

Montrez le champ de saisie et demandez : « Qu’est-ce qui doit se passer après le clic pour qu’une autre personne voie ce texte ? » Faites apparaître trois responsabilités : collecter dans le navigateur, traiter sur le serveur, afficher chez le destinataire. La couleur des bulles est secondaire ; le trajet des données constitue le fil conducteur.

### Faire comprendre le polling sans caricaturer HTTP

Dessinez trois requêtes successives. Placez un nouveau message juste après la première réponse. L’apprenant voit pourquoi il attend la prochaine interrogation. Évitez « HTTP ouvre une connexion à chaque message » et « HTTP oblige à recharger la page » : ces deux généralisations sont fausses.

### Faire reformuler WebSocket

Formulation attendue : « Après ouverture, la connexion permet au client et au serveur d’échanger des messages dans les deux sens. » N’exigez ni le mot handshake ni les en-têtes HTTP aujourd’hui. Le détail TCP et l’ouverture appartiennent à la séquence 2.

### Désamorcer trois malentendus

- « Temps réel » ne signifie pas absence de délai.
- Une bulle affichée localement ne prouve pas que quelqu’un a reçu le message.
- Une connexion ne remplace pas les règles applicatives ou le stockage.

Lors de l’atelier, dites explicitement que Vite est un serveur de développement. Sa connexion WebSocket de rechargement à chaud est indépendante de la messagerie. Ne demandez pas aux apprenants de prouver l’absence de toute connexion WebSocket dans l’onglet Réseau.

## 5. Vidéo d’introduction — script prêt à enregistrer

**Durée cible : 2 min 40 à 2 min 55, à confirmer par une lecture chronométrée avant enregistrement.** Environ 337 mots de voix off, avec de courtes pauses pour lire l’écran. Une capture de la maquette et des schémas simples suffisent. Prévoir des sous-titres relus et fournir le texte comme transcription accessible.

| Repère indicatif | Visuel | Voix off |
|---|---|---|
| 00:00–00:25 | Titre de la formation, puis maquette du chat | « Bienvenue dans cette formation consacrée aux échanges en temps réel. Notre fil rouge sera une application de messagerie instantanée. Imaginez : vous écrivez un message, vous cliquez sur Envoyer, et une autre personne le voit apparaître sans recharger sa page. Nous allons construire ce fonctionnement, étape par étape, en comprenant ce qui se passe entre les navigateurs et le serveur. » |
| 00:25–00:50 | Deux navigateurs reliés à un serveur | « Une interface ne suffit pas pour faire circuler les messages. Le navigateur recueille votre saisie. Le serveur reçoit les données, les contrôle et les transmet aux bons destinataires. Pour ces échanges fréquents dans les deux sens, nous découvrirons WebSocket, puis nous utiliserons Socket.IO dans notre projet Vue et NestJS. Nous apprendrons à distinguer le protocole de la bibliothèque. » |
| 00:50–01:20 | Parcours en trois étapes : connecter, enrichir, étendre | « Au fil des séquences, vous connecterez le client, diffuserez les messages et observerez les effets de la latence. Vous ajouterez ensuite des commandes, une protection contre les envois trop fréquents et plusieurs salons de discussion. Le projet servira aussi à comprendre ce qui arrive quand le réseau coupe : une application réactive doit savoir expliquer ses états et gérer ses erreurs. » |
| 01:20–01:50 | Zoom sur le badge Mode statique | « Aujourd’hui, notre objectif est plus simple : préparer le terrain. Vous découvrirez le projet, vérifierez vos bases en JavaScript et en HTTP, puis lancerez l’interface sur votre ordinateur. Les messages que vous voyez ici sont fictifs. Le bouton de démonstration ne transmet encore rien à un autre utilisateur. C’est normal : nous construirons le serveur à la prochaine séance. » |
| 01:50–02:20 | Terminal, éditeur et navigateur | « Commencez par le questionnaire de positionnement. Il sert à identifier les notions à revoir, sans vous pénaliser. Vous récupérerez ensuite le projet, installerez ses dépendances et démarrerez le frontend. Votre première preuve de réussite sera concrète : afficher l’interface, modifier son titre et constater le résultat dans le navigateur. » |
| 02:20–02:50 | Trois objectifs à l’écran | « À la fin de cette heure, vous devrez pouvoir expliquer le rôle du client, celui du serveur et l’intérêt d’une connexion WebSocket. Si une commande bloque, gardez son message d’erreur et demandez de l’aide. Préparez votre terminal et votre éditeur : nous commençons par faire le point sur vos acquis. » |

Les minutages sont des repères de montage, pas le résultat d’un enregistrement déjà réalisé. Si la lecture dépasse trois minutes, raccourcir les pauses ou la présentation des futures fonctionnalités ; ne pas accélérer au détriment de l’intelligibilité.

## 6. Corrigé expliqué du QCM

| Nº | Réponse | Explication et erreur à repérer |
|---|---|---|
| 1 | B | `message.content` lit la propriété `content`. A lit l’auteur ; C suppose à tort un tableau ; D inverse objet et propriété. |
| 2 | C | `const` interdit la réaffectation de la variable, pas la mutation de l’objet ou du tableau référencé. `push` ajoute un élément. |
| 3 | A | `trim()` retire les espaces aux extrémités. La fonction fléchée à expression renvoie implicitement son résultat. |
| 4 | D | `map()` construit un tableau contenant le résultat de chaque appel ; il ne joint pas les valeurs en chaîne. |
| 5 | B | `stringify` produit une chaîne JSON ; `parse` fait le trajet inverse à partir d’un texte valide. |
| 6 | C | Le code synchrone affiche A puis C. Le callback de `setTimeout` s’exécute ensuite ; un délai de zéro ne le rend pas synchrone. |
| 7 | A | `response.json()` lit le corps et renvoie une promesse de sa conversion ; `await` attend cette opération. Un statut HTTP reste à vérifier séparément. |
| 8 | D | On transmet la fonction comme callback. Écrire `envoyer()` à cet endroit l’appellerait immédiatement. |
| 9 | B | GET demande une représentation de la ressource ciblée. Cela ne crée pas à lui seul un canal de chat bidirectionnel. |
| 10 | C | 404 indique une ressource non trouvée. Le serveur a bien envoyé une réponse ; ce n’est pas synonyme de panne réseau. |
| 11 | A | Le code Vue de cette application s’exécute dans le navigateur. Le dépôt conserve le code, mais ne l’exécute pas chez l’utilisateur. |
| 12 | D | Le port désigne le point d’écoute visé sur l’hôte local ; il ne décrit ni un utilisateur ni un quota. |

**Lecture du score — orientation pédagogique proposée :**

- **10 à 12 :** bases solides ; réaliser l’atelier et éventuellement l’activité bonus.
- **7 à 9 :** poursuivre avec une révision ciblée des questions manquées.
- **0 à 6 :** prévoir un accompagnement et une courte remise à niveau avant le code réseau ; démarrer l’atelier en binôme.

Consigner aussi le sous-score JavaScript sur 8 et HTTP sur 4. Un total seul peut masquer une lacune : avec 0 ou 1 sur 4 en HTTP, reprendre impérativement le schéma requête/réponse ; avec des erreurs sur les questions 6 à 8, revoir callbacks et asynchronisme avant la séquence 3. Ces seuils sont des choix d’animation, pas une mesure psychométrique validée.

## 7. Remédiations ciblées — après la séance si nécessaire

Ne pas ajouter ces activités aux 60 minutes pour tout le groupe. Les attribuer selon les erreurs, avec retour du formateur avant les exercices qui en dépendent.

| Difficulté | Micro-activité de 5 à 10 min | Réponse / preuve attendue |
|---|---|---|
| Objets et tableaux, Q1–4 | Créer un tableau de deux messages, ajouter un troisième, puis extraire leurs contenus avec `map`. | Tableau final de trois chaînes ; expliquer pourquoi `const` autorise `push`. |
| JSON, Q5 | Transformer `{ author: 'Lina' }` en chaîne, puis reconvertir cette chaîne. | `typeof` vaut `string` pour le texte et `object` pour l’objet reconstruit. |
| Asynchronisme, Q6–8 | Rejouer l’extrait A/B/C ; remplacer le délai par 1000 et expliquer l’ordre. | A et C restent avant B ; le délai ne bloque pas la suite synchrone. |
| HTTP, Q9–10 | Dessiner `GET /profil` et une réponse 200 ; proposer une réponse si la ressource n’existe pas. | Requête du client, réponse du serveur, distinction entre 200 et 404. |
| Architecture et outils, Q11–12 | Associer navigateur, serveur, dépôt Git et port à leur rôle. | Expliquer que `localhost` désigne le poste utilisé, pas celui du voisin. |

**Bonus pour les plus rapides :** modifier le contenu d’un message fictif et expliquer pourquoi cette modification dans le fichier n’est pas un envoi réseau du chat. Ne pas commencer une connexion Socket.IO en avance : cela brouillerait la validation de l’étape statique.

## 8. Validation et suivi individuel

| Critère | Preuve | Statut |
|---|---|---|
| Positionnement effectué | 12 réponses ou blancs assumés, score JS/HTTP et priorité de révision | Réalisé / à reprendre |
| Récupération du projet | Clonage réussi ; noter séparément si seul le ZIP a été utilisé | Acquis / à accompagner |
| Exécution locale | URL Vite accessible et interface affichée | Acquis / bloqué |
| Modification du code | Titre personnalisé visible | Acquis / à accompagner |
| Compréhension de l’architecture | Décrit client → serveur → destinataire | Acquis / à revoir |
| Compréhension du temps réel | Explique l’intérêt de recevoir sans sondage périodique | Acquis / à revoir |
| Compréhension du mode statique | Identifie les données fictives et l’absence de backend métier | Acquis / à revoir |

**Sortie attendue :** installation fonctionnelle et distinction client/serveur comprise. Un problème réseau de l’établissement ne constitue pas une lacune JavaScript : consigner les deux séparément. La reprise du clonage reste nécessaire si seule l’archive a été utilisée.

**Réponses attendues au bilan :** le serveur reçoit, contrôle et distribue ; il manque le serveur métier et la connexion du client ; la priorité de révision doit être une notion précise ou un blocage technique documenté.

Phrase de transition : « Notre interface est prête. À la prochaine séance, nous allons donner au serveur un point d’entrée pour accepter les connexions et observer l’arrivée d’un client. »
