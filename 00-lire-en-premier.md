# Séquence 2 — Ouvrir et gérer une connexion WebSocket

**Durée : environ 1 h 30.** Ce dossier prolonge `sequence-1-v2` et suit la scénarisation du parcours à sept séquences.

## Commencer ici

1. **01-cours-apprenant.md** — contenu à étudier : adresse, handshake HTTP/1.1, événements, état et fermeture.
2. **02-tp-guide.md** — réalisation de six TODO dans un seul fichier.
3. **03-fiche-reference.md** — aide à consulter pendant le code.
4. **04-tests-et-validation.md** — cinq scénarios et bilan de sortie.
5. **05-corrige-commente.md** — correction à consulter après tentative.
6. **06-guide-formateur.md** — déroulé sur 90 minutes, accompagnement et articulation avec le parcours.
7. **07-scripts-videos.md** — handshake, repérage en live coding et correction ; scripts à enregistrer.
8. **08-verifications.md** — contrôles réellement effectués sur les projets.

## Projets et distribution

- `projet-apprenant/` : interface fournie et six emplacements à compléter. Le squelette se compile mais ne se connecte pas avant réalisation du premier TODO.
- `projet-corrige/` : solution fonctionnelle de la séquence.
- `sequence-2-apprenant.bundle` : dépôt Git du squelette seul.
- `sequence-2-corrige.bundle` : dépôt Git séparé du corrigé.

L’archive complète est destinée au formateur : elle contient les solutions. Pour les apprenants, distribuer seulement le dossier ou bundle apprenant et les supports avant corrigé.

Depuis le dossier contenant le bundle :

```sh
git clone sequence-2-apprenant.bundle messagerie-sequence-2
cd messagerie-sequence-2
npm ci
```

Puis `npm run dev:back` et `npm run dev:front` dans deux terminaux. Node 24.x requis. Arrêter les services de S1 avant le démarrage ; les ports restent 3000 et 5173. Les instructions de reprise directe du dépôt S1 figurent dans le TP.

## Frontières pédagogiques

S1 répondait à « pourquoi ce protocole ? ». S2 répond à « comment ouvrir, observer et fermer cette connexion ? ». Les notions évoquées dans l’approfondissement facultatif S1 deviennent ici des manipulations et des diagnostics.

Le cours ne reprend pas la comparaison avec le polling ni le schéma de diffusion entre utilisateurs. Aucun envoi de contenu, traitement JSON, registre de clients, algorithme de reconnexion, confirmation métier ou salon n’est à programmer dans S2.

La partie réseau est une vérification brève dans le TP, pas une activité autonome de vingt minutes. L’écran de connexion remplace provisoirement le formulaire de chat pour isoler l’objectif de S2. Le serveur fourni reste celui de S1.

## État des livrables

Les cours sont éditables en Markdown. Les vidéos sont fournies comme scripts et déroulés de capture, sans enregistrement. Les dépôts Git sont locaux et clonables ; aucun dépôt distant n’a été publié. Les preuves et limites de test sont documentées dans le rapport de vérification.
