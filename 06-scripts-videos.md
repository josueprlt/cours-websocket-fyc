# Scripts et storyboard — Séquence 1

Ces scripts sont destinés à l’enregistrement. Aucun fichier vidéo n’est inclus. Les durées sont des cibles de montage à confirmer par une lecture chronométrée. Fournir des sous-titres et conserver ces textes comme transcription.

## Bloc d’accueil — 5 minutes au total

### Capsule A · Présentation de l’équipe · environ 30 secondes

**À l’écran :** noms, rôles réels et moyen de contact de l’équipe. Les éléments entre crochets sont à compléter avant enregistrement ; aucune identité n’est supposée.

**Texte :**

« Bonjour, je suis [prénom], [rôle dans la formation]. Avec [équipe ou intervenants], nous vous accompagnerons dans la construction d’une messagerie instantanée. Pour poser une question ou signaler un blocage, utilisez [canal prévu]. Si une commande ne fonctionne pas, indiquez ce que vous avez lancé et le message obtenu. Nous allons maintenant découvrir le projet et le résultat que vous construirez progressivement. »

### Capsule B · Présentation du cours · environ 1 minute 30

**À l’écran :** titre, les sept séquences puis les trois résultats de S1.

**Texte :**

« Dans cette formation, vous allez comprendre et utiliser WebSocket au travers d’une messagerie instantanée. Notre point de départ sera une interface Vue déjà préparée et un serveur NestJS configuré. Vous concentrerez votre travail sur les échanges réseau et leur traitement.

Nous utiliserons l’API WebSocket native du navigateur. Vous ouvrirez une connexion, observerez son état et ferez circuler un premier message. Vous passerez ensuite à plusieurs utilisateurs, puis vous traiterez les coupures et les confirmations d’envoi. Le cas pratique principal consistera à contrôler les messages et à limiter les envois excessifs côté serveur. Enfin, vous séparerez les conversations en salons et testerez l’ensemble.

Aujourd’hui, trois résultats sont attendus : comprendre pourquoi ce projet utilise WebSocket, savoir expliquer le trajet d’un message et démarrer les deux services sur votre ordinateur. Vous commencerez par un court questionnaire de positionnement. Il vous aidera à identifier les bases à revoir.

À la fin de cette première étape, le frontend et le backend seront prêts. Le navigateur sera connecté au chat dans la séquence suivante. Prenons maintenant le temps de regarder le comportement que nous voulons construire. »

### Démonstration cible · environ 3 minutes

**Support requis :** une version fonctionnelle complète détenue par le formateur, avec deux ou trois fenêtres. Le starter S1 livré ne réalise pas cette démonstration. Si cette version n’est pas disponible, utiliser les mêmes scènes sous forme de maquettes et afficher « Scénario cible illustré » pendant toute la présentation.

| Temps | Action ou scène à montrer | Commentaire proposé |
|---|---|---|
| 00:00–00:40 | Camille envoie, Alex reçoit sans actualiser | « Nous voulons que les navigateurs affichent les nouveautés dès leur réception. Le serveur relaie les messages. » |
| 00:40–01:10 | Alex répond ; un troisième client reçoit | « Chaque fenêtre possède sa connexion. La diffusion est une décision du serveur. » |
| 01:10–01:50 | Interruption puis reprise du serveur ; état de connexion visible | « Le réseau peut couper. L’utilisateur doit comprendre l’incident et la reprise. » |
| 01:50–02:15 | Envoi avec confirmation retardée | « Ce statut décrit le traitement serveur, pas la lecture par une personne. » |
| 02:15–02:35 | Envoi invalide refusé | « Le serveur contrôle les données, même si quelqu’un contourne le formulaire. » |
| 02:35–03:00 | Clients dans #general et #dev | « Les échanges sont limités au salon actif. Nous terminerons par vérifier toutes ces fonctions ensemble. » |

Ne pas inclure de commandes `/color`, de conteneur ou de déploiement : ils ne figurent pas dans la nouvelle scénarisation.

## Capsule explicative — Pourquoi WebSocket ? · environ 2 minutes

Cette capsule intervient dans les quinze minutes de compréhension, après la lecture. Son rôle est de rendre visible le mécanisme, sans réciter le support entier.

| Repère | Visuel |
|---|---|
| 00:00–00:35 | Alex interroge à 0 s puis à 3 s ; message reçu par le serveur à 1 s |
| 00:35–01:05 | Ouverture d’un canal puis plusieurs échanges sans nouvelle interrogation |
| 01:05–01:40 | Deux connexions séparées et trajet Camille → serveur → Alex |
| 01:40–02:00 | Mots « transport », « destinataires », « confirmations » attribués au bon niveau |

**Texte de la voix off :**

« Alex regarde une conversation. Comment son navigateur sait-il qu’un nouveau message est arrivé ?

Avec un sondage périodique, il demande régulièrement au serveur s’il y a du nouveau. Ici, il pose la question toutes les trois secondes. Camille écrit juste après une réponse : Alex attendra la demande suivante pour voir son message. Interroger plus souvent réduit l’attente, mais multiplie les requêtes.

Avec WebSocket, le navigateur commence par ouvrir une connexion au serveur. Une fois ce canal établi, chacun peut envoyer des messages. Quand une nouveauté arrive, le serveur peut la transmettre sans attendre une nouvelle question d’Alex. Le même canal sert aussi aux réponses d’Alex.

Regardons maintenant les deux utilisateurs. Camille possède une connexion au serveur. Alex en possède une autre. Le message quitte le navigateur de Camille, arrive au serveur, puis repart sur la connexion d’Alex. C’est le code du serveur qui choisit ce destinataire.

WebSocket permet donc les échanges dans les deux sens, mais il ne construit pas toute la messagerie. Il reste à décider à qui transmettre, comment confirmer le traitement d’un envoi et comment reprendre après une coupure.

Complétez maintenant le schéma du cours. Identifiez les deux connexions et le rôle de chaque étape. »
