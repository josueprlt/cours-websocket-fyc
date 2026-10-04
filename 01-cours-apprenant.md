# Séquence 1 — Comprendre pourquoi une messagerie utilise WebSocket

**Formation : Maîtriser le WebSocket au travers d’une application de messagerie instantanée**  
**Durée : environ 45 minutes · WebSocket natif · Version révisée**

À la fin de cette séquence, vous saurez expliquer pourquoi notre messagerie utilise WebSocket et vous disposerez d’un frontend et d’un backend démarrés sur votre ordinateur. Vous n’avez pas encore à programmer une connexion : ce sera l’objectif de la séquence 2.

## Votre parcours dans cette séquence

| Étape | Durée | Travail attendu |
|---|---:|---|
| Découvrir le cours | 5 min | Visionner la présentation et observer la messagerie cible |
| Vérifier les prérequis | 10 min | Répondre au QCM puis lire la correction de vos erreurs |
| Comprendre le choix de WebSocket | 15 min | Lire le cours, suivre la courte vidéo et compléter le schéma |
| Lancer le projet | 15 min | Installer les dépendances, démarrer les deux services et remplir la checklist |

**Prérequis matériels :** Node.js 24, npm, Git, un éditeur et un navigateur installés avant la séance. La connaissance de JavaScript, des événements et des échanges HTTP sera vérifiée par le QCM.

## 1. Ce que vous allez construire

Camille et Alex ouvrent chacun la messagerie dans leur navigateur. Camille écrit « On se retrouve dans le salon #dev ? ». Alex voit le message apparaître sans recharger sa page. Il répond ; Camille voit la réponse. Si le réseau coupe, l’interface l’indique. Lorsqu’un envoi est confirmé, l’utilisateur sait que le serveur l’a traité. Si le message est invalide ou trop fréquent, le serveur le refuse.

Ce comportement se construira progressivement :

| Séquence | Résultat dans le projet |
|---|---|
| S1 · 45 min | Environnement démarré et choix de WebSocket compris |
| S2 · 1 h 30 | Connexion native ouverte, état affiché, fermeture comprise |
| S3 · 1 h 30 | Aller-retour d’un message entre navigateur et serveur |
| S4 · 1 h 30 | Discussion entre plusieurs utilisateurs |
| S5 · 2 h | Reconnexion et résultat des envois affiché |
| S6 · 2 h | Validation des messages et limitation des abus |
| S7 · 1 h 30 | Salons #general et #dev, puis recette de la messagerie |
| Évaluation et conclusion · 45 min | QCM final, correction et bilan |

Le parcours représente **environ 11 h 30**. Le frontend Vue et le socle NestJS sont fournis pour concentrer votre travail sur WebSocket. Aucun déploiement n’est demandé.

## 2. Le problème à résoudre : recevoir au bon moment

Pour Camille, envoyer un message semble simple : cliquer sur un bouton. Pour Alex, la situation est différente : son navigateur doit afficher un message dont il ne connaît pas à l’avance l’heure d’arrivée.

Un bouton ne résout pas ce problème. Le serveur doit disposer d’un moyen de prévenir le navigateur d’Alex, puis ce navigateur doit réagir à l’arrivée des données. C’est la question centrale de cette séquence : **comment faire parvenir une nouveauté à un navigateur sans lui demander d’actualiser la conversation en permanence ?**

Gardez trois rôles distincts :

- **Le navigateur de Camille** recueille sa saisie et déclenche l’envoi.
- **Le serveur** reçoit les données et décide des destinataires.
- **Le navigateur d’Alex** reçoit les données puis met à jour son interface.

Le WebSocket fournit un canal de communication. Il ne dessine pas la bulle du message et ne décide pas à lui seul à quel salon elle appartient.

## 3. Première possibilité : demander régulièrement en HTTP

### Une requête obtient une réponse

Dans un échange HTTP classique, le client demande une ressource et le serveur répond. Le navigateur pourrait demander la liste des nouveaux messages avec une requête `GET /messages`. Cela peut se faire en JavaScript sans recharger la page entière. HTTP peut aussi réutiliser une connexion : une requête supplémentaire ne signifie pas nécessairement une nouvelle connexion réseau. [Comprendre HTTP — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview).

Supposons que le serveur réponde à Alex : « Aucun nouveau message ». Une seconde plus tard, Camille écrit. La réponse précédente est terminée : pour connaître la nouveauté avec ce fonctionnement, Alex doit lancer une autre demande.

### Le polling : interroger à intervalle régulier

On peut automatiser ces demandes, par exemple toutes les trois secondes. C’est le **polling périodique**.

```text
Temps        Navigateur d’Alex                  Serveur
0 s          ── « Du nouveau ? » ───────────────>
             <────────────────────── « Non » ──
1 s                                             Reçoit « Bonjour » de Camille
2 s          Alex attend encore…
3 s          ── « Du nouveau ? » ───────────────>
             <──────────────── « Bonjour » ────
             Affiche le message
```

Dans cet exemple, le délai ajouté par l’attente du prochain sondage est de deux secondes. Il dépend du moment où le message arrive : de presque zéro à presque trois secondes, auxquels s’ajoutent transport et traitement.

Diminuer l’intervalle réduit l’attente, mais multiplie les demandes. Pour 100 navigateurs interrogeant toutes les trois secondes, on obtient environ **100 / 3 = 33 requêtes par seconde**, même si personne ne parle. Ce calcul ne mesure pas à lui seul la charge totale du serveur ; il montre le coût des interrogations répétées.

Le polling reste utilisable pour une information qui change rarement. Pour une conversation animée, nous cherchons un mécanisme qui permette de transmettre la nouveauté dès qu’elle est disponible.

## 4. WebSocket : établir un canal puis échanger

### Une connexion persistante

Avec WebSocket, le navigateur commence par demander l’ouverture d’une connexion au serveur. Une fois cette ouverture acceptée, les deux côtés disposent d’un canal pour échanger. **Persistante** signifie que la connexion peut être conservée entre plusieurs messages : on ne négocie pas une nouvelle ouverture pour chaque phrase. Elle peut néanmoins se fermer ou être interrompue. [API WebSocket — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

Imaginez une ligne ouverte entre Alex et le serveur : lorsqu’aucun utilisateur n’écrit, il n’est pas nécessaire de demander toutes les trois secondes si une nouveauté est apparue. Quand le serveur reçoit le message de Camille, il peut utiliser la connexion d’Alex pour le lui transmettre.

### Bidirectionnel, sans alternance imposée

Le client peut envoyer au serveur et le serveur peut envoyer au client sur la même connexion. C’est le sens de **bidirectionnel**. Les échanges n’ont pas à suivre un rythme « une demande, une réponse » : le serveur peut transmettre plusieurs nouveautés successives, et le navigateur peut envoyer pendant qu’il reçoit. On parle aussi de *full-duplex*. [Protocole WebSocket — RFC 6455, §1](https://www.rfc-editor.org/rfc/rfc6455.html#section-1).

```text
Navigateur d’Alex                         Serveur
        |──── demande d’ouverture ───────────>|
        |<─── ouverture acceptée ─────────────|
        |                                     |
        |<─── message de Camille ─────────────|
        |<─── autre message ──────────────────|
        |──── réponse d’Alex ────────────────>|
        |                                     |
        |       La connexion reste ouverte    |
```

Le serveur n’ouvre pas arbitrairement une connexion entrante vers Alex : **c’est le navigateur qui établit le canal initial**. Le serveur l’utilise ensuite pour transmettre les événements utiles.

### HTTP ne disparaît pas

Les fichiers HTML, CSS et JavaScript de notre interface restent chargés en HTTP. Ensuite, le code du navigateur établira une connexion WebSocket pour les échanges du chat. Il y a donc deux usages complémentaires dans la même application : charger l’interface et faire circuler les messages.

Dans le cas HTTP/1.1 de notre atelier, la négociation initiale demande au serveur de passer au protocole WebSocket : c’est le **handshake**. Après acceptation, les données circulent sous forme de messages WebSocket, portés par des trames, et non comme une succession de réponses HTTP. Le détail de cette ouverture sera observé en S2. [RFC 6455, §1.3 et §5](https://www.rfc-editor.org/rfc/rfc6455.html#section-1.3).

## 5. Deux utilisateurs, deux connexions

Une confusion fréquente consiste à imaginer un WebSocket commun à tous les navigateurs. Dans notre architecture, chaque client ouvre sa propre connexion au serveur.

```text
Navigateur de Camille  <==== connexion A ====>  Serveur
Navigateur d’Alex      <==== connexion B ====>  Serveur
Navigateur de Sam      <==== connexion C ====>  Serveur
```

Pour livrer le message de Camille à Alex, le serveur effectue deux opérations distinctes : recevoir sur A, puis envoyer sur B. Pour le transmettre aussi à Sam, il envoie également sur C. La diffusion à plusieurs utilisateurs est donc **un comportement à programmer**, pas une conséquence automatique du protocole.

Dans notre future S4, le serveur diffusera le message à tous les clients concernés, **émetteur inclus**. Cela permettra de prendre le message traité par le serveur comme référence d’affichage. Le frontend devra éviter de l’ajouter deux fois. La première version affichera ce retour serveur ; les états provisoires arriveront en S5.

Pensez aussi à ce qu’il se passe quand Alex ferme son onglet. Sa connexion ne peut plus servir à recevoir. Le serveur devra retirer cette connexion de son registre. Si Alex revient, il ouvrira une nouvelle connexion : l’historique et la récupération des messages manqués demanderaient un mécanisme supplémentaire.

## 6. Ce que WebSocket apporte, et ce qu’il faut construire

| Mécanisme | Qui s’en charge dans notre projet ? |
|---|---|
| Établir une connexion et transporter des messages dans les deux sens | Protocole et implémentations WebSocket |
| Réagir à une ouverture, un message ou une fermeture | Notre code, avec les événements de l’API native |
| Choisir les destinataires | Notre serveur, en S4 puis S7 |
| Réessayer après une coupure | Notre gestionnaire de reconnexion, en S5 |
| Confirmer le traitement d’un envoi | Notre échange de confirmation, en S5 |
| Refuser un contenu invalide ou un débit excessif | Notre serveur, en S6 |
| Conserver un historique durable | Prolongement hors parcours obligatoire |

L’API du navigateur expose notamment les événements `open`, `message`, `error` et `close`. Ils permettent au code de réagir à l’évolution de la connexion et aux données reçues. Vous les utiliserez à partir de la prochaine séquence. [Référence WebSocket — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

**Temps réel ne veut pas dire instantané.** En retirant l’attente du prochain sondage, nous améliorons la réactivité ; il reste des délais réseau et du temps de traitement. Une coupure peut aussi ne pas être détectée immédiatement. Ce sont précisément les situations étudiées en S5.

Il faut distinguer « j’ai déclenché l’envoi » et « le serveur l’a traité ». La méthode d’envoi place des données en attente de transmission ; elle ne renvoie pas une preuve de lecture par un utilisateur. Notre application devra produire ses propres confirmations. [Méthode `send()` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send).

### Notre choix technique

Dans le navigateur, nous utiliserons **l’API WebSocket native**, déjà disponible : aucun client Socket.IO à installer. Côté serveur, NestJS utilisera **`WsAdapter`**, qui s’appuie sur la bibliothèque `ws` et accepte les connexions natives du navigateur. « Natif » décrit ici le protocole et l’API du navigateur ; cela n’interdit pas une bibliothèque serveur. [Adaptateur `ws` de NestJS](https://docs.nestjs.com/websockets/adapter#ws-library).

**Repère sur Socket.IO.** Cette bibliothèque ajoute ses propres conventions et fonctionnalités. Elle n’est pas interchangeable avec un client WebSocket natif. Nous ne l’utiliserons pas dans les exercices. [Documentation Socket.IO](https://socket.io/docs/v4/).

## 7. Activité — Compléter le trajet d’un message

**Durée : 3 minutes, incluse dans le bloc de compréhension.** Les connexions sont déjà ouvertes. Camille écrit « Bonjour ». Complétez les cinq zones avec les propositions suivantes :

**affiche le message · connexion de Camille · reçoit et choisit les destinataires · connexion d’Alex · envoie le message**

```text
Navigateur de Camille               Serveur                 Navigateur d’Alex
[1. __________________]
          |
          |── [2. ________________] ──>|
                                       | [3. __________________________]
                                       |
                                       |── [4. ________________] ──>|
                                                                    | [5. _____________]
```

Puis répondez :

1. Alex doit-il refaire une requête HTTP pour chaque nouveau message du chat ?
2. Combien de connexions WebSocket relient ces deux navigateurs au serveur ?
3. Le protocole décide-t-il automatiquement de diffuser à tous les utilisateurs ?

Conservez votre schéma et vos réponses. Le corrigé est dans le fichier `03-corriges.md` ; consultez-le après votre tentative.

## 8. Lancer le projet

Suivez `04-installation-et-checklist.md`. En quinze minutes, vous allez récupérer le projet fourni, installer les dépendances, démarrer le frontend Vue et le backend NestJS, puis vérifier leurs adresses.

**Attention à ce que prouve cette étape :** afficher l’interface et obtenir la réponse HTTP de diagnostic du backend prouve que les deux services démarrent. Cela ne prouve pas encore que le navigateur est connecté au chat. Le branchement du client natif appartient à S2 ; les premiers messages à S3.

Les trois messages affichés dans l’interface sont des données de démonstration. Le formulaire ne les transmet pas. Cette limite est indiquée à l’écran.

## À retenir avant S2

Le navigateur établit une connexion WebSocket avec le serveur. Une fois ouverte, cette connexion permet à chacun d’envoyer sans attendre une nouvelle requête pour chaque message. Dans une messagerie, le serveur reçoit sur la connexion de l’émetteur, puis transmet sur celles des destinataires. Notre code définira la diffusion, les confirmations, la reconnexion et les salons.

**Validation de la séquence :** schéma complété et expliqué, frontend visible, backend répondant sur `/health`.

Si vous souhaitez approfondir dès maintenant la différence entre connexion, message et trame, consultez `07-approfondissement-websocket.md`. Ce complément ne s’ajoute pas au travail obligatoire des 45 minutes.
