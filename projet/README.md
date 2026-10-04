# Messagerie WebSocket native — Starter S1

Socle fourni pour « Comprendre pourquoi une messagerie utilise WebSocket ».

- Frontend : Vue 3, Tailwind CSS, Vite ; données fictives et formulaire de démonstration locale.
- Backend : NestJS 11, `WsAdapter` et `ws` ; endpoint HTTP de diagnostic et gateway `/chat` sans gestionnaire métier.
- Client du chat : à implémenter par l’apprenant en S2 avec l’API native. Aucun Socket.IO.

## Préparer et lancer

Node.js **24.x**, npm et Git requis. À la racine :

```sh
npm ci
```

Terminal A :

```sh
npm run dev:back
```

Terminal B :

```sh
npm run dev:front
```

Ouvrir le frontend sur `http://127.0.0.1:5173` et le diagnostic du backend sur `http://127.0.0.1:3000/health`.

Le backend compile puis démarre ; il ne surveille pas les fichiers. Pour prendre en compte une modification, arrêter puis relancer. Arrêt de chaque service : Ctrl+C dans son terminal.

## Périmètre S1

Le front n’établit aucune connexion métier. Le point WebSocket `ws://127.0.0.1:3000/chat` est préparé pour la prochaine séquence. Le formulaire ne transmet et ne sauvegarde rien. Les messages affichés sont fictifs.

Le serveur écoute uniquement sur l’interface locale `127.0.0.1`. Les règles de validation, les confirmations et les salons seront construits pendant le parcours. Ce starter n’est pas une application de production.

## Compilation

```sh
npm run build
```

Cette commande compile les deux workspaces. Les dépendances directes sont figées et le verrouillage est fourni pour `npm ci`.

## Distribution

Le fichier `messagerie-native.bundle` livré avec les supports contient ce projet, sa branche `main` et le tag `sequence-1-native`. Depuis le dossier contenant le bundle :

```sh
git clone messagerie-native.bundle messagerie-websocket
```

Aucun hébergement distant n’est requis pour ce clonage. Les scripts d’installation ne sont pas des exercices de configuration NestJS ; leur code est fourni pour concentrer l’apprentissage sur WebSocket.
