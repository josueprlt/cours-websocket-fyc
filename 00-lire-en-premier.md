# Séquence 1 — Version révisée WebSocket natif

Cette version remplace pédagogiquement le premier kit. Elle suit la scénarisation transmise le 3 octobre : **45 minutes pour S1, sept séquences et une évaluation/conclusion séparée ; environ 11 h 30 au total**. L’évaluation finale reste prévue avec 30 questions et leur correction, sans constituer une séquence de déploiement.

## Commencer par le cours

- **01-cours-apprenant.md** : cours réécrit, comparaison HTTP/polling/WebSocket, connexions individuelles, responsabilités serveur et schéma à compléter.
- **02-qcm-positionnement.md** : huit questions pour sept minutes de réponse.
- **03-corriges.md** : trois minutes de correction ciblée du QCM, plus correction du schéma après sa réalisation.
- **04-installation-et-checklist.md** : démarrage du frontend ET du backend en quinze minutes.
- **05-guide-formateur.md** : déroulé, validation et cohérence avec les séquences suivantes.
- **06-scripts-videos.md** : présentation de l’équipe à personnaliser, présentation du cours, storyboard de démonstration et courte vidéo explicative.
- **07-approfondissement-websocket.md** : complément sur connexion/message/trame, TCP/TLS, ouverture, états, confirmations et coupures.
- **08-verifications.md** : vérifications techniques réellement effectuées et périmètre.

## Ce qui change

| Première proposition | Version révisée |
|---|---|
| Socket.IO retenu pour les exercices | API WebSocket native + NestJS/WsAdapter/ws |
| S1 d’une heure | S1 d’environ 45 minutes |
| Front statique seul à lancer | Frontend et backend fournis et démarrés |
| Théorie courte, manipulation JSON développée | Théorie WebSocket renforcée ; manipulation JSON reportée à S3 |
| Modification du titre comme preuve | Schéma complété et checklist des deux services |
| Ancienne séquence de déploiement annoncée | Sept séquences puis évaluation et conclusion |

Socket.IO est seulement situé pour éviter une confusion de vocabulaire. Le QCM conserve une question simple de reconnaissance du JSON, conformément aux prérequis de la nouvelle scénarisation.

## Projet fourni

Le dossier `projet/` contient les sources et le verrouillage des dépendances. Le bundle `messagerie-native.bundle` permet un vrai clonage Git local. Aucun hébergement distant n’est nécessaire.

Depuis ce dossier, après décompression :

```sh
git clone messagerie-native.bundle messagerie-websocket
cd messagerie-websocket
npm ci
```

Puis `npm run dev:back` et `npm run dev:front` dans deux terminaux. Node 24.x requis.

Les connexions du frontend, échanges métier, confirmations, validations et salons restent à réaliser pendant les séquences prévues. Le backend est configuré pour accueillir le futur client natif, mais le starter ne constitue pas une messagerie cible complète.

## À préparer pour la diffusion

Les supports sont en Markdown, éditables et réutilisables dans le LMS. Les vidéos sont livrées sous forme de scripts et de storyboard, pas d’enregistrements. La présentation de l’équipe contient des champs à renseigner. Une vraie démonstration finale exige une version complète du projet détenue par le formateur ; le storyboard prévoit une alternative illustrée clairement signalée.

Les références techniques officielles sont liées aux explications. Le point sur la durée, les activités et les objectifs provient de la scénarisation fournie, pas de recommandations inventées pour élargir le programme.
