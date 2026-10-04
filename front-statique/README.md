# Le Salon — Front statique, séquence 1

Interface pédagogique Vue 3 / Tailwind CSS / Vite. Trois messages fictifs et un formulaire de démonstration locale. Aucun backend, aucune connexion métier, aucun stockage.

## Démarrage

Préparer Node.js 24 LTS, npm et Git. Depuis le dossier contenant ce fichier :

```sh
npm ci
npm run dev
```

Ouvrir l’URL affichée par Vite, généralement http://127.0.0.1:5173. Arrêt : Ctrl+C.

## Mission

Dans `src/App.vue`, modifier la valeur de `projectTitle`, enregistrer et vérifier le résultat. Repérer ensuite le tableau `messages`. Le bouton « Envoyer (démo) » affiche une information et ne modifie pas la conversation.

## Commandes supplémentaires

```sh
npm run build
npm run preview
```

La première produit `dist/`. La seconde sert cette compilation pour une vérification locale.

Les versions directes sont fixées et les dépendances transitives sont verrouillées dans `package-lock.json`. Ce socle pédagogique est volontairement stable ; il ne prétend pas utiliser les dernières versions disponibles. Le champ `engines` impose Node >=22.12, et `.nvmrc` indique le choix commun Node 24.

## Points d’attention pédagogiques

- Le serveur Vite sert le frontend ; le serveur NestJS sera construit ensuite.
- La connexion WebSocket de rechargement à chaud de Vite n’est pas celle du chat.
- L’interface affiche clairement son mode statique ; les auteurs et horaires sont fictifs.
- Le futur parcours utilise Socket.IO. Ne pas mélanger son client avec l’API WebSocket native.
- Aucun paquet Socket.IO n’est encore installé : ce travail appartient à la séquence 3.

## Distribution du dépôt

Le bundle `front-statique.bundle`, livré à côté des supports, contient ce projet avec un commit initial et le tag `sequence-1`.

```sh
git clone front-statique.bundle messagerie-websocket
cd messagerie-websocket
npm ci
npm run dev
```

Le chemin du bundle doit être adapté à l’endroit où il a été décompressé. Pour une distribution distante, le formateur restaure le bundle puis publie ce dépôt dans son hébergement Git habituel et communique l’URL réelle. Aucun hébergement distant n’est inclus dans le kit.
