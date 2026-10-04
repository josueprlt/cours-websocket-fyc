# Kit pédagogique — Séquence 1

**Formation : Maîtriser le WebSocket au travers d’une application de messagerie instantanée**  
**Périmètre livré : première séquence « Onboarding & positionnement », 1 heure.**

## Contenu et ordre d’utilisation

1. **`01-cours-apprenant.md`** — cours rédigé, objectifs, exemples, atelier de lancement, dépannage et fiche mémo.
2. **`02-qcm-positionnement.md`** — 12 questions à distribuer sans corrigé, pour 10 minutes.
3. **`03-guide-formateur.md`** — préparation, déroulé de 60 minutes, notes d’animation, script vidéo de 337 mots, corrigé expliqué, remédiations et grille de validation. À conserver côté formateur.
4. **`front-statique/`** — sources Vue 3 / Tailwind CSS / Vite avec dépendances verrouillées.
5. **`front-statique.bundle`** — dépôt Git local clonable, branche `main`, tag `sequence-1`.
6. **`04-verifications.md`** — résultats et limites des vérifications réalisées.

Les supports sont en Markdown, modifiables dans un éditeur de texte et consultables dans les outils qui rendent ce format. Ils peuvent être repris dans votre LMS. Le QCM n’est pas un export configuré pour une plateforme particulière.

## Démarrage sans dépôt distant

Décompresser le kit, ouvrir un terminal dans le dossier `sequence-1`, puis :

```sh
git clone front-statique.bundle messagerie-websocket
cd messagerie-websocket
npm ci
npm run dev
```

Installer les dépendances demande un accès au registre npm. Prévoir Node.js 24 LTS et Git avant la séance. Le front contient uniquement des données fictives et une interaction locale explicitement signalée.

## Hypothèses pédagogiques retenues

- Public connaissant les bases de JavaScript et les principes du Web ; première découverte du temps réel.
- Formation accompagnée, adaptable au distanciel.
- Socket.IO retenu pour la suite pratique afin d’être cohérent avec `socket.id`, `broadcast.emit()` et `join()` présents dans le plan.
- Aucun backend ni échange métier à développer pendant cette première heure.

Le guide documente les adaptations à prévoir en séquence 3 pour ne pas mélanger Socket.IO et WebSocket natif. Le reste des séquences est présenté comme trajectoire, sans en développer les cours.

## Éléments à finaliser pour diffuser la formation

Le script vidéo est fourni, mais la vidéo n’est pas enregistrée. Le dépôt local est fourni et peut servir immédiatement au clonage ; aucun dépôt distant n’a été publié. Si vous voulez un hébergement Git partagé, publiez le projet dans votre espace habituel et remplacez l’emplacement `URL_DU_DEPOT` dans les consignes par l’adresse réelle. La séance peut aussi être animée directement à partir du script et du bundle local.

Les références techniques sont intégrées aux supports. Elles ont été consultées le 30 septembre 2026. Les versions directes du projet sont volontairement figées ; elles ne sont pas présentées comme les dernières versions disponibles.
